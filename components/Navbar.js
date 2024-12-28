import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';

const WalletMultiButtonDynamic = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton),
  { ssr: false }
);

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className="fixed top-0 left-0 right-0 p-4 bg-black/40 backdrop-blur-sm border-b border-white/5 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-xl font-bold text-white/90 hover:text-white transition-colors">
            Donation dApp
          </Link>
          <div className="hidden sm:flex space-x-6">
          </div>
        </div>
        <WalletMultiButtonDynamic />
      </div>
    </nav>
  );
} 