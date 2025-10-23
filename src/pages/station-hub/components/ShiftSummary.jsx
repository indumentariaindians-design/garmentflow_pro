import React from 'react';
import Icon from '../../../components/AppIcon';

const ShiftSummary = ({ shiftData }) => {
  const getShiftStatus = (status) => {
    switch (status) {
      case 'on-track':
        return { color: 'text-success', bg: 'bg-success/10', icon: 'CheckCircle' };
      case 'behind':
        return { color: 'text-warning', bg: 'bg-warning/10', icon: 'Clock' };
      case 'critical':
        return { color: 'text-destructive', bg: 'bg-destructive/10', icon: 'AlertTriangle' };
      default:
        return { color: 'text-muted-foreground', bg: 'bg-muted', icon: 'Info' };
    }
  };

  const status = getShiftStatus(shiftData?.status);

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground">Current Shift Summary</h3>
          <p className="text-sm text-muted-foreground">
            {shiftData?.shiftName} • {shiftData?.startTime} - {shiftData?.endTime}
          </p>
        </div>
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${status?.bg}`}>
          <Icon name={status?.icon} size={16} className={status?.color} />
          <span className={`text-sm font-medium ${status?.color}`}>
            {shiftData?.status?.charAt(0)?.toUpperCase() + shiftData?.status?.slice(1)?.replace('-', ' ')}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">{shiftData?.completedOrders}</div>
          <div className="text-sm text-muted-foreground">Completed Orders</div>
          <div className="text-xs text-success mt-1">
            Target: {shiftData?.targetOrders}
          </div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">{shiftData?.activeWorkers}</div>
          <div className="text-sm text-muted-foreground">Active Workers</div>
          <div className="text-xs text-muted-foreground mt-1">
            Total: {shiftData?.totalWorkers}
          </div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">{shiftData?.qualityRate}%</div>
          <div className="text-sm text-muted-foreground">Quality Rate</div>
          <div className="text-xs text-muted-foreground mt-1">
            Defects: {shiftData?.defectCount}
          </div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">{shiftData?.efficiency}%</div>
          <div className="text-sm text-muted-foreground">Efficiency</div>
          <div className="text-xs text-muted-foreground mt-1">
            vs Target: {shiftData?.efficiencyTarget}%
          </div>
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <span className="text-muted-foreground">On Schedule: {shiftData?.onScheduleStations}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-warning rounded-full"></div>
              <span className="text-muted-foreground">Delayed: {shiftData?.delayedStations}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-destructive rounded-full"></div>
              <span className="text-muted-foreground">Critical: {shiftData?.criticalStations}</span>
            </div>
          </div>
          <div className="text-muted-foreground">
            Time Remaining: {shiftData?.timeRemaining}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShiftSummary;