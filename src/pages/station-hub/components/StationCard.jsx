import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const StationCard = ({ station, onViewDetails }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-success text-success-foreground';
      case 'warning':
        return 'bg-warning text-warning-foreground';
      case 'critical':
        return 'bg-destructive text-destructive-foreground';
      case 'idle':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getPerformanceIcon = (trend) => {
    switch (trend) {
      case 'up':
        return { name: 'TrendingUp', color: 'text-success' };
      case 'down':
        return { name: 'TrendingDown', color: 'text-destructive' };
      default:
        return { name: 'Minus', color: 'text-muted-foreground' };
    }
  };

  const trendIcon = getPerformanceIcon(station?.performanceTrend);

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-all duration-200 group">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Icon name={station?.icon} size={20} color="white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{station?.name}</h3>
            <p className="text-sm text-muted-foreground">{station?.description}</p>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(station?.status)}`}>
          {station?.status?.charAt(0)?.toUpperCase() + station?.status?.slice(1)}
        </div>
      </div>
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">{station?.activeOrders}</div>
          <div className="text-xs text-muted-foreground">Active Orders</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">{station?.queueDepth}</div>
          <div className="text-xs text-muted-foreground">Queue Depth</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-foreground">{station?.avgProcessingTime}</div>
          <div className="text-xs text-muted-foreground">Avg Time</div>
        </div>
        <div className="text-center flex items-center justify-center space-x-1">
          <Icon name={trendIcon?.name} size={16} className={trendIcon?.color} />
          <div className="text-lg font-semibold text-foreground">{station?.efficiency}%</div>
        </div>
      </div>
      {/* Worker Assignment */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Workers</span>
          <span className="text-sm text-muted-foreground">{station?.assignedWorkers}/{station?.maxWorkers}</span>
        </div>
        <div className="flex space-x-2">
          {station?.workers?.map((worker, index) => (
            <div
              key={index}
              className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-xs font-medium text-secondary-foreground"
              title={worker?.name}
            >
              {worker?.initials}
            </div>
          ))}
          {station?.assignedWorkers < station?.maxWorkers && (
            <div className="w-8 h-8 border-2 border-dashed border-muted rounded-full flex items-center justify-center">
              <Icon name="Plus" size={12} className="text-muted-foreground" />
            </div>
          )}
        </div>
      </div>
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-muted-foreground">Capacity</span>
          <span className="text-sm font-medium text-foreground">{station?.capacityUsed}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              station?.capacityUsed > 90 ? 'bg-destructive' :
              station?.capacityUsed > 75 ? 'bg-warning' : 'bg-success'
            }`}
            style={{ width: `${Math.min(station?.capacityUsed, 100)}%` }}
          />
        </div>
      </div>
      {/* Action Button */}
      <Button
        variant="outline"
        fullWidth
        iconName="ArrowRight"
        iconPosition="right"
        onClick={() => onViewDetails(station?.id)}
        className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200"
      >
        View Station
      </Button>
    </div>
  );
};

export default StationCard;