import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import QRScanner from './components/QRScanner';
import OrderQueue from './components/OrderQueue';
import ProcessingPanel from './components/ProcessingPanel';
import ProcessingHistory from './components/ProcessingHistory';
import StageInstructions from './components/StageInstructions';

const StationInterface = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentStage, setCurrentStage] = useState('Corte');
  const [isScanning, setIsScanning] = useState(false);
  const [scannedOrder, setScannedOrder] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orderQueue, setOrderQueue] = useState([]);
  const [processingHistory, setProcessingHistory] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Mock data for order queue
  const mockOrderQueue = [
    {
      id: 1,
      orderCode: "ORD-2024-00121",
      itemId: "ITM-454",
      sku: "POLO-RED-L",
      productName: "Classic Polo Shirt",
      color: "Red",
      size: "Large",
      quantity: 25,
      priority: "High",
      status: "pending",
      dueDate: "10/25/2024",
      notes: "Rush order for corporate event",
      addedTime: "2 hours ago",
      estimatedTime: 12
    },
    {
      id: 2,
      orderCode: "ORD-2024-00122",
      itemId: "ITM-455",
      sku: "TSHIRT-BLK-M",
      productName: "Premium T-Shirt",
      color: "Black",
      size: "Medium",
      quantity: 40,
      priority: "Medium",
      status: "in-progress",
      dueDate: "10/26/2024",
      notes: "",
      addedTime: "4 hours ago",
      estimatedTime: 15
    },
    {
      id: 3,
      orderCode: "ORD-2024-00120",
      itemId: "ITM-453",
      sku: "HOODIE-GRY-XL",
      productName: "Cotton Hoodie",
      color: "Gray",
      size: "Extra Large",
      quantity: 15,
      priority: "Low",
      status: "pending",
      dueDate: "10/28/2024",
      notes: "Standard processing timeline",
      addedTime: "6 hours ago",
      estimatedTime: 20
    }
  ];

  // Mock processing history
  const mockProcessingHistory = [
    {
      orderCode: "ORD-2024-00119",
      itemId: "ITM-452",
      productName: "Sports Jersey",
      action: "advance",
      quantity: 30,
      notes: "All pieces passed quality check, advancing to next stage",
      timestamp: "2024-10-22T14:30:00Z",
      operator: "John Smith"
    },
    {
      orderCode: "ORD-2024-00118",
      itemId: "ITM-451",
      productName: "Casual Shirt",
      action: "reject",
      quantity: 5,
      notes: "Material defect found in cutting pattern, rejected for rework",
      timestamp: "2024-10-22T13:45:00Z",
      operator: "John Smith"
    },
    {
      orderCode: "ORD-2024-00117",
      itemId: "ITM-450",
      productName: "Tank Top",
      action: "advance",
      quantity: 50,
      notes: "Cutting completed successfully, all measurements verified",
      timestamp: "2024-10-22T12:15:00Z",
      operator: "John Smith"
    }
  ];

  const stageOptions = [
    { value: 'Design', label: 'Design' },
    { value: 'Impresión', label: 'Impresión (Printing)' },
    { value: 'Planchado', label: 'Planchado (Pressing)' },
    { value: 'Corte', label: 'Corte (Cutting)' },
    { value: 'Estampado', label: 'Estampado (Stamping)' },
    { value: 'Confección', label: 'Confección (Sewing)' },
    { value: 'QC', label: 'Quality Control' },
    { value: 'Empaquetado', label: 'Empaquetado (Packaging)' }
  ];

  useEffect(() => {
    setOrderQueue(mockOrderQueue);
    setProcessingHistory(mockProcessingHistory);
  }, []);

  const handleScanSuccess = (qrData) => {
    try {
      const orderData = JSON.parse(qrData);
      setScannedOrder(orderData);
      
      // Add to notifications
      setNotifications(prev => [...prev, {
        id: Date.now(),
        type: 'success',
        message: `Successfully scanned order ${orderData?.orderCode}`,
        timestamp: new Date()
      }]);

      // Remove from queue if it exists there
      setOrderQueue(prev => prev?.filter(order => order?.orderCode !== orderData?.orderCode));
      
    } catch (error) {
      handleScanError('Invalid QR code format');
    }
  };

  const handleScanError = (error) => {
    setNotifications(prev => [...prev, {
      id: Date.now(),
      type: 'error',
      message: `Scan failed: ${error}`,
      timestamp: new Date()
    }]);
  };

  const handleProcessOrder = async (processData) => {
    try {
      // Add to processing history
      setProcessingHistory(prev => [processData, ...prev]);
      
      // Clear scanned order
      setScannedOrder(null);
      
      // Add success notification
      setNotifications(prev => [...prev, {
        id: Date.now(),
        type: 'success',
        message: `Successfully processed ${processData?.quantity} pieces from ${processData?.orderCode}`,
        timestamp: new Date()
      }]);

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      setNotifications(prev => [...prev, {
        id: Date.now(),
        type: 'error',
        message: `Processing failed: ${error?.message}`,
        timestamp: new Date()
      }]);
      throw error;
    }
  };

  const handleSelectOrder = (order) => {
    setSelectedOrderId(order?.id);
    // Convert queue order to scanned order format
    const orderData = {
      orderCode: order?.orderCode,
      itemId: order?.itemId,
      sku: order?.sku,
      productName: order?.productName,
      color: order?.color,
      size: order?.size,
      quantity: order?.quantity,
      priority: order?.priority,
      stage: currentStage
    };
    setScannedOrder(orderData);
  };

  const handleClearOrder = () => {
    setScannedOrder(null);
    setSelectedOrderId(null);
  };

  const customBreadcrumbs = [
    { label: 'Dashboard', path: '/dashboard', icon: 'BarChart3' },
    { label: 'Station Hub', path: '/station-hub' },
    { label: 'Station Interface', path: '/station-interface', isLast: true }
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavigationSidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        userRole="station"
      />
      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'}`}>
        <div className="p-6 lg:p-8">
          <BreadcrumbTrail customBreadcrumbs={customBreadcrumbs} />
          
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                Station Interface
              </h1>
              <p className="text-muted-foreground">
                Process orders through QR scanning with workflow actions and quality control
              </p>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              <Select
                label="Current Station"
                options={stageOptions}
                value={currentStage}
                onChange={setCurrentStage}
                className="min-w-48"
              />
              
              <Button
                variant="outline"
                onClick={() => navigate('/station-hub')}
                iconName="Grid3X3"
                iconPosition="left"
              >
                Station Hub
              </Button>
            </div>
          </div>

          {/* Status Bar */}
          <div className="bg-card rounded-lg border border-border p-4 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-success rounded-full"></div>
                  <span className="text-sm font-medium text-foreground">Station Active</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Current Stage: <span className="font-medium text-foreground">{currentStage}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Queue: <span className="font-medium text-foreground">{orderQueue?.length} items</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Clock" size={16} />
                <span>Last updated: {new Date()?.toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column - Scanner & Queue */}
            <div className="xl:col-span-2 space-y-6">
              {/* QR Scanner */}
              <QRScanner
                onScanSuccess={handleScanSuccess}
                onScanError={handleScanError}
                isScanning={isScanning}
                setIsScanning={setIsScanning}
              />
              
              {/* Order Queue */}
              <OrderQueue
                orders={orderQueue}
                onSelectOrder={handleSelectOrder}
                selectedOrderId={selectedOrderId}
              />
            </div>

            {/* Right Column - Processing & Instructions */}
            <div className="space-y-6">
              {/* Processing Panel */}
              <ProcessingPanel
                scannedOrder={scannedOrder}
                onProcessOrder={handleProcessOrder}
                onClearOrder={handleClearOrder}
                currentStage={currentStage}
              />
              
              {/* Stage Instructions */}
              <StageInstructions currentStage={currentStage} />
            </div>
          </div>

          {/* Processing History */}
          <div className="mt-6">
            <ProcessingHistory
              history={processingHistory}
              currentStage={currentStage}
            />
          </div>

          {/* Notifications */}
          {notifications?.length > 0 && (
            <div className="fixed bottom-4 right-4 space-y-2 z-50">
              {notifications?.slice(-3)?.map((notification) => (
                <div
                  key={notification?.id}
                  className={`
                    p-4 rounded-lg border shadow-lg max-w-sm
                    ${notification?.type === 'success' ?'bg-success/10 border-success/20 text-success' :'bg-destructive/10 border-destructive/20 text-destructive'
                    }
                  `}
                >
                  <div className="flex items-start space-x-2">
                    <Icon 
                      name={notification?.type === 'success' ? 'CheckCircle' : 'AlertCircle'} 
                      size={16} 
                      className="flex-shrink-0 mt-0.5"
                    />
                    <p className="text-sm">{notification?.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StationInterface;