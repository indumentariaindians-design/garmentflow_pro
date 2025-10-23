import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import StationCard from './components/StationCard';
import ProductionMetrics from './components/ProductionMetrics';
import BottleneckAlert from './components/BottleneckAlert';
import QuickActions from './components/QuickActions';
import ShiftSummary from './components/ShiftSummary';

import Button from '../../components/ui/Button';

const StationHub = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data for production metrics
  const productionMetrics = [
    {
      type: 'throughput',
      label: 'Daily Throughput',
      value: '847',
      change: '+12%',
      trend: 'up'
    },
    {
      type: 'efficiency',
      label: 'Overall Efficiency',
      value: '87%',
      change: '+3%',
      trend: 'up'
    },
    {
      type: 'quality',
      label: 'Quality Rate',
      value: '94.2%',
      change: '-1.2%',
      trend: 'down'
    },
    {
      type: 'onTime',
      label: 'On-Time Delivery',
      value: '91%',
      change: '+5%',
      trend: 'up'
    }
  ];

  // Mock data for stations
  const stations = [
    {
      id: 'design',
      name: 'Design',
      description: 'Pattern creation and design approval',
      icon: 'Palette',
      status: 'active',
      activeOrders: 23,
      queueDepth: 8,
      avgProcessingTime: '2.5h',
      efficiency: 92,
      performanceTrend: 'up',
      capacityUsed: 78,
      assignedWorkers: 3,
      maxWorkers: 4,
      workers: [
        { name: 'Maria Rodriguez', initials: 'MR' },
        { name: 'Carlos Silva', initials: 'CS' },
        { name: 'Ana Lopez', initials: 'AL' }
      ]
    },
    {
      id: 'printing',
      name: 'Impresión',
      description: 'Digital printing and sublimation',
      icon: 'Printer',
      status: 'warning',
      activeOrders: 31,
      queueDepth: 15,
      avgProcessingTime: '1.8h',
      efficiency: 76,
      performanceTrend: 'down',
      capacityUsed: 95,
      assignedWorkers: 2,
      maxWorkers: 3,
      workers: [
        { name: 'Roberto Martinez', initials: 'RM' },
        { name: 'Sofia Garcia', initials: 'SG' }
      ]
    },
    {
      id: 'pressing',
      name: 'Planchado',
      description: 'Heat pressing and transfer application',
      icon: 'Flame',
      status: 'active',
      activeOrders: 18,
      queueDepth: 5,
      avgProcessingTime: '45m',
      efficiency: 88,
      performanceTrend: 'up',
      capacityUsed: 65,
      assignedWorkers: 2,
      maxWorkers: 2,
      workers: [
        { name: 'Luis Hernandez', initials: 'LH' },
        { name: 'Carmen Ruiz', initials: 'CR' }
      ]
    },
    {
      id: 'cutting',
      name: 'Corte',
      description: 'Fabric cutting and preparation',
      icon: 'Scissors',
      status: 'critical',
      activeOrders: 42,
      queueDepth: 28,
      avgProcessingTime: '3.2h',
      efficiency: 68,
      performanceTrend: 'down',
      capacityUsed: 98,
      assignedWorkers: 4,
      maxWorkers: 5,
      workers: [
        { name: 'Diego Morales', initials: 'DM' },
        { name: 'Patricia Vega', initials: 'PV' },
        { name: 'Miguel Torres', initials: 'MT' },
        { name: 'Elena Castro', initials: 'EC' }
      ]
    },
    {
      id: 'stamping',
      name: 'Estampado',
      description: 'Screen printing and embossing',
      icon: 'Stamp',
      status: 'active',
      activeOrders: 26,
      queueDepth: 12,
      avgProcessingTime: '2.1h',
      efficiency: 85,
      performanceTrend: 'stable',
      capacityUsed: 72,
      assignedWorkers: 3,
      maxWorkers: 4,
      workers: [
        { name: 'Fernando Jimenez', initials: 'FJ' },
        { name: 'Gabriela Mendez', initials: 'GM' },
        { name: 'Ricardo Flores', initials: 'RF' }
      ]
    },
    {
      id: 'sewing',
      name: 'Confección',
      description: 'Garment assembly and sewing',
      icon: 'Shirt',
      status: 'active',
      activeOrders: 35,
      queueDepth: 18,
      avgProcessingTime: '4.5h',
      efficiency: 91,
      performanceTrend: 'up',
      capacityUsed: 83,
      assignedWorkers: 6,
      maxWorkers: 8,
      workers: [
        { name: 'Isabella Santos', initials: 'IS' },
        { name: 'Alejandro Ramos', initials: 'AR' },
        { name: 'Valentina Cruz', initials: 'VC' },
        { name: 'Mateo Guerrero', initials: 'MG' },
        { name: 'Camila Vargas', initials: 'CV' },
        { name: 'Sebastian Ortiz', initials: 'SO' }
      ]
    },
    {
      id: 'qc',
      name: 'QC',
      description: 'Quality control and inspection',
      icon: 'Shield',
      status: 'active',
      activeOrders: 29,
      queueDepth: 11,
      avgProcessingTime: '30m',
      efficiency: 94,
      performanceTrend: 'up',
      capacityUsed: 58,
      assignedWorkers: 2,
      maxWorkers: 3,
      workers: [
        { name: 'Andrea Molina', initials: 'AM' },
        { name: 'Javier Peña', initials: 'JP' }
      ]
    },
    {
      id: 'packaging',
      name: 'Empaquetado',
      description: 'Final packaging and shipping prep',
      icon: 'Package',
      status: 'idle',
      activeOrders: 12,
      queueDepth: 3,
      avgProcessingTime: '15m',
      efficiency: 96,
      performanceTrend: 'stable',
      capacityUsed: 35,
      assignedWorkers: 2,
      maxWorkers: 3,
      workers: [
        { name: 'Natalia Romero', initials: 'NR' },
        { name: 'Emilio Delgado', initials: 'ED' }
      ]
    }
  ];

  // Mock data for bottlenecks
  const bottlenecks = [
    {
      id: 'btn-001',
      station: 'Corte Station',
      stationId: 'cutting',
      issue: 'Equipment malfunction causing processing delays',
      severity: 'critical',
      queueDepth: 28,
      estimatedDelay: '4.5 hours',
      affectedOrders: 42
    },
    {
      id: 'btn-002',
      station: 'Impresión Station',
      stationId: 'printing',
      issue: 'High queue volume exceeding capacity',
      severity: 'warning',
      queueDepth: 15,
      estimatedDelay: '2 hours',
      affectedOrders: 31
    }
  ];

  // Mock data for shift summary
  const shiftData = {
    shiftName: 'Day Shift',
    startTime: '08:00',
    endTime: '16:00',
    status: 'behind',
    completedOrders: 156,
    targetOrders: 180,
    activeWorkers: 24,
    totalWorkers: 28,
    qualityRate: 94.2,
    defectCount: 12,
    efficiency: 87,
    efficiencyTarget: 90,
    onScheduleStations: 5,
    delayedStations: 2,
    criticalStations: 1,
    timeRemaining: '3h 45m'
  };

  const handleViewStationDetails = (stationId) => {
    navigate(`/station-interface?station=${stationId}`);
  };

  const handleQuickAction = (action, target) => {
    console.log(`Executing ${action} on ${target}`);
    // Implement quick action logic here
  };

  const handleResolveBottleneck = (bottleneckId) => {
    console.log(`Resolving bottleneck: ${bottleneckId}`);
    // Implement bottleneck resolution logic here
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const customBreadcrumbs = [
    { label: 'Dashboard', path: '/dashboard', icon: 'BarChart3' },
    { label: 'Station Hub', path: '/station-hub', isLast: true }
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavigationSidebar 
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        userRole="manager"
      />
      <main className={`transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-60'}`}>
        <div className="p-6">
          <BreadcrumbTrail customBreadcrumbs={customBreadcrumbs} />
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Station Hub</h1>
              <p className="text-muted-foreground mt-1">
                Production oversight and real-time station monitoring
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                iconName="RefreshCw"
                iconPosition="left"
                loading={refreshing}
                onClick={handleRefresh}
              >
                Refresh
              </Button>
              <Button
                variant="default"
                iconName="BarChart3"
                iconPosition="left"
                onClick={() => navigate('/dashboard')}
              >
                View Dashboard
              </Button>
            </div>
          </div>

          {/* Production Metrics */}
          <ProductionMetrics metrics={productionMetrics} />

          {/* Shift Summary */}
          <ShiftSummary shiftData={shiftData} />

          {/* Bottleneck Alerts */}
          <BottleneckAlert 
            bottlenecks={bottlenecks}
            onResolve={handleResolveBottleneck}
          />

          {/* Quick Actions */}
          <QuickActions onAction={handleQuickAction} />

          {/* Station Grid */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Production Stations</h2>
                <p className="text-sm text-muted-foreground">
                  Real-time status and performance across all manufacturing stages
                </p>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-success rounded-full"></div>
                  <span>Active</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-warning rounded-full"></div>
                  <span>Warning</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-destructive rounded-full"></div>
                  <span>Critical</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-muted rounded-full"></div>
                  <span>Idle</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {stations?.map((station) => (
                <StationCard
                  key={station?.id}
                  station={station}
                  onViewDetails={handleViewStationDetails}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StationHub;