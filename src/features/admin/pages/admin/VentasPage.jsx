// src/pages/admin/VentasPage.jsx
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { initialSales, initialProducts, initialCustomers, initialSizes} from '../../../../data';
import EntityTable from '../../components/EntityTable';
import Alert from '../../../../shared/components/Alert';
import AnularOperacionModal from '../../components/AnularOperacionModal';
import SearchInput from '../../../../shared/components/SearchInput';
import DateInputWithCalendar from '../../components/DateInputWithCalendar';
import { 
  FaArrowLeft, 
  FaPlus, 
  FaTrash, 
  FaSave, 
  FaCamera,
  FaCheckCircle,
  FaTimesCircle,
  FaImage,
  FaUser,
  FaBoxOpen
} from "react-icons/fa";

const PAYMENT_METHODS = [
  'Efectivo',
  'Bancolombia',
  'Nequi',
  'Bold'
];

const requiresReceipt = (method) => {
  return !['Efectivo'].includes(method);
};

// =============================================
// COMPONENTE StatusPill
// =============================================
const StatusPill = React.memo(function StatusPill({ status }) {
  const getColorForStatus = (status) => {
    switch(status?.toLowerCase()) {
      case 'activo':
      case 'entregado':
      case 'completada':
      case 'aprobada': return '#10B981';
      case 'rechazada':
      case 'anulada':
      case 'cancelada': return '#EF4444';
      case 'en camino': return '#3B82F6';
      case 'entrega pendiente':
      case 'pendiente': return '#F59E0B';
      default: return '#6B7280';
    }
  };
  const color = getColorForStatus(status);
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "5px 10px",
      borderRadius: "12px",
      backgroundColor: `${color}20`,
      color: color,
      fontWeight: 600,
      fontSize: "0.75rem",
      textTransform: "capitalize",
      border: `1px solid ${color}40`,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: color, marginRight: 5 }} />
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
          display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px',
          backgroundColor: 'transparent', border: '1px solid #F5C81B', color: '#F5C81B',
          borderRadius: '6px', fontSize: '13px', cursor: 'pointer', minWidth: '110px',
          justifyContent: 'space-between', fontWeight: '600', height: '36px'
        }}
      >
        {filterStatus}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', right: 0, marginTop: '4px', backgroundColor: '#1F2937',
          border: '1px solid #F5C81B', borderRadius: '6px', padding: '6px 0', minWidth: '120px', zIndex: 1000
        }}>
          {['Todos', 'Pendiente', 'Aprobada', 'Rechazada', 'Anulada'].map(status => (
            <button
              key={status}
              onClick={() => { onFilterSelect(status); setOpen(false); }}
              style={{ width: '100%', padding: '6px 12px', backgroundColor: 'transparent', border: 'none', color: '#F5C81B', fontSize: '13px', textAlign: 'left', cursor: 'pointer' }}
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
// COMPONENTE ProductoForm
// =============================================
const ProductoForm = React.memo(function ProductoForm({ producto, onChange, onRemove, index, isViewMode = false, isFirst = false }) {
  const subtotal = (producto.cantidad || 0) * (parseFloat(producto.precio) || 0);
  
  const productInputStyle = {
    backgroundColor: '#0a0a0a', border: '1px solid #334155', borderRadius: '4px',
    color: '#ffffff', fontSize: '13px', padding: '6px 10px', width: '100%', outline: 'none'
  };
  
  const productCardStyle = {
    display: 'grid', gap: '10px', gridTemplateColumns: !isFirst ? '2.5fr 1fr 0.8fr 1fr auto' : '2.5fr 1fr 0.8fr 1fr',
    alignItems: 'center', marginBottom: '10px'
  };
  
  if (isViewMode) {
    return (
      <div style={{ display: 'grid', gap: '10px', gridTemplateColumns: '2.5fr 1fr 0.8fr 1fr', padding: '10px', alignItems: 'center', border: '1px solid #334155', borderRadius: '8px', marginBottom: '8px', backgroundColor: '#0f0f0f' }}>
        <div style={{ color: '#fff', fontSize: '13px', fontWeight: '500' }}>{producto.nombre || '-'}</div>
        <div style={{ color: '#94a3b8', fontSize: '13px', textAlign: 'center' }}>Talla: {producto.talla || '-'}</div>
        <div style={{ color: '#fff', fontSize: '13px', textAlign: 'center' }}>Cant: {producto.cantidad || 0}</div>
        <div style={{ color: '#F5C81B', fontSize: '13px', textAlign: 'right', fontWeight: '700' }}>${(parseFloat(producto.precio) || 0).toLocaleString('es-CO')}</div>
      </div>
    );
  }
  
  return (
    <div style={productCardStyle}>
      <select value={producto.id || ''} onChange={(e) => {
          const sel = initialProducts.find(p => p.id === parseInt(e.target.value));
          onChange(index, 'id', sel?.id || ''); onChange(index, 'nombre', sel?.nombre || ''); onChange(index, 'precio', sel?.precio?.toString() || '');
        }} style={productInputStyle}>
        <option value="">Seleccionar Producto...</option>
        {initialProducts.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
      </select>
      
      <select value={producto.talla || ''} onChange={(e) => onChange(index, 'talla', e.target.value)} style={productInputStyle}>
        <option value="">Talla...</option>
        {initialSizes?.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
      </select>
      
      <input type="number" min="1" value={producto.cantidad || ''} onChange={(e) => onChange(index, 'cantidad', parseInt(e.target.value) || 0)} style={productInputStyle} />
      
      <div style={{ color: '#10B981', fontWeight: '700', textAlign: 'center', fontSize: '14px', border: '1px solid #334155', borderRadius: '6px', padding: '6px 10px', backgroundColor: '#0a0a0a' }}>
        ${subtotal.toLocaleString('es-CO')}
      </div>
      
      {!isFirst && (
        <button onClick={() => onRemove(index)} style={{ border: 'none', color: '#ef4444', background: 'transparent', cursor: 'pointer', padding: '6px' }} >
          <FaTrash />
        </button>
      )}
    </div>
  );
});

// =============================================
// PÁGINA PRINCIPAL VentasPage
// =============================================
const VentasPage = () => {
  const [modoVista, setModoVista] = useState("lista"); // "lista", "formulario", "detalle"
  const [ventas, setVentas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
  const [errors, setErrors] = useState({});
  const [ventaViendo, setVentaViendo] = useState(null);
  const [anularModal, setAnularModal] = useState({ isOpen: false, venta: null });
  
  const [nuevaVenta, setNuevaVenta] = useState({
    cliente: '',
    metodoPago: 'Efectivo',
    fecha: new Date().toLocaleDateString('es-CO'),
    productos: [{ id: '', nombre: '', talla: '', cantidad: 1, precio: '', _tempKey: Date.now() + Math.random() }],
    estado: 'Pendiente',
    motivoRechazo: '',
    evidencia: null
  });
  
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const fetchVentas = async () => {
    try {
      const res = await fetch('https://backend-streen.onrender.com/api/sales');
      const data = await res.json();
      if (data.status === 'success') {
        const salesFormat = data.data.sales.map(v => ({
          id_real: v.id_venta,
          id: `#${v.id_venta}`,
          cliente: v.customer_email || 'Anonimo',
          fecha: new Date(v.created_at).toLocaleDateString('es-CO'),
          total: Number(v.total) || 0,
          metodoPago: v.metodo_pago,
          estado: v.estado,
          productos: v.productos.map(p => ({
            id: p.id_producto,
            nombre: `Prod. ID ${p.id_producto}`, // En un futuro podemos cruzar el nombre
            talla: p.talla,
            cantidad: p.cantidad,
            precio: p.precio_unitario
          })),
          isActive: true,
          motivoRechazo: '',
          evidencia: v.comprobante_url || 'https://via.placeholder.com/400x300/1E293B/FFC107?text=SIN+COMPROBANTE'
        }));
        setVentas(salesFormat);
      }
    } catch (error) {
      console.error("Error cargando ventas:", error);
    }
  };

  useEffect(() => {
    fetchVentas();
  }, []);
  
  const showAlert = useCallback((message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 3000);
  }, []);

  const mostrarLista = () => {
    setModoVista("lista");
    setVentaViendo(null);
    setIsRejecting(false);
    setRejectionReason('');
  };

  const mostrarFormulario = () => {
    setNuevaVenta({
      cliente: '',
      metodoPago: 'Efectivo',
      fecha: new Date().toLocaleDateString('es-CO'),
      productos: [{ id: '', nombre: '', talla: '', cantidad: 1, precio: '', _tempKey: Date.now() + Math.random() }],
      estado: 'Pendiente',
      motivoRechazo: '',
      evidencia: null
    });
    setErrors({});
    setModoVista("formulario");
  };

  const mostrarDetalle = (venta) => {
    setVentaViendo(venta);
    setIsRejecting(false);
    setRejectionReason('');
    setModoVista("detalle");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNuevaVenta(prev => ({ ...prev, evidencia: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const agregarProducto = () => setNuevaVenta(p => ({
    ...p,
    productos: [...p.productos, { id: '', nombre: '', talla: '', cantidad: 1, precio: '', _tempKey: Math.random() }]
  }));
  
  const actualizarProducto = (index, campo, valor) => setNuevaVenta(p => {
    const n = [...p.productos];
    n[index] = { ...n[index], [campo]: valor };
    return { ...p, productos: n };
  });
  
  const eliminarProducto = (index) => {
    if (nuevaVenta.productos.length > 1) {
      setNuevaVenta(p => ({ ...p, productos: p.productos.filter((_, i) => i !== index) }));
    }
  };
  
  const calcularTotal = () => nuevaVenta.productos.reduce((t, p) => t + (p.cantidad * (parseFloat(p.precio) || 0)), 0);
  const calcularTotalViendo = () => ventaViendo?.productos.reduce((t, p) => t + (p.cantidad * (parseFloat(p.precio) || 0)), 0) || 0;
  
  const validar = () => {
    const e = {};
    const reqInfo = requiresReceipt(nuevaVenta.metodoPago);
    if (!nuevaVenta.cliente) e.cliente = true;
    if (reqInfo && !nuevaVenta.evidencia) e.evidencia = true;
    nuevaVenta.productos.forEach((p, i) => {
      if (!p.id) e[`producto_id_${i}`] = true;
      if (!p.precio || p.precio <= 0) e[`producto_precio_${i}`] = true;
    });
    setErrors(e);
    
    if (reqInfo && e.evidencia) showAlert(`Debe adjuntar el comprobante de ${nuevaVenta.metodoPago}`, "error");
    else if (Object.keys(e).length > 0) showAlert("Por favor complete todos los campos obligatorios", "error");
    
    return Object.keys(e).length === 0;
  };
  
  const handleCreateVenta = () => {
    if (!validar()) return;
    const data = { 
      ...nuevaVenta, 
      id: `#${ventas.length + 1000}`, 
      total: calcularTotal(), 
      estado: 'Pendiente',
      isActive: true
    };
    setVentas(prev => [data, ...prev]);
    showAlert('Venta registrada exitosamente', 'success');
    mostrarLista();
  };
  
  const handleAnularVenta = () => {
    setVentas(prev => prev.map(v =>
      v.id === anularModal.venta.id
        ? { ...v, estado: 'Anulada', isActive: false }
        : v
    ));
    showAlert('Venta anulada correctamente');
    setAnularModal({ isOpen: false, venta: null });
  };

  const updateVentaStatus = async (status, reason = '') => {
    if (status === 'Aprobada') {
      try {
        const res = await fetch(`https://backend-streen.onrender.com/api/sales/${ventaViendo.id_real}/approve`, {
          method: 'PUT'
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Error en servidor');
      } catch (err) {
        console.error(err);
        showAlert(err.message || 'Error al aprobar y descontar stock', 'error');
        return;
      }
    }

    setVentas(prev => prev.map(v => 
      v.id === ventaViendo.id ? { ...v, estado: status, motivoRechazo: reason || v.motivoRechazo } : v
    ));
    setVentaViendo(prev => ({ ...prev, estado: status, motivoRechazo: reason || prev.motivoRechazo }));
    showAlert(`Venta ${status.toLowerCase()} correctamente`);
    if (status === 'Rechazada') setIsRejecting(false);
  };
  
  const filtered = ventas.filter(v => {
    const clienteName = typeof v.cliente === 'object' ? v.cliente?.nombre : v.cliente;
    const search = (clienteName + v.id).toLowerCase().includes(searchTerm.toLowerCase());
    const status = filterStatus === 'Todos' || v.estado.toLowerCase() === filterStatus.toLowerCase();
    return search && status;
  });
  
  const columns = [
    { header: 'No. Venta', field: 'id', render: (item) => <span style={{ color: '#F5C81B', fontWeight: '700' }}>{item.id}</span> },
    { header: 'Cliente', field: 'cliente', render: (item) => <span style={{ color: '#fff' }}>{typeof item.cliente === 'object' ? item.cliente?.nombre : item.cliente}</span> },
    { header: 'Fecha', field: 'fecha', render: (item) => <span style={{ color: '#9CA3AF' }}>{item.fecha}</span> },
    { header: 'Total', field: 'total', render: (item) => <span style={{ color: '#10B981', fontWeight: '800' }}>${Number(item.total).toLocaleString('es-CO')}</span> },
    { header: 'Método Pagos', field: 'metodoPago', render: (item) => <span style={{ color: '#fff' }}>{item.metodoPago}</span> },
    { header: 'Estado', field: 'estado', render: (item) => <StatusPill status={item.estado} /> }
  ];
  
  return (
    <>
      {alert.show && <Alert message={alert.message} type={alert.type} onClose={() => setAlert({ ...alert, show: false })} />}
      <div style={{ display: "flex", flexDirection: "column", padding: "4px 16px 0 16px", flex: 1, height: "100%" }}>
        
        {/* HEADER */}
        <div style={{ marginBottom: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {(modoVista === "formulario" || modoVista === "detalle") && (
                <button
                  onClick={mostrarLista}
                  style={{
                    background: 'transparent', border: '1px solid #F5C81B', color: '#F5C81B', fontSize: '16px',
                    cursor: 'pointer', padding: '8px 12px', borderRadius: '6px', display: 'flex', alignItems: 'center'
                  }}
                >
                  <FaArrowLeft size={16} />
                </button>
              )}
              <div>
                <h1 style={{ color: "#fff", fontSize: "24px", fontWeight: "700", margin: 0 }}>
                  {modoVista === "lista" && "Ventas"}
                  {modoVista === "formulario" && "Registrar Venta"}
                  {modoVista === "detalle" && `Detalles Venta ${ventaViendo?.id}`}
                </h1>
                <p style={{ color: "#9CA3AF", fontSize: "14px", margin: "4px 0 0 0" }}>
                   {modoVista === "lista" && "Gestión de ventas y compras de clientes"}
                   {modoVista === "formulario" && "Ingrese los datos de la venta y suba el comprobante de pago"}
                   {modoVista === "detalle" && "Revisión de venta y comprobante de pago"}
                </p>
              </div>
            </div>

            {modoVista === "lista" && (
              <button
                onClick={mostrarFormulario}
                style={{
                  padding: "8px 16px", backgroundColor: "#F5C81B20", border: "1px solid #F5C81B", color: "#F5C81B",
                  borderRadius: "6px", fontSize: "14px", cursor: "pointer", fontWeight: "700", display: "flex",
                  alignItems: "center", gap: "6px"
                }}
              >
                <FaPlus size={14} /> Registrar Venta
              </button>
            )}

            {modoVista === "formulario" && (
              <button
                onClick={handleCreateVenta}
                style={{
                  padding: "8px 20px", backgroundColor: "#10B981", border: "none", color: "#fff", borderRadius: "6px",
                  fontSize: "14px", cursor: "pointer", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px"
                }}
              >
                <FaSave size={14} /> Guardar Venta
              </button>
            )}
          </div>

          {modoVista === "lista" && (
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <SearchInput
                  value={searchTerm} onChange={setSearchTerm} placeholder="Buscar por cliente o número de venta..."
                  onClear={() => setSearchTerm('')} fullWidth={true}
                  inputStyle={{ border: '1px solid #F5C81B', backgroundColor: '#0a0a0a', color: '#fff', borderRadius: '6px', height: '36px', padding: '0 12px', fontSize: '13px' }}
                />
              </div>
              <StatusFilter filterStatus={filterStatus} onFilterSelect={setFilterStatus} />
            </div>
          )}
        </div>

        {/* CONTENIDO PRINCIPAL */}
        {modoVista === "lista" ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRadius: '8px', border: '1px solid #F5C81B', overflow: 'hidden', backgroundColor: '#000' }}>
            <div style={{ flex: 1, overflow: 'auto' }}>
              <EntityTable 
                entities={filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)} 
                columns={columns} onView={mostrarDetalle} onAnular={v => setAnularModal({ isOpen: true, venta: v })} showAnularButton={true} moduleType="ventas" 
                style={{ border: 'none', borderRadius: '0' }} tableStyle={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }} headerStyle={{ padding: '12px 10px', textAlign: 'left', fontWeight: '700', fontSize: '13px', color: '#F5C81B', borderBottom: '1px solid #F5C81B', backgroundColor: '#151822' }} rowStyle={{ border: 'none', backgroundColor: '#000', '&:hover': { backgroundColor: '#111' } }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", backgroundColor: "#151822", borderTop: '1px solid #F5C81B', fontSize: "13px", color: "#e0e0e0" }}>
              <span>Mostrando {(filtered.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0)}–{Math.min(currentPage * itemsPerPage, filtered.length)} de {filtered.length} ventas</span>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} style={{ background: 'transparent', border: '1px solid #F5C81B', color: currentPage === 1 ? '#6B7280' : '#F5C81B', padding: '6px 14px', borderRadius: '6px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontWeight: '700' }}>‹ Anterior</button>
                <span style={{ fontWeight: '700', color: '#F5C81B' }}>Página {currentPage} de {Math.ceil(filtered.length / itemsPerPage) || 1}</span>
                <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage >= Math.ceil(filtered.length / itemsPerPage)} style={{ background: 'transparent', border: '1px solid #F5C81B', color: currentPage >= Math.ceil(filtered.length / itemsPerPage) ? '#6B7280' : '#F5C81B', padding: '6px 14px', borderRadius: '6px', cursor: currentPage >= Math.ceil(filtered.length / itemsPerPage) ? 'not-allowed' : 'pointer', fontWeight: '700' }}>Siguiente ›</button>
              </div>
            </div>
          </div>
        ) : modoVista === "formulario" ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', flex: 1, overflow: 'auto', paddingBottom: '20px' }}>
            {/* IZQUIERDA: DATOS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px', padding: '20px' }}>
                <h3 style={{ color: '#F5C81B', fontSize: '15px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}><FaUser size={14} /> DATOS DE VENTA</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '6px', display: 'block' }}>CLIENTE <span style={{color: '#ef4444'}}>*</span></label>
                    <input type="text" placeholder="Nombre completo del cliente" value={nuevaVenta.cliente} onChange={(e) => setNuevaVenta({ ...nuevaVenta, cliente: e.target.value })} style={{ backgroundColor: '#1e293b', border: errors.cliente ? '1px solid #ef4444' : '1px solid #334155', borderRadius: '6px', padding: '10px', color: '#fff', width: '100%', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '6px', display: 'block' }}>MÉTODO DE PAGO <span style={{color: '#ef4444'}}>*</span></label>
                    <select value={nuevaVenta.metodoPago} onChange={(e) => {
                      const m = e.target.value;
                      setNuevaVenta(prev => ({ ...prev, metodoPago: m, evidencia: requiresReceipt(m) ? prev.evidencia : null }));
                    }} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '6px', padding: '10px', color: '#fff', width: '100%', outline: 'none' }}>
                      {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '6px', display: 'block' }}>FECHA <span style={{color: '#ef4444'}}>*</span></label>
                    <DateInputWithCalendar value={nuevaVenta.fecha} onChange={(d) => setNuevaVenta({ ...nuevaVenta, fecha: d })} inputStyle={{ border: '1px solid #334155', backgroundColor: '#1e293b', color: '#fff', borderRadius: '6px', padding: '10px', width: '100%' }} />
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px', padding: '20px', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h3 style={{ color: '#F5C81B', fontSize: '15px', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><FaBoxOpen size={14} /> PRODUCTOS</h3>
                  <button onClick={agregarProducto} style={{ background: 'transparent', color: '#10B981', border: '1px solid #10B981', fontSize: '12px', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px' }}><FaPlus size={10} /> AGREGAR</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {nuevaVenta.productos.map((p, i) => (
                    <ProductoForm key={p._tempKey} producto={p} index={i} onChange={actualizarProducto} onRemove={eliminarProducto} isFirst={i === 0} />
                  ))}
                </div>
                <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '2px dashed #334155', textAlign: 'right' }}>
                  <span style={{ fontSize: '14px', color: '#9CA3AF', marginRight: '15px' }}>TOTAL A COBRAR:</span>
                  <span style={{ fontSize: '24px', color: '#10B981', fontWeight: '800' }}>${calcularTotal().toLocaleString('es-CO')}</span>
                </div>
              </div>
            </div>

            {/* DERECHA: EVIDENCIA (COMPROBANTE) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ backgroundColor: '#111', border: errors.evidencia ? '1px solid #ef4444' : '1px solid #333', borderRadius: '12px', padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', opacity: requiresReceipt(nuevaVenta.metodoPago) ? 1 : 0.5, pointerEvents: requiresReceipt(nuevaVenta.metodoPago) ? 'auto' : 'none' }}>
                <h3 style={{ color: '#F5C81B', fontSize: '15px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}><FaCamera size={14} /> COMPROBANTE DE PAGO {requiresReceipt(nuevaVenta.metodoPago) && <span style={{ color: '#ef4444' }}>*</span>}</h3>
                <div style={{ flex: 1, border: '2px dashed #334155', borderRadius: '12px', backgroundColor: '#00000030', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', position: 'relative', overflow: 'hidden' }}>
                  {nuevaVenta.evidencia ? (
                    <>
                      <img src={nuevaVenta.evidencia} alt="Comprobante" style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '8px' }} />
                      <button onClick={() => setNuevaVenta({ ...nuevaVenta, evidencia: null })} style={{ position: 'absolute', top: '15px', right: '15px', backgroundColor: '#ef4444', border: 'none', color: '#fff', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaTrash size={14} /></button>
                    </>
                  ) : (
                    <div style={{ textAlign: 'center' }}>
                      <FaImage size={50} color="#334155" style={{ marginBottom: '20px' }} />
                      <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '20px' }}>
                        {requiresReceipt(nuevaVenta.metodoPago) ? 'Arrastra el comprobante de pago o selecciona un archivo' : 'No se requiere comprobante para este método de pago'}
                      </p>
                      {requiresReceipt(nuevaVenta.metodoPago) && (
                        <label style={{ backgroundColor: '#F5C81B', color: '#000', padding: '10px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: '800', cursor: 'pointer' }}>
                          SUBIR COMPROBANTE
                          <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                        </label>
                      )}
                    </div>
                  )}
                </div>
                {errors.evidencia && <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '15px', textAlign: 'center', fontWeight: '600' }}>El comprobante de pago es obligatorio para {nuevaVenta.metodoPago}.</p>}
              </div>
            </div>
          </div>
        ) : (
          /* MODO VISTA: DETALLE */
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', flex: 1, overflow: 'auto', paddingBottom: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ color: '#F5C81B', fontSize: '15px', fontWeight: '700', margin: 0 }}>Resumen de la Venta</h3>
                  <StatusPill status={ventaViendo?.estado} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#9CA3AF', display: 'block', fontWeight: '700' }}>CLIENTE</span>
                    <div style={{ color: '#fff', fontSize: '15px', fontWeight: '600', marginTop: '4px' }}>{typeof ventaViendo?.cliente === 'object' ? ventaViendo?.cliente?.nombre : ventaViendo?.cliente}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#9CA3AF', display: 'block', fontWeight: '700' }}>MÉTODO DE PAGO</span>
                    <div style={{ color: '#fff', fontSize: '15px', fontWeight: '600', marginTop: '4px' }}>{ventaViendo?.metodoPago}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#9CA3AF', display: 'block', fontWeight: '700' }}>FECHA</span>
                    <div style={{ color: '#fff', fontSize: '15px', fontWeight: '600', marginTop: '4px' }}>{ventaViendo?.fecha}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#9CA3AF', display: 'block', fontWeight: '700' }}>TOTAL</span>
                    <div style={{ color: '#10B981', fontSize: '18px', fontWeight: '800', marginTop: '4px' }}>${calcularTotalViendo().toLocaleString('es-CO')}</div>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px', padding: '20px', flex: 1 }}>
                <h3 style={{ color: '#F5C81B', fontSize: '14px', fontWeight: '700', marginBottom: '20px' }}>Productos Adquiridos</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {ventaViendo?.productos?.map((p, i) => <ProductoForm key={i} producto={p} isViewMode={true} />)}
                </div>
              </div>

              {/* BOTONES DE ACCIÓN (Aprobar/Rechazar) */}
              <div style={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {ventaViendo?.estado === 'Pendiente' && !isRejecting && (
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <button onClick={() => updateVentaStatus('Aprobada')} style={{ flex: 1, padding: '14px', backgroundColor: '#10B98120', border: '1px solid #10B981', color: '#10B981', borderRadius: '8px', cursor: 'pointer', fontWeight: '800', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><FaCheckCircle /> APROBAR VENTA</button>
                    <button onClick={() => setIsRejecting(true)} style={{ flex: 1, padding: '14px', backgroundColor: '#EF444420', border: '1px solid #EF4444', color: '#EF4444', borderRadius: '8px', cursor: 'pointer', fontWeight: '800', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><FaTimesCircle /> RECHAZAR VENTA</button>
                  </div>
                )}
                {isRejecting && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <label style={{ fontSize: '13px', color: '#EF4444', fontWeight: '700' }}>MOTIVO DEL RECHAZO:</label>
                    <textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} placeholder="Motivo por el cual se rechaza el pago..." style={{ backgroundColor: '#0a0a0a', border: '1px solid #EF4444', borderRadius: '8px', padding: '12px', color: '#fff', minHeight: '80px', outline: 'none', resize: 'vertical' }} />
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button onClick={() => { if (!rejectionReason.trim()) { showAlert("Ingrese el motivo", "error"); return; } updateVentaStatus('Rechazada', rejectionReason); }} style={{ flex: 2, padding: '10px', backgroundColor: '#EF4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700' }}>CONFIRMAR RECHAZO</button>
                      <button onClick={() => { setIsRejecting(false); setRejectionReason(''); }} style={{ flex: 1, padding: '10px', backgroundColor: 'transparent', border: '1px solid #94a3b8', color: '#94a3b8', borderRadius: '6px', cursor: 'pointer', fontWeight: '700' }}>CANCELAR</button>
                    </div>
                  </div>
                )}
                {ventaViendo?.estado === 'Rechazada' && (
                  <div style={{ backgroundColor: '#EF444415', border: '1px solid #EF4444', borderRadius: '8px', padding: '15px' }}>
                    <div style={{ fontSize: '12px', color: '#EF4444', fontWeight: '800', marginBottom: '8px' }}>VENTA RECHAZADA - MOTIVO:</div>
                    <div style={{ color: '#fff', fontSize: '14px', lineHeight: '1.4' }}>{ventaViendo?.motivoRechazo}</div>
                  </div>
                )}
                {['Aprobada', 'Entrega pendiente', 'En camino', 'Entregado'].includes(ventaViendo?.estado) && (
                  <div style={{ backgroundColor: '#10B98115', border: '1px solid #10B981', borderRadius: '8px', padding: '15px' }}>
                    <label style={{ fontSize: '12px', color: '#10B981', fontWeight: '800', display: 'block', marginBottom: '10px' }}>ESTADO DEL ENVÍO:</label>
                    <select value={ventaViendo?.estado === 'Aprobada' ? 'Entrega pendiente' : ventaViendo?.estado} onChange={(e) => updateVentaStatus(e.target.value)} style={{ width: '100%', backgroundColor: '#1e293b', border: '1px solid #10B981', color: '#fff', padding: '10px', borderRadius: '6px', outline: 'none', fontWeight: '600' }}>
                      <option value="Entrega pendiente">Pendiente de Despacho</option>
                      <option value="En camino">En Camino (Enviado)</option>
                      <option value="Entregado">Pedido Entregado</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Comprobante */}
            {requiresReceipt(ventaViendo?.metodoPago) ? (
              <div style={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column' }}>
                 <h3 style={{ color: '#F5C81B', fontSize: '14px', fontWeight: '700', marginBottom: '20px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}><FaCamera size={16} /> Comprobante de Pago</h3>
                 <div style={{ flex: 1, backgroundColor: '#000', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #334155' }}>
                    <img src={ventaViendo?.evidencia || 'https://via.placeholder.com/400x300/1E293B/FFC107?text=SIN+COMPROBANTE'} alt="Comprobante" style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' }} />
                 </div>
              </div>
            ) : (
              <div style={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
                 <FaImage size={60} color="#334155" style={{ marginBottom: '15px' }} />
                 <h3 style={{ color: '#9CA3AF', fontSize: '14px', fontWeight: '700', margin: 0 }}>Sin Comprobante Requerido</h3>
                 <p style={{ color: '#6B7280', fontSize: '12px', marginTop: '5px', textAlign: 'center' }}>El método de pago ({ventaViendo?.metodoPago}) no maneja comprobante fotográfico.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <AnularOperacionModal 
        isOpen={anularModal.isOpen} onClose={() => setAnularModal({ isOpen: false, venta: null })} 
        onConfirm={handleAnularVenta} operationType="venta" operationData={anularModal.venta}
      />
    </>
  );
};

export default VentasPage;