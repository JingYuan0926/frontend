import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button, Card, CardBody } from "@nextui-org/react";
import HyperText from "@/components/ui/hyper-text";
import Marquee from "@/components/ui/marquee";
import { motion } from "framer-motion";
import { VelocityScroll } from "@/components/ui/scroll-based-velocity";
import { companies } from "@/data/companies";
import { testimonials } from "@/data/testimonials";
import Footer from "../components/Footer";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useInView } from "framer-motion";
import { useRef } from "react";
import NumberTicker from "@/components/ui/number-ticker";
import { BorderBeam } from "@/components/ui/border-beam";

const firstRow = testimonials.slice(0, testimonials.length / 2);
const secondRow = testimonials.slice(testimonials.length / 2);

// First, let's create a reusable styled header component
const SectionHeader = ({ children }) => (
  <motion.h2 
    className="text-3xl md:text-4xl font-bold mb-8 px-4 text-center bg-gradient-to-r from-purple-400 to-white bg-clip-text text-transparent hover:scale-105 transition-transform cursor-default"
    whileHover={{ y: -5 }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
  >
    {children}
  </motion.h2>
);

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

        {/* Add Scroll Indicator Arrow */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer z-10"
          animate={{ y: [0, 10, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg 
            width="40" 
            height="40" 
            viewBox="0 0 24 24" 
            fill="none" 
            className="text-white/50 hover:text-white/70 transition-colors"
          >
            <path 
              d="M7 10L12 15L17 10" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
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

      {/* Why Choose Us Section */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <SectionHeader>Why Choose Us</SectionHeader>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Transparent",
                description: "All donations are recorded on the Solana blockchain for complete transparency",
                icon: (
                  <motion.img 
                    src="/transparent.png"
                    alt="Transparent"
                    className="w-[220px] h-[220px] mx-auto mb-4"
                    animate={{ y: [-10, 10] }}
                    transition={{
                      repeat: Infinity,
                      repeatType: "reverse",
                      duration: 2
                    }}
                  />
                )
              },
              {
                title: "Secure",
                description: "Built on Solana's secure and fast blockchain technology",
                icon: (
                  <div className="w-[420px] h-[220px] mx-auto mb-4">
                    <DotLottieReact
                      src="https://lottie.host/53e25ad3-7bee-4e70-8671-0eb87bf4a124/ZsOGequA1R.lottie"
                      loop
                      autoplay
                    />
                  </div>
                )
              },
              {
                title: "Instant",
                description: "Donations are processed instantly with minimal transaction fees",
                icon: (
                  <motion.img 
                    src="/lightning.png"
                    alt="Instant"
                    className="w-[220px] h-[220px] mx-auto mb-4"
                    animate={{ y: [-10, 10] }}
                    transition={{
                      repeat: Infinity,
                      repeatType: "reverse",
                      duration: 2
                    }}
                  />
                )
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-black/40 backdrop-blur-md border-white/10">
                <CardBody className="text-center p-6">
                  {feature.icon}
                  <h3 className="text-2xl font-bold mb-2 text-white">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section with Marquee */}
      <section className="py-12 bg-black">
        <div className="container mx-auto">
          <SectionHeader>What Others Say</SectionHeader>
          
          <div className="mt-8">
            <Marquee pauseOnHover className="[--duration:40s]">
              {firstRow.map((review) => (
                <div
                  key={review.username}
                  className="mx-4 w-[300px] rounded-xl border border-purple-500/20 bg-black/50 p-4 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img
                        src={review.img}
                        alt={review.name}
                        className="h-full w-full rounded-full object-cover"
                      />
                    </div>
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
                    <div className="h-10 w-10 flex-shrink-0">
                      <img
                        src={review.img}
                        alt={review.name}
                        className="h-full w-full rounded-full object-cover"
                      />
                    </div>
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

      {/* Data Overview Section */}
      <section className="py-16 bg-black/95">
        <div className="container mx-auto">
          <SectionHeader>Data Overview</SectionHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto px-4">
            {[
              {
                label: "UNIQUE ACTIVE USERS",
                value: 2418127
              },
              {
                label: "DAILY ACTIVE USERS",
                value: 243384
              },
              {
                label: "TOTAL MONEY RAISED",
                value: 40007
              },
              {
                label: "TOTAL UNIQUE CHARITY",
                value: 72503
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="relative p-8 rounded-xl border border-purple-500/20 bg-black/50 backdrop-blur-sm overflow-hidden"
                whileHover={{ y: -5, borderColor: "rgba(168, 85, 247, 0.4)" }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-orange-400 text-sm font-mono mb-3 relative z-10">{stat.label}</p>
                <div className="text-5xl font-bold text-white mb-3 font-mono relative z-10">
                  {stat.label.includes("TOTAL MONEY RAISED") ? '+' : ''}
                  {stat.label.includes("DAILY ACTIVE USERS") ? '+' : ''}
                  <span className="text-white">
                    <NumberTicker value={stat.value} />
                  </span>
                  {stat.label.includes("TOTAL MONEY RAISED", "TOTAL UNIQUE CHARITY") ? 'M' : ''}
                </div>
                <BorderBeam 
                  size={300} 
                  duration={8} 
                  delay={index * 2}
                  colorFrom="#FF6B6B"  // Orange-red
                  colorVia="#4F46E5"   // Blue
                  colorTo="#9333EA"    // Purple
                  className="opacity-70"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section className="py-16 bg-black/90">
        <div className="container mx-auto">
          <SectionHeader>Companies That Use Us</SectionHeader>
          
          <Marquee pauseOnHover className="[--duration:40s]">
            {companies.map((company) => (
              <a 
                key={company.name}
                href={company.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-8 hover:opacity-75 transition-opacity"
              >
                <img
                  src={company.logo}
                  alt={company.name}
                  className="w-[220px] h-[220px] object-contain transition-all duration-300"
                />
              </a>
            ))}
          </Marquee>
        </div>
      </section>

      <Footer />
    </div>
    
  );
}