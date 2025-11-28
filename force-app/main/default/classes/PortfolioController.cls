/**
 * @description       : Controller for the Public Portfolio Site
 * @author            : Sanket Walanj
 * @group             : Portfolio
 * @last modified on  : 11-27-2025
 **/
public without sharing class PortfolioController {
  // 1. Fetch Skills (Grouped by Type via LWC later)
  @AuraEnabled(cacheable=true)
  public static List<Portfolio_Skill__c> getSkills() {
    return [
      SELECT Id, Name, Type__c, Proficiency__c, Icon_Name__c
      FROM Portfolio_Skill__c
      ORDER BY Proficiency__c DESC
    ];
  }

  // 2. Fetch Projects
  @AuraEnabled(cacheable=true)
  public static List<Portfolio_Project__c> getProjects() {
    return [
      SELECT Id, Name, Description__c, Tech_Stack__c, Repository_URL__c
      FROM Portfolio_Project__c
      // Note: If you added an Order__c field, add 'ORDER BY Order__c ASC' here
    ];
  }

  // 3. Fetch Trailhead Stats (Assuming 1 record exists)
  @AuraEnabled(cacheable=true)
  public static Trailhead_Data__c getTrailheadStats() {
    List<Trailhead_Data__c> data = [
      SELECT Id, Total_Badges__c, Total_Points__c, Rank__c, Superbadges__c
      FROM Trailhead_Data__c
      LIMIT 1
    ];
    return data.isEmpty() ? null : data[0];
  }

  // 4. Lead Capture (For the "Hire Me" form)
  @AuraEnabled
  public static void createLead(
    String firstName,
    String lastName,
    String email,
    String message
  ) {
    try {
      Lead newLead = new Lead();
      newLead.FirstName = firstName;
      newLead.LastName = lastName;
      newLead.Email = email;
      newLead.Description = message;
      newLead.Company = 'Portfolio Visitor'; // Default company
      newLead.LeadSource = 'Portfolio WebApp';
      insert newLead;
    } catch (Exception e) {
      throw new AuraHandledException('Error capturing lead: ' + e.getMessage());
    }
  }

  // 6. Visitor Tracking - Publish Platform Event
  @AuraEnabled
  public static void logVisit(String browser, String device, String ipAddress) {
    // Publish Event
    Visitor_Notification__e event = new Visitor_Notification__e(
      IP_Address__c = ipAddress, // Use the passed value
      Browser__c = browser,
      Device__c = device
    );

    EventBus.publish(event);
  }
}
