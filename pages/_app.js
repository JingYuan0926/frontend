import "@/styles/globals.css";
import { NextUIProvider } from "@nextui-org/react";
import WalletContextProvider from "@/components/WalletContextProvider";
import Navbar from "@/components/Navbar";
import ParticleBackground from "@/components/ParticleBackground";

export default function App({ Component, pageProps }) {
  return (
    <NextUIProvider className="dark text-foreground bg-background">
      <WalletContextProvider>
        <div className="min-h-screen dark relative">
          <ParticleBackground />
          <div className="relative z-[1]">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Component {...pageProps} />
            </main>
          </div>
        </div>
      </WalletContextProvider>
    </NextUIProvider>
  );
}
