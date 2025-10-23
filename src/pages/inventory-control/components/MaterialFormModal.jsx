import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const MaterialFormModal = ({ isOpen, onClose, onSave, material = null, mode = 'add' }) => {
  const [formData, setFormData] = useState({
    name: material?.name || '',
    sku: material?.sku || '',
    category: material?.category || 'fabric',
    description: material?.description || '',
    unit: material?.unit || 'yards',
    reorderPoint: material?.reorderPoint || 100,
    maxStock: material?.maxStock || 1000,
    supplier: material?.supplier || '',
    supplierSku: material?.supplierSku || '',
    costPerUnit: material?.costPerUnit || 0,
    location: material?.location || 'warehouse-a',
    storageRequirements: material?.storageRequirements || 'Standard',
    hasExpiry: material?.hasExpiry || false,
    leadTimeDays: material?.leadTimeDays || 7,
    notes: material?.notes || ''
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const categoryOptions = [
    { value: 'fabric', label: 'Fabric' },
    { value: 'thread', label: 'Thread' },
    { value: 'buttons', label: 'Buttons' },
    { value: 'zippers', label: 'Zippers' },
    { value: 'labels', label: 'Labels' },
    { value: 'packaging', label: 'Packaging' }
  ];

  const unitOptions = [
    { value: 'yards', label: 'Yards' },
    { value: 'meters', label: 'Meters' },
    { value: 'pieces', label: 'Pieces' },
    { value: 'rolls', label: 'Rolls' },
    { value: 'spools', label: 'Spools' },
    { value: 'boxes', label: 'Boxes' }
  ];

  const locationOptions = [
    { value: 'warehouse-a', label: 'Warehouse A' },
    { value: 'warehouse-b', label: 'Warehouse B' },
    { value: 'production-floor', label: 'Production Floor' },
    { value: 'quality-control', label: 'Quality Control' },
    { value: 'shipping', label: 'Shipping Area' }
  ];

  const storageOptions = [
    { value: 'Standard', label: 'Standard' },
    { value: 'Climate Controlled', label: 'Climate Controlled' },
    { value: 'Dry Storage', label: 'Dry Storage' },
    { value: 'Refrigerated', label: 'Refrigerated' },
    { value: 'Hazardous', label: 'Hazardous Materials' }
  ];

  const supplierOptions = [
    { value: 'textile-corp', label: 'Textile Corp' },
    { value: 'fabric-plus', label: 'Fabric Plus' },
    { value: 'thread-masters', label: 'Thread Masters' },
    { value: 'button-world', label: 'Button World' },
    { value: 'zip-solutions', label: 'Zip Solutions' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.name?.trim()) newErrors.name = 'Material name is required';
    if (!formData?.sku?.trim()) newErrors.sku = 'SKU is required';
    if (!formData?.supplier) newErrors.supplier = 'Supplier is required';
    if (formData?.reorderPoint < 0) newErrors.reorderPoint = 'Reorder point must be positive';
    if (formData?.maxStock <= formData?.reorderPoint) newErrors.maxStock = 'Max stock must be greater than reorder point';
    if (formData?.costPerUnit < 0) newErrors.costPerUnit = 'Cost per unit must be positive';
    if (formData?.leadTimeDays < 1) newErrors.leadTimeDays = 'Lead time must be at least 1 day';

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  const generateSKU = () => {
    const categoryCode = formData?.category?.substring(0, 3)?.toUpperCase();
    const randomNum = Math.floor(Math.random() * 10000)?.toString()?.padStart(4, '0');
    const sku = `${categoryCode}-${randomNum}`;
    handleInputChange('sku', sku);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border border-border w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {mode === 'add' ? 'Add New Material' : 'Edit Material'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {mode === 'add' ? 'Create a new material entry' : 'Update material information'}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Basic Information</h3>
              
              <Input
                label="Material Name"
                type="text"
                placeholder="Enter material name"
                value={formData?.name}
                onChange={(e) => handleInputChange('name', e?.target?.value)}
                error={errors?.name}
                required
              />

              <div className="flex space-x-2">
                <Input
                  label="SKU"
                  type="text"
                  placeholder="Material SKU"
                  value={formData?.sku}
                  onChange={(e) => handleInputChange('sku', e?.target?.value)}
                  error={errors?.sku}
                  required
                  className="flex-1"
                />
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    iconName="Shuffle"
                    onClick={generateSKU}
                  >
                    Generate
                  </Button>
                </div>
              </div>

              <Select
                label="Category"
                options={categoryOptions}
                value={formData?.category}
                onChange={(value) => handleInputChange('category', value)}
                required
              />

              <Input
                label="Description"
                type="text"
                placeholder="Material description"
                value={formData?.description}
                onChange={(e) => handleInputChange('description', e?.target?.value)}
              />

              <Select
                label="Unit of Measurement"
                options={unitOptions}
                value={formData?.unit}
                onChange={(value) => handleInputChange('unit', value)}
                required
              />
            </div>

            {/* Inventory Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Inventory Settings</h3>
              
              <Input
                label="Reorder Point"
                type="number"
                placeholder="Minimum stock level"
                value={formData?.reorderPoint}
                onChange={(e) => handleInputChange('reorderPoint', parseInt(e?.target?.value) || 0)}
                error={errors?.reorderPoint}
                required
              />

              <Input
                label="Maximum Stock"
                type="number"
                placeholder="Maximum stock level"
                value={formData?.maxStock}
                onChange={(e) => handleInputChange('maxStock', parseInt(e?.target?.value) || 0)}
                error={errors?.maxStock}
                required
              />

              <Select
                label="Default Location"
                options={locationOptions}
                value={formData?.location}
                onChange={(value) => handleInputChange('location', value)}
                required
              />

              <Select
                label="Storage Requirements"
                options={storageOptions}
                value={formData?.storageRequirements}
                onChange={(value) => handleInputChange('storageRequirements', value)}
                required
              />

              <Checkbox
                label="Material has expiry date"
                checked={formData?.hasExpiry}
                onChange={(e) => handleInputChange('hasExpiry', e?.target?.checked)}
              />
            </div>

            {/* Supplier Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Supplier Information</h3>
              
              <Select
                label="Primary Supplier"
                options={supplierOptions}
                value={formData?.supplier}
                onChange={(value) => handleInputChange('supplier', value)}
                error={errors?.supplier}
                required
              />

              <Input
                label="Supplier SKU"
                type="text"
                placeholder="Supplier's product code"
                value={formData?.supplierSku}
                onChange={(e) => handleInputChange('supplierSku', e?.target?.value)}
              />

              <Input
                label="Cost per Unit ($)"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData?.costPerUnit}
                onChange={(e) => handleInputChange('costPerUnit', parseFloat(e?.target?.value) || 0)}
                error={errors?.costPerUnit}
                required
              />

              <Input
                label="Lead Time (Days)"
                type="number"
                placeholder="Delivery lead time"
                value={formData?.leadTimeDays}
                onChange={(e) => handleInputChange('leadTimeDays', parseInt(e?.target?.value) || 0)}
                error={errors?.leadTimeDays}
                required
              />
            </div>

            {/* Additional Notes */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Additional Information</h3>
              
              <Input
                label="Notes"
                type="text"
                placeholder="Additional notes or specifications"
                value={formData?.notes}
                onChange={(e) => handleInputChange('notes', e?.target?.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" iconName="Save">
              {mode === 'add' ? 'Add Material' : 'Update Material'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaterialFormModal;