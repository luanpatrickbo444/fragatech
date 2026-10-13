import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FragaTech — Sistema de Gestão Operacional v2.0",
  description: "Laboratório Prático de Gestão Operacional SENAI — Versão Melhorada",
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
