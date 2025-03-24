/********************************************************************************************
* Name: PropertyTriggerController
* Description: Controller class for PropertyTrigger
* Test Class Name : PropertyTriggerControllerTest
*Author: Aswin raaja Kubemdiran
*Created Date: 03/23/2025
*************************************************************************************************/
public class PropertyTriggerController {
    //Method to create task for the tenant
    public static void taskForTenant(list<Property_Management__c> newProprties){
        try{
            
            list<Task> taskForTenant = new list<Task>();//List to store the tasks
            for(Property_Management__c getNewProperties:newProprties){
                if(getNewProperties.Tenant__c != null){
                    Task newTask = new Task(
                        Subject = 'Generate the lease aggrement for the property '+getNewProperties.Name,
                        WhatId = getNewProperties.Tenant__c,
                        Status = 'Not Started',           
                        Priority = 'Low',                  
                        ActivityDate = Date.today().addDays(7), 
                        Description = 'Please generate the lease aggrement.' 
                    );
                    taskForTenant.add(newTask);
                }
            }
            if(taskForTenant != null){
                insert taskForTenant;
            }
        }catch(Exception e){
            
        }
    } 
}