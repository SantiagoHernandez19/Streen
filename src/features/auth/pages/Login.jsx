// src/pages/Login.jsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const Login = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState("login");
  const [view, setView] = useState("auth");
  const [error, setError] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    documentType: "Cédula de Identidad",
    documentNumber: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [showLoginPass, setShowLoginPass] = useState(false);
  const [showRegPass, setShowRegPass] = useState(false);
  const [showRegPass2, setShowRegPass2] = useState(false);

  const resetMessages = () => { setError(""); setInfoMsg(""); };

  const styles = useMemo(() => {
    return {
      container: {
        display: "flex",
        height: "100vh",
        width: "100%",
        backgroundImage: `url('https://res.cloudinary.com/dxc5qqsjd/image/upload/v1774320932/WhatsApp_Image_2026-03-23_at_9.54.36_PM_pxd6fe.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: "'Inter', sans-serif",
        color: "#fff",
        overflow: "hidden",
        position: "relative"
      },
      overlay: {
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        background: "linear-gradient(to right, rgba(0,0,0,0.85), rgba(0,0,0,0.2))",
        zIndex: 1
      },
      // --- Lado Izquierdo (Hero) ---
      heroSection: {
        flex: "0 0 45%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        zIndex: 2,
        padding: "40px",
        animation: "fadeIn 1s ease"
      },
      logoImg: {
        width: "240px",
        height: "auto",
        marginBottom: "15px",
        filter: "drop-shadow(0 4px 15px rgba(0,0,0,0.6))"
      },
      bannerTitle: {
        fontSize: "26px",
        fontWeight: "800",
        color: "#FFC107",
        letterSpacing: "1px",
        margin: "0",
        textShadow: "0 2px 10px rgba(0,0,0,0.8)"
      },
      bannerSubtitle: {
        fontSize: "17px",
        color: "#fff",
        maxWidth: "360px",
        marginTop: "15px",
        lineHeight: "1.4",
        textShadow: "0 2px 8px rgba(0,0,0,0.8)"
      },
      // --- Lado Derecho (Formulario Flotante) ---
      formWrapper: {
        flex: "0 0 55%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center", // Mantenemos la posición base centrada en el área derecha
        zIndex: 2,
        paddingRight: "40px",
        position: "relative"
      },
      backLink: { 
        position: "absolute",
        top: "30px",
        right: "40px",
        display: "flex", 
        alignItems: "center", 
        gap: "8px", 
        color: "#fff", 
        textDecoration: "none", 
        fontSize: "13px", 
        opacity: 0.7,
        transition: "0.2s",
        zIndex: 10
      },
      formCard: {
        width: "100%",
        maxWidth: "520px", // Más ancho como pediste, sin cambiar su centro
        backgroundColor: "rgba(15,17,21,0.96)",
        padding: "35px 45px",
        borderRadius: "24px",
        border: "1px solid rgba(255,193,7,0.15)",
        boxShadow: "0 20px 50px rgba(0,0,0,0.8)",
        animation: "slideInRight 0.8s ease"
      },
      tabWrapper: { display: "flex", backgroundColor: "#1e222a", padding: "4px", borderRadius: "14px", marginBottom: "20px", gap: "4px" },
      tabBtn: (active) => ({ flex: 1, padding: "11px", borderRadius: "10px", border: "none", fontSize: "14px", fontWeight: "700", cursor: "pointer", transition: "0.3s", backgroundColor: active ? "#FFC107" : "transparent", color: active ? "#000" : "#fff" }),
      formTitle: { fontSize: "28px", fontWeight: "800", marginBottom: "5px" },
      formSubtitle: { fontSize: "14px", color: "#888", marginBottom: "25px" },
      label: { display: "block", fontSize: "11px", color: "#aaa", marginBottom: "7px", textTransform: "uppercase", letterSpacing: "0.5px" },
      input: { width: "100%", padding: "13px 18px", borderRadius: "12px", backgroundColor: "#171a21", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: "15px", outline: "none", marginBottom: "16px" },
      inputWrap: { position: "relative", width: "100%" },
      eyeBtn: { position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", border: "none", background: "none", cursor: "pointer", color: "#666" },
      mainBtn: { width: "100%", padding: "16px", borderRadius: "12px", backgroundColor: "#FFC107", color: "#000", border: "none", fontSize: "16px", fontWeight: "800", cursor: "pointer", marginTop: "10px", transition: "0.3s" },
      error: { backgroundColor: "rgba(255,107,107,0.1)", color: "#ff6b6b", padding: "13px", borderRadius: "12px", fontSize: "13px", marginBottom: "20px", border: "1px solid rgba(255,107,107,0.2)" },
      info: { backgroundColor: "rgba(255,193,7,0.1)", color: "#FFC107", padding: "13px", borderRadius: "12px", fontSize: "13px", marginBottom: "20px", border: "1px solid rgba(255,193,7,0.2)" }
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    resetMessages();
    try {
      const response = await fetch("https://backend-streen.onrender.com/api/auth/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginData.email.toLowerCase(), password: loginData.password })
      });
      const result = await response.json();
      if (result.status === "success") {
        const { user, token } = result.data;
        const userData = {
          IdUsuario: user.id, 
          Nombre: user.nombre || `${user.first_name} ${user.last_name}`, 
          Correo: user.email, 
          IdRol: user.id_rol, 
          Rol: user.rol, 
          Permissions: user.permissions || [], 
          token: token, 
          userType: (user.id_rol === 1 || (user.permissions && user.permissions.some(p => p.toLowerCase() === "dashboard"))) ? "admin" : "cliente",
          document_type: user.document_type,
          document_number: user.document_number,
          phone: user.phone,
          department: user.department,
          city: user.city,
          address: user.address
        };
        localStorage.setItem("token", token); onLogin(userData);
      } else { setError(result.message || "Credenciales incorrectas"); }
    } catch (err) { setError("No se pudo conectar con el servidor."); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    resetMessages();
    if (registerData.password !== registerData.confirmPassword) { setError("Las claves no coinciden"); return; }

    try {
      const response = await fetch("https://backend-streen.onrender.com/api/auth/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          first_name: registerData.firstName, 
          last_name: registerData.lastName, 
          email: registerData.email, 
          password: registerData.password, 
          document_type: registerData.documentType, 
          document_number: registerData.documentNumber 
        })
      });
      const result = await response.json();
      if (result.status === "success") { setInfoMsg("¡Cuenta creada! Ya puedes iniciar sesión."); setActiveTab("login"); }
      else { setError(result.message || "No se pudo crear la cuenta"); }
    } catch (err) { setError("Error de conexión al registrar."); }
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay}></div>
      <Link to="/" style={styles.backLink} onMouseEnter={e => e.target.style.opacity="1"} onMouseLeave={e => e.target.style.opacity="0.7"}>
        <FaArrowLeft size={12} /> Volver a la tienda
      </Link>
      <div style={styles.heroSection}>
        <img src="/logo.png" alt="Logo" style={styles.logoImg} />
        <h1 style={styles.bannerTitle}>Gorras Medellín Caps</h1>
        <p style={styles.bannerSubtitle}>Exclusividad y estilo en cada prenda. Únete a la comunidad de gorras más grande de la ciudad.</p>
      </div>
      <div style={styles.formWrapper}>
        <div style={styles.formCard}>
          {view === "auth" && (
            <>
              <h2 style={styles.formTitle}>{activeTab === "login" ? "¡Hola de nuevo!" : "Registrarse"}</h2>
              <p style={styles.formSubtitle}>{activeTab === "login" ? "Ingresa para continuar comprando" : "Empieza tu colección de nivel ahora"}</p>
              <div style={styles.tabWrapper}>
                <button style={styles.tabBtn(activeTab === "login")} onClick={() => {setActiveTab("login"); resetMessages();}}>Login</button>
                <button style={styles.tabBtn(activeTab === "register")} onClick={() => {setActiveTab("register"); resetMessages();}}>Registro</button>
              </div>
              {error && <div style={styles.error}>{error}</div>}
              {infoMsg && <div style={styles.info}>{infoMsg}</div>}
              {activeTab === "login" ? (
                <form onSubmit={handleLogin}>
                  <label style={styles.label}>Correo Electrónico</label>
                  <input style={styles.input} type="email" placeholder="ejemplo@correo.com" required value={loginData.email} onChange={e => setLoginData({...loginData, email: e.target.value})} />
                  <label style={styles.label}>Contraseña</label>
                  <div style={styles.inputWrap}>
                    <input style={styles.input} type={showLoginPass ? "text" : "password"} placeholder="••••••••" required value={loginData.password} onChange={e => setLoginData({...loginData, password: e.target.value})} />
                    <button type="button" style={styles.eyeBtn} onClick={() => setShowLoginPass(!showLoginPass)}>{showLoginPass ? "🙈" : "👁️"}</button>
                  </div>
                  <button type="submit" style={styles.mainBtn}>Iniciar Sesión</button>
                  <div style={{textAlign: "center", marginTop: "15px"}}>
                    <button type="button" style={{background: "none", border: "none", color: "#FFC107", fontSize: "12px", cursor: "pointer"}} onClick={() => setView("recover")}>¿Olvidaste tu contraseña?</button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleRegister}>
                  <div style={{display: "flex", gap: "12px"}}>
                    <div style={{flex: 1}}><label style={styles.label}>Documento</label>
                      <select style={styles.input} value={registerData.documentType} onChange={e => setRegisterData({...registerData, documentType: e.target.value})}><option>Cédula</option><option>Pasaporte</option><option>NIT</option></select></div>
                    <div style={{flex: 1}}><label style={styles.label}>Número</label>
                      <input style={styles.input} type="text" placeholder="1234567" required value={registerData.documentNumber} onChange={e => setRegisterData({...registerData, documentNumber: e.target.value})} /></div>
                  </div>
                  <div style={{display: "flex", gap: "10px"}}>
                    <div style={{flex: 1}}>
                      <label style={styles.label}>Nombre</label>
                      <input style={styles.input} type="text" placeholder="Ej: Lhucianno" required value={registerData.firstName} onChange={e => setRegisterData({...registerData, firstName: e.target.value})} />
                    </div>
                    <div style={{flex: 1}}>
                      <label style={styles.label}>Apellido</label>
                      <input style={styles.input} type="text" placeholder="Ej: Alexander" required value={registerData.lastName} onChange={e => setRegisterData({...registerData, lastName: e.target.value})} />
                    </div>
                  </div>
                  <label style={styles.label}>Correo Electrónico</label>
                  <input style={styles.input} type="email" placeholder="tu@email.com" required value={registerData.email} onChange={e => setRegisterData({...registerData, email: e.target.value})} />
                  <div style={{display: "flex", gap: "10px"}}>
                    <div style={{flex: 1}}><label style={styles.label}>Clave</label>
                      <input style={styles.input} type="password" placeholder="••••" required value={registerData.password} onChange={e => setRegisterData({...registerData, password: e.target.value})} /></div>
                    <div style={{flex: 1}}><label style={styles.label}>Confirmar Clave</label>
                      <input style={styles.input} type="password" placeholder="••••••••" required value={registerData.confirmPassword} onChange={e => setRegisterData({...registerData, confirmPassword: e.target.value})} /></div>
                  </div>
                  <button type="submit" style={styles.mainBtn}>Crear Cuenta</button>
                </form>)}
            </>)}
          {view === "recover" && (
             <div><h2 style={styles.formTitle}>Recuperar Cuenta</h2><p style={styles.formSubtitle}>Te enviaremos un código de seguridad</p>
                <label style={styles.label}>Tu Correo</label><input style={styles.input} type="email" placeholder="usuario@correo.com" />
                <button style={styles.mainBtn} onClick={() => setView("auth")}>Enviar Código</button>
                <button style={{width: "100%", background: "none", border: "none", color: "#666", marginTop: "15px", cursor: "pointer", fontSize: "14px"}} onClick={() => setView("auth")}>Volver</button>
             </div>)}
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0); } }
        @media (max-width: 900px) {
          .container { flex-direction: column !important; overflow-y: auto !important; height: auto !important; }
          .heroSection, .formWrapper { flex: none !important; width: 100% !important; padding: 40px !important; }
        }
      `}</style>
    </div>
  );
};

export default Login;