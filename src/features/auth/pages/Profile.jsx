// src/pages/Profile.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { initialProducts } from "../../../data";
import {
  FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCheckCircle,
  FaEdit, FaSave, FaShieldAlt, FaCamera, FaTrash, FaShoppingBag,
  FaExchangeAlt, FaMoneyBill, FaTachometerAlt, FaArrowLeft, FaPlus, FaChevronDown, FaChevronRight,
  FaChevronLeft, FaTimes, FaFileInvoice, FaWindowClose, FaIdCard, FaBox, FaHistory, FaUserCog, FaSearch,
  FaExclamationTriangle
} from "react-icons/fa";
import Footer from "../../../shared/components/Footer";

const Profile = ({ user: propUser, onLogout }) => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState({ open: false, text: "" });
  const [formData, setFormData] = useState({
    documentType: "", documentNumber: "",
    name: "", email: "", phone: "",
    department: "", city: "", address: "",
  });
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [orderQuery, setOrderQuery] = useState("");
  const [returnQuery, setReturnQuery] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const fileInputRef = useRef(null);
  
  // ======= Estados =======
  const [activeTab, setActiveTab] = useState('account'); // 'account' (Dashboard), 'info', 'orders', 'returns'
  const [orderView, setOrderView] = useState('list'); // 'list', 'detail'
  const [returnView, setReturnView] = useState('list'); // 'list', 'detail', 'form'
  
  const [orderStatus, setOrderStatus] = useState('Todos');
  const [returnStatus, setReturnStatus] = useState('Todos');
  
  const [returnFormData, setReturnFormData] = useState({
    replacementProductId: "",
    mismoModelo: false,
    evidence: null,
    reason: ""
  });
  const [returnErrors, setReturnErrors] = useState({});
  const [showReturnForm, setShowReturnForm] = useState(false);
  
  // ======= Estados para Paginación =======
  const [ordersPage, setOrdersPage] = useState(1);
  const [returnsPage, setReturnsPage] = useState(1);
  const ITEMS_PER_PAGE = 4;

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageModalSrc, setImageModalSrc] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const [confirmModal, setConfirmModal] = useState({ open: false, title: "", message: "", onConfirm: null, confirmText: "CONFIRMAR", isDanger: false });

  // ======= Cargar usuario =======
  useEffect(() => {
    // Si viene el propUser, lo usamos
    if (propUser) {
      setUser(propUser);
      setFormData({
        documentType: propUser.DocumentoTipo || propUser.documentType || "",
        documentNumber: propUser.DocumentoNumero || propUser.documentNumber || "",
        name: propUser.Nombre || propUser.name || "",
        email: propUser.Correo || propUser.email || "",
        phone: propUser.Telefono || propUser.phone || "",
        department: propUser.Departamento || propUser.department || "",
        city: propUser.Ciudad || propUser.city || "",
        address: propUser.Direccion || propUser.address || "",
      });
      setAvatarUrl(propUser.avatarUrl || "");
      return;
    }

    // Si no, buscamos en session o localStorage
    const savedUser = sessionStorage.getItem("user") || localStorage.getItem("user");
    if (!savedUser) {
      window.location.href = "/login";
      return;
    }
    try {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setFormData({
        documentType: parsedUser.DocumentoTipo || parsedUser.documentType || "",
        documentNumber: parsedUser.DocumentoNumero || parsedUser.documentNumber || "",
        name: parsedUser.Nombre || parsedUser.name || "",
        email: parsedUser.Correo || parsedUser.email || "",
        phone: parsedUser.Telefono || parsedUser.phone || "",
        department: parsedUser.Departamento || parsedUser.department || "",
        city: parsedUser.Ciudad || parsedUser.city || "",
        address: parsedUser.Direccion || parsedUser.address || "",
      });
      setAvatarUrl(parsedUser.avatarUrl || "");
    } catch (error) {
      console.error("Error parsing user:", error);
      window.location.href = "/login";
    }
  }, [propUser]);

  // Bloquear scroll del fondo cuando hay modales abiertos (solo para políticas de devolución)
  useEffect(() => {
    if (showPolicyModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [showPolicyModal]);

  // Subir al inicio al cambiar de pestaña
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const showTopToast = (text) => {
    setToast({ open: true, text });
    setTimeout(() => setToast({ open: false, text: "" }), 3200);
  };

  const handleEditClick = () => setIsEditing(true);

  const handleSaveClick = () => {
    const updatedUser = {
      ...user,
      DocumentoTipo: formData.documentType, documentType: formData.documentType,
      DocumentoNumero: formData.documentNumber, documentNumber: formData.documentNumber,
      Nombre: formData.name, name: formData.name,
      Correo: formData.email, email: formData.email,
      Telefono: formData.phone, phone: formData.phone,
      Departamento: formData.department, department: formData.department,
      Ciudad: formData.city, city: formData.city,
      Direccion: formData.address, address: formData.address,
      avatarUrl: avatarUrl || "",
    };
    sessionStorage.setItem("user", JSON.stringify(updatedUser));
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditing(false);
    showTopToast("Cambios guardados correctamente.");
  };

  const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  
  const getAvatarInitial = () => {
    const name = (formData.name || user?.Nombre || user?.name || "").trim();
    const email = (formData.email || user?.Correo || user?.email || "").trim();
    if (name) return name.charAt(0).toUpperCase();
    if (email) return email.charAt(0).toUpperCase();
    return "U";
  };
  
  const openFilePicker = () => fileInputRef.current?.click();
  const onPickAvatar = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarUrl(reader.result);
      setShowAvatarMenu(false);
    };
    reader.readAsDataURL(file);
  };
  
  const removeAvatar = () => {
    setConfirmModal({
      open: true,
      title: "Eliminar foto de perfil",
      message: "¿Estás seguro de que deseas eliminar tu foto de perfil actual? Esta acción no se puede deshacer.",
      confirmText: "ELIMINAR",
      isDanger: true,
      onConfirm: () => {
        setAvatarUrl("");
        setShowAvatarMenu(false);
        setConfirmModal(prev => ({ ...prev, open: false }));
        showTopToast("Foto eliminada correctamente.");
      }
    });
  };

  const isAdmin = user?.userType === "admin" || user?.IdRol === 1;

  // ======= Imágenes de Cloudinary =======
  const IMG_NY = "https://res.cloudinary.com/dxc5qqsjd/image/upload/v1762910780/gorraazultodaNY_cyfchf.jpg";
  const IMG_LA = "https://res.cloudinary.com/dxc5qqsjd/image/upload/v1762910786/gorraazulblancoLA_rembf2.jpg";
  const IMG_JORDAN = "https://res.cloudinary.com/dxc5qqsjd/image/upload/v1762988576/gorranegrajordan_arghad.jpg";
  const IMG_HUGO = "https://res.cloudinary.com/dxc5qqsjd/image/upload/v1762987076/gorrahugoboss_ev6z54.jpg";
  const IMG_ROSAS = "https://res.cloudinary.com/dxc5qqsjd/image/upload/v1762914412/gorraconrosas_ko3326.jpg";
  const IMG_CHROME = "https://res.cloudinary.com/dxc5qqsjd/image/upload/v1762957956/gorrablancachromebeart_amqbro.jpg";
  const IMG_MONASTERY = "https://res.cloudinary.com/dxc5qqsjd/image/upload/v1762957919/gorramonasterygris_ij6ksq.jpg";
  const IMG_RECEIPT = "https://res.cloudinary.com/dxc5qqsjd/image/upload/v1773337920/WhatsApp_Image_2026-03-12_at_12.49.25_PM_vryssw.jpg";

  // ======= Datos de Ejemplo =======
  const allOrders = useMemo(() => [], []);

  const allReturns = useMemo(() => [], []);

  const filteredOrders = useMemo(() => {
    const q = orderQuery.toLowerCase();
    return allOrders.filter(o => {
      const matchQuery = o.id.toLowerCase().includes(q) || o.status.toLowerCase().includes(q);
      const matchStatus = orderStatus === 'Todos' || o.status === orderStatus;
      return matchQuery && matchStatus;
    });
  }, [allOrders, orderQuery, orderStatus]);

  const filteredReturns = useMemo(() => {
    const q = returnQuery.toLowerCase();
    return allReturns.filter(r => {
      const matchQuery = r.id.toLowerCase().includes(q) || r.status.toLowerCase().includes(q) || r.productName.toLowerCase().includes(q);
      const matchStatus = returnStatus === 'Todos' || r.status === returnStatus;
      return matchQuery && matchStatus;
    });
  }, [allReturns, returnQuery, returnStatus]);

  const paginatedOrders = filteredOrders.slice((ordersPage - 1) * ITEMS_PER_PAGE, ordersPage * ITEMS_PER_PAGE);
  const paginatedReturns = filteredReturns.slice((returnsPage - 1) * ITEMS_PER_PAGE, returnsPage * ITEMS_PER_PAGE);
  const totalOrderPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const totalReturnPages = Math.ceil(filteredReturns.length / ITEMS_PER_PAGE);

  const openImage = (src) => { if (!src) return; setImageModalSrc(src); setShowImageModal(true); };

  const handleReturnClick = (product, order) => {
    setSelectedProduct({ ...product, orderId: order.id });
    setReturnFormData({ replacementProductId: "", mismoModelo: false, evidence: null, reason: "" });
    setReturnErrors({});
    setShowPolicyModal(true);
  };

  const handleContinueToReturn = () => {
    setShowPolicyModal(false);
    setShowReturnForm(true);
    setReturnView('form');
  };

  const handleReturnImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setReturnFormData(prev => ({ ...prev, evidence: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const getPriceNum = (priceStr) => {
    if (typeof priceStr === 'number') return priceStr;
    const clean = priceStr ? priceStr.toString().replace(/[^0-9]/g, '') : "0";
    return parseInt(clean) || 0;
  };

  const handleReturnSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!returnFormData.reason.trim()) errs.reason = true;
    if (!returnFormData.evidence) errs.evidence = true;
    if (!returnFormData.mismoModelo && !returnFormData.replacementProductId) errs.replacement = true;
    
    if (!errs.replacement && !returnFormData.mismoModelo) {
      const replacement = initialProducts.find(p => String(p.id) === String(returnFormData.replacementProductId));
      const originalPrice = getPriceNum(selectedProduct?.price);
      if (replacement && replacement.precio !== originalPrice) errs.priceMismatch = true;
    }

    if (Object.keys(errs).length > 0) {
      setReturnErrors(errs);
      if (errs.priceMismatch) showTopToast("El precio del nuevo producto debe ser igual al original.");
      else if (errs.evidence) showTopToast("La foto de evidencia es obligatoria.");
      else showTopToast("Completa los campos obligatorios.");
      return;
    }
    setConfirmModal({
      open: true,
      title: "Confirmar Solicitud de Cambio",
      message: "¿Deseas enviar tu solicitud de cambio ahora? Una vez enviada, el equipo de administración revisará la información y no podrás editarla.",
      confirmText: "ENVIAR SOLICITUD",
      onConfirm: () => {
        setShowReturnForm(false);
        setShowSuccessModal(true);
        setConfirmModal(p => ({ ...p, open: false }));
      }
    });
  };



  // ======= Estilos =======
  const boxSearchInput = { height: "36px", width: "200px", padding: "0 12px", borderRadius: "10px", border: "1px solid rgba(255,193,7,0.2)", backgroundColor: "rgba(3,7,18,0.4)", color: "#E5E7EB", outline: "none", fontSize: "0.82rem" };
  const statusBadge = (color) => ({ backgroundColor: `${color}20`, color: color, fontSize: "0.7rem", padding: "4px 12px", borderRadius: "999px", fontWeight: 800, textTransform: "uppercase", border: `1px solid ${color}40`, display: 'inline-flex', alignItems: 'center', gap: '5px' });
  const cardStyle = { backgroundColor: "#111827", borderRadius: "15px", border: "1px solid rgba(255,193,7,0.15)", overflow: "hidden", marginBottom: "1rem" };
  
  const menuButtonStyle = (tab) => ({
    width: "100%",
    padding: "12px 20px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    backgroundColor: activeTab === tab ? "rgba(255,193,7,0.1)" : "transparent",
    color: activeTab === tab ? "#FFC107" : "#94a3b8",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    textAlign: "left",
    fontSize: "0.9rem",
    fontWeight: activeTab === tab ? 700 : 500,
    transition: "all 0.3s ease"
  });

  const sectionHeaderStyle = { 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: "30px",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    paddingBottom: "15px"
  };

  const backButtonStyle = {
    background: 'transparent',
    border: '1px solid #FFC107',
    color: '#FFC107',
    padding: '8px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.85rem',
    fontWeight: 600,
    transition: 'all 0.2s'
  };

  const infoRowStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '20px'
  };

  const labelStyle = { color: "#64748b", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "4px" };
  const valueStyle = { fontSize: "0.95rem", color: "#e2e8f0", fontWeight: '500' };

  if (!user) return <div style={{ color: "#fff", textAlign: "center", padding: "100px" }}>Cargando perfil...</div>;

  return (
    <div className="page-container" style={{ backgroundColor: "#030712", fontFamily: "'Inter', sans-serif", color: "#fff", paddingTop: "90px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px", display: "grid", gridTemplateColumns: "280px 1fr", gap: "40px" }}>
        
        {/* PERFIL IZQUIERDA */}
        <aside>
          <div style={{ ...cardStyle, padding: "30px 20px", textAlign: "center", position: "relative" }}>
            {isAdmin && (
              <button 
                onClick={() => window.location.href = "/admin/AdminDashboard"} 
                style={{ position: "absolute", top: "15px", left: "15px", backgroundColor: "#FFC107", color: "#000", border: "none", borderRadius: "8px", padding: "4px 8px", fontSize: "0.7rem", fontWeight: 800, cursor: "pointer" }}
              >
                <FaTachometerAlt /> DASHBOARD
              </button>
            )}
            
            <div style={{ position: "relative", width: "120px", height: "120px", margin: "0 auto 20px" }}>
              <div style={{ width: "100%", height: "100%", borderRadius: "50%", backgroundColor: "rgba(255,193,7,0.1)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: "4px solid rgba(255,193,7,0.2)", boxShadow: '0 0 20px rgba(255,193,7,0.1)' }}>
                {avatarUrl ? (
                  <img src={avatarUrl} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ fontSize: "3rem", fontWeight: 800, color: "#FFC107" }}>{getAvatarInitial()}</span>
                )}
              </div>
              <button 
                onClick={() => setShowAvatarMenu(!showAvatarMenu)} 
                style={{ position: "absolute", bottom: "5px", right: "5px", backgroundColor: "#1f2937", color: "#FFC107", border: "1px solid #FFC107", borderRadius: "50%", width: "36px", height: "36px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", boxShadow: '0 4px 10px rgba(0,0,0,0.3)', zIndex: 10 }}
              >
                <FaCamera size={16} />
              </button>
              
              {showAvatarMenu && (
                <>
                  <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 50 }} onClick={() => setShowAvatarMenu(false)} />
                  <div style={{ position: "absolute", top: "100%", right: 0, marginTop: "10px", width: "200px", backgroundColor: "#1f2937", border: "1px solid rgba(255,193,7,0.2)", borderRadius: "12px", padding: "8px", boxShadow: "0 10px 25px rgba(0,0,0,0.5)", zIndex: 100, overflow: 'hidden' }}>
                    <button 
                      onClick={openFilePicker} 
                      style={{ width: "100%", padding: "10px 15px", display: "flex", alignItems: "center", gap: "10px", backgroundColor: "transparent", color: "#e2e8f0", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "0.85rem", transition: "all 0.2s", textAlign: 'left' }}
                      onMouseEnter={e => e.target.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                      onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}
                    >
                      <FaPlus size={12} color="#FFC107" /> Cambiar foto de perfil
                    </button>
                    {avatarUrl && (
                      <button 
                        onClick={removeAvatar} 
                        style={{ width: "100%", padding: "10px 15px", display: "flex", alignItems: "center", gap: "10px", backgroundColor: "transparent", color: "#ef4444", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "0.85rem", transition: "all 0.2s", textAlign: 'left' }}
                        onMouseEnter={e => e.target.style.backgroundColor = 'rgba(239,68,68,0.1)'}
                        onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}
                      >
                        <FaTrash size={12} /> Eliminar foto de perfil
                      </button>
                    )}
                  </div>
                </>
              )}
              <input ref={fileInputRef} type="file" onChange={onPickAvatar} style={{ display: "none" }} accept="image/*" />
            </div>
            
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, margin: "0 0 5px" }}>{formData.name || "Usuario"}</h2>
            <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: "0" }}>
              {user?.Rol || user?.rol || "Cliente"}
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <button onClick={() => { setActiveTab('account'); setOrderView('list'); setReturnView('list'); }} style={menuButtonStyle('account')}>
              <FaShieldAlt style={{ opacity: activeTab === 'account' ? 1 : 0.6 }} /> Mi Cuenta
            </button>
            <button onClick={() => { setActiveTab('info'); setOrderView('list'); setReturnView('list'); }} style={menuButtonStyle('info')}>
              <FaIdCard style={{ opacity: activeTab === 'info' ? 1 : 0.6 }} /> Información Personal
            </button>
            <button onClick={() => { setActiveTab('orders'); setOrderView('list'); setReturnView('list'); }} style={menuButtonStyle('orders')}>
              <FaShoppingBag style={{ opacity: activeTab === 'orders' ? 1 : 0.6 }} /> Mis Pedidos
            </button>
            <button onClick={() => { setActiveTab('returns'); setOrderView('list'); setReturnView('list'); }} style={menuButtonStyle('returns')}>
              <FaExchangeAlt style={{ opacity: activeTab === 'returns' ? 1 : 0.6 }} /> Devoluciones
            </button>
            <div style={{ marginTop: "auto", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              <button 
                onClick={() => setConfirmModal({
                  open: true,
                  title: "Cerrar Sesión",
                  message: "¿Estás seguro de que deseas cerrar tu sesión actual?",
                  confirmText: "CERRAR SESIÓN",
                  isDanger: true,
                  onConfirm: () => onLogout()
                })} 
                style={{ ...menuButtonStyle('logout'), backgroundColor: "rgba(239,68,68,0.05)", color: "#ef4444" }}
                onMouseEnter={e => e.target.style.backgroundColor = 'rgba(239,68,68,0.1)'}
                onMouseLeave={e => e.target.style.backgroundColor = 'rgba(239,68,68,0.05)'}
              >
                <FaWindowClose /> Cerrar Sesión
              </button>
            </div>
          </div>
        </aside>

        {/* DERECHA CONTENIDO */}
        <main>
          {activeTab === 'account' && (
            <div style={{ padding: "0" }}>
              <div style={{ marginBottom: "35px" }}>
                <h2 style={{ fontSize: "2rem", fontWeight: 800, margin: "0 0 30px" }}>Resumen de cuenta</h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                  <div style={{ ...cardStyle, padding: '25px', display: 'flex', alignItems: 'center', gap: '20px', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                    <div style={{ backgroundColor: '#FFC107', padding: '12px', borderRadius: '12px' }}>
                      <FaBox size={24} color="#000" />
                    </div>
                    <div>
                      <label style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Pedidos Realizados</label>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{allOrders.length} Totales</div>
                    </div>
                  </div>
                  <div style={{ ...cardStyle, padding: '25px', display: 'flex', alignItems: 'center', gap: '20px', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                    <div style={{ backgroundColor: '#ef4444', padding: '12px', borderRadius: '12px' }}>
                      <FaHistory size={24} color="#fff" />
                    </div>
                    <div>
                      <label style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Devoluciones</label>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{allReturns.filter(r => r.status === 'Pendiente').length} En curso</div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
                  {/* Bloque Perfil */}
                  <div style={{ ...cardStyle, padding: '25px', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h4 style={{ margin: 0, fontWeight: 800, fontSize: '1.1rem' }}>Perfil</h4>
                      <FaUser color="#FFC107" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      <div>
                        <label style={labelStyle}>Email</label>
                        <div style={valueStyle}>{formData.email}</div>
                      </div>
                      <div>
                        <label style={labelStyle}>Teléfono</label>
                        <div style={valueStyle}>{formData.phone}</div>
                      </div>
                      <div>
                        <label style={labelStyle}>Dirección</label>
                        <div style={valueStyle}>{formData.address || "No especificada"}</div>
                      </div>
                      <button 
                        onClick={() => setActiveTab('info')} 
                        style={{ background: 'none', border: 'none', color: '#FFC107', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', textAlign: 'left', padding: 0, marginTop: '10px', textDecoration: 'underline' }}
                      >
                        Editar perfil
                      </button>
                    </div>
                  </div>

                  {/* Bloque Últimos Pedidos */}
                  <div style={{ ...cardStyle, padding: '25px', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h4 style={{ margin: 0, fontWeight: 800, fontSize: '1.1rem' }}>Últimos Pedidos</h4>
                      <FaShoppingBag color="#FFC107" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {allOrders.slice(0, 2).map(o => (
                        <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <span style={{ fontSize: '0.9rem', color: '#e2e8f0' }}>{o.id} - {o.date}</span>
                          <span style={{ fontSize: '0.7rem', padding: '3px 10px', borderRadius: '50px', backgroundColor: `${o.statusColor}20`, color: o.statusColor, fontWeight: 800 }}>{o.status}</span>
                        </div>
                      ))}
                      <button 
                        onClick={() => setActiveTab('orders')} 
                        style={{ background: 'none', border: 'none', color: '#FFC107', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', textAlign: 'left', padding: 0, marginTop: '10px', textDecoration: 'underline' }}
                      >
                        Ver todos los pedidos
                      </button>
                    </div>
                  </div>

                  {/* Bloque Devoluciones */}
                  <div style={{ ...cardStyle, padding: '25px', backgroundColor: 'rgba(255,255,255,0.02)', gridColumn: 'span 2' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h4 style={{ margin: 0, fontWeight: 800, fontSize: '1.1rem' }}>Devoluciones</h4>
                      <FaExchangeAlt color="#FFC107" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {allReturns.slice(0, 2).map(r => (
                        <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <span style={{ fontSize: '0.95rem', color: '#e2e8f0' }}>{r.productName}</span>
                          <span style={{ fontSize: '0.75rem', padding: '4px 12px', borderRadius: '50px', backgroundColor: `${r.statusColor}20`, color: r.statusColor, fontWeight: 800 }}>{r.status}</span>
                        </div>
                      ))}
                      <button 
                        onClick={() => setActiveTab('returns')} 
                        style={{ background: 'none', border: 'none', color: '#FFC107', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', textAlign: 'left', padding: 0, marginTop: '15px', textDecoration: 'underline' }}
                      >
                        Ver devoluciones
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'info' && (
            <div style={{ ...cardStyle, padding: "35px" }}>
              <div style={sectionHeaderStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <FaIdCard color="#FFC107" size={20} />
                  <h3 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 800 }}>Información Personal</h3>
                </div>
                {!isEditing && (
                  <button 
                    onClick={handleEditClick} 
                    style={{ padding: "8px 25px", borderRadius: "8px", backgroundColor: "#FFC107", color: "#000", border: "none", fontWeight: 800, cursor: "pointer", fontSize: "0.85rem" }}
                  >
                    Editar datos
                  </button>
                )}
              </div>

              {isEditing ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                    {[
                      { label: "Tipo de Documento", name: "documentType", value: formData.documentType, isSelect: true, options: ["Cédula de Ciudadanía", "Tarjeta de Identidad", "Cédula de Extranjería", "NIT", "Pasaporte"] },
                      { label: "Número de Documento", name: "documentNumber", value: formData.documentNumber },
                      { label: "Nombre", name: "name", value: formData.name },
                      { label: "Email (Cuenta)", name: "email", value: formData.email, disabled: true },
                      { label: "Teléfono", name: "phone", value: formData.phone },
                      { label: "Departamento", name: "department", value: formData.department },
                      { label: "Ciudad", name: "city", value: formData.city },
                      { label: "Dirección", name: "address", value: formData.address }
                    ].map((field, i) => (
                      <div key={i} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <label style={{ color: "#64748b", fontSize: "0.75rem" }}>{field.label}</label>
                        {field.isSelect ? (
                          <select 
                            name={field.name} 
                            value={field.value} 
                            onChange={handleChange} 
                            style={{ ...boxSearchInput, width: "100%", height: "36px" }}
                          >
                            <option value="">Seleccione...</option>
                            {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        ) : (
                          <input 
                            name={field.name} 
                            value={field.value} 
                            onChange={handleChange} 
                            style={{ ...boxSearchInput, width: "100%", opacity: field.disabled ? 0.6 : 1 }} 
                            disabled={field.disabled}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: "15px", marginTop: "10px" }}>
                    <button onClick={handleSaveClick} style={{ padding: "10px 30px", borderRadius: "10px", backgroundColor: "#FFC107", color: "#000", border: "none", fontWeight: 800, cursor: "pointer" }}>Guardar Cambios</button>
                    <button onClick={() => setIsEditing(false)} style={{ padding: "10px 30px", borderRadius: "10px", backgroundColor: "rgba(255,255,255,0.05)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", fontWeight: 800, cursor: "pointer" }}>Cancelar</button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px 40px", marginBottom: "50px" }}>
                    {[
                      { label: "Tipo de Documento", value: formData.documentType },
                      { label: "Número de Documento", value: formData.documentNumber },
                      { label: "Nombre completo", value: formData.name },
                      { label: "Correo Electrónico", value: formData.email },
                      { label: "Teléfono", value: formData.phone },
                      { label: "Departamento", value: formData.department },
                      { label: "Ciudad", value: formData.city },
                      { label: "Dirección completa", value: formData.address }
                    ].map((field, i) => (
                      <div key={i}>
                        <label style={labelStyle}>{field.label}</label>
                        <div style={{ ...valueStyle, borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "8px" }}>{field.value || "—"}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "35px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                      <FaUserCog color="#FFC107" />
                      <h4 style={{ margin: 0, fontWeight: 800, fontSize: "1.1rem" }}>Gestión de la cuenta</h4>
                    </div>
                    <div style={{ display: "flex", gap: "15px" }}>
                      <button 
                        onClick={() => setConfirmModal({
                          open: true,
                          title: "Desactivar Cuenta",
                          message: "Tu cuenta será inhabilitada temporalmente. Podrás reactivarla iniciando sesión nuevamente más tarde. ¿Deseas continuar?",
                          confirmText: "DESACTIVAR",
                          isDanger: true,
                          onConfirm: () => { showTopToast("Solicitud de desactivación enviada."); setConfirmModal(p => ({...p, open: false})); }
                        })}
                        style={{ padding: "10px 20px", borderRadius: "8px", backgroundColor: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.2)", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer" }}
                      >
                        Desactivar cuenta
                      </button>
                      <button 
                        onClick={() => setConfirmModal({
                          open: true,
                          title: "Eliminar Cuenta Permanentemente",
                          message: "¡ESTA ACCIÓN ES IRREVERSIBLE! Se borrarán todos tus datos, pedidos e información personal para siempre. ¿Estás ABSOLUTAMENTE seguro?",
                          confirmText: "ELIMINAR PARA SIEMPRE",
                          isDanger: true,
                          onConfirm: () => { showTopToast("Iniciando proceso de eliminación..."); setConfirmModal(p => ({...p, open: false})); }
                        })}
                        style={{ padding: "10px 20px", borderRadius: "8px", backgroundColor: "#ef4444", color: "#fff", border: "none", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer" }}
                      >
                        Eliminar cuenta permanentemente
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div style={cardStyle}>
              {orderView === 'list' ? (
                <>
                   <div style={{ padding: "35px 35px 20px" }}>
                    <div style={sectionHeaderStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <FaShoppingBag color="#FFC107" size={20} />
                        <h3 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 800 }}>Mis Pedidos</h3>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '25px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {['Todos', 'Pendiente', 'Aprobado', 'Rechazado'].map(s => (
                          <button 
                            key={s} 
                            onClick={() => setOrderStatus(s)} 
                            style={{ padding: '8px 16px', borderRadius: '10px', border: 'none', backgroundColor: orderStatus === s ? '#FFC107' : 'transparent', color: orderStatus === s ? '#000' : '#94a3b8', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s' }}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                      <div style={{ position: 'relative' }}>
                        <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={14} />
                        <input 
                          value={orderQuery} 
                          onChange={(e) => setOrderQuery(e.target.value)} 
                          placeholder="Buscar pedido..." 
                          style={{ ...boxSearchInput, width: "240px", paddingLeft: "35px", paddingRight: "30px" }} 
                        />
                        {orderQuery && (
                          <FaTimes 
                            onClick={() => setOrderQuery("")} 
                            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', cursor: 'pointer' }} 
                            size={12} 
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: "0 35px 35px" }}>
                    {paginatedOrders.length > 0 ? (
                      <>
                        {paginatedOrders.map(o => (
                          <div key={o.id} onClick={() => { setSelectedOrder(o); setOrderView('detail'); }} style={{ display: "flex", justifyContent: "space-between", padding: "20px 25px", backgroundColor: "rgba(255,255,255,0.03)", borderRadius: "15px", marginBottom: "12px", cursor: "pointer", border: "1px solid rgba(255,255,255,0.05)", transition: "all 0.2s", alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                              <div style={{ width: '45px', height: '45px', backgroundColor: 'rgba(255,193,7,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <FaShoppingBag color="#FFC107" size={18} />
                              </div>
                              <div>
                                <div style={{ fontWeight: 800, color: "#fff", marginBottom: "5px", fontSize: '1rem' }}>{o.id}</div>
                                <div style={statusBadge(o.statusColor)}><span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: o.statusColor }} /> {o.status}</div>
                              </div>
                            </div>
                            <div style={{ textAlign: "right", fontSize: "0.9rem" }}>
                              <div style={{ fontWeight: 800, color: '#fff', fontSize: '1.2rem', marginBottom: '5px' }}>{o.total}</div>
                              <div style={{ color: "#64748b", fontSize: '0.8rem', fontWeight: 700 }}>{o.date.toUpperCase()}</div>
                            </div>
                          </div>
                        ))}
                        
                        {totalOrderPages > 1 && (
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '25px' }}>
                            <button 
                              onClick={() => setOrdersPage(p => Math.max(1, p - 1))} 
                              disabled={ordersPage === 1}
                              style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'transparent', color: ordersPage === 1 ? '#475569' : '#fff', cursor: ordersPage === 1 ? 'default' : 'pointer' }}
                            >
                              <FaChevronLeft size={12} />
                            </button>
                            {[...Array(totalOrderPages)].map((_, i) => (
                              <button 
                                key={i} 
                                onClick={() => setOrdersPage(i + 1)} 
                                style={{ 
                                  width: '32px', 
                                  height: '32px', 
                                  borderRadius: '8px', 
                                  border: 'none', 
                                  backgroundColor: ordersPage === i + 1 ? '#FFC107' : 'rgba(255,255,255,0.05)', 
                                  color: ordersPage === i + 1 ? '#000' : '#fff', 
                                  fontWeight: 800, 
                                  fontSize: '0.8rem',
                                  cursor: 'pointer' 
                                }}
                              >
                                {i + 1}
                              </button>
                            ))}
                            <button 
                              onClick={() => setOrdersPage(p => Math.min(totalOrderPages, p + 1))} 
                              disabled={ordersPage === totalOrderPages}
                              style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'transparent', color: ordersPage === totalOrderPages ? '#475569' : '#fff', cursor: ordersPage === totalOrderPages ? 'default' : 'pointer' }}
                            >
                              <FaChevronRight size={12} />
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div style={{ color: "#64748b", textAlign: "center", padding: "60px" }}>No se encontraron pedidos.</div>
                    )}
                  </div>
                </>
              ) : (
                <div style={{ padding: "35px" }}>
                  <div style={sectionHeaderStyle}>
                    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                      <button onClick={() => setOrderView('list')} style={backButtonStyle}><FaArrowLeft /> VOLVER</button>
                      <h3 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 800 }}>Pedido {selectedOrder.id}</h3>
                    </div>
                    <div style={statusBadge(selectedOrder.statusColor)}>{selectedOrder.status}</div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <h4 style={{ color: '#FFC107', fontSize: '0.8rem', fontWeight: 800, marginBottom: '20px', textTransform: 'uppercase' }}>Resumen de Pedido</h4>
                        <div style={infoRowStyle}>
                          <div><label style={labelStyle}>Método de Pago</label><div style={valueStyle}>{selectedOrder.paymentMethod}</div></div>
                          <div><label style={labelStyle}>Fecha</label><div style={valueStyle}>{selectedOrder.date}</div></div>
                        </div>
                        <div><label style={labelStyle}>Dirección de Entrega</label><div style={valueStyle}>{selectedOrder.address}</div></div>
                      </div>

                      <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <h4 style={{ color: '#FFC107', fontSize: '0.8rem', fontWeight: 800, marginBottom: '20px', textTransform: 'uppercase' }}>Productos</h4>
                        {selectedOrder.items.map(i => (
                          <div key={i.id} style={{ display: "flex", gap: "15px", padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', alignItems: "center" }}>
                            <img src={i.image} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "10px" }} alt="i" />
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{i.name}</div>
                              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Talla: {i.size} | Cantidad: {i.qty}</div>
                            </div>
                            <div style={{ fontWeight: 800, color: '#FFC107' }}>{i.price}</div>
                            {selectedOrder.status === "Aprobado" && (
                              <button onClick={() => { handleReturnClick(i, selectedOrder); setActiveTab('returns'); }} style={{ backgroundColor: "#ef4444", color: "#fff", border: "none", borderRadius: "8px", padding: "6px 12px", fontSize: "0.7rem", fontWeight: 700, cursor: "pointer" }}>CAMBIAR</button>
                            )}
                          </div>
                        ))}
                        <div style={{ textAlign: 'right', marginTop: '20px', fontSize: '1.2rem', fontWeight: 800 }}>Total: <span style={{ color: '#FFC107' }}>{selectedOrder.total}</span></div>
                      </div>
                    </div>

                    <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', height: 'fit-content' }}>
                      <h4 style={{ color: '#FFC107', fontSize: '0.8rem', fontWeight: 800, marginBottom: '20px', textTransform: 'uppercase' }}>Comprobante de Pago</h4>
                      {selectedOrder.receipt ? (
                        <div onClick={() => openImage(selectedOrder.receipt)} style={{ cursor: 'pointer', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <img src={selectedOrder.receipt} alt="Comprobante" style={{ width: '100%', height: 'auto' }} />
                        </div>
                      ) : <div style={{ color: '#64748b', fontSize: '0.85rem' }}>No se adjuntó comprobante.</div>}
                      
                      {selectedOrder.rejectionReason && (
                        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '10px' }}>
                          <div style={{ color: '#ef4444', fontWeight: 800, fontSize: '0.75rem', marginBottom: '5px' }}>POR QUÉ SE RECHAZÓ:</div>
                          <div style={{ fontSize: '0.85rem', color: '#e2e8f0', lineHeight: 1.5 }}>{selectedOrder.rejectionReason}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'returns' && (
            <div style={cardStyle}>
              {returnView === 'list' ? (
                <>
                   <div style={{ padding: "35px 35px 20px" }}>
                    <div style={sectionHeaderStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <FaExchangeAlt color="#FFC107" size={20} />
                        <h3 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 800 }}>Devoluciones</h3>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '25px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {['Todos', 'Pendiente', 'Aprobado', 'Rechazado'].map(s => (
                          <button 
                            key={s} 
                            onClick={() => setReturnStatus(s)} 
                            style={{ padding: '8px 16px', borderRadius: '10px', border: 'none', backgroundColor: returnStatus === s ? '#FFC107' : 'transparent', color: returnStatus === s ? '#000' : '#94a3b8', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s' }}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                      <div style={{ position: 'relative' }}>
                        <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={14} />
                        <input 
                          value={returnQuery} 
                          onChange={(e) => setReturnQuery(e.target.value)} 
                          placeholder="Buscar devolución..." 
                          style={{ ...boxSearchInput, width: "240px", paddingLeft: "35px", paddingRight: "30px" }} 
                        />
                        {returnQuery && (
                          <FaTimes 
                            onClick={() => setReturnQuery("")} 
                            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', cursor: 'pointer' }} 
                            size={12} 
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: "0 35px 35px" }}>
                    {paginatedReturns.length > 0 ? (
                      <>
                        {paginatedReturns.map(r => (
                          <div key={r.id} onClick={() => { setSelectedReturn(r); setReturnView('detail'); }} style={{ display: "flex", gap: "20px", padding: "18px 25px", backgroundColor: "rgba(255,255,255,0.03)", borderRadius: "15px", marginBottom: "12px", cursor: "pointer", alignItems: "center", border: "1px solid rgba(255,255,255,0.05)" }}>
                            <div style={{ position: 'relative' }}>
                              <img src={r.image} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "12px", border: '1px solid rgba(255,255,255,0.1)' }} alt="p" />
                              <div style={{ position: 'absolute', bottom: '-5px', right: '-5px', backgroundColor: '#111827', borderRadius: '50%', padding: '4px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <FaExchangeAlt size={10} color="#FFC107" />
                              </div>
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 800, fontSize: "1rem", color: "#e2e8f0", marginBottom: '5px' }}>{r.productName}</div>
                              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <div style={statusBadge(r.statusColor)}><span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: r.statusColor }} /> {r.status}</div>
                                <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 700 }}>{r.id.toUpperCase()}</span>
                              </div>
                            </div>
                            <div style={{ textAlign: "right", fontWeight: 800, color: "#FFC107", fontSize: '1.2rem' }}>{r.amount}</div>
                          </div>
                        ))}

                        {totalReturnPages > 1 && (
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '25px' }}>
                            <button 
                              onClick={() => setReturnsPage(p => Math.max(1, p - 1))} 
                              disabled={returnsPage === 1}
                              style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'transparent', color: returnsPage === 1 ? '#475569' : '#fff', cursor: returnsPage === 1 ? 'default' : 'pointer' }}
                            >
                              <FaChevronLeft size={12} />
                            </button>
                            {[...Array(totalReturnPages)].map((_, i) => (
                              <button 
                                key={i} 
                                onClick={() => setReturnsPage(i + 1)} 
                                style={{ 
                                  width: '32px', 
                                  height: '32px', 
                                  borderRadius: '8px', 
                                  border: 'none', 
                                  backgroundColor: returnsPage === i + 1 ? '#FFC107' : 'rgba(255,255,255,0.05)', 
                                  color: returnsPage === i + 1 ? '#000' : '#fff', 
                                  fontWeight: 800, 
                                  fontSize: '0.8rem',
                                  cursor: 'pointer' 
                                }}
                              >
                                {i + 1}
                              </button>
                            ))}
                            <button 
                              onClick={() => setReturnsPage(p => Math.min(totalReturnPages, p + 1))} 
                              disabled={returnsPage === totalReturnPages}
                              style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'transparent', color: returnsPage === totalReturnPages ? '#475569' : '#fff', cursor: returnsPage === totalReturnPages ? 'default' : 'pointer' }}
                            >
                              <FaChevronRight size={12} />
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div style={{ color: "#64748b", textAlign: "center", padding: "60px" }}>No hay devoluciones registradas.</div>
                    )}
                  </div>
                </>
              ) : returnView === 'detail' ? (
                <div style={{ padding: "35px" }}>
                  <div style={sectionHeaderStyle}>
                    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                      <button onClick={() => setReturnView('list')} style={backButtonStyle}><FaArrowLeft /> VOLVER</button>
                      <h3 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 800 }}>Solicitud {selectedReturn.id}</h3>
                    </div>
                    <div style={statusBadge(selectedReturn.statusColor)}>{selectedReturn.status}</div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <h4 style={{ color: '#FFC107', fontSize: '0.8rem', fontWeight: 800, marginBottom: '20px', textTransform: 'uppercase' }}>Resumen de Solicitud</h4>
                        <div style={infoRowStyle}>
                          <div><label style={labelStyle}>Cliente</label><div style={valueStyle}>{formData.name}</div></div>
                          <div><label style={labelStyle}>Fecha</label><div style={valueStyle}>{selectedReturn.date}</div></div>
                        </div>
                        <div><label style={labelStyle}>Motivo Informado</label><div style={{ ...valueStyle, lineHeight: 1.5 }}>{selectedReturn.reason}</div></div>
                      </div>

                      <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ flex: 1 }}>
                            <label style={{ ...labelStyle, color: '#10b981' }}>Entrega</label>
                            <div style={valueStyle}>{selectedReturn.productName}</div>
                          </div>
                          <FaExchangeAlt style={{ opacity: 0.3 }} />
                          <div style={{ flex: 1, textAlign: 'right' }}>
                            <label style={labelStyle}>Recibe</label>
                            <div style={valueStyle}>Mismo Modelo / Reemplazo</div>
                          </div>
                        </div>
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '20px', paddingTop: '20px', textAlign: 'center' }}>
                          <label style={labelStyle}>Valor del Cambio</label>
                          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981' }}>{selectedReturn.amount}</div>
                        </div>
                      </div>

                      {selectedReturn.rejectionReason && (
                        <div style={{ padding: '20px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '15px' }}>
                          <div style={{ color: '#ef4444', fontWeight: 800, fontSize: '0.75rem', marginBottom: '8px' }}>SOLICITUD RECHAZADA - MOTIVO:</div>
                          <div style={{ fontSize: '0.9rem', color: '#e2e8f0', lineHeight: 1.5 }}>{selectedReturn.rejectionReason}</div>
                        </div>
                      )}
                    </div>

                    <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column' }}>
                      <h4 style={{ color: '#FFC107', fontSize: '0.8rem', fontWeight: 800, marginBottom: '20px', textTransform: 'uppercase' }}>Evidencia Fotográfica</h4>
                      <div style={{ flex: 1, backgroundColor: '#000', borderRadius: '12px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src={selectedReturn.image} alt="Evidencia" style={{ maxWidth: '100%', maxHeight: '400px' }} />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* FORMULARIO DE SOLICITUD */
                <div style={{ padding: "35px" }}>
                  <div style={sectionHeaderStyle}>
                    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                      <button onClick={() => setReturnView('list')} style={backButtonStyle}><FaArrowLeft /> CANCELAR</button>
                      <h3 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 800 }}>Solicitar Cambio</h3>
                    </div>
                    <button onClick={handleReturnSubmit} style={{ padding: "10px 30px", borderRadius: "10px", backgroundColor: "#ef4444", color: "#fff", border: "none", fontWeight: 800, cursor: "pointer", fontSize: "0.9rem" }}>ENVIAR SOLICITUD</button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '25px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <h4 style={{ color: '#FFC107', fontSize: '0.75rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}><FaUser /> DATOS DE LA SOLICITUD</h4>
                        <div style={{ marginBottom: '20px' }}>
                          <label style={labelStyle}>Producto a Devolver</label>
                          <div style={{ backgroundColor: "rgba(255,255,255,0.05)", padding: "12px 15px", borderRadius: "8px", marginTop: "8px", fontSize: '0.95rem' }}>{selectedProduct.name} ({selectedProduct.price})</div>
                        </div>
                        <div>
                          <label style={labelStyle}>Motivo de la Devolución <span style={{ color: '#ef4444' }}>*</span></label>
                          <textarea 
                            value={returnFormData.reason} 
                            onChange={e => setReturnFormData({...returnFormData, reason: e.target.value})} 
                            placeholder="Describa el motivo detallado..." 
                            style={{ width: "100%", height: "100px", borderRadius: "10px", padding: "12px", backgroundColor: "#1e293b", color: "#fff", border: returnErrors.reason ? "1px solid #ef4444" : "1px solid #334155", marginTop: '8px', outline: 'none' }} 
                          />
                        </div>
                      </div>

                      <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '25px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                          <h4 style={{ color: '#FFC107', fontSize: '0.75rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><FaExchangeAlt /> PRODUCTO DE REEMPLAZO</h4>
                          <label 
                            onClick={() => setReturnFormData({...returnFormData, mismoModelo: !returnFormData.mismoModelo})}
                            style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "0.85rem", cursor: 'pointer', fontWeight: 600, color: returnFormData.mismoModelo ? '#FFC107' : '#94a3b8', transition: 'all 0.3s' }}
                          >
                            <div 
                              style={{ 
                                width: '24px', 
                                height: '24px', 
                                borderRadius: '8px', 
                                border: returnFormData.mismoModelo ? '2px solid #FFC107' : '2px solid #475569', 
                                backgroundColor: returnFormData.mismoModelo ? '#FFC107' : 'rgba(30,41,59,0.5)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s',
                                boxShadow: returnFormData.mismoModelo ? '0 0 10px rgba(255,193,7,0.3)' : 'none'
                              }}
                            >
                              {returnFormData.mismoModelo && <FaCheckCircle size={16} color="#000" />}
                            </div>
                            <span>Intercambio por el mismo modelo</span>
                          </label>
                        </div>
                        
                        {!returnFormData.mismoModelo ? (
                          <>
                            <select 
                              value={returnFormData.replacementProductId} 
                              onChange={e => setReturnFormData({...returnFormData, replacementProductId: e.target.value})} 
                              style={{ width: "100%", padding: "12px", borderRadius: "10px", backgroundColor: "#1e293b", color: "#fff", border: returnErrors.replacement ? "1px solid #ef4444" : "1px solid #334155", outline: 'none' }}
                            >
                              <option value="">Seleccionar producto de reemplazo...</option>
                              {initialProducts
                                .filter(p => p.precio === getPriceNum(selectedProduct?.price))
                                .map(p => <option key={p.id} value={p.id}>{p.nombre} (${p.precio.toLocaleString()})</option>)
                              }
                            </select>
                            <p style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '10px' }}>* Solo se muestran productos con el mismo precio (${selectedProduct.price})</p>
                          </>
                        ) : (
                          <div style={{ backgroundColor: "rgba(255,193,7,0.05)", border: '1px dashed #FFC107', padding: "15px", borderRadius: "10px", textAlign: 'center', color: '#FFC107', fontSize: '0.9rem' }}>
                            Se solicitará el cambio por el mismo modelo.
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '25px', borderRadius: '15px', border: returnErrors.evidence ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column' }}>
                      <h4 style={{ color: '#FFC107', fontSize: '0.75rem', fontWeight: 800, marginBottom: '20px' }}>EVIDENCIA FOTOGRÁFICA <span style={{ color: '#ef4444' }}>*</span></h4>
                      <div style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)", borderRadius: "15px", border: "2px dashed #334155", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: 'relative' }}>
                        {returnFormData.evidence ? (
                          <>
                            <img src={returnFormData.evidence} style={{ maxWidth: "100%", maxHeight: "100%" }} alt="e" />
                            <button 
                              onClick={() => setReturnFormData({...returnFormData, evidence: null})} 
                              style={{ 
                                position: 'absolute', 
                                top: '12px', 
                                right: '12px', 
                                backgroundColor: 'rgba(239, 68, 68, 0.95)', 
                                backdropFilter: 'blur(8px)',
                                color: '#fff', 
                                border: '1px solid rgba(255,255,255,0.2)', 
                                borderRadius: '12px', 
                                width: '38px', 
                                height: '38px', 
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: '0 8px 20px rgba(239, 68, 68, 0.4)'
                              }}
                              title="Eliminar imagen"
                              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)'}
                              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
                            >
                              <FaTrash size={16} />
                            </button>
                          </>
                        ) : (
                          <label style={{ cursor: "pointer", textAlign: 'center' }}>
                            <FaCamera size={40} color="#334155" style={{ marginBottom: '10px' }} />
                            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Subir imagen</div>
                            <input type="file" onChange={handleReturnImageUpload} style={{ display: "none" }} />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Imagen Modal (Zoom) */}
      {showImageModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.95)", zIndex: 4000, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px" }} onClick={() => setShowImageModal(false)}>
          <button style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><FaTimes size={30} /></button>
          <img src={imageModalSrc} style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: '10px', boxShadow: '0 0 40px rgba(0,0,0,0.5)' }} alt="zoom" onClick={e => e.stopPropagation()} />
        </div>
      )}

      {toast.open && <div style={{ position: "fixed", bottom: "30px", right: "30px", backgroundColor: "#FFC107", color: "#000", padding: "12px 25px", borderRadius: "12px", fontWeight: 800, zIndex: 5000, boxShadow: '0 10px 20px rgba(0,0,0,0.3)' }}>{toast.text}</div>}

      {/* Modal de Éxito para Devoluciones */}
      {showSuccessModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.9)", zIndex: 6000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ backgroundColor: "#111827", maxWidth: "500px", width: "100%", borderRadius: "20px", padding: "40px", textAlign: "center", border: "1px solid rgba(255,193,7,0.3)", boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
            <div style={{ width: "80px", height: "80px", backgroundColor: "rgba(16, 185, 129, 0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 25px", border: "1px solid #10b981" }}>
              <FaCheckCircle color="#10b981" size={40} />
            </div>
            <h3 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: "15px", color: "#fff" }}>¡Solicitud enviada con éxito!</h3>
            <p style={{ color: "#94a3b8", lineHeight: "1.6", fontSize: "0.95rem", marginBottom: "30px" }}>
              Su solicitud de cambio ha sido registrada. Nuestro equipo de administración revisará la información proporcionada a la brevedad. 
              <br /><br />
              Podrá realizar el seguimiento de su caso y ver la respuesta definitiva directamente en la pestaña <strong>"Devoluciones"</strong> de su perfil.
            </p>
            <button 
              onClick={() => { setShowSuccessModal(false); setReturnView('list'); }} 
              style={{ width: "100%", padding: "14px", borderRadius: "12px", backgroundColor: "#FFC107", color: "#000", border: "none", fontWeight: 800, cursor: "pointer", fontSize: "1rem", transition: "all 0.2s" }}
            >
              ENTENDIDO
            </button>
          </div>
        </div>
      )}
      {/* Modal de Confirmación Universal */}
      {confirmModal.open && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.85)", zIndex: 7000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ backgroundColor: "#111827", maxWidth: "450px", width: "100%", borderRadius: "20px", padding: "35px", textAlign: "center", border: "1px solid rgba(239,68,68,0.3)", boxShadow: '0 25px 50px rgba(0,0,0,0.6)' }}>
            <div style={{ width: "70px", height: "70px", backgroundColor: confirmModal.isDanger ? "rgba(239,68,68,0.1)" : "rgba(255,193,7,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", border: `1px solid ${confirmModal.isDanger ? "#ef4444" : "#FFC107"}` }}>
              <FaExclamationTriangle color={confirmModal.isDanger ? "#ef4444" : "#FFC107"} size={30} />
            </div>
            <h3 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "12px", color: "#fff" }}>{confirmModal.title}</h3>
            <p style={{ color: "#94a3b8", lineHeight: "1.6", fontSize: "0.9rem", marginBottom: "30px" }}>{confirmModal.message}</p>
            <div style={{ display: "flex", gap: "12px" }}>
              <button 
                onClick={() => setConfirmModal(p => ({ ...p, open: false }))} 
                style={{ flex: 1, padding: "12px", borderRadius: "10px", backgroundColor: "rgba(255,255,255,0.05)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", fontWeight: 700, cursor: "pointer" }}
              >
                CANCELAR
              </button>
              <button 
                onClick={confirmModal.onConfirm} 
                style={{ flex: 1, padding: "12px", borderRadius: "10px", backgroundColor: confirmModal.isDanger ? "#ef4444" : "#FFC107", color: confirmModal.isDanger ? "#fff" : "#000", border: "none", fontWeight: 800, cursor: "pointer" }}
              >
                {confirmModal.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Políticas de Devolución */}
      {showPolicyModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.95)", zIndex: 8000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ backgroundColor: "#111827", maxWidth: "800px", width: "100%", borderRadius: "28px", padding: "30px 50px", border: "1px solid rgba(255,193,7,0.25)", boxShadow: '0 40px 100px rgba(0,0,0,0.8)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '5px', background: 'linear-gradient(90deg, #FFC107, #FF9800, #FFC107)' }}></div>
            
            <div style={{ textAlign: 'center', marginBottom: '25px' }}>
              <div style={{ width: "45px", height: "45px", backgroundColor: "rgba(255, 193, 7, 0.1)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", border: "1px solid rgba(255, 193, 7, 0.3)" }}>
                <FaExchangeAlt color="#FFC107" size={22} />
              </div>
              <h3 style={{ fontSize: "1.6rem", fontWeight: 900, color: "#fff", margin: 0 }}>🔁 Políticas de Cambios y Devoluciones</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px' }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '20px', padding: '20px 30px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ color: "#e2e8f0", lineHeight: "1.5", fontSize: "0.95rem", marginBottom: "12px", fontWeight: 600 }}>
                  En <span style={{ color: '#FFC107' }}>Gorras Medellín Caps</span> queremos que estés 100% satisfecho con tu compra.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'x 30px' }}>
                  <ul style={{ color: "#94a3b8", fontSize: "0.85rem", lineHeight: "1.5", paddingLeft: "18px", margin: 0 }}>
                    <li style={{ marginBottom: '6px' }}>Cambios aceptados en los primeros <strong>5 días</strong>.</li>
                    <li style={{ marginBottom: '6px' }}>Gorra <strong>sin uso</strong> con etiquetas originales.</li>
                  </ul>
                  <ul style={{ color: "#94a3b8", fontSize: "0.85rem", lineHeight: "1.5", paddingLeft: "18px", margin: 0 }}>
                    <li style={{ marginBottom: '6px' }}>Solo cambios, <strong>no devoluciones de dinero</strong>.</li>
                    <li>Envío por cuenta del cliente (salvo defecto).</li>
                  </ul>
                </div>
              </div>

              <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.04)', border: '1px solid rgba(239, 68, 68, 0.15)', padding: '20px 30px', borderRadius: '20px' }}>
                <h4 style={{ color: '#ef4444', margin: '0 0 10px 0', fontSize: '0.9rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaExclamationTriangle size={14} /> ⚠️ PRODUCTOS CON DEFECTO
                </h4>
                <p style={{ color: '#e2e8f0', fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
                  Reportar en las primeras <strong>48 horas</strong> post-entrega. En este caso, nosotros <strong>asumimos el cambio</strong> sin costo adicional.
                </p>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.85rem', marginBottom: '20px', fontWeight: 500 }}>
                ¿Su producto cumple con estas condiciones para procesar la solicitud?
              </p>

              <div style={{ display: "flex", gap: "15px", width: '100%', maxWidth: '450px' }}>
                <button 
                  onClick={() => setShowPolicyModal(false)} 
                  style={{ flex: 1, padding: "12px", borderRadius: "12px", backgroundColor: "rgba(255,255,255,0.03)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.1)", fontWeight: 700, cursor: "pointer", fontSize: "0.9rem", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.05)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'; }}
                >
                  CANCELAR
                </button>
                <button 
                  onClick={handleContinueToReturn} 
                  style={{ flex: 1, padding: "12px", borderRadius: "12px", backgroundColor: "#FFC107", color: "#000", border: "none", fontWeight: 800, cursor: "pointer", fontSize: "0.9rem", transition: "all 0.2s", boxShadow: '0 8px 20px rgba(255,193,7,0.2)' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  CONTINUAR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Profile;