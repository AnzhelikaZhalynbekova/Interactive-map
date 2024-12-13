import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = () => {
  const [markers, setMarkers] = useState([]);
  const [description, setDescription] = useState(""); // состояние для ввода описания
  const position = [51.505, -0.09]; // Центр карты

  // Устанавливаем Mapbox access token
  const mapboxToken = 'pk.eyJ1IjoiYW5nZWxsbCIsImEiOiJjbTRtbnR3OHEwYW9yMmpxdWdzcTd2M2RiIn0.WNUAUYs2yRQgCHl2St-Mng';

  // Mapbox TileLayer для отображения карты
  const mapboxLayerUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${mapboxToken}`;

  // Загрузка маркеров из localStorage при монтировании компонента
  useEffect(() => {
    const savedMarkers = localStorage.getItem('markers');
    if (savedMarkers) {
      setMarkers(JSON.parse(savedMarkers));
    }
  }, []);

  // Сохранение маркеров в localStorage
  const saveMarkersToLocalStorage = (updatedMarkers) => {
    localStorage.setItem('markers', JSON.stringify(updatedMarkers));
  };

  // Обработчик кликов по карте для добавления маркеров
  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        const newMarker = { latitude: lat, longitude: lng, description: "" };
        const updatedMarkers = [...markers, newMarker];
        setMarkers(updatedMarkers);
        saveMarkersToLocalStorage(updatedMarkers); // сохраняем маркеры в localStorage
      },
    });
    return null;
  };

  // Обработчик изменения текста в поле ввода
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  // Обработчик сохранения описания в маркер
  const handleSaveDescription = (index) => {
    const updatedMarkers = [...markers];
    updatedMarkers[index].description = description; // сохраняем описание в маркер
    setMarkers(updatedMarkers);
    saveMarkersToLocalStorage(updatedMarkers); // сохраняем обновленные маркеры в localStorage
    setDescription(""); // очищаем поле ввода после сохранения
  };

  return (
    <div>
      <MapContainer center={position} zoom={13} style={{ height: '100vh', width: '100%' }}>
        <TileLayer url={mapboxLayerUrl} attribution='&copy; <a href="https://www.mapbox.com/">Mapbox</a> contributors' />
        <MapClickHandler />
        
        {/* Добавление маркеров на карту */}
        {markers.map((marker, index) => (
          <Marker key={index} position={[marker.latitude, marker.longitude]}>
            <Popup>
              <div>
                <h3>Marker {index + 1}</h3>
                <p>Coordinates: {marker.latitude}, {marker.longitude}</p>
                
                {/* Поле ввода для описания маркера */}
                <textarea
                  placeholder="Add description"
                  value={description}
                  onChange={handleDescriptionChange} // обновляем состояние описания
                />
                
                {/* Кнопка для сохранения описания */}
                <button onClick={() => handleSaveDescription(index)}>Save Description</button>
                
                {/* Показываем описание, если оно есть */}
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
