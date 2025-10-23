import React, { useState, useMemo } from 'react';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import MaterialsTable from './components/MaterialsTable';
import InventoryFilters from './components/InventoryFilters';
import LotTrackingModal from './components/LotTrackingModal';
import MaterialFormModal from './components/MaterialFormModal';
import StockAdjustmentModal from './components/StockAdjustmentModal';

const InventoryControl = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [showLotTracking, setShowLotTracking] = useState(false);
  const [showMaterialForm, setShowMaterialForm] = useState(false);
  const [showStockAdjustment, setShowStockAdjustment] = useState(false);
  const [materialFormMode, setMaterialFormMode] = useState('add');

  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    location: 'all',
    supplier: 'all',
    lowStockOnly: false,
    outOfStockOnly: false,
    expiringSoon: false
  });

  // Mock materials data
  const mockMaterials = [
    {
      id: 1,
      name: "Premium Cotton Fabric",
      sku: "FAB-001",
      category: "fabric",
      description: "100% organic cotton fabric for premium garments",
      unit: "yards",
      totalQuantity: 2450,
      reorderPoint: 500,
      maxStock: 5000,
      supplier: "textile-corp",
      supplierSku: "TC-COT-001",
      costPerUnit: 12.50,
      location: "warehouse-a",
      storageRequirements: "Climate Controlled",
      hasExpiry: false,
      leadTimeDays: 14,
      notes: "Premium quality for high-end products",
      lots: [
        {
          id: 101,
          lotCode: "LOT-20241015-001",
          quantity: 1000,
          usedQuantity: 150,
          supplierBatch: "TC-B2024-045",
          receivedDate: "2024-10-15",
          expiryDate: null,
          costPerUnit: 12.50,
          location: "warehouse-a",
          storageRequirements: "Climate Controlled",
          qrCode: "QR-LOT-20241015-001",
          usageHistory: [
            { date: "2024-10-20", quantity: 50, orderCode: "ORD-2024-00123" },
            { date: "2024-10-18", quantity: 75, orderCode: "ORD-2024-00118" },
            { date: "2024-10-16", quantity: 25, orderCode: "ORD-2024-00115" }
          ]
        },
        {
          id: 102,
          lotCode: "LOT-20241010-002",
          quantity: 800,
          usedQuantity: 320,
          supplierBatch: "TC-B2024-042",
          receivedDate: "2024-10-10",
          expiryDate: null,
          costPerUnit: 12.25,
          location: "warehouse-a",
          storageRequirements: "Climate Controlled",
          qrCode: "QR-LOT-20241010-002",
          usageHistory: [
            { date: "2024-10-19", quantity: 120, orderCode: "ORD-2024-00120" },
            { date: "2024-10-17", quantity: 100, orderCode: "ORD-2024-00117" },
            { date: "2024-10-14", quantity: 100, orderCode: "ORD-2024-00112" }
          ]
        },
        {
          id: 103,
          lotCode: "LOT-20241005-003",
          quantity: 650,
          usedQuantity: 580,
          supplierBatch: "TC-B2024-038",
          receivedDate: "2024-10-05",
          expiryDate: null,
          costPerUnit: 12.00,
          location: "warehouse-a",
          storageRequirements: "Climate Controlled",
          qrCode: "QR-LOT-20241005-003",
          usageHistory: [
            { date: "2024-10-21", quantity: 70, orderCode: "ORD-2024-00125" },
            { date: "2024-10-19", quantity: 150, orderCode: "ORD-2024-00121" },
            { date: "2024-10-15", quantity: 200, orderCode: "ORD-2024-00114" }
          ]
        }
      ]
    },
    {
      id: 2,
      name: "Polyester Thread - Black",
      sku: "THR-002",
      category: "thread",
      description: "High-strength polyester thread for industrial sewing",
      unit: "spools",
      totalQuantity: 45,
      reorderPoint: 50,
      maxStock: 200,
      supplier: "thread-masters",
      supplierSku: "TM-PT-BLK-001",
      costPerUnit: 3.25,
      location: "production-floor",
      storageRequirements: "Standard",
      hasExpiry: false,
      leadTimeDays: 7,
      notes: "Fast-moving item, monitor closely",
      lots: [
        {
          id: 201,
          lotCode: "LOT-20241018-004",
          quantity: 25,
          usedQuantity: 8,
          supplierBatch: "TM-2024-156",
          receivedDate: "2024-10-18",
          expiryDate: null,
          costPerUnit: 3.25,
          location: "production-floor",
          storageRequirements: "Standard",
          qrCode: "QR-LOT-20241018-004",
          usageHistory: [
            { date: "2024-10-21", quantity: 5, orderCode: "ORD-2024-00126" },
            { date: "2024-10-19", quantity: 3, orderCode: "ORD-2024-00122" }
          ]
        },
        {
          id: 202,
          lotCode: "LOT-20241012-005",
          quantity: 20,
          usedQuantity: 15,
          supplierBatch: "TM-2024-148",
          receivedDate: "2024-10-12",
          expiryDate: null,
          costPerUnit: 3.20,
          location: "production-floor",
          storageRequirements: "Standard",
          qrCode: "QR-LOT-20241012-005",
          usageHistory: [
            { date: "2024-10-20", quantity: 8, orderCode: "ORD-2024-00124" },
            { date: "2024-10-17", quantity: 4, orderCode: "ORD-2024-00119" },
            { date: "2024-10-14", quantity: 3, orderCode: "ORD-2024-00113" }
          ]
        }
      ]
    },
    {
      id: 3,
      name: "Metal Buttons - Silver",
      sku: "BTN-003",
      category: "buttons",
      description: "Premium metal buttons with silver finish",
      unit: "pieces",
      totalQuantity: 0,
      reorderPoint: 1000,
      maxStock: 5000,
      supplier: "button-world",
      supplierSku: "BW-MTL-SLV-15mm",
      costPerUnit: 0.45,
      location: "warehouse-b",
      storageRequirements: "Dry Storage",
      hasExpiry: false,
      leadTimeDays: 10,
      notes: "Out of stock - urgent reorder needed",
      lots: []
    },
    {
      id: 4,
      name: "YKK Zipper - 12 inch",
      sku: "ZIP-004",
      category: "zippers",
      description: "Premium YKK zippers for jackets and bags",
      unit: "pieces",
      totalQuantity: 850,
      reorderPoint: 200,
      maxStock: 2000,
      supplier: "zip-solutions",
      supplierSku: "YKK-12-STD",
      costPerUnit: 2.75,
      location: "warehouse-b",
      storageRequirements: "Standard",
      hasExpiry: false,
      leadTimeDays: 12,
      notes: "Standard inventory item",
      lots: [
        {
          id: 301,
          lotCode: "LOT-20241020-006",
          quantity: 500,
          usedQuantity: 125,
          supplierBatch: "YKK-2024-Q4-078",
          receivedDate: "2024-10-20",
          expiryDate: null,
          costPerUnit: 2.75,
          location: "warehouse-b",
          storageRequirements: "Standard",
          qrCode: "QR-LOT-20241020-006",
          usageHistory: [
            { date: "2024-10-22", quantity: 50, orderCode: "ORD-2024-00127" },
            { date: "2024-10-21", quantity: 75, orderCode: "ORD-2024-00125" }
          ]
        },
        {
          id: 302,
          lotCode: "LOT-20241008-007",
          quantity: 475,
          usedQuantity: 100,
          supplierBatch: "YKK-2024-Q3-156",
          receivedDate: "2024-10-08",
          expiryDate: null,
          costPerUnit: 2.70,
          location: "warehouse-b",
          storageRequirements: "Standard",
          qrCode: "QR-LOT-20241008-007",
          usageHistory: [
            { date: "2024-10-18", quantity: 60, orderCode: "ORD-2024-00118" },
            { date: "2024-10-15", quantity: 40, orderCode: "ORD-2024-00115" }
          ]
        }
      ]
    },
    {
      id: 5,
      name: "Fabric Adhesive",
      sku: "ADH-005",
      category: "fabric",
      description: "Heat-activated fabric adhesive for bonding",
      unit: "rolls",
      totalQuantity: 28,
      reorderPoint: 20,
      maxStock: 100,
      supplier: "textile-corp",
      supplierSku: "TC-ADH-HEAT-001",
      costPerUnit: 15.80,
      location: "warehouse-a",
      storageRequirements: "Climate Controlled",
      hasExpiry: true,
      leadTimeDays: 21,
      notes: "Temperature sensitive - monitor expiry",
      lots: [
        {
          id: 401,
          lotCode: "LOT-20241001-008",
          quantity: 15,
          usedQuantity: 3,
          supplierBatch: "TC-ADH-2024-089",
          receivedDate: "2024-10-01",
          expiryDate: "2025-04-01",
          costPerUnit: 15.80,
          location: "warehouse-a",
          storageRequirements: "Climate Controlled",
          qrCode: "QR-LOT-20241001-008",
          usageHistory: [
            { date: "2024-10-20", quantity: 2, orderCode: "ORD-2024-00123" },
            { date: "2024-10-15", quantity: 1, orderCode: "ORD-2024-00116" }
          ]
        },
        {
          id: 402,
          lotCode: "LOT-20240915-009",
          quantity: 16,
          usedQuantity: 0,
          supplierBatch: "TC-ADH-2024-078",
          receivedDate: "2024-09-15",
          expiryDate: "2025-03-15",
          costPerUnit: 15.60,
          location: "warehouse-a",
          storageRequirements: "Climate Controlled",
          qrCode: "QR-LOT-20240915-009",
          usageHistory: []
        }
      ]
    },
    {
      id: 6,
      name: "Care Labels - Wash Instructions",
      sku: "LBL-006",
      category: "labels",
      description: "Printed care instruction labels for garments",
      unit: "pieces",
      totalQuantity: 15000,
      reorderPoint: 5000,
      maxStock: 50000,
      supplier: "textile-corp",
      supplierSku: "TC-LBL-CARE-STD",
      costPerUnit: 0.08,
      location: "warehouse-b",
      storageRequirements: "Standard",
      hasExpiry: false,
      leadTimeDays: 14,
      notes: "Bulk item - good stock levels",
      lots: [
        {
          id: 501,
          lotCode: "LOT-20241010-010",
          quantity: 10000,
          usedQuantity: 2500,
          supplierBatch: "TC-LBL-2024-234",
          receivedDate: "2024-10-10",
          expiryDate: null,
          costPerUnit: 0.08,
          location: "warehouse-b",
          storageRequirements: "Standard",
          qrCode: "QR-LOT-20241010-010",
          usageHistory: [
            { date: "2024-10-22", quantity: 800, orderCode: "ORD-2024-00127" },
            { date: "2024-10-20", quantity: 600, orderCode: "ORD-2024-00124" },
            { date: "2024-10-18", quantity: 1100, orderCode: "ORD-2024-00119" }
          ]
        },
        {
          id: 502,
          lotCode: "LOT-20240925-011",
          quantity: 7500,
          usedQuantity: 0,
          supplierBatch: "TC-LBL-2024-198",
          receivedDate: "2024-09-25",
          expiryDate: null,
          costPerUnit: 0.07,
          location: "warehouse-b",
          storageRequirements: "Standard",
          qrCode: "QR-LOT-20240925-011",
          usageHistory: []
        }
      ]
    }
  ];

  // Filter materials based on current filters
  const filteredMaterials = useMemo(() => {
    return mockMaterials?.filter(material => {
      // Search filter
      if (filters?.search && !material?.name?.toLowerCase()?.includes(filters?.search?.toLowerCase()) && 
          !material?.sku?.toLowerCase()?.includes(filters?.search?.toLowerCase())) {
        return false;
      }

      // Category filter
      if (filters?.category !== 'all' && material?.category !== filters?.category) {
        return false;
      }

      // Location filter
      if (filters?.location !== 'all' && material?.location !== filters?.location) {
        return false;
      }

      // Supplier filter
      if (filters?.supplier !== 'all' && material?.supplier !== filters?.supplier) {
        return false;
      }

      // Low stock filter
      if (filters?.lowStockOnly && material?.totalQuantity > material?.reorderPoint) {
        return false;
      }

      // Out of stock filter
      if (filters?.outOfStockOnly && material?.totalQuantity > 0) {
        return false;
      }

      // Expiring soon filter
      if (filters?.expiringSoon) {
        const hasExpiringSoon = material?.lots?.some(lot => {
          if (!lot?.expiryDate) return false;
          const today = new Date();
          const expiry = new Date(lot.expiryDate);
          const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
          return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
        });
        if (!hasExpiringSoon) return false;
      }

      return true;
    });
  }, [filters]);

  // Calculate material counts for filter display
  const materialCounts = useMemo(() => {
    const total = mockMaterials?.length;
    const lowStock = mockMaterials?.filter(m => m?.totalQuantity <= m?.reorderPoint && m?.totalQuantity > 0)?.length;
    const outOfStock = mockMaterials?.filter(m => m?.totalQuantity === 0)?.length;
    
    return { total, lowStock, outOfStock };
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      location: 'all',
      supplier: 'all',
      lowStockOnly: false,
      outOfStockOnly: false,
      expiringSoon: false
    });
  };

  const handleAddMaterial = () => {
    setSelectedMaterial(null);
    setMaterialFormMode('add');
    setShowMaterialForm(true);
  };

  const handleEditMaterial = (material) => {
    setSelectedMaterial(material);
    setMaterialFormMode('edit');
    setShowMaterialForm(true);
  };

  const handleTransferMaterial = (material) => {
    setSelectedMaterial(material);
    setShowLotTracking(true);
  };

  const handleAdjustStock = (material) => {
    setSelectedMaterial(material);
    setShowStockAdjustment(true);
  };

  const handleSaveMaterial = (materialData) => {
    console.log('Saving material:', materialData);
    // Implementation would save to backend
  };

  const handleSaveAdjustment = (adjustmentData) => {
    console.log('Saving stock adjustment:', adjustmentData);
    // Implementation would save to backend
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationSidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        userRole="admin"
      />
      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'}`}>
        <div className="p-6 lg:p-8">
          <BreadcrumbTrail />
          
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Inventory Control</h1>
              <p className="text-muted-foreground">
                Manage materials, track stock levels, and monitor lot information
              </p>
            </div>
            
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <Button
                variant="outline"
                iconName="Package"
                onClick={() => setShowLotTracking(true)}
              >
                Lot Tracking
              </Button>
              <Button
                variant="outline"
                iconName="TrendingUp"
                onClick={() => console.log('Receive stock')}
              >
                Receive Stock
              </Button>
              <Button
                iconName="Plus"
                onClick={handleAddMaterial}
              >
                Add Material
              </Button>
            </div>
          </div>

          {/* Inventory Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Materials</p>
                  <p className="text-2xl font-bold text-foreground">{materialCounts?.total}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Package" size={24} className="text-primary" />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Low Stock Items</p>
                  <p className="text-2xl font-bold text-warning">{materialCounts?.lowStock}</p>
                </div>
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Icon name="AlertTriangle" size={24} className="text-warning" />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Out of Stock</p>
                  <p className="text-2xl font-bold text-destructive">{materialCounts?.outOfStock}</p>
                </div>
                <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center">
                  <Icon name="XCircle" size={24} className="text-destructive" />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="text-2xl font-bold text-success">$124,580</p>
                </div>
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <Icon name="DollarSign" size={24} className="text-success" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <InventoryFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            materialCounts={materialCounts}
          />

          {/* Materials Table */}
          <MaterialsTable
            materials={filteredMaterials}
            onEdit={handleEditMaterial}
            onTransfer={handleTransferMaterial}
            onAdjust={handleAdjustStock}
            onSplitLot={() => console.log('Split lot functionality')}
          />

          {/* Results Summary */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Showing {filteredMaterials?.length} of {mockMaterials?.length} materials
          </div>
        </div>
      </main>
      {/* Modals */}
      <LotTrackingModal
        isOpen={showLotTracking}
        onClose={() => setShowLotTracking(false)}
        material={selectedMaterial}
        lots={selectedMaterial?.lots || []}
      />
      <MaterialFormModal
        isOpen={showMaterialForm}
        onClose={() => setShowMaterialForm(false)}
        onSave={handleSaveMaterial}
        material={selectedMaterial}
        mode={materialFormMode}
      />
      <StockAdjustmentModal
        isOpen={showStockAdjustment}
        onClose={() => setShowStockAdjustment(false)}
        onSave={handleSaveAdjustment}
        material={selectedMaterial}
      />
    </div>
  );
};

export default InventoryControl;