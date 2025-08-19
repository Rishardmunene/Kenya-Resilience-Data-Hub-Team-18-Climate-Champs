# Kenya Geographic Data

This directory contains GeoJSON files with Kenya's geographic boundaries and administrative data.

## Files

### `kenya-boundaries.json`
- **Size**: ~10MB
- **Features**: 47 (Kenya's counties)
- **Type**: GeoJSON FeatureCollection
- **Source**: Kenya administrative boundaries
- **Usage**: Interactive mapping, region selection, spatial analysis

## Data Structure

The GeoJSON file contains:
- **47 county boundaries** with detailed polygon coordinates
- **County properties** including names and codes
- **High-resolution boundaries** for accurate mapping

## Usage in Application

### Loading the Data
```javascript
import { loadKenyaBoundaries, extractRegions } from '@/utils/geoData';

// Load Kenya boundaries
const geoJSON = await loadKenyaBoundaries();

// Extract regions for use in the application
const regions = extractRegions(geoJSON);
```

### Map Integration
```javascript
import { KenyaMap } from '@/components/maps/KenyaMap';

// Use in React component
<KenyaMap 
  showWeatherStations={true}
  showClimateData={true}
  onRegionClick={(region) => console.log('Selected:', region.name)}
/>
```

## Performance Considerations

- **File Size**: 10MB is large for web loading
- **Optimization**: Consider implementing lazy loading or data compression
- **Caching**: Browser caching will help with subsequent loads
- **CDN**: Consider hosting on a CDN for better performance

## Future Enhancements

1. **Data Compression**: Implement gzip compression
2. **Simplified Boundaries**: Create lower-resolution versions for different zoom levels
3. **County Data**: Add population, area, and other demographic data
4. **Climate Zones**: Add climate classification boundaries
5. **Protected Areas**: Add national parks and wildlife reserves

## Data Sources

- Kenya National Bureau of Statistics (KNBS)
- OpenStreetMap contributors
- Government of Kenya administrative data

## License

This data is used in accordance with the original data source licenses and is intended for educational and research purposes in the Kenya Climate Resilience Dashboard project.
