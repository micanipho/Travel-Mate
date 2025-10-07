import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const RecentActivity = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your recent actions and system updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 border rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium">Welcome to Travel Mate!</p>
              <p className="text-xs text-gray-600">Account created successfully</p>
            </div>
            <span className="text-xs text-gray-500">Just now</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

