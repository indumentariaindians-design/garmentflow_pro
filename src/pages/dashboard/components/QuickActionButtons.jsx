import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActionButtons = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      id: 1,
      title: 'Review Delayed Orders',
      description: '8 orders behind schedule',
      icon: 'Clock',
      color: 'red',
      urgent: true,
      onClick: () => navigate('/order-details')
    },
    {
      id: 2,
      title: 'Quality Alerts',
      description: '3 items need attention',
      icon: 'AlertTriangle',
      color: 'orange',
      urgent: true,
      onClick: () => navigate('/station-hub')
    },
    {
      id: 3,
      title: 'Station Status',
      description: 'Monitor production flow',
      icon: 'Monitor',
      color: 'blue',
      urgent: false,
      onClick: () => navigate('/station-interface')
    },
    {
      id: 4,
      title: 'Inventory Check',
      description: 'Low stock warnings',
      icon: 'Package',
      color: 'purple',
      urgent: false,
      onClick: () => navigate('/inventory-control')
    }
  ];

  const getButtonVariant = (color, urgent) => {
    if (urgent) {
      return color === 'red' ? 'destructive' : 'warning';
    }
    return 'outline';
  };

  const getIconColor = (color) => {
    const colors = {
      red: 'text-red-600',
      orange: 'text-orange-600',
      blue: 'text-blue-600',
      purple: 'text-purple-600'
    };
    return colors?.[color] || 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-purple-50 rounded-lg">
          <Icon name="Zap" size={24} className="text-purple-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quickActions?.map((action) => (
          <Button
            key={action?.id}
            variant={getButtonVariant(action?.color, action?.urgent)}
            onClick={action?.onClick}
            className="h-auto p-4 justify-start text-left"
            fullWidth
          >
            <div className="flex items-start space-x-4 w-full">
              <div className={`p-2 rounded-lg bg-white ${getIconColor(action?.color)}`}>
                <Icon name={action?.icon} size={20} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-sm font-medium">{action?.title}</h3>
                  {action?.urgent && (
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  )}
                </div>
                <p className="text-xs opacity-70">{action?.description}</p>
              </div>
              
              <Icon name="ChevronRight" size={16} className="opacity-50" />
            </div>
          </Button>
        ))}
      </div>
      {/* Additional Quick Links */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => navigate('/admin-panel')}
            className="flex flex-col items-center space-y-2 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-150"
          >
            <Icon name="Settings" size={20} className="text-gray-600" />
            <span className="text-xs text-gray-600">Admin Panel</span>
          </button>
          
          <button
            onClick={() => navigate('/order-details')}
            className="flex flex-col items-center space-y-2 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-150"
          >
            <Icon name="FileText" size={20} className="text-gray-600" />
            <span className="text-xs text-gray-600">Orders</span>
          </button>
          
          <button
            onClick={() => navigate('/inventory-control')}
            className="flex flex-col items-center space-y-2 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-150"
          >
            <Icon name="Archive" size={20} className="text-gray-600" />
            <span className="text-xs text-gray-600">Inventory</span>
          </button>
          
          <button
            onClick={() => navigate('/station-hub')}
            className="flex flex-col items-center space-y-2 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-150"
          >
            <Icon name="Grid3X3" size={20} className="text-gray-600" />
            <span className="text-xs text-gray-600">Stations</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickActionButtons;