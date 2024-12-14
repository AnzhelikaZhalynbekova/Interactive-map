import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = () => {
  const [markers, setMarkers] = useState([]);
  const [description, setDescription] = useState(""); 
  const position = [51.505, -0.09]; 

  // Mapbox access token
  const mapboxToken = 'pk.eyJ1IjoiYW5nZWxsbCIsImEiOiJjbTRtbnR3OHEwYW9yMmpxdWdzcTd2M2RiIn0.WNUAUYs2yRQgCHl2St-Mng';

  // Mapbox TileLayer 
  const mapboxLayerUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${mapboxToken}`;

  useEffect(() => {
    const savedMarkers = localStorage.getItem('markers');
    if (savedMarkers) {
      setMarkers(JSON.parse(savedMarkers));
    }
  }, []);

  const saveMarkersToLocalStorage = (updatedMarkers) => {
    localStorage.setItem('markers', JSON.stringify(updatedMarkers));
  };

  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        const newMarker = { latitude: lat, longitude: lng, description: "" };
        const updatedMarkers = [...markers, newMarker];
        setMarkers(updatedMarkers);
        saveMarkersToLocalStorage(updatedMarkers); 
      },
    });
    return null;
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSaveDescription = (index) => {
    const updatedMarkers = [...markers];
    updatedMarkers[index].description = description; 
    setMarkers(updatedMarkers);
    saveMarkersToLocalStorage(updatedMarkers); 
    setDescription(""); 
  };

  return (
    <div>
      <MapContainer center={position} zoom={13} style={{ height: '100vh', width: '100%' }}>
        <TileLayer url={mapboxLayerUrl} attribution='&copy; <a href="https://www.mapbox.com/">Mapbox</a> contributors' />
        <MapClickHandler />
        
        {markers.map((marker, index) => (
          <Marker key={index} position={[marker.latitude, marker.longitude]}>
            <Popup>
              <div>
                <h3>Marker {index + 1}</h3>
                <p>Coordinates: {marker.latitude}, {marker.longitude}</p>
                
                <textarea
                  placeholder="Add description"
                  value={description}
                  onChange={handleDescriptionChange} 
                />
                
              
                <button onClick={() => handleSaveDescription(index)}>Save Description</button>
                
                {marker.description && <p><strong>Description:</strong> {marker.description}</p>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
