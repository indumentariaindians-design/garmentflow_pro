import React, { useState, useEffect } from 'react';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import OrderHeader from './components/OrderHeader';
import ProductionStages from './components/ProductionStages';
import TimelineTab from './components/TimelineTab';
import ItemsTab from './components/ItemsTab';
import FilesTab from './components/FilesTab';
import HistoryTab from './components/HistoryTab';
import Icon from '../../components/AppIcon';


const OrderDetailsPage = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('timeline');
  const [userRole] = useState('admin');

  // Mock order data
  const orderData = {
    orderCode: "ORD-2024-00127",
    status: "In Progress",
    priority: "High",
    createdDate: "Oct 15, 2024",
    dueDate: "Oct 28, 2024",
    completionPercentage: 65,
    totalItems: 150,
    totalValue: "2,450.00",
    customer: {
      name: "Fashion Forward Inc.",
      email: "orders@fashionforward.com",
      phone: "+1 (555) 123-4567",
      address: "123 Fashion Ave, New York, NY 10001"
    }
  };

  // Mock production stages
  const productionStages = [
  {
    id: 1,
    name: "Design",
    status: "completed",
    assignedWorker: "Maria Rodriguez",
    completedAt: "Oct 16, 2024 2:30 PM"
  },
  {
    id: 2,
    name: "Impresión",
    status: "completed",
    assignedWorker: "Carlos Martinez",
    completedAt: "Oct 17, 2024 11:15 AM"
  },
  {
    id: 3,
    name: "Planchado",
    status: "completed",
    assignedWorker: "Ana Lopez",
    completedAt: "Oct 18, 2024 9:45 AM"
  },
  {
    id: 4,
    name: "Corte",
    status: "in-progress",
    assignedWorker: "Roberto Silva",
    completedAt: null
  },
  {
    id: 5,
    name: "Estampado",
    status: "pending",
    assignedWorker: null,
    completedAt: null
  },
  {
    id: 6,
    name: "Confección",
    status: "pending",
    assignedWorker: null,
    completedAt: null
  },
  {
    id: 7,
    name: "QC",
    status: "pending",
    assignedWorker: null,
    completedAt: null
  },
  {
    id: 8,
    name: "Empaquetado",
    status: "pending",
    assignedWorker: null,
    completedAt: null
  }];


  // Mock timeline data
  const timelineData = [
  {
    id: 1,
    type: "stage_complete",
    title: "Planchado Stage Completed",
    description: "All items successfully processed through pressing stage with quality approval",
    timestamp: "Oct 18, 2024 9:45 AM",
    user: "Ana Lopez",
    station: "Planchado Station",
    metrics: {
      items_processed: "150",
      quality_score: "98%",
      processing_time: "4.2 hours"
    }
  },
  {
    id: 2,
    type: "quality_check",
    title: "Quality Inspection Passed",
    description: "Random quality check performed on 15 items. All items meet quality standards.",
    timestamp: "Oct 18, 2024 8:30 AM",
    user: "Quality Team",
    station: "QC Station",
    attachments: [
    { name: "quality_report_127.pdf" },
    { name: "inspection_photos.zip" }]

  },
  {
    id: 3,
    type: "note_added",
    title: "Production Note Added",
    description: "Special attention required for color matching on items 45-60. Customer requested specific shade verification.",
    timestamp: "Oct 17, 2024 3:15 PM",
    user: "Production Manager",
    station: "Impresión Station"
  },
  {
    id: 4,
    type: "stage_complete",
    title: "Impresión Stage Completed",
    description: "Digital printing completed for all 150 items with high-resolution graphics",
    timestamp: "Oct 17, 2024 11:15 AM",
    user: "Carlos Martinez",
    station: "Impresión Station",
    metrics: {
      items_processed: "150",
      ink_usage: "2.3L",
      processing_time: "6.5 hours"
    }
  },
  {
    id: 5,
    type: "status_change",
    title: "Order Status Updated",
    description: "Order status changed from \'Pending\' to \'In Progress\' as production begins",
    timestamp: "Oct 16, 2024 8:00 AM",
    user: "System",
    station: "Production Floor"
  }];


  // Mock items data
  const itemsData = [
  {
    id: 1,
    product: {
      name: "Premium Cotton T-Shirt",
      sku: "PTS-001-BLK-L",
      image: "https://images.unsplash.com/photo-1716952029045-feb119b58583",
      imageAlt: "Black cotton t-shirt with crew neck on white background"
    },
    quantity: 50,
    unit: "pieces",
    workflow: "basica",
    status: "in-progress",
    currentStage: "Corte",
    completionPercentage: 75,
    specifications: {
      size: "Large",
      color: "Black",
      colorCode: "#000000",
      material: "100% Cotton"
    },
    unitPrice: "12.50",
    totalPrice: "625.00",
    notes: "Customer requested reinforced stitching on collar area"
  },
  {
    id: 2,
    product: {
      name: "Sublimation Sports Jersey",
      sku: "SSJ-002-RED-M",
      image: "https://images.unsplash.com/photo-1569242972613-401d0d1a004e",
      imageAlt: "Red athletic sports jersey with moisture-wicking fabric"
    },
    quantity: 75,
    unit: "pieces",
    workflow: "sublimado",
    status: "completed",
    currentStage: "Empaquetado",
    completionPercentage: 100,
    specifications: {
      size: "Medium",
      color: "Red",
      colorCode: "#DC2626",
      material: "Polyester Blend"
    },
    unitPrice: "18.75",
    totalPrice: "1,406.25",
    notes: null
  },
  {
    id: 3,
    product: {
      name: "Custom Polo Shirt",
      sku: "CPS-003-NVY-XL",
      image: "https://images.unsplash.com/photo-1715918648356-7a4b031f1fe0",
      imageAlt: "Navy blue polo shirt with collar and three-button placket"
    },
    quantity: 25,
    unit: "pieces",
    workflow: "basica",
    status: "on-hold",
    currentStage: "Design",
    completionPercentage: 15,
    specifications: {
      size: "Extra Large",
      color: "Navy Blue",
      colorCode: "#1E3A8A",
      material: "Cotton Pique"
    },
    unitPrice: "16.80",
    totalPrice: "420.00",
    notes: "Waiting for customer approval on logo placement"
  }];


  // Mock files data
  const filesData = [
  {
    id: 1,
    name: "design_specifications.pdf",
    type: "application/pdf",
    size: 2456789,
    url: "https://example.com/files/design_specs.pdf",
    alt: "Design specification document with technical drawings and measurements",
    uploadedAt: "Oct 15, 2024",
    uploadedBy: "Design Team",
    category: "Design"
  },
  {
    id: 2,
    name: "quality_photos_batch1.jpg",
    type: "image/jpeg",
    size: 1234567,
    url: "https://images.unsplash.com/photo-1609562450484-be37fff150f0",
    alt: "Quality control photos showing finished garments arranged on inspection table",
    uploadedAt: "Oct 18, 2024",
    uploadedBy: "QC Inspector",
    category: "Quality Control"
  },
  {
    id: 3,
    name: "customer_requirements.docx",
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    size: 987654,
    url: "https://example.com/files/requirements.docx",
    alt: "Customer requirements document with detailed specifications",
    uploadedAt: "Oct 15, 2024",
    uploadedBy: "Sales Team",
    category: "Requirements"
  },
  {
    id: 4,
    name: "production_timeline.xlsx",
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    size: 456789,
    url: "https://example.com/files/timeline.xlsx",
    alt: "Production timeline spreadsheet with milestones and deadlines",
    uploadedAt: "Oct 16, 2024",
    uploadedBy: "Production Manager",
    category: "Planning"
  }];


  // Mock history data
  const historyData = [
  {
    id: 1,
    action: "stage_advanced",
    title: "Advanced to Corte Stage",
    description: "Order items successfully moved from Planchado to Corte stage",
    timestamp: "Oct 18, 2024 10:00 AM",
    user: "Roberto Silva",
    station: "Corte Station",
    ipAddress: "192.168.1.45",
    changes: {
      stage: { from: "Planchado", to: "Corte" },
      status: { from: "Pending", to: "In Progress" }
    },
    metadata: {
      items_moved: "150",
      batch_number: "B-127-001"
    }
  },
  {
    id: 2,
    action: "file_uploaded",
    title: "Quality Photos Uploaded",
    description: "Quality control photos uploaded for batch inspection",
    timestamp: "Oct 18, 2024 9:30 AM",
    user: "QC Inspector",
    station: "QC Station",
    ipAddress: "192.168.1.23",
    attachments: [
    { name: "quality_photos_batch1.jpg" },
    { name: "inspection_checklist.pdf" }]

  },
  {
    id: 3,
    action: "quantity_adjusted",
    title: "Quantity Adjustment",
    description: "Adjusted quantity for item PTS-001-BLK-L due to material shortage",
    timestamp: "Oct 17, 2024 4:45 PM",
    user: "Inventory Manager",
    station: "Inventory Control",
    ipAddress: "192.168.1.67",
    changes: {
      quantity: { from: "55", to: "50" }
    },
    metadata: {
      reason: "Material shortage",
      approved_by: "Production Manager"
    }
  },
  {
    id: 4,
    action: "priority_changed",
    title: "Priority Level Updated",
    description: "Order priority changed from Medium to High due to customer request",
    timestamp: "Oct 17, 2024 2:15 PM",
    user: "Sales Manager",
    station: "Sales Department",
    ipAddress: "192.168.1.89",
    changes: {
      priority: { from: "Medium", to: "High" }
    },
    metadata: {
      customer_request: "Rush delivery needed",
      new_due_date: "Oct 28, 2024"
    }
  },
  {
    id: 5,
    action: "assigned",
    title: "Worker Assignment",
    description: "Carlos Martinez assigned to Impresión station for this order",
    timestamp: "Oct 16, 2024 3:30 PM",
    user: "Production Supervisor",
    station: "Production Floor",
    ipAddress: "192.168.1.12",
    changes: {
      assigned_worker: { from: "Unassigned", to: "Carlos Martinez" }
    }
  },
  {
    id: 6,
    action: "created",
    title: "Order Created",
    description: "New order ORD-2024-00127 created in the system",
    timestamp: "Oct 15, 2024 10:15 AM",
    user: "Sales Representative",
    station: "Sales Department",
    ipAddress: "192.168.1.34",
    metadata: {
      customer: "Fashion Forward Inc.",
      total_value: "$2,450.00",
      items_count: "150"
    }
  }];


  const tabs = [
  { id: 'timeline', label: 'Timeline', icon: 'Clock' },
  { id: 'items', label: 'Items', icon: 'Package' },
  { id: 'files', label: 'Files', icon: 'FileText' },
  { id: 'history', label: 'History', icon: 'History' }];


  const handleStatusChange = (newStatus) => {
    console.log('Status changed to:', newStatus);
  };

  const handleAddNote = () => {
    console.log('Adding note...');
  };

  const handleUpdateItem = (itemId) => {
    console.log('Updating item:', itemId);
  };

  const handleFileUpload = (file) => {
    console.log('Uploading file:', file?.name);
  };

  const handleFileDelete = (fileId) => {
    console.log('Deleting file:', fileId);
  };

  const breadcrumbs = [
  { label: 'Dashboard', path: '/dashboard', icon: 'BarChart3' },
  { label: 'Order Management', path: '/order-management' },
  { label: orderData?.orderCode, path: '/order-details', isLast: true }];


  return (
    <div className="min-h-screen bg-gray-50 flex">
      <NavigationSidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        userRole={userRole} />

      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-60'}`}>
        <div className="p-6">
          <BreadcrumbTrail customBreadcrumbs={breadcrumbs} />
          
          <OrderHeader
            order={orderData}
            onStatusChange={handleStatusChange} />

          
          <ProductionStages
            stages={productionStages}
            currentStage={3} />


          {/* Tab Navigation */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {tabs?.map((tab) =>
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-150 ${
                  activeTab === tab?.id ?
                  'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
                  }>

                    <div className="flex items-center gap-2">
                      <Icon name={tab?.icon} size={16} />
                      <span>{tab?.label}</span>
                    </div>
                  </button>
                )}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'timeline' &&
              <TimelineTab
                timeline={timelineData}
                onAddNote={handleAddNote} />

              }
              
              {activeTab === 'items' &&
              <ItemsTab
                items={itemsData}
                onUpdateItem={handleUpdateItem} />

              }
              
              {activeTab === 'files' &&
              <FilesTab
                files={filesData}
                onFileUpload={handleFileUpload}
                onFileDelete={handleFileDelete} />

              }
              
              {activeTab === 'history' &&
              <HistoryTab history={historyData} />
              }
            </div>
          </div>
        </div>
      </main>
    </div>);

};

export default OrderDetailsPage;