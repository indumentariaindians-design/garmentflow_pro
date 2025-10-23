import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import NavigationItem from './NavigationItem';
import UserProfile from './UserProfile';

const NavigationSidebar = ({ isCollapsed = false, onToggleCollapse, userRole = 'admin' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'BarChart3',
      roles: ['admin', 'manager', 'ventas', 'station'],
      tooltip: 'Production overview and KPIs'
    },
    {
      label: 'Orders',
      icon: 'Package',
      roles: ['admin', 'manager', 'ventas'],
      tooltip: 'Order management and tracking',
      children: [
        {
          label: 'Order Management',
          path: '/order-management',
          icon: 'List',
          roles: ['admin', 'manager', 'ventas']
        },
        {
          label: 'Order Details',
          path: '/order-details',
          icon: 'FileText',
          roles: ['admin', 'manager', 'ventas']
        }
      ]
    },
    {
      label: 'Production',
      icon: 'Factory',
      roles: ['admin', 'manager', 'station'],
      tooltip: 'Manufacturing workflow management',
      children: [
        {
          label: 'Station Hub',
          path: '/station-hub',
          icon: 'Grid3X3',
          roles: ['admin', 'manager', 'station']
        },
        {
          label: 'Station Interface',
          path: '/station-interface',
          icon: 'Monitor',
          roles: ['station']
        }
      ]
    },
    {
      label: 'Customers',
      path: '/customer-management',
      icon: 'Users',
      roles: ['admin', 'manager', 'ventas'],
      tooltip: 'Customer relationship management'
    },
    {
      label: 'Inventory',
      path: '/inventory-control',
      icon: 'Archive',
      roles: ['admin', 'manager'],
      tooltip: 'Stock and material management'
    },
    {
      label: 'Products',
      path: '/product-catalog',
      icon: 'Shirt',
      roles: ['admin', 'manager'],
      tooltip: 'Product catalog and specifications'
    },
    {
      label: 'Invoicing',
      icon: 'Receipt',
      roles: ['admin', 'manager', 'ventas'],
      tooltip: 'Financial transaction management',
      children: [
        {
          label: 'Invoice Management',
          path: '/invoice-management',
          icon: 'FileSpreadsheet',
          roles: ['admin', 'manager', 'ventas']
        },
        {
          label: 'Invoice Details',
          path: '/invoice-details',
          icon: 'FileCheck',
          roles: ['admin', 'manager', 'ventas']
        }
      ]
    },
    {
      label: 'Administration',
      path: '/admin-panel',
      icon: 'Settings',
      roles: ['admin'],
      tooltip: 'System configuration and user management'
    }
  ];

  const filteredItems = navigationItems?.filter(item => 
    item?.roles?.includes(userRole)
  );

  const handleNavigate = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const isActive = (path) => {
    if (!path) return false;
    return location?.pathname === path || location?.pathname?.startsWith(path + '/');
  };

  const hasActiveChild = (children) => {
    if (!children) return false;
    return children?.some(child => isActive(child?.path));
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-card rounded-md shadow-card border border-border"
      >
        <Icon name="Menu" size={24} />
      </button>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-card border-r border-border z-40
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-16' : 'w-60'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          flex flex-col
        `}
      >
        {/* Logo Section */}
        <div className="flex items-center p-4 border-b border-border">
          {!isCollapsed ? (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Factory" size={20} color="white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">GarmentFlow</h1>
                <p className="text-xs text-muted-foreground">Pro</p>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto">
              <Icon name="Factory" size={20} color="white" />
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {filteredItems?.map((item, index) => (
            <NavigationItem
              key={index}
              item={item}
              isCollapsed={isCollapsed}
              isActive={isActive}
              hasActiveChild={hasActiveChild}
              onNavigate={handleNavigate}
              userRole={userRole}
            />
          ))}
        </nav>

        {/* Collapse Toggle (Desktop Only) */}
        {onToggleCollapse && (
          <div className="hidden lg:block p-4 border-t border-border">
            <button
              onClick={onToggleCollapse}
              className="w-full flex items-center justify-center p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors duration-150"
            >
              <Icon 
                name={isCollapsed ? "ChevronRight" : "ChevronLeft"} 
                size={20} 
              />
            </button>
          </div>
        )}

        {/* User Profile */}
        <UserProfile isCollapsed={isCollapsed} userRole={userRole} />
      </aside>
    </>
  );
};

export default NavigationSidebar;