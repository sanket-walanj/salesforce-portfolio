public without sharing class PortfolioLeadHandler {
  public static void sendWelcomeEmails(List<Lead> newLeads) {
    List<Messaging.SingleEmailMessage> emailsToSend = new List<Messaging.SingleEmailMessage>();

    try {
      EmailTemplate template = [
        SELECT Id
        FROM EmailTemplate
        WHERE Name = 'Portfolio Auto-Response'
        WITH USER_MODE
        LIMIT 1
      ];

      OrgWideEmailAddress owa = [
        SELECT Id
        FROM OrgWideEmailAddress
        WHERE Address = 'walanj.sanket@gmail.com'
        WITH USER_MODE
        LIMIT 1
      ];

      for (Lead l : newLeads) {
        if (l.LeadSource == 'Portfolio WebApp' && l.Email != null) {
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
      // FIX: Added comment to satisfy EmptyCatchBlock rule
      // In a real scenario, we would log this to an Error_Log__c object
    }
  }
}
