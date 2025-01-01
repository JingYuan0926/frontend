import { useEffect, useState } from "react";
import { Connection, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL, SystemProgram } from "@solana/web3.js";
import { Program, AnchorProvider, BN, web3 } from "@project-serum/anchor";
import { useWallet } from '@solana/wallet-adapter-react';
import { Button, Card, CardBody, Input, Progress, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import IDL from "../public/idl.json";
import { FiExternalLink } from 'react-icons/fi';
import Lottie from "lottie-react";
import successAnimation from "../public/lottie.json";
import Navbar from "../components/Navbar";
import dynamic from 'next/dynamic';
const ParticleBackground = dynamic(() => import('@/components/ParticleBackground'), { ssr: false });

const PROGRAM_ID = new PublicKey("HPHXtE7dhKP8R1iANQeTZiSFpYcpzmqjBz1CTTunfj4K");

export default function DonationApp() {
  const wallet = useWallet();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [contributions, setContributions] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");

  // Campaign details
  const campaignGoal = 1000; // 1000 SOL
  const currentAmount = contributions.reduce((acc, record) =>
    acc + (record.amount.toNumber() / LAMPORTS_PER_SOL), 0);
  const progressPercentage = (currentAmount / campaignGoal) * 100;

  useEffect(() => {
    if (wallet.connected) {
      fetchContributionEvents();
    }
  }, [wallet.connected]);

  const getProgram = () => {
    const connection = new Connection(clusterApiUrl("devnet"));
    const provider = new AnchorProvider(connection, wallet, {
      preflightCommitment: "processed",
    });
    return new Program(IDL, PROGRAM_ID, provider);
  };

  const fetchContributionEvents = async () => {
    try {
      const connection = new Connection(clusterApiUrl("devnet"));
      const signatures = await connection.getSignaturesForAddress(PROGRAM_ID, { limit: 10 });

      const contributionEvents = [];

      for (const sig of signatures) {
        const tx = await connection.getParsedTransaction(sig.signature);
        if (!tx?.meta?.logMessages) continue;

        for (const log of tx.meta.logMessages) {
          if (log.includes("DONATION_EVENT:")) {
            const [, eventData] = log.split("DONATION_EVENT: ");
            const matches = eventData.match(/donor=(.*), amount=(.*), timestamp=(.*)/);

            if (matches) {
              contributionEvents.push({
                donor: new PublicKey(matches[1]),
                amount: new BN(matches[2]),
                timestamp: parseInt(matches[3]),
                signature: sig.signature
              });
            }
          }
        }
      }

      setContributions(contributionEvents);
    } catch (error) {
      console.error("Error fetching contribution events:", error);
    }
  };

  const contribute = async () => {
    if (!amount || !wallet.connected) return;

    setLoading(true);
    try {
      const program = getProgram();
      const contributionAmount = new BN(parseFloat(amount) * LAMPORTS_PER_SOL);

      // Get the PDA for the vault
      const [vaultPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("donation_vault")],
        PROGRAM_ID
      );

      const tx = await program.methods
        .recordDonation(contributionAmount)
        .accounts({
          donor: wallet.publicKey,
          vault: vaultPDA,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      setAmount("");
      setTransactionHash(tx);
      setShowSuccessModal(true);
      await fetchContributionEvents();
    } catch (error) {
      console.error("Error recording contribution:", error);
      alert("Error recording contribution. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 z-0">
        <ParticleBackground />
      </div>
      <div className="relative z-10">
        <Navbar/>
        <div className="flex flex-col gap-8 items-center pt-20 px-4 pb-24">
          <div className="w-full max-w-[1400px] space-y-8">
            <div className="relative w-full h-[500px] rounded-xl overflow-hidden">
              <img
                src="/spacex.png"
                alt="SpaceX Falcon Heavy Launch"
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  objectPosition: 'center 40%'
                }}
              />
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold text-white">SpaceX Starship Development Fund</h1>
                <p className="text-gray-300 leading-relaxed text-lg">
                  Help SpaceX revolutionize space travel with the development of Starship,
                  the most powerful rocket ever built. Your contribution will directly support
                  the advancement of reusable rocket technology and humanity's journey to Mars.
                </p>

                <div className="relative p-[1px] rounded-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 animate-pulse" />
                  <div className="relative backdrop-blur-sm rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white">Raised</span>
                      <span className="text-white font-semibold">{currentAmount.toFixed(5)} SOL of {campaignGoal} SOL</span>
                    </div>
                    <Progress
                      value={progressPercentage}
                      className="h-3"
                      classNames={{
                        indicator: "bg-gradient-to-r from-pink-500 to-yellow-500"
                      }}
                    />
                    <div className="flex gap-8 text-sm text-gray-300 pt-2">
                      <div className="flex gap-2">
                        <span>Contributors</span>
                        <span className="text-white">{contributions.length}</span>
                      </div>
                      <div className="flex gap-2">
                        <span>Days Left</span>
                        <span className="text-white">12</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {wallet.connected ? (
                <div className="relative p-[1px] rounded-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 animate-pulse" />
                  <Card className="relative backdrop-blur-sm border-0">
                    <CardBody className="p-6">
                      <h2 className="text-xl font-bold text-white mb-4">Support This Project</h2>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          value={amount}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Remove any non-numeric characters except decimal point
                            const numericValue = value.replace(/[^\d.]/g, '');
                            
                            // Ensure only one decimal point
                            const parts = numericValue.split('.');
                            if (parts.length > 2) {
                              return;
                            }
                            
                            setAmount(numericValue);
                          }}
                          placeholder="Amount in SOL"
                          endContent={
                            <div className="pointer-events-none flex items-center">
                              <span className="text-default-400 text-small">SOL</span>
                            </div>
                          }
                          className="flex-1"
                          classNames={{
                            input: "bg-black/20 text-white",
                            inputWrapper: "bg-black/20 border-white/20"
                          }}
                        />
                        <Button
                          onClick={contribute}
                          disabled={loading || !amount || parseFloat(amount) <= 0}
                          className={`text-white font-semibold ${
                            loading || !amount || parseFloat(amount) <= 0
                              ? "bg-gradient-to-tr from-pink-900 to-yellow-900 opacity-50 cursor-not-allowed"
                              : "bg-gradient-to-tr from-pink-500 to-yellow-500"
                          }`}
                          isLoading={loading}
                        >
                          {loading ? "Processing..." : "Contribute"}
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              ) : (
                <Card className="backdrop-blur-md border border-white/10">
                  <CardBody className="text-center py-8 px-12">
                    <p className="text-white mb-2">Please connect your wallet to contribute</p>
                    <span className="text-gray-400 text-sm">
                      Click the "Select Wallet" button above
                    </span>
                  </CardBody>
                </Card>
              )}

              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white">Recent Contributors</h2>
                {contributions.length === 0 ? (
                  <Card className="backdrop-blur-md border border-white/10">
                    <CardBody>
                      <p className="text-gray-400 text-center">No contributions yet. Be the first!</p>
                    </CardBody>
                  </Card>
                ) : (
                  <div className="space-y-2">
                    {contributions.map((record, index) => (
                      <Card key={index} className="backdrop-blur-md border border-white/10">
                        <CardBody className="p-4">
                          <div className="flex justify-between items-center">
                            <div className="truncate">
                              <span className="text-gray-400">Contributor: </span>
                              <span className="text-white">
                                {record.donor.toString().slice(0, 4)}...
                                {record.donor.toString().slice(-4)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-white font-semibold">
                                {(record.amount.toString() / LAMPORTS_PER_SOL).toFixed(5)} SOL
                              </span>
                              <a
                                href={`https://explorer.solana.com/tx/${record.signature}?cluster=devnet`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition-colors"
                              >
                                <FiExternalLink className="w-4 h-4" />
                              </a>
                            </div>
                          </div>
                          <div className="text-sm text-gray-400 mt-1">
                            {new Date(record.timestamp * 1000).toLocaleString()}
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                    <div className="h-12"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Modal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)}
        size="md"
        hideCloseButton={true}
        isDismissable={false}
        classNames={{
          backdrop: "backdrop-blur-sm",
          base: "border border-white/20 bg-black",
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 text-white">
            Transaction Successful
          </ModalHeader>
          <ModalBody className="flex flex-col items-center py-6">
            <div className="w-32 h-32 mb-4">
              <Lottie
                animationData={successAnimation}
                loop={false}
                autoplay={true}
              />
            </div>
            <p className="text-white text-center mb-4">
              Your contribution has been recorded successfully!
            </p>
            <div className="bg-white/10 p-3 rounded-lg w-full">
              <p className="text-sm text-gray-400">Transaction Hash:</p>
              <div className="flex items-center gap-2">
                <p className="text-white text-sm font-mono break-all">
                  {transactionHash}
                </p>
                <a
                  href={`https://explorer.solana.com/tx/${transactionHash}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FiExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white font-semibold w-full"
              onPress={() => setShowSuccessModal(false)}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
} 