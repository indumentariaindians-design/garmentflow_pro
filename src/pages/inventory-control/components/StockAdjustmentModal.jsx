import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const StockAdjustmentModal = ({ isOpen, onClose, onSave, material }) => {
  const [adjustmentData, setAdjustmentData] = useState({
    type: 'add',
    quantity: 0,
    reason: 'stock-count',
    lotCode: '',
    location: material?.location || 'warehouse-a',
    notes: '',
    costPerUnit: material?.costPerUnit || 0,
    supplierBatch: '',
    expiryDate: '',
    receivedDate: new Date()?.toISOString()?.split('T')?.[0]
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const adjustmentTypes = [
    { value: 'add', label: 'Add Stock' },
    { value: 'remove', label: 'Remove Stock' },
    { value: 'transfer', label: 'Transfer Stock' }
  ];

  const reasonOptions = [
    { value: 'stock-count', label: 'Physical Stock Count' },
    { value: 'damaged', label: 'Damaged Goods' },
    { value: 'expired', label: 'Expired Materials' },
    { value: 'returned', label: 'Customer Return' },
    { value: 'production-waste', label: 'Production Waste' },
    { value: 'theft-loss', label: 'Theft/Loss' },
    { value: 'supplier-error', label: 'Supplier Error' },
    { value: 'other', label: 'Other' }
  ];

  const locationOptions = [
    { value: 'warehouse-a', label: 'Warehouse A' },
    { value: 'warehouse-b', label: 'Warehouse B' },
    { value: 'production-floor', label: 'Production Floor' },
    { value: 'quality-control', label: 'Quality Control' },
    { value: 'shipping', label: 'Shipping Area' }
  ];

  const handleInputChange = (field, value) => {
    setAdjustmentData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!adjustmentData?.quantity || adjustmentData?.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }
    
    if (adjustmentData?.type === 'add' && !adjustmentData?.lotCode?.trim()) {
      newErrors.lotCode = 'Lot code is required for stock additions';
    }
    
    if (!adjustmentData?.notes?.trim()) {
      newErrors.notes = 'Notes are required for all adjustments';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onSave({
        ...adjustmentData,
        materialId: material?.id,
        timestamp: new Date()?.toISOString(),
        adjustmentId: `ADJ-${Date.now()}`
      });
      onClose();
    }
  };

  const generateLotCode = () => {
    const date = new Date();
    const dateStr = date?.toISOString()?.slice(0, 10)?.replace(/-/g, '');
    const randomNum = Math.floor(Math.random() * 1000)?.toString()?.padStart(3, '0');
    const lotCode = `LOT-${dateStr}-${randomNum}`;
    handleInputChange('lotCode', lotCode);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border border-border w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Stock Adjustment</h2>
            <p className="text-sm text-muted-foreground">{material?.name} - {material?.sku}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-6">
            {/* Current Stock Info */}
            <div className="bg-muted/20 rounded-lg p-4">
              <h3 className="font-medium text-foreground mb-2">Current Stock Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Current Stock:</span>
                  <span className="ml-2 font-medium text-foreground">
                    {material?.totalQuantity?.toLocaleString()} {material?.unit}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Location:</span>
                  <span className="ml-2 font-medium text-foreground">{material?.location}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Reorder Point:</span>
                  <span className="ml-2 font-medium text-foreground">
                    {material?.reorderPoint?.toLocaleString()} {material?.unit}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Active Lots:</span>
                  <span className="ml-2 font-medium text-foreground">{material?.lots?.length || 0}</span>
                </div>
              </div>
            </div>

            {/* Adjustment Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Adjustment Type"
                options={adjustmentTypes}
                value={adjustmentData?.type}
                onChange={(value) => handleInputChange('type', value)}
                required
              />

              <Input
                label={`Quantity to ${adjustmentData?.type === 'add' ? 'Add' : 'Remove'} (${material?.unit})`}
                type="number"
                placeholder="Enter quantity"
                value={adjustmentData?.quantity}
                onChange={(e) => handleInputChange('quantity', parseInt(e?.target?.value) || 0)}
                error={errors?.quantity}
                required
              />

              <Select
                label="Reason"
                options={reasonOptions}
                value={adjustmentData?.reason}
                onChange={(value) => handleInputChange('reason', value)}
                required
              />

              <Select
                label="Location"
                options={locationOptions}
                value={adjustmentData?.location}
                onChange={(value) => handleInputChange('location', value)}
                required
              />
            </div>

            {/* Lot Information (for additions) */}
            {adjustmentData?.type === 'add' && (
              <div className="space-y-4">
                <h3 className="font-medium text-foreground">Lot Information</h3>
                
                <div className="flex space-x-2">
                  <Input
                    label="Lot Code"
                    type="text"
                    placeholder="Enter lot code"
                    value={adjustmentData?.lotCode}
                    onChange={(e) => handleInputChange('lotCode', e?.target?.value)}
                    error={errors?.lotCode}
                    required
                    className="flex-1"
                  />
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      iconName="Shuffle"
                      onClick={generateLotCode}
                    >
                      Generate
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Supplier Batch"
                    type="text"
                    placeholder="Supplier batch number"
                    value={adjustmentData?.supplierBatch}
                    onChange={(e) => handleInputChange('supplierBatch', e?.target?.value)}
                  />

                  <Input
                    label="Cost per Unit ($)"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={adjustmentData?.costPerUnit}
                    onChange={(e) => handleInputChange('costPerUnit', parseFloat(e?.target?.value) || 0)}
                  />

                  <Input
                    label="Received Date"
                    type="date"
                    value={adjustmentData?.receivedDate}
                    onChange={(e) => handleInputChange('receivedDate', e?.target?.value)}
                    required
                  />

                  {material?.hasExpiry && (
                    <Input
                      label="Expiry Date"
                      type="date"
                      value={adjustmentData?.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', e?.target?.value)}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Notes */}
            <Input
              label="Notes"
              type="text"
              placeholder="Provide detailed notes for this adjustment"
              value={adjustmentData?.notes}
              onChange={(e) => handleInputChange('notes', e?.target?.value)}
              error={errors?.notes}
              required
            />

            {/* Impact Summary */}
            <div className="bg-muted/20 rounded-lg p-4">
              <h3 className="font-medium text-foreground mb-2">Adjustment Impact</h3>
              <div className="text-sm">
                <p className="text-muted-foreground">
                  Current Stock: <span className="text-foreground font-medium">{material?.totalQuantity?.toLocaleString()} {material?.unit}</span>
                </p>
                <p className="text-muted-foreground">
                  After Adjustment: 
                  <span className={`ml-1 font-medium ${
                    adjustmentData?.type === 'add' ? 'text-success' : 'text-warning'
                  }`}>
                    {adjustmentData?.type === 'add' 
                      ? (material?.totalQuantity + (adjustmentData?.quantity || 0))?.toLocaleString()
                      : (material?.totalQuantity - (adjustmentData?.quantity || 0))?.toLocaleString()
                    } {material?.unit}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              iconName={adjustmentData?.type === 'add' ? 'Plus' : 'Minus'}
              variant={adjustmentData?.type === 'add' ? 'default' : 'warning'}
            >
              {adjustmentData?.type === 'add' ? 'Add Stock' : 'Remove Stock'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockAdjustmentModal;