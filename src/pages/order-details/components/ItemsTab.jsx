import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const ItemsTab = ({ items, onUpdateItem }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getWorkflowColor = (workflow) => {
    return workflow === 'sublimado' 
      ? 'bg-purple-100 text-purple-800 border-purple-200' :'bg-blue-100 text-blue-800 border-blue-200';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Order Items</h3>
        <div className="flex gap-2">
          <Button variant="outline" iconName="Download" iconPosition="left" size="sm">
            Export Items
          </Button>
          <Button variant="outline" iconName="QrCode" iconPosition="left" size="sm">
            Print QR Codes
          </Button>
        </div>
      </div>
      <div className="grid gap-4">
        {items?.map((item) => (
          <div key={item?.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Product Image */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                  <Image 
                    src={item?.product?.image} 
                    alt={item?.product?.imageAlt}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Item Details */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">{item?.product?.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">SKU: {item?.product?.sku}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-2 py-1 rounded-full border text-xs font-medium ${getStatusColor(item?.status)}`}>
                        {item?.status?.replace('-', ' ')?.replace(/\b\w/g, l => l?.toUpperCase())}
                      </span>
                      <span className={`px-2 py-1 rounded-full border text-xs font-medium ${getWorkflowColor(item?.workflow)}`}>
                        {item?.workflow?.charAt(0)?.toUpperCase() + item?.workflow?.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Quantity</p>
                    <p className="text-xl font-semibold text-gray-900">{item?.quantity}</p>
                    <p className="text-sm text-gray-600">{item?.unit}</p>
                  </div>
                </div>

                {/* Specifications */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Size</p>
                    <p className="text-sm font-medium text-gray-900">{item?.specifications?.size}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Color</p>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: item?.specifications?.colorCode }}
                      ></div>
                      <p className="text-sm font-medium text-gray-900">{item?.specifications?.color}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Material</p>
                    <p className="text-sm font-medium text-gray-900">{item?.specifications?.material}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Unit Price</p>
                    <p className="text-sm font-medium text-gray-900">${item?.unitPrice}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium text-gray-700">Production Progress</p>
                    <p className="text-sm text-gray-600">{item?.completionPercentage}%</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${item?.completionPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Current Stage */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon name="MapPin" size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600">Current Stage:</span>
                    <span className="text-sm font-medium text-gray-900">{item?.currentStage}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      iconName="Eye"
                      onClick={() => setSelectedItem(item)}
                    >
                      View Details
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      iconName="Edit"
                      onClick={() => onUpdateItem(item?.id)}
                    >
                      Update
                    </Button>
                  </div>
                </div>

                {/* Notes */}
                {item?.notes && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-start gap-2">
                      <Icon name="MessageSquare" size={16} className="text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Latest Note</p>
                        <p className="text-sm text-gray-700">{item?.notes}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Item Details</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  iconName="X"
                  onClick={() => setSelectedItem(null)}
                />
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Product Name</p>
                    <p className="text-sm text-gray-900">{selectedItem?.product?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">SKU</p>
                    <p className="text-sm text-gray-900">{selectedItem?.product?.sku}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Quantity</p>
                    <p className="text-sm text-gray-900">{selectedItem?.quantity} {selectedItem?.unit}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Unit Price</p>
                    <p className="text-sm text-gray-900">${selectedItem?.unitPrice}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Total</p>
                    <p className="text-sm font-semibold text-gray-900">${selectedItem?.totalPrice}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemsTab;