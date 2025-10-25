import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';
import CustomerTable from './components/CustomerTable';
import CustomerModal from './components/CustomerModal';
import { supabase } from '../../lib/supabase';

const CustomerManagement = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userRole] = useState('admin');
  
  // Data states
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // UI states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Error handling
  const [error, setError] = useState('');

  // Load customers
  const loadCustomers = async () => {
    try {
      const { data, error } = await supabase?.from('customers')?.select(`
          *,
          orders(id, order_code, status, created_at),
          invoices(id, invoice_number, status, grand_total)
        `)?.order('name');

      if (error) {
        setError('Error al cargar clientes: ' + error?.message);
        return;
      }

      setCustomers(data || []);
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        setError('No se puede conectar a la base de datos. Tu proyecto de Supabase puede estar pausado. Por favor verifica tu dashboard de Supabase.');
        return;
      }
      setError('Error al cargar clientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  // Real-time subscriptions
  useEffect(() => {
    const channel = supabase?.channel('customers_changes')?.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'customers' },
        (payload) => {
          loadCustomers(); // Reload customers on any change
        }
      )?.subscribe();

    return () => supabase?.removeChannel(channel);
  }, []);

  // Filter customers
  const filteredCustomers = customers?.filter(customer => {
    const searchLower = searchTerm?.toLowerCase();
    return customer?.name?.toLowerCase()?.includes(searchLower) ||
           customer?.email?.toLowerCase()?.includes(searchLower) ||
           customer?.phone?.includes(searchTerm) ||
           customer?.tax_id?.includes(searchTerm);
  });

  const handleCreateCustomer = () => {
    setSelectedCustomer(null);
    setIsModalOpen(true);
  };

  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleDeleteCustomer = async (customerId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      return;
    }

    try {
      const { error } = await supabase?.from('customers')?.delete()?.eq('id', customerId);

      if (error) {
        setError('Error al eliminar cliente: ' + error?.message);
        return;
      }

      loadCustomers();
    } catch (error) {
      setError('Error al eliminar cliente');
    }
  };

  const handleSaveCustomer = async (customerData) => {
    try {
      if (selectedCustomer) {
        // Update existing customer
        const { error } = await supabase?.from('customers')?.update(customerData)?.eq('id', selectedCustomer?.id);

        if (error) {
          setError('Error al actualizar cliente: ' + error?.message);
          return;
        }
      } else {
        // Create new customer
        const { error } = await supabase?.from('customers')?.insert([customerData]);

        if (error) {
          setError('Error al crear cliente: ' + error?.message);
          return;
        }
      }

      setIsModalOpen(false);
      loadCustomers();
    } catch (error) {
      setError('Error al guardar cliente');
    }
  };

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleExportCSV = () => {
    if (!filteredCustomers?.length) {
      setError('No hay clientes para exportar');
      return;
    }

    const csvContent = [
      ['Nombre', 'Email', 'Teléfono', 'CUIT/DNI', 'Dirección Facturación', 'Dirección Envío', 'Fecha Creación']?.join(','),
      ...filteredCustomers?.map(customer => [
        customer?.name || '',
        customer?.email || '',
        customer?.phone || '',
        customer?.tax_id || '',
        (customer?.billing_address || '')?.replace(/,/g, ';'),
        (customer?.shipping_address || '')?.replace(/,/g, ';'),
        new Date(customer?.created_at)?.toLocaleDateString('es-AR')
      ]?.join(','))
    ]?.join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `clientes_${new Date()?.toISOString()?.split('T')?.[0]}.csv`;
    link?.click();
  };

  const handleSendNotification = async (customer, type = 'email') => {
    // This would integrate with email/WhatsApp services
    const message = type === 'email' 
      ? `Enviando email a ${customer?.email}...` 
      : `Enviando WhatsApp a ${customer?.phone}...`;
    
    setError(message);
    
    // Simulate API call
    setTimeout(() => {
      setError('');
    }, 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando clientes...</p>
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
                <h1 className="text-3xl font-bold text-foreground">Gestión de Clientes</h1>
                <p className="text-muted-foreground mt-1">
                  Administra tu cartera de clientes y sus datos de contacto
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
                  onClick={handleCreateCustomer}
                  className="flex items-center space-x-2"
                >
                  <Icon name="Plus" size={16} />
                  <span>Nuevo Cliente</span>
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

            {/* Search */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Buscar por nombre, email, teléfono o CUIT/DNI..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e?.target?.value)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Clientes</p>
                    <p className="text-2xl font-bold text-foreground">{customers?.length || 0}</p>
                  </div>
                  <Icon name="Users" size={24} className="text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Con Pedidos</p>
                    <p className="text-2xl font-bold text-green-600">
                      {customers?.filter(c => c?.orders?.length > 0)?.length || 0}
                    </p>
                  </div>
                  <Icon name="Package" size={24} className="text-green-500" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Con Facturas</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {customers?.filter(c => c?.invoices?.length > 0)?.length || 0}
                    </p>
                  </div>
                  <Icon name="FileText" size={24} className="text-purple-500" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Nuevos (30d)</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {customers?.filter(c => {
                        const thirtyDaysAgo = new Date();
                        thirtyDaysAgo?.setDate(thirtyDaysAgo?.getDate() - 30);
                        return new Date(c?.created_at) >= thirtyDaysAgo;
                      })?.length || 0}
                    </p>
                  </div>
                  <Icon name="UserPlus" size={24} className="text-orange-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Customers Table */}
          <CustomerTable
            customers={filteredCustomers}
            onEdit={handleEditCustomer}
            onDelete={handleDeleteCustomer}
            onSendNotification={handleSendNotification}
          />
        </div>
      </main>
      {/* Customer Modal */}
      {isModalOpen && (
        <CustomerModal
          customer={selectedCustomer}
          onSave={handleSaveCustomer}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default CustomerManagement;