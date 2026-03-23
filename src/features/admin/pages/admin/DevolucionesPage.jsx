// src/pages/admin/DevolucionesPage.jsx
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { initialReturns, initialProducts, initialSuppliers, initialCustomers } from '../../../../data';
import EntityTable from '../../components/EntityTable';
import Alert from '../../../../shared/components/Alert';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';
import SearchInput from '../../../../shared/components/SearchInput';
import { 
  FaArrowLeft, 
  FaPlus, 
  FaTrash, 
  FaSave, 
  FaEye, 
  FaExchangeAlt,
  FaCamera,
  FaCheckCircle,
  FaTimesCircle,
  FaFileInvoice,
  FaUser,
  FaBoxOpen,
  FaImage
} from "react-icons/fa";

// =============================================
// COMPONENTE StatusPill
// =============================================
const StatusPill = React.memo(function StatusPill({ status }) {
  const getColorForStatus = (status) => {
    switch (status?.toLowerCase()) {
      case 'aprobada': return '#10B981';
      case 'rechazada': return '#EF4444';
      case 'pendiente': return '#F5C81B';
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
          {['Todos', 'Pendiente', 'Aprobada', 'Rechazada'].map(status => (
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
// PÁGINA PRINCIPAL DevolucionesPage
// =============================================
const DevolucionesPage = () => {
  const [modoVista, setModoVista] = useState("lista"); // "lista", "formulario", "detalle"
  const [devoluciones, setDevoluciones] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
  const [errors, setErrors] = useState({});
  const [devolucionViendo, setDevolucionViendo] = useState(null);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const [formData, setFormData] = useState({
    cliente: '',
    productoOriginalId: '',
    productoCambioId: '',
    mismoModelo: false,
    motivo: '',
    evidencia: null, // Base64 or URL
    fecha: new Date().toLocaleDateString('es-CO'),
    estado: 'Pendiente',
    motivoRechazo: ''
  });

  useEffect(() => {
    const dataMapped = initialReturns.map((d, i) => {
      const prodOrig = initialProducts.find(p => p.id === d.IdProducto);
      const prodCambio = d.IdProductoCambio ? initialProducts.find(p => p.id === d.IdProductoCambio) : prodOrig;
      return {
        id: `DEV-${1000 + i}`,
        cliente: initialCustomers[i % initialCustomers.length]?.Nombre || 'Cliente Genérico',
        productoOriginal: prodOrig?.nombre || 'Producto Desconocido',
        productoOriginalId: d.IdProducto,
        productoCambio: prodCambio?.nombre || 'Producto Desconocido',
        productoCambioId: d.IdProductoCambio || d.IdProducto,
        precio: prodOrig?.precio || 0,
        motivo: d.Motivo || 'Garantía',
        fecha: d.Fecha || new Date().toLocaleDateString('es-CO'),
        estado: d.Estado || 'Pendiente',
        evidencia: 'https://via.placeholder.com/150/000000/F5C81B?text=EVIDENCIA',
        motivoRechazo: d.MotivoRechazo || ''
      };
    });
    setDevoluciones(dataMapped);
  }, []);

  const showAlert = useCallback((message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 3000);
  }, []);

  const mostrarLista = () => {
    setModoVista("lista");
    setDevolucionViendo(null);
    setIsRejecting(false);
    setRejectionReason('');
  };

  const mostrarFormulario = () => {
    setFormData({
      cliente: '',
      productoOriginalId: '',
      productoCambioId: '',
      mismoModelo: false,
      motivo: '',
      evidencia: null,
      fecha: new Date().toLocaleDateString('es-CO'),
      estado: 'Pendiente',
      motivoRechazo: ''
    });
    setErrors({});
    setModoVista("formulario");
  };

  const mostrarDetalle = (devolucion) => {
    setDevolucionViendo(devolucion);
    setIsRejecting(false);
    setRejectionReason('');
    setModoVista("detalle");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, evidencia: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getPrice = (id) => initialProducts.find(p => String(p.id) === String(id))?.precio || 0;

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const e_fields = {};
    
    if (!formData.cliente) e_fields.cliente = true;
    if (!formData.productoOriginalId) e_fields.prodOrig = true;
    if (!formData.mismoModelo && !formData.productoCambioId) e_fields.prodCambio = true;
    if (!formData.motivo) e_fields.motivo = true;
    if (!formData.evidencia) e_fields.evidencia = true;

    // Validación de precios
    if (!formData.mismoModelo && formData.productoOriginalId && formData.productoCambioId) {
      if (getPrice(formData.productoOriginalId) !== getPrice(formData.productoCambioId)) {
        e_fields.price_mismatch = true;
      }
    }

    if (Object.keys(e_fields).length > 0) {
      setErrors(e_fields);
      if (e_fields.price_mismatch) showAlert("Los precios de los productos deben coincidir", "error");
      else if (e_fields.evidencia) showAlert("La imagen de evidencia es obligatoria", "error");
      else showAlert("Por favor complete los campos obligatorios", "error");
      return;
    }

    const prodOrig = initialProducts.find(p => String(p.id) === String(formData.productoOriginalId));
    const prodCambio = formData.mismoModelo ? prodOrig : initialProducts.find(p => String(p.id) === String(formData.productoCambioId));

    const nuevaDevData = {
      id: `DEV-${Date.now().toString().slice(-4)}`,
      cliente: formData.cliente,
      productoOriginal: prodOrig.nombre,
      productoOriginalId: formData.productoOriginalId,
      productoCambio: prodCambio.nombre,
      productoCambioId: prodCambio.id,
      precio: prodOrig.precio,
      motivo: formData.motivo,
      fecha: formData.fecha,
      estado: 'Pendiente',
      evidencia: formData.evidencia,
      motivoRechazo: ''
    };

    setDevoluciones(prev => [nuevaDevData, ...prev]);
    showAlert("Devolución registrada correctamente");
    mostrarLista();
  };

  const updateStatus = (status, reason = '') => {
    setDevoluciones(prev => prev.map(d => 
      d.id === devolucionViendo.id ? { ...d, estado: status, motivoRechazo: reason || d.motivoRechazo } : d
    ));
    setDevolucionViendo(prev => ({ ...prev, estado: status, motivoRechazo: reason || prev.motivoRechazo }));
    showAlert(`Devolución ${status.toLowerCase()} correctamente`);
    if (status === 'Rechazada') setIsRejecting(false);
  };

  const filtered = devoluciones.filter(d => {
    const searchString = (d.cliente + d.id + d.productoOriginal).toLowerCase();
    const matchesSearch = searchString.includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'Todos' || d.estado === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    { header: 'ID', field: 'id', render: (item) => <span style={{ color: '#F5C81B', fontWeight: '700' }}>{item.id}</span> },
    { header: 'Cliente', field: 'cliente', render: (item) => <span style={{ color: '#fff' }}>{item.cliente}</span> },
    { header: 'Producto Original', field: 'productoOriginal', render: (item) => <span style={{ color: '#fff', fontSize: '12px' }}>{item.productoOriginal}</span> },
    { header: 'Valor', field: 'precio', render: (item) => <span style={{ color: '#10B981', fontWeight: '700' }}>${item.precio.toLocaleString()}</span> },
    { header: 'Estado', field: 'estado', render: (item) => <StatusPill status={item.estado} /> }
  ];

  return (
    <>
      {alert.show && <Alert message={alert.message} type={alert.type} onClose={() => setAlert({ show: false, message: '', type: 'success' })} />}
      
      <div style={{ display: "flex", flexDirection: "column", padding: "4px 16px 0 16px", flex: 1, height: "100%" }}>
        
        {/* HEADER */}
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
                  {modoVista === "lista" && "Devoluciones"}
                  {modoVista === "formulario" && "Registrar Devolución"}
                  {modoVista === "detalle" && "Detalle de Devolución"}
                </h1>
                <p style={{ color: "#9CA3AF", fontSize: "14px", margin: "4px 0 0 0" }}>
                   {modoVista === "lista" && "Gestión de garantías y cambios de producto"}
                   {modoVista === "formulario" && "Ingrese los datos del producto y la evidencia necesaria"}
                   {modoVista === "detalle" && "Revisión de solicitud de devolución"}
                </p>
              </div>
            </div>

            {modoVista === "lista" && (
              <button
                onClick={mostrarFormulario}
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
                Nueva Solicitud
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
                Guardar Solicitud
              </button>
            )}
          </div>

          {modoVista === "lista" && (
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <SearchInput
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Buscar por cliente, ID o producto..."
                  onClear={() => setSearchTerm('')}
                  fullWidth={true}
                  inputStyle={{
                    border: '1px solid #F5C81B',
                    backgroundColor: '#0a0a0a',
                    color: '#fff',
                    borderRadius: '6px',
                    height: '36px',
                    padding: '0 12px',
                    fontSize: '13px'
                  }}
                />
              </div>
              <StatusFilter filterStatus={filterStatus} onFilterSelect={setFilterStatus} />
            </div>
          )}
        </div>

        {/* CONTENIDO PRINCIPAL */}
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
                moduleType="generic"
                style={{ border: 'none' }}
                headerStyle={{
                  padding: '10px 4px',
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
                  style={{ background: 'transparent', border: '1px solid #F5C81B', color: currentPage === 1 ? '#6B7280' : '#F5C81B', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer' }}
                >
                  ‹
                </button>
                <span style={{ color: '#F5C81B', fontWeight: 'bold' }}>{currentPage}</span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filtered.length/itemsPerPage)))}
                  disabled={currentPage >= Math.ceil(filtered.length / itemsPerPage)}
                  style={{ background: 'transparent', border: '1px solid #F5C81B', color: currentPage >= Math.ceil(filtered.length / itemsPerPage) ? '#6B7280' : '#F5C81B', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer' }}
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        ) : modoVista === "formulario" ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', flex: 1, overflow: 'auto' }}>
            {/* PANEL IZQUIERDO: Información */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px', padding: '20px' }}>
                <h3 style={{ color: '#F5C81B', fontSize: '15px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaUser size={14} /> DATOS GENERALES
                </h3>
                
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '6px', display: 'block' }}>CLIENTE <span style={{ color: '#ef4444' }}>*</span></label>
                  <select
                    value={formData.cliente}
                    onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                    style={{ backgroundColor: '#1e293b', border: errors.cliente ? '1px solid #ef4444' : '1px solid #334155', borderRadius: '6px', padding: '10px', color: '#fff', width: '100%', outline: 'none' }}
                  >
                    <option value="">Seleccionar cliente...</option>
                    {initialCustomers.map(c => <option key={c.IdCliente} value={c.Nombre}>{c.Nombre}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '6px', display: 'block' }}>MOTIVO DE DEVOLUCIÓN <span style={{ color: '#ef4444' }}>*</span></label>
                  <textarea
                    value={formData.motivo}
                    onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                    placeholder="Describa el motivo detallado..."
                    style={{ backgroundColor: '#1e293b', border: errors.motivo ? '1px solid #ef4444' : '1px solid #334155', borderRadius: '6px', padding: '10px', color: '#fff', width: '100%', outline: 'none', minHeight: '80px', resize: 'vertical' }}
                  />
                </div>
              </div>

              <div style={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px', padding: '20px', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ color: '#F5C81B', fontSize: '15px', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaExchangeAlt size={14} /> PRODUCTOS EN PROCESO
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label style={{ color: '#F5C81B', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}>MISMO MODELO</label>
                    <input
                      type="checkbox"
                      checked={formData.mismoModelo}
                      onChange={(e) => setFormData({ ...formData, mismoModelo: e.target.checked })}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Producto 1 */}
                  <div>
                    <label style={{ fontSize: '12px', color: '#10B981', marginBottom: '6px', display: 'block', fontWeight: '600' }}>PRODUCTO A DEVOLVER <span style={{ color: '#ef4444' }}>*</span></label>
                    <select
                      value={formData.productoOriginalId}
                      onChange={(e) => setFormData({ ...formData, productoOriginalId: e.target.value })}
                      style={{ backgroundColor: '#1e293b', border: errors.prodOrig ? '1px solid #ef4444' : '1px solid #334155', borderRadius: '6px', padding: '10px', color: '#fff', width: '100%', outline: 'none' }}
                    >
                      <option value="">Seleccionar producto original...</option>
                      {initialProducts.map(p => <option key={p.id} value={p.id}>{p.nombre} (${p.precio.toLocaleString()})</option>)}
                    </select>
                  </div>

                  {/* Icono Cambio */}
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <FaExchangeAlt size={20} color="#F5C81B" style={{ opacity: 0.5 }} />
                  </div>

                  {/* Producto 2 */}
                  {!formData.mismoModelo && (
                    <div>
                      <label style={{ fontSize: '12px', color: '#F5C81B', marginBottom: '6px', display: 'block', fontWeight: '600' }}>PRODUCTO DE REEMPLAZO <span style={{ color: '#ef4444' }}>*</span></label>
                      <select
                        value={formData.productoCambioId}
                        onChange={(e) => setFormData({ ...formData, productoCambioId: e.target.value })}
                        style={{ backgroundColor: '#1e293b', border: errors.prodCambio || errors.price_mismatch ? '1px solid #ef4444' : '1px solid #334155', borderRadius: '6px', padding: '10px', color: '#fff', width: '100%', outline: 'none' }}
                      >
                        <option value="">Seleccionar producto de cambio...</option>
                        {initialProducts.map(p => <option key={p.id} value={p.id}>{p.nombre} (${p.precio.toLocaleString()})</option>)}
                      </select>
                      {errors.price_mismatch && (
                        <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '5px' }}>⚠ Los precios deben ser iguales</p>
                      )}
                    </div>
                  )}

                  {formData.mismoModelo && (
                    <div style={{ backgroundColor: '#1e293b', border: '1px dashed #F5C81B', borderRadius: '6px', padding: '15px', textAlign: 'center' }}>
                      <p style={{ color: '#F5C81B', fontSize: '13px', margin: 0, fontWeight: '600' }}>
                        Se aplicará el cambio por el mismo producto seleccionado arriba.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* PANEL DERECHO: Evidencia */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ 
                backgroundColor: '#111', 
                border: errors.evidencia ? '1px solid #ef4444' : '1px solid #333', 
                borderRadius: '12px', 
                padding: '20px', 
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
              }}>
                <h3 style={{ color: '#F5C81B', fontSize: '15px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaCamera size={14} /> EVIDENCIA FOTOGRÁFICA <span style={{ color: '#ef4444' }}>*</span>
                </h3>

                <div style={{ 
                  flex: 1, 
                  border: '2px dashed #334155', 
                  borderRadius: '12px', 
                  backgroundColor: '#00000030',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {formData.evidencia ? (
                    <>
                      <img src={formData.evidencia} alt="Evidencia" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }} />
                      <button 
                        onClick={() => setFormData({ ...formData, evidencia: null })}
                        style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: '#ef4444', border: 'none', color: '#fff', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <FaTrash size={12} />
                      </button>
                    </>
                  ) : (
                    <div style={{ textAlign: 'center' }}>
                      <FaImage size={40} color="#334155" style={{ marginBottom: '15px' }} />
                      <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '15px' }}>Arrastra una imagen o selecciona un archivo</p>
                      <label style={{ 
                        backgroundColor: '#F5C81B', color: '#000', padding: '8px 20px', borderRadius: '6px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' 
                      }}>
                        SUBIR IMAGEN
                        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                      </label>
                    </div>
                  )}
                </div>
                {errors.evidencia && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '10px', textAlign: 'center' }}>Debes adjuntar una imagen de evidencia para continuar</p>}
              </div>
            </div>
          </div>
        ) : (
          /* MODO VISTA: DETALLE */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, overflow: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {/* Info General */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                 <div style={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px', padding: '20px' }}>
                    <h3 style={{ color: '#F5C81B', fontSize: '14px', fontWeight: '700', marginBottom: '20px', textTransform: 'uppercase' }}>Resumen de Solicitud</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div>
                        <span style={{ fontSize: '11px', color: '#9CA3AF', display: 'block' }}>CLIENTE</span>
                        <div style={{ color: '#fff', fontSize: '15px', fontWeight: '600', marginTop: '4px' }}>{devolucionViendo?.cliente}</div>
                      </div>
                      <div>
                        <span style={{ fontSize: '11px', color: '#9CA3AF', display: 'block' }}>ESTADO</span>
                        <div style={{ marginTop: '4px' }}><StatusPill status={devolucionViendo?.estado} /></div>
                      </div>
                      <div style={{ gridColumn: 'span 2' }}>
                        <span style={{ fontSize: '11px', color: '#9CA3AF', display: 'block' }}>MOTIVO INFORMADO</span>
                        <div style={{ color: '#fff', fontSize: '13px', marginTop: '4px', lineHeight: '1.4' }}>{devolucionViendo?.motivo}</div>
                      </div>
                    </div>
                 </div>

                 <div style={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <div style={{ flex: 1 }}>
                          <span style={{ fontSize: '11px', color: '#10B981', fontWeight: '700' }}>ENTREGA</span>
                          <div style={{ color: '#fff', fontSize: '13px', marginTop: '4px' }}>{devolucionViendo?.productoOriginal}</div>
                       </div>
                       <div style={{ px: '15px' }}>
                          <FaExchangeAlt size={16} color="#F5C81B" style={{ opacity: 0.5 }} />
                       </div>
                       <div style={{ flex: 1, textAlign: 'right' }}>
                          <span style={{ fontSize: '11px', color: '#F5C81B', fontWeight: '700' }}>RECIBE</span>
                          <div style={{ color: '#fff', fontSize: '13px', marginTop: '4px' }}>{devolucionViendo?.productoCambio}</div>
                       </div>
                    </div>
                    <div style={{ borderTop: '1px solid #333', marginTop: '15px', paddingTop: '15px', textAlign: 'center' }}>
                       <span style={{ fontSize: '11px', color: '#9CA3AF' }}>VALOR DEL CAMBIO</span>
                       <div style={{ color: '#10B981', fontSize: '24px', fontWeight: '800' }}>${devolucionViendo?.precio.toLocaleString()}</div>
                    </div>
                 </div>
              </div>

              {/* Evidencia */}
              <div style={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column' }}>
                 <h3 style={{ color: '#F5C81B', fontSize: '14px', fontWeight: '700', marginBottom: '20px', textTransform: 'uppercase' }}>Evidencia Fotográfica</h3>
                 <div style={{ flex: 1, backgroundColor: '#000', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={devolucionViendo?.evidencia} alt="Evidencia" style={{ maxWidth: '100%', maxHeight: '400px' }} />
                 </div>
              </div>
            </div>

            {/* BOTONES DE ACCIÓN (Aprobar/Rechazar) */}
            <div style={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {devolucionViendo?.estado === 'Pendiente' && !isRejecting && (
                <div style={{ display: 'flex', gap: '16px' }}>
                   <button 
                     onClick={() => updateStatus('Aprobada')}
                     style={{ flex: 1, height: '48px', backgroundColor: '#10B98120', border: '1px solid #10B981', color: '#10B981', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                   >
                     <FaCheckCircle /> APROBAR SOLICITUD
                   </button>
                   <button 
                     onClick={() => setIsRejecting(true)}
                     style={{ flex: 1, height: '48px', backgroundColor: '#EF444420', border: '1px solid #EF4444', color: '#EF4444', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                   >
                     <FaTimesCircle /> RECHAZAR SOLICITUD
                   </button>
                </div>
              )}

              {isRejecting && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label style={{ fontSize: '13px', color: '#EF4444', fontWeight: '700' }}>INDIQUE EL MOTIVO DEL RECHAZO:</label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Escriba aquí por qué se rechaza esta devolución..."
                    style={{ backgroundColor: '#0a0a0a', border: '1px solid #EF4444', borderRadius: '8px', padding: '15px', color: '#fff', fontSize: '14px', minHeight: '100px', outline: 'none', resize: 'vertical' }}
                  />
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                      onClick={() => {
                        if (!rejectionReason.trim()) {
                          showAlert("Debe ingresar un motivo para rechazar", "error");
                          return;
                        }
                        updateStatus('Rechazada', rejectionReason);
                      }}
                      style={{ flex: 2, height: '40px', backgroundColor: '#EF4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700' }}
                    >
                      CONFIRMAR RECHAZO
                    </button>
                    <button 
                      onClick={() => { setIsRejecting(false); setRejectionReason(''); }}
                      style={{ flex: 1, height: '40px', backgroundColor: 'transparent', border: '1px solid #94a3b8', color: '#94a3b8', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      CANCELAR
                    </button>
                  </div>
                </div>
              )}

              {devolucionViendo?.estado === 'Rechazada' && (
                <div style={{ backgroundColor: '#EF444415', border: '1px solid #EF4444', borderRadius: '8px', padding: '15px' }}>
                   <div style={{ fontSize: '12px', color: '#EF4444', fontWeight: '800', marginBottom: '8px' }}>SOLICITUD RECHAZADA - MOTIVO:</div>
                   <div style={{ color: '#fff', fontSize: '14px', lineHeight: '1.5' }}>{devolucionViendo?.motivoRechazo || 'No se especificó motivo.'}</div>
                </div>
              )}

              {devolucionViendo?.estado === 'Aprobada' && (
                <div style={{ backgroundColor: '#10B98115', border: '1px solid #10B981', borderRadius: '8px', padding: '20px', textAlign: 'center' }}>
                   <FaCheckCircle size={30} color="#10B981" style={{ marginBottom: '10px' }} />
                   <div style={{ fontSize: '16px', color: '#10B981', fontWeight: '800' }}>SOLICITUD APROBADA</div>
                   <p style={{ color: '#9CA3AF', fontSize: '13px', margin: '5px 0 0 0' }}>El stock se ha actualizado correctamente.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DevolucionesPage;