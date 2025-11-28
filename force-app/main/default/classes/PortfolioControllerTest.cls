@isTest
private class PortfolioControllerTest {
  @testSetup
  static void setupData() {
    // Create User for RunAs
    Profile p = [SELECT Id FROM Profile WHERE Name = 'System Administrator'];
    User u = new User(
      Alias = 'standt',
      Email = 'standarduser@testorg.com',
      EmailEncodingKey = 'UTF-8',
      LastName = 'Testing',
      LanguageLocaleKey = 'en_US',
      LocaleSidKey = 'en_US',
      ProfileId = p.Id,
      TimeZoneSidKey = 'America/Los_Angeles',
      UserName = 'unique_test_user_portfolio@testorg.com'
    );
    insert u;

    System.runAs(u) {
      // Create Skills
      Portfolio_Skill__c skill = new Portfolio_Skill__c(
        Name = 'Apex',
        Proficiency__c = 90,
        Type__c = 'Backend',
        Icon_Name__c = 'utility:apex'
      );
      insert skill;

      // Create Project
      Portfolio_Project__c project = new Portfolio_Project__c(
        Name = 'Test Project',
        Description__c = 'Test Desc',
        Tech_Stack__c = 'LWC',
        Repository_URL__c = 'https://github.com/test'
      );
      insert project;

      // Create Trailhead Data
      Trailhead_Data__c th = new Trailhead_Data__c(
        Total_Badges__c = 100,
        Rank__c = 'Ranger'
      );
      insert th;
    }
  }

  @isTest
  static void testGetSkills() {
    User u = [
      SELECT Id
      FROM User
      WHERE UserName = 'unique_test_user_portfolio@testorg.com'
      LIMIT 1
    ];
    System.runAs(u) {
      Test.startTest();
      List<Portfolio_Skill__c> skills = PortfolioController.getSkills();
      Test.stopTest();
      System.assertEquals(1, skills.size(), 'Should return 1 skill');
    }
  }

  @isTest
  static void testGetProjects() {
    User u = [
      SELECT Id
      FROM User
      WHERE UserName = 'unique_test_user_portfolio@testorg.com'
      LIMIT 1
    ];
    System.runAs(u) {
      Test.startTest();
      List<Portfolio_Project__c> projects = PortfolioController.getProjects();
      Test.stopTest();
      System.assertEquals(1, projects.size(), 'Should return 1 project');
    }
  }

  @isTest
  static void testGetTrailheadStats() {
    User u = [
      SELECT Id
      FROM User
      WHERE UserName = 'unique_test_user_portfolio@testorg.com'
      LIMIT 1
    ];
    System.runAs(u) {
      Test.startTest();
      Trailhead_Data__c th = PortfolioController.getTrailheadStats();
      Test.stopTest();
      System.assertEquals(100, th.Total_Badges__c, 'Badges should match');
    }
  }

  @isTest
  static void testCreateLead() {
    User u = [
      SELECT Id
      FROM User
      WHERE UserName = 'unique_test_user_portfolio@testorg.com'
      LIMIT 1
    ];
    System.runAs(u) {
      Test.startTest();
      PortfolioController.createLead(
        'John',
        'Doe',
        'john@test.com',
        'Acme',
        'Msg'
      );
      Test.stopTest();

      Lead l = [SELECT Id FROM Lead WHERE Email = 'john@test.com' LIMIT 1];
      System.assertNotEquals(null, l);
    }
  }
}
