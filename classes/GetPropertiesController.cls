/********************************************************************************************
* Name: GetPropertiesController
* Description: Controller class for "PropertyListView" LWC component
*Author: Aswin raaja Kubemdiran
*Created Date: 03/22/2025
*************************************************************************************************/
public class GetPropertiesController {
        
          @AuraEnabled(cacheable=true)
        public static List<Property_Management__c> getPropertyRecords() {
            return [SELECT Id,Name,Status__c,Type__c,Rent__c,Address__c,Tenant__r.Name,Furnishing_Status__c,Description__c FROM Property_Management__c];
        } 
        
            @AuraEnabled
        public static Property_Management__c createProperty(Property_Management__c createProeprty) {
            createProeprty.Lease_Agreement__c = 'a02gK000000Nm7BQAS';
            insert createProeprty;
            return createProeprty;
        }
        
        @AuraEnabled
        public static ContentVersion uploadFile(String fileName, String base64Data, String recordId) {
            if (String.isEmpty(fileName) || String.isEmpty(base64Data) || String.isEmpty(recordId)) {
                throw new AuraHandledException('Invalid file data.');
            }
    
            ContentVersion cv = new ContentVersion(
                Title = fileName,
                PathOnClient = fileName,
                VersionData = EncodingUtil.base64Decode(base64Data),
                FirstPublishLocationId = recordId
            );
            insert cv;
            return cv;
        }  
    }