export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <meta name="theme-color" content="#d4af37" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body style={{ margin: 0 }}>
        <main style={{ paddingBottom: "80px" }}>{children}</main>
      </body>
    </html>
  );
}
