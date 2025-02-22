import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronRight, FaChevronLeft, FaSearch, FaTimes } from 'react-icons/fa';
import { IoLocationSharp, IoClose } from 'react-icons/io5';
import { MdTune, MdMyLocation, MdSend } from 'react-icons/md';
import { Location } from '../../types/location';
import { routingService } from '../../services/routingService/routingService';
import { apiManager } from '../../services/apiManager';
import './Sidebar.css';

// Define all possible location types
const ALL_LOCATION_TYPES = [
  'Company',
  'Factory',
  'MHE Provider',
  'Port',
  'Supermarket',
  'Transporter',
  'Warehouse'
];

interface SidebarProps {
  locations: Location[];
  searchQuery: string;
  onSearch: (query: string) => void;
  onSelectLocation: (location: Location, fromMarker?: boolean) => void;
  selectedLocation: Location | null;
  isLoading: boolean;
  error: string | null;
  selectedType: string | null;
  onLocationsUpdate: (locations: Location[]) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  locations = [],
  searchQuery,
  onSearch,
  onSelectLocation,
  selectedLocation: selectedLocationProp,
  isLoading,
  error,
  selectedType,
  onLocationsUpdate
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedTypes, setExpandedTypes] = useState<string[]>(['Company']);
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [isSelectingStart, setIsSelectingStart] = useState(true);
  const [selectedStartLocation, setSelectedStartLocation] = useState<Location | null>(null);
  const [selectedEndLocation, setSelectedEndLocation] = useState<Location | null>(null);
  const [routeInfo, setRouteInfo] = useState<{distance: number; duration: number} | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Log initial state
  useEffect(() => {
    console.log('🔄 Sidebar state:', {
      isSelectingStart,
      startLocation,
      endLocation,
      selectedLocationId,
      selectedStartLocation,
      selectedEndLocation
    });
  }, [isSelectingStart, startLocation, endLocation, selectedLocationId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, isStart: boolean) => {
    const value = e.target.value;
    if (isStart) {
      setStartLocation(value);
    } else {
      setEndLocation(value);
    }
  };

  const handleSearch = async (isStart: boolean) => {
    const value = isStart ? startLocation : endLocation;
    if (!value.trim()) return;

    setIsSearching(true);
    try {
      const result = await apiManager.searchLocations({
        district: value,
        page: 1,
        per_page: 5
      });
      console.log('Search results:', result); // Debug log
      
      // Ensure we have an array of locations
      const locations = Array.isArray(result.filteredLocations) ? result.filteredLocations : [];
      onLocationsUpdate(locations);
      
      // Update search query
      onSearch(value);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, isStart: boolean) => {
    if (e.key === 'Enter') {
      handleSearch(isStart);
    }
  };

  const handleInputFocus = (isStart: boolean) => {
    setIsSelectingStart(isStart);
  };

  const handleLocationClick = (location: Location) => {
    console.log('🎯 Location clicked:', {
      location,
      isSelectingStart,
      currentStartLocation: startLocation,
      currentEndLocation: endLocation
    });

    setSelectedLocationId(location.id);
    onSelectLocation(location);

    // Update start/end location based on selection mode
    if (isSelectingStart) {
      console.log('📍 Setting start location:', location.name);
      setStartLocation(location.name);
      setSelectedStartLocation(location);
    } else {
      console.log('🏁 Setting end location:', location.name);
      setEndLocation(location.name);
      setSelectedEndLocation(location);
    }

    // Log state after update
    console.log('✨ Updated locations:', {
      startLocation: isSelectingStart ? location.name : startLocation,
      endLocation: isSelectingStart ? endLocation : location.name,
      isSelectingStart
    });
  };

  const toggleStartEndMode = () => {
    console.log('🔄 Toggling selection mode:', {
      from: isSelectingStart ? 'start' : 'end',
      to: isSelectingStart ? 'end' : 'start'
    });
    setIsSelectingStart(!isSelectingStart);
  };

  useEffect(() => {
    if (selectedLocationProp) {
      setSelectedLocationId(selectedLocationProp.id);
    }
  }, [selectedLocationProp]);

  const getLocationsToDisplay = () => {
    console.log('Current locations:', locations); // Debug log
    
    if (!Array.isArray(locations)) {
      console.warn('Locations is not an array:', locations);
      return [];
    }

    return locations;
  };

  const renderLocationList = () => {
    const locationsToDisplay = getLocationsToDisplay();
    console.log('Locations to display:', locationsToDisplay); // Debug log

    if (isLoading) {
      return <div className="loading">Loading...</div>;
    }

    if (error) {
      return <div className="error">{error}</div>;
    }

    if (!locationsToDisplay || locationsToDisplay.length === 0) {
      return <div className="no-results">No locations found</div>;
    }

    return (
      <div className="locations-list">
        {locationsToDisplay.map((location, index) => {
          console.log('🗺️ Rendering location:', location.name);
          return (
            <div
              key={location.id || index}
              className={`location-item ${selectedLocationId === location.id ? 'selected' : ''}`}
              onClick={() => {
                console.log('👆 Clicking location:', location.name);
                handleLocationClick(location);
              }}
            >
              <IoLocationSharp className="location-icon" />
              <div className="location-info">
                <div className="location-name">{location.name}</div>
                <div className="location-details">
                  {location.address && (
                    <span className="location-address">{location.address}</span>
                  )}
                  {location.company && (
                    <span className="location-company">{location.company}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const handleSearchRoute = async () => {
    if (!selectedStartLocation || !selectedEndLocation || !routingService) {
      return;
    }

    try {
      const result = await routingService.findRoute(selectedStartLocation, selectedEndLocation);
      setRouteInfo({
        distance: result.distance,
        duration: result.duration
      });
    } catch (error) {
      console.error('Error finding route:', error);
      setRouteInfo(null);
    }
  };

  const formatDistance = (meters: number) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} km`;
    }
    return `${Math.round(meters)} m`;
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0) {
      return `${hours} giờ ${remainingMinutes} phút`;
    }
    return `${minutes} phút`;
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Tạo location object cho vị trí hiện tại
        const currentLocation: Location = {
          id: -1, // ID đặc biệt cho vị trí hiện tại
          name: `Vị trí hiện tại (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`,
          address: '',
          business_type: 'Current',
          company: '',
        };

        // Cập nhật vị trí vào input đang được focus
        if (isSelectingStart) {
          setStartLocation(currentLocation.name);
        } else {
          setEndLocation(currentLocation.name);
        }
      },
      (error) => {
        console.error('Error getting location:', error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  const handleClearInput = (isStart: boolean) => {
    if (isStart) {
      setStartLocation('');
    } else {
      setEndLocation('');
    }
    
    // Reset route info khi xóa bất kỳ location nào
    // setRouteInfo(null);
    
    // Xóa route trên map
    // if (routingService) {
    //   routingService.clearRoute();
    // }
  };

  const handleSendRouteInfo = () => {
    // TODO: Implement email sending functionality
    // console.log('Sending route info:', {
    //   startPoint: selectedStartLocation?.name,
    //   endPoint: selectedEndLocation?.name,
    //   distance: routeInfo?.distance,
    //   duration: routeInfo?.duration
    // });
  };

  const removeVietnameseTones = (str: string) => {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
    str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
    str = str.replace(/đ/g,"d");
    return str;
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button 
        className="sidebar-collapse-btn"
        onClick={toggleCollapse}
        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? <FaChevronLeft /> : <FaChevronRight />}
      </button>
      <div className="sidebar-content">
        <div className="search-section">
          {/* Search inputs */}
          <div className="search-inputs">
            <div className="input-wrapper">
              <FaSearch 
                className="search-icon" 
                onClick={() => handleSearch(true)}
                style={{ cursor: 'pointer' }}
              />
              <input
                type="text"
                className="search-input"
                placeholder="Start point..."
                value={startLocation}
                onChange={(e) => handleInputChange(e, true)}
                onKeyPress={(e) => handleKeyPress(e, true)}
                onFocus={() => {
                  console.log('🎯 Focus on start input');
                  setIsSelectingStart(true);
                }}
              />
              {startLocation && (
                <button
                  className="clear-input-button"
                  onClick={() => {
                    console.log('🧹 Clearing start location');
                    handleClearInput(true);
                  }}
                >
                  <IoClose />
                </button>
              )}
              <button 
                className="search-button"
                onClick={() => handleSearch(true)}
                disabled={isSearching}
              >
                <FaSearch className="search-icon" />
              </button>
            </div>
            <div className="destination-wrapper">
              <IoLocationSharp 
                className="destination-icon" 
                onClick={() => handleSearch(false)}
                style={{ cursor: 'pointer' }}
              />
              <input
                type="text"
                className="destination-input"
                placeholder="End point..."
                value={endLocation}
                onChange={(e) => handleInputChange(e, false)}
                onKeyPress={(e) => handleKeyPress(e, false)}
                onFocus={() => {
                  console.log('🎯 Focus on end input');
                  setIsSelectingStart(false);
                }}
              />
              {endLocation && (
                <button
                  className="clear-input-button"
                  onClick={() => {
                    console.log('🧹 Clearing end location');
                    handleClearInput(false);
                  }}
                >
                  <IoClose />
                </button>
              )}
              <button 
                className="search-button"
                onClick={() => handleSearch(false)}
                disabled={isSearching}
              >
                <FaSearch className="search-icon" />
              </button>
            </div>
          </div>

          {/* Route actions */}
          <div className="search-buttons">
            <button 
              className="search-action-button" 
              title="Get current location"
              onClick={handleGetCurrentLocation}
            >
              <MdMyLocation />
            </button>
            <button 
              className="search-action-button" 
              title="Search route"
              onClick={handleSearchRoute}
              disabled={!selectedStartLocation || !selectedEndLocation}
            >
              <MdSend />
            </button>
            <button
              className="search-action-button"
              title="Filter options"
              onClick={() => setShowFilters(!showFilters)}
            >
              <MdTune />
            </button>
          </div>
        </div>

        {/* Locations List */}
        {renderLocationList()}

        {/* Route Info */}
        {(selectedStartLocation && selectedEndLocation) && (
          <div className="route-info-section">
            <div className="route-info-header">Thông tin tuyến đường</div>
            <div className="route-info-content">
              <div className="route-info-item">
                <span className="route-info-label">Điểm đầu:</span>
                <span className="route-info-value">{selectedStartLocation.name}</span>
              </div>
              <div className="route-info-item">
                <span className="route-info-label">Điểm cuối:</span>
                <span className="route-info-value">{selectedEndLocation.name}</span>
              </div>
              {routeInfo && (
                <>
                  <div className="route-info-item">
                    <span className="route-info-label">Khoảng cách:</span>
                    <span className="route-info-value">{formatDistance(routeInfo.distance)}</span>
                  </div>
                  <div className="route-info-item">
                    <span className="route-info-label">Thời gian:</span>
                    <span className="route-info-value">{formatDuration(routeInfo.duration)}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
