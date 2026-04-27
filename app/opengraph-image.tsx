import { ImageResponse } from "next/og";
import { getStorePublicConfig } from "@/lib/store";

export const alt = "Marquinhos Motos — Peças e serviços";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  const store = getStorePublicConfig();

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          alignItems: "stretch",
          justifyContent: "center",
          background:
            "radial-gradient(900px 520px at 72% 20%, rgba(245,158,11,0.28), rgba(0,0,0,0) 60%), radial-gradient(800px 520px at 18% 78%, rgba(245,158,11,0.14), rgba(0,0,0,0) 62%), linear-gradient(135deg, #020617 0%, #09090b 60%, #0b0b10 100%)",
          color: "#ffffff",
          padding: "64px",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            borderRadius: 48,
            border: "1px solid rgba(255,255,255,0.12)",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
            padding: 56,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: "-0.01em",
                opacity: 0.92,
              }}
            >
              <span
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 999,
                  background: "#f59e0b",
                  boxShadow: "0 10px 24px rgba(245,158,11,0.35)",
                }}
              />
              {store.city}/{store.state}
            </div>

            <div
              style={{
                fontSize: 72,
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1.02,
                marginTop: 2,
              }}
            >
              {store.name}
            </div>

            <div
              style={{
                fontSize: 28,
                lineHeight: 1.3,
                opacity: 0.88,
                maxWidth: 880,
              }}
            >
              Peças e serviços para motos com atendimento rápido. Orçamento direto no
              WhatsApp.
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {[
                "Orçamento no WhatsApp",
                "Retirada na loja",
                "Entrega (consulte)",
              ].map((text) => (
                <div
                  key={text}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    borderRadius: 999,
                    border: "1px solid rgba(255,255,255,0.16)",
                    background: "rgba(255,255,255,0.06)",
                    padding: "10px 16px",
                    fontSize: 18,
                    fontWeight: 700,
                    opacity: 0.95,
                  }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 999,
                      background: "rgba(245,158,11,1)",
                    }}
                  />
                  {text}
                </div>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 18,
                fontSize: 18,
                opacity: 0.8,
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ fontWeight: 800, opacity: 0.95 }}>Endereço</div>
                <div>{store.address}</div>
              </div>
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: 18,
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "rgba(255,255,255,0.05)",
                  fontWeight: 800,
                }}
              >
                {store.phone}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
