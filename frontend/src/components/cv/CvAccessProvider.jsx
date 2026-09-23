import { createContext, lazy, Suspense, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { ApiError, buildApiUrl } from "@/lib/apiClient";
import { useAuth } from "@/context/AuthContext";
import { whenIdle } from "@/lib/idle";
import { CV_PHASES } from "./cvPhases";

// The modal (Radix Dialog + form + framer-motion) is not needed for the first
// paint. It is prefetched once the page is idle and mounted on first open.
const loadCvAuthModal = () => import("./CvAuthModal");
const CvAuthModal = lazy(() => loadCvAuthModal().then((module) => ({ default: module.CvAuthModal })));

/**
 * Owns the single CV access flow shared by every entry point (hero CTA, navbar,
 * mobile menu). One modal instance, one state machine — no duplicated logic.
 */
const CvAccessContext = createContext(null);

/**
 * Point a tab at the CV. A tab opened synchronously inside the click handler is
 * passed in when available, because opening one after an `await` is treated as
 * an unrequested popup and blocked.
 */
const navigateTab = (url, preOpenedTab) => {
  if (preOpenedTab && !preOpenedTab.closed) {
    preOpenedTab.location.replace(url);
    return true;
  }

  const tab = window.open(url, "_blank");
  if (!tab) return false;

  try {
    tab.opener = null;
  } catch {
    // Cross-origin tabs may refuse this; harmless either way.
  }
  return true;
};

export function CvAccessProvider({ children }) {
  const { isAuthenticated, requestCvTicket } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("signup");
  const [phase, setPhase] = useState(CV_PHASES.FORM);
  const [errorMessage, setErrorMessage] = useState("");
  const [ticket, setTicket] = useState(null);
  const [popupBlocked, setPopupBlocked] = useState(false);

  // Holds the blank tab opened during the click, before the ticket exists.
  const pendingTabRef = useRef(null);

  // Stays true after the first open so the dialog can play its close animation.
  const [modalMounted, setModalMounted] = useState(false);
  if (isOpen && !modalMounted) setModalMounted(true);

  useEffect(() => whenIdle(loadCvAuthModal, { timeout: 4000 }), []);

  const closePendingTab = () => {
    const tab = pendingTabRef.current;
    pendingTabRef.current = null;
    if (tab && !tab.closed) tab.close();
  };

  /** Final URLs for the protected endpoint. Only valid while the ticket lives. */
  const cvUrls = useMemo(() => {
    if (!ticket) return null;
    return {
      view: buildApiUrl("/cv", { ticket }),
      download: buildApiUrl("/cv", { ticket, download: "1" }),
    };
  }, [ticket]);

  /** Fetch a ticket and, when asked, send the pre-opened tab to the CV. */
  const grantAccess = useCallback(
    async ({ autoOpen = true } = {}) => {
      setPhase(CV_PHASES.GRANTING);
      setErrorMessage("");
      setPopupBlocked(false);

      try {
        const data = await requestCvTicket();
        setTicket(data.ticket);
        setPhase(CV_PHASES.SUCCESS);

        if (autoOpen) {
          const opened = navigateTab(buildApiUrl("/cv", { ticket: data.ticket }), pendingTabRef.current);
          pendingTabRef.current = null;
          setPopupBlocked(!opened);
        }

        return true;
      } catch (error) {
        closePendingTab();

        // Session gone — fall back to the sign-in form rather than a dead end.
        if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
          setMode("signin");
          setPhase(CV_PHASES.FORM);
          setErrorMessage("Your session has expired. Please sign in again.");
          return false;
        }

        setPhase(CV_PHASES.ERROR);
        setErrorMessage(error?.message || "Unable to authenticate. Please try again.");
        return false;
      }
    },
    [requestCvTicket]
  );

  /**
   * Entry point for every CV trigger. Must be called directly from a click
   * handler so the blank tab counts as user-initiated.
   */
  const requestCvAccess = useCallback(() => {
    setTicket(null);
    setErrorMessage("");
    setPopupBlocked(false);

    if (isAuthenticated) {
      // Reserve the tab now; it is filled in once the ticket returns.
      pendingTabRef.current = window.open("", "_blank");
      setIsOpen(true);
      grantAccess({ autoOpen: true });
      return;
    }

    setMode("signup");
    setPhase(CV_PHASES.FORM);
    setIsOpen(true);
  }, [isAuthenticated, grantAccess]);

  const closeCvAccess = useCallback(() => {
    closePendingTab();
    setIsOpen(false);
    setTicket(null);
    setErrorMessage("");
    setPopupBlocked(false);
    setPhase(CV_PHASES.FORM);
  }, []);

  const switchMode = useCallback((nextMode) => {
    setMode(nextMode);
    setPhase(CV_PHASES.FORM);
    setErrorMessage("");
  }, []);

  const value = useMemo(
    () => ({ requestCvAccess, closeCvAccess }),
    [requestCvAccess, closeCvAccess]
  );

  return (
    <CvAccessContext.Provider value={value}>
      {children}
      {modalMounted && (
        <Suspense fallback={null}>
          <CvAuthModal
            isOpen={isOpen}
            mode={mode}
            phase={phase}
            errorMessage={errorMessage}
            cvUrls={cvUrls}
            popupBlocked={popupBlocked}
            onClose={closeCvAccess}
            onSwitchMode={switchMode}
            onAuthenticated={() => grantAccess({ autoOpen: true })}
            onRetry={() => grantAccess({ autoOpen: false })}
            onError={setErrorMessage}
          />
        </Suspense>
      )}
    </CvAccessContext.Provider>
  );
}

export function useCvAccess() {
  const context = useContext(CvAccessContext);
  if (!context) {
    throw new Error("useCvAccess must be used within a <CvAccessProvider>.");
  }
  return context;
}
