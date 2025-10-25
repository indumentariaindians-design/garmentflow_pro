-- Demo data for GarmentFlow Pro
-- This script populates the database with realistic sample data for testing

-- Insert additional roles (remove explicit id values - let identity column auto-generate)
INSERT INTO public.roles (code, name) VALUES
('ventas', 'Ventas'),
('costos', 'Analista de Costos'),
('operario', 'Operario de Estación'),
('invitado', 'Invitado')
ON CONFLICT (code) DO UPDATE SET 
  name = EXCLUDED.name;

-- Insert additional stages (remove explicit id values - let identity column auto-generate)
INSERT INTO public.stages (code, name, position) VALUES
('planchado', 'Planchado', 3),
('corte', 'Corte', 4),
('estampado', 'Estampado', 5),
('confeccion', 'Confección', 6),
('qc', 'Control de Calidad', 7),
('empaquetado', 'Empaquetado', 8)
ON CONFLICT (code) DO UPDATE SET 
  name = EXCLUDED.name,
  position = EXCLUDED.position;

-- Insert additional workflows (remove explicit id values - let identity column auto-generate)
INSERT INTO public.workflows (code, name) VALUES
('completa', 'Ruta Completa'),
('rapida', 'Ruta Rápida')
ON CONFLICT (code) DO UPDATE SET 
  name = EXCLUDED.name;

-- Insert sample customers
INSERT INTO public.customers (id, name, email, phone, tax_id, billing_address, shipping_address) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Boutique La Moda', 'pedidos@lamoda.com', '+54 11 4555-1234', '20-12345678-9', 'Av. Corrientes 1234, CABA', 'Av. Corrientes 1234, CABA'),
('550e8400-e29b-41d4-a716-446655440002', 'Distribuidora Norte', 'compras@norte.com', '+54 11 4555-5678', '30-87654321-2', 'Av. Cabildo 567, CABA', 'Av. Cabildo 567, CABA'),
('550e8400-e29b-41d4-a716-446655440003', 'Comercial Sur SA', 'ventas@sur.com', '+54 11 4555-9012', '30-11223344-5', 'Av. Rivadavia 890, CABA', 'Av. Rivadavia 890, CABA'),
('550e8400-e29b-41d4-a716-446655440004', 'Tienda Fashion', 'info@fashion.com', '+54 11 4555-3456', '27-22334455-8', 'Florida 123, CABA', 'Florida 123, CABA'),
('550e8400-e29b-41d4-a716-446655440005', 'Mayorista Textil', 'pedidos@mayorista.com', '+54 11 4555-7890', '30-33445566-1', 'Av. Warnes 456, CABA', 'Av. Warnes 456, CABA')
ON CONFLICT (id) DO NOTHING;

-- Insert sample materials
INSERT INTO public.materials (id, code, name, unit) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'ALG-001', 'Algodón Jersey 24/1', 'm'),
('650e8400-e29b-41d4-a716-446655440002', 'POL-001', 'Poliéster Sublimable', 'm'),
('650e8400-e29b-41d4-a716-446655440003', 'HIL-001', 'Hilo de Coser Blanco', 'cono'),
('650e8400-e29b-41d4-a716-446655440004', 'HIL-002', 'Hilo de Coser Negro', 'cono'),
('650e8400-e29b-41d4-a716-446655440005', 'ETI-001', 'Etiqueta de Marca', 'unidad'),
('650e8400-e29b-41d4-a716-446655440006', 'BOL-001', 'Bolsa de Empaque', 'unidad'),
('650e8400-e29b-41d4-a716-446655440007', 'TIN-001', 'Tinta de Sublimación Cyan', 'ml'),
('650e8400-e29b-41d4-a716-446655440008', 'TIN-002', 'Tinta de Sublimación Magenta', 'ml'),
('650e8400-e29b-41d4-a716-446655440009', 'TIN-003', 'Tinta de Sublimación Yellow', 'ml'),
('650e8400-e29b-41d4-a716-446655440010', 'TIN-004', 'Tinta de Sublimación Black', 'ml')
ON CONFLICT (id) DO NOTHING;

-- Insert sample products
INSERT INTO public.products (id, sku, name, description, base_price) VALUES
('750e8400-e29b-41d4-a716-446655440001', 'REM-BAS-001', 'Remera Básica', 'Remera de algodón jersey, corte clásico, cuello redondo', 1500.00),
('750e8400-e29b-41d4-a716-446655440002', 'REM-SUB-001', 'Remera Sublimable', 'Remera de poliéster para sublimación, tacto suave', 1800.00),
('750e8400-e29b-41d4-a716-446655440003', 'POL-BAS-001', 'Polo Básico', 'Polo de algodón piqué, cuello y puños en canalé', 2200.00),
('750e8400-e29b-41d4-a716-446655440004', 'BUZ-001', 'Buzón Deportivo', 'Buzón de algodón con capucha y bolsillo canguro', 3500.00),
('750e8400-e29b-41d4-a716-446655440005', 'CAM-001', 'Camisa Trabajo', 'Camisa de trabajo manga larga, bolsillos frontales', 2800.00)
ON CONFLICT (id) DO NOTHING;

-- Insert sample product variants
INSERT INTO public.product_variants (id, product_id, code, color, size, additional_price) VALUES
-- Remera Básica variants
('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', 'REM-BAS-001-BLA-S', 'Blanco', 'S', 0.00),
('850e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440001', 'REM-BAS-001-BLA-M', 'Blanco', 'M', 0.00),
('850e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440001', 'REM-BAS-001-BLA-L', 'Blanco', 'L', 0.00),
('850e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440001', 'REM-BAS-001-NEG-S', 'Negro', 'S', 100.00),
('850e8400-e29b-41d4-a716-446655440005', '750e8400-e29b-41d4-a716-446655440001', 'REM-BAS-001-NEG-M', 'Negro', 'M', 100.00),
('850e8400-e29b-41d4-a716-446655440006', '750e8400-e29b-41d4-a716-446655440001', 'REM-BAS-001-NEG-L', 'Negro', 'L', 100.00),
-- Remera Sublimable variants
('850e8400-e29b-41d4-a716-446655440007', '750e8400-e29b-41d4-a716-446655440002', 'REM-SUB-001-BLA-S', 'Blanco', 'S', 0.00),
('850e8400-e29b-41d4-a716-446655440008', '750e8400-e29b-41d4-a716-446655440002', 'REM-SUB-001-BLA-M', 'Blanco', 'M', 0.00),
('850e8400-e29b-41d4-a716-446655440009', '750e8400-e29b-41d4-a716-446655440002', 'REM-SUB-001-BLA-L', 'Blanco', 'L', 0.00),
-- Polo Básico variants
('850e8400-e29b-41d4-a716-446655440010', '750e8400-e29b-41d4-a716-446655440003', 'POL-BAS-001-AZU-M', 'Azul', 'M', 0.00),
('850e8400-e29b-41d4-a716-446655440011', '750e8400-e29b-41d4-a716-446655440003', 'POL-BAS-001-AZU-L', 'Azul', 'L', 0.00),
('850e8400-e29b-41d4-a716-446655440012', '750e8400-e29b-41d4-a716-446655440003', 'POL-BAS-001-GRI-M', 'Gris', 'M', 50.00),
-- Buzón variants
('850e8400-e29b-41d4-a716-446655440013', '750e8400-e29b-41d4-a716-446655440004', 'BUZ-001-NEG-M', 'Negro', 'M', 0.00),
('850e8400-e29b-41d4-a716-446655440014', '750e8400-e29b-41d4-a716-446655440004', 'BUZ-001-NEG-L', 'Negro', 'L', 0.00),
('850e8400-e29b-41d4-a716-446655440015', '750e8400-e29b-41d4-a716-446655440004', 'BUZ-001-GRI-L', 'Gris', 'L', 100.00)
ON CONFLICT (id) DO NOTHING;

-- Insert sample orders
INSERT INTO public.orders (id, order_code, customer_id, status, due_date, notes) VALUES
('950e8400-e29b-41d4-a716-446655440001', 'PED-2024-001', '550e8400-e29b-41d4-a716-446655440001', 'in_production', '2024-02-15', 'Pedido urgente para evento especial'),
('950e8400-e29b-41d4-a716-446655440002', 'PED-2024-002', '550e8400-e29b-41d4-a716-446655440002', 'confirmed', '2024-02-20', 'Entrega en sucursal'),
('950e8400-e29b-41d4-a716-446655440003', 'PED-2024-003', '550e8400-e29b-41d4-a716-446655440003', 'completed', '2024-01-30', 'Pedido completado satisfactoriamente'),
('950e8400-e29b-41d4-a716-446655440004', 'PED-2024-004', '550e8400-e29b-41d4-a716-446655440004', 'draft', '2024-02-25', 'Esperando confirmación de diseño'),
('950e8400-e29b-41d4-a716-446655440005', 'PED-2024-005', '550e8400-e29b-41d4-a716-446655440005', 'in_production', '2024-02-18', 'Pedido con sublimación personalizada')
ON CONFLICT (id) DO NOTHING;

-- Insert sample order items
INSERT INTO public.order_items (id, order_id, variant_id, qty, unit_price, discount, tax_rate) VALUES
-- PED-2024-001 items
('a50e8400-e29b-41d4-a716-446655440001', '950e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440001', 50, 1500.00, 0.00, 21.00),
('a50e8400-e29b-41d4-a716-446655440002', '950e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440002', 30, 1500.00, 0.00, 21.00),
-- PED-2024-002 items
('a50e8400-e29b-41d4-a716-446655440003', '950e8400-e29b-41d4-a716-446655440002', '850e8400-e29b-41d4-a716-446655440007', 25, 1800.00, 0.00, 21.00),
('a50e8400-e29b-41d4-a716-446655440004', '950e8400-e29b-41d4-a716-446655440002', '850e8400-e29b-41d4-a716-446655440008', 25, 1800.00, 0.00, 21.00),
-- PED-2024-003 items
('a50e8400-e29b-41d4-a716-446655440005', '950e8400-e29b-41d4-a716-446655440003', '850e8400-e29b-41d4-a716-446655440010', 20, 2200.00, 100.00, 21.00),
('a50e8400-e29b-41d4-a716-446655440006', '950e8400-e29b-41d4-a716-446655440003', '850e8400-e29b-41d4-a716-446655440013', 10, 3500.00, 0.00, 21.00),
-- PED-2024-004 items
('a50e8400-e29b-41d4-a716-446655440007', '950e8400-e29b-41d4-a716-446655440004', '850e8400-e29b-41d4-a716-446655440004', 100, 1600.00, 0.00, 21.00),
-- PED-2024-005 items
('a50e8400-e29b-41d4-a716-446655440008', '950e8400-e29b-41d4-a716-446655440005', '850e8400-e29b-41d4-a716-446655440007', 40, 1800.00, 0.00, 21.00),
('a50e8400-e29b-41d4-a716-446655440009', '950e8400-e29b-41d4-a716-446655440005', '850e8400-e29b-41d4-a716-446655440009', 20, 1800.00, 0.00, 21.00)
ON CONFLICT (id) DO NOTHING;

-- Insert sample invoices
INSERT INTO public.invoices (id, invoice_number, customer_id, order_id, status, issue_date, subtotal, tax_total, discount_total, grand_total, currency, notes) VALUES
('b50e8400-e29b-41d4-a716-446655440001', 'FAC-2024-001', '550e8400-e29b-41d4-a716-446655440003', '950e8400-e29b-41d4-a716-446655440003', 'paid', '2024-02-01', 79000.00, 16590.00, 2000.00, 93590.00, 'ARS', 'Factura pagada en efectivo'),
('b50e8400-e29b-41d4-a716-446655440002', 'FAC-2024-002', '550e8400-e29b-41d4-a716-446655440001', '950e8400-e29b-41d4-a716-446655440001', 'issued', '2024-02-10', 120000.00, 25200.00, 0.00, 145200.00, 'ARS', 'Factura emitida - pendiente de pago'),
('b50e8400-e29b-41d4-a716-446655440003', 'FAC-2024-003', '550e8400-e29b-41d4-a716-446655440005', NULL, 'draft', '2024-02-12', 50000.00, 10500.00, 0.00, 60500.00, 'ARS', 'Borrador - pedido personalizado')
ON CONFLICT (id) DO NOTHING;

-- Insert sample invoice items
INSERT INTO public.invoice_items (id, invoice_id, order_item_id, qty, unit_price, line_total, discount, tax_rate, description) VALUES
-- FAC-2024-001 items
('c50e8400-e29b-41d4-a716-446655440001', 'b50e8400-e29b-41d4-a716-446655440001', 'a50e8400-e29b-41d4-a716-446655440005', 20, 2100.00, 42000.00, 100.00, 21.00, 'Polo Básico Azul M - Descuento por volumen'),
('c50e8400-e29b-41d4-a716-446655440002', 'b50e8400-e29b-41d4-a716-446655440001', 'a50e8400-e29b-41d4-a716-446655440006', 10, 3500.00, 35000.00, 0.00, 21.00, 'Buzón Deportivo Negro M'),
-- FAC-2024-002 items
('c50e8400-e29b-41d4-a716-446655440003', 'b50e8400-e29b-41d4-a716-446655440002', 'a50e8400-e29b-41d4-a716-446655440001', 50, 1500.00, 75000.00, 0.00, 21.00, 'Remera Básica Blanco S'),
('c50e8400-e29b-41d4-a716-446655440004', 'b50e8400-e29b-41d4-a716-446655440002', 'a50e8400-e29b-41d4-a716-446655440002', 30, 1500.00, 45000.00, 0.00, 21.00, 'Remera Básica Blanco M')
ON CONFLICT (id) DO NOTHING;

-- Insert sample payments - Fixed column references to match actual schema
INSERT INTO public.payments (id, invoice_id, amount, method, payment_date, notes) VALUES
('d50e8400-e29b-41d4-a716-446655440001', 'b50e8400-e29b-41d4-a716-446655440001', 93590.00, 'cash', '2024-02-02', 'Pago completo en efectivo'),
('d50e8400-e29b-41d4-a716-446655440002', 'b50e8400-e29b-41d4-a716-446655440002', 50000.00, 'bank', '2024-02-11', 'Pago parcial por transferencia bancaria - Banco Nación')
ON CONFLICT (id) DO NOTHING;

