import React, { useEffect, useState } from 'react';
import { Location } from '../../types/location';
import { locationService } from '../../services/locationService/locationService';
import { getLocationIcon } from '../../constants/locationTypes';
import './SearchResults.css';

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <div className="star-rating">
      {[...Array(5)].map((_, index) => (
        <span key={index} className={`star ${
          index < fullStars ? 'full' : 
          index === fullStars && hasHalfStar ? 'half' : 'empty'
        }`}>★</span>
      ))}
    </div>
  );
};

interface SearchResultsProps {
  query?: string;
  onSelectLocation?: (location: Location) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  query = '',
  onSelectLocation,
}) => {
  const [results, setResults] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const locations = await locationService.searchLocationsByQuery(query);
        setResults(locations);
      } catch (err) {
        setError('Failed to fetch locations');
        console.error('Error fetching locations:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, [query]);

  if (isLoading) {
    return <div className="search-loading">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!results || results.length === 0) {
    return <div className="no-results">No locations found</div>;
  }

  return (
    <div className="search-results">
      {results.map((location) => (
        <div
          key={location.id}
          className="location-item"
          onClick={() => onSelectLocation?.(location)}
        >
          <div className="location-icon">
            <i className={getLocationIcon(location.loai_diem_to)}></i>
          </div>
          <div className="location-info">
            <h3>{location.ten_diem}</h3>
            <p className="address">{location.thuoc_cong_ty}</p>
            <p className="type">
              {location.loai_diem_to} - {location.loai_diem_nho}
            </p>
            <p className="province">{location.tinh}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
