import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';

interface YandexMapProps {
  center: [number, number];
  zoom: number;
  onMapClick: (coords: [number, number]) => void;
  onLocationSelect: (coords: [number, number]) => void;
  markerCoords?: [number, number] | null;
}

interface YandexMapRef {
  setCenter: (center: [number, number], zoom?: number) => void;
}

declare global {
  interface Window {
    ymaps: any;
    YMapInit: () => void;
  }
}

const YandexMap = forwardRef<YandexMapRef, YandexMapProps>(({
  center,
  zoom,
  onMapClick,
  onLocationSelect,
  markerCoords
}, ref) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const markerRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    setCenter: (newCenter: [number, number], newZoom?: number) => {
      if (mapInstance) {
        mapInstance.setCenter(newCenter, newZoom ?? zoom, { duration: 300 });
      }
    }
  }));

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadYandexMaps = () => {
      if (window.ymaps) {
        initMap();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=YOUR_API_KEY';
      script.async = true;
      script.onload = () => {
        window.ymaps.ready(initMap);
      };
      document.head.appendChild(script);
    };

    const initMap = () => {
      if (!mapContainerRef.current || mapInstance) return;

      const map = new window.ymaps.Map(mapContainerRef.current, {
        center,
        zoom,
        controls: ['zoomControl', 'fullscreenControl', 'geolocationControl']
      }, {
        suppressMapOpenBlock: true,
        yandexMapAutoSwitch: false
      });

      setMapInstance(map);

      map.events.add('click', (e: any) => {
        const coords = e.get('coords');
        const newCoords: [number, number] = [coords[0], coords[1]];
        onMapClick(newCoords);
        onLocationSelect(newCoords);
        addMarker(newCoords);
      });

      if (markerCoords) {
        addMarker(markerCoords);
      }
    };

    const addMarker = (coords: [number, number]) => {
      if (!mapInstance) return;

      if (markerRef.current) {
        mapInstance.geoObjects.remove(markerRef.current);
      }

      const marker = new window.ymaps.Placemark(coords, {}, {
        preset: 'islands#redDotIcon',
        draggable: true
      });

      marker.events.add('dragend', (e: any) => {
        const newCoords = e.get('target').geometry.getCoordinates();
        onMapClick([newCoords[0], newCoords[1]]);
        onLocationSelect([newCoords[0], newCoords[1]]);
      });

      mapInstance.geoObjects.add(marker);
      markerRef.current = marker;
    };

    loadYandexMaps();

    return () => {
      if (mapInstance) {
        mapInstance.destroy();
        setMapInstance(null);
        markerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapInstance && markerCoords) {
      if (markerRef.current) {
        mapInstance.geoObjects.remove(markerRef.current);
      }

      const marker = new window.ymaps.Placemark(markerCoords, {}, {
        preset: 'islands#redDotIcon',
        draggable: true
      });

      marker.events.add('dragend', (e: any) => {
        const newCoords = e.get('target').geometry.getCoordinates();
        onMapClick([newCoords[0], newCoords[1]]);
        onLocationSelect([newCoords[0], newCoords[1]]);
      });

      mapInstance.geoObjects.add(marker);
      markerRef.current = marker;
      mapInstance.setCenter(markerCoords, zoom, { duration: 300 });
    }
  }, [markerCoords, zoom]);

  useEffect(() => {
    if (mapInstance) {
      mapInstance.setCenter(center, zoom, { duration: 300 });
    }
  }, [center, zoom]);

return (
    <div
      ref={mapContainerRef}
      style={{ width: '100%', height: '100%' }}
      className="rounded-2xl"
    />
  );
});

export default YandexMap;