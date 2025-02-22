import type { AxiosInstance } from 'axios';
import { Location } from '../../types/location';
import axiosInstance from '../apiConfig';
import { API_ENDPOINTS } from '../apiConfig';
import { removeVietnameseTones } from '../../utils/stringUtils';

interface SearchParams {
    query?: string;
    type?: string;
    page?: number;
    per_page?: number;
    business_type?: string;
    district?: string;
    min_rate?: number;
    sort?: 'name' | 'rate' | 'created_at';
    order?: 'asc' | 'desc';
}

interface PaginatedResponse {
    current_page: number;
    data: Location[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
    locations: Location[];
}

class LocationService {
    private currentPage: number = 1;
    private itemsPerPage: number = 1000;
    private totalItems: number = 0;
    private totalPages: number = 1;
    private locations: Map<number, Location> = new Map();
    private isFetchingAll: boolean = false;
    private readonly TOTAL_FETCH_PAGES: number = 10; // Số pages tối đa sẽ fetch
    private lastFetchTime: number = 0;
    private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

    private isCacheValid(): boolean {
        return (
            this.locations.size > 0 && 
            Date.now() - this.lastFetchTime < this.CACHE_DURATION
        );
    }

    async getAllLocations(): Promise<Location[]> {
        console.log('LocationService: Getting all locations');
        try {
            // Return cached data if valid
            if (this.isCacheValid()) {
                console.log('Using cached data:', {
                    cachedLocations: this.locations.size,
                    cacheAge: Math.round((Date.now() - this.lastFetchTime) / 1000) + 's'
                });
                return Array.from(this.locations.values());
            }

            // Reset state and fetch new data
            this.locations.clear();
            this.currentPage = 1;
            this.isFetchingAll = true;

            // Fetch first page to get pagination info
            const firstPageResponse = await axiosInstance.get<PaginatedResponse>(API_ENDPOINTS.LOCATIONS, {
                params: {
                    page: this.currentPage,
                    per_page: this.itemsPerPage,
                    sort: 'created_at',
                    order: 'desc'
                }
            });

            if (!firstPageResponse.data) {
                throw new Error('Invalid response from API');
            }

            // Update pagination info
            this.totalItems = firstPageResponse.data.total || 0;
            this.totalPages = firstPageResponse.data.last_page || 1;

            // Store first page data
            if (firstPageResponse.data.locations) {
                firstPageResponse.data.locations.forEach(location => {
                    if (location.id) {
                        this.locations.set(location.id, location);
                    }
                });
            }

            // Fetch remaining pages up to TOTAL_FETCH_PAGES
            const remainingPages = Math.min(this.totalPages - 1, this.TOTAL_FETCH_PAGES - 1);
            if (remainingPages > 0) {
                console.log(`Fetching ${remainingPages} more pages...`);
                
                const pagePromises = Array.from({ length: remainingPages }, (_, i) => 
                    axiosInstance.get<PaginatedResponse>(API_ENDPOINTS.LOCATIONS, {
                        params: {
                            page: i + 2, // Start from page 2
                            per_page: this.itemsPerPage,
                            sort: 'created_at',
                            order: 'desc'
                        }
                    })
                );

                const responses = await Promise.all(pagePromises);
                
                // Store data from all pages
                responses.forEach(response => {
                    if (response.data?.locations) {
                        response.data.locations.forEach(location => {
                            if (location.id) {
                                this.locations.set(location.id, location);
                            }
                        });
                    }
                });
            }

            this.lastFetchTime = Date.now();
            this.isFetchingAll = false;

            console.log('Location data fetched:', {
                fetchedLocations: this.locations.size,
                totalInDatabase: this.totalItems,
                coverage: `${((this.locations.size / this.totalItems) * 100).toFixed(2)}%`,
                pageInfo: {
                    fetchedPages: Math.min(this.totalPages, this.TOTAL_FETCH_PAGES),
                    totalPages: this.totalPages,
                    itemsPerPage: this.itemsPerPage
                }
            });

            return Array.from(this.locations.values());
        } catch (error) {
            console.error('LocationService: Get all error:', error);
            this.isFetchingAll = false;
            throw error;
        }
    }

    async getLocationById(id: number): Promise<Location | null> {
        console.log('LocationService: Getting location by id:', id);
        try {
            // Check cache first
            if (this.isCacheValid()) {
                const cachedLocation = this.locations.get(id);
                if (cachedLocation) {
                    return cachedLocation;
                }
            }

            // If not in cache or cache invalid, fetch all data
            await this.getAllLocations();
            return this.locations.get(id) || null;
        } catch (error) {
            console.error(`LocationService: Error getting location ${id}:`, error);
            throw error;
        }
    }

    async searchLocations(params: SearchParams = {}): Promise<Location[]> {
        console.log('LocationService: Searching locations with params:', params);
        try {
            // Convert Vietnamese text to non-accent version
            const searchQuery = params.query ? removeVietnameseTones(params.query) : undefined;
            const district = params.district ? removeVietnameseTones(params.district) : undefined;

            // Always use query params
            const queryParams = new URLSearchParams();

            if (searchQuery) {
                queryParams.append('query', searchQuery);
            }

            if (district) {
                queryParams.append('district', district);
            }

            if (params.business_type) {
                queryParams.append('business_type', params.business_type);
            }

            const response = await axiosInstance.get<PaginatedResponse>(`${API_ENDPOINTS.LOCATIONS}?${queryParams.toString()}`);

            console.log('LocationService: Search response:', response.data);

            if (!response.data || !response.data.locations) {
                console.warn('No locations data in response');
                return [];
            }

            // Update pagination info
            this.currentPage = response.data.current_page || 1;
            this.totalPages = response.data.total_pages || 1;
            this.totalItems = response.data.total_items || 0;

            return response.data.locations;
        } catch (error) {
            console.error('LocationService: Search error:', error);
            throw error;
        }
    }

    async getLocationsInMapBounds(bounds: {
        northEast: { lat: number; lng: number };
        southWest: { lat: number; lng: number };
    }): Promise<Location[]> {
        console.log('LocationService: Getting locations in map bounds:', bounds);
        try {
            // Use cached data if available
            if (!this.isCacheValid()) {
                await this.getAllLocations();
            }

            // Filter locations from cache based on bounds
            return Array.from(this.locations.values()).filter(location => {
                return (
                    location.latitude >= bounds.southWest.lat &&
                    location.latitude <= bounds.northEast.lat &&
                    location.longitude >= bounds.southWest.lng &&
                    location.longitude <= bounds.northEast.lng
                );
            });
        } catch (error) {
            console.error('LocationService: Error getting locations in bounds:', error);
            throw error;
        }
    }

    async refreshLocations(): Promise<Location[]> {
        console.log('LocationService: Refreshing locations');
        // Force refresh by invalidating cache
        this.lastFetchTime = 0;
        return this.getAllLocations();
    }

    private updatePaginationInfo(data: PaginatedResponse): void {
        this.currentPage = data.current_page;
        this.totalItems = data.total;
    }

    // Pagination methods
    getCurrentPage(): number {
        return this.currentPage;
    }

    getTotalPages(): number {
        return this.totalPages;
    }

    getTotalItems(): number {
        return this.totalItems;
    }

    getTotalFetchPages(): number {
        return this.TOTAL_FETCH_PAGES;
    }

    isInitialLoadComplete(): boolean {
        return !this.isFetchingAll;
    }

    getProgress(): { 
        currentItems: number;
        totalItems: number;
        percentage: number;
        currentPage: number;
        totalPages: number;
        totalFetchPages: number;
        cacheAge?: string;
    } {
        const progress = {
            currentItems: this.locations.size,
            totalItems: this.totalItems,
            percentage: this.totalItems ? (this.locations.size / this.totalItems) * 100 : 0,
            currentPage: this.currentPage,
            totalPages: this.totalPages,
            totalFetchPages: this.TOTAL_FETCH_PAGES
        };

        if (this.lastFetchTime > 0) {
            return {
                ...progress,
                cacheAge: `${Math.round((Date.now() - this.lastFetchTime) / 1000)}s`
            };
        }

        return progress;
    }
}

export const locationService = new LocationService();

// Export methods
export const {
    searchLocations,
    getAllLocations,
    getCurrentPage,
    getTotalPages,
    getTotalItems,
    getLocationsInMapBounds,
    isInitialLoadComplete,
    getProgress,
    getTotalFetchPages,
    refreshLocations
} = locationService;
