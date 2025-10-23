import React from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const InventoryFilters = ({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  materialCounts 
}) => {
  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'fabric', label: 'Fabric' },
    { value: 'thread', label: 'Thread' },
    { value: 'buttons', label: 'Buttons' },
    { value: 'zippers', label: 'Zippers' },
    { value: 'labels', label: 'Labels' },
    { value: 'packaging', label: 'Packaging' }
  ];

  const locationOptions = [
    { value: 'all', label: 'All Locations' },
    { value: 'warehouse-a', label: 'Warehouse A' },
    { value: 'warehouse-b', label: 'Warehouse B' },
    { value: 'production-floor', label: 'Production Floor' },
    { value: 'quality-control', label: 'Quality Control' },
    { value: 'shipping', label: 'Shipping Area' }
  ];

  const supplierOptions = [
    { value: 'all', label: 'All Suppliers' },
    { value: 'textile-corp', label: 'Textile Corp' },
    { value: 'fabric-plus', label: 'Fabric Plus' },
    { value: 'thread-masters', label: 'Thread Masters' },
    { value: 'button-world', label: 'Button World' },
    { value: 'zip-solutions', label: 'Zip Solutions' }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Filter Materials</h2>
        <Button
          variant="ghost"
          size="sm"
          iconName="RotateCcw"
          onClick={onClearFilters}
        >
          Clear Filters
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Input
          label="Search Materials"
          type="search"
          placeholder="Search by name or SKU..."
          value={filters?.search}
          onChange={(e) => onFilterChange('search', e?.target?.value)}
        />

        <Select
          label="Category"
          options={categoryOptions}
          value={filters?.category}
          onChange={(value) => onFilterChange('category', value)}
        />

        <Select
          label="Location"
          options={locationOptions}
          value={filters?.location}
          onChange={(value) => onFilterChange('location', value)}
        />

        <Select
          label="Supplier"
          options={supplierOptions}
          value={filters?.supplier}
          onChange={(value) => onFilterChange('supplier', value)}
        />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Checkbox
          label="Low Stock Only"
          checked={filters?.lowStockOnly}
          onChange={(e) => onFilterChange('lowStockOnly', e?.target?.checked)}
        />

        <Checkbox
          label="Out of Stock"
          checked={filters?.outOfStockOnly}
          onChange={(e) => onFilterChange('outOfStockOnly', e?.target?.checked)}
        />

        <Checkbox
          label="Expiring Soon"
          checked={filters?.expiringSoon}
          onChange={(e) => onFilterChange('expiringSoon', e?.target?.checked)}
        />

        <div className="ml-auto flex items-center space-x-4 text-sm text-muted-foreground">
          <span>Total Materials: <span className="font-medium text-foreground">{materialCounts?.total}</span></span>
          <span>Low Stock: <span className="font-medium text-warning">{materialCounts?.lowStock}</span></span>
          <span>Out of Stock: <span className="font-medium text-destructive">{materialCounts?.outOfStock}</span></span>
        </div>
      </div>
    </div>
  );
};

export default InventoryFilters;