import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const BreadcrumbTrail = ({ customBreadcrumbs = null }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const routeLabels = {
    '/dashboard': 'Dashboard',
    '/order-management': 'Order Management',
    '/order-details': 'Order Details',
    '/station-hub': 'Station Hub',
    '/station-interface': 'Station Interface',
    '/customer-management': 'Customer Management',
    '/inventory-control': 'Inventory Control',
    '/product-catalog': 'Product Catalog',
    '/invoice-management': 'Invoice Management',
    '/invoice-details': 'Invoice Details',
    '/admin-panel': 'Administration'
  };

  const generateBreadcrumbs = () => {
    if (customBreadcrumbs) {
      return customBreadcrumbs;
    }

    const pathSegments = location?.pathname?.split('/')?.filter(Boolean);
    const breadcrumbs = [];

    // Always start with Dashboard for non-dashboard pages
    if (location?.pathname !== '/dashboard') {
      breadcrumbs?.push({
        label: 'Dashboard',
        path: '/dashboard',
        icon: 'BarChart3'
      });
    }

    // Build breadcrumbs from path segments
    let currentPath = '';
    pathSegments?.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const label = routeLabels?.[currentPath] || segment?.charAt(0)?.toUpperCase() + segment?.slice(1);
      
      breadcrumbs?.push({
        label,
        path: currentPath,
        isLast: index === pathSegments?.length - 1
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  const handleNavigate = (path) => {
    if (path) {
      navigate(path);
    }
  };

  if (breadcrumbs?.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs?.map((crumb, index) => (
          <li key={index} className="flex items-center space-x-2">
            {index > 0 && (
              <Icon 
                name="ChevronRight" 
                size={16} 
                className="text-muted-foreground" 
              />
            )}
            
            {crumb?.isLast ? (
              <span className="text-foreground font-medium flex items-center space-x-1">
                {crumb?.icon && (
                  <Icon 
                    name={crumb?.icon} 
                    size={16} 
                    className="text-muted-foreground" 
                  />
                )}
                <span>{crumb?.label}</span>
              </span>
            ) : (
              <button
                onClick={() => handleNavigate(crumb?.path)}
                className="flex items-center space-x-1 hover:text-foreground transition-colors duration-150 focus:outline-none focus:text-foreground"
              >
                {crumb?.icon && (
                  <Icon 
                    name={crumb?.icon} 
                    size={16} 
                    className="text-muted-foreground" 
                  />
                )}
                <span>{crumb?.label}</span>
              </button>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default BreadcrumbTrail;