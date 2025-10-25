import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const VariantModal = ({ product, variant, materials = [], onSave, onClose }) => {
  const [formData, setFormData] = useState({
    code: '',
    color: '',
    size: '',
    additional_price: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sizeOptions = [
    { value: '', label: 'Seleccionar talle...' },
    { value: 'XS', label: 'XS' },
    { value: 'S', label: 'S' },
    { value: 'M', label: 'M' },
    { value: 'L', label: 'L' },
    { value: 'XL', label: 'XL' },
    { value: 'XXL', label: 'XXL' },
    { value: '36', label: '36' },
    { value: '38', label: '38' },
    { value: '40', label: '40' },
    { value: '42', label: '42' },
    { value: '44', label: '44' },
    { value: '46', label: '46' },
    { value: 'Único', label: 'Talle Único' }
  ];

  const colorOptions = [
    { value: '', label: 'Seleccionar color...' },
    { value: 'Blanco', label: 'Blanco' },
    { value: 'Negro', label: 'Negro' },
    { value: 'Gris', label: 'Gris' },
    { value: 'Azul', label: 'Azul' },
    { value: 'Verde', label: 'Verde' },
    { value: 'Rojo', label: 'Rojo' },
    { value: 'Amarillo', label: 'Amarillo' },
    { value: 'Rosa', label: 'Rosa' },
    { value: 'Violeta', label: 'Violeta' },
    { value: 'Naranja', label: 'Naranja' },
    { value: 'Marrón', label: 'Marrón' },
    { value: 'Beige', label: 'Beige' }
  ];

  useEffect(() => {
    if (variant) {
      setFormData({
        code: variant?.code || '',
        color: variant?.color || '',
        size: variant?.size || '',
        additional_price: variant?.additional_price || ''
      });
    }
  }, [variant]);

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

    // Auto-generate code when color or size changes
    if (field === 'color' || field === 'size') {
      generateVariantCode({ ...formData, [field]: value });
    }
  };

  const generateVariantCode = (data = formData) => {
    const parts = [];
    if (product?.sku) parts?.push(product?.sku);
    if (data?.color) parts?.push(data?.color?.substring(0, 3)?.toUpperCase());
    if (data?.size) parts?.push(data?.size);
    
    const code = parts?.join('-');
    setFormData(prev => ({ ...prev, code }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.color && !formData?.size) {
      newErrors.color = 'Debe especificar al menos color o talle';
      newErrors.size = 'Debe especificar al menos color o talle';
    }

    if (formData?.additional_price && (isNaN(parseFloat(formData?.additional_price)) || parseFloat(formData?.additional_price) < 0)) {
      newErrors.additional_price = 'El precio adicional debe ser un número válido mayor o igual a 0';
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
      const variantData = {
        ...formData,
        additional_price: parseFloat(formData?.additional_price) || 0,
        color: formData?.color || null,
        size: formData?.size || null,
        code: formData?.code || null
      };

      await onSave?.(variantData);
    } catch (error) {
      console.error('Error saving variant:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateFinalPrice = () => {
    const basePrice = parseFloat(product?.base_price) || 0;
    const additionalPrice = parseFloat(formData?.additional_price) || 0;
    return basePrice + additionalPrice;
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
      <div className="bg-white rounded-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {variant ? 'Editar Variante' : 'Nueva Variante'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Producto: {product?.name} (SKU: {product?.sku})
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
            {/* Variant Identification */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Identificación de Variante</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <Select
                    options={colorOptions}
                    value={formData?.color}
                    onChange={(value) => handleChange('color', value)}
                    placeholder="Seleccionar color..."
                    className={errors?.color ? 'border-red-300' : ''}
                  />
                  {errors?.color && (
                    <p className="text-red-500 text-sm mt-1">{errors?.color}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Talle
                  </label>
                  <Select
                    options={sizeOptions}
                    value={formData?.size}
                    onChange={(value) => handleChange('size', value)}
                    placeholder="Seleccionar talle..."
                    className={errors?.size ? 'border-red-300' : ''}
                  />
                  {errors?.size && (
                    <p className="text-red-500 text-sm mt-1">{errors?.size}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código de Variante
                </label>
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    value={formData?.code}
                    onChange={(e) => handleChange('code', e?.target?.value)}
                    placeholder="Se genera automáticamente"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => generateVariantCode()}
                    className="whitespace-nowrap"
                  >
                    <Icon name="Shuffle" size={16} />
                    Regenerar
                  </Button>
                </div>
                <p className="text-gray-500 text-sm mt-1">
                  Se genera automáticamente basado en el SKU del producto, color y talle
                </p>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Precios</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio Adicional (ARS)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData?.additional_price}
                    onChange={(e) => handleChange('additional_price', e?.target?.value)}
                    placeholder="0.00"
                    className={errors?.additional_price ? 'border-red-300' : ''}
                  />
                  {errors?.additional_price && (
                    <p className="text-red-500 text-sm mt-1">{errors?.additional_price}</p>
                  )}
                  <p className="text-gray-500 text-sm mt-1">
                    Costo adicional sobre el precio base del producto
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio Final
                  </label>
                  <div className="p-3 bg-gray-50 border border-gray-300 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">
                      ${calculateFinalPrice()?.toLocaleString('es-AR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </div>
                    <div className="text-sm text-gray-500">
                      Base: ${parseFloat(product?.base_price || 0)?.toFixed(2)} + 
                      Adicional: ${parseFloat(formData?.additional_price || 0)?.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Icon name="Info" size={16} className="text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">Próximos pasos:</p>
                  <ul className="list-disc list-inside space-y-1 text-blue-600">
                    <li>Después de crear la variante, podrás configurar su Lista de Materiales (BOM)</li>
                    <li>El BOM define qué materiales y en qué cantidades se necesitan para producir esta variante</li>
                    <li>Esta información se usa para calcular costos y gestionar inventario</li>
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
                  <span>{variant ? 'Actualizar' : 'Crear'} Variante</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VariantModal;