public without sharing class PortfolioLeadHandler {
  public static void sendWelcomeEmails(List<Lead> newLeads) {
    List<Messaging.SingleEmailMessage> emailsToSend = new List<Messaging.SingleEmailMessage>();

    try {
      // FIX: Removed 'WITH USER_MODE' because Guest Users cannot query Templates
      // NOPMD: Suppress security warning because this is a system configuration query
      EmailTemplate template = [
        SELECT Id
        FROM EmailTemplate
        WHERE Name = 'Portfolio Auto-Response'
        LIMIT 1
      ];

      // FIX: Removed 'WITH USER_MODE' for the same reason
      // NOPMD: Suppress security warning
      OrgWideEmailAddress owa = [
        SELECT Id
        FROM OrgWideEmailAddress
        WHERE Address = 'walanj.sanket@gmail.com'
        LIMIT 1
      ];

      for (Lead l : newLeads) {
        if (
          (l.LeadSource == 'Web' || l.LeadSource == 'Portfolio WebApp') &&
          l.Email != null
        ) {
          Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
          mail.setTemplateId(template.Id);
          mail.setTargetObjectId(l.Id);
          mail.setOrgWideEmailAddressId(owa.Id);
          mail.setSaveAsActivity(false);
          emailsToSend.add(mail);
        }
      }

      if (!emailsToSend.isEmpty()) {
        Messaging.sendEmail(emailsToSend);
      }
    } catch (Exception e) {
      // Intentionally suppressed: Email failure should not rollback the transaction.
    }
  }
}
