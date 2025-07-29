import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  MapPin,
  Bell,
  Plus,
  AlertTriangle,
  Clock,
  Users,
  TrendingUp,
  Edit,
  Trash2,
  Eye,
  CheckCircle
} from "lucide-react";

// Types
interface Destination {
  id: number;
  location: string;
  riskLevel: number;
  latitude?: number;
  longitude?: number;
  lastChecked: string;
  createdAt: string;
}

interface AlertItem {
  id: number;
  title: string;
  message: string;
  status: 'read' | 'unread';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

interface DashboardStats {
  totalDestinations: number;
  unreadAlerts: number;
  recentActivity: number;
}

const Dashboard = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // State management - MUST be at the top before any conditional returns
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalDestinations: 0,
    unreadAlerts: 0,
    recentActivity: 0
  });
  const [loading, setLoading] = useState(true);
  const [isAddDestinationOpen, setIsAddDestinationOpen] = useState(false);
  const [isAddAlertOpen, setIsAddAlertOpen] = useState(false);

  // Form states
  const [newDestination, setNewDestination] = useState({
    location: '',
    riskLevel: 1,
    latitude: '',
    longitude: ''
  });

  const [newAlert, setNewAlert] = useState({
    title: '',
    message: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  // Function definitions must come before useEffect hooks that use them
  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load destinations
      try {
        const destinationsResponse = await apiRequest("GET", "/api/destinations");
        const destinationsData = await destinationsResponse.json();
        setDestinations(destinationsData.destinations || destinationsData || []);
      } catch (error) {
        console.log('Destinations endpoint not available yet, using empty array');
        setDestinations([]);
      }

      // Load alerts
      try {
        const alertsResponse = await apiRequest("GET", "/api/alerts");
        const alertsData = await alertsResponse.json();
        setAlerts(alertsData.alerts || alertsData || []);
      } catch (error) {
        console.log('Alerts endpoint not available yet, using empty array');
        setAlerts([]);
      }

      // Calculate stats
      const unreadCount = alerts.filter((alert: AlertItem) => alert.status === 'unread').length;
      setStats({
        totalDestinations: destinations.length,
        unreadAlerts: unreadCount,
        recentActivity: 1 // For now, just show account creation
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Don't show error toast for missing endpoints during development
      setDestinations([]);
      setAlerts([]);
      setStats({ totalDestinations: 0, unreadAlerts: 0, recentActivity: 1 });
    } finally {
      setLoading(false);
    }
  };

  const handleAddDestination = async () => {
    if (!newDestination.location.trim()) {
      toast({
        title: "Error",
        description: "Please enter a location",
        variant: "destructive",
      });
      return;
    }

    try {
      const destinationData = {
        location: newDestination.location,
        riskLevel: newDestination.riskLevel,
        ...(newDestination.latitude && { latitude: parseFloat(newDestination.latitude) }),
        ...(newDestination.longitude && { longitude: parseFloat(newDestination.longitude) })
      };

      const response = await apiRequest("POST", "/api/destinations", destinationData);
      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Destination added successfully",
        });
        setNewDestination({ location: '', riskLevel: 1, latitude: '', longitude: '' });
        setIsAddDestinationOpen(false);
        loadDashboardData(); // Reload data
      } else {
        throw new Error(data.message || 'Failed to add destination');
      }
    } catch (error) {
      console.error('Error adding destination:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add destination",
        variant: "destructive",
      });
    }
  };

  const handleAddAlert = async () => {
    if (!newAlert.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter an alert title",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await apiRequest("POST", "/api/alerts", newAlert);
      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Alert created successfully",
        });
        setNewAlert({ title: '', message: '', priority: 'medium' });
        setIsAddAlertOpen(false);
        loadDashboardData(); // Reload data
      } else {
        throw new Error(data.message || 'Failed to create alert');
      }
    } catch (error) {
      console.error('Error creating alert:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create alert",
        variant: "destructive",
      });
    }
  };

  // All useEffect hooks must be called before conditional returns
  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation('/login');
    }
  }, [isAuthenticated, isLoading, setLocation]);

  // Load dashboard data
  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - Travel Mate</title>
        <meta
          name="description"
          content="Your Travel Mate dashboard for managing taxi routes and alerts."
        />
      </Helmet>

      <div className="container mx-auto px-4 pt-24 pb-8 space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.firstName || 'User'}!
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your travel destinations and stay updated with alerts
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isAddDestinationOpen} onOpenChange={setIsAddDestinationOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Destination
                </Button>
              </DialogTrigger>
            </Dialog>

            <Dialog open={isAddAlertOpen} onOpenChange={setIsAddAlertOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Bell className="w-4 h-4 mr-2" />
                  Create Alert
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Destinations</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDestinations}</div>
              <p className="text-xs text-muted-foreground">
                Monitored locations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unread Alerts</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.unreadAlerts}</div>
              <p className="text-xs text-muted-foreground">
                Require attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.recentActivity}</div>
              <p className="text-xs text-muted-foreground">
                Actions this week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="destinations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="destinations">Destinations</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

          {/* Destinations Tab */}
          <TabsContent value="destinations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Monitored Destinations</CardTitle>
                <CardDescription>
                  Manage your saved taxi destinations and routes
                </CardDescription>
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
                    <Button onClick={() => setIsAddDestinationOpen(true)}>
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
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Alerts</CardTitle>
                <CardDescription>
                  Stay updated with important notifications and alerts
                </CardDescription>
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
                    <Button onClick={() => setIsAddAlertOpen(true)}>
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
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your recent actions and system updates
                </CardDescription>
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
          </TabsContent>
        </Tabs>

        {/* Add Destination Dialog */}
        <Dialog open={isAddDestinationOpen} onOpenChange={setIsAddDestinationOpen}>
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
                  value={newDestination.location}
                  onChange={(e) => setNewDestination(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="riskLevel">Risk Level (1-5)</Label>
                <Select
                  value={newDestination.riskLevel.toString()}
                  onValueChange={(value) => setNewDestination(prev => ({ ...prev, riskLevel: parseInt(value) }))}
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
                    value={newDestination.latitude}
                    onChange={(e) => setNewDestination(prev => ({ ...prev, latitude: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="longitude">Longitude (Optional)</Label>
                  <Input
                    id="longitude"
                    placeholder="28.0473"
                    value={newDestination.longitude}
                    onChange={(e) => setNewDestination(prev => ({ ...prev, longitude: e.target.value }))}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDestinationOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddDestination}>
                Add Destination
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Alert Dialog */}
        <Dialog open={isAddAlertOpen} onOpenChange={setIsAddAlertOpen}>
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
                  value={newAlert.title}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="alertMessage">Message</Label>
                <Textarea
                  id="alertMessage"
                  placeholder="Enter alert message"
                  value={newAlert.message}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, message: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="alertPriority">Priority</Label>
                <Select
                  value={newAlert.priority}
                  onValueChange={(value: 'low' | 'medium' | 'high') => setNewAlert(prev => ({ ...prev, priority: value }))}
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
              <Button variant="outline" onClick={() => setIsAddAlertOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddAlert}>
                Create Alert
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default Dashboard;