import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import EnhancedToolbar from './components/Toolbar/EnhancedToolbar';
import Sidebar from './components/Sidebar/Sidebar';
import Map from './components/Map/Map';
import AddLocationForm from './components/AddLocationForm/AddLocationForm';
import Login from './components/Auth/Login/Login';
import Register from './components/Auth/Register/Register';
import ManageAccount from './components/Admin/ManageAccount/ManageAccount';
import { Location } from './types/location';
import { apiManager } from './services/apiManager';
import AuthService from './services/authService';
import UserService from './services/userService';
import './App.css';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string>('')
  const [locations, setLocations] = useState<Location[]>([])
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number]>([16.0472, 108.2099])
  const [mapZoom, setMapZoom] = useState(6)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    // Check for stored authentication
    const user = AuthService.getStoredUser();
    const token = AuthService.getStoredToken();
    const username = UserService.getStoredUsername();
    const roles = UserService.getStoredRoles();
    
    if (token && user && username) {
      console.log('🔑 Found stored authentication');
      setIsAuthenticated(true);
      setUserName(username);
      setUserRoles(roles);
    }
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        const initialState = await apiManager.loadInitialData();
        console.log('📥 Initial data loaded:', {
          locationsCount: initialState.locations?.length,
          currentPage: initialState.currentPage,
          totalPages: initialState.totalPages,
          totalItems: initialState.totalItems
        });

        const updates = {
          locations: initialState.locations || [],
          filteredLocations: initialState.locations || [],
          currentPage: initialState.currentPage,
          totalPages: initialState.totalPages,
          totalItems: initialState.totalItems,
          error: null,
          isLoading: false
        };

        setLocations(updates.locations);
        setFilteredLocations(updates.filteredLocations);
        setCurrentPage(updates.currentPage);
        setTotalPages(updates.totalPages);
        setTotalItems(updates.totalItems);
        setError(updates.error);
        setIsLoading(updates.isLoading);
      } catch (error) {
        console.error('❌ Initialization error:', error);
        setError('Failed to initialize app');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      loadInitialData();
    }
  }, [isAuthenticated]);

  const filteredLocationsData = useMemo(() => {
    if (!isAuthenticated || locations.length === 0) {
      return {
        filteredLocations: [],
        currentPage: 1,
        totalItems: 0,
        totalPages: 0
      };
    }

    if (!searchQuery && !selectedType) {
      return {
        filteredLocations: locations,
        currentPage: 1,
        totalItems: locations.length,
        totalPages: Math.ceil(locations.length / 10)
      };
    }

    const filtered = locations.filter(location => {
      const matchesQuery = !searchQuery || 
        location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.address?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = !selectedType || 
        location.business_type === selectedType;

      return matchesQuery && matchesType;
    });

    return {
      filteredLocations: filtered,
      currentPage: 1,
      totalItems: filtered.length,
      totalPages: Math.ceil(filtered.length / 10)
    };
  }, [searchQuery, selectedType, locations, isAuthenticated]);

  useEffect(() => {
    setFilteredLocations(filteredLocationsData.filteredLocations);
    setCurrentPage(filteredLocationsData.currentPage);
    setTotalItems(filteredLocationsData.totalItems);
    setTotalPages(filteredLocationsData.totalPages);
  }, [filteredLocationsData]);

  const handleLogin = async (response: { user: { username: string; roles: string[] } }) => {
    console.log('🎉 Login successful, updating app state');
    setIsAuthenticated(true);
    setUserName(response.user.username);
    setUserRoles(response.user.roles);
  };

  const handleLogout = () => {
    console.log('👋 Logging out user');
    AuthService.clearAuth();
    setIsAuthenticated(false);
    setUserName('');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleTypeSelect = (type: string) => {
    setSelectedType(type === selectedType ? '' : type)
  }

  const handleLocationSelect = (location: Location) => {
    console.log('🎯 Selecting location:', location);
    setSelectedLocation(location);
    
    if (location && 
        typeof location.latitude === 'number' && 
        typeof location.longitude === 'number' &&
        !isNaN(location.latitude) && 
        !isNaN(location.longitude) &&
        location.latitude !== 0 && 
        location.longitude !== 0) {
      console.log('📍 Updating map center to:', [location.latitude, location.longitude]);
      setMapCenter([location.latitude, location.longitude]);
      setMapZoom(15);
    }
  }

  const handleLocationsUpdate = (newLocations: Location[]) => {
    console.log('Updating locations:', newLocations) // Debug log
    setFilteredLocations(newLocations || [])
  }

  const fetchLocations = async () => {
    setIsLoading(true)
    try {
      const result = await apiManager.getLocations()
      console.log('Fetched locations:', result)
      setLocations(result)
      setFilteredLocations(result)
    } catch (err) {
      console.error('Failed to fetch locations:', err)
      setError('Failed to fetch locations')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddLocation = () => {
    setShowAddForm(true);
  };

  const handleCloseAddForm = () => {
    setShowAddForm(false);
  };

  const handleSubmitLocation = (locationData: any) => {
    console.log('New location data:', locationData);
    alert('Location added successfully! (This is a placeholder message)');
  };

  // Memoize MainApp with necessary dependencies
  const MainApp = useMemo(() => {
    console.log('🏗️ Creating MainApp component with:', {
      locationsCount: filteredLocations.length,
      selectedLocation: selectedLocation?.id,
      isLoading,
      error
    });

    return () => (
      <div className="app">
        <Header />
        <div className="main-content">
          <EnhancedToolbar
            onShowAll={fetchLocations}
            onAddLocation={() => setShowAddForm(true)}
            onLogout={handleLogout}
            userName={userName}
            userRoles={userRoles}
            isLoading={isLoading}
          />
          <div className="content">
            <Sidebar
              locations={filteredLocations}
              searchQuery={searchQuery}
              onSearch={handleSearch}
              onSelectLocation={handleLocationSelect}
              selectedLocation={selectedLocation}
              isLoading={isLoading}
              error={error}
              selectedType={selectedType}
              onLocationsUpdate={handleLocationsUpdate}
            />
            <Map
              locations={filteredLocations}
              selectedLocation={selectedLocation}
              onLocationSelect={handleLocationSelect}
            />
            {showAddForm && (
              <AddLocationForm
                onClose={() => setShowAddForm(false)}
                onSubmit={handleAddLocation}
              />
            )}
          </div>
        </div>
      </div>
    );
  }, [
    // Add dependencies that should trigger re-render
    filteredLocations,
    selectedLocation,
    isLoading,
    error,
    userName,
    userRoles,
    searchQuery,
    selectedType,
    showAddForm,
    // Add function dependencies
    fetchLocations,
    handleLogout,
    handleSearch,
    handleLocationSelect,
    handleLocationsUpdate,
    handleAddLocation
  ]);

  return (
    <Router>
      <Routes>
        <Route
          path="/manage-account"
          element={
            isAuthenticated && userRoles.includes('admin') ? (
              <ManageAccount />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <Login onLogin={handleLogin} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
        <Route path="/" element={isAuthenticated ? <MainApp /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
