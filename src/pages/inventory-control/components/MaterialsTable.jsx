import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MaterialsTable = ({ materials, onEdit, onTransfer, onAdjust, onSplitLot }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedMaterials = React.useMemo(() => {
    let sortableMaterials = [...materials];
    if (sortConfig?.key) {
      sortableMaterials?.sort((a, b) => {
        if (a?.[sortConfig?.key] < b?.[sortConfig?.key]) {
          return sortConfig?.direction === 'asc' ? -1 : 1;
        }
        if (a?.[sortConfig?.key] > b?.[sortConfig?.key]) {
          return sortConfig?.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableMaterials;
  }, [materials, sortConfig]);

  const getStockStatus = (quantity, reorderPoint) => {
    if (quantity === 0) return { status: 'out-of-stock', color: 'text-destructive', bg: 'bg-destructive/10' };
    if (quantity <= reorderPoint) return { status: 'low-stock', color: 'text-warning', bg: 'bg-warning/10' };
    return { status: 'in-stock', color: 'text-success', bg: 'bg-success/10' };
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig?.key !== columnKey) {
      return <Icon name="ArrowUpDown" size={16} className="text-muted-foreground" />;
    }
    return sortConfig?.direction === 'asc' 
      ? <Icon name="ArrowUp" size={16} className="text-foreground" />
      : <Icon name="ArrowDown" size={16} className="text-foreground" />;
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-2 font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span>Material</span>
                  {getSortIcon('name')}
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('category')}
                  className="flex items-center space-x-2 font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span>Category</span>
                  {getSortIcon('category')}
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('totalQuantity')}
                  className="flex items-center space-x-2 font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span>Stock</span>
                  {getSortIcon('totalQuantity')}
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('location')}
                  className="flex items-center space-x-2 font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span>Location</span>
                  {getSortIcon('location')}
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('supplier')}
                  className="flex items-center space-x-2 font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span>Supplier</span>
                  {getSortIcon('supplier')}
                </button>
              </th>
              <th className="text-left p-4">Status</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedMaterials?.map((material) => {
              const stockStatus = getStockStatus(material?.totalQuantity, material?.reorderPoint);
              return (
                <tr key={material?.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-foreground">{material?.name}</div>
                      <div className="text-sm text-muted-foreground">{material?.sku}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-secondary/20 text-secondary-foreground">
                      {material?.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-foreground">
                        {material?.totalQuantity?.toLocaleString()} {material?.unit}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {material?.lots?.length} lot{material?.lots?.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-foreground">{material?.location}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-foreground">{material?.supplier}</div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${stockStatus?.bg} ${stockStatus?.color}`}>
                      {stockStatus?.status?.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Edit"
                        onClick={() => onEdit(material)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="ArrowRightLeft"
                        onClick={() => onTransfer(material)}
                      >
                        Transfer
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Settings"
                        onClick={() => onAdjust(material)}
                      >
                        Adjust
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4 p-4">
        {sortedMaterials?.map((material) => {
          const stockStatus = getStockStatus(material?.totalQuantity, material?.reorderPoint);
          return (
            <div key={material?.id} className="bg-muted/20 rounded-lg p-4 border border-border">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">{material?.name}</h3>
                  <p className="text-sm text-muted-foreground">{material?.sku}</p>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${stockStatus?.bg} ${stockStatus?.color}`}>
                  {stockStatus?.status?.replace('-', ' ')}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground">Stock</p>
                  <p className="font-medium text-foreground">
                    {material?.totalQuantity?.toLocaleString()} {material?.unit}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="font-medium text-foreground">{material?.location}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Category</p>
                  <p className="font-medium text-foreground">{material?.category}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Lots</p>
                  <p className="font-medium text-foreground">{material?.lots?.length}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Edit"
                  onClick={() => onEdit(material)}
                  fullWidth
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="ArrowRightLeft"
                  onClick={() => onTransfer(material)}
                  fullWidth
                >
                  Transfer
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MaterialsTable;