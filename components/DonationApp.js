// import { useEffect, useState } from "react";
// import { Connection, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";
// import { Program, AnchorProvider, BN } from "@project-serum/anchor";
// import { useWallet } from '@solana/wallet-adapter-react';
// import { Button, Card, CardBody, Input, Progress } from "@nextui-org/react";
// import IDL from "../public/idl.json";
// import { FiExternalLink } from 'react-icons/fi';

// const PROGRAM_ID = new PublicKey("5TAN9LBwzdsnBhS9knmHud2Z8hxczQ6j8tKQUGojxpGZ");

// export default function DonationApp() {
//   const wallet = useWallet();
//   const [amount, setAmount] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [contributions, setContributions] = useState([]);
  
//   // Campaign details
//   const campaignGoal = 1000; // 1000 SOL
//   const currentAmount = contributions.reduce((acc, record) => 
//     acc + (record.amount.toNumber() / LAMPORTS_PER_SOL), 0);
//   const progressPercentage = (currentAmount / campaignGoal) * 100;

//   useEffect(() => {
//     if (wallet.connected) {
//       fetchContributionEvents();
//     }
//   }, [wallet.connected]);

//   const getProgram = () => {
//     const connection = new Connection(clusterApiUrl("devnet"));
//     const provider = new AnchorProvider(connection, wallet, {
//       preflightCommitment: "processed",
//     });
//     return new Program(IDL, PROGRAM_ID, provider);
//   };

//   const fetchContributionEvents = async () => {
//     try {
//       const connection = new Connection(clusterApiUrl("devnet"));
//       const signatures = await connection.getSignaturesForAddress(PROGRAM_ID, { limit: 10 });
      
//       const contributionEvents = [];
      
//       for (const sig of signatures) {
//         const tx = await connection.getParsedTransaction(sig.signature);
//         if (!tx?.meta?.logMessages) continue;
        
//         for (const log of tx.meta.logMessages) {
//           if (log.includes("DONATION_EVENT:")) {
//             const [, eventData] = log.split("DONATION_EVENT: ");
//             const matches = eventData.match(/donor=(.*), amount=(.*), timestamp=(.*)/);
            
//             if (matches) {
//               contributionEvents.push({
//                 donor: new PublicKey(matches[1]),
//                 amount: new BN(matches[2]),
//                 timestamp: parseInt(matches[3]),
//                 signature: sig.signature
//               });
//             }
//           }
//         }
//       }
      
//       setContributions(contributionEvents);
//     } catch (error) {
//       console.error("Error fetching contribution events:", error);
//     }
//   };

//   const contribute = async () => {
//     if (!amount || !wallet.connected) return;

//     setLoading(true);
//     try {
//       const program = getProgram();
//       const contributionAmount = new BN(parseFloat(amount) * LAMPORTS_PER_SOL);

//       await program.methods
//         .recordDonation(contributionAmount)
//         .accounts({
//           donor: wallet.publicKey,
//         })
//         .rpc();

//       setAmount("");
//       alert("Contribution recorded successfully!");
//       await fetchContributionEvents();
//     } catch (error) {
//       console.error("Error recording contribution:", error);
//       alert("Error recording contribution. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col gap-8 items-center pt-20 px-4">
//       <div className="w-full max-w-[1400px] space-y-8">
//         <div className="relative w-full h-[500px] rounded-xl overflow-hidden">
//           <img 
//             src="/spacex.png" 
//             alt="SpaceX Falcon Heavy Launch" 
//             className="absolute inset-0 w-full h-full object-cover"
//             style={{
//               objectPosition: 'center 40%'
//             }}
//           />
//         </div>

//         <div className="max-w-4xl mx-auto space-y-8 bg-black/30 backdrop-blur-sm rounded-xl p-8">
//           <div className="space-y-4">
//             <h1 className="text-4xl font-bold text-white">SpaceX Starship Development Fund</h1>
//             <p className="text-gray-300 leading-relaxed text-lg">
//               Help SpaceX revolutionize space travel with the development of Starship, 
//               the most powerful rocket ever built. Your contribution will directly support 
//               the advancement of reusable rocket technology and humanity's journey to Mars.
//             </p>
            
