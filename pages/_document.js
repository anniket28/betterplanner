import { Html, Head, Main, NextScript } from "next/document";
import { Analytics } from "@vercel/analytics/next";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon */}
        <link rel="icon" type="image/png" href="/betterplanner.png" />
        <link rel="apple-touch-icon" type="image/png" href="/betterplanner.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
        <Analytics />
      </body>
    </Html>
  );
}
