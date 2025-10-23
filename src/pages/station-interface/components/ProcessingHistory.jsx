import React from 'react';
import Icon from '../../../components/AppIcon';

const ProcessingHistory = ({ history, currentStage }) => {
  const getActionIcon = (action) => {
    switch (action?.toLowerCase()) {
      case 'advance':
        return 'ArrowRight';
      case 'reject':
        return 'X';
      case 'hold':
        return 'Pause';
      case 'complete':
        return 'CheckCircle';
      default:
        return 'Circle';
    }
  };

  const getActionColor = (action) => {
    switch (action?.toLowerCase()) {
      case 'advance':
        return 'text-success';
      case 'reject':
        return 'text-destructive';
      case 'hold':
        return 'text-warning';
      case 'complete':
        return 'text-primary';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date?.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const isToday = date?.toDateString() === today?.toDateString();
    
    if (isToday) {
      return 'Today';
    }
    
    return date?.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (history?.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="History" size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Processing History</h2>
        </div>
        
        <div className="text-center py-8">
          <Icon name="Clock" size={48} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No processing history</p>
          <p className="text-sm text-muted-foreground mt-1">
            Completed items will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="History" size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Processing History</h2>
        </div>
        <span className="text-sm text-muted-foreground">{history?.length} items</span>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {history?.map((item, index) => (
          <div
            key={index}
            className="p-4 rounded-lg border border-border bg-muted/30"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-medium text-foreground">{item?.orderCode}</h3>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{item?.itemId}</span>
                </div>
                <p className="text-sm text-muted-foreground">{item?.productName}</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Icon 
                  name={getActionIcon(item?.action)} 
                  size={16} 
                  className={getActionColor(item?.action)}
                />
                <span className={`text-xs font-medium ${getActionColor(item?.action)}`}>
                  {item?.action?.charAt(0)?.toUpperCase() + item?.action?.slice(1)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mb-3">
              <div>
                <p className="text-muted-foreground">Quantity Processed</p>
                <p className="font-medium text-foreground">{item?.quantity} pcs</p>
              </div>
              <div>
                <p className="text-muted-foreground">Stage</p>
                <p className="font-medium text-foreground">{currentStage}</p>
              </div>
            </div>

            {item?.notes && (
              <div className="mb-3 p-2 bg-background rounded-md border border-border">
                <p className="text-xs text-muted-foreground mb-1">Processing Notes:</p>
                <p className="text-sm text-foreground">{item?.notes}</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Icon name="User" size={12} />
                <span>{item?.operator}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Icon name="Calendar" size={12} />
                <span>{formatDate(item?.timestamp)}</span>
                <span>•</span>
                <Icon name="Clock" size={12} />
                <span>{formatTime(item?.timestamp)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Summary Stats */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-semibold text-success">
              {history?.filter(item => item?.action === 'advance')?.length}
            </p>
            <p className="text-xs text-muted-foreground">Advanced</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-destructive">
              {history?.filter(item => item?.action === 'reject')?.length}
            </p>
            <p className="text-xs text-muted-foreground">Rejected</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-warning">
              {history?.filter(item => item?.action === 'hold')?.length}
            </p>
            <p className="text-xs text-muted-foreground">On Hold</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingHistory;