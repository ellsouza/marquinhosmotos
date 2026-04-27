"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { formatBRL } from "@/lib/money";
import { WhatsAppCta } from "@/components/store/whatsapp-cta";
import { AppleIcon, GoogleIcon } from "@/components/icons/icons";

type User = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: "CUSTOMER" | "ADMIN";
};

type Order = {
  id: string;
  status: "PENDING" | "PAID" | "CANCELED";
  totalCents: number;
  createdAt: string;
  items: {
    id: string;
    quantity: number;
    unitPriceCents: number;
    nameSnapshot: string;
  }[];
};

export default function ContaClient() {
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<{
    name?: string;
    phone?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
  });

  const title = useMemo(
    () => (user ? `Olá${user.name ? `, ${user.name}` : ""}` : "Sua conta"),
    [user],
  );

  const oauthError = searchParams?.get("error");
  const oauthErrorLabel = useMemo(() => {
    if (!oauthError) return null;
    const map: Record<string, string> = {
      db_disabled: "Login indisponível (banco desativado no momento).",
      google_not_configured: "Login com Google ainda não está configurado.",
      apple_not_configured: "Login com Apple ainda não está configurado.",
      google_token_exchange_failed: "Falha ao autenticar com Google. Tente novamente.",
      apple_token_exchange_failed: "Falha ao autenticar com Apple. Tente novamente.",
      google_invalid_callback: "Resposta inválida do Google. Tente novamente.",
      apple_invalid_callback: "Resposta inválida da Apple. Tente novamente.",
      google_state_mismatch: "Sessão de login expirada. Tente novamente.",
      apple_state_mismatch: "Sessão de login expirada. Tente novamente.",
      apple_email_required:
        "Não foi possível concluir com Apple sem email. Tente novamente e autorize o compartilhamento do email.",
    };
    return map[oauthError] ?? "Não foi possível concluir o login social.";
  }, [oauthError]);

  function resetErrors() {
    setSubmitError(null);
    setFieldError({});
  }

  function onSwitchMode(next: "login" | "register") {
    setMode(next);
    resetErrors();
    setShowPassword(false);
    setShowConfirmPassword(false);
    setForm((f) => ({
      ...f,
      password: "",
      confirmPassword: "",
    }));
  }

  function validate() {
    const nextFieldError: typeof fieldError = {};

    const email = form.email.trim();
    if (!email) nextFieldError.email = "Informe o email.";

    if (!form.password) nextFieldError.password = "Informe a senha.";

    if (mode === "register") {
      if (form.password.length > 0 && form.password.length < 8) {
        nextFieldError.password = "A senha deve ter no mínimo 8 caracteres.";
      }
      if (!form.confirmPassword) {
        nextFieldError.confirmPassword = "Confirme a senha.";
      } else if (form.password !== form.confirmPassword) {
        nextFieldError.confirmPassword = "As senhas não conferem.";
      }
    }

    setFieldError(nextFieldError);
    return Object.keys(nextFieldError).length === 0;
  }

  async function refresh() {
    setLoading(true);
    try {
      const me = await fetch("/api/me", { cache: "no-store" }).then((r) => r.json());
      setUser(me.user ?? null);
      if (me.user) {
        const o = await fetch("/api/orders", { cache: "no-store" }).then((r) =>
          r.ok ? r.json() : { orders: [] },
        );
        setOrders(o.orders ?? []);
      } else {
        setOrders([]);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let alive = true;
    Promise.resolve().then(() => {
      if (!alive) return;
      refresh().catch(() => {});
    });
    return () => {
      alive = false;
    };
  }, []);

  async function submit() {
    resetErrors();
    if (!validate()) return;

    setSubmitting(true);
    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
    const payload =
      mode === "login"
        ? { email: form.email, password: form.password }
        : {
            email: form.email,
            password: form.password,
            confirmPassword: form.confirmPassword,
            name: form.name,
            phone: form.phone,
          };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          typeof data?.error === "string" ? data.error : "Não foi possível concluir.";
        setSubmitError(msg);
        return;
      }
      await refresh();
    } finally {
      setSubmitting(false);
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    await refresh();
  }

  if (loading) return <div className="text-sm text-black/70">Carregando...</div>;

  if (!user) {
    return (
      <div className="mx-auto max-w-xl space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="text-sm text-black/70">
              Entre para acompanhar pedidos e facilitar o checkout.
            </p>
          </div>
          <WhatsAppCta label="Ajuda no WhatsApp" />
        </div>

        {oauthErrorLabel || submitError ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-black/80">
            {oauthErrorLabel ?? submitError}
          </div>
        ) : null}

        <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
          <div className="border-b border-black/10 bg-zinc-50 p-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onSwitchMode("login")}
                className={[
                  "rounded-2xl px-4 py-3 text-sm font-semibold transition",
                  mode === "login"
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-amber-50 border border-black/10",
                ].join(" ")}
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={() => onSwitchMode("register")}
                className={[
                  "rounded-2xl px-4 py-3 text-sm font-semibold transition",
                  mode === "register"
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-amber-50 border border-black/10",
                ].join(" ")}
              >
                Criar conta
              </button>
            </div>
          </div>

          <div className="space-y-5 p-6">
            <div className="space-y-3">
              <div>
                <div className="text-sm font-semibold">Acesso rápido</div>
                <div className="mt-1 text-xs text-black/60">
                  Entrar com um provedor evita senha e agiliza o acesso.
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <a
                  href="/api/auth/oauth/google/start"
                  className="mm-btn mm-btn-outline-dark w-full justify-center"
                >
                  <GoogleIcon className="h-5 w-5 shrink-0" />
                  Google
                </a>
                <a
                  href="/api/auth/oauth/apple/start"
                  className="mm-btn mm-btn-outline-dark w-full justify-center"
                >
                  <AppleIcon className="h-5 w-5 shrink-0" />
                  Apple
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-black/10" />
              <div className="text-xs font-semibold text-black/50">OU</div>
              <div className="h-px flex-1 bg-black/10" />
            </div>

            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                submit().catch(() => {});
              }}
            >
              {mode === "register" ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <div className="text-xs font-semibold text-black/70">
                      Nome <span className="font-normal text-black/50">(opcional)</span>
                    </div>
                    <input
                      value={form.name}
                      onChange={(e) => {
                        const v = e.target.value;
                        setForm((f) => ({ ...f, name: v }));
                        resetErrors();
                      }}
                      placeholder="Ex.: Marcos"
                      autoComplete="name"
                      className="mm-input w-full"
                    />
                    {fieldError.name ? (
                      <div className="text-xs text-red-600">{fieldError.name}</div>
                    ) : null}
                  </div>
                  <div className="space-y-1.5">
                    <div className="text-xs font-semibold text-black/70">
                      WhatsApp <span className="font-normal text-black/50">(opcional)</span>
                    </div>
                    <input
                      value={form.phone}
                      onChange={(e) => {
                        const v = e.target.value;
                        setForm((f) => ({ ...f, phone: v }));
                        resetErrors();
                      }}
                      placeholder="(11) 99999-9999"
                      autoComplete="tel"
                      className="mm-input w-full"
                    />
                    {fieldError.phone ? (
                      <div className="text-xs text-red-600">{fieldError.phone}</div>
                    ) : null}
                  </div>
                </div>
              ) : null}

              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-black/70">Email</div>
                <input
                  value={form.email}
                  onChange={(e) => {
                    const v = e.target.value;
                    setForm((f) => ({ ...f, email: v }));
                    resetErrors();
                  }}
                  placeholder="email@exemplo.com"
                  type="email"
                  autoComplete="email"
                  className="mm-input w-full"
                  aria-invalid={fieldError.email ? true : undefined}
                />
                {fieldError.email ? (
                  <div className="text-xs text-red-600">{fieldError.email}</div>
                ) : null}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-black/70">
                    Senha{mode === "register" ? " (mín. 8 caracteres)" : ""}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={form.password}
                      onChange={(e) => {
                        const v = e.target.value;
                        setForm((f) => ({ ...f, password: v }));
                        resetErrors();
                      }}
                      placeholder={mode === "register" ? "Crie uma senha" : "Digite a senha"}
                      type={showPassword ? "text" : "password"}
                      autoComplete={mode === "register" ? "new-password" : "current-password"}
                      className="mm-input w-full"
                      aria-invalid={fieldError.password ? true : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="mm-btn mm-btn-ghost px-3"
                      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {showPassword ? "Ocultar" : "Mostrar"}
                    </button>
                  </div>
                  {fieldError.password ? (
                    <div className="text-xs text-red-600">{fieldError.password}</div>
                  ) : null}
                </div>

                {mode === "register" ? (
                  <div className="space-y-1.5">
                    <div className="text-xs font-semibold text-black/70">Confirmar senha</div>
                    <div className="flex gap-2">
                      <input
                        value={form.confirmPassword}
                        onChange={(e) => {
                          const v = e.target.value;
                          setForm((f) => ({ ...f, confirmPassword: v }));
                          resetErrors();
                        }}
                        placeholder="Repita a senha"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        className="mm-input w-full"
                        aria-invalid={fieldError.confirmPassword ? true : undefined}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        className="mm-btn mm-btn-ghost px-3"
                        aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
                      >
                        {showConfirmPassword ? "Ocultar" : "Mostrar"}
                      </button>
                    </div>
                    {fieldError.confirmPassword ? (
                      <div className="text-xs text-red-600">{fieldError.confirmPassword}</div>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mm-btn mm-btn-primary w-full py-3"
              >
                {submitting ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
              </button>

              <div className="text-center text-xs text-black/60">
                Ao continuar, os dados serão usados apenas para autenticação e acompanhamento de
                pedidos.
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <div className="text-sm text-black/70">{user.email}</div>
        </div>
        <button
          type="button"
          onClick={() => logout().catch(() => {})}
          className="mm-btn mm-btn-ghost"
        >
          Sair
        </button>
      </div>

      <div className="rounded-2xl border border-black/10 bg-white p-6">
        <div className="text-sm font-semibold">Pedidos</div>
        {orders.length === 0 ? (
          <div className="mt-2 text-sm text-black/70">Nenhum pedido ainda.</div>
        ) : (
          <div className="mt-4 space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="rounded-2xl border border-black/10 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm font-semibold">#{o.id}</div>
                  <div className="text-sm">{formatBRL(o.totalCents)}</div>
                </div>
                <div className="mt-1 text-xs text-black/60">
                  Status: {o.status} • {new Date(o.createdAt).toLocaleString("pt-BR")}
                </div>
                <ul className="mt-3 space-y-1 text-sm text-black/70">
                  {o.items.map((i) => (
                    <li key={i.id}>
                      {i.quantity}x {i.nameSnapshot}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
