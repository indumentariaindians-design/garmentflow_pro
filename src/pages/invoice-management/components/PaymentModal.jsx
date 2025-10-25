import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const PaymentModal = ({ invoice, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    amount: '',
    payment_date: '',
    method: 'cash',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const paymentMethods = [
    { value: 'cash', label: 'Efectivo' },
    { value: 'card', label: 'Tarjeta' },
    { value: 'bank', label: 'Transferencia Bancaria' },
    { value: 'mercadopago', label: 'MercadoPago' },
    { value: 'other', label: 'Otro' }
  ];

  const calculatePaidAmount = () => {
    return invoice?.payments?.reduce((total, payment) => {
      return total + (parseFloat(payment?.amount) || 0);
    }, 0) || 0;
  };

  const calculateBalance = () => {
    const grandTotal = parseFloat(invoice?.grand_total) || 0;
    const paidAmount = calculatePaidAmount();
    return grandTotal - paidAmount;
  };

  useEffect(() => {
    const balance = calculateBalance();
    setFormData(prev => ({
      ...prev,
      amount: balance > 0 ? balance?.toFixed(2) : '',
      payment_date: new Date()?.toISOString()?.split('T')?.[0]
    }));
  }, [invoice]);

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
    const balance = calculateBalance();

    if (!formData?.amount || parseFloat(formData?.amount) <= 0) {
      newErrors.amount = 'El monto debe ser mayor a 0';
    } else if (parseFloat(formData?.amount) > balance) {
      newErrors.amount = `El monto no puede ser mayor al saldo pendiente ($${balance?.toFixed(2)})`;
    }

    if (!formData?.payment_date) {
      newErrors.payment_date = 'La fecha de pago es requerida';
    }

    if (!formData?.method) {
      newErrors.method = 'Debe seleccionar un método de pago';
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
      const paymentData = {
        ...formData,
        amount: parseFloat(formData?.amount),
        notes: formData?.notes || null
      };

      await onSave?.(paymentData);
    } catch (error) {
      console.error('Error saving payment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e?.key === 'Escape') {
      onClose?.();
    }
  };

  const grandTotal = parseFloat(invoice?.grand_total) || 0;
  const paidAmount = calculatePaidAmount();
  const balance = calculateBalance();

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
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Registrar Pago
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Factura: {invoice?.invoice_number} - {invoice?.customer?.name}
              </p>
            </div>
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
            {/* Invoice Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Resumen de Factura</h3>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    ${grandTotal?.toLocaleString('es-AR', { 
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2 
                    })}
                  </div>
                  <div className="text-sm text-gray-600">Total Factura</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    ${paidAmount?.toLocaleString('es-AR', { 
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2 
                    })}
                  </div>
                  <div className="text-sm text-gray-600">Ya Pagado</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    ${balance?.toLocaleString('es-AR', { 
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2 
                    })}
                  </div>
                  <div className="text-sm text-gray-600">Saldo Pendiente</div>
                </div>
              </div>
              
              {/* Previous Payments */}
              {invoice?.payments?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Pagos Anteriores:</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {invoice?.payments?.map((payment, index) => (
                      <div key={payment?.id || index} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {new Date(payment?.payment_date)?.toLocaleDateString('es-AR')} - 
                          {paymentMethods?.find(m => m?.value === payment?.method)?.label || payment?.method}
                        </span>
                        <span className="font-medium text-gray-900">
                          ${parseFloat(payment?.amount)?.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Payment Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Nuevo Pago</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monto a Pagar *
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={balance}
                    value={formData?.amount}
                    onChange={(e) => handleChange('amount', e?.target?.value)}
                    placeholder="0.00"
                    className={errors?.amount ? 'border-red-300' : ''}
                  />
                  {errors?.amount && (
                    <p className="text-red-500 text-sm mt-1">{errors?.amount}</p>
                  )}
                  <p className="text-gray-500 text-sm mt-1">
                    Máximo: ${balance?.toFixed(2)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Pago *
                  </label>
                  <Input
                    type="date"
                    value={formData?.payment_date}
                    onChange={(e) => handleChange('payment_date', e?.target?.value)}
                    className={errors?.payment_date ? 'border-red-300' : ''}
                  />
                  {errors?.payment_date && (
                    <p className="text-red-500 text-sm mt-1">{errors?.payment_date}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Método de Pago *
                </label>
                <Select
                  options={paymentMethods}
                  value={formData?.method}
                  onChange={(value) => handleChange('method', value)}
                  placeholder="Seleccionar método..."
                  className={errors?.method ? 'border-red-300' : ''}
                />
                {errors?.method && (
                  <p className="text-red-500 text-sm mt-1">{errors?.method}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas
                </label>
                <textarea
                  value={formData?.notes}
                  onChange={(e) => handleChange('notes', e?.target?.value)}
                  placeholder="Número de transacción, observaciones, etc."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Icon name="Info" size={16} className="text-green-600 mt-0.5" />
                <div className="text-sm text-green-700">
                  <p className="font-medium mb-1">¿Qué sucede después?</p>
                  <ul className="list-disc list-inside space-y-1 text-green-600">
                    <li>El pago se registrará en el historial de la factura</li>
                    <li>El saldo pendiente se actualizará automáticamente</li>
                    <li>Si el pago cubre el total, la factura se marcará como "Pagada"</li>
                    <li>Se puede registrar pagos parciales múltiples</li>
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
                  <span>Registrando...</span>
                </>
              ) : (
                <>
                  <Icon name="DollarSign" size={16} />
                  <span>Registrar Pago</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;