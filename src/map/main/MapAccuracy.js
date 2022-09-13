import { useId, useEffect } from 'react';
import circle from '@turf/circle';
import { useTheme } from '@mui/styles';
import { map } from '../core/MapView';

const MapAccuracy = ({ positions }) => {
  const id = useId();

  const theme = useTheme();

  useEffect(() => {
    map.addSource(id, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    });
    map.addLayer({
      source: id,
      id,
      type: 'fill',
      filter: [
        'all',
        ['==', '$type', 'Polygon'],
      ],
      paint: {
        'fill-color': theme.palette.colors.geometry,
        'fill-outline-color': theme.palette.colors.geometry,
        'fill-opacity': 0.25,
      },
    });

    return () => {
      if (map.getLayer(id)) {
        map.removeLayer(id);
      }
      if (map.getSource(id)) {
        map.removeSource(id);
      }
    };
  }, []);

  useEffect(() => {
    const data = {
      type: 'FeatureCollection',
      features: positions
        .filter((position) => position.accuracy > 0)
        .map((position) => circle([position.longitude, position.latitude], position.accuracy * 0.001)),
    };
    map.getSource(id).setData(data);
  }, [positions]);

  return null;
};

export default MapAccuracy;
