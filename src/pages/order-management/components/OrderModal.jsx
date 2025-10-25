import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const OrderModal = ({ order, customers = [], onSave, onClose }) => {
  const [formData, setFormData] = useState({
    order_code: '',
    customer_id: '',
    due_date: '',
    notes: '',
    status: 'draft'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusOptions = [
    { value: 'draft', label: 'Borrador' },
    { value: 'confirmed', label: 'Confirmado' },
    { value: 'in_production', label: 'En Producción' },
    { value: 'completed', label: 'Completado' },
    { value: 'cancelled', label: 'Cancelado' }
  ];

  const customerOptions = [
    { value: '', label: 'Seleccionar cliente...' },
    ...customers?.map(customer => ({
      value: customer?.id,
      label: customer?.name
    }))
  ];

  useEffect(() => {
    if (order) {
      setFormData({
        order_code: order?.order_code || '',
        customer_id: order?.customer_id || '',
        due_date: order?.due_date || '',
        notes: order?.notes || '',
        status: order?.status || 'draft'
      });
    }
  }, [order]);

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.order_code?.trim()) {
      newErrors.order_code = 'El código del pedido es requerido';
    }

    if (!formData?.customer_id) {
      newErrors.customer_id = 'Debe seleccionar un cliente';
    }

    if (formData?.due_date) {
      const dueDate = new Date(formData?.due_date);
      const today = new Date();
      today?.setHours(0, 0, 0, 0);
      
      if (dueDate < today) {
        newErrors.due_date = 'La fecha de vencimiento no puede ser anterior a hoy';
      }
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
      const orderData = {
        ...formData,
        due_date: formData?.due_date || null
      };

      await onSave?.(orderData);
    } catch (error) {
      console.error('Error saving order:', error);
    } finally {
      setIsSubmitting(false);
    }
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
      <div className="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {order ? 'Editar Pedido' : 'Nuevo Pedido'}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código del Pedido *
                </label>
                <Input
                  type="text"
                  value={formData?.order_code}
                  onChange={(e) => handleChange('order_code', e?.target?.value)}
                  placeholder="Ej: PED-001"
                  className={errors?.order_code ? 'border-red-300' : ''}
                />
                {errors?.order_code && (
                  <p className="text-red-500 text-sm mt-1">{errors?.order_code}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cliente *
                </label>
                <Select
                  options={customerOptions}
                  value={formData?.customer_id}
                  onChange={(value) => handleChange('customer_id', value)}
                  placeholder="Seleccionar cliente..."
                  className={errors?.customer_id ? 'border-red-300' : ''}
                />
                {errors?.customer_id && (
                  <p className="text-red-500 text-sm mt-1">{errors?.customer_id}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Vencimiento
                </label>
                <Input
                  type="date"
                  value={formData?.due_date}
                  onChange={(e) => handleChange('due_date', e?.target?.value)}
                  className={errors?.due_date ? 'border-red-300' : ''}
                />
                {errors?.due_date && (
                  <p className="text-red-500 text-sm mt-1">{errors?.due_date}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <Select
                  options={statusOptions}
                  value={formData?.status}
                  onChange={(value) => handleChange('status', value)}
                  placeholder="Seleccionar estado..."
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas
              </label>
              <textarea
                value={formData?.notes}
                onChange={(e) => handleChange('notes', e?.target?.value)}
                placeholder="Notas adicionales sobre el pedido..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Icon name="Info" size={16} className="text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">Información importante:</p>
                  <ul className="list-disc list-inside space-y-1 text-blue-600">
                    <li>Los artículos del pedido se pueden agregar después de crear el pedido</li>
                    <li>El código del pedido debe ser único en el sistema</li>
                    <li>Los pedidos en estado "Completado" no se pueden modificar</li>
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
                  <span>{order ? 'Actualizar' : 'Crear'} Pedido</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderModal;