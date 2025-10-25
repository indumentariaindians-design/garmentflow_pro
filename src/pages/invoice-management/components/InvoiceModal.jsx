import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const InvoiceModal = ({ invoice, customers = [], orders = [], onSave, onClose }) => {
  const [formData, setFormData] = useState({
    invoice_number: '',
    customer_id: '',
    order_id: '',
    issue_date: '',
    notes: '',
    status: 'draft',
    currency: 'ARS'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const statusOptions = [
    { value: 'draft', label: 'Borrador' },
    { value: 'issued', label: 'Emitida' },
    { value: 'paid', label: 'Pagada' },
    { value: 'void', label: 'Anulada' }
  ];

  const customerOptions = [
    { value: '', label: 'Seleccionar cliente...' },
    ...customers?.map(customer => ({
      value: customer?.id,
      label: customer?.name
    }))
  ];

  // Filter orders by selected customer
  const availableOrders = orders?.filter(order => 
    !formData?.customer_id || order?.customer?.id === formData?.customer_id
  ) || [];

  const orderOptions = [
    { value: '', label: 'Seleccionar pedido (opcional)...' },
    ...availableOrders?.map(order => ({
      value: order?.id,
      label: `${order?.order_code} - ${order?.customer?.name}`
    }))
  ];

  useEffect(() => {
    if (invoice) {
      setFormData({
        invoice_number: invoice?.invoice_number || '',
        customer_id: invoice?.customer_id || '',
        order_id: invoice?.order_id || '',
        issue_date: invoice?.issue_date || '',
        notes: invoice?.notes || '',
        status: invoice?.status || 'draft',
        currency: invoice?.currency || 'ARS'
      });
    } else {
      // Generate invoice number for new invoice
      const today = new Date();
      const invoiceNumber = `FAC-${today?.getFullYear()}-${String(today?.getMonth() + 1)?.padStart(2, '0')}-${String(Date.now())?.slice(-4)}`;
      setFormData(prev => ({
        ...prev,
        invoice_number: invoiceNumber,
        issue_date: today?.toISOString()?.split('T')?.[0]
      }));
    }
  }, [invoice]);

  useEffect(() => {
    // Load selected order details
    if (formData?.order_id) {
      const order = availableOrders?.find(o => o?.id === formData?.order_id);
      setSelectedOrder(order);
    } else {
      setSelectedOrder(null);
    }
  }, [formData?.order_id, availableOrders]);

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

    // Clear order when customer changes
    if (field === 'customer_id' && prev?.order_id) {
      setFormData(current => ({
        ...current,
        order_id: ''
      }));
    }
  };

  const calculateOrderTotal = (order) => {
    if (!order?.order_items) return 0;
    return order?.order_items?.reduce((total, item) => {
      return total + (item?.qty * item?.unit_price);
    }, 0);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.invoice_number?.trim()) {
      newErrors.invoice_number = 'El número de factura es requerido';
    }

    if (!formData?.customer_id) {
      newErrors.customer_id = 'Debe seleccionar un cliente';
    }

    if (!formData?.issue_date) {
      newErrors.issue_date = 'La fecha de emisión es requerida';
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
      const invoiceData = {
        ...formData,
        order_id: formData?.order_id || null,
        notes: formData?.notes || null
      };

      // If creating from an order, calculate totals
      if (selectedOrder && !invoice) {
        const subtotal = calculateOrderTotal(selectedOrder);
        const taxTotal = subtotal * 0.21; // 21% IVA
        const grandTotal = subtotal + taxTotal;
        
        invoiceData.subtotal = subtotal;
        invoiceData.tax_total = taxTotal;
        invoiceData.grand_total = grandTotal;
        invoiceData.discount_total = 0;
      }

      await onSave?.(invoiceData);
    } catch (error) {
      console.error('Error saving invoice:', error);
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
      <div className="bg-white rounded-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {invoice ? 'Editar Factura' : 'Nueva Factura'}
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
                  Número de Factura *
                </label>
                <Input
                  type="text"
                  value={formData?.invoice_number}
                  onChange={(e) => handleChange('invoice_number', e?.target?.value)}
                  placeholder="FAC-2024-001"
                  className={errors?.invoice_number ? 'border-red-300' : ''}
                />
                {errors?.invoice_number && (
                  <p className="text-red-500 text-sm mt-1">{errors?.invoice_number}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Emisión *
                </label>
                <Input
                  type="date"
                  value={formData?.issue_date}
                  onChange={(e) => handleChange('issue_date', e?.target?.value)}
                  className={errors?.issue_date ? 'border-red-300' : ''}
                />
                {errors?.issue_date && (
                  <p className="text-red-500 text-sm mt-1">{errors?.issue_date}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pedido (Opcional)
                </label>
                <Select
                  options={orderOptions}
                  value={formData?.order_id}
                  onChange={(value) => handleChange('order_id', value)}
                  placeholder="Seleccionar pedido..."
                  disabled={!formData?.customer_id}
                />
                <p className="text-gray-500 text-sm mt-1">
                  {formData?.customer_id ? 'Selecciona un pedido para cargar automáticamente los artículos' : 'Primero selecciona un cliente'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Moneda
                </label>
                <Input
                  type="text"
                  value={formData?.currency}
                  onChange={(e) => handleChange('currency', e?.target?.value)}
                  placeholder="ARS"
                  className="bg-gray-50"
                  readOnly
                />
              </div>
            </div>

            {/* Order Preview */}
            {selectedOrder && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">
                  Vista Previa del Pedido: {selectedOrder?.order_code}
                </h4>
                <div className="space-y-2">
                  {selectedOrder?.order_items?.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-blue-700">
                        {item?.variant?.product?.name} {item?.variant?.color} {item?.variant?.size}
                      </span>
                      <span className="text-blue-900 font-medium">
                        {item?.qty} × ${item?.unit_price} = ${(item?.qty * item?.unit_price)?.toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-blue-300 pt-2 mt-2">
                    <div className="flex justify-between text-sm font-medium text-blue-900">
                      <span>Total del Pedido:</span>
                      <span>${calculateOrderTotal(selectedOrder)?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas
              </label>
              <textarea
                value={formData?.notes}
                onChange={(e) => handleChange('notes', e?.target?.value)}
                placeholder="Notas adicionales, condiciones de pago, etc."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </div>

            {/* Info Box */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Icon name="Info" size={16} className="text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-700">
                  <p className="font-medium mb-1">Información importante:</p>
                  <ul className="list-disc list-inside space-y-1 text-yellow-600">
                    <li>Si seleccionas un pedido, los artículos se cargarán automáticamente</li>
                    <li>Los impuestos se calculan automáticamente (21% IVA)</li>
                    <li>Las facturas emitidas no se pueden editar, solo anular</li>
                    <li>Los pagos se registran por separado una vez emitida la factura</li>
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
                  <span>{invoice ? 'Actualizar' : 'Crear'} Factura</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceModal;