import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const EmployeeModal = ({ isOpen, onClose, employee, onSave, mode = 'create' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'station',
    department: 'production',
    status: 'active',
    permissions: [],
    sendInvitation: true
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (employee && mode === 'edit') {
      setFormData({
        name: employee?.name || '',
        email: employee?.email || '',
        role: employee?.role || 'station',
        department: employee?.department || 'production',
        status: employee?.status || 'active',
        permissions: employee?.permissions || [],
        sendInvitation: false
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'station',
        department: 'production',
        status: 'active',
        permissions: [],
        sendInvitation: true
      });
    }
    setErrors({});
  }, [employee, mode, isOpen]);

  const roleOptions = [
    { value: 'admin', label: 'Administrator' },
    { value: 'manager', label: 'Production Manager' },
    { value: 'ventas', label: 'Sales Representative' },
    { value: 'station', label: 'Station Worker' }
  ];

  const departmentOptions = [
    { value: 'production', label: 'Production' },
    { value: 'sales', label: 'Sales' },
    { value: 'administration', label: 'Administration' },
    { value: 'quality', label: 'Quality Control' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  const permissionOptions = [
    { id: 'view_orders', label: 'View Orders', description: 'Can view order information' },
    { id: 'edit_orders', label: 'Edit Orders', description: 'Can modify order details' },
    { id: 'view_inventory', label: 'View Inventory', description: 'Can access inventory data' },
    { id: 'edit_inventory', label: 'Edit Inventory', description: 'Can modify inventory levels' },
    { id: 'view_reports', label: 'View Reports', description: 'Can access system reports' },
    { id: 'manage_users', label: 'Manage Users', description: 'Can add/edit user accounts' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData?.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.role) {
      newErrors.role = 'Role is required';
    }

    if (!formData?.department) {
      newErrors.department = 'Department is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving employee:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handlePermissionChange = (permissionId, checked) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked 
        ? [...prev?.permissions, permissionId]
        : prev?.permissions?.filter(id => id !== permissionId)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'create' ? 'Add New Employee' : 'Edit Employee'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Icon name="X" size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter employee name"
              value={formData?.name}
              onChange={(e) => handleInputChange('name', e?.target?.value)}
              error={errors?.name}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="Enter email address"
              value={formData?.email}
              onChange={(e) => handleInputChange('email', e?.target?.value)}
              error={errors?.email}
              required
            />

            <Select
              label="Role"
              options={roleOptions}
              value={formData?.role}
              onChange={(value) => handleInputChange('role', value)}
              error={errors?.role}
              required
            />

            <Select
              label="Department"
              options={departmentOptions}
              value={formData?.department}
              onChange={(value) => handleInputChange('department', value)}
              error={errors?.department}
              required
            />

            <Select
              label="Status"
              options={statusOptions}
              value={formData?.status}
              onChange={(value) => handleInputChange('status', value)}
            />
          </div>

          {mode === 'create' && (
            <div className="border-t border-gray-200 pt-6">
              <Checkbox
                label="Send invitation email"
                description="Send account setup instructions to the employee's email"
                checked={formData?.sendInvitation}
                onChange={(e) => handleInputChange('sendInvitation', e?.target?.checked)}
              />
            </div>
          )}

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Permissions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {permissionOptions?.map((permission) => (
                <Checkbox
                  key={permission?.id}
                  label={permission?.label}
                  description={permission?.description}
                  checked={formData?.permissions?.includes(permission?.id)}
                  onChange={(e) => handlePermissionChange(permission?.id, e?.target?.checked)}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isLoading}
              iconName={mode === 'create' ? 'UserPlus' : 'Save'}
            >
              {mode === 'create' ? 'Add Employee' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeModal;