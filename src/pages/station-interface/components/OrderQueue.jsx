import React from 'react';
import Icon from '../../../components/AppIcon';

const OrderQueue = ({ orders, onSelectOrder, selectedOrderId }) => {
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'text-destructive bg-destructive/10 border-destructive/20';
      case 'medium':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'low':
        return 'text-success bg-success/10 border-success/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'Clock';
      case 'in-progress':
        return 'Play';
      case 'completed':
        return 'CheckCircle';
      case 'rejected':
        return 'XCircle';
      default:
        return 'Circle';
    }
  };

  if (orders?.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center space-x-2">
            <Icon name="List" size={20} className="text-primary" />
            <span>Order Queue</span>
          </h2>
          <span className="text-sm text-muted-foreground">0 items</span>
        </div>
        
        <div className="text-center py-8">
          <Icon name="Package" size={48} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No orders in queue</p>
          <p className="text-sm text-muted-foreground mt-1">
            Scan QR codes to add orders to your processing queue
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center space-x-2">
          <Icon name="List" size={20} className="text-primary" />
          <span>Order Queue</span>
        </h2>
        <span className="text-sm text-muted-foreground">{orders?.length} items</span>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {orders?.map((order) => (
          <div
            key={order?.id}
            onClick={() => onSelectOrder(order)}
            className={`
              p-4 rounded-lg border cursor-pointer transition-all duration-150
              ${selectedOrderId === order?.id
                ? 'border-primary bg-primary/5 shadow-sm'
                : 'border-border hover:border-primary/50 hover:bg-muted/50'
              }
            `}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-medium text-foreground">{order?.orderCode}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(order?.priority)}`}>
                    {order?.priority}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{order?.productName}</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Icon 
                  name={getStatusIcon(order?.status)} 
                  size={16} 
                  className={`
                    ${order?.status === 'completed' ? 'text-success' :
                      order?.status === 'rejected' ? 'text-destructive' :
                      order?.status === 'in-progress'? 'text-warning' : 'text-muted-foreground'
                    }
                  `}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">SKU</p>
                <p className="font-medium text-foreground">{order?.sku}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Quantity</p>
                <p className="font-medium text-foreground">{order?.quantity} pcs</p>
              </div>
              <div>
                <p className="text-muted-foreground">Color/Size</p>
                <p className="font-medium text-foreground">{order?.color} / {order?.size}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Due Date</p>
                <p className="font-medium text-foreground">{order?.dueDate}</p>
              </div>
            </div>

            {order?.notes && (
              <div className="mt-3 p-2 bg-muted rounded-md">
                <p className="text-xs text-muted-foreground mb-1">Notes:</p>
                <p className="text-sm text-foreground">{order?.notes}</p>
              </div>
            )}

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Icon name="Clock" size={12} />
                <span>Added {order?.addedTime}</span>
              </div>
              
              {order?.estimatedTime && (
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Icon name="Timer" size={12} />
                  <span>~{order?.estimatedTime} min</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderQueue;