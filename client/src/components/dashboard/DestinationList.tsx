import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Plus, AlertTriangle, Clock, Edit, Trash2 } from "lucide-react";

interface Destination {
  id: number;
  location: string;
  riskLevel: number;
  latitude?: number;
  longitude?: number;
  lastChecked: string;
  createdAt: string;
}

interface DestinationListProps {
  destinations: Destination[];
  loading: boolean;
  onAddClick: () => void;
}

export const DestinationList = ({ destinations, loading, onAddClick }: DestinationListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monitored Destinations</CardTitle>
        <CardDescription>Manage your saved taxi destinations and routes</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading destinations...</p>
          </div>
        ) : destinations.length === 0 ? (
          <div className="text-center py-8">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No destinations yet</h3>
            <p className="text-gray-600 mb-4">Start by adding your first destination</p>
            <Button onClick={onAddClick}>
              <Plus className="w-4 h-4 mr-2" />
              Add Destination
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {destinations.map((destination) => (
              <div key={destination.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{destination.location}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        Risk Level: {destination.riskLevel}/5
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Last checked: {new Date(destination.lastChecked).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

