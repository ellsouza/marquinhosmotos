export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className ?? "h-5 w-5"}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5h.01" />
    </svg>
  );
}

export function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className ?? "h-5 w-5"}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2c-9.1-.9-16.4-8.2-17.3-17.3A2 2 0 0 1 4.5 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8.5 9.6a16 16 0 0 0 5.9 5.9l1.1-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2z" />
    </svg>
  );
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={className ?? "h-5 w-5"}
      style={{
        display: "inline-block",
        backgroundColor: "currentColor",
        WebkitMaskImage: "url(/img/whatsapp_icon_no_bg.png)",
        maskImage: "url(/img/whatsapp_icon_no_bg.png)",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );
}

export function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      className={className ?? "h-5 w-5"}
      fill="none"
    >
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303C33.819 32.659 29.206 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.049 6.053 29.261 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819C14.655 16.108 18.961 13 24 13c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.049 6.053 29.261 4 24 4c-7.682 0-14.366 4.337-17.694 10.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.101 0 9.79-1.955 13.333-5.127l-6.162-5.222C29.208 35.091 26.715 36 24 36c-5.185 0-9.788-3.317-11.282-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303c-.721 2.027-2.08 3.777-3.898 5.019l.003-.002 6.162 5.222C36.133 39.556 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}

export function AppleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className ?? "h-5 w-5"}
      fill="currentColor"
    >
      <path d="M16.86 12.61c.02-1.98 1.6-2.94 1.67-2.99-.91-1.34-2.33-1.53-2.83-1.55-1.2-.12-2.35.71-2.96.71-.6 0-1.54-.69-2.53-.67-1.3.02-2.5.76-3.16 1.93-1.35 2.34-.34 5.81.97 7.71.64.93 1.41 1.98 2.42 1.94.98-.04 1.35-.63 2.53-.63 1.18 0 1.51.63 2.54.61 1.05-.02 1.71-.95 2.35-1.88.73-1.07 1.03-2.11 1.05-2.16-.02-.01-2.01-.77-2.05-3.02Z" />
      <path d="M14.93 5.54c.53-.65.9-1.55.8-2.45-.77.03-1.69.52-2.24 1.16-.49.57-.93 1.49-.82 2.37.86.07 1.73-.44 2.26-1.08Z" />
    </svg>
  );
}

export function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className ?? "h-5 w-5"}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </svg>
  );
}

export function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className ?? "h-5 w-5"}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}
