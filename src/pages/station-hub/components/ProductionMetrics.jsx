import React from 'react';
import Icon from '../../../components/AppIcon';

const ProductionMetrics = ({ metrics }) => {
  const getMetricIcon = (type) => {
    switch (type) {
      case 'throughput':
        return 'Activity';
      case 'efficiency':
        return 'Gauge';
      case 'quality':
        return 'Shield';
      case 'onTime':
        return 'Clock';
      default:
        return 'BarChart3';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
        return 'text-success';
      case 'down':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return 'ArrowUp';
      case 'down':
        return 'ArrowDown';
      default:
        return 'Minus';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Production Overview</h2>
          <p className="text-sm text-muted-foreground">Real-time performance metrics across all stations</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Clock" size={16} />
          <span>Last updated: {new Date()?.toLocaleTimeString()}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics?.map((metric, index) => (
          <div key={index} className="text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name={getMetricIcon(metric?.type)} size={24} className="text-primary" />
              </div>
            </div>
            
            <div className="mb-2">
              <div className="text-2xl font-bold text-foreground">{metric?.value}</div>
              <div className="text-sm text-muted-foreground">{metric?.label}</div>
            </div>

            <div className={`flex items-center justify-center space-x-1 text-sm ${getTrendColor(metric?.trend)}`}>
              <Icon name={getTrendIcon(metric?.trend)} size={14} />
              <span>{metric?.change}</span>
              <span className="text-muted-foreground">vs yesterday</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductionMetrics;