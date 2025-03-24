import { LightningElement,api,wire } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import getRecordDetails from '@salesforce/apex/pdfForLeaseAggrementController.toGeneratePdf';
import jsPDF from '@salesforce/resourceUrl/jsPDF';

export default class PdfForLeaseAggrement extends LightningElement {

    @api recordId;
    recordData;
    jsPdfInitialized = false;

    @wire(getRecordDetails, { recordId: '$recordId' })
    wiredData({ error, data }) {
        if (data) {
            this.recordData = data;
        } else if (error) {
            console.error('Error fetching account data:', error);
        }
    }
    renderedCallback() {
        if (this.jsPdfInitialized) return;
        this.jsPdfInitialized = true;
        loadScript(this, jsPDF).then(() => {
            console.log('jsPDF loaded');
        }).catch(error => {
            console.error('Error loading jsPDF:', error);
        });
    }

    generatePDF() {
        if (!this.recordData) {
            console.error('No account data available');
            return;
        }  
        const { Name, Start_Date__c, End_Date__c, Aggred__c} = this.recordData;
        const doc = new window.jspdf.jsPDF();
        doc.setFontSize(16);
        doc.text('Aggrement Details', 10, 10);
        doc.setFontSize(12); 

        doc.text(`Name: ${Name}`, 10, 30);
        doc.text(`Aggred Amount: ${Aggred__c}`, 10, 40);
        doc.text(`Start Date: ${Start_Date__c}`, 10, 50);
        doc.text(`End Date: ${End_Date__c}`, 10, 50);

        doc.save('Aggrement_Details.pdf');
    }
   

}