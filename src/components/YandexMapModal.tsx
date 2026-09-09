import { useEffect, useRef, useState } from 'react';
import { X, Search } from 'lucide-react';

interface YandexMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (coords: [number, number], address?: string) => void;
  initialCenter?: [number, number];
  initialZoom?: number;
}

declare global {
  interface Window {
    ymaps: any;
  }
}

export default function YandexMapModal({
  isOpen,
  onClose,
  onLocationSelect,
  initialCenter = [41.2995, 69.2401],
  initialZoom = 13
}: YandexMapModalProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasMarker, setHasMarker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const markerRef = useRef<any>(null);

  const reverseGeocode = (coords: [number, number], currentMapInstance: any, currentMarkerRef: React.MutableRefObject<any>) => {
    if (!currentMapInstance) return;
    
    fetch(`https://geocode-maps.yandex.ru/1.x/?format=json&geocode=${coords[1]},${coords[0]}&kind=house&results=1`)
      .then(response => response.json())
      .then(data => {
        const feature = data.response?.GeoObjectCollection?.featureMember?.[0]?.GeoObject;
        if (feature) {
          const address = feature.metaDataProperty?.GeocoderMetaData?.text;
          if (address && currentMarkerRef.current) {
            currentMarkerRef.current.properties.set('balloonContent', address);
          }
        }
      })
      .catch(e => console.error('Geocoding failed', e));
  };

  const addMarker = (coords: [number, number], currentMapInstance: any, currentMarkerRef: React.MutableRefObject<any>, setHasMarkerState: (val: boolean) => void) => {
    if (!currentMapInstance) return;

    if (currentMarkerRef.current) {
      currentMapInstance.geoObjects.remove(currentMarkerRef.current);
    }

    const marker = new window.ymaps.Placemark(coords, {}, {
      preset: 'islands#redDotIcon',
      draggable: true
    });

    marker.events.add('dragend', (e: any) => {
      const newCoords = e.get('target').geometry.getCoordinates();
      addMarker([newCoords[0], newCoords[1]], currentMapInstance, currentMarkerRef, setHasMarkerState);
      reverseGeocode([newCoords[0], newCoords[1]], currentMapInstance, currentMarkerRef);
    });

    currentMapInstance.geoObjects.add(marker);
    currentMarkerRef.current = marker;
    setHasMarkerState(true);
    currentMapInstance.setCenter(coords, currentMapInstance.getZoom(), { duration: 300 });
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (typeof window === 'undefined') return;

    let isMounted = true;

    const loadYandexMaps = () => {
      if (window.ymaps) {
        initMap();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=YOUR_API_KEY';
      script.async = true;
      script.onload = () => {
        if (isMounted) {
          window.ymaps.ready(initMap);
        }
      };
      document.head.appendChild(script);
    };

    const initMap = () => {
      if (!isMounted || !mapContainerRef.current || mapInstance) return;

      const map = new window.ymaps.Map(mapContainerRef.current, {
        center: initialCenter,
        zoom: initialZoom,
        controls: ['zoomControl', 'fullscreenControl', 'geolocationControl', 'searchControl']
      }, {
        suppressMapOpenBlock: true,
        yandexMapAutoSwitch: false
      });

      setMapInstance(map);
      setIsLoaded(true);

      map.events.add('click', (e: any) => {
        if (!isMounted) return;
        const coords = e.get('coords');
        const newCoords: [number, number] = [coords[0], coords[1]];
        addMarker(newCoords, map, markerRef, setHasMarker);
        reverseGeocode(newCoords, map, markerRef);
      });
    };

    loadYandexMaps();

    return () => {
      isMounted = false;
      if (mapInstance) {
        mapInstance.destroy();
        setMapInstance(null);
        setHasMarker(false);
        markerRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialCenter, initialZoom]);

  const handleSearch = async () => {
    if (!searchQuery.trim() || !mapInstance) return;

    try {
      const geocodeUrl = `https://geocode-maps.yandex.ru/1.x/?format=json&geocode=${encodeURIComponent(searchQuery)}&results=1`;
      const response = await fetch(geocodeUrl);
      const data = await response.json();
      const feature = data.response?.GeoObjectCollection?.featureMember?.[0]?.GeoObject;
      
      if (feature) {
        const pos = feature.Point.pos.split(' ').map(Number);
        const coords: [number, number] = [pos[1], pos[0]];
        addMarker(coords, mapInstance, markerRef, setHasMarker);
        mapInstance.setCenter(coords, 16, { duration: 300 });
      }
    } catch (e) {
      console.error('Search failed', e);
    }
  };

  const handleConfirm = () => {
    if (markerRef.current && mapInstance) {
      const coords = markerRef.current.geometry.getCoordinates();
      onLocationSelect([coords[0], coords[1]]);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-white sticky top-0 z-10">
        <h2 className="text-xl font-bold">Xaritadan manzilni tanlang</h2>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-muted flex items-center justify-center active:bg-muted/80 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-border bg-white sticky top-14 z-10">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Qidiruv: shahar, ko'cha, uy..."
              className="w-full pl-10 pr-4 py-3 border border-border rounded-xl outline-none focus:border-primary bg-background"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold active:bg-primary/90 transition-colors"
          >
            Qidirish
          </button>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative" style={{ minHeight: 0 }}>
        <div
          ref={mapContainerRef}
          style={{ width: '100%', height: '100%' }}
          className="absolute inset-0"
        />
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4" />
              <p className="text-muted-foreground">Xarita yuklanmoqda...</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border bg-white sticky bottom-0 z-10">
        <p className="text-sm text-muted-foreground text-center mb-3">
          Xaritani bosib yoki qidiruv orqali manzilni belgilang. Markerni surib to'g'rilashingiz mumkin.
        </p>
        <button
          onClick={handleConfirm}
          disabled={!hasMarker}
          className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed active:bg-primary/90 transition-colors"
        >
          Tanlash
        </button>
      </div>
    </div>
  );
}