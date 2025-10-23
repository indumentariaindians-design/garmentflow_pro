import React from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const EmployeeFilters = ({ 
  filters, 
  onFilterChange, 
  employeeCounts,
  onClearFilters 
}) => {
  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'admin', label: 'Administrator' },
    { value: 'manager', label: 'Production Manager' },
    { value: 'ventas', label: 'Sales Representative' },
    { value: 'station', label: 'Station Worker' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  const departmentOptions = [
    { value: 'all', label: 'All Departments' },
    { value: 'production', label: 'Production' },
    { value: 'sales', label: 'Sales' },
    { value: 'administration', label: 'Administration' },
    { value: 'quality', label: 'Quality Control' }
  ];

  const hasActiveFilters = filters?.search || filters?.role !== 'all' || filters?.status !== 'all' || filters?.department !== 'all';

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 lg:mb-0">
          Employee Filters
        </h3>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Active: {employeeCounts?.active}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Inactive: {employeeCounts?.inactive}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Total: {employeeCounts?.total}</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1">
          <Input
            type="search"
            placeholder="Search employees..."
            value={filters?.search}
            onChange={(e) => onFilterChange('search', e?.target?.value)}
            className="w-full"
          />
        </div>

        <div>
          <Select
            options={roleOptions}
            value={filters?.role}
            onChange={(value) => onFilterChange('role', value)}
            placeholder="Select role"
          />
        </div>

        <div>
          <Select
            options={statusOptions}
            value={filters?.status}
            onChange={(value) => onFilterChange('status', value)}
            placeholder="Select status"
          />
        </div>

        <div>
          <Select
            options={departmentOptions}
            value={filters?.department}
            onChange={(value) => onFilterChange('department', value)}
            placeholder="Select department"
          />
        </div>
      </div>
      {hasActiveFilters && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Icon name="Filter" size={16} />
            <span>Filters applied</span>
          </div>
          <button
            onClick={onClearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default EmployeeFilters;