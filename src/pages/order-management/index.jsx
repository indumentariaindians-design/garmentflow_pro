import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Icon from '../../components/AppIcon';
import OrderTable from './components/OrderTable';
import OrderModal from './components/OrderModal';
import { supabase } from '../../lib/supabase';

const OrderManagement = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userRole] = useState('admin');
  
  // Data states
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // UI states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Error handling
  const [error, setError] = useState('');

  const statusOptions = [
    { value: 'all', label: 'Todos los Estados' },
    { value: 'draft', label: 'Borrador' },
    { value: 'confirmed', label: 'Confirmado' },
    { value: 'in_production', label: 'En Producción' },
    { value: 'completed', label: 'Completado' },
    { value: 'cancelled', label: 'Cancelado' }
  ];

  // Load data
  const loadOrders = async () => {
    try {
      const { data, error } = await supabase?.from('orders')?.select(`
          *,
          customer:customers(*),
          order_items(
            id,
            qty,
            unit_price,
            variant:product_variants(
              id,
              code,
              color,
              size,
              product:products(name, sku)
            )
          )
        `)?.order('created_at', { ascending: false });

      if (error) {
        setError('Error al cargar pedidos: ' + error?.message);
        return;
      }

      setOrders(data || []);
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        setError('No se puede conectar a la base de datos. Tu proyecto de Supabase puede estar pausado. Por favor verifica tu dashboard de Supabase.');
        return;
      }
      setError('Error al cargar pedidos');
    } finally {
      setLoading(false);
    }
  };

  const loadCustomers = async () => {
    try {
      const { data, error } = await supabase?.from('customers')?.select('*')?.order('name');

      if (error) {
        setError('Error al cargar clientes: ' + error?.message);
        return;
      }

      setCustomers(data || []);
    } catch (error) {
      if (error?.message?.includes('Failed to fetch')) {
        setError('No se puede conectar a la base de datos. Verifica tu conexión a Supabase.');
        return;
      }
      setError('Error al cargar clientes');
    }
  };

  useEffect(() => {
    loadOrders();
    loadCustomers();
  }, []);

  // Real-time subscriptions
  useEffect(() => {
    const channel = supabase?.channel('orders_changes')?.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          loadOrders(); // Reload orders on any change
        }
      )?.subscribe();

    return () => supabase?.removeChannel(channel);
  }, []);

  // Filter orders
  const filteredOrders = orders?.filter(order => {
    const matchesSearch = order?.order_code?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         order?.customer?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order?.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateOrder = () => {
    setSelectedOrder(null);
    setIsModalOpen(true);
  };

  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este pedido?')) {
      return;
    }

    try {
      const { error } = await supabase?.from('orders')?.delete()?.eq('id', orderId);

      if (error) {
        setError('Error al eliminar pedido: ' + error?.message);
        return;
      }

      loadOrders();
    } catch (error) {
      setError('Error al eliminar pedido');
    }
  };

  const handleSaveOrder = async (orderData) => {
    try {
      if (selectedOrder) {
        // Update existing order
        const { error } = await supabase?.from('orders')?.update(orderData)?.eq('id', selectedOrder?.id);

        if (error) {
          setError('Error al actualizar pedido: ' + error?.message);
          return;
        }
      } else {
        // Create new order
        const { error } = await supabase?.from('orders')?.insert([orderData]);

        if (error) {
          setError('Error al crear pedido: ' + error?.message);
          return;
        }
      }

      setIsModalOpen(false);
      loadOrders();
    } catch (error) {
      setError('Error al guardar pedido');
    }
  };

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleExportCSV = () => {
    if (!filteredOrders?.length) {
      setError('No hay pedidos para exportar');
      return;
    }

    const csvContent = [
      ['Código', 'Cliente', 'Estado', 'Fecha', 'Vencimiento', 'Notas']?.join(','),
      ...filteredOrders?.map(order => [
        order?.order_code || '',
        order?.customer?.name || '',
        order?.status || '',
        new Date(order?.created_at)?.toLocaleDateString('es-AR'),
        order?.due_date ? new Date(order?.due_date)?.toLocaleDateString('es-AR') : '',
        (order?.notes || '')?.replace(/,/g, ';')
      ]?.join(','))
    ]?.join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `pedidos_${new Date()?.toISOString()?.split('T')?.[0]}.csv`;
    link?.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationSidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
        userRole={userRole}
      />
      <main className={`transition-all duration-300 ${isCollapsed ? 'lg:ml-16' : 'lg:ml-60'}`}>
        <div className="p-6 lg:p-8">
          <BreadcrumbTrail />
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Gestión de Pedidos</h1>
                <p className="text-muted-foreground mt-1">
                  Administra y da seguimiento a todos los pedidos de producción
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  onClick={handleExportCSV}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <Icon name="Download" size={16} />
                  <span>Exportar CSV</span>
                </Button>
                <Button
                  onClick={handleCreateOrder}
                  className="flex items-center space-x-2"
                >
                  <Icon name="Plus" size={16} />
                  <span>Nuevo Pedido</span>
                </Button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon name="AlertCircle" size={16} className="text-red-600" />
                  <span className="text-red-700">{error}</span>
                </div>
                <button
                  onClick={() => setError('')}
                  className="text-red-600 hover:text-red-800"
                >
                  <Icon name="X" size={16} />
                </button>
              </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Buscar por código o cliente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e?.target?.value)}
                    className="w-full"
                  />
                </div>
                <div className="lg:w-48">
                  <Select
                    options={statusOptions}
                    value={statusFilter}
                    onChange={setStatusFilter}
                    placeholder="Estado"
                  />
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Pedidos</p>
                    <p className="text-2xl font-bold text-foreground">{orders?.length || 0}</p>
                  </div>
                  <Icon name="Package" size={24} className="text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">En Producción</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {orders?.filter(o => o?.status === 'in_production')?.length || 0}
                    </p>
                  </div>
                  <Icon name="Clock" size={24} className="text-orange-500" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Completados</p>
                    <p className="text-2xl font-bold text-green-600">
                      {orders?.filter(o => o?.status === 'completed')?.length || 0}
                    </p>
                  </div>
                  <Icon name="CheckCircle" size={24} className="text-green-500" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Retrasados</p>
                    <p className="text-2xl font-bold text-red-600">
                      {orders?.filter(o => o?.due_date && new Date(o?.due_date) < new Date() && o?.status !== 'completed')?.length || 0}
                    </p>
                  </div>
                  <Icon name="AlertTriangle" size={24} className="text-red-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <OrderTable
            orders={filteredOrders}
            onEdit={handleEditOrder}
            onDelete={handleDeleteOrder}
            onViewDetails={(order) => navigate(`/order-details?id=${order?.id}`)}
          />
        </div>
      </main>
      {/* Order Modal */}
      {isModalOpen && (
        <OrderModal
          order={selectedOrder}
          customers={customers}
          onSave={handleSaveOrder}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default OrderManagement;