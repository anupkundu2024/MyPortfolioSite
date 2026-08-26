import { useEffect, useId, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ChevronDown,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  Loader2,
  Lock,
  LogOut,
} from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import { PrivacyNotice } from "./PrivacyNotice";

/**
 * Phases of the CV access flow. Declared here rather than in the provider so the
 * import graph stays one-directional (provider -> modal) with no cycle.
 */
export const CV_PHASES = {
  FORM: "form",
  GRANTING: "granting",
  SUCCESS: "success",
  ERROR: "error",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MIN_PASSWORD_LENGTH = 8;

const FIELD_CLASS =
  "w-full px-4 py-3 bg-background/60 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground text-sm transition-all duration-200";

const LABEL_CLASS =
  "block text-xs font-semibold uppercase tracking-wider text-foreground mb-2";

const COPY = {
  signup: {
    title: "Create an account to access the CV",
    description:
      "Download Anup Kundu's CV. A quick account keeps the file private while still being one click away.",
    submit: "Create account & get CV",
  },
  signin: {
    title: "Sign in to continue",
    description: "Welcome back — sign in to open Anup Kundu's CV.",
    submit: "Sign in & get CV",
  },
};

export function CvAuthModal({
  isOpen,
  mode,
  phase,
  errorMessage,
  cvUrls,
  popupBlocked,
  onClose,
  onSwitchMode,
  onAuthenticated,
  onRetry,
  onError,
}) {
  const { user, register, login, logout } = useAuth();
  const formId = useId();

  const [values, setValues] = useState({ name: "", email: "", password: "", consent: false });
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const firstFieldRef = useRef(null);

  // Reset the form whenever the modal closes so credentials never linger in state.
  useEffect(() => {
    if (isOpen) return;
    setValues({ name: "", email: "", password: "", consent: false });
    setFieldErrors({});
    setSubmitting(false);
    setPrivacyOpen(false);
  }, [isOpen]);

  // Clear the password when switching between sign-up and sign-in.
  useEffect(() => {
    setValues((previous) => ({ ...previous, password: "" }));
    setFieldErrors({});
  }, [mode]);

  const isSignup = mode === "signup";
  const copy = COPY[isSignup ? "signup" : "signin"];

  const setField = (field) => (event) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setValues((previous) => ({ ...previous, [field]: value }));
    setFieldErrors((previous) => ({ ...previous, [field]: undefined }));
  };

  const validate = () => {
    const errors = {};

    if (isSignup && values.name.trim().length < 2) {
      errors.name = "Please enter your name.";
    }
    if (!EMAIL_PATTERN.test(values.email.trim())) {
      errors.email = "Enter a valid email address.";
    }
    if (values.password.length < MIN_PASSWORD_LENGTH) {
      errors.password = `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
    }
    if (isSignup && !values.consent) {
      errors.consent = "Please agree before continuing.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting || !validate()) return;

    setSubmitting(true);
    onError("");

    try {
      if (isSignup) {
        await register({
          name: values.name.trim(),
          email: values.email.trim(),
          password: values.password,
          consent: values.consent,
        });
      } else {
        await login({ email: values.email.trim(), password: values.password });
      }

      // Drop the password from memory as soon as it is no longer needed.
      setValues((previous) => ({ ...previous, password: "" }));
      await onAuthenticated();
    } catch (error) {
      // 409 on sign-up means the account exists — steer to sign-in instead of a dead end.
      if (error?.status === 409) {
        onSwitchMode("signin");
        onError("That email is already registered. Please sign in.");
      } else {
        onError(error?.message || "Unable to authenticate. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const busy = submitting || phase === CV_PHASES.GRANTING;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-md w-[calc(100%-2rem)] sm:w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-[hsl(var(--glass-border)/0.35)] bg-[hsl(var(--card)/0.92)] backdrop-blur-2xl shadow-[0_24px_70px_-20px_hsla(280,100%,50%,0.45)] p-6 sm:p-7 gap-0"
        onOpenAutoFocus={(event) => {
          if (firstFieldRef.current) {
            event.preventDefault();
            firstFieldRef.current.focus();
          }
        }}
      >
        {/* Ambient theme glow, purely decorative */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/20 rounded-full blur-[90px]"
        />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          {phase === CV_PHASES.SUCCESS ? (
            <SuccessPanel
              user={user}
              cvUrls={cvUrls}
              popupBlocked={popupBlocked}
              onClose={onClose}
              onSignOut={async () => {
                await logout();
                onClose();
              }}
            />
          ) : phase === CV_PHASES.ERROR ? (
            <ErrorPanel message={errorMessage} onClose={onClose} onRetry={onRetry} />
          ) : phase === CV_PHASES.GRANTING ? (
            <GrantingPanel />
          ) : (
            <>
              <header className="text-center space-y-3 mb-6">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-[11px] font-semibold uppercase tracking-wider">
                  <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                  Curriculum Vitae
                </span>

                <DialogTitle className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
                  {copy.title}
                </DialogTitle>

                <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
                  {copy.description}
                </DialogDescription>
              </header>

              {errorMessage ? (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 mb-5 px-3.5 py-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm"
                >
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
                  <span>{errorMessage}</span>
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {isSignup ? (
                  <Field
                    id={`${formId}-name`}
                    label="Your Name"
                    error={fieldErrors.name}
                    inputRef={firstFieldRef}
                    inputProps={{
                      type: "text",
                      value: values.name,
                      onChange: setField("name"),
                      autoComplete: "name",
                      placeholder: "e.g. Sarah Jenkins",
                      maxLength: 80,
                      disabled: busy,
                    }}
                  />
                ) : null}

                <Field
                  id={`${formId}-email`}
                  label="Email Address"
                  error={fieldErrors.email}
                  inputRef={isSignup ? undefined : firstFieldRef}
                  inputProps={{
                    type: "email",
                    value: values.email,
                    onChange: setField("email"),
                    autoComplete: "email",
                    placeholder: "e.g. sarah@company.com",
                    maxLength: 254,
                    disabled: busy,
                  }}
                />

                <Field
                  id={`${formId}-password`}
                  label="Password"
                  error={fieldErrors.password}
                  hint={isSignup ? `At least ${MIN_PASSWORD_LENGTH} characters.` : undefined}
                  inputProps={{
                    type: "password",
                    value: values.password,
                    onChange: setField("password"),
                    autoComplete: isSignup ? "new-password" : "current-password",
                    placeholder: "••••••••",
                    minLength: MIN_PASSWORD_LENGTH,
                    maxLength: 128,
                    disabled: busy,
                  }}
                />

                {isSignup ? (
                  <div className="space-y-3 pt-1">
                    <PrivacyNotice variant="compact" />

                    <label
                      htmlFor={`${formId}-consent`}
                      className="flex items-start gap-3 cursor-pointer group"
                    >
                      <input
                        id={`${formId}-consent`}
                        type="checkbox"
                        checked={values.consent}
                        onChange={setField("consent")}
                        disabled={busy}
                        aria-invalid={Boolean(fieldErrors.consent)}
                        aria-describedby={fieldErrors.consent ? `${formId}-consent-error` : undefined}
                        className="mt-0.5 h-4 w-4 shrink-0 rounded border-border/70 bg-background/60 text-primary accent-[hsl(var(--primary))] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                      />
                      <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">
                        I agree to the collection of my name and email for CV access.
                      </span>
                    </label>

                    {fieldErrors.consent ? (
                      <p
                        id={`${formId}-consent-error`}
                        role="alert"
                        className="text-xs text-destructive pl-7"
                      >
                        {fieldErrors.consent}
                      </p>
                    ) : null}

                    <button
                      type="button"
                      onClick={() => setPrivacyOpen((open) => !open)}
                      aria-expanded={privacyOpen}
                      aria-controls={`${formId}-privacy`}
                      className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                    >
                      <span>{privacyOpen ? "Hide" : "Read"} the full privacy notice</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${privacyOpen ? "rotate-180" : ""}`}
                        aria-hidden="true"
                      />
                    </button>

                    {privacyOpen ? (
                      <div
                        id={`${formId}-privacy`}
                        className="rounded-xl border border-border/50 bg-background/50 p-4 max-h-64 overflow-y-auto"
                      >
                        <PrivacyNotice />
                      </div>
                    ) : null}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full btn-hero flex items-center justify-center gap-2 text-sm font-semibold py-3.5 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {busy ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                      <span>Please wait…</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" aria-hidden="true" />
                      <span>{copy.submit}</span>
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-xs text-muted-foreground mt-5">
                {isSignup ? "Already have an account?" : "Need an account?"}{" "}
                <button
                  type="button"
                  onClick={() => onSwitchMode(isSignup ? "signin" : "signup")}
                  disabled={busy}
                  className="font-semibold text-primary hover:text-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded disabled:opacity-60"
                >
                  {isSignup ? "Sign in" : "Create one"}
                </button>
              </p>
            </>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

function Field({ id, label, error, hint, inputProps, inputRef }) {
  const describedBy = [error ? `${id}-error` : null, hint ? `${id}-hint` : null]
    .filter(Boolean)
    .join(" ");

  return (
    <div>
      <label htmlFor={id} className={LABEL_CLASS}>
        {label} <span className="text-primary">*</span>
      </label>
      <input
        {...inputProps}
        id={id}
        ref={inputRef}
        required
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy || undefined}
        className={`${FIELD_CLASS} ${error ? "border-destructive/70 focus:ring-destructive" : ""}`}
      />
      {hint && !error ? (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground/80 mt-1.5">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs text-destructive mt-1.5">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function GrantingPanel() {
  return (
    <div className="py-10 text-center space-y-4">
      <Loader2 className="w-8 h-8 mx-auto text-primary animate-spin" aria-hidden="true" />
      <DialogTitle className="text-lg font-bold text-foreground">Verifying your session…</DialogTitle>
      <DialogDescription className="text-sm text-muted-foreground">
        Confirming access to the CV.
      </DialogDescription>
    </div>
  );
}

function SuccessPanel({ user, cvUrls, popupBlocked, onClose, onSignOut }) {
  return (
    <div className="text-center space-y-5">
      <div className="space-y-3">
        <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30">
          <CheckCircle2 className="w-7 h-7 text-emerald-400" aria-hidden="true" />
        </span>

        <DialogTitle className="text-xl font-extrabold tracking-tight text-foreground">
          CV access granted
        </DialogTitle>

        <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
          {popupBlocked
            ? "Your browser blocked the new tab. Use a button below to open or download the CV."
            : "The CV is opening in a new tab. You can also use the buttons below."}
        </DialogDescription>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href={cvUrls?.view}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 btn-hero flex items-center justify-center gap-2 text-sm font-semibold py-3.5"
        >
          <ExternalLink className="w-4 h-4" aria-hidden="true" />
          <span>Open CV</span>
        </a>

        <a
          href={cvUrls?.download}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 text-sm font-medium px-5 py-3.5 rounded-[var(--radius)] bg-secondary/70 hover:bg-secondary border border-border hover:border-primary/50 text-foreground hover:text-primary transition-all duration-200"
        >
          <Download className="w-4 h-4" aria-hidden="true" />
          <span>Download CV</span>
        </a>
      </div>

      <p className="text-xs text-muted-foreground/80 leading-relaxed">
        Opens in your browser's PDF viewer, where you can read, print, download, or save it.
      </p>

      <div className="flex items-center justify-between gap-3 pt-4 border-t border-border/40">
        {user ? (
          <p className="text-xs text-muted-foreground truncate text-left">
            Signed in as <span className="text-foreground font-medium">{user.email}</span>
          </p>
        ) : (
          <span />
        )}

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onSignOut}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-destructive transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1.5 py-1"
          >
            <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Sign out</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-primary hover:text-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1.5 py-1"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

function ErrorPanel({ message, onClose, onRetry }) {
  return (
    <div className="text-center space-y-5">
      <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-destructive/10 border border-destructive/30">
        <AlertCircle className="w-7 h-7 text-destructive" aria-hidden="true" />
      </span>

      <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
        Couldn't open the CV
      </DialogTitle>

      <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
        {message || "Please try again."}
      </DialogDescription>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => onRetry?.()}
          className="flex-1 btn-hero flex items-center justify-center gap-2 text-sm font-semibold py-3.5"
        >
          Try again
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 text-sm font-medium px-5 py-3.5 rounded-[var(--radius)] bg-secondary/70 hover:bg-secondary border border-border text-foreground transition-all duration-200"
        >
          Close
        </button>
      </div>

      <p className="text-xs text-muted-foreground/80">
        Still stuck? Email{" "}
        <a href="mailto:anupbubay9986@gmail.com" className="text-primary hover:underline">
          anupbubay9986@gmail.com
        </a>{" "}
        and I'll send the CV directly.
      </p>
    </div>
  );
}

export default CvAuthModal;
