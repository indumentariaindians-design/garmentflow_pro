import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Icon from '../../components/AppIcon';
import InvoiceTable from './components/InvoiceTable';
import InvoiceModal from './components/InvoiceModal';
import PaymentModal from './components/PaymentModal';
import { supabase } from '../../lib/supabase';

const InvoiceManagement = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userRole] = useState('admin');
  
  // Data states
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // UI states
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Error handling
  const [error, setError] = useState('');

  const statusOptions = [
    { value: 'all', label: 'Todos los Estados' },
    { value: 'draft', label: 'Borrador' },
    { value: 'issued', label: 'Emitida' },
    { value: 'paid', label: 'Pagada' },
    { value: 'void', label: 'Anulada' }
  ];

  // Load invoices
  const loadInvoices = async () => {
    try {
      const { data, error } = await supabase?.from('invoices')?.select(`
          *,
          customer:customers(*),
          order:orders(*),
          invoice_items(
            id,
            qty,
            unit_price,
            line_total,
            description,
            order_item:order_items(
              variant:product_variants(
                product:products(name, sku),
                color,
                size
              )
            )
          ),
          payments(
            id,
            amount,
            payment_date,
            method,
            notes
          )
        `)?.order('created_at', { ascending: false });

      if (error) {
        setError('Error al cargar facturas: ' + error?.message);
        return;
      }

      setInvoices(data || []);
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        setError('No se puede conectar a la base de datos. Tu proyecto de Supabase puede estar pausado. Por favor verifica tu dashboard de Supabase.');
        return;
      }
      setError('Error al cargar facturas');
    } finally {
      setLoading(false);
    }
  };

  // Load customers and orders for creation
  const loadRelatedData = async () => {
    try {
      const [customersResult, ordersResult] = await Promise.all([
        supabase?.from('customers')?.select('*')?.order('name'),
        supabase?.from('orders')?.select(`
          *,
          customer:customers(name),
          order_items(
            id,
            qty,
            unit_price,
            variant:product_variants(
              product:products(name),
              color,
              size
            )
          )
        `)?.eq('status', 'completed')?.is('invoices', null)
      ]);

      if (customersResult?.error) {
        setError('Error al cargar clientes: ' + customersResult?.error?.message);
        return;
      }

      if (ordersResult?.error) {
        setError('Error al cargar pedidos: ' + ordersResult?.error?.message);
        return;
      }

      setCustomers(customersResult?.data || []);
      setOrders(ordersResult?.data || []);
    } catch (error) {
      setError('Error al cargar datos relacionados');
    }
  };

  useEffect(() => {
    loadInvoices();
    loadRelatedData();
  }, []);

  // Real-time subscriptions
  useEffect(() => {
    const channel = supabase?.channel('invoices_changes')?.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'invoices' },
        (payload) => {
          loadInvoices();
        }
      )?.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'payments' },
        (payload) => {
          loadInvoices();
        }
      )?.subscribe();

    return () => supabase?.removeChannel(channel);
  }, []);

  // Filter invoices
  const filteredInvoices = invoices?.filter(invoice => {
    const matchesSearch = invoice?.invoice_number?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         invoice?.customer?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice?.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateInvoice = () => {
    setSelectedInvoice(null);
    setIsInvoiceModalOpen(true);
  };

  const handleEditInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setIsInvoiceModalOpen(true);
  };

  const handleDeleteInvoice = async (invoiceId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta factura?')) {
      return;
    }

    try {
      const { error } = await supabase?.from('invoices')?.delete()?.eq('id', invoiceId);

      if (error) {
        setError('Error al eliminar factura: ' + error?.message);
        return;
      }

      loadInvoices();
    } catch (error) {
      setError('Error al eliminar factura');
    }
  };

  const handleSaveInvoice = async (invoiceData) => {
    try {
      if (selectedInvoice) {
        // Update existing invoice
        const { error } = await supabase?.from('invoices')?.update(invoiceData)?.eq('id', selectedInvoice?.id);

        if (error) {
          setError('Error al actualizar factura: ' + error?.message);
          return;
        }
      } else {
        // Create new invoice
        const { error } = await supabase?.from('invoices')?.insert([invoiceData]);

        if (error) {
          setError('Error al crear factura: ' + error?.message);
          return;
        }
      }

      setIsInvoiceModalOpen(false);
      loadInvoices();
    } catch (error) {
      setError('Error al guardar factura');
    }
  };

  const handleRegisterPayment = (invoice) => {
    setSelectedInvoice(invoice);
    setIsPaymentModalOpen(true);
  };

  const handleSavePayment = async (paymentData) => {
    try {
      const { error } = await supabase?.from('payments')?.insert([{ ...paymentData, invoice_id: selectedInvoice?.id }]);

      if (error) {
        setError('Error al registrar pago: ' + error?.message);
        return;
      }

      // Update invoice status if fully paid
      const totalPaid = (selectedInvoice?.payments?.reduce((sum, p) => sum + parseFloat(p?.amount), 0) || 0) + parseFloat(paymentData?.amount);
      const grandTotal = parseFloat(selectedInvoice?.grand_total) || 0;

      if (totalPaid >= grandTotal) {
        await supabase?.from('invoices')?.update({ status: 'paid' })?.eq('id', selectedInvoice?.id);
      }

      setIsPaymentModalOpen(false);
      loadInvoices();
    } catch (error) {
      setError('Error al registrar pago');
    }
  };

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleExportCSV = () => {
    if (!filteredInvoices?.length) {
      setError('No hay facturas para exportar');
      return;
    }

    const csvContent = [
      ['Número', 'Cliente', 'Estado', 'Fecha', 'Subtotal', 'Impuestos', 'Total', 'Pagado']?.join(','),
      ...filteredInvoices?.map(invoice => {
        const totalPaid = invoice?.payments?.reduce((sum, p) => sum + parseFloat(p?.amount), 0) || 0;
        return [
          invoice?.invoice_number || '',
          invoice?.customer?.name || '',
          invoice?.status || '',
          new Date(invoice?.issue_date)?.toLocaleDateString('es-AR'),
          invoice?.subtotal || '0',
          invoice?.tax_total || '0',
          invoice?.grand_total || '0',
          totalPaid?.toFixed(2)
        ]?.join(',');
      })
    ]?.join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `facturas_${new Date()?.toISOString()?.split('T')?.[0]}.csv`;
    link?.click();
  };

  const handleGeneratePDF = (invoice) => {
    // This would integrate with a PDF generation service
    setError('Función de PDF en desarrollo. Se integrará con un servicio de generación de PDFs.');
    setTimeout(() => setError(''), 3000);
  };

  const handleSendInvoice = (invoice, method = 'email') => {
    // This would integrate with email/WhatsApp services
    const message = method === 'email' 
      ? `Enviando factura ${invoice?.invoice_number} por email a ${invoice?.customer?.email}...` 
      : `Enviando factura ${invoice?.invoice_number} por WhatsApp a ${invoice?.customer?.phone}...`;
    
    setError(message);
    setTimeout(() => setError(''), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando facturas...</p>
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
                <h1 className="text-3xl font-bold text-foreground">Gestión de Facturas</h1>
                <p className="text-muted-foreground mt-1">
                  Administra facturas, pagos y transacciones financieras
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
                  onClick={handleCreateInvoice}
                  className="flex items-center space-x-2"
                >
                  <Icon name="Plus" size={16} />
                  <span>Nueva Factura</span>
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
                    placeholder="Buscar por número de factura o cliente..."
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
                    <p className="text-sm text-muted-foreground">Total Facturas</p>
                    <p className="text-2xl font-bold text-foreground">{invoices?.length || 0}</p>
                  </div>
                  <Icon name="FileText" size={24} className="text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pendientes</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {invoices?.filter(i => i?.status === 'issued')?.length || 0}
                    </p>
                  </div>
                  <Icon name="Clock" size={24} className="text-orange-500" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pagadas</p>
                    <p className="text-2xl font-bold text-green-600">
                      {invoices?.filter(i => i?.status === 'paid')?.length || 0}
                    </p>
                  </div>
                  <Icon name="CheckCircle" size={24} className="text-green-500" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Facturado</p>
                    <p className="text-2xl font-bold text-purple-600">
                      ${invoices?.reduce((sum, i) => sum + parseFloat(i?.grand_total || 0), 0)?.toLocaleString('es-AR', { 
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0 
                      })}
                    </p>
                  </div>
                  <Icon name="DollarSign" size={24} className="text-purple-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Invoices Table */}
          <InvoiceTable
            invoices={filteredInvoices}
            onEdit={handleEditInvoice}
            onDelete={handleDeleteInvoice}
            onRegisterPayment={handleRegisterPayment}
            onGeneratePDF={handleGeneratePDF}
            onSendInvoice={handleSendInvoice}
          />
        </div>
      </main>
      {/* Invoice Modal */}
      {isInvoiceModalOpen && (
        <InvoiceModal
          invoice={selectedInvoice}
          customers={customers}
          orders={orders}
          onSave={handleSaveInvoice}
          onClose={() => setIsInvoiceModalOpen(false)}
        />
      )}
      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <PaymentModal
          invoice={selectedInvoice}
          onSave={handleSavePayment}
          onClose={() => setIsPaymentModalOpen(false)}
        />
      )}
    </div>
  );
};

export default InvoiceManagement;