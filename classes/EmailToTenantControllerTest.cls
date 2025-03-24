/********************************************************************************************
* Name: EmailToTenantControllerTest
* Description: Test Class for EmailToTenantController class 
*Author: Aswin raaja Kubemdiran
*Created Date: 03/23/2025
*************************************************************************************************/
@isTest
Private class EmailToTenantControllerTest {
    
    @isTest static void executeTestForTomorrow(){
        
         test.StartTest();
        Tenant_Management__c testTenant = new Tenant_Management__c();
        testTenant.Name = 'Test tenant';
        testTenant.Email__c = 'test@gmail.com';
        insert testTenant;
        
        Lease_Agreement_Management__c testLease = new Lease_Agreement_Management__c();
        testLease.Name = 'Test Aggrement';
        testLease.Aggred__c = 2000;
        testLease.Start_Date__c = system.Today()-50;
        testLease.End_Date__c = system.Today()+1;
        insert testLease;       
        
        Property_Management__c testProperty = new Property_Management__c();
        testProperty.Name = 'Test Property';
        testProperty.Address__Street__s = 'Test Street';
        testProperty.Address__City__s = 'Test City';
        testProperty.Type__c = 'Commercial';
        testProperty.Furnishing_Status__c = 'Furnished';
        testProperty.Status__c = 'Occupied';
        testProperty.Description__c = 'Property located near coastal area';
        testProperty.Tenant__c = testTenant.Id;
        testProperty.Lease_Agreement__c = testLease.Id;
        insert testProperty;
        
        // Simulate execution of the scheduled job
        EmailToTenantController emailController = new EmailToTenantController();
        emailController.execute(null);  // Directly invoking execute() method
        Test.StopTest(); 
    }
       @isTest static void executeTestForNextMonth(){
        
         test.StartTest();
        Tenant_Management__c testTenant = new Tenant_Management__c();
        testTenant.Name = 'Test tenant';
        testTenant.Email__c = 'test@gmail.com';
        insert testTenant;
        
        Lease_Agreement_Management__c testLease = new Lease_Agreement_Management__c();
        testLease.Name = 'Test Aggrement';
        testLease.Aggred__c = 2000;
        testLease.Start_Date__c = system.Today()-50;
        testLease.End_Date__c = system.Today()+30;
        insert testLease;       
        
        Property_Management__c testProperty = new Property_Management__c();
        testProperty.Name = 'Test Property';
        testProperty.Address__Street__s = 'Test Street';
        testProperty.Address__City__s = 'Test City';
        testProperty.Type__c = 'Commercial';
        testProperty.Furnishing_Status__c = 'Furnished';
        testProperty.Status__c = 'Occupied';
        testProperty.Description__c = 'Property located near coastal area';
        testProperty.Tenant__c = testTenant.Id;
        testProperty.Lease_Agreement__c = testLease.Id;
        insert testProperty;
        
        // Simulate execution of the scheduled job
        EmailToTenantController emailController = new EmailToTenantController();
        emailController.execute(null);  // Directly invoking execute() method
        Test.StopTest(); 
    }
    

}