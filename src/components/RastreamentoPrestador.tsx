import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Clock } from 'lucide-react';
import { Agendamento, Prestador, Endereco } from '../types';

// Ícone customizado para prestador em movimento
const createMovingIcon = (isMoving: boolean) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${isMoving ? '#10b981' : '#6b7280'};
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        animation: ${isMoving ? 'pulse 2s infinite' : 'none'};
      ">
        <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </div>
      <style>
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
      </style>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

// Componente para ajustar o zoom do mapa automaticamente
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  
  return null;
}

interface RastreamentoPrestadorProps {
  agendamento: Agendamento;
  prestador: Prestador;
  enderecoDestino: Endereco;
}

const RastreamentoPrestador: React.FC<RastreamentoPrestadorProps> = ({
  agendamento,
  prestador,
  enderecoDestino,
}) => {
  const [prestadorPosition, setPrestadorPosition] = useState<[number, number]>(
    prestador.localizacao 
      ? [prestador.localizacao.latitude, prestador.localizacao.longitude]
      : [-23.5505, -46.6333]
  );
  
  const [isMoving, setIsMoving] = useState(false);
  const [distanciaRestante, setDistanciaRestante] = useState<number>(0);
  const [tempoEstimado, setTempoEstimado] = useState<string>('');
  const [progresso, setProgresso] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const destino: [number, number] = enderecoDestino.latitude && enderecoDestino.longitude
    ? [enderecoDestino.latitude, enderecoDestino.longitude]
    : [-23.5505, -46.6333];

  // Função para calcular distância entre dois pontos (Haversine)
  const calcularDistancia = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Simular movimento do prestador
  useEffect(() => {
    if (!prestador.localizacao) return;

    const origem: [number, number] = [
      prestador.localizacao.latitude,
      prestador.localizacao.longitude
    ];

    const distanciaTotal = calcularDistancia(
      origem[0], origem[1],
      destino[0], destino[1]
    );

    let currentLat = origem[0];
    let currentLon = origem[1];
    let distanciaPercorrida = 0;
    setIsMoving(true);

    // Simular movimento a cada 2 segundos
    intervalRef.current = setInterval(() => {
      const distanciaAtual = calcularDistancia(
        currentLat, currentLon,
        destino[0], destino[1]
      );

      // Se chegou ao destino
      if (distanciaAtual < 0.01) {
        setIsMoving(false);
        setDistanciaRestante(0);
        setTempoEstimado('Chegou!');
        setProgresso(100);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        return;
      }

      // Calcular direção
      const dLat = destino[0] - currentLat;
      const dLon = destino[1] - currentLon;
      
      // Mover em direção ao destino (simulação de ~30 km/h)
      const velocidade = 0.00015; // Aproximadamente 30 km/h em graus
      const passo = velocidade * 2; // A cada 2 segundos

      currentLat += (dLat * passo) / distanciaAtual;
      currentLon += (dLon * passo) / distanciaAtual;

      setPrestadorPosition([currentLat, currentLon]);
      
      const novaDistancia = calcularDistancia(
        currentLat, currentLon,
        destino[0], destino[1]
      );
      
      distanciaPercorrida = distanciaTotal - novaDistancia;
      setDistanciaRestante(novaDistancia);
      setProgresso((distanciaPercorrida / distanciaTotal) * 100);
      
      // Calcular tempo estimado (assumindo 30 km/h)
      const tempoMinutos = Math.ceil((novaDistancia / 30) * 60);
      setTempoEstimado(tempoMinutos > 0 ? `${tempoMinutos} min` : 'Chegando...');
    }, 2000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [prestador.localizacao, destino]);

  const center: [number, number] = [
    (prestadorPosition[0] + destino[0]) / 2,
    (prestadorPosition[1] + destino[1]) / 2,
  ];

  return (
    <div className="space-y-4">
      {/* Informações de rastreamento */}
      <div className="card bg-gradient-to-r from-primary-50 to-blue-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <Navigation className={`w-6 h-6 text-primary-600 ${isMoving ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="font-semibold text-primary-700">
                {isMoving ? 'A caminho' : 'Chegou ao destino'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Distância</p>
              <p className="font-semibold text-green-700">
                {distanciaRestante.toFixed(2)} km
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tempo estimado</p>
              <p className="font-semibold text-yellow-700">{tempoEstimado}</p>
            </div>
          </div>
        </div>

        {/* Barra de progresso */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progresso da viagem</span>
            <span>{Math.round(progresso)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${progresso}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Mapa */}
      <div className="card p-0 overflow-hidden">
        <div className="h-96 w-full">
          <MapContainer
            center={center}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            
            <MapUpdater center={center} />
            
            {/* Rota */}
            <Polyline
              positions={[prestadorPosition, destino]}
              color="#0ea5e9"
              weight={4}
              opacity={0.7}
              dashArray="10, 5"
            />
            
            {/* Prestador */}
            <Marker position={prestadorPosition} icon={createMovingIcon(isMoving)}>
              <Popup>
                <div>
                  <p className="font-semibold">{prestador.nome}</p>
                  <p className="text-sm text-gray-600">
                    {isMoving ? '🚗 A caminho' : '📍 Chegou'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {distanciaRestante.toFixed(2)} km restantes
                  </p>
                </div>
              </Popup>
            </Marker>
            
            {/* Destino */}
            <Marker position={destino}>
              <Popup>
                <div>
                  <p className="font-semibold">📍 Destino</p>
                  <p className="text-sm text-gray-600">
                    {enderecoDestino.rua}, {enderecoDestino.numero}
                  </p>
                  <p className="text-xs text-gray-500">
                    {enderecoDestino.bairro} - {enderecoDestino.cidade}
                  </p>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default RastreamentoPrestador;

