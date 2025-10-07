import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddDestinationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  destination: {
    location: string;
    riskLevel: number;
    latitude: string;
    longitude: string;
  };
  onChange: (field: string, value: string | number) => void;
  onSubmit: () => void;
}

export const AddDestinationDialog = ({ open, onOpenChange, destination, onChange, onSubmit }: AddDestinationDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Destination</DialogTitle>
          <DialogDescription>
            Add a new destination to monitor for taxi routes and updates.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="Enter destination name or address"
              value={destination.location}
              onChange={(e) => onChange('location', e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="riskLevel">Risk Level (1-5)</Label>
            <Select
              value={destination.riskLevel.toString()}
              onValueChange={(value) => onChange('riskLevel', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select risk level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 - Very Safe</SelectItem>
                <SelectItem value="2">2 - Safe</SelectItem>
                <SelectItem value="3">3 - Moderate</SelectItem>
                <SelectItem value="4">4 - Risky</SelectItem>
                <SelectItem value="5">5 - Very Risky</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="latitude">Latitude (Optional)</Label>
              <Input
                id="latitude"
                placeholder="-26.2041"
                value={destination.latitude}
                onChange={(e) => onChange('latitude', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="longitude">Longitude (Optional)</Label>
              <Input
                id="longitude"
                placeholder="28.0473"
                value={destination.longitude}
                onChange={(e) => onChange('longitude', e.target.value)}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>
            Add Destination
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

