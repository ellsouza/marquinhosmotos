import { Suspense } from "react";
import ContaClient from "./conta-client";

export default function ContaPage() {
  return (
    <Suspense fallback={<div className="text-sm text-black/70">Carregando...</div>}>
      <ContaClient />
    </Suspense>
  );
}

