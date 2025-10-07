import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  alert: {
    title: string;
    message: string;
    priority: 'low' | 'medium' | 'high';
  };
  onChange: (field: string, value: string) => void;
  onSubmit: () => void;
}

export const AddAlertDialog = ({ open, onOpenChange, alert, onChange, onSubmit }: AddAlertDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Alert</DialogTitle>
          <DialogDescription>
            Create a new alert to notify about important updates.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="alertTitle">Title</Label>
            <Input
              id="alertTitle"
              placeholder="Enter alert title"
              value={alert.title}
              onChange={(e) => onChange('title', e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="alertMessage">Message</Label>
            <Textarea
              id="alertMessage"
              placeholder="Enter alert message"
              value={alert.message}
              onChange={(e) => onChange('message', e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="alertPriority">Priority</Label>
            <Select
              value={alert.priority}
              onValueChange={(value: 'low' | 'medium' | 'high') => onChange('priority', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>
            Create Alert
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

