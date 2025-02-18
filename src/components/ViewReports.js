import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';
import 'leaflet/dist/leaflet.css';
import { ref, onValue, off } from 'firebase/database';
import { db } from '../firebase';

const TILE_LAYER_URL = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

function ViewReports() {
  const [reports, setReports] = useState([]);
  const [center, setCenter] = useState([46.7712, 23.6236]); // Default to Cluj-Napoca
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    // Subscribe to reports
    const reportsRef = ref(db, 'reports');
    
    onValue(reportsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert object to array and add Firebase keys as ids
        const reportsArray = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value
        }));
        setReports(reportsArray);
      } else {
        setReports([]);
      }
      setLoading(false);
    });

    // Try to center map on user's location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.log("Error getting location:", error);
        }
      );
    }

    // Cleanup subscription
    return () => {
      off(reportsRef);
    };
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(language === 'ro' ? 'ro-RO' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="view-container">
      <h2>{t.viewPotholes}</h2>
      {loading ? (
        <div className="loading">{t.loadingReports}</div>
      ) : (
        <>
          <div className="map-container">
            <MapContainer
              center={center}
              zoom={13}
              style={{ height: '400px', width: '100%' }}
              className="map-style"
            >
              <TileLayer
                url={TILE_LAYER_URL}
                attribution={ATTRIBUTION}
              />
              {reports.map(report => (
                <Marker key={report.id} position={[report.location.lat, report.location.lng]}>
                  <Popup>
                    <div className="report-popup">
                      <p><strong>{t.severity}:</strong> {t[report.severity]}</p>
                      <p><strong>{t.description}:</strong> {report.description}</p>
                      <p><strong>{t.location}:</strong> {report.location.address}</p>
                      <p><strong>{t.reportedOn}:</strong> {formatDate(report.timestamp)}</p>
                      <p><strong>{t.status}:</strong> {t[report.status]}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          <div className="reports-list">
            {reports.length === 0 ? (
              <p className="no-reports">{t.noReports}</p>
            ) : (
              reports.map(report => (
                <div key={report.id} className="report-card">
                  <div className="report-header">
                    <span className={`severity-badge ${report.severity}`}>
                      {t[report.severity]}
                    </span>
                    <span className="report-date">{formatDate(report.timestamp)}</span>
                  </div>
                  <p className="report-description">{report.description}</p>
                  <p className="report-address">{report.location.address}</p>
                  <p className="report-status">{t[report.status]}</p>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default ViewReports; 