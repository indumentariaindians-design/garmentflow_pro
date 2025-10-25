import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const CustomerModal = ({ customer, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    tax_id: '',
    billing_address: '',
    shipping_address: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer?.name || '',
        email: customer?.email || '',
        phone: customer?.phone || '',
        tax_id: customer?.tax_id || '',
        billing_address: customer?.billing_address || '',
        shipping_address: customer?.shipping_address || ''
      });
    }
  }, [customer]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex?.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (formData?.email && !validateEmail(formData?.email)) {
      newErrors.email = 'El formato del email no es válido';
    }

    if (formData?.phone && formData?.phone?.length < 8) {
      newErrors.phone = 'El teléfono debe tener al menos 8 dígitos';
    }

    if (formData?.tax_id && formData?.tax_id?.length < 7) {
      newErrors.tax_id = 'El CUIT/DNI debe tener al menos 7 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const customerData = {
        ...formData,
        email: formData?.email || null,
        phone: formData?.phone || null,
        tax_id: formData?.tax_id || null,
        billing_address: formData?.billing_address || null,
        shipping_address: formData?.shipping_address || null
      };

      await onSave?.(customerData);
    } catch (error) {
      console.error('Error saving customer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyBillingToShipping = () => {
    setFormData(prev => ({
      ...prev,
      shipping_address: prev?.billing_address
    }));
  };

  const handleKeyDown = (e) => {
    if (e?.key === 'Escape') {
      onClose?.();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="bg-white rounded-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {customer ? 'Editar Cliente' : 'Nuevo Cliente'}
            </h2>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <Icon name="X" size={20} />
            </Button>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Información Básica</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo *
                  </label>
                  <Input
                    type="text"
                    value={formData?.name}
                    onChange={(e) => handleChange('name', e?.target?.value)}
                    placeholder="Nombre de la empresa o persona"
                    className={errors?.name ? 'border-red-300' : ''}
                  />
                  {errors?.name && (
                    <p className="text-red-500 text-sm mt-1">{errors?.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CUIT / DNI
                  </label>
                  <Input
                    type="text"
                    value={formData?.tax_id}
                    onChange={(e) => handleChange('tax_id', e?.target?.value)}
                    placeholder="20-12345678-9 o 12345678"
                    className={errors?.tax_id ? 'border-red-300' : ''}
                  />
                  {errors?.tax_id && (
                    <p className="text-red-500 text-sm mt-1">{errors?.tax_id}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Información de Contacto</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={formData?.email}
                    onChange={(e) => handleChange('email', e?.target?.value)}
                    placeholder="cliente@empresa.com"
                    className={errors?.email ? 'border-red-300' : ''}
                  />
                  {errors?.email && (
                    <p className="text-red-500 text-sm mt-1">{errors?.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <Input
                    type="tel"
                    value={formData?.phone}
                    onChange={(e) => handleChange('phone', e?.target?.value)}
                    placeholder="+54 11 1234-5678"
                    className={errors?.phone ? 'border-red-300' : ''}
                  />
                  {errors?.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors?.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Direcciones</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección de Facturación
                  </label>
                  <textarea
                    value={formData?.billing_address}
                    onChange={(e) => handleChange('billing_address', e?.target?.value)}
                    placeholder="Calle, número, ciudad, código postal"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Dirección de Envío
                    </label>
                    {formData?.billing_address && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleCopyBillingToShipping}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        <Icon name="Copy" size={12} className="mr-1" />
                        Copiar facturación
                      </Button>
                    )}
                  </div>
                  <textarea
                    value={formData?.shipping_address}
                    onChange={(e) => handleChange('shipping_address', e?.target?.value)}
                    placeholder="Calle, número, ciudad, código postal"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Icon name="Info" size={16} className="text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">Información importante:</p>
                  <ul className="list-disc list-inside space-y-1 text-blue-600">
                    <li>El email y teléfono son opcionales pero recomendados para notificaciones</li>
                    <li>El CUIT/DNI es necesario para la facturación electrónica</li>
                    <li>Las direcciones se pueden copiar automáticamente en los pedidos</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Icon name="Save" size={16} />
                  <span>{customer ? 'Actualizar' : 'Crear'} Cliente</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerModal;