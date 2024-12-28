use anchor_lang::prelude::*;

declare_id!("5TAN9LBwzdsnBhS9knmHud2Z8hxczQ6j8tKQUGojxpGZ");

#[program]
pub mod donation_events {
    use super::*;

    pub fn record_donation(ctx: Context<RecordDonation>, amount: u64) -> Result<()> {
        // Get current timestamp
        let clock = Clock::get()?;
        
        // Emit event through logging
        msg!(
            "DONATION_EVENT: donor={}, amount={}, timestamp={}", 
            ctx.accounts.donor.key(),
            amount,
            clock.unix_timestamp
        );
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct RecordDonation<'info> {
    pub donor: Signer<'info>,
}