import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';
import { ref, push } from 'firebase/database';
import { db } from '../firebase';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom map style URL - using a more modern style
const TILE_LAYER_URL = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

// Create a custom location icon
const locationIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzAwN2JmZiIgZD0iTTEyIDhhNCA0IDAgMTAwIDggNCA0IDAgMDAwLTh6Ii8+PC9zdmc+',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

function LocationMarker() {
  const [position, setPosition] = useState(null);
  const [accuracy, setAccuracy] = useState(0);
  const map = useMap();

  useEffect(() => {
    map.locate().on("locationfound", function (e) {
      setPosition(e.latlng);
      setAccuracy(Math.min(e.accuracy, 30));
      map.flyTo(e.latlng, 17);
    });
  }, [map]);

  return position ? (
    <>
      <Marker position={position} icon={locationIcon}>
      </Marker>
      <Circle
        center={position}
        radius={accuracy}
        pathOptions={{ color: '#007bff', fillColor: '#007bff', fillOpacity: 0.15 }}
      />
    </>
  ) : null;
}

function CenterButton({ map }) {
  const { language } = useLanguage();
  const t = translations[language];
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    map.locate().on("locationfound", function (e) {
      map.flyTo(e.latlng, 17);
      setLoading(false);
    }).on("locationerror", function () {
      alert(t.locationError);
      setLoading(false);
    });
  };

  return (
    <button 
      className="center-button" 
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? t.findingLocation : t.centerOnMe}
    </button>
  );
}

function MapControls() {
  const map = useMap();
  return <div className="map-controls"><CenterButton map={map} /></div>;
}

function MapEvents({ onLocationSelect }) {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng);
    },
  });
  return null;
}

function ReportPothole() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('medium');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialPosition, setInitialPosition] = useState([46.7712, 23.6236]); // Default to Cluj-Napoca
  const { language } = useLanguage();
  const t = translations[language];
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Try to get user's location when component mounts
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setInitialPosition([latitude, longitude]);
        },
        (error) => {
          console.log("Error getting location:", error);
          // Keep default coordinates if there's an error
        }
      );
    }
  }, []);

  const getAddressFromCoordinates = async (lat, lng) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=${language}`
      );
      const data = await response.json();
      setAddress(data.display_name);
    } catch (error) {
      console.error('Error fetching address:', error);
      setAddress('Address lookup failed');
    }
    setLoading(false);
  };

  const handleLocationSelect = (latlng) => {
    setSelectedLocation(latlng);
    getAddressFromCoordinates(latlng.lat, latlng.lng);
  };

  const handleMarkerDrag = (e) => {
    const newPos = e.target.getLatLng();
    setSelectedLocation(newPos);
    getAddressFromCoordinates(newPos.lat, newPos.lng);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const report = {
        location: {
          lat: selectedLocation.lat,
          lng: selectedLocation.lng,
          address
        },
        description,
        severity,
        email,
        timestamp: new Date().toISOString(),
        status: 'pending',
        language
      };

      // Save to Firebase
      const reportsRef = ref(db, 'reports');
      await push(reportsRef, report);

      alert(t.reportSubmitted);
      
      // Reset form
      setSelectedLocation(null);
      setDescription('');
      setSeverity('medium');
      setAddress('');
      setEmail('');
      
    } catch (error) {
      console.error('Error submitting report:', error);
      alert(t.submitError);
    }
    
    setLoading(false);
  };

  return (
    <div className="report-container">
      <h2>{t.reportPothole}</h2>
      <div className="map-container">
        <MapContainer
          center={initialPosition}
          zoom={17}
          style={{ height: '400px', width: '100%' }}
          className="map-style"
        >
          <TileLayer
            url={TILE_LAYER_URL}
            attribution={ATTRIBUTION}
          />
          <LocationMarker />
          <MapControls />
          <MapEvents onLocationSelect={handleLocationSelect} />
          {selectedLocation && (
            <Marker 
              position={selectedLocation}
              draggable={true}
              eventHandlers={{
                dragend: handleMarkerDrag,
              }}
            />
          )}
        </MapContainer>
      </div>

      {selectedLocation && (
        <div className="location-info">
          {loading ? (
            <p>{t.loadingAddress}</p>
          ) : (
            <p><strong>{t.location}:</strong> {address}</p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="report-form">
        <div className="form-group">
          <label>{t.description}:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder={language === 'ro' ? 'Descrieți starea gropii...' : 'Describe the pothole condition...'}
          />
        </div>

        <div className="form-group">
          <label>{t.severity}:</label>
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
          >
            <option value="low">{t.low}</option>
            <option value="medium">{t.medium}</option>
            <option value="high">{t.high}</option>
          </select>
        </div>

        <div className="form-group">
          <label>{t.email}:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder={t.emailPlaceholder}
          />
        </div>

        <button type="submit" disabled={!selectedLocation}>
          {t.submit}
        </button>
      </form>
    </div>
  );
}

export default ReportPothole; 