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

    if (mode === "register" && form.password !== form.confirmPassword) {
      alert("As senhas não conferem.");
      return;
    }

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(data?.error ?? "Erro");
      return;
    }
    await refresh();
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    await refresh();
  }

  if (loading) return <div className="text-sm text-black/70">Carregando...</div>;

  if (!user) {
    return (
      <div className="mx-auto max-w-lg space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="text-sm text-black/70">
              Entre para acompanhar pedidos e facilitar o checkout.
            </p>
          </div>
          <WhatsAppCta label="Ajuda no WhatsApp" />
        </div>

        {oauthErrorLabel ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-black/80">
            {oauthErrorLabel}
          </div>
        ) : null}

        <div className="rounded-2xl border border-black/10 bg-white p-4">
          <div className="grid gap-2">
            <a
              href="/api/auth/oauth/google/start"
              className="mm-btn mm-btn-outline-dark w-full justify-center"
            >
              <GoogleIcon className="h-5 w-5" />
              Continuar com Google
            </a>
            <a
              href="/api/auth/oauth/apple/start"
              className="mm-btn mm-btn-outline-dark w-full justify-center"
            >
              <AppleIcon className="h-5 w-5" />
              Continuar com Apple
            </a>
          </div>
          <div className="mt-3 text-center text-xs text-black/60">
            Ou usar email e senha abaixo.
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={[
              "rounded-full px-4 py-2 text-sm font-semibold",
              mode === "login"
                ? "bg-black text-white"
                : "border border-black/15 bg-white text-black hover:bg-amber-50",
            ].join(" ")}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={[
              "rounded-full px-4 py-2 text-sm font-semibold",
              mode === "register"
                ? "bg-black text-white"
                : "border border-black/15 bg-white text-black hover:bg-amber-50",
            ].join(" ")}
          >
            Criar conta
          </button>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-6">
          <div className="grid gap-3">
            {mode === "register" ? (
              <>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Nome"
                  className="mm-input w-full"
                />
                <input
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="Telefone/WhatsApp"
                  className="mm-input w-full"
                />
              </>
            ) : null}
            <input
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="Email"
              className="mm-input w-full"
            />
            <input
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              placeholder={mode === "register" ? "Senha (mín. 8 caracteres)" : "Senha"}
              type="password"
              className="mm-input w-full"
            />
            {mode === "register" ? (
              <input
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm((f) => ({ ...f, confirmPassword: e.target.value }))
                }
                placeholder="Confirmar senha"
                type="password"
                className="mm-input w-full"
              />
            ) : null}
            <button
              type="button"
              onClick={() => submit().catch(() => {})}
              className="mm-btn mm-btn-primary mt-2 w-full"
            >
              {mode === "login" ? "Entrar" : "Criar conta"}
            </button>
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
