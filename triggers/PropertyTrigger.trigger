trigger PropertyTrigger on Property_Management__c (before insert,after insert, before update, after update) {
    
    if(trigger.isAfter && trigger.isInsert){
        
        PropertyTriggerController.taskForTenant(trigger.new);
                
    }
}