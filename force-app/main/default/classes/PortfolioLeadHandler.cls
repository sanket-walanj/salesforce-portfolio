public without sharing class PortfolioLeadHandler {
  public static void sendWelcomeEmails(List<Lead> newLeads) {
    List<Messaging.SingleEmailMessage> emailsToSend = new List<Messaging.SingleEmailMessage>();

    // 1. Fetch Configuration (Template & Org-Wide Email)
    // We use try-catch to avoid crashing if config is missing
    try {
      EmailTemplate template = [
        SELECT Id
        FROM EmailTemplate
        WHERE Name = 'Portfolio Auto-Response'
        LIMIT 1
      ];
      OrgWideEmailAddress owa = [
        SELECT Id
        FROM OrgWideEmailAddress
        WHERE Address = 'walanj.sanket@gmail.com'
        LIMIT 1
      ]; // REPLACE with your verified email

      for (Lead l : newLeads) {
        // Check criteria: Only Leads from your Portfolio
        if (l.LeadSource == 'Portfolio WebApp' && l.Email != null) {
          Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();

          // A. Set the Template
          mail.setTemplateId(template.Id);

          // B. Set the Recipient (The Lead)
          mail.setTargetObjectId(l.Id);

          // C. Set the Sender (The Verified Org-Wide Address)
          // This is CRITICAL for Guest Users. Without this, it will fail.
          mail.setOrgWideEmailAddressId(owa.Id);

          // D. Save as Activity? No.
          mail.setSaveAsActivity(false);

          emailsToSend.add(mail);
        }
      }

      if (!emailsToSend.isEmpty()) {
        Messaging.sendEmail(emailsToSend);
      }
    } catch (Exception e) {
      System.debug('Email Error: ' + e.getMessage());
      // In a real app, you might log this to an Error_Log__c object
    }
  }
}
