import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { MapPin, Bell, TrendingUp } from "lucide-react";

// Components
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { DestinationList } from "@/components/dashboard/DestinationList";
import { AlertList } from "@/components/dashboard/AlertList";
import { AddDestinationDialog } from "@/components/dashboard/AddDestinationDialog";
import { AddAlertDialog } from "@/components/dashboard/AddAlertDialog";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

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

  // State management
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

  // Data loading functions
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setDestinations([]);
      setAlerts([]);
      setStats({ totalDestinations: 0, unreadAlerts: 0, recentActivity: 1 });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setDestinations([]);
      setAlerts([]);
      setStats({ totalDestinations: 0, unreadAlerts: 0, recentActivity: 1 });
    } finally {
      setLoading(false);
    }
  };

  const loadAlerts = async () => {
    try {
      const alertsResponse = await apiRequest("GET", "/api/alerts?limit=20");
      const alertsData = await alertsResponse.json();

      if (alertsData.success && alertsData.alerts) {
        setAlerts(alertsData.alerts);
        const unreadCount = alertsData.alerts.filter((alert: AlertItem) => alert.status === 'unread').length;
        setStats(prev => ({ ...prev, unreadAlerts: unreadCount }));
      }
    } catch (error) {
      console.error('Error loading alerts:', error);
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
        loadDashboardData();
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
        loadDashboardData();
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

  const handleDestinationChange = (field: string, value: string | number) => {
    setNewDestination(prev => ({ ...prev, [field]: value }));
  };

  const handleAlertChange = (field: string, value: string) => {
    setNewAlert(prev => ({ ...prev, [field]: value }));
  };

  // Effects
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation('/login');
    }
  }, [isAuthenticated, isLoading, setLocation]);

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && !loading) {
      const timer = setTimeout(() => {
        loadAlerts();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, loading]);

  // Loading and auth checks
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - Travel Mate</title>
        <meta name="description" content="Your Travel Mate dashboard for managing taxi routes and alerts." />
      </Helmet>

      <div className="container mx-auto px-4 pt-24 pb-8 space-y-8">
        <DashboardHeader
          userName={user?.firstName || 'User'}
          onAddDestination={() => setIsAddDestinationOpen(true)}
          onAddAlert={() => setIsAddAlertOpen(true)}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Total Destinations"
            value={stats.totalDestinations}
            description="Monitored locations"
            icon={MapPin}
          />
          <StatsCard
            title="Unread Alerts"
            value={stats.unreadAlerts}
            description="Require attention"
            icon={Bell}
          />
          <StatsCard
            title="Recent Activity"
            value={stats.recentActivity}
            description="Actions this week"
            icon={TrendingUp}
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="destinations" className="space-y-6">
          <TabsList className="bg-gray-100 grid w-full grid-cols-3">
            <TabsTrigger value="destinations">Destinations</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="destinations" className="space-y-6">
            <DestinationList
              destinations={destinations}
              loading={loading}
              onAddClick={() => setIsAddDestinationOpen(true)}
            />
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <AlertList
              alerts={alerts}
              loading={loading}
              onAddClick={() => setIsAddAlertOpen(true)}
            />
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <RecentActivity />
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
        <AddDestinationDialog
          open={isAddDestinationOpen}
          onOpenChange={setIsAddDestinationOpen}
          destination={newDestination}
          onChange={handleDestinationChange}
          onSubmit={handleAddDestination}
        />

        <AddAlertDialog
          open={isAddAlertOpen}
          onOpenChange={setIsAddAlertOpen}
          alert={newAlert}
          onChange={handleAlertChange}
          onSubmit={handleAddAlert}
        />
      </div>
    </>
  );
};

export default Dashboard;

