import { Location } from '../types/location';
import { locationService } from './locationService/locationService';

export interface LocationState {
    locations: Location[];
    filteredLocations: Location[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
}

export interface SearchParams {
    search?: string;
    business_type?: string;
    district?: string;
    page?: number;
    per_page?: number;
}

export class ApiManager {
    private readonly DEFAULT_PAGE_SIZE = 5;

    async loadInitialData(): Promise<LocationState> {
        console.log('API Call: Load Initial Data');
        try {
            const locations = await locationService.searchLocations({
                page: 1,
                per_page: this.DEFAULT_PAGE_SIZE
            });
            console.log('API Response: Initial Data', locations);

            return {
                locations,
                filteredLocations: locations,
                currentPage: locationService.getCurrentPage(),
                totalPages: locationService.getTotalPages(),
                totalItems: locationService.getTotalItems()
            };
        } catch (error) {
            console.error('Error loading initial data:', error);
            throw new Error('Failed to load initial data');
        }
    }

    async getLocations(): Promise<Location[]> {
        console.log('API Call: Get All Locations');
        try {
            const locations = await locationService.getAllLocations();
            console.log('API Response: Get All Locations', locations);
            return locations;
        } catch (error) {
            console.error('Error getting all locations:', error);
            throw error;
        }
    }

    async searchLocations(params: SearchParams): Promise<LocationState> {
        console.log('API Call: Search Locations with params:', params);
        try {
            const searchParams = {
                ...params,
                page: params.page || 1,
                per_page: params.per_page || this.DEFAULT_PAGE_SIZE
            };

            const locations = await locationService.searchLocations(searchParams);
            console.log('API Response: Search Locations', locations);

            return {
                locations,
                filteredLocations: locations,
                currentPage: locationService.getCurrentPage(),
                totalPages: locationService.getTotalPages(),
                totalItems: locationService.getTotalItems()
            };
        } catch (error) {
            console.error('Error searching locations:', error);
            throw new Error('Failed to search locations');
        }
    }
}

export const apiManager = new ApiManager();
