export const metadata = {
  title: "Shang Gold",
  description: "Gold-Linked Investment Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Mobile App Feel */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <meta name="theme-color" content="#d4af37" />
        <link rel="manifest" href="/manifest.json" />
      </head>

      <body
        style={{
          margin: 0,
          backgroundColor: "#020617",
          color: "#ffffff",
        }}
      >
        {/* padding bottom مهم للـ Bottom Navigation */}
        <main style={{ paddingBottom: "80px" }}>
          {children}
        </main>
      </body>
    </html>
  );
}

