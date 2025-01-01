import { useEffect, useState } from "react";
import { Connection, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Program, AnchorProvider, BN } from "@project-serum/anchor";
import { useWallet } from '@solana/wallet-adapter-react';
import { Button, Card, CardBody, Input } from "@nextui-org/react";
import IDL from "../public/idl.json";

const PROGRAM_ID = new PublicKey("5TAN9LBwzdsnBhS9knmHud2Z8hxczQ6j8tKQUGojxpGZ");

export default function DonationApp() {
  const wallet = useWallet();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    if (wallet.connected) {
      fetchDonationEvents();
    }
  }, [wallet.connected]);

  const getProgram = () => {
    const connection = new Connection(clusterApiUrl("devnet"));
    const provider = new AnchorProvider(connection, wallet, {
      preflightCommitment: "processed",
    });
    return new Program(IDL, PROGRAM_ID, provider);
  };

  const fetchDonationEvents = async () => {
    try {
      const connection = new Connection(clusterApiUrl("devnet"));
      const signatures = await connection.getSignaturesForAddress(PROGRAM_ID, { limit: 10 });
      
      const donationEvents = [];
      
      for (const sig of signatures) {
        const tx = await connection.getParsedTransaction(sig.signature);
        if (!tx?.meta?.logMessages) continue;
        
        for (const log of tx.meta.logMessages) {
          if (log.includes("DONATION_EVENT:")) {
            const [, eventData] = log.split("DONATION_EVENT: ");
            const matches = eventData.match(/donor=(.*), amount=(.*), timestamp=(.*)/);
            
            if (matches) {
              donationEvents.push({
                donor: new PublicKey(matches[1]),
                amount: new BN(matches[2]),
                timestamp: parseInt(matches[3])
              });
            }
          }
        }
      }
      
      setDonations(donationEvents);
    } catch (error) {
      console.error("Error fetching donation events:", error);
    }
  };

  const donate = async () => {
    if (!amount || !wallet.connected) return;

    setLoading(true);
    try {
      const program = getProgram();
      const donationAmount = new BN(parseFloat(amount) * LAMPORTS_PER_SOL);

      await program.methods
        .recordDonation(donationAmount)
        .accounts({
          donor: wallet.publicKey,
        })
        .rpc();

      setAmount("");
      alert("Donation recorded successfully!");
      await fetchDonationEvents();
    } catch (error) {
      console.error("Error recording donation:", error);
      alert("Error recording donation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 items-center pt-20">
      <h1 className="text-4xl font-bold mb-4 text-white">Contribute Now</h1>

      {wallet.connected ? (
        <div className="flex flex-col gap-4 w-full max-w-md">
          <Card className="bg-black/40 backdrop-blur-md border border-white/10">
            <CardBody className="p-6">
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Amount in SOL"
                  min="0"
                  step="0.1"
                  className="flex-1"
                  classNames={{
                    input: "bg-black/20 text-white",
                    inputWrapper: "bg-black/20 border-white/20"
                  }}
                />
                <Button
                  onClick={donate}
                  disabled={loading || !amount}
                  className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white font-semibold"
                  isLoading={loading}
                >
                  {loading ? "Processing..." : "Donate"}
                </Button>
              </div>
            </CardBody>
          </Card>

          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4 text-white">Recent Donations</h2>
            {donations.length === 0 ? (
              <Card className="bg-black/40 backdrop-blur-md border border-white/10">
                <CardBody>
                  <p className="text-gray-400 text-center">No donations yet</p>
                </CardBody>
              </Card>
            ) : (
              <div className="space-y-2">
                {donations.map((record, index) => (
                  <Card key={index} className="bg-black/40 backdrop-blur-md border border-white/10">
                    <CardBody className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="truncate">
                          <span className="text-gray-400">Donor: </span>
                          <span className="text-white">
                            {record.donor.toString().slice(0, 4)}...
                            {record.donor.toString().slice(-4)}
                          </span>
                        </div>
                        <div>
                          <span className="text-white font-semibold">
                            {(record.amount.toString() / LAMPORTS_PER_SOL).toFixed(2)} SOL
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        {new Date(record.timestamp * 1000).toLocaleString()}
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <Card className="bg-black/40 backdrop-blur-md border border-white/10">
          <CardBody className="text-center py-8 px-12">
            <p className="text-white mb-2">Please connect your wallet to contribute now</p>
            <span className="text-gray-400 text-sm">
              Click the &quot;Select Wallet&quot; button above
            </span>
          </CardBody>
        </Card>
      )}
    </div>
  );
} 