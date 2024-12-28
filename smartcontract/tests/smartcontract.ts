import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { DonationProgram } from "../target/types/donation_program";
import { assert } from "chai";

describe("donation-program", () => {
  // Configure the client to use the local cluster
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.donationProgram as Program<DonationProgram>;
  const donationAccount = anchor.web3.Keypair.generate();

  it("Initializes donation account", async () => {
    try {
      await program.methods
        .initialize()
        .accounts({
          donationAccount: donationAccount.publicKey,
          payer: provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([donationAccount])
        .rpc();

      // Fetch the account and check if it's initialized
      const account = await program.account.donationAccount.fetch(
        donationAccount.publicKey
      );
      assert.ok(account.donations.length === 0);
    } catch (err) {
      console.error("Error:", err);
      throw err;
    }
  });

  it("Makes a donation", async () => {
    const donationAmount = new anchor.BN(1000000); // 1 SOL in lamports

    try {
      await program.methods
        .makeDonation(donationAmount)
        .accounts({
          donationAccount: donationAccount.publicKey,
          donor: provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      // Fetch the account and verify the donation
      const account = await program.account.donationAccount.fetch(
        donationAccount.publicKey
      );
      
      assert.ok(account.donations.length === 1);
      assert.ok(account.donations[0].amount.eq(donationAmount));
      assert.ok(account.donations[0].donor.equals(provider.wallet.publicKey));
    } catch (err) {
      console.error("Error:", err);
      throw err;
    }
  });

  it("Makes multiple donations", async () => {
    const donationAmount = new anchor.BN(500000); // 0.5 SOL in lamports

    try {
      // Make two more donations
      await program.methods
        .makeDonation(donationAmount)
        .accounts({
          donationAccount: donationAccount.publicKey,
          donor: provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      await program.methods
        .makeDonation(donationAmount)
        .accounts({
          donationAccount: donationAccount.publicKey,
          donor: provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      // Fetch and verify the account
      const account = await program.account.donationAccount.fetch(
        donationAccount.publicKey
      );
      
      assert.ok(account.donations.length === 3);
      assert.ok(account.donations[1].amount.eq(donationAmount));
      assert.ok(account.donations[2].amount.eq(donationAmount));
    } catch (err) {
      console.error("Error:", err);
      throw err;
    }
  });
});