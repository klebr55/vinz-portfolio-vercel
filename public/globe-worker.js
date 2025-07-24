/* eslint-disable @typescript-eslint/no-unused-vars */
// Web Worker para operações pesadas do Globe
self.onmessage = function(e) {
  const { type, data } = e.data;
  
  switch (type) {
    case 'PROCESS_GLOBE_DATA':
      // Processar dados do globe em background
      const processedData = processGlobeData(data);
      self.postMessage({ type: 'GLOBE_DATA_PROCESSED', data: processedData });
      break;
      
    case 'CALCULATE_ARCS':
      // Calcular arcos em background
      const arcs = calculateArcs(data);
      self.postMessage({ type: 'ARCS_CALCULATED', data: arcs });
      break;
      
    default:
      break;
  }
};

function processGlobeData(rawData) {
  // Processar dados de países e reduzir complexidade
  return rawData.features.map(feature => ({
    type: feature.type,
    properties: {
      ISO_A2: feature.properties.ISO_A2,
      ISO_A3: feature.properties.ISO_A3,
      NAME: feature.properties.NAME
    },
    geometry: {
      type: feature.geometry.type,
      coordinates: simplifyCoordinates(feature.geometry.coordinates)
    }
  }));
}

function simplifyCoordinates(coordinates) {
  // Simplificar coordenadas para reduzir complexidade
  if (Array.isArray(coordinates[0])) {
    return coordinates.map(coord => simplifyCoordinates(coord));
  }
  // Reduzir pontos por fator de 2 para melhor performance
  return coordinates.filter((_, index) => index % 2 === 0);
}

function calculateArcs(positions) {
  // Calcular arcos de forma otimizada
  return positions.map((pos, index) => ({
    order: pos.order,
    startLat: pos.startLat,
    startLng: pos.startLng,
    endLat: pos.endLat,
    endLng: pos.endLng,
    arcAlt: pos.arcAlt * 0.8, // Reduzir altitude para melhor performance
    color: pos.color
  }));
}
