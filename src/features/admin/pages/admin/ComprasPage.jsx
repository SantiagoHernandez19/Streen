// src/pages/admin/ComprasPage.jsx
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { initialOrders, paymentMethods, initialProducts, initialSuppliers, initialSizes } from '../../../../data';
import EntityTable from '../../components/EntityTable';
import Alert from '../../../../shared/components/Alert';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';
import SearchInput from '../../../../shared/components/SearchInput';
import DateInputWithCalendar from '../../components/DateInputWithCalendar';
import { 
  FaArrowLeft, 
  FaPlus, 
  FaTrash, 
  FaSave, 
  FaEye, 
  FaFileInvoiceDollar,
  FaCalendarAlt,
  FaTruck,
  FaMoneyBillWave,
  FaShoppingCart
} from "react-icons/fa";

// =============================================
// COMPONENTE StatusPill
// =============================================
const StatusPill = React.memo(function StatusPill({ status }) {
  const getColorForStatus = (status) => {
    switch (status?.toLowerCase()) {
      case 'activo':
      case 'completada': return '#10B981';
      case 'anulada':
      case 'cancelada': return '#EF4444';
      case 'pendiente': return '#F59E0B';
      default: return '#6B7280';
    }
  };
  const color = getColorForStatus(status);
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "3px 10px",
      borderRadius: "12px",
      backgroundColor: `${color}20`,
      color: color,
      fontWeight: 600,
      fontSize: "0.65rem",
      textTransform: "capitalize",
      border: `1px solid ${color}40`,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: color, marginRight: 5 }} />
      {status}
    </span>
  );
});

// =============================================
// COMPONENTE StatusFilter
// =============================================
const StatusFilter = React.memo(function StatusFilter({ filterStatus, onFilterSelect }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 10px',
          backgroundColor: 'transparent',
          border: '1px solid #F5C81B',
          color: '#F5C81B',
          borderRadius: '4px',
          fontSize: '12px',
          cursor: 'pointer',
          minWidth: '120px',
          justifyContent: 'space-between',
          fontWeight: '600',
          height: '32px'
        }}
      >
        {filterStatus}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: '4px',
          backgroundColor: '#1F2937',
          border: '1px solid #F5C81B',
          borderRadius: '4px',
          padding: '4px 0',
          minWidth: '150px',
          zIndex: 1000
        }}>
          {['Todos', 'Completadas', 'Anuladas'].map(status => (
            <button
              key={status}
              onClick={() => { onFilterSelect(status); setOpen(false); }}
              style={{
                width: '100%',
                padding: '6px 12px',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#F5C81B',
                fontSize: '12px',
                textAlign: 'left',
                cursor: 'pointer'
              }}
            >
              {status}
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

// =============================================
// COMPONENTE ProductoItemForm (Cada fila de producto en la compra)
// =============================================
const ProductoItemForm = ({ producto, onChange, onRemove, index, isViewMode = false, isFirst = false }) => {
  const subtotal = (producto.cantidad || 0) * (parseFloat(producto.precioCompra) || 0);

  const inputStyle = {
    backgroundColor: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '6px',
    color: '#ffffff',
    fontSize: '13px',
    padding: '8px 10px',
    width: '100%',
    height: '38px',
    outline: 'none',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '11px',
    color: '#9CA3AF',
    marginBottom: '4px',
    fontWeight: '500'
  };

  if (isViewMode) {
    return (
      <div style={{
        backgroundColor: '#151822',
        border: '1px solid #333',
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '10px'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '15px', marginBottom: '10px' }}>
          <div>
            <span style={labelStyle}>PRODUCTO</span>
            <div style={{ color: '#fff', fontWeight: '600' }}>{producto.nombre || '-'}</div>
          </div>
          <div>
            <span style={labelStyle}>TALLA</span>
            <div style={{ color: '#F5C81B', fontWeight: '500' }}>{producto.talla || 'N/A'}</div>
          </div>
          <div>
            <span style={labelStyle}>CANTIDAD</span>
            <div style={{ color: '#fff' }}>{producto.cantidad || 0} unid.</div>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', borderTop: '1px solid #2d3748', paddingTop: '10px' }}>
          <div>
            <span style={labelStyle}>COMPRA</span>
            <div style={{ color: '#10B981', fontWeight: '600' }}>${(parseFloat(producto.precioCompra) || 0).toLocaleString()}</div>
          </div>
          <div>
            <span style={labelStyle}>VENTA</span>
            <div style={{ color: '#F5C81B', fontWeight: '600' }}>${(parseFloat(producto.precioVenta) || 0).toLocaleString()}</div>
          </div>
          <div>
            <span style={labelStyle}>MAY. +6</span>
            <div style={{ color: '#fff', fontSize: '12px' }}>${(parseFloat(producto.precioMayorista6) || 0).toLocaleString()}</div>
          </div>
          <div>
            <span style={labelStyle}>MAY. +80</span>
            <div style={{ color: '#fff', fontSize: '12px' }}>${(parseFloat(producto.precioMayorista80) || 0).toLocaleString()}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#1a1a1a',
      border: '1px solid #333',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '16px',
      position: 'relative',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }}>
      {!isFirst && (
        <button
          type="button"
          onClick={() => onRemove(index)}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#ef4444',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <FaTrash size={14} />
        </button>
      )}

      {/* FILA 1: Selección de Producto, Talla, Cantidad */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
        <div>
          <label style={labelStyle}>NOMBRE DEL PRODUCTO</label>
          <input
            type="text"
            value={producto.nombre || ''}
            onChange={(e) => onChange(index, 'nombre', e.target.value)}
            style={inputStyle}
            placeholder="Ej: Gorra Yankees"
          />
        </div>
        <div>
          <label style={labelStyle}>TALLA</label>
          <select
            value={producto.talla || ''}
            onChange={(e) => onChange(index, 'talla', e.target.value)}
            style={inputStyle}
          >
            <option value="">Talla</option>
            <option value="7">7</option>
            <option value="7/1/4">7/1/4</option>
            <option value="7/1/8">7/1/8</option>
            <option value="ajustable">Ajustable</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>CANTIDAD</label>
          <input
            type="number"
            min="1"
            value={producto.cantidad || ''}
            onChange={(e) => onChange(index, 'cantidad', parseInt(e.target.value) || 0)}
            style={inputStyle}
            placeholder="0"
          />
        </div>
      </div>

      {/* FILA 2: Precios (Lo que solicitó el usuario) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', backgroundColor: '#00000030', padding: '12px', borderRadius: '6px', border: '1px dashed #333' }}>
        <div>
          <label style={{ ...labelStyle, color: '#10B981' }}>PRECIO COMPRA</label>
          <input
            type="text"
            value={producto.precioCompra}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9]/g, '');
              onChange(index, 'precioCompra', val);
            }}
            style={{ ...inputStyle, color: '#10B981', fontWeight: '700' }}
            placeholder="0"
          />
        </div>
        <div>
          <label style={{ ...labelStyle, color: '#F5C81B' }}>PRECIO VENTA</label>
          <input
            type="text"
            value={producto.precioVenta}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9]/g, '');
              onChange(index, 'precioVenta', val);
            }}
            style={{ ...inputStyle, color: '#F5C81B', fontWeight: '700' }}
            placeholder="0"
          />
        </div>
        <div>
          <label style={labelStyle}>PRECIO +6</label>
          <input
            type="text"
            value={producto.precioMayorista6}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9]/g, '');
              onChange(index, 'precioMayorista6', val);
            }}
            style={inputStyle}
            placeholder="0"
          />
        </div>
        <div>
          <label style={labelStyle}>PRECIO +80</label>
          <input
            type="text"
            value={producto.precioMayorista80}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9]/g, '');
              onChange(index, 'precioMayorista80', val);
            }}
            style={inputStyle}
            placeholder="0"
          />
        </div>
      </div>
      
      <div style={{ marginTop: '10px', textAlign: 'right', fontSize: '13px', color: '#9CA3AF' }}>
        Subtotal Item: <span style={{ color: '#F5C81B', fontWeight: '700' }}>${subtotal.toLocaleString()}</span>
      </div>
    </div>
  );
};

// =============================================
// PÁGINA PRINCIPAL ComprasPage
// =============================================
const ComprasPage = () => {
  const location = useLocation();
  const [modoVista, setModoVista] = useState("lista"); // "lista", "formulario", "detalle"
  const [compras, setCompras] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
  const [errors, setErrors] = useState({});
  const [compraViendo, setCompraViendo] = useState(null);
  const [compraEditando, setCompraEditando] = useState(null);
  const [anularModal, setAnularModal] = useState({ isOpen: false, compra: null });

  const [nuevaCompra, setNuevaCompra] = useState({
    proveedor: '',
    metodoPago: 'Efectivo',
    fecha: new Date().toLocaleDateString('es-CO'),
    productos: [{ 
      id: '', 
      nombre: '', 
      talla: '', 
      cantidad: 1, 
      precioCompra: '', 
      precioVenta: '', 
      precioMayorista6: '', 
      precioMayorista80: '', 
      _tempKey: Math.random() 
    }],
    estado: 'Completada'
  });

  const proveedoresActivos = useMemo(() =>
    initialSuppliers.filter(s => s.Estado).map(s => ({ id: s.IdProveedor, nombre: s.Nombre })), []);

  useEffect(() => {
    const dataFormateada = initialOrders.map(o => ({
      id: `#${o.IdCompra}`,
      proveedor: o.proveedor,
      fecha: o.Fecha ? new Date(o.Fecha).toLocaleDateString('es-CO') : 'N/A',
      total: o.Total || 0,
      metodo: o.metodoPago,
      estado: o.estado === 'Anulada' ? 'Anulada' : 'Completada',
      productos: o.productos?.map(p => ({
        ...p,
        precioCompra: p.precio?.toString() || '0',
        precioVenta: (Math.round(p.precio * 1.5))?.toString() || '0',
        precioMayorista6: (Math.round(p.precio * 1.3))?.toString() || '0',
        precioMayorista80: (Math.round(p.precio * 1.2))?.toString() || '0',
      })) || [],
      isActive: o.estado !== 'Anulada'
    }));
    setCompras(dataFormateada);
  }, []);

  const showAlert = useCallback((message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 3000);
  }, []);

  const mostrarLista = () => {
    setModoVista("lista");
    setCompraEditando(null);
    setCompraViendo(null);
  };

  const mostrarFormulario = (compra = null) => {
    if (compra) {
      if (compra.estado === 'Anulada') {
        showAlert('Las compras anuladas no se pueden editar', 'error');
        return;
      }
      setCompraEditando(compra);
      setNuevaCompra({
        proveedor: compra.proveedor,
        metodoPago: compra.metodo,
        fecha: compra.fecha,
        productos: compra.productos.map(p => ({ ...p, _tempKey: Math.random() })),
        estado: compra.estado
      });
    } else {
      setCompraEditando(null);
      setNuevaCompra({
        proveedor: '',
        metodoPago: 'Efectivo',
        fecha: new Date().toLocaleDateString('es-CO'),
        productos: [{ 
          id: '', 
          nombre: '', 
          talla: '', 
          cantidad: 1, 
          precioCompra: '', 
          precioVenta: '', 
          precioMayorista6: '', 
          precioMayorista80: '', 
          _tempKey: Math.random() 
        }],
        estado: 'Completada'
      });
    }
    setErrors({});
    setModoVista("formulario");
  };

  const mostrarDetalle = (compra) => {
    setCompraViendo(compra);
    setModoVista("detalle");
  };

  useEffect(() => {
    if (location.state?.openModal) {
      mostrarFormulario();
    }
  }, [location]);

  const agregarProducto = () => setNuevaCompra(p => ({
    ...p,
    productos: [...p.productos, { 
      id: '', 
      nombre: '', 
      talla: '', 
      cantidad: 1, 
      precioCompra: '', 
      precioVenta: '', 
      precioMayorista6: '', 
      precioMayorista80: '', 
      _tempKey: Math.random() 
    }]
  }));

  const actualizarProducto = (index, campo, valor) => setNuevaCompra(p => {
    const n = [...p.productos];
    n[index] = { ...n[index], [campo]: valor };
    return { ...p, productos: n };
  });

  const eliminarProducto = (index) => {
    if (nuevaCompra.productos.length > 1) {
      setNuevaCompra(p => ({ ...p, productos: p.productos.filter((_, i) => i !== index) }));
    }
  };

  const calcularTotal = () => nuevaCompra.productos.reduce((t, p) => t + (p.cantidad * (parseFloat(p.precioCompra) || 0)), 0);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const e_fields = {};
    if (!nuevaCompra.proveedor) e_fields.proveedor = 'El proveedor es obligatorio';
    
    nuevaCompra.productos.forEach((p, i) => {
      if (!p.nombre) e_fields[`prod_${i}`] = true;
      if (!p.precioCompra || p.precioCompra <= 0) e_fields[`price_${i}`] = true;
    });

    if (Object.keys(e_fields).length > 0) {
      setErrors(e_fields);
      showAlert("Por favor complete los campos obligatorios", "error");
      return;
    }

    const total = calcularTotal();
    const data = {
      ...nuevaCompra,
      id: compraEditando ? compraEditando.id : `#${compras.length + 1}`,
      total,
      metodo: nuevaCompra.metodoPago,
      isActive: nuevaCompra.estado !== 'Anulada'
    };

    if (compraEditando) {
      setCompras(prev => prev.map(c => c.id === compraEditando.id ? data : c));
      showAlert('Compra actualizada correctamente');
    } else {
      setCompras(prev => [...prev, data]);
      showAlert('Compra registrada correctamente');
    }

    setTimeout(() => mostrarLista(), 1500);
  };

  const handleAnularCompra = () => {
    setCompras(prev => prev.map(c =>
      c.id === anularModal.compra.id
        ? { ...c, estado: 'Anulada', isActive: false }
        : c
    ));
    showAlert('Compra anulada');
    setAnularModal({ isOpen: false, compra: null });
  };

  const filtered = compras.filter(c => {
    const search = (c.proveedor + c.id).toLowerCase().includes(searchTerm.toLowerCase());
    const status = filterStatus === 'Todos' || c.estado === filterStatus.slice(0, -1) || c.estado === filterStatus;
    return search && status;
  });

  const columns = [
    { header: 'Proveedor', field: 'proveedor', render: (item) => <span style={{ color: '#fff' }}>{item.proveedor}</span> },
    { header: 'Fecha', field: 'fecha', render: (item) => <span style={{ color: '#9CA3AF' }}>{item.fecha}</span> },
    { header: 'Total', field: 'total', render: (item) => <span style={{ color: '#10B981', fontWeight: '700' }}>${item.total.toLocaleString()}</span> },
    { header: 'Estado', field: 'estado', render: (item) => <StatusPill status={item.estado} /> }
  ];

  // =========================
  // RENDER PÁGINA
  // =========================
  return (
    <>
      {alert.show && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ show: false, message: '', type: 'success' })}
        />
      )}
      
      <ConfirmDeleteModal
        isOpen={anularModal.isOpen}
        onClose={() => setAnularModal({ isOpen: false, compra: null })}
        onConfirm={handleAnularCompra}
        entityName="compra"
        entityData={anularModal.compra}
        customMessage={`¿Estás seguro que deseas anular la compra ${anularModal.compra?.id}? Esta acción afectará el stock.`}
      />

      <div style={{ display: "flex", flexDirection: "column", padding: "4px 16px 0 16px", flex: 1, height: "100%" }}>
        
        {/* HEADER DINÁMICO */}
        <div style={{ marginBottom: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {(modoVista === "formulario" || modoVista === "detalle") && (
                <button
                  onClick={mostrarLista}
                  style={{
                    background: 'transparent',
                    border: '1px solid #F5C81B',
                    color: '#F5C81B',
                    fontSize: '16px',
                    cursor: 'pointer',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <FaArrowLeft size={16} />
                </button>
              )}
              <div>
                <h1 style={{ color: "#fff", fontSize: "24px", fontWeight: "700", margin: 0 }}>
                  {modoVista === "formulario" && (compraEditando ? "Editar Compra" : "Registrar Compra")}
                  {modoVista === "detalle" && "Detalle de Compra"}
                  {modoVista === "lista" && "Compras"}
                </h1>
                <p style={{ color: "#9CA3AF", fontSize: "14px", margin: "4px 0 0 0" }}>
                  {modoVista === "formulario" && 'Complete el registro del abastecimiento de productos'}
                  {modoVista === "detalle" && `Información de la factura`}
                  {modoVista === "lista" && 'Gestión y seguimiento de órdenes de compra'}
                </p>
              </div>
            </div>

            {modoVista === "lista" && (
              <button
                onClick={() => mostrarFormulario()}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "transparent",
                  border: "1px solid #F5C81B",
                  color: "#F5C81B",
                  borderRadius: "6px",
                  fontSize: "14px",
                  cursor: "pointer",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <FaPlus size={12} />
                Registrar
              </button>
            )}

            {modoVista === "formulario" && (
              <button
                onClick={handleSubmit}
                style={{
                  padding: "8px 20px",
                  backgroundColor: "#F5C81B20",
                  border: "1px solid #F5C81B",
                  color: "#F5C81B",
                  borderRadius: "6px",
                  fontSize: "14px",
                  cursor: "pointer",
                  fontWeight: "700",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                <FaSave size={14} />
                {compraEditando ? "Actualizar" : "Guardar Compra"}
              </button>
            )}
            
            {modoVista === "detalle" && (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => mostrarFormulario(compraViendo)}
                  disabled={compraViendo?.estado === 'Anulada'}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "transparent",
                    border: "1px solid #F5C81B",
                    color: "#F5C81B",
                    borderRadius: "6px",
                    fontSize: "14px",
                    cursor: compraViendo?.estado === 'Anulada' ? 'not-allowed' : 'pointer',
                    opacity: compraViendo?.estado === 'Anulada' ? 0.5 : 1,
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <FaEye size={12} />
                  Editar
                </button>
              </div>
            )}
          </div>

          {modoVista === "lista" && (
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <SearchInput
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Buscar por proveedor o número de factura..."
                  onClear={() => setSearchTerm('')}
                  fullWidth={true}
                  inputStyle={{
                    border: '1px solid #F5C81B',
                    backgroundColor: '#0a0a0a',
                    color: '#fff',
                    borderRadius: '6px',
                    height: '36px',
                    padding: '0 12px',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
              </div>
              <StatusFilter filterStatus={filterStatus} onFilterSelect={setFilterStatus} />
            </div>
          )}
        </div>

        {/* CONTENIDO PRINCIPAL SEGÚN MODO VISTA */}
        {modoVista === "lista" ? (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '8px',
            border: '1px solid #F5C81B',
            overflow: 'hidden',
            backgroundColor: '#000',
          }}>
            <div style={{ flex: 1, overflow: 'auto' }}>
              <EntityTable
                entities={filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
                columns={columns}
                onView={mostrarDetalle}
                onEdit={mostrarFormulario}
                onAnular={c => setAnularModal({ isOpen: true, compra: c })}
                showAnularButton={true}
                moduleType="compras"
                style={{ border: 'none', borderRadius: '0' }}
                tableStyle={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}
                headerStyle={{
                  padding: '10px',
                  textAlign: 'left',
                  fontWeight: '600',
                  fontSize: '12px',
                  color: '#F5C81B',
                  borderBottom: '1px solid #F5C81B',
                  backgroundColor: '#151822',
                }}
                rowStyle={{
                  border: 'none',
                  backgroundColor: '#000',
                  '&:hover': { backgroundColor: '#111111' }
                }}
              />
            </div>
            {/* PAGINACIÓN */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 16px",
              backgroundColor: "#151822",
              borderTop: '1px solid #F5C81B',
              fontSize: "12px",
              color: "#e0e0e0",
            }}>
              <span>{filtered.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}–{Math.min(currentPage * itemsPerPage, filtered.length)} de {filtered.length}</span>
              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  style={{
                    background: 'transparent',
                    border: '1px solid #F5C81B',
                    color: currentPage === 1 ? '#6B7280' : '#F5C81B',
                    padding: '5px 12px',
                    borderRadius: '4px',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  }}
                >
                  ‹
                </button>
                <span style={{ color: '#F5C81B', fontWeight: 'bold' }}>{currentPage}</span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filtered.length/itemsPerPage)))}
                  disabled={currentPage >= Math.ceil(filtered.length / itemsPerPage)}
                  style={{
                    background: 'transparent',
                    border: '1px solid #F5C81B',
                    color: currentPage >= Math.ceil(filtered.length / itemsPerPage) ? '#6B7280' : '#F5C81B',
                    padding: '5px 12px',
                    borderRadius: '4px',
                    cursor: currentPage >= Math.ceil(filtered.length / itemsPerPage) ? 'not-allowed' : 'pointer',
                  }}
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        ) : modoVista === "formulario" ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, overflow: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {/* PANEL IZQUIERDO: Datos Generales */}
              <div style={{
                backgroundColor: '#111',
                border: '1px solid #333',
                borderRadius: '8px',
                padding: '20px',
              }}>
                <h3 style={{ color: '#F5C81B', fontSize: '15px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaTruck size={14} /> DATOS DEL PROVEEDOR
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: '#F5C81B', marginBottom: '6px', display: 'block' }}>PROVEEDOR <span style={{ color: '#ef4444' }}>*</span></label>
                    <select
                      value={nuevaCompra.proveedor}
                      onChange={(e) => setNuevaCompra(p => ({ ...p, proveedor: e.target.value }))}
                      style={{
                        backgroundColor: '#1e293b',
                        border: errors.proveedor ? '1px solid #ef4444' : '1px solid #334155',
                        borderRadius: '6px',
                        padding: '10px',
                        color: '#fff',
                        width: '100%',
                        outline: 'none',
                        height: '42px'
                      }}
                    >
                      <option value="">Seleccionar proveedor activo...</option>
                      {proveedoresActivos.map(p => <option key={p.id} value={p.nombre}>{p.nombre}</option>)}
                    </select>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                     <div>
                        <label style={{ fontSize: '12px', color: '#F5C81B', marginBottom: '6px', display: 'block' }}>MÉTODO DE PAGO</label>
                        <select
                          value={nuevaCompra.metodoPago}
                          onChange={(e) => setNuevaCompra(p => ({ ...p, metodoPago: e.target.value }))}
                          style={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: '6px',
                            padding: '10px',
                            color: '#fff',
                            width: '100%',
                            outline: 'none',
                            height: '42px'
                          }}
                        >
                          {paymentMethods.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                     </div>
                     <div>
                        <label style={{ fontSize: '12px', color: '#F5C81B', marginBottom: '6px', display: 'block' }}>ESTADO</label>
                        <select
                          value={nuevaCompra.estado}
                          onChange={(e) => setNuevaCompra(p => ({ ...p, estado: e.target.value }))}
                          style={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: '6px',
                            padding: '10px',
                            color: '#fff',
                            width: '100%',
                            outline: 'none',
                            height: '42px'
                          }}
                        >
                          <option value="Completada">Completada</option>
                          <option value="Pendiente">Pendiente</option>
                        </select>
                     </div>
                  </div>
                </div>
              </div>

              {/* PANEL DERECHO: Resumen de Totales */}
              <div style={{
                backgroundColor: '#111',
                border: '1px solid #333',
                borderRadius: '8px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <h3 style={{ color: '#F5C81B', fontSize: '15px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaFileInvoiceDollar size={14} /> RESUMEN DE COMPRA
                </h3>

                <div style={{ backgroundColor: '#00000050', padding: '15px', borderRadius: '8px', border: '1px solid #2d3748' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ color: '#9CA3AF' }}>Subtotal:</span>
                      <span style={{ color: '#fff' }}>${calcularTotal().toLocaleString()}</span>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', paddingTop: '10px', borderTop: '1px solid #2d3748' }}>
                      <span style={{ color: '#F5C81B', fontWeight: '700' }}>TOTAL FACTURA:</span>
                      <span style={{ color: '#10B981', fontWeight: '800', fontSize: '20px' }}>${calcularTotal().toLocaleString()}</span>
                   </div>
                </div>

                <div style={{ marginTop: '15px' }}>
                    <label style={{ fontSize: '12px', color: '#F5C81B', marginBottom: '6px', display: 'block' }}>FECHA DE OPERACIÓN</label>
                    <DateInputWithCalendar
                      value={nuevaCompra.fecha}
                      onChange={(d) => setNuevaCompra(p => ({ ...p, fecha: d }))}
                      inputStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '6px',
                        padding: '10px',
                        color: '#fff',
                        width: '100%',
                        height: '42px'
                      }}
                    />
                </div>
              </div>
            </div>

            {/* SECCIÓN ABAJO: Listado de Productos */}
            <div style={{
              backgroundColor: '#111',
              border: '1px solid #333',
              borderRadius: '8px',
              padding: '20px',
              flex: 1
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ color: '#F5C81B', fontSize: '15px', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaShoppingCart size={14} /> PRODUCTOS ADQUIRIDOS
                </h3>
                <button
                  type="button"
                  onClick={agregarProducto}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid #F5C81B',
                    color: '#F5C81B',
                    padding: '6px 15px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <FaPlus size={10} />
                  Añadir Item
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {nuevaCompra.productos.map((p, i) => (
                  <ProductoItemForm
                    key={p._tempKey}
                    producto={p}
                    index={i}
                    onChange={actualizarProducto}
                    onRemove={eliminarProducto}
                    isFirst={i === 0}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* MODO VISTA: DETALLE */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
               <div style={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px', padding: '20px' }}>
                  <h3 style={{ color: '#F5C81B', fontSize: '14px', fontWeight: '700', marginBottom: '15px', textTransform: 'uppercase' }}>Información General</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: '#9CA3AF' }}>PROVEEDOR</span>
                      <div style={{ color: '#fff', fontSize: '15px', fontWeight: '600', marginTop: '4px' }}>{compraViendo?.proveedor}</div>
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', color: '#9CA3AF' }}>ESTADO</span>
                      <div style={{ marginTop: '4px' }}><StatusPill status={compraViendo?.estado} /></div>
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', color: '#9CA3AF' }}>FECHA</span>
                      <div style={{ color: '#fff', fontSize: '14px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FaCalendarAlt size={12} color="#94a3b8" /> {compraViendo?.fecha}
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', color: '#9CA3AF' }}>MÉTODO</span>
                      <div style={{ color: '#fff', fontSize: '14px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FaMoneyBillWave size={12} color="#94a3b8" /> {compraViendo?.metodo}
                      </div>
                    </div>
                  </div>
               </div>

               <div style={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '8px' }}>TOTAL DE LA OPERACIÓN</span>
                  <div style={{ color: '#10B981', fontSize: '42px', fontWeight: '900' }}>
                    ${compraViendo?.total.toLocaleString()}
                  </div>
                  <div style={{ color: '#9CA3AF', fontSize: '12px', marginTop: '10px' }}>
                    {compraViendo?.productos.length} items registrados
                  </div>
               </div>
            </div>

            <div style={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px', padding: '20px', flex: 1, overflow: 'auto' }}>
               <h3 style={{ color: '#F5C81B', fontSize: '14px', fontWeight: '700', marginBottom: '15px', textTransform: 'uppercase' }}>Productos Detallados</h3>
               <div style={{ display: 'flex', flexDirection: 'column' }}>
                 {compraViendo?.productos.map((p, i) => (
                   <ProductoItemForm key={i} producto={p} isViewMode={true} />
                 ))}
               </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ComprasPage;