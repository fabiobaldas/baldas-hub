import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'

// Corrige ícones padrão do Leaflet no Next.js
const iconDefault = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

interface Condominio {
  id: number
  nome: string
  endereco: string
  unidades: string
  lat: number
  lng: number
}

interface Props {
  condominios: Condominio[]
  center: [number, number]
}

function AjustarVista({ condominios, center }: Props) {
  const map = useMap()
  useEffect(() => {
    if (condominios.length === 0) {
      map.setView(center, 13)
    } else if (condominios.length === 1) {
      map.setView([condominios[0].lat, condominios[0].lng], 15)
    } else {
      const bounds = L.latLngBounds(condominios.map(c => [c.lat, c.lng]))
      map.fitBounds(bounds, { padding: [40, 40] })
    }
  }, [condominios, center, map])
  return null
}

export default function MapaLeaflet({ condominios, center }: Props) {
  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '384px', borderRadius: '1rem', zIndex: 0 }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <AjustarVista condominios={condominios} center={center} />
      {condominios.map(c => (
        <Marker key={c.id} position={[c.lat, c.lng]} icon={iconDefault}>
          <Popup>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', minWidth: 160 }}>
              <p style={{ fontWeight: 700, color: '#0A3244', fontSize: 14, margin: '0 0 4px' }}>{c.nome}</p>
              <p style={{ color: '#4A6572', fontSize: 12, margin: '0 0 4px' }}>{c.endereco}</p>
              {c.unidades && (
                <p style={{ color: '#0d6e8a', fontSize: 12, fontWeight: 600, margin: 0 }}>{c.unidades} unidades</p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
