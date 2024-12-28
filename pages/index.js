import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button, Card, CardBody } from "@nextui-org/react";

export default function Home() {
  const { connected } = useWallet();

  return (
    <div className="min-h-screen flex flex-col dark">
      {/* Hero Section with Video */}
      <section className="relative flex-1 flex flex-col items-center justify-center px-4 text-center min-h-[80vh]">
        {/* Video Background - Updated styling */}
        <div className="absolute inset-0 overflow-hidden z-[1]">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute min-w-full min-h-full object-cover w-auto h-auto top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <source src="/video.mp4" type="video/mp4" />
          </video>
        </div>


      </section>

      {/* Features Section - This will show particles */}
      <section className="relative py-16 bg-transparent z-[2]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Transparent",
                description: "All donations are recorded on the Solana blockchain for complete transparency"
              },
              {
                title: "Secure",
                description: "Built on Solana's secure and fast blockchain technology"
              },
              {
                title: "Instant",
                description: "Donations are processed instantly with minimal transaction fees"
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-black/40 backdrop-blur-md border-white/10">
                <CardBody className="text-center p-6">
                  <h3 className="text-2xl font-bold mb-2 text-white">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 bg-black/40 backdrop-blur-md z-[2]">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>© 2024 Donation dApp. Built on Solana.</p>
        </div>
      </footer>
    </div>
  );
}