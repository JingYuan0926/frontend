import "@/styles/globals.css";
import { NextUIProvider } from "@nextui-org/react";
import WalletContextProvider from "@/components/WalletContextProvider";
import ParticleBackground from "@/components/ParticleBackground";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/react";

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      forcedTheme="dark"
    >
      <NextUIProvider>
        <WalletContextProvider>
          <div className="min-h-screen w-screen relative antialiased bg-gradient-to-br from-black to-black/90 overflow-x-hidden">
            <ParticleBackground />
            <div className="relative z-[1]">
              <main className="flex min-h-screen flex-col items-center">
                <Component {...pageProps} />
              </main>
            </div>
            <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
          </div>
          <Analytics />
        </WalletContextProvider>
      </NextUIProvider>
    </ThemeProvider>
  );
}
