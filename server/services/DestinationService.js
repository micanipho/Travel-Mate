const MonitoredDestination = require('../models/MonitoredDestination')
const geoService = require('../utils/geoService') // optional utility if you extract geocode logic

class DestinationService {
    // Validate required fields for a destination
    static validateDestination(destinationData) {
        const requiredFields = ['location', 'userId', 'name'];

        for (const field of requiredFields) {
            if (!destinationData[field] || typeof destinationData[field] !== 'string') {
                throw new Error(`Invalid or missing field: ${field}`);
            }
        }

        // Optional: validate location length or format
        if (destinationData.location.length < 3) {
            throw new Error('Location name is too short.');
        }
    }

    // Simple rule-based risk calculation
    static calculateRiskLevel(destinationData) {
        const location = destinationData.location.toLowerCase();

        const highRiskAreas = ['kabul', 'mogadishu', 'baghdad', 'gaza'];
        const mediumRiskAreas = ['johannesburg', 'rio', 'mexico city'];

        if (highRiskAreas.includes(location)) {
            return 'High';
        } else if (mediumRiskAreas.includes(location)) {
            return 'Medium';
        } else {
            return 'Low';
        }
    }

    // Mocked geocoding function — can integrate real API later
    static async geocodeLocation(location) {
        // In production: integrate Mapbox, Google Maps, OpenStreetMap, etc.
        const fakeCoordinates = {
            'cape town': { latitude: -33.9249, longitude: 18.4241 },
            'johannesburg': { latitude: -26.2041, longitude: 28.0473 },
            'nairobi': { latitude: -1.2921, longitude: 36.8219 }
        };

        const coords = fakeCoordinates[location.toLowerCase()];
        if (!coords) {
            // fallback — generate fake but consistent values
            return { latitude: 0, longitude: 0 };
        }

        return coords;
    }

    // Create destination with all business logic
    static async createDestination(destinationData) {
        this.validateDestination(destinationData);

        const riskLevel = this.calculateRiskLevel(destinationData);
        const { latitude, longitude } = await this.geocodeLocation(destinationData.location);

        const newDestination = await MonitoredDestination.create({
            ...destinationData,
            riskLevel,
            latitude,
            longitude
        });

        return newDestination;
    }

    // Basic keyword search with optional filter logic
    static async searchDestinations(searchTerm, filters = {}) {
        const whereClause = {
            location: { $iLike: `%${searchTerm}%` }
        };

        if (filters.riskLevel) {
            whereClause.riskLevel = filters.riskLevel;
        }

        return await MonitoredDestination.findAll({ where: whereClause });
    }
}

module.exports = DestinationService;
