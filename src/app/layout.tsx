import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Concourse LegalFlow | City of Irving Office of the City Attorney",
  description:
    "Legal Case and Document Management System for the City of Irving Office of the City Attorney — RFP 147C-26F.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
