import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const RealtimeEventsFeed = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('all');

  // Mock real-time events data
  const mockEvents = [
    {
      id: 1,
      type: 'stage_progression',
      title: 'Order ORD-2024-00156 Advanced',
      description: 'Moved from Corte to Estampado stage',
      timestamp: new Date(Date.now() - 300000),
      icon: 'ArrowRight',
      color: 'green',
      station: 'Corte',
      orderCode: 'ORD-2024-00156'
    },
    {
      id: 2,
      type: 'quality_issue',
      title: 'Quality Alert - Batch Rejection',
      description: 'Batch rejected at QC station - fabric defect detected',
      timestamp: new Date(Date.now() - 600000),
      icon: 'AlertTriangle',
      color: 'red',
      station: 'QC',
      orderCode: 'ORD-2024-00148'
    },
    {
      id: 3,
      type: 'order_completion',
      title: 'Order Completed',
      description: 'ORD-2024-00142 successfully packaged and ready for shipping',
      timestamp: new Date(Date.now() - 900000),
      icon: 'CheckCircle',
      color: 'blue',
      station: 'Empaquetado',
      orderCode: 'ORD-2024-00142'
    },
    {
      id: 4,
      type: 'stage_progression',
      title: 'Bulk Processing Update',
      description: '15 items advanced from Impresión to Planchado',
      timestamp: new Date(Date.now() - 1200000),
      icon: 'Package',
      color: 'green',
      station: 'Impresión',
      orderCode: 'Multiple Orders'
    },
    {
      id: 5,
      type: 'inventory_alert',
      title: 'Low Stock Warning',
      description: 'Cotton fabric running low - 2 days remaining',
      timestamp: new Date(Date.now() - 1500000),
      icon: 'AlertCircle',
      color: 'orange',
      station: 'Inventory',
      orderCode: 'N/A'
    },
    {
      id: 6,
      type: 'stage_progression',
      title: 'Design Approval',
      description: 'Custom design approved for ORD-2024-00159',
      timestamp: new Date(Date.now() - 1800000),
      icon: 'Palette',
      color: 'purple',
      station: 'Design',
      orderCode: 'ORD-2024-00159'
    }
  ];

  useEffect(() => {
    setEvents(mockEvents);
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      const newEvent = {
        id: Date.now(),
        type: 'stage_progression',
        title: 'Real-time Update',
        description: `Order ORD-2024-${String(Math.floor(Math.random() * 1000))?.padStart(5, '0')} status updated`,
        timestamp: new Date(),
        icon: 'Activity',
        color: 'blue',
        station: ['Design', 'Corte', 'QC', 'Empaquetado']?.[Math.floor(Math.random() * 4)],
        orderCode: `ORD-2024-${String(Math.floor(Math.random() * 1000))?.padStart(5, '0')}`
      };
      
      setEvents(prev => [newEvent, ...prev?.slice(0, 9)]);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const filteredEvents = filter === 'all' 
    ? events 
    : events?.filter(event => event?.station?.toLowerCase() === filter?.toLowerCase());

  const getEventColor = (color) => {
    const colors = {
      green: 'text-green-600 bg-green-50',
      red: 'text-red-600 bg-red-50',
      blue: 'text-blue-600 bg-blue-50',
      orange: 'text-orange-600 bg-orange-50',
      purple: 'text-purple-600 bg-purple-50'
    };
    return colors?.[color] || 'text-gray-600 bg-gray-50';
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return timestamp?.toLocaleDateString();
  };

  const filterOptions = [
    { value: 'all', label: 'All Events' },
    { value: 'design', label: 'Design' },
    { value: 'corte', label: 'Corte' },
    { value: 'qc', label: 'QC' },
    { value: 'empaquetado', label: 'Empaquetado' }
  ];

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Icon name="Activity" size={24} className="text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Real-time Events</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e?.target?.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {filterOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Live updates active" />
        </div>
      </div>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredEvents?.map((event) => (
          <div key={event?.id} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-xl transition-colors duration-150">
            <div className={`p-2 rounded-lg ${getEventColor(event?.color)}`}>
              <Icon name={event?.icon} size={20} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 mb-1">
                    {event?.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {event?.description}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className="flex items-center space-x-1">
                      <Icon name="MapPin" size={12} />
                      <span>{event?.station}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Icon name="Package" size={12} />
                      <span>{event?.orderCode}</span>
                    </span>
                  </div>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                  {formatTimestamp(event?.timestamp)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredEvents?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Inbox" size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No events found for the selected filter</p>
        </div>
      )}
    </div>
  );
};

export default RealtimeEventsFeed;