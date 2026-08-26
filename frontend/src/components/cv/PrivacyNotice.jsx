import { Database, Lock, ShieldCheck, Trash2 } from "lucide-react";

const COLLECTED = [
  "Your name and email address.",
  "A bcrypt hash of your password — never the password itself.",
  "Timestamps: when the account was created, last signed in, and last accessed the CV.",
  "A count of how many times the CV has been accessed by your account.",
];

const NOT_COLLECTED = [
  "Phone number, postal address, or date of birth.",
  "Government or identity documents.",
  "Behavioural analytics or third-party tracking.",
];

/**
 * Privacy notice for the CV access feature.
 *
 * Every claim here is checked against the actual implementation
 * (backend/src/models/User.js and CvAccessLog.js). Keep them in sync.
 */
export function PrivacyNotice({ variant = "full" }) {
  if (variant === "compact") {
    return (
      <p className="text-xs text-muted-foreground leading-relaxed">
        Your name and email are stored securely in a private database to manage CV access.
        Passwords are hashed with bcrypt and never stored in plain text.
      </p>
    );
  }

  return (
    <div className="space-y-5 text-sm leading-relaxed">
      <section className="space-y-2">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Database className="w-4 h-4 text-primary" aria-hidden="true" />
          What is collected
        </h3>
        <ul className="space-y-1.5 text-muted-foreground">
          {COLLECTED.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-primary mt-0.5" aria-hidden="true">
                •
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-2">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <ShieldCheck className="w-4 h-4 text-primary" aria-hidden="true" />
          Why it is collected
        </h3>
        <p className="text-muted-foreground">
          Solely to manage authenticated access to my CV — creating your account, keeping you signed
          in, and recording that the CV was accessed. It is not used for marketing, not sold, and not
          shared with third parties.
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Lock className="w-4 h-4 text-primary" aria-hidden="true" />
          Where it is stored
        </h3>
        <p className="text-muted-foreground">
          In a private MongoDB Atlas database reachable only by this site's backend server. The
          browser never connects to the database directly. Your sign-in session is held in an
          HTTP-only cookie containing a cryptographically signed token, which scripts running on
          the page cannot read.
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">What is not collected</h3>
        <ul className="space-y-1.5 text-muted-foreground">
          {NOT_COLLECTED.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-muted-foreground/50 mt-0.5" aria-hidden="true">
                •
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground/80 pt-1">
          Your IP address is used only in transient memory to rate-limit sign-in attempts. It is
          never written to the database.
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Trash2 className="w-4 h-4 text-primary" aria-hidden="true" />
          Retention and removal
        </h3>
        <p className="text-muted-foreground">
          CV access log entries are deleted automatically after 180 days. Your account record is
          kept until you ask for it to be removed — email{" "}
          <a
            href="mailto:anupbubay9986@gmail.com?subject=Delete%20my%20CV%20access%20account"
            className="text-primary hover:underline"
          >
            anupbubay9986@gmail.com
          </a>{" "}
          and it will be deleted.
        </p>
      </section>
    </div>
  );
}

export default PrivacyNotice;
