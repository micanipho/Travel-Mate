import { Button } from "@/components/ui/button";
import { Plus, Bell } from "lucide-react";

interface DashboardHeaderProps {
  userName: string;
  onAddDestination: () => void;
  onAddAlert: () => void;
}

export const DashboardHeader = ({ userName, onAddDestination, onAddAlert }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {userName}!
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your travel destinations and stay updated with alerts
        </p>
      </div>
      <div className="flex gap-2">
        <Button className="bg-orange-300" onClick={onAddDestination}>
          <Plus className="w-4 h-4 mr-2" />
          Add Destination
        </Button>
        <Button variant="outline" onClick={onAddAlert}>
          <Bell className="w-4 h-4 mr-2" />
          Create Alert
        </Button>
      </div>
    </div>
  );
};
