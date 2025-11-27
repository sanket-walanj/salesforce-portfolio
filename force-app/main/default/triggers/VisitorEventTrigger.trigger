trigger VisitorEventTrigger on Visitor_Notification__e(after insert) {
  List<Visitor_Log__c> logs = new List<Visitor_Log__c>();

  for (Visitor_Notification__e event : Trigger.New) {
    logs.add(
      new Visitor_Log__c(
        IP_Address__c = event.IP_Address__c,
        Browser__c = event.Browser__c,
        Device__c = event.Device__c
      )
    );
  }

  if (!logs.isEmpty()) {
    insert logs;
  }
}
