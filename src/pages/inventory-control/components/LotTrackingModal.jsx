import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const LotTrackingModal = ({ isOpen, onClose, material, lots }) => {
  const [selectedLot, setSelectedLot] = useState(null);

  if (!isOpen) return null;

  const handleLotSelect = (lot) => {
    setSelectedLot(selectedLot?.id === lot?.id ? null : lot);
  };

  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return null;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return { status: 'expired', color: 'text-destructive', days: Math.abs(daysUntilExpiry) };
    if (daysUntilExpiry <= 30) return { status: 'expiring', color: 'text-warning', days: daysUntilExpiry };
    return { status: 'good', color: 'text-success', days: daysUntilExpiry };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border border-border w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Lot Tracking</h2>
            <p className="text-sm text-muted-foreground">{material?.name} - {material?.sku}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lot List */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">Available Lots</h3>
              <div className="space-y-3">
                {lots?.map((lot) => {
                  const expiryStatus = getExpiryStatus(lot?.expiryDate);
                  return (
                    <div
                      key={lot?.id}
                      onClick={() => handleLotSelect(lot)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedLot?.id === lot?.id
                          ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-muted/30'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-foreground">{lot?.lotCode}</h4>
                          <p className="text-sm text-muted-foreground">Received: {lot?.receivedDate}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-foreground">{lot?.quantity?.toLocaleString()} {material?.unit}</p>
                          <p className="text-sm text-muted-foreground">Used: {lot?.usedQuantity?.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Location: {lot?.location}</span>
                        {expiryStatus && (
                          <span className={`text-xs ${expiryStatus?.color}`}>
                            {expiryStatus?.status === 'expired' 
                              ? `Expired ${expiryStatus?.days} days ago`
                              : expiryStatus?.status === 'expiring'
                              ? `Expires in ${expiryStatus?.days} days`
                              : `${expiryStatus?.days} days remaining`
                            }
                          </span>
                        )}
                      </div>
                      {/* QR Code indicator */}
                      <div className="mt-2 flex items-center space-x-2">
                        <Icon name="QrCode" size={16} className="text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">QR: {lot?.qrCode}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Lot Details */}
            <div>
              {selectedLot ? (
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-4">Lot Details</h3>
                  <div className="bg-muted/20 rounded-lg p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Lot Code</p>
                        <p className="font-medium text-foreground">{selectedLot?.lotCode}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Supplier Batch</p>
                        <p className="font-medium text-foreground">{selectedLot?.supplierBatch}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Original Quantity</p>
                        <p className="font-medium text-foreground">{selectedLot?.quantity?.toLocaleString()} {material?.unit}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Remaining</p>
                        <p className="font-medium text-foreground">{(selectedLot?.quantity - selectedLot?.usedQuantity)?.toLocaleString()} {material?.unit}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Cost per Unit</p>
                        <p className="font-medium text-foreground">${selectedLot?.costPerUnit?.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Value</p>
                        <p className="font-medium text-foreground">${(selectedLot?.quantity * selectedLot?.costPerUnit)?.toFixed(2)}</p>
                      </div>
                    </div>

                    {selectedLot?.expiryDate && (
                      <div>
                        <p className="text-sm text-muted-foreground">Expiry Date</p>
                        <p className="font-medium text-foreground">{selectedLot?.expiryDate}</p>
                      </div>
                    )}

                    <div>
                      <p className="text-sm text-muted-foreground">Storage Requirements</p>
                      <p className="font-medium text-foreground">{selectedLot?.storageRequirements}</p>
                    </div>

                    {/* Usage History */}
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Recent Usage</h4>
                      <div className="space-y-2">
                        {selectedLot?.usageHistory?.map((usage, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{usage?.date}</span>
                            <span className="text-foreground">{usage?.quantity} {material?.unit}</span>
                            <span className="text-muted-foreground">{usage?.orderCode}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2 pt-4 border-t border-border">
                      <Button variant="outline" size="sm" iconName="ArrowRightLeft" fullWidth>
                        Transfer Lot
                      </Button>
                      <Button variant="outline" size="sm" iconName="Split" fullWidth>
                        Split Lot
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  <div className="text-center">
                    <Icon name="Package" size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Select a lot to view details</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LotTrackingModal;