import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ProcessingPanel = ({ scannedOrder, onProcessOrder, onClearOrder, currentStage }) => {
  const [processQuantity, setProcessQuantity] = useState('');
  const [actionType, setActionType] = useState('advance');
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const actionOptions = [
    { value: 'advance', label: 'Advance to Next Stage' },
    { value: 'reject', label: 'Reject Item' },
    { value: 'hold', label: 'Put on Hold' }
  ];

  const handleProcess = async () => {
    if (!processQuantity || !notes?.trim()) {
      return;
    }

    setIsProcessing(true);
    
    try {
      await onProcessOrder({
        orderCode: scannedOrder?.orderCode,
        itemId: scannedOrder?.itemId,
        action: actionType,
        quantity: parseInt(processQuantity),
        notes: notes?.trim(),
        timestamp: new Date()?.toISOString(),
        operator: 'Current User' // In real app, get from auth context
      });

      // Reset form
      setProcessQuantity('');
      setNotes('');
      setActionType('advance');
      
    } catch (error) {
      console.error('Processing failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getNextStage = () => {
    const stages = ['Design', 'Impresión', 'Planchado', 'Corte', 'Estampado', 'Confección', 'QC', 'Empaquetado'];
    const currentIndex = stages?.indexOf(currentStage);
    return currentIndex < stages?.length - 1 ? stages?.[currentIndex + 1] : 'Completed';
  };

  if (!scannedOrder) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Scan" size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Processing Panel</h2>
        </div>
        
        <div className="text-center py-8">
          <Icon name="ScanLine" size={48} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No order scanned</p>
          <p className="text-sm text-muted-foreground mt-1">
            Scan a QR code to begin processing
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="Scan" size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Processing Panel</h2>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onClearOrder}
          iconName="X"
        >
          Clear
        </Button>
      </div>
      {/* Scanned Order Details */}
      <div className="bg-muted/50 rounded-lg p-4 mb-6">
        <h3 className="font-medium text-foreground mb-3 flex items-center space-x-2">
          <Icon name="Package" size={16} />
          <span>Scanned Order Details</span>
        </h3>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Order Code</p>
            <p className="font-medium text-foreground">{scannedOrder?.orderCode}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Item ID</p>
            <p className="font-medium text-foreground">{scannedOrder?.itemId}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Product</p>
            <p className="font-medium text-foreground">{scannedOrder?.productName}</p>
          </div>
          <div>
            <p className="text-muted-foreground">SKU</p>
            <p className="font-medium text-foreground">{scannedOrder?.sku}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Color/Size</p>
            <p className="font-medium text-foreground">{scannedOrder?.color} / {scannedOrder?.size}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Total Quantity</p>
            <p className="font-medium text-foreground">{scannedOrder?.quantity} pcs</p>
          </div>
        </div>

        {scannedOrder?.priority && (
          <div className="mt-3 pt-3 border-t border-border">
            <span className={`
              inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
              ${scannedOrder?.priority === 'High' ? 'bg-destructive/10 text-destructive border border-destructive/20' :
                scannedOrder?.priority === 'Medium'? 'bg-warning/10 text-warning border border-warning/20' : 'bg-success/10 text-success border border-success/20'
              }
            `}>
              <Icon name="Flag" size={12} className="mr-1" />
              {scannedOrder?.priority} Priority
            </span>
          </div>
        )}
      </div>
      {/* Processing Actions */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Action Type"
            options={actionOptions}
            value={actionType}
            onChange={setActionType}
            required
          />
          
          <Input
            label="Process Quantity"
            type="number"
            placeholder="Enter quantity"
            value={processQuantity}
            onChange={(e) => setProcessQuantity(e?.target?.value)}
            min="1"
            max={scannedOrder?.quantity}
            required
            description={`Max: ${scannedOrder?.quantity} pcs`}
          />
        </div>

        <Input
          label="Processing Notes"
          type="text"
          placeholder="Enter notes about this processing action..."
          value={notes}
          onChange={(e) => setNotes(e?.target?.value)}
          required
          description="Required for audit trail and quality tracking"
        />

        {/* Action Preview */}
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Info" size={16} className="text-accent" />
            <span className="text-sm font-medium text-accent">Action Preview</span>
          </div>
          <p className="text-sm text-foreground">
            {actionType === 'advance' && `Move ${processQuantity || 'X'} pieces to ${getNextStage()}`}
            {actionType === 'reject' && `Reject ${processQuantity || 'X'} pieces for quality issues`}
            {actionType === 'hold' && `Put ${processQuantity || 'X'} pieces on hold for review`}
          </p>
        </div>

        {/* Process Button */}
        <div className="flex items-center space-x-3">
          <Button
            onClick={handleProcess}
            disabled={!processQuantity || !notes?.trim() || isProcessing}
            loading={isProcessing}
            iconName={actionType === 'advance' ? 'ArrowRight' : actionType === 'reject' ? 'X' : 'Pause'}
            iconPosition="left"
            variant={actionType === 'reject' ? 'destructive' : actionType === 'hold' ? 'warning' : 'default'}
            size="lg"
            className="flex-1"
          >
            {actionType === 'advance' && 'Process & Advance'}
            {actionType === 'reject' && 'Reject Items'}
            {actionType === 'hold' && 'Put on Hold'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProcessingPanel;