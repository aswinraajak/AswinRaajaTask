/********************************************************************************************
* Name: PropertyListView
* Description: LWC component to display Property records with datatable and pagination
*Author: Aswin raaja Kubemdiran
*Created Date: 03/22/2025
*************************************************************************************************/
import { LightningElement,wire, track } from 'lwc';
import getProperties from "@salesforce/apex/GetPropertiesController.getPropertyRecords";
import insertProperties from "@salesforce/apex/GetPropertiesController.createProperty";
import insertPropertyFile from "@salesforce/apex/GetPropertiesController.uploadFile";
const COLUMNS = [
{ label: 'S.No', fieldName: 'rowNumber', type: 'number' },
{ label: 'Property Name', fieldName: 'Name' },
{ label: 'Type', fieldName: 'Type__c'},
{ label: 'Status', fieldName: 'Status__c'},
{ label: 'Rent Amount', fieldName: 'Rent__c'},
{ label: 'Furnishing Status', fieldName: 'Furnishing_Status__c'},
{ label: 'Description', fieldName: 'Description__c'}
];

const RECORDS_PER_PAGE = 25;

export default class PropertyListView extends LightningElement {

@track allData = []; // Stores all records
@track data = []; // Stores paginated records
@track filteredData = [];
columns = COLUMNS;
currentPage = 1;
totalPages = 0;
minRent = 0; // Default minimum rent
isDataLoaded = false; // To prevent filtering before data is loaded
selectedStatus = ''; // Default to show all statuses
selectedFurnishedStatus = '';//
isDataLoaded = false;
isModalOpen = false;
newProperty = { Name: '', Type__c: '', Status__c: '', Rent__c: '',Furnishing_Status__c:'',Description__c:''}; // Stores form input


@wire(getProperties)
wiredAccounts({ error, data }) {
    if (data) {
        console.log('data',data);
        this.allData = data;
        this.filteredData = [...data]; // Initialize with all data
        this.isDataLoaded = true;
        this.totalPages = Math.ceil(data.length / RECORDS_PER_PAGE);
        this.updatePagination();
    } else if (error) {
        console.error('Error fetching accounts:', error);
    }
}

updatePagination() {
    const start = (this.currentPage - 1) * RECORDS_PER_PAGE;
    const end = start + RECORDS_PER_PAGE;
    this.data = this.filteredData.slice(start, end).map((record, index) => ({
        ...record,
        rowNumber: start + index + 1 // 
    }));
    this.totalPages = Math.ceil(this.filteredData.length / RECORDS_PER_PAGE);
}

    // Handle Rent Amount Filter
    handleRentFilter(event) {
    this.minRent = event.target.value ? parseFloat(event.target.value) : 0;
    this.applyFilters();
}

// Handle Status Filter
handleStatusFilter(event) {
    this.selectedStatus = event.target.value;
    this.applyFilters();
}

handleFurnishedStatusFilter(event){

this.selectedFurnishedStatus = event.target.value;
this.applyFilters();
}

applyFilters() {
    if (!this.isDataLoaded) return; // Prevent filtering before data is loaded

    this.filteredData = this.allData.filter(Property_Management__c => 
        Property_Management__c.Rent__c >= this.minRent &&
        (this.selectedStatus === '' || Property_Management__c.Status__c === this.selectedStatus) &&
        (this.selectedFurnishedStatus === '' || Property_Management__c.Furnishing_Status__c === this.selectedFurnishedStatus)
    );
    this.currentPage = 1; // Reset to first page after filtering
    this.updatePagination();
}

previousPage() {
    if (this.currentPage > 1) {
        this.currentPage--;
        this.updatePagination();
    }
}
nextPage() {
    if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.updatePagination();
    }
}
get disablePrevious() {
    return this.currentPage <= 1;
}
get disableNext() {
    return this.currentPage >= this.totalPages;
}

//Status Picklist Options
get statusOptions() {
    return [
        { label: 'All', value: '' },
        { label: 'Occupied', value: 'Occupied' },
        { label: 'Available', value: 'Available' }
    ];
}
get FurnishedOptions() {
    return [
        { label: 'All', value: '' },
        { label: 'Furnished', value: 'Furnished' },
        { label: 'Semi-Furnished', value: 'Semi-Furnished' },
        { label: 'Unfurnished', value: 'Unfurnished' }
    ];
}
openModal() {
    this.isModalOpen = true;
}

// Close modal
closeModal() {
    this.isModalOpen = false;
    this.fileData = {}; // Clear file data on close
}

handleInputChange(event) {
    const { name, value } = event.target;
    this.newProperty = { ...this.newProperty, [name]: value };
}

handleFileChange(event) {
    if (event.target.files.length > 0) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            const base64 = reader.result.split(',')[1];
            this.fileData = { fileName: file.name, base64 };
        };
        reader.readAsDataURL(file);
    }
}


  
createNewRecord() {
    console.log('createNewRecord');
    createProperty({ acc: this.newProperty })
        .then(result => {
            const recordId = result.Id;
            console.log('recordId', recordId);

            if (this.fileData && this.fileData.base64) {
                uploadFile({
                    fileName: this.fileData.fileName,
                    base64Data: this.fileData.base64,
                    recordId: recordId
                }).then(() => {
                    this.showToast('Success', 'Property and file uploaded!', 'success');
                    this.closeModal();
                    return refreshApex(this.wiredAccounts);
                }).catch(error => {
                    console.error('File upload error:', error);
                    this.showToast('Error', 'Failed to upload file', 'error');
                });
            } else {
                this.showToast('Success', 'Account created successfully!', 'success');
                this.closeModal();
                return refreshApex(this.wiredAccounts);
            }
        })
        .catch(error => {
            console.error('Account creation error:', error);
            this.showToast('Error', 'Failed to create account', 'error');
        });
}

showToast(title, message, variant) {
    this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
}

}