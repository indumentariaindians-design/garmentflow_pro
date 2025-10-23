import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const OrderHeader = ({ order, onStatusChange }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'On Hold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{order?.orderCode}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Icon name="Calendar" size={16} />
              <span>Created: {order?.createdDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Clock" size={16} />
              <span>Due: {order?.dueDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="AlertTriangle" size={16} className={getPriorityColor(order?.priority)} />
              <span className={getPriorityColor(order?.priority)}>{order?.priority} Priority</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(order?.status)}`}>
            {order?.status}
          </div>
          <Button variant="outline" iconName="Edit" iconPosition="left" size="sm">
            Edit Order
          </Button>
          <Button variant="default" iconName="Printer" iconPosition="left" size="sm">
            Print Labels
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Customer</h3>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Icon name="User" size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{order?.customer?.name}</p>
              <p className="text-sm text-gray-600">{order?.customer?.email}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Items</h3>
          <div className="flex items-center gap-2">
            <Icon name="Package" size={20} className="text-gray-400" />
            <span className="text-xl font-semibold text-gray-900">{order?.totalItems}</span>
            <span className="text-sm text-gray-600">pieces</span>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Order Value</h3>
          <div className="flex items-center gap-2">
            <Icon name="DollarSign" size={20} className="text-gray-400" />
            <span className="text-xl font-semibold text-gray-900">${order?.totalValue}</span>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Progress</h3>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${order?.completionPercentage}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-900">{order?.completionPercentage}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHeader;