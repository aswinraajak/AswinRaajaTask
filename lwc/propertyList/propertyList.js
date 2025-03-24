import { LightningElement, wire, track } from 'lwc';
import getProperties from '@salesforce/apex/PropertyController.getProperties';

export default class PropertyList extends LightningElement {
    @track properties = [];
    @track pageNumber = 1;
    pageSize = 25;
    totalRecords;
    
    filters = {
        minPrice: 0,
        maxPrice: 100000,
        status: '',
        furnishing: '',
        userLatitude: null,
        userLongitude: null,
        distanceKm: null
    };

    @wire(getProperties, { pageNumber: '$pageNumber', pageSize: '$pageSize', minPrice: '$filters.minPrice', maxPrice: '$filters.maxPrice', status: '$filters.status', furnishing: '$filters.furnishing', userLatitude: '$filters.userLatitude', userLongitude: '$filters.userLongitude', distanceKm: '$filters.distanceKm' })
    wiredProperties({ data, error }) {
        if (data) {
            this.properties = data;
        } else if (error) {
            console.error('Error fetching properties:', error);
        }
    }

    handleNextPage() {
        this.pageNumber++;
    }
    
    get isPrevDisabled() {
        return this.pageNumber <= 1;
    }
    handlePrevPage() {
        if (this.pageNumber > 1) 
            this.pageNumber--;
    }

    handleFilterChange(event) {
        this.filters[event.target.name] = event.target.value;
    }
}