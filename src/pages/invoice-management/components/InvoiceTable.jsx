import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const InvoiceTable = ({ 
  invoices = [], 
  onEdit, 
  onDelete, 
  onRegisterPayment,
  onGeneratePDF,
  onSendInvoice
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'issued':
        return 'bg-orange-100 text-orange-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'void':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'draft':
        return 'Borrador';
      case 'issued':
        return 'Emitida';
      case 'paid':
        return 'Pagada';
      case 'void':
        return 'Anulada';
      default:
        return 'Desconocido';
    }
  };

  const calculatePaidAmount = (payments = []) => {
    return payments?.reduce((total, payment) => {
      return total + (parseFloat(payment?.amount) || 0);
    }, 0) || 0;
  };

  const calculateBalance = (invoice) => {
    const grandTotal = parseFloat(invoice?.grand_total) || 0;
    const paidAmount = calculatePaidAmount(invoice?.payments);
    return grandTotal - paidAmount;
  };

  const isOverdue = (invoice) => {
    // Consider overdue if issued more than 30 days ago and not paid
    if (invoice?.status !== 'issued') return false;
    const issueDate = new Date(invoice?.issue_date);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo?.setDate(thirtyDaysAgo?.getDate() - 30);
    return issueDate < thirtyDaysAgo;
  };

  if (!invoices?.length) {
    return (
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-8">
        <div className="text-center">
          <Icon name="FileText" size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron facturas</h3>
          <p className="text-gray-500 mb-6">Comienza creando tu primera factura</p>
          <Button
            onClick={() => onEdit?.(null)}
            className="flex items-center space-x-2 mx-auto"
          >
            <Icon name="Plus" size={16} />
            <span>Crear Factura</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Factura
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pagado
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Saldo
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoices?.map((invoice) => {
              const paidAmount = calculatePaidAmount(invoice?.payments);
              const balance = calculateBalance(invoice);
              const overdue = isOverdue(invoice);

              return (
                <tr key={invoice?.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {invoice?.invoice_number || `#${invoice?.id?.substring(0, 8)}`}
                        </div>
                        {invoice?.order && (
                          <div className="text-sm text-gray-500">
                            Pedido: {invoice?.order?.order_code}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{invoice?.customer?.name || 'Cliente no asignado'}</div>
                    {invoice?.customer?.email && (
                      <div className="text-sm text-gray-500">{invoice?.customer?.email}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice?.status)}`}>
                        {getStatusLabel(invoice?.status)}
                      </span>
                      {overdue && (
                        <div className="flex items-center text-red-600">
                          <Icon name="AlertTriangle" size={12} className="mr-1" />
                          <span className="text-xs">Vencida</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(invoice?.issue_date)?.toLocaleDateString('es-AR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${parseFloat(invoice?.grand_total || 0)?.toLocaleString('es-AR', { 
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2 
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${paidAmount?.toLocaleString('es-AR', { 
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2 
                    })}
                    {invoice?.payments?.length > 0 && (
                      <div className="text-xs text-gray-500">
                        {invoice?.payments?.length} pago{invoice?.payments?.length !== 1 ? 's' : ''}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      ${balance?.toLocaleString('es-AR', { 
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2 
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-1">
                      {/* Payment button - only for issued invoices with balance */}
                      {invoice?.status === 'issued' && balance > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRegisterPayment?.(invoice)}
                          className="text-green-600 hover:text-green-900"
                          title="Registrar Pago"
                        >
                          <Icon name="DollarSign" size={14} />
                        </Button>
                      )}
                      
                      {/* PDF button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onGeneratePDF?.(invoice)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Generar PDF"
                      >
                        <Icon name="FileText" size={14} />
                      </Button>

                      {/* Send email button */}
                      {invoice?.customer?.email && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onSendInvoice?.(invoice, 'email')}
                          className="text-purple-600 hover:text-purple-900"
                          title="Enviar por Email"
                        >
                          <Icon name="Mail" size={14} />
                        </Button>
                      )}

                      {/* Send WhatsApp button */}
                      {invoice?.customer?.phone && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onSendInvoice?.(invoice, 'whatsapp')}
                          className="text-green-600 hover:text-green-900"
                          title="Enviar por WhatsApp"
                        >
                          <Icon name="MessageCircle" size={14} />
                        </Button>
                      )}

                      {/* Edit button - only for drafts */}
                      {invoice?.status === 'draft' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit?.(invoice)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Editar"
                        >
                          <Icon name="Edit" size={14} />
                        </Button>
                      )}

                      {/* Delete button - only for drafts */}
                      {invoice?.status === 'draft' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete?.(invoice?.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Eliminar"
                        >
                          <Icon name="Trash2" size={14} />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceTable;