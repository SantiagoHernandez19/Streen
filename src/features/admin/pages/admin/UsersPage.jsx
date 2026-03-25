// src/pages/admin/UsersPage.jsx
import React, { useState, useMemo, useEffect } from "react";

// Componentes
import SearchInput from "../../../../shared/components/SearchInput";
import EntityTable from "../../components/EntityTable";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import Alert from "../../../../shared/components/Alert";
import UniversalModal from "../../../../shared/components/UniversalModal";

// Datos
import { initialUsers as usersData, initialRoles } from "../../../../data";

// =============================================
// COMPONENTE StatusFilter
// =============================================
const StatusFilter = ({ filterStatus, onFilterSelect }) => {
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
        <span>{filterStatus}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
          <polyline points="6,9 12,15 18,9"/>
        </svg>
      </button>
      {open && (
        <div style={{ 
          position: 'absolute', top: '100%', right: 0, marginTop: '4px', backgroundColor: '#1F2937', 
          border: '1px solid #F5C81B', borderRadius: '6px', padding: '6px 0', minWidth: '120px', zIndex: 1000 
        }}>
          {['Todos', 'Activos', 'Inactivos'].map(status => (
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
};

const FormField = React.memo(function FormField({ label, required, children, error }) {
  return (
    <div>
      <label style={{ fontSize: '12px', color: '#e2e8f0', display: 'block', marginBottom: '2px' }}>{label}: {required && <span style={{color: '#ef4444'}}>*</span>}</label>
      {children}
      {error && <div style={{ color: '#f87171', fontSize: '11px' }}>{error}</div>}
    </div>
  );
});

const UsersPage = () => {
  // ─── Estados
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [availableRoles, setAvailableRoles] = useState([]);

  // ─── Cargar usuarios y roles desde la API REAL
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Cargar Usuarios
        const resUsers = await fetch("https://backend-streen.onrender.com/api/auth/users");
        const dataUsers = await resUsers.json();
        
        if (dataUsers.status === "success" && dataUsers.data?.users) {
          const mappedUsers = dataUsers.data.users.map(u => ({
            id: u.id_user,
            nombre: u.first_name,
            apellido: u.last_name || "",
            email: u.email,
            rol: u.rol_name || "Cliente",
            isActive: u.is_active,
            tipoDocumento: u.document_type || 'CC',
            numeroDocumento: u.document_number || '',
            id_rol: u.id_rol
          }));
          setUsers(mappedUsers);
        }

        // 2. Cargar Roles para el selector
        const resRoles = await fetch("https://backend-streen.onrender.com/api/auth/roles");
        const dataRoles = await resRoles.json();
        if (dataRoles.status === "success" && dataRoles.data?.roles) {
          setAvailableRoles(dataRoles.data.roles);
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
        showAlert("No se pudieron cargar los datos del servidor", "error");
      }
    };

    fetchData();
  }, []);

  // ─── Alertas
  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "success" }), 2500);
  };

  // ─── Helper para verificar si es administrador
  const isAdministrador = (user) => (user?.rol || "").toLowerCase() === "administrador";

  // ─── Modal
  const openModal = (user = null) => {
    // Si el usuario es administrador, solo permitir ver detalles
    if (user && isAdministrador(user)) {
      viewUserDetails(user);
      return;
    }

    setEditingUser(user);
    setErrors({});

    if (user) {
      // Modo editar/ver
      setFormData({
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        email: user.email || '',
        tipoDocumento: user.tipoDocumento || 'CC',
        numeroDocumento: user.numeroDocumento || '',
        rol: user.rol || '',
        isActive: user.isActive !== undefined ? user.isActive : true
      });
    } else {
      // Modo crear
      setFormData({
        nombre: '',
        apellido: '',
        email: '',
        tipoDocumento: 'CC',
        numeroDocumento: '',
        rol: '',
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingUser(null);
    setIsModalOpen(false);
    setFormData({});
    setErrors({});
  };

  const handleInputChange = (field, value) => {
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    const requiredFields = [
      { name: 'nombre', label: 'Nombre' },
      { name: 'email', label: 'Email' },
      { name: 'rol', label: 'Rol' },
    ];

    const newErrors = {};
    requiredFields.forEach(field => {
      const value = formData[field.name];
      const stringValue = value !== null && value !== undefined ? String(value) : '';
      if (!stringValue.trim()) {
        newErrors[field.name] = `${field.label} es obligatorio`;
      }
    });

    // Validación de email
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email no válido';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      showAlert('Complete los campos obligatorios correctamente', 'delete');
      return;
    }

    const updatedData = {
      nombre: formData.nombre.trim(),
      apellido: (formData.apellido || '').trim(),
      email: formData.email.trim(),
      rol: formData.rol,
      isActive: Boolean(formData.isActive)
    };

    try {
      let response;
      if (editingUser?.id) {
        // ACTUALIZAR
        response = await fetch(`https://backend-streen.onrender.com/api/auth/users/${editingUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedData)
        });
      } else {
        // CREAR (Usamos el register existente)
        response = await fetch("https://backend-streen.onrender.com/api/auth/register", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: updatedData.nombre,
            lastName: updatedData.apellido,
            email: updatedData.email,
            password: 'Password123!', // Password por defecto para creación manual
            role: updatedData.rol
          })
        });
      }

      const result = await response.json();
      if (result.status === "success") {
        showAlert(editingUser?.id ? "Usuario actualizado" : "Usuario creado");
        window.location.reload();
      } else {
        showAlert(result.message || "Error al guardar", "error");
      }
    } catch (error) {
       showAlert("Error de conexión", "error");
    }

    closeModal();
  };

  // ─── Eliminar
  const handleDeleteClick = (user) => {
    if (isAdministrador(user)) {
      showAlert('El usuario "Administrador" no se puede eliminar', "error");
      return;
    }
    
    setUserToDelete(user);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`https://backend-streen.onrender.com/api/auth/users/${userToDelete.id}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      if (result.status === "success") {
        showAlert("Usuario eliminado");
        setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      } else {
        showAlert(result.message, "error");
      }
    } catch (error) {
      showAlert("Error al eliminar", "error");
    }
    setIsConfirmOpen(false);
    setUserToDelete(null);
  };

  // ─── Toggle de estado
  const handleToggleStatus = async (user) => {
    if (isAdministrador(user)) {
      showAlert('El usuario "Administrador" siempre está activo', "error");
      return;
    }
    
    const newStatus = !user.isActive;
    try {
      const response = await fetch(`https://backend-streen.onrender.com/api/auth/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...user,
          isActive: newStatus
        })
      });
      const result = await response.json();
      if (result.status === "success") {
        setUsers((prev) =>
          prev.map((u) => u.id === user.id ? { ...u, isActive: newStatus } : u)
        );
        showAlert(`Usuario ${newStatus ? 'activado' : 'desactivado'}`);
      }
    } catch (error) {
      showAlert("Error al cambiar estado", "error");
    }
  };

  // ─── Ver detalles
  const viewUserDetails = (user) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };

  // ─── Utilidades de búsqueda y filtrado
  // ELIMINADO: const clearSearch = () => { ... } - no se usa

  const handleFilterSelect = (status) => { 
    setFilterStatus(status); 
    setCurrentPage(1); 
  };

  // ─── Filtrado y paginación
  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    
    return users.filter((user) => {
      // Filtro por estado
      if (filterStatus === 'Activos' && !user.isActive) return false;
      if (filterStatus === 'Inactivos' && user.isActive) return false;
      
      // Filtro por búsqueda
      if (term) {
        const fullName = `${user.nombre} ${user.apellido}`.toLowerCase();
        return (
          fullName.includes(term) ||
          user.email.toLowerCase().includes(term) ||
          (user.rol?.toLowerCase() || "").includes(term) ||
          (user.numeroDocumento || "").toLowerCase().includes(term)
        );
      }
      return true;
    });
  }, [users, searchTerm, filterStatus]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredUsers.length);
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
  // ELIMINADO: const showingStart = filteredUsers.length > 0 ? startIndex + 1 : 0;

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
    else if (totalPages === 0) setCurrentPage(1);
  }, [totalPages, currentPage]);

  // ─── Render Field para el Modal
  const renderField = (label, fieldName, type = 'text', options = []) => {
    const isError = errors[fieldName];
    const borderColor = isError ? '#ef4444' : '#334155';
    const backgroundColor = isError ? '#451a1a' : '#1e293b';

    const labelStyle = {
      fontSize: '12px',
      color: '#e2e8f0',
      fontWeight: '500',
      marginBottom: '2px',
      display: 'block'
    };

    const inputStyle = {
      backgroundColor,
      border: `1px solid ${borderColor}`,
      borderRadius: '6px',
      padding: '4px 8px',
      color: '#f1f5f9',
      fontSize: '13px',
      height: '30px',
      width: '100%',
      outline: 'none',
      boxSizing: 'border-box',
      fontFamily: 'inherit',
    };

    const errorStyle = {
      color: '#f87171',
      fontSize: '11px',
      fontWeight: '500',
      marginTop: '1px',
      height: '14px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      visibility: isError ? 'visible' : 'hidden',
    };

    const value = formData[fieldName] || '';
    const isSelectField = ['tipoDocumento', 'rol'].includes(fieldName);

    if (isSelectField) {
      let fieldOptions = options;
      if (fieldName === 'rol') {
        const existingAdmin = users.find(u => u.rol === "Administrador");
        
        fieldOptions = availableRoles.map(r => ({
          value: r.name,
          label: r.name
        }));
        
        // Bloquear opción de crear otro Admin si ya hay uno y no es el que estamos editando
        if (existingAdmin && (!editingUser || editingUser.rol !== "Administrador")) {
          fieldOptions = fieldOptions.filter(opt => opt.value !== "Administrador");
        }
      }

      return (
        <div>
          <label style={labelStyle}>
            {label}: <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <select
            name={fieldName}
            value={value}
            onChange={(e) => handleInputChange(fieldName, e.target.value)}
            style={inputStyle}
          >
            <option value="">Seleccionar...</option>
            {fieldOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <div style={errorStyle}>
            {isError && (
              <>
                <span style={{ color: '#f87171', fontSize: '14px', fontWeight: 'bold' }}>●</span>
                {isError}
              </>
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <label style={labelStyle}>
            {label}: <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            name={fieldName}
            type={type}
            value={value}
            onChange={(e) => handleInputChange(fieldName, e.target.value)}
            style={inputStyle}
          />
          <div style={errorStyle}>
            {isError && (
              <>
                <span style={{ color: '#f87171', fontSize: '14px', fontWeight: 'bold' }}>●</span>
                {isError}
              </>
            )}
          </div>
        </div>
      );
    }
  };

  // ─── Columnas INCLUYENDO ESTADO con mejor espaciado y header alineado
  const columns = [
    { 
      header: 'Nombre', 
      field: 'nombreCompleto',
      width: '200px',
      render: (item) => (
        <span style={{ color: '#fff', fontSize: '13px', fontWeight: '600' }}>
          {item.nombre} {item.apellido}
        </span>
      ) 
    },
    { 
      header: 'Email', 
      field: 'email',
      width: '250px',
      render: (item) => (
        <span style={{ color: '#fff', fontSize: '13px' }}>{item.email}</span>
      ) 
    },
    { 
      header: 'Rol', 
      field: 'rol',
      width: '150px',
      render: (item) => (
        <span style={{ 
          color: item.rol === 'Administrador' ? '#F5C81B' : '#fff', 
          fontSize: '13px',
          fontWeight: item.rol === 'Administrador' ? '600' : '400'
        }}>
          {item.rol}
        </span>
      ) 
    },
    { 
      header: 'Estado', 
      field: 'estado',
      width: '100px',
      headerStyle: {
        textAlign: 'center',
        padding: '6px 2px',
      },
      render: (item) => (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '4px',
          padding: '2px 6px',
          backgroundColor: item.isActive ? '#064e3b' : '#7f1d1d',
          color: item.isActive ? '#10b981' : '#ef4444',
          borderRadius: '12px',
          fontSize: '11px',
          fontWeight: '600',
          width: 'fit-content',
          border: `1px solid ${item.isActive ? '#10b981' : '#ef4444'}`,
          minWidth: '70px',
          justifyContent: 'center',
          margin: '0 auto'
        }}>
          <span style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            backgroundColor: item.isActive ? '#10b981' : '#ef4444',
            display: 'block',
            flexShrink: 0
          }}></span>
          <span style={{ whiteSpace: 'nowrap' }}>{item.isActive ? 'Activo' : 'Inactivo'}</span>
        </div>
      )
    }
  ];

  // ─── Render
  return (
    <>
      {alert.show && <Alert message={alert.message} type={alert.type} onClose={() => setAlert({ ...alert, show: false })} />}
      
      <div style={{ display: "flex", flexDirection: "column", padding: "4px 12px 0 12px", flex: 1, height: "100%" }}>
        {/* Encabezado */}
        <div style={{ marginBottom: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <div>
              <h1 style={{ color: "#fff", fontSize: "20px", fontWeight: "700", margin: 0, lineHeight: "1.2" }}>
                Usuarios
              </h1>
              <p style={{ color: "#9CA3AF", fontSize: "15px", margin: 0, lineHeight: "1.3" }}>
                Gestión de usuarios del sistema
              </p>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => openModal()}
                style={{
                  padding: "6px 13px",
                  backgroundColor: "transparent",
                  border: "1px solid #F5C81B",
                  color: "#F5C81B",
                  borderRadius: "4px",
                  fontSize: "11px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  minWidth: "100px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "3px",
                  height: "35px",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#F5C81B";
                  e.target.style.color = "#000";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.color = "#F5C81B";
                }}
              >
                Registrar Usuario
              </button>
            </div>
          </div>
          
          {/* Buscador y Filtro */}
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <div style={{ flex: 1 }}>
              <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Buscar por nombre, email o documento..."
                onClear={() => setSearchTerm('')}
                fullWidth={true}
              />
            </div>
            <StatusFilter filterStatus={filterStatus} onFilterSelect={handleFilterSelect} />
          </div>
        </div>

        {/* Contenido Principal - BORDE MÁS DELGADO */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '6px',
          border: '0.5px solid #F5C81B',
          overflow: 'hidden',
          backgroundColor: '#000',
        }}>
          {/* Tabla */}
          <div style={{
            flex: 1,
            overflow: 'auto',
          }}>
            <EntityTable 
              entities={paginatedUsers} 
              columns={columns} 
              onView={viewUserDetails} 
              onEdit={openModal} 
              onDelete={handleDeleteClick}
              onAnular={handleToggleStatus}
              onReactivar={handleToggleStatus}
              showAnularButton={true} 
              moduleType="usuarios" 
              idField="id"
              estadoField="isActive"
              isAdministradorCheck={isAdministrador}
              style={{
                border: 'none',
                borderRadius: '0',
              }}
              tableStyle={{
                width: '100%',
                borderCollapse: 'collapse',
                tableLayout: 'fixed',
              }}
              headerStyle={{
                padding: '6px 4px',
                textAlign: 'left',
                fontWeight: '600',
                fontSize: '11px',
                color: '#F5C81B',
                borderBottom: '0.5px solid #F5C81B',
                backgroundColor: '#151822',
              }}
              actionsPosition="right"
            />
          </div>

          {/* Paginación - BORDE MÁS DELGADO */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px 12px",
            backgroundColor: "#151822",
            borderTop: '0.5px solid #F5C81B',
            fontSize: "12px",
            color: "#e0e0e0",
            height: "48px",
            boxSizing: "border-box",
          }}>
            <span>
              Mostrando {(filteredUsers.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0)}–{Math.min(currentPage * itemsPerPage, filteredUsers.length)} de {filteredUsers.length} usuarios
            </span>
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  background: 'transparent',
                  border: '0.5px solid #F5C81B',
                  color: currentPage === 1 ? '#6B7280' : '#F5C81B',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  minWidth: '90px',
                }}
              >
                ‹ Anterior
              </button>
              <span style={{
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#F5C81B',
                minWidth: '60px',
                textAlign: 'center'
              }}>
                Página {currentPage} de {Math.ceil(filteredUsers.length / itemsPerPage) || 1}
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= Math.ceil(filteredUsers.length / itemsPerPage)}
                style={{
                  background: 'transparent',
                  border: '0.5px solid #F5C81B',
                  color: currentPage >= Math.ceil(filteredUsers.length / itemsPerPage) ? '#6B7280' : '#F5C81B',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  cursor: currentPage >= Math.ceil(filteredUsers.length / itemsPerPage) ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  minWidth: '90px',
                }}
              >
                Siguiente ›
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Crear/Editar Usuario - BORDE MÁS DELGADO */}
      <UniversalModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingUser?.id ? 'Editar Usuario' : 'Registrar Usuario'}
        subtitle={editingUser?.id ? 'Modifica los datos del usuario' : 'Agrega un nuevo usuario al sistema'}
        showActions={false}
        customStyles={{
          content: { 
            padding: '16px',
            backgroundColor: '#000',
            border: '0.5px solid #F5C81B',
            borderRadius: '6px',
            maxWidth: '400px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
          },
          title: {
            color: '#fff',
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '4px'
          },
          subtitle: {
            color: '#9CA3AF',
            fontSize: '12px',
            marginBottom: '16px'
          }
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              {renderField('Nombre', 'nombre', 'text')}
            </div>
            <div style={{ flex: 1 }}>
              {renderField('Apellido', 'apellido', 'text')}
            </div>
          </div>

          <div>
            {renderField('Email', 'email', 'email')}
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              {renderField('Tipo Documento', 'tipoDocumento', 'select', [
                { value: 'CC', label: 'Cédula de Ciudadanía' },
                { value: 'PPT', label: 'Permiso de Protección Temporal' },
                { value: 'PEP', label: 'Permiso Especial de Permanencia' },
                { value: 'Pasaporte', label: 'Pasaporte' },
                { value: 'NIT', label: 'NIT' }
              ])}
            </div>
            <div style={{ flex: 1 }}>
              {renderField('N° Documento', 'numeroDocumento', 'text')}
            </div>
          </div>

          <div>
            {renderField('Rol', 'rol', 'select')}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '0.5px solid #334155', paddingTop: '12px' }}>
            <button 
              onClick={closeModal}
              style={{
                background: 'transparent',
                border: '0.5px solid #94a3b8',
                color: '#94a3b8',
                padding: '6px 16px',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
            <button 
              onClick={handleSave}
              style={{
                background: '#F5C81B',
                color: '#000',
                border: 'none',
                padding: '6px 16px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {editingUser?.id ? 'Guardar Cambios' : 'Crear Usuario'}
            </button>
          </div>
        </div>
      </UniversalModal>

      {/* Modal Confirm Delete */}
      <ConfirmDeleteModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        entityName="usuario"
        entityData={userToDelete}
      />

      {/* Modal Detalles - BORDE MÁS DELGADO */}
      <UniversalModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title="Detalles del Usuario"
        subtitle="Información detallada del usuario"
        showActions={false}
        customStyles={{
          content: { 
            padding: '16px',
            backgroundColor: '#000',
            border: '0.5px solid #F5C81B',
            borderRadius: '6px',
            maxWidth: '400px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
          },
          title: {
            color: '#fff',
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '4px'
          },
          subtitle: {
            color: '#9CA3AF',
            fontSize: '12px',
            marginBottom: '16px'
          }
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <FormField label="Nombre">
                <div style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "6px", padding: "6px 10px", color: "#F5C81B", fontSize: "13px", fontWeight: "600" }}>
                  {selectedUser?.nombre || 'N/A'}
                </div>
              </FormField>
            </div>
            <div style={{ flex: 1 }}>
              <FormField label="Apellido">
                <div style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "6px", padding: "6px 10px", color: "#F5C81B", fontSize: "13px", fontWeight: "600" }}>
                  {selectedUser?.apellido || 'N/A'}
                </div>
              </FormField>
            </div>
          </div>

          <div>
            <FormField label="Email">
              <div style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "6px", padding: "6px 10px", color: "#f1f5f9", fontSize: "13px" }}>
                {selectedUser?.email || 'N/A'}
              </div>
            </FormField>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <FormField label="Tipo Documento">
                <div style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "6px", padding: "6px 10px", color: "#f1f5f9", fontSize: "13px" }}>
                  {selectedUser?.tipoDocumento || 'N/A'}
                </div>
              </FormField>
            </div>
            <div style={{ flex: 1 }}>
              <FormField label="N° Documento">
                <div style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "6px", padding: "6px 10px", color: "#f1f5f9", fontSize: "13px" }}>
                  {selectedUser?.numeroDocumento || 'N/A'}
                </div>
              </FormField>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <FormField label="Rol">
                <div style={{ 
                  backgroundColor: "#1e293b", 
                  border: "1px solid #334155", 
                  borderRadius: "6px", 
                  padding: "6px 10px", 
                  color: selectedUser?.rol === 'Administrador' ? '#F5C81B' : '#f1f5f9', 
                  fontSize: "13px", 
                  fontWeight: selectedUser?.rol === 'Administrador' ? '600' : '400'
                }}>
                  {selectedUser?.rol || 'N/A'}
                </div>
              </FormField>
            </div>
            <div style={{ flex: 1 }}>
              <FormField label="Estado">
                <div style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "6px", padding: "6px 10px", color: selectedUser?.isActive ? '#10b981' : '#ef4444', fontSize: "13px", fontWeight: "600" }}>
                  {selectedUser?.isActive ? 'Activo' : 'Inactivo'}
                </div>
              </FormField>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '0.5px solid #334155', paddingTop: '12px' }}>
            <button 
              onClick={() => setIsDetailsOpen(false)}
              style={{
                background: 'transparent',
                border: '0.5px solid #94a3b8',
                color: '#94a3b8',
                padding: '6px 16px',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      </UniversalModal>
    </>
  );
};

export default UsersPage;