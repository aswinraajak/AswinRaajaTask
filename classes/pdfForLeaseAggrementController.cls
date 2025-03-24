public class pdfForLeaseAggrementController {
    
     @AuraEnabled
    public static Lease_Agreement_Management__c toGeneratePdf(Id recordId){
        
        system.debug('recordId-->'+recordId);
        
        Lease_Agreement_Management__c aggrementRecord =[SELECT Id,Aggred__c, Start_Date__c, End_Date__c, Name FROM Lease_Agreement_Management__c WHERE Id=: recordId];
        
        return aggrementRecord;
    } 

}