-- Insert sample stock lots - Fixed to match actual schema columns
INSERT INTO public.stock_lots (id, material_id, lot_number, lot_code, qty, qty_available, cost, location) VALUES
('e50e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 'ALG-2024-001', 'LOT-ALG-001', 500.00, 450.00, 850.00, 'Depósito A - Estante 1'),
('e50e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440002', 'POL-2024-001', 'LOT-POL-001', 300.00, 280.00, 950.00, 'Depósito A - Estante 2'),
('e50e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440003', 'HIL-2024-001', 'LOT-HIL-001', 100.00, 85.00, 45.00, 'Depósito B - Caja 15'),
('e50e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440007', 'TIN-2024-001', 'LOT-TIN-001', 1000.00, 850.00, 2.50, 'Depósito C - Refrigerado')
ON CONFLICT (id) DO NOTHING;

-- Insert sample bill of materials - Fixed to match actual schema columns
INSERT INTO public.bill_of_materials (id, variant_id, material_id, qty_per_unit, quantity_needed) VALUES
-- BOM for Remera Básica Blanco S
('f50e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 0.70, 0.70),
('f50e8400-e29b-41d4-a716-446655440002', '850e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440003', 1.00, 1.00),
('f50e8400-e29b-41d4-a716-446655440003', '850e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440005', 1.00, 1.00),
-- BOM for Remera Sublimable Blanco S
('f50e8400-e29b-41d4-a716-446655440004', '850e8400-e29b-41d4-a716-446655440007', '650e8400-e29b-41d4-a716-446655440002', 0.70, 0.70),
('f50e8400-e29b-41d4-a716-446655440005', '850e8400-e29b-41d4-a716-446655440007', '650e8400-e29b-41d4-a716-446655440003', 1.00, 1.00),
('f50e8400-e29b-41d4-a716-446655440006', '850e8400-e29b-41d4-a716-446655440007', '650e8400-e29b-41d4-a716-446655440007', 10.00, 10.00),
('f50e8400-e29b-41d4-a716-446655440007', '850e8400-e29b-41d4-a716-446655440007', '650e8400-e29b-41d4-a716-446655440008', 8.00, 8.00),
('f50e8400-e29b-41d4-a716-446655440008', '850e8400-e29b-41d4-a716-446655440007', '650e8400-e29b-41d4-a716-446655440009', 8.00, 8.00),
('f50e8400-e29b-41d4-a716-446655440009', '850e8400-e29b-41d4-a716-446655440007', '650e8400-e29b-41d4-a716-446655440010', 15.00, 15.00)
ON CONFLICT (id) DO NOTHING;

-- Insert sample employees - Fixed invalid UUIDs to proper hexadecimal format
INSERT INTO public.employees (id, user_id, full_name, role_id, active) VALUES
('050e8400-e29b-41d4-a716-446655440001', '00000000-0000-0000-0000-000000000001', 'Carlos Rodríguez', 1, true),
('050e8400-e29b-41d4-a716-446655440002', '00000000-0000-0000-0000-000000000002', 'Ana García', 2, true),
('050e8400-e29b-41d4-a716-446655440003', '00000000-0000-0000-0000-000000000003', 'Luis Martínez', (SELECT id FROM roles WHERE code = 'ventas'), true),
('050e8400-e29b-41d4-a716-446655440004', '00000000-0000-0000-0000-000000000004', 'María López', (SELECT id FROM roles WHERE code = 'costos'), true),
('050e8400-e29b-41d4-a716-446655440005', '00000000-0000-0000-0000-000000000005', 'Jorge Fernández', (SELECT id FROM roles WHERE code = 'operario'), true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample stage transitions for workflows - FIXED: Removed sequence_order column
INSERT INTO public.stage_transitions (workflow_id, from_stage_id, to_stage_id) VALUES
-- Ruta Básica (workflow_id = 1)
(1, (SELECT id FROM stages WHERE code = 'diseno'), (SELECT id FROM stages WHERE code = 'impresion')),  
(1, (SELECT id FROM stages WHERE code = 'impresion'), (SELECT id FROM stages WHERE code = 'confeccion')),  
(1, (SELECT id FROM stages WHERE code = 'confeccion'), (SELECT id FROM stages WHERE code = 'qc')),  
(1, (SELECT id FROM stages WHERE code = 'qc'), (SELECT id FROM stages WHERE code = 'empaquetado')),  
-- Ruta Sublimado (workflow_id = 2)
(2, (SELECT id FROM stages WHERE code = 'diseno'), (SELECT id FROM stages WHERE code = 'corte')),  
(2, (SELECT id FROM stages WHERE code = 'corte'), (SELECT id FROM stages WHERE code = 'estampado')),  
(2, (SELECT id FROM stages WHERE code = 'estampado'), (SELECT id FROM stages WHERE code = 'confeccion')),  
(2, (SELECT id FROM stages WHERE code = 'confeccion'), (SELECT id FROM stages WHERE code = 'qc')),  
(2, (SELECT id FROM stages WHERE code = 'qc'), (SELECT id FROM stages WHERE code = 'empaquetado')),  
-- Ruta Completa (workflow_id = 3)
((SELECT id FROM workflows WHERE code = 'completa'), (SELECT id FROM stages WHERE code = 'diseno'), (SELECT id FROM stages WHERE code = 'impresion')), 
((SELECT id FROM workflows WHERE code = 'completa'), (SELECT id FROM stages WHERE code = 'impresion'), (SELECT id FROM stages WHERE code = 'planchado')), 
((SELECT id FROM workflows WHERE code = 'completa'), (SELECT id FROM stages WHERE code = 'planchado'), (SELECT id FROM stages WHERE code = 'corte')), 
((SELECT id FROM workflows WHERE code = 'completa'), (SELECT id FROM stages WHERE code = 'corte'), (SELECT id FROM stages WHERE code = 'estampado')), 
((SELECT id FROM workflows WHERE code = 'completa'), (SELECT id FROM stages WHERE code = 'estampado'), (SELECT id FROM stages WHERE code = 'confeccion')), 
((SELECT id FROM workflows WHERE code = 'completa'), (SELECT id FROM stages WHERE code = 'confeccion'), (SELECT id FROM stages WHERE code = 'qc')), 
((SELECT id FROM workflows WHERE code = 'completa'), (SELECT id FROM stages WHERE code = 'qc'), (SELECT id FROM stages WHERE code = 'empaquetado'))
ON CONFLICT (workflow_id, from_stage_id, to_stage_id) DO NOTHING;

-- Insert sample order routes using dynamic lookups - Fixed employee ID references
INSERT INTO public.order_route (id, order_item_id, workflow_id, current_stage_id, completed_stages, estimated_completion) VALUES
('150e8400-e29b-41d4-a716-446655440001', 'a50e8400-e29b-41d4-a716-446655440001', 1, (SELECT id FROM stages WHERE code = 'confeccion'), ARRAY[(SELECT id FROM stages WHERE code = 'diseno'), (SELECT id FROM stages WHERE code = 'impresion')], '2024-02-14'),
('150e8400-e29b-41d4-a716-446655440002', 'a50e8400-e29b-41d4-a716-446655440002', 1, (SELECT id FROM stages WHERE code = 'confeccion'), ARRAY[(SELECT id FROM stages WHERE code = 'diseno'), (SELECT id FROM stages WHERE code = 'impresion')], '2024-02-14'),
('150e8400-e29b-41d4-a716-446655440003', 'a50e8400-e29b-41d4-a716-446655440003', 2, (SELECT id FROM stages WHERE code = 'estampado'), ARRAY[(SELECT id FROM stages WHERE code = 'diseno'), (SELECT id FROM stages WHERE code = 'corte')], '2024-02-19'),
('150e8400-e29b-41d4-a716-446655440004', 'a50e8400-e29b-41d4-a716-446655440004', 2, (SELECT id FROM stages WHERE code = 'estampado'), ARRAY[(SELECT id FROM stages WHERE code = 'diseno'), (SELECT id FROM stages WHERE code = 'corte')], '2024-02-19'),
('150e8400-e29b-41d4-a716-446655440005', 'a50e8400-e29b-41d4-a716-446655440008', 2, (SELECT id FROM stages WHERE code = 'corte'), ARRAY[(SELECT id FROM stages WHERE code = 'diseno')], '2024-02-17')
ON CONFLICT (id) DO NOTHING;

-- Insert sample order stage events using dynamic lookups - Fixed employee ID references
INSERT INTO public.order_stage_events (id, order_id, order_item_id, stage_id, workflow_id, employee_id, event_type, event_time, duration_minutes, notes, quality_score) VALUES
('250e8400-e29b-41d4-a716-446655440001', '950e8400-e29b-41d4-a716-446655440001', 'a50e8400-e29b-41d4-a716-446655440001', (SELECT id FROM stages WHERE code = 'diseno'), 1, '050e8400-e29b-41d4-a716-446655440002', 'completed', '2024-02-08 09:00:00', 120, 'Diseño aprobado por cliente', 9.5),
('250e8400-e29b-41d4-a716-446655440002', '950e8400-e29b-41d4-a716-446655440001', 'a50e8400-e29b-41d4-a716-446655440001', (SELECT id FROM stages WHERE code = 'impresion'), 1, '050e8400-e29b-41d4-a716-446655440005', 'completed', '2024-02-09 14:30:00', 90, 'Impresión completada sin observaciones', 9.0),
('250e8400-e29b-41d4-a716-446655440003', '950e8400-e29b-41d4-a716-446655440001', 'a50e8400-e29b-41d4-a716-446655440001', (SELECT id FROM stages WHERE code = 'confeccion'), 1, '050e8400-e29b-41d4-a716-446655440005', 'started', '2024-02-10 08:00:00', NULL, 'Iniciando confección de lote', NULL),
('250e8400-e29b-41d4-a716-446655440004', '950e8400-e29b-41d4-a716-446655440005', 'a50e8400-e29b-41d4-a716-446655440008', (SELECT id FROM stages WHERE code = 'diseno'), 2, '050e8400-e29b-41d4-a716-446655440002', 'completed', '2024-02-10 11:00:00', 180, 'Diseño de sublimación personalizada', 10.0),
('250e8400-e29b-41d4-a716-446655440005', '950e8400-e29b-41d4-a716-446655440005', 'a50e8400-e29b-41d4-a716-446655440008', (SELECT id FROM stages WHERE code = 'corte'), 2, '050e8400-e29b-41d4-a716-446655440005', 'started', '2024-02-11 09:30:00', NULL, 'Corte en proceso', NULL)
ON CONFLICT (id) DO NOTHING;

-- Insert sample attachments - Fixed employee ID references
INSERT INTO public.attachments (id, order_id, file_name, file_size, file_type, file_url, uploaded_by, description) VALUES
('350e8400-e29b-41d4-a716-446655440001', '950e8400-e29b-41d4-a716-446655440001', 'diseno_cliente_evento.pdf', 2048576, 'application/pdf', 'https://storage.example.com/files/diseno_cliente_evento.pdf', '050e8400-e29b-41d4-a716-446655440002', 'Diseño proporcionado por el cliente para evento especial'),
('350e8400-e29b-41d4-a716-446655440002', '950e8400-e29b-41d4-a716-446655440005', 'mockup_sublimacion.jpg', 1536000, 'image/jpeg', 'https://storage.example.com/files/mockup_sublimacion.jpg', '050e8400-e29b-41d4-a716-446655440002', 'Mockup de la sublimación personalizada'),
('350e8400-e29b-41d4-a716-446655440003', '950e8400-e29b-41d4-a716-446655440003', 'comprobante_entrega.pdf', 512000, 'application/pdf', 'https://storage.example.com/files/comprobante_entrega.pdf', '050e8400-e29b-41d4-a716-446655440003', 'Comprobante de entrega firmado por el cliente')
ON CONFLICT (id) DO NOTHING;

-- Add helpful comments
COMMENT ON TABLE public.customers IS 'Demo customers for testing the GarmentFlow Pro system';
COMMENT ON TABLE public.products IS 'Sample garment products with different categories';
COMMENT ON TABLE public.orders IS 'Demo orders showing different stages of the production workflow';
COMMENT ON TABLE public.invoices IS 'Sample invoices with different payment statuses';