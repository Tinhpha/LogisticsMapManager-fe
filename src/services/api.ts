import axios, { AxiosError, AxiosResponse } from 'axios';
import { API_ENDPOINTS, LocationsResponse } from './apiConfig';
import type { Location } from '../types/location';

// Create axios instance with default config
const apiClient = axios.create({
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        // Handle errors globally
        console.error('API Error:', error.message);
        return Promise.reject(error);
    }
);

// API functions
export const locationService = {
    // Get all locations
    getLocations: async (): Promise<LocationsResponse> => {
        try {
            const response: AxiosResponse<LocationsResponse> = await apiClient.get(
                API_ENDPOINTS.LOCATIONS
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching locations:', error);
            throw error;
        }
    },

    // Get location by ID
    getLocationById: async (id: string): Promise<Location> => {
        try {
            const response: AxiosResponse<Location> = await apiClient.get(
                `${API_ENDPOINTS.LOCATIONS}/${id}`
            );
            return response.data;
        } catch (error) {
            console.error(`Error fetching location with id ${id}:`, error);
            throw error;
        }
    },
};

export interface LocationAPI {
    searchLocations(params: {
        search?: string;
        business_type?: string;
        district?: string;
        min_rate?: number;
        sort?: 'name' | 'rate' | 'created_at';
        order?: 'asc' | 'desc';
        page?: number;
        per_page?: number;
    }): Promise<Location[]>;
    
    getAllLocations(): Promise<Location[]>;
    getNextPage(): Promise<Location[]>;
    getPreviousPage(): Promise<Location[]>;
    getCurrentPage(): number;
    getTotalPages(): number;
    getTotalItems(): number;
    getLocationsInMapBounds(bounds: {
        north: number;
        south: number;
        east: number;
        west: number;
    }): Promise<Location[]>;
}

// Example usage in a React component:
/*
import { useEffect, useState } from 'react';
import { locationService } from './services/api';

const LocationComponent = () => {
    const [locations, setLocations] = useState<Location[]>([]);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const data = await locationService.getLocations();
                setLocations(data);
            } catch (err) {
                setError('Failed to fetch locations');
            }
        };

        fetchLocations();
    }, []);

    return (
        <div>
            {error ? (
                <div>Error: {error}</div>
            ) : (
                locations.map(location => (
                    <div key={location.id}>{location.name}</div>
                ))
            )}
        </div>
    );
};
*/