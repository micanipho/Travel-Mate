import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Bell, Plus, CheckCircle, Eye } from "lucide-react";

interface AlertItem {
  id: number;
  title: string;
  message: string;
  status: 'read' | 'unread';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

interface AlertListProps {
  alerts: AlertItem[];
  loading: boolean;
  onAddClick: () => void;
}

export const AlertList = ({ alerts, loading, onAddClick }: AlertListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Alerts</CardTitle>
        <CardDescription>Stay updated with important notifications and alerts</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading alerts...</p>
          </div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts yet</h3>
            <p className="text-gray-600 mb-4">You'll see important notifications here</p>
            <Button onClick={onAddClick}>
              <Plus className="w-4 h-4 mr-2" />
              Create Alert
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <Alert key={alert.id} className={`${alert.status === 'unread' ? 'border-blue-200 bg-blue-50' : ''}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTitle className="text-sm font-medium">{alert.title}</AlertTitle>
                      <Badge variant={
                        alert.priority === 'high' ? 'destructive' :
                        alert.priority === 'medium' ? 'default' :
                        'secondary'
                      }>
                        {alert.priority}
                      </Badge>
                      {alert.status === 'unread' && (
                        <Badge variant="outline">New</Badge>
                      )}
                    </div>
                    <AlertDescription className="text-sm text-gray-600">
                      {alert.message}
                    </AlertDescription>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(alert.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {alert.status === 'unread' && (
                      <Button variant="outline" size="sm">
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

