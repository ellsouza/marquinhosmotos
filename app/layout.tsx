import type React from "react";

export const metadata = {
  title: "Marquinhos Motos",
  description: "Mecânica geral e peças para motos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
