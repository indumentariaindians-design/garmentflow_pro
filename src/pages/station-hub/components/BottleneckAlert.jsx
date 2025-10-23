import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BottleneckAlert = ({ bottlenecks, onResolve }) => {
  if (!bottlenecks || bottlenecks?.length === 0) {
    return null;
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-destructive/10 border-destructive text-destructive';
      case 'warning':
        return 'bg-warning/10 border-warning text-warning';
      default:
        return 'bg-muted border-border text-muted-foreground';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return 'AlertTriangle';
      case 'warning':
        return 'AlertCircle';
      default:
        return 'Info';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Icon name="AlertTriangle" size={20} className="text-warning" />
          <div>
            <h3 className="font-semibold text-foreground">Production Bottlenecks</h3>
            <p className="text-sm text-muted-foreground">Stations requiring immediate attention</p>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {bottlenecks?.length} issue{bottlenecks?.length !== 1 ? 's' : ''} detected
        </div>
      </div>
      <div className="space-y-3">
        {bottlenecks?.map((bottleneck, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${getSeverityColor(bottleneck?.severity)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <Icon name={getSeverityIcon(bottleneck?.severity)} size={20} />
                <div className="flex-1">
                  <div className="font-medium">{bottleneck?.station}</div>
                  <div className="text-sm opacity-90 mt-1">{bottleneck?.issue}</div>
                  <div className="flex items-center space-x-4 mt-2 text-xs">
                    <span>Queue: {bottleneck?.queueDepth} orders</span>
                    <span>Delay: {bottleneck?.estimatedDelay}</span>
                    <span>Impact: {bottleneck?.affectedOrders} orders</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Eye"
                  onClick={() => window.open(`/station-interface?station=${bottleneck?.stationId}`, '_blank')}
                >
                  View
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  iconName="CheckCircle"
                  onClick={() => onResolve(bottleneck?.id)}
                >
                  Resolve
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BottleneckAlert;