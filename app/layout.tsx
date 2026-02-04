import type { ReactNode } from "react";

export const metadata = {
  title: "Shang Gold",
  description: "Gold-Linked Investment Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <meta name="theme-color" content="#d4af37" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body style={{ margin: 0, background: "#020617", color: "#fff" }}>
        <main style={{ paddingBottom: "80px" }}>{children}</main>
      </body>
    </html>
  );
}
