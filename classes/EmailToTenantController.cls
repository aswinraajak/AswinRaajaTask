/********************************************************************************************
* Name: EmailToTenantController
* Description: Send Email to tenant before the aggrement end date
* Test Class Name : 
*Author: Aswin raaja Kubemdiran
*Created Date: 03/23/2025
*************************************************************************************************/
Public class EmailToTenantController implements Schedulable{
    //Schedule method to send Emial
    Public void execute(SchedulableContext context){
        try{
             list<Property_Management__c> allProperties =[SELECT Id, Name, Tenant__r.Name, Tenant__r.Email__c,Lease_Agreement__r.End_Date__c 
                                                     FROM Property_Management__c 
                                                     WHERE Lease_Agreement__r.End_Date__c = TOMORROW OR Lease_Agreement__r.End_Date__c=NEXT_MONTH];
        
        List<Messaging.SingleEmailMessage> emailList = new List<Messaging.SingleEmailMessage>();//list to store email
        if(allProperties != null ){
            
            for(Property_Management__c sendEmail:allProperties){
                if(sendEmail.Lease_Agreement__r.End_Date__c != null && sendEmail.Lease_Agreement__r.End_Date__c == system.Today()+30){
                    
                    //Email Content
                    Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
                    mail.setSubject('Lease Aggrement Expiring on'+sendEmail.Lease_Agreement__r.End_Date__c);
                    mail.setPlainTextBody('Hello ' + sendEmail.name + ',\n\nLease Aggrement in expiring on Next month('+sendEmail.Lease_Agreement__r.End_Date__c+')Please renew it.');
                    mail.setToAddresses(new String[] { sendEmail.Tenant__r.Email__c});
                    emailList.add(mail);
                } 
                if(sendEmail.Lease_Agreement__r.End_Date__c != null && sendEmail.Lease_Agreement__r.End_Date__c == system.Today()+1){
                    
                    //Email Content
                    Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
                    mail.setSubject('Lease Aggrement Expiring on'+sendEmail.Lease_Agreement__r.End_Date__c);
                    mail.setPlainTextBody('Hello ' + sendEmail.name + ',\n\nLease Aggrement in expiring on Tomorrow('+sendEmail.Lease_Agreement__r.End_Date__c+')Please renew it.');
                    mail.setToAddresses(new String[] { sendEmail.Tenant__r.Email__c});
                    emailList.add(mail);
                }
            }
            system.debug('emailList--->'+emailList);
            if(!emailList.isEmpty()) {
                Messaging.sendEmail(emailList);
            }    
        }  
            
        }catch(Exception e){
            
            
        }
        
        
    }
}