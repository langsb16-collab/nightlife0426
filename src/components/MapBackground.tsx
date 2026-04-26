import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapBackground() {
  return (
    <div className="fixed inset-0 -z-20 opacity-30 grayscale contrast-125 brightness-50 pointer-events-none">
      <MapContainer
        center={[37.5665, 126.9780]} // Default to Seoul
        zoom={11}
        zoomControl={false}
        dragging={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        touchZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0F1C]/80 via-transparent to-[#0A0F1C]/80" />
    </div>
  );
}
