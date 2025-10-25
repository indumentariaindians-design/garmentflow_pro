import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const OrderTable = ({ orders = [], onEdit, onDelete, onViewDetails }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'in_production':
        return 'bg-orange-100 text-orange-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'draft':
        return 'Borrador';
      case 'confirmed':
        return 'Confirmado';
      case 'in_production':
        return 'En Producción';
      case 'completed':
        return 'Completado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Desconocido';
    }
  };

  const calculateOrderTotal = (orderItems = []) => {
    return orderItems?.reduce((total, item) => {
      return total + (item?.qty * item?.unit_price);
    }, 0) || 0;
  };

  const isOverdue = (dueDate, status) => {
    if (!dueDate || status === 'completed') return false;
    return new Date(dueDate) < new Date();
  };

  if (!orders?.length) {
    return (
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-8">
        <div className="text-center">
          <Icon name="Package" size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron pedidos</h3>
          <p className="text-gray-500 mb-6">Comienza creando tu primer pedido</p>
          <Button
            onClick={() => onEdit?.(null)}
            className="flex items-center space-x-2 mx-auto"
          >
            <Icon name="Plus" size={16} />
            <span>Crear Pedido</span>
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
                Pedido
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Creación
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vencimiento
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders?.map((order) => (
              <tr key={order?.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {order?.order_code}
                      </div>
                      {order?.order_items?.length > 0 && (
                        <div className="text-sm text-gray-500">
                          {order?.order_items?.length} artículo{order?.order_items?.length !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order?.customer?.name || 'Cliente no asignado'}</div>
                  {order?.customer?.email && (
                    <div className="text-sm text-gray-500">{order?.customer?.email}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order?.status)}`}>
                    {getStatusLabel(order?.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(order?.created_at)?.toLocaleDateString('es-AR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order?.due_date ? (
                    <div className={`text-sm ${isOverdue(order?.due_date, order?.status) ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                      {new Date(order?.due_date)?.toLocaleDateString('es-AR')}
                      {isOverdue(order?.due_date, order?.status) && (
                        <div className="flex items-center mt-1">
                          <Icon name="AlertTriangle" size={12} className="text-red-500 mr-1" />
                          <span className="text-xs">Retrasado</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">No definido</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${calculateOrderTotal(order?.order_items)?.toLocaleString('es-AR', { 
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2 
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails?.(order)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Icon name="Eye" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit?.(order)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Icon name="Edit" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete?.(order?.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Icon name="Trash2" size={16} />
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

export default OrderTable;