public without sharing class PortfolioController {
  @AuraEnabled(cacheable=true)
  public static List<Portfolio_Skill__c> getSkills() {
    return [
      SELECT Id, Name, Type__c, Proficiency__c, Icon_Name__c
      FROM Portfolio_Skill__c
      ORDER BY Proficiency__c DESC
    ];
  }

  @AuraEnabled(cacheable=true)
  public static List<Portfolio_Project__c> getProjects() {
    return [
      SELECT Id, Name, Description__c, Tech_Stack__c, Repository_URL__c
      FROM Portfolio_Project__c
    ];
  }

  @AuraEnabled(cacheable=true)
  public static Trailhead_Data__c getTrailheadStats() {
    List<Trailhead_Data__c> data = [
      SELECT Id, Total_Badges__c, Total_Points__c, Rank__c, Superbadges__c
      FROM Trailhead_Data__c
      LIMIT 1
    ];
    return data.isEmpty() ? null : data[0];
  }

  @AuraEnabled
  public static void createLead(
    String firstName,
    String lastName,
    String email,
    String company,
    String message
  ) {
    try {
      Lead newLead = new Lead();
      newLead.FirstName = firstName;
      newLead.LastName = lastName;
      newLead.Email = email;
      newLead.Company = company != null ? company : 'Portfolio Visitor';
      newLead.Description = message;
      newLead.LeadSource = 'Portfolio WebApp';
      insert newLead;
    } catch (Exception e) {
      // Throw exception to LWC instead of swallowing it
      throw new AuraHandledException('Error capturing lead: ' + e.getMessage());
    }
  }

  @AuraEnabled
  public static void logVisit(String browser, String device, String ipAddress) {
    try {
      Visitor_Notification__e event = new Visitor_Notification__e(
        IP_Address__c = ipAddress,
        Browser__c = browser,
        Device__c = device
      );
      EventBus.publish(event);
    } catch (Exception e) {
      throw new AuraHandledException('Error logging visit');
    }
  }
}
