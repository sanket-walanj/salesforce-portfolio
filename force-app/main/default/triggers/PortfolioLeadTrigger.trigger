trigger PortfolioLeadTrigger on Lead(after insert) {
  // Best Practice: Check if trigger logic should run (bypass flag)
  // For this portfolio, we just run it directly.
  PortfolioLeadHandler.sendWelcomeEmails(Trigger.new);
}