//             <div className="relative p-[1px] rounded-xl overflow-hidden">
//               <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 animate-pulse" />
//               <div className="relative bg-black/40 backdrop-blur-sm rounded-xl p-4 space-y-2">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-400">Raised</span>
//                   <span className="text-white font-semibold">{currentAmount.toFixed(2)} SOL of {campaignGoal} SOL</span>
//                 </div>
//                 <Progress 
//                   value={progressPercentage} 
//                   className="h-3"
//                   classNames={{
//                     indicator: "bg-gradient-to-r from-pink-500 to-yellow-500"
//                   }}
//                 />
//                 <div className="flex gap-8 text-sm text-gray-300 pt-2">
//                   <div className="flex gap-2">
//                     <span>Contributors</span>
//                     <span className="text-white">{contributions.length}</span>
//                   </div>
//                   <div className="flex gap-2">
//                     <span>Days Left</span>
//                     <span className="text-white">12</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {wallet.connected ? (
//             <div className="relative p-[1px] rounded-xl overflow-hidden">
//               <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 animate-pulse" />
//               <Card className="relative bg-black/40 backdrop-blur-sm border-0">
//                 <CardBody className="p-6">
//                   <h2 className="text-xl font-bold text-white mb-4">Support This Project</h2>
//                   <div className="flex gap-2">
//                     <Input
//                       type="number"
//                       value={amount}
//                       onChange={(e) => setAmount(e.target.value)}
//                       placeholder="Amount in SOL"
//                       min="0"
//                       step="0.1"
//                       className="flex-1"
//                       classNames={{
//                         input: "bg-black/20 text-white",
//                         inputWrapper: "bg-black/20 border-white/20"
//                       }}
//                     />
//                     <Button
//                       onClick={contribute}
//                       disabled={loading || !amount}
//                       className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white font-semibold"
//                       isLoading={loading}
//                     >
//                       {loading ? "Processing..." : "Contribute"}
//                     </Button>
//                   </div>
//                 </CardBody>
//               </Card>
//             </div>
//           ) : (
//             <Card className="bg-black/40 backdrop-blur-md border border-white/10">
//               <CardBody className="text-center py-8 px-12">
//                 <p className="text-white mb-2">Please connect your wallet to contribute</p>
//                 <span className="text-gray-400 text-sm">
//                   Click the "Select Wallet" button above
//                 </span>
//               </CardBody>
//             </Card>
//           )}

//           <div className="space-y-4">
//             <h2 className="text-xl font-bold text-white">Recent Contributors</h2>
//             {contributions.length === 0 ? (
//               <Card className="bg-black/40 backdrop-blur-md border border-white/10">
//                 <CardBody>
//                   <p className="text-gray-400 text-center">No contributions yet. Be the first!</p>
//                 </CardBody>
//               </Card>
//             ) : (
//               <div className="space-y-2">
//                 {contributions.map((record, index) => (
//                   <Card key={index} className="bg-black/40 backdrop-blur-md border border-white/10">
//                     <CardBody className="p-4">
//                       <div className="flex justify-between items-center">
//                         <div className="truncate">
//                           <span className="text-gray-400">Contributor: </span>
//                           <span className="text-white">
//                             {record.donor.toString().slice(0, 4)}...
//                             {record.donor.toString().slice(-4)}
//                           </span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <span className="text-white font-semibold">
//                             {(record.amount.toString() / LAMPORTS_PER_SOL).toFixed(2)} SOL
//                           </span>
//                           <a
//                             href={`https://explorer.solana.com/tx/${record.signature}?cluster=devnet`}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-gray-400 hover:text-white transition-colors"
//                           >
//                             <FiExternalLink className="w-4 h-4" />
//                           </a>
//                         </div>
//                       </div>
//                       <div className="text-sm text-gray-400 mt-1">
//                         {new Date(record.timestamp * 1000).toLocaleString()}
//                       </div>
//                     </CardBody>
//                   </Card>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// } 