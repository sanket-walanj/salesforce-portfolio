@isTest
private class PortfolioControllerTest {
  @testSetup
  static void setupData() {
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

  @isTest
  static void testGetSkills() {
    Test.startTest();
    List<Portfolio_Skill__c> skills = PortfolioController.getSkills();
    Test.stopTest();
    System.assertEquals(1, skills.size(), 'Should return 1 skill');
  }

  @isTest
  static void testGetProjects() {
    Test.startTest();
    List<Portfolio_Project__c> projects = PortfolioController.getProjects();
    Test.stopTest();
    System.assertEquals(1, projects.size(), 'Should return 1 project');
  }

  @isTest
  static void testGetTrailheadStats() {
    Test.startTest();
    Trailhead_Data__c th = PortfolioController.getTrailheadStats();
    Test.stopTest();
    System.assertEquals(100, th.Total_Badges__c, 'Badges should match');
  }

  @isTest
  static void testCreateLead() {
    Test.startTest();
    PortfolioController.createLead('John', 'Doe', 'john@test.com', 'Hire me');
    Test.stopTest();

    Lead l = [SELECT Id, Email FROM Lead WHERE Email = 'john@test.com' LIMIT 1];
    System.assertNotEquals(null, l, 'Lead should be created');
  }
}
