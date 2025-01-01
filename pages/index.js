import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button, Card, CardBody } from "@nextui-org/react";
import HyperText from "@/components/ui/hyper-text";
import Marquee from "@/components/ui/marquee";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Vitalik Buterin",
    username: "@VitalikButerin",
    body: "Amazing to see such innovative donation platforms being built on blockchain.",
    img: "https://avatar.vercel.sh/vitalik"
  },
  {
    name: "Anatoly Yakovenko",
    username: "@aeyakovenko",
    body: "This is exactly what we envisioned for Solana - fast, efficient donation systems.",
    img: "https://avatar.vercel.sh/anatoly"
  },
  {
    name: "Raj Gokal",
    username: "@RajGokal",
    body: "The future of charitable giving is here. Transparent and instant.",
    img: "https://avatar.vercel.sh/raj"
  },
  {
    name: "SBF",
    username: "@SBF_FTX",
    body: "Revolutionary approach to charitable donations on Solana.",
    img: "https://avatar.vercel.sh/sbf"
  }
];

const firstRow = testimonials.slice(0, testimonials.length / 2);
const secondRow = testimonials.slice(testimonials.length / 2);

export default function Home() {
  return (
    <div className="flex flex-col overflow-x-hidden">
      {/* Hero Section - Video Only */}
      <section className="relative h-screen w-screen overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-screen h-screen object-cover"
          style={{ minWidth: '100vw', minHeight: '100vh' }}
        >
          <source src="/video.mp4" type="video/mp4" />
        </video>
      </section>

      {/* Text Reveal Section */}
      <section className="relative w-full bg-black/90 flex flex-col items-center justify-center py-20">
        <div className="max-w-[1200px] mx-auto text-center">
          <div className="text-4xl md:text-6xl font-bold">
            <HyperText
              className="bg-gradient-to-r from-purple-400 to-white bg-clip-text text-transparent"
              duration={800}
              delay={0}
              startOnView={true}
              animateOnHover={true}
            >
              The Future of Charitable Giving on Solana
            </HyperText>
          </div>
          
          {/* Magic UI Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-[2] mt-8"
          >
            <Link href="/donate">
              <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-8 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                  Start Donating Now
                </span>
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 bg-black">
        <div className="container mx-auto">
          <div className="max-w-[1200px] mx-auto mb-8">
            
          </div>
          
          <div className="mt-8">
            <Marquee pauseOnHover className="[--duration:40s]">
              {firstRow.map((review) => (
                <div
                  key={review.username}
                  className="mx-4 w-[300px] rounded-xl border border-purple-500/20 bg-black/50 p-4 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={review.img}
                      alt={review.name}
                      className="h-10 w-10 rounded-full"
                    />
                    <div>
                      <h3 className="text-white font-medium">{review.name}</h3>
                      <p className="text-purple-300 text-sm">{review.username}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-300">{review.body}</p>
                </div>
              ))}
            </Marquee>
            
            <Marquee pauseOnHover reverse className="[--duration:40s]">
              {secondRow.map((review) => (
                <div
                  key={review.username}
                  className="mx-4 w-[300px] rounded-xl border border-purple-500/20 bg-black/50 p-4 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={review.img}
                      alt={review.name}
                      className="h-10 w-10 rounded-full"
                    />
                    <div>
                      <h3 className="text-white font-medium">{review.name}</h3>
                      <p className="text-purple-300 text-sm">{review.username}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-300">{review.body}</p>
                </div>
              ))}
            </Marquee>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-12 bg-transparent z-[2]">
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
    </div>
  );
}