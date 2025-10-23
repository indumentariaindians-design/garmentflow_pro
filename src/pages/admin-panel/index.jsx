import React, { useState, useEffect } from 'react';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import EmployeeTable from './components/EmployeeTable';
import EmployeeFilters from './components/EmployeeFilters';
import EmployeeModal from './components/EmployeeModal';
import BulkImportModal from './components/BulkImportModal';
import SystemConfigSection from './components/SystemConfigSection';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const AdminPanel = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('employees');
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    role: 'all',
    status: 'all',
    department: 'all'
  });
  const [employeeModal, setEmployeeModal] = useState({
    isOpen: false,
    employee: null,
    mode: 'create'
  });
  const [bulkImportModal, setBulkImportModal] = useState(false);

  // Mock employee data
  useEffect(() => {
    const mockEmployees = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@garmentflow.com",
      role: "admin",
      department: "administration",
      status: "active",
      avatar: "https://images.unsplash.com/photo-1637562772116-e01cda44fce8",
      avatarAlt: "Professional headshot of woman with shoulder-length brown hair in navy blazer",
      lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000),
      permissions: ["manage_users", "view_reports", "edit_orders"]
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      email: "michael.rodriguez@garmentflow.com",
      role: "manager",
      department: "production",
      status: "active",
      avatar: "https://images.unsplash.com/photo-1678282955795-200c1e18bc7d",
      avatarAlt: "Professional headshot of Hispanic man with short black hair in dark suit",
      lastLogin: new Date(Date.now() - 4 * 60 * 60 * 1000),
      permissions: ["view_orders", "edit_orders", "view_inventory"]
    },
    {
      id: 3,
      name: "Emily Chen",
      email: "emily.chen@garmentflow.com",
      role: "ventas",
      department: "sales",
      status: "active",
      avatar: "https://images.unsplash.com/photo-1560859389-c4fb2bd88016",
      avatarAlt: "Professional headshot of Asian woman with long black hair in white blouse",
      lastLogin: new Date(Date.now() - 1 * 60 * 60 * 1000),
      permissions: ["view_orders", "edit_orders"]
    },
    {
      id: 4,
      name: "David Thompson",
      email: "david.thompson@garmentflow.com",
      role: "station",
      department: "production",
      status: "active",
      avatar: "https://images.unsplash.com/photo-1723607528434-21cde67167c4",
      avatarAlt: "Professional headshot of Caucasian man with brown hair in blue shirt",
      lastLogin: new Date(Date.now() - 30 * 60 * 1000),
      permissions: ["view_orders"]
    },
    {
      id: 5,
      name: "Lisa Martinez",
      email: "lisa.martinez@garmentflow.com",
      role: "station",
      department: "quality",
      status: "active",
      avatar: "https://images.unsplash.com/photo-1700560970703-82fd3150d5ac",
      avatarAlt: "Professional headshot of Latina woman with curly hair in gray blazer",
      lastLogin: new Date(Date.now() - 6 * 60 * 60 * 1000),
      permissions: ["view_orders"]
    },
    {
      id: 6,
      name: "James Wilson",
      email: "james.wilson@garmentflow.com",
      role: "manager",
      department: "production",
      status: "inactive",
      avatar: "https://images.unsplash.com/photo-1585066047759-3438c34cf676",
      avatarAlt: "Professional headshot of African American man with beard in navy suit",
      lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      permissions: ["view_orders", "edit_orders"]
    }];


    setEmployees(mockEmployees);
    setFilteredEmployees(mockEmployees);
  }, []);

  // Filter employees based on current filters
  useEffect(() => {
    let filtered = employees;

    if (filters?.search) {
      filtered = filtered?.filter((emp) =>
      emp?.name?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
      emp?.email?.toLowerCase()?.includes(filters?.search?.toLowerCase())
      );
    }

    if (filters?.role !== 'all') {
      filtered = filtered?.filter((emp) => emp?.role === filters?.role);
    }

    if (filters?.status !== 'all') {
      filtered = filtered?.filter((emp) => emp?.status === filters?.status);
    }

    if (filters?.department !== 'all') {
      filtered = filtered?.filter((emp) => emp?.department === filters?.department);
    }

    setFilteredEmployees(filtered);
  }, [employees, filters]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      role: 'all',
      status: 'all',
      department: 'all'
    });
  };

  const handleEditEmployee = (employee) => {
    setEmployeeModal({
      isOpen: true,
      employee,
      mode: 'edit'
    });
  };

  const handleAddEmployee = () => {
    setEmployeeModal({
      isOpen: true,
      employee: null,
      mode: 'create'
    });
  };

  const handleSaveEmployee = async (formData) => {
    if (employeeModal?.mode === 'create') {
      const newEmployee = {
        id: employees?.length + 1,
        ...formData,
        avatar: "https://images.unsplash.com/photo-1728982022714-92ef6c61a085",
        avatarAlt: "Professional headshot placeholder for new employee",
        lastLogin: new Date()
      };
      setEmployees((prev) => [...prev, newEmployee]);
    } else {
      setEmployees((prev) =>
      prev?.map((emp) =>
      emp?.id === employeeModal?.employee?.id ?
      { ...emp, ...formData } :
      emp
      )
      );
    }
  };

  const handleResetPassword = async (employee) => {
    console.log('Resetting password for:', employee?.email);
    // Mock password reset logic
  };

  const handleToggleStatus = async (employee) => {
    const newStatus = employee?.status === 'active' ? 'inactive' : 'active';
    setEmployees((prev) =>
    prev?.map((emp) =>
    emp?.id === employee?.id ?
    { ...emp, status: newStatus } :
    emp
    )
    );
  };

  const handleBulkImport = async (importData) => {
    const newEmployees = importData?.map((data, index) => ({
      id: employees?.length + index + 1,
      name: data?.name,
      email: data?.email,
      role: data?.role?.toLowerCase(),
      department: data?.department?.toLowerCase(),
      status: data?.status?.toLowerCase() || 'active',
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      avatarAlt: `Professional headshot placeholder for ${data?.name}`,
      lastLogin: new Date(),
      permissions: []
    }));

    setEmployees((prev) => [...prev, ...newEmployees]);
  };

  const employeeCounts = {
    total: employees?.length,
    active: employees?.filter((emp) => emp?.status === 'active')?.length,
    inactive: employees?.filter((emp) => emp?.status === 'inactive')?.length
  };

  const tabs = [
  { id: 'employees', label: 'Employee Management', icon: 'Users' },
  { id: 'system', label: 'System Configuration', icon: 'Settings' }];


  return (
    <div className="min-h-screen bg-gray-50 flex">
      <NavigationSidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        userRole="admin" />

      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'}`}>
        <div className="p-6 lg:p-8">
          <BreadcrumbTrail />
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Administration Panel</h1>
            <p className="text-gray-600">
              Manage employees, roles, and system configuration
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              {tabs?.map((tab) =>
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab?.id ?
                'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
                }>

                  <Icon name={tab?.icon} size={20} />
                  <span>{tab?.label}</span>
                </button>
              )}
            </nav>
          </div>

          {/* Employee Management Tab */}
          {activeTab === 'employees' &&
          <div className="space-y-6">
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <Button
                  onClick={handleAddEmployee}
                  iconName="UserPlus"
                  iconPosition="left">

                    Add Employee
                  </Button>
                  <Button
                  variant="outline"
                  onClick={() => setBulkImportModal(true)}
                  iconName="Upload"
                  iconPosition="left">

                    Bulk Import
                  </Button>
                </div>
                
                <div className="text-sm text-gray-600">
                  Showing {filteredEmployees?.length} of {employees?.length} employees
                </div>
              </div>

              {/* Filters */}
              <EmployeeFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              employeeCounts={employeeCounts}
              onClearFilters={handleClearFilters} />


              {/* Employee Table */}
              <EmployeeTable
              employees={filteredEmployees}
              onEditEmployee={handleEditEmployee}
              onResetPassword={handleResetPassword}
              onToggleStatus={handleToggleStatus} />

            </div>
          }

          {/* System Configuration Tab */}
          {activeTab === 'system' &&
          <SystemConfigSection />
          }
        </div>
      </div>
      {/* Employee Modal */}
      <EmployeeModal
        isOpen={employeeModal?.isOpen}
        onClose={() => setEmployeeModal({ isOpen: false, employee: null, mode: 'create' })}
        employee={employeeModal?.employee}
        onSave={handleSaveEmployee}
        mode={employeeModal?.mode} />

      {/* Bulk Import Modal */}
      <BulkImportModal
        isOpen={bulkImportModal}
        onClose={() => setBulkImportModal(false)}
        onImport={handleBulkImport} />

    </div>);

};

export default AdminPanel;