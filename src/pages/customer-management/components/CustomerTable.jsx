import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const CustomerTable = ({ customers = [], onEdit, onDelete, onSendNotification }) => {
  const calculateCustomerValue = (customer) => {
    return customer?.invoices?.reduce((total, invoice) => {
      return total + (parseFloat(invoice?.grand_total) || 0);
    }, 0) || 0;
  };

  const getCustomerOrdersCount = (customer) => {
    return customer?.orders?.length || 0;
  };

  const getLastOrderDate = (customer) => {
    if (!customer?.orders?.length) return null;
    const lastOrder = customer?.orders?.reduce((latest, order) => {
      return new Date(order.created_at) > new Date(latest.created_at) ? order : latest;
    });
    return lastOrder?.created_at;
  };

  if (!customers?.length) {
    return (
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-8">
        <div className="text-center">
          <Icon name="Users" size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron clientes</h3>
          <p className="text-gray-500 mb-6">Comienza agregando tu primer cliente</p>
          <Button
            onClick={() => onEdit?.(null)}
            className="flex items-center space-x-2 mx-auto"
          >
            <Icon name="Plus" size={16} />
            <span>Agregar Cliente</span>
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
                Cliente
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contacto
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pedidos
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor Total
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Último Pedido
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers?.map((customer) => (
              <tr key={customer?.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-medium">
                      {customer?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {customer?.name}
                      </div>
                      {customer?.tax_id && (
                        <div className="text-sm text-gray-500">
                          CUIT/DNI: {customer?.tax_id}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-1">
                    {customer?.email && (
                      <div className="flex items-center text-sm text-gray-900">
                        <Icon name="Mail" size={12} className="mr-1 text-gray-400" />
                        {customer?.email}
                      </div>
                    )}
                    {customer?.phone && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Icon name="Phone" size={12} className="mr-1 text-gray-400" />
                        {customer?.phone}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <Icon name="Package" size={16} className="text-blue-500 mr-2" />
                    {getCustomerOrdersCount(customer)} pedido{getCustomerOrdersCount(customer) !== 1 ? 's' : ''}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  ${calculateCustomerValue(customer)?.toLocaleString('es-AR', { 
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2 
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {getLastOrderDate(customer) ? (
                    <div>
                      <div>{new Date(getLastOrderDate(customer))?.toLocaleDateString('es-AR')}</div>
                      <div className="text-xs text-gray-500">
                        Hace {Math.floor((new Date() - new Date(getLastOrderDate(customer))) / (1000 * 60 * 60 * 24))} días
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-500">Sin pedidos</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center space-x-1">
                    {customer?.email && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onSendNotification?.(customer, 'email')}
                        className="text-green-600 hover:text-green-900"
                        title="Enviar Email"
                      >
                        <Icon name="Mail" size={14} />
                      </Button>
                    )}
                    {customer?.phone && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onSendNotification?.(customer, 'whatsapp')}
                        className="text-green-600 hover:text-green-900"
                        title="Enviar WhatsApp"
                      >
                        <Icon name="MessageCircle" size={14} />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit?.(customer)}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Editar"
                    >
                      <Icon name="Edit" size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete?.(customer?.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Eliminar"
                    >
                      <Icon name="Trash2" size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerTable;