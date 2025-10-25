import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const ProductModal = ({ product, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    base_price: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product?.name || '',
        sku: product?.sku || '',
        description: product?.description || '',
        base_price: product?.base_price || ''
      });
    }
  }, [product]);

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

    if (!formData?.name?.trim()) {
      newErrors.name = 'El nombre del producto es requerido';
    }

    if (!formData?.sku?.trim()) {
      newErrors.sku = 'El SKU es requerido';
    } else if (!/^[A-Za-z0-9-_]+$/?.test(formData?.sku)) {
      newErrors.sku = 'El SKU solo puede contener letras, números, guiones y guiones bajos';
    }

    if (formData?.base_price && (isNaN(parseFloat(formData?.base_price)) || parseFloat(formData?.base_price) < 0)) {
      newErrors.base_price = 'El precio debe ser un número válido mayor o igual a 0';
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
      const productData = {
        ...formData,
        base_price: parseFloat(formData?.base_price) || 0,
        description: formData?.description || null
      };

      await onSave?.(productData);
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateSKU = () => {
    const name = formData?.name?.trim();
    if (!name) return;

    const sku = name?.toUpperCase()?.replace(/[^A-Z0-9\s]/g, '')?.replace(/\s+/g, '-')?.substring(0, 10);
    
    handleChange('sku', sku);
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
      <div className="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {product ? 'Editar Producto' : 'Nuevo Producto'}
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
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Información Básica</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Producto *
                </label>
                <Input
                  type="text"
                  value={formData?.name}
                  onChange={(e) => handleChange('name', e?.target?.value)}
                  placeholder="Ej: Remera Básica"
                  className={errors?.name ? 'border-red-300' : ''}
                />
                {errors?.name && (
                  <p className="text-red-500 text-sm mt-1">{errors?.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU (Código de Producto) *
                </label>
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    value={formData?.sku}
                    onChange={(e) => handleChange('sku', e?.target?.value)}
                    placeholder="Ej: REM-BAS-001"
                    className={`flex-1 ${errors?.sku ? 'border-red-300' : ''}`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateSKU}
                    disabled={!formData?.name?.trim()}
                    className="whitespace-nowrap"
                  >
                    <Icon name="Shuffle" size={16} />
                    Generar
                  </Button>
                </div>
                {errors?.sku && (
                  <p className="text-red-500 text-sm mt-1">{errors?.sku}</p>
                )}
                <p className="text-gray-500 text-sm mt-1">
                  El SKU debe ser único y solo contener letras, números, guiones y guiones bajos
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio Base (ARS)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData?.base_price}
                  onChange={(e) => handleChange('base_price', e?.target?.value)}
                  placeholder="0.00"
                  className={errors?.base_price ? 'border-red-300' : ''}
                />
                {errors?.base_price && (
                  <p className="text-red-500 text-sm mt-1">{errors?.base_price}</p>
                )}
                <p className="text-gray-500 text-sm mt-1">
                  Precio base sin incluir variaciones de color, talle, etc.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData?.description}
                  onChange={(e) => handleChange('description', e?.target?.value)}
                  placeholder="Descripción detallada del producto, materiales, cuidados, etc."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Icon name="Info" size={16} className="text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">Próximos pasos:</p>
                  <ul className="list-disc list-inside space-y-1 text-blue-600">
                    <li>Después de crear el producto, podrás agregar variantes (colores, talles, etc.)</li>
                    <li>Cada variante puede tener su propia Lista de Materiales (BOM)</li>
                    <li>Los precios finales se calculan como: Precio Base + Precio Adicional de la Variante</li>
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
                  <span>{product ? 'Actualizar' : 'Crear'} Producto</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;