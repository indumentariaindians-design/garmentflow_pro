import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import KPICard from './components/KPICard';
import RealtimeEventsFeed from './components/RealtimeEventsFeed';
import AccountsReceivablePanel from './components/AccountsReceivablePanel';
import QuickActionButtons from './components/QuickActionButtons';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userRole] = useState('admin'); // Mock user role
  const [dashboardData, setDashboardData] = useState({
    wipByStage: {},
    delayedOrders: 0,
    rejectionRate: 0,
    throughputMetrics: {},
    lastUpdated: new Date()
  });

  // Mock KPI data
  const kpiData = [
  {
    title: 'Work in Progress',
    value: '247',
    subtitle: 'Items across all stages',
    icon: 'Package',
    color: 'blue',
    trend: 'up',
    trendValue: '+12%',
    onClick: () => navigate('/station-hub')
  },
  {
    title: 'Delayed Orders',
    value: '8',
    subtitle: 'Behind schedule',
    icon: 'Clock',
    color: 'red',
    trend: 'down',
    trendValue: '-3',
    onClick: () => navigate('/order-details')
  },
  {
    title: 'Quality Rate',
    value: '96.2%',
    subtitle: 'Pass rate this week',
    icon: 'CheckCircle',
    color: 'green',
    trend: 'up',
    trendValue: '+2.1%',
    onClick: () => navigate('/station-hub')
  },
  {
    title: 'Daily Throughput',
    value: '156',
    subtitle: 'Items completed today',
    icon: 'TrendingUp',
    color: 'purple',
    trend: 'up',
    trendValue: '+8%',
    onClick: () => navigate('/station-interface')
  },
  {
    title: 'Active Orders',
    value: '42',
    subtitle: 'In production',
    icon: 'FileText',
    color: 'orange',
    trend: 'up',
    trendValue: '+5',
    onClick: () => navigate('/order-details')
  },
  {
    title: 'Revenue Today',
    value: '$18,450',
    subtitle: 'Completed orders',
    icon: 'DollarSign',
    color: 'green',
    trend: 'up',
    trendValue: '+15%',
    onClick: () => navigate('/admin-panel')
  }];


  const stageMetrics = [
  { stage: 'Design', count: 12, capacity: 15, efficiency: 80 },
  { stage: 'Impresión', count: 28, capacity: 30, efficiency: 93 },
  { stage: 'Planchado', count: 35, capacity: 40, efficiency: 88 },
  { stage: 'Corte', count: 42, capacity: 45, efficiency: 93 },
  { stage: 'Estampado', count: 38, capacity: 50, efficiency: 76 },
  { stage: 'Confección', count: 45, capacity: 60, efficiency: 75 },
  { stage: 'QC', count: 32, capacity: 35, efficiency: 91 },
  { stage: 'Empaquetado', count: 15, capacity: 25, efficiency: 60 }];


  useEffect(() => {
    // Simulate data loading
    const loadDashboardData = () => {
      setDashboardData({
        wipByStage: stageMetrics?.reduce((acc, stage) => {
          acc[stage.stage] = stage?.count;
          return acc;
        }, {}),
        delayedOrders: 8,
        rejectionRate: 3.8,
        throughputMetrics: {
          daily: 156,
          weekly: 1092,
          monthly: 4680
        },
        lastUpdated: new Date()
      });
    };

    loadDashboardData();

    // Auto-refresh every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationSidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
        userRole={userRole} />

      <main className={`transition-all duration-300 ${isCollapsed ? 'lg:ml-16' : 'lg:ml-60'}`}>
        <div className="p-6 lg:p-8 bg-[rgba(245,245,245,0.6)]">
          <BreadcrumbTrail />
          
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Production Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                  Real-time overview of manufacturing operations and key performance indicators
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Last updated</p>
                  <p className="text-sm font-medium text-foreground">
                    {dashboardData?.lastUpdated?.toLocaleTimeString()}
                  </p>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" title="Live data" />
              </div>
            </div>
          </div>

          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {kpiData?.map((kpi, index) =>
            <KPICard
              key={index}
              title={kpi?.title}
              value={kpi?.value}
              subtitle={kpi?.subtitle}
              icon={kpi?.icon}
              color={kpi?.color}
              trend={kpi?.trend}
              trendValue={kpi?.trendValue}
              onClick={kpi?.onClick} />

            )}
          </div>

          {/* Production Stages Overview */}
          <div className="mb-8">
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Production Stages Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stageMetrics?.map((stage, index) =>
                <div key={index} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-gray-900">{stage?.stage}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                    stage?.efficiency >= 90 ? 'bg-green-100 text-green-800' :
                    stage?.efficiency >= 80 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`
                    }>
                        {stage?.efficiency}%
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Current</span>
                        <span className="font-medium">{stage?.count}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Capacity</span>
                        <span className="font-medium">{stage?.capacity}</span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                        className={`h-2 rounded-full ${
                        stage?.count / stage?.capacity >= 0.9 ? 'bg-red-500' :
                        stage?.count / stage?.capacity >= 0.7 ? 'bg-yellow-500' : 'bg-green-500'}`
                        }
                        style={{ width: `${Math.min(stage?.count / stage?.capacity * 100, 100)}%` }} />

                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Real-time Events Feed */}
            <div className="lg:col-span-2">
              <RealtimeEventsFeed />
            </div>
            
            {/* Accounts Receivable Panel */}
            <div className="lg:col-span-1">
              <AccountsReceivablePanel />
            </div>
          </div>

          {/* Quick Actions */}
          <QuickActionButtons />
        </div>
      </main>
    </div>);

};

export default Dashboard;