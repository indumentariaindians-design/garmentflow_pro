import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Icon from '../../components/AppIcon';
import ProductGrid from './components/ProductGrid';
import ProductModal from './components/ProductModal';
import VariantModal from './components/VariantModal';
import { supabase } from '../../lib/supabase';

const ProductCatalog = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userRole] = useState('admin');
  
  // Data states
  const [products, setProducts] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // UI states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  
  // Error handling
  const [error, setError] = useState('');

  const viewModeOptions = [
    { value: 'grid', label: 'Grilla' },
    { value: 'list', label: 'Lista' }
  ];

  // Load products
  const loadProducts = async () => {
    try {
      const { data, error } = await supabase?.from('products')?.select(`
          *,
          product_variants(
            id,
            code,
            color,
            size,
            additional_price,
            bill_of_materials(
              id,
              material:materials(name, unit)
            )
          )
        `)?.order('name');

      if (error) {
        setError('Error al cargar productos: ' + error?.message);
        return;
      }

      setProducts(data || []);
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        setError('No se puede conectar a la base de datos. Tu proyecto de Supabase puede estar pausado. Por favor verifica tu dashboard de Supabase.');
        return;
      }
      setError('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  // Load materials for BOM
  const loadMaterials = async () => {
    try {
      const { data, error } = await supabase?.from('materials')?.select('*')?.order('name');

      if (error) {
        setError('Error al cargar materiales: ' + error?.message);
        return;
      }

      setMaterials(data || []);
    } catch (error) {
      setError('Error al cargar materiales');
    }
  };

  useEffect(() => {
    loadProducts();
    loadMaterials();
  }, []);

  // Real-time subscriptions
  useEffect(() => {
    const channel = supabase?.channel('products_changes')?.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          loadProducts();
        }
      )?.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'product_variants' },
        (payload) => {
          loadProducts();
        }
      )?.subscribe();

    return () => supabase?.removeChannel(channel);
  }, []);

  // Filter products
  const filteredProducts = products?.filter(product => {
    const searchLower = searchTerm?.toLowerCase();
    return product?.name?.toLowerCase()?.includes(searchLower) ||
           product?.sku?.toLowerCase()?.includes(searchLower) ||
           product?.description?.toLowerCase()?.includes(searchLower);
  });

  const handleCreateProduct = () => {
    setSelectedProduct(null);
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto? Esto también eliminará todas sus variantes.')) {
      return;
    }

    try {
      const { error } = await supabase?.from('products')?.delete()?.eq('id', productId);

      if (error) {
        setError('Error al eliminar producto: ' + error?.message);
        return;
      }

      loadProducts();
    } catch (error) {
      setError('Error al eliminar producto');
    }
  };

  const handleSaveProduct = async (productData) => {
    try {
      if (selectedProduct) {
        // Update existing product
        const { error } = await supabase?.from('products')?.update(productData)?.eq('id', selectedProduct?.id);

        if (error) {
          setError('Error al actualizar producto: ' + error?.message);
          return;
        }
      } else {
        // Create new product
        const { error } = await supabase?.from('products')?.insert([productData]);

        if (error) {
          setError('Error al crear producto: ' + error?.message);
          return;
        }
      }

      setIsProductModalOpen(false);
      loadProducts();
    } catch (error) {
      setError('Error al guardar producto');
    }
  };

  const handleCreateVariant = (product) => {
    setSelectedProduct(product);
    setSelectedVariant(null);
    setIsVariantModalOpen(true);
  };

  const handleEditVariant = (product, variant) => {
    setSelectedProduct(product);
    setSelectedVariant(variant);
    setIsVariantModalOpen(true);
  };

  const handleDeleteVariant = async (variantId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta variante?')) {
      return;
    }

    try {
      const { error } = await supabase?.from('product_variants')?.delete()?.eq('id', variantId);

      if (error) {
        setError('Error al eliminar variante: ' + error?.message);
        return;
      }

      loadProducts();
    } catch (error) {
      setError('Error al eliminar variante');
    }
  };

  const handleSaveVariant = async (variantData) => {
    try {
      if (selectedVariant) {
        // Update existing variant
        const { error } = await supabase?.from('product_variants')?.update(variantData)?.eq('id', selectedVariant?.id);

        if (error) {
          setError('Error al actualizar variante: ' + error?.message);
          return;
        }
      } else {
        // Create new variant
        const { error } = await supabase?.from('product_variants')?.insert([{ ...variantData, product_id: selectedProduct?.id }]);

        if (error) {
          setError('Error al crear variante: ' + error?.message);
          return;
        }
      }

      setIsVariantModalOpen(false);
      loadProducts();
    } catch (error) {
      setError('Error al guardar variante');
    }
  };

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleExportCSV = () => {
    if (!filteredProducts?.length) {
      setError('No hay productos para exportar');
      return;
    }

    const csvRows = [];
    csvRows?.push(['Producto', 'SKU', 'Precio Base', 'Variante', 'Código Variante', 'Color', 'Talle', 'Precio Adicional']?.join(','));

    filteredProducts?.forEach(product => {
      if (product?.product_variants?.length > 0) {
        product?.product_variants?.forEach(variant => {
          csvRows?.push([
            product?.name || '',
            product?.sku || '',
            product?.base_price || '0',
            `${variant?.color || ''} ${variant?.size || ''}`?.trim(),
            variant?.code || '',
            variant?.color || '',
            variant?.size || '',
            variant?.additional_price || '0'
          ]?.join(','));
        });
      } else {
        csvRows?.push([
          product?.name || '',
          product?.sku || '',
          product?.base_price || '0',
          '',
          '',
          '',
          '',
          ''
        ]?.join(','));
      }
    });

    const csvContent = csvRows?.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `productos_${new Date()?.toISOString()?.split('T')?.[0]}.csv`;
    link?.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando catálogo...</p>
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
                <h1 className="text-3xl font-bold text-foreground">Catálogo de Productos</h1>
                <p className="text-muted-foreground mt-1">
                  Gestiona tu catálogo de productos, variantes y especificaciones
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
                  onClick={handleCreateProduct}
                  className="flex items-center space-x-2"
                >
                  <Icon name="Plus" size={16} />
                  <span>Nuevo Producto</span>
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

            {/* Filters and Controls */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 mb-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Buscar productos por nombre, SKU o descripción..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e?.target?.value)}
                    className="w-full"
                  />
                </div>
                <div className="lg:w-32">
                  <Select
                    options={viewModeOptions}
                    value={viewMode}
                    onChange={setViewMode}
                    placeholder="Vista"
                  />
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Productos</p>
                    <p className="text-2xl font-bold text-foreground">{products?.length || 0}</p>
                  </div>
                  <Icon name="Package" size={24} className="text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Variantes</p>
                    <p className="text-2xl font-bold text-green-600">
                      {products?.reduce((sum, p) => sum + (p?.product_variants?.length || 0), 0) || 0}
                    </p>
                  </div>
                  <Icon name="Shirt" size={24} className="text-green-500" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Con BOM</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {products?.filter(p => 
                        p?.product_variants?.some(v => v?.bill_of_materials?.length > 0)
                      )?.length || 0}
                    </p>
                  </div>
                  <Icon name="List" size={24} className="text-purple-500" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Sin Variantes</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {products?.filter(p => !p?.product_variants?.length)?.length || 0}
                    </p>
                  </div>
                  <Icon name="AlertTriangle" size={24} className="text-orange-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Products Display */}
          <ProductGrid
            products={filteredProducts}
            viewMode={viewMode}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
            onCreateVariant={handleCreateVariant}
            onEditVariant={handleEditVariant}
            onDeleteVariant={handleDeleteVariant}
          />
        </div>
      </main>
      {/* Product Modal */}
      {isProductModalOpen && (
        <ProductModal
          product={selectedProduct}
          onSave={handleSaveProduct}
          onClose={() => setIsProductModalOpen(false)}
        />
      )}
      {/* Variant Modal */}
      {isVariantModalOpen && (
        <VariantModal
          product={selectedProduct}
          variant={selectedVariant}
          materials={materials}
          onSave={handleSaveVariant}
          onClose={() => setIsVariantModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ProductCatalog;