import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ProductGrid = ({ 
  products = [], 
  viewMode = 'grid', 
  onEditProduct, 
  onDeleteProduct,
  onCreateVariant,
  onEditVariant,
  onDeleteVariant
}) => {
  const calculateProductPrice = (product) => {
    const basePrice = parseFloat(product?.base_price) || 0;
    const variants = product?.product_variants || [];
    
    if (variants?.length === 0) {
      return basePrice;
    }
    
    const minAdditional = Math.min(...variants?.map(v => parseFloat(v?.additional_price) || 0));
    return basePrice + minAdditional;
  };

  const getVariantLabel = (variant) => {
    const parts = [];
    if (variant?.color) parts?.push(variant?.color);
    if (variant?.size) parts?.push(variant?.size);
    return parts?.length > 0 ? parts?.join(' - ') : 'Sin especificar';
  };

  if (!products?.length) {
    return (
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-8">
        <div className="text-center">
          <Icon name="Package" size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h3>
          <p className="text-gray-500 mb-6">Comienza creando tu primer producto</p>
          <Button
            onClick={() => onEditProduct?.(null)}
            className="flex items-center space-x-2 mx-auto"
          >
            <Icon name="Plus" size={16} />
            <span>Crear Producto</span>
          </Button>
        </div>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio Base
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Variantes
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products?.map((product) => (
                <tr key={product?.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {product?.name}
                      </div>
                      {product?.description && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {product?.description}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product?.sku}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    ${parseFloat(product?.base_price || 0)?.toLocaleString('es-AR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-900">
                        {product?.product_variants?.length || 0} variante{product?.product_variants?.length !== 1 ? 's' : ''}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onCreateVariant?.(product)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Icon name="Plus" size={12} />
                      </Button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditProduct?.(product)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Icon name="Edit" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteProduct?.(product?.id)}
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
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products?.map((product) => (
        <div key={product?.id} className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
          {/* Product Header */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {product?.name}
                </h3>
                <p className="text-sm text-gray-500 mb-2">SKU: {product?.sku}</p>
                {product?.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {product?.description}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-1 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditProduct?.(product)}
                  className="text-indigo-600 hover:text-indigo-900"
                  title="Editar producto"
                >
                  <Icon name="Edit" size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteProduct?.(product?.id)}
                  className="text-red-600 hover:text-red-900"
                  title="Eliminar producto"
                >
                  <Icon name="Trash2" size={16} />
                </Button>
              </div>
            </div>

            {/* Price */}
            <div className="mb-4">
              <div className="text-2xl font-bold text-gray-900">
                ${calculateProductPrice(product)?.toLocaleString('es-AR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </div>
              <div className="text-sm text-gray-500">Precio desde (ARS)</div>
            </div>

            {/* Variants */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-700">
                  Variantes ({product?.product_variants?.length || 0})
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onCreateVariant?.(product)}
                  className="text-blue-600 hover:text-blue-900"
                  title="Agregar variante"
                >
                  <Icon name="Plus" size={14} />
                </Button>
              </div>

              {product?.product_variants?.length > 0 ? (
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {product?.product_variants?.map((variant) => (
                    <div key={variant?.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {getVariantLabel(variant)}
                        </div>
                        {variant?.code && (
                          <div className="text-xs text-gray-500">{variant?.code}</div>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        {variant?.additional_price > 0 && (
                          <span className="text-xs font-medium text-green-600">
                            +${parseFloat(variant?.additional_price)?.toFixed(2)}
                          </span>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditVariant?.(product, variant)}
                          className="text-indigo-600 hover:text-indigo-900 p-1"
                        >
                          <Icon name="Edit" size={12} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteVariant?.(variant?.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                        >
                          <Icon name="Trash2" size={12} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500 text-sm">
                  <Icon name="AlertCircle" size={16} className="mx-auto mb-1" />
                  <p>Sin variantes definidas</p>
                </div>
              )}
            </div>

            {/* BOM Status */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Lista de Materiales (BOM)
                </div>
                <div className="flex items-center space-x-1">
                  {product?.product_variants?.some(v => v?.bill_of_materials?.length > 0) ? (
                    <div className="flex items-center text-green-600">
                      <Icon name="CheckCircle" size={14} className="mr-1" />
                      <span className="text-xs">Configurado</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-orange-600">
                      <Icon name="AlertCircle" size={14} className="mr-1" />
                      <span className="text-xs">Pendiente</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;