// src/components/Footer.jsx
import React from 'react';
import { 
  FaInstagram, 
  FaWhatsapp, 
  FaFacebook,
  FaTiktok,
  FaMapMarkerAlt, 
  FaPhoneAlt, 
  FaEnvelope, 
  FaChevronRight 
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  const footerStyle = {
    backgroundColor: '#000000',
    color: '#fff',
    padding: '30px 20px 15px',
    width: '100%',
    fontFamily: "'Inter', sans-serif",
    borderTop: '1px solid rgba(255,255,255,0.05)',
    marginTop: 'auto'
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '25px',
    marginBottom: '25px'
  };

  const columnStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  };

  const titleStyle = {
    color: '#fff',
    fontSize: '0.95rem',
    fontWeight: '700',
    marginBottom: '2px',
    letterSpacing: '0.05em'
  };

  const textStyle = {
    color: '#94a3b8',
    fontSize: '0.82rem',
    lineHeight: '1.5',
    margin: 0
  };

  const linkStyle = {
    color: '#94a3b8',
    textDecoration: 'none',
    fontSize: '0.82rem',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
    cursor: 'pointer'
  };

  const iconContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: '#94a3b8',
    fontSize: '0.82rem'
  };

  const socialIconStyle = {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    color: '#fff',
    textDecoration: 'none',
    border: '1px solid rgba(255,255,255,0.1)'
  };

  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        
        {/* Columna 1: Logo e Info */}
        <div style={columnStyle}>
          <div style={{ marginBottom: '10px' }}>
            <Link to="/">
              <img src="/logo.png" style={{ height: '45px', maxWidth: '150px', objectFit: 'contain' }} alt="Logo GM CAPS" />
            </Link>
          </div>
          <p style={textStyle}>
            Tu tienda de confianza para las mejores gorras. Calidad y estilo en cada producto.
          </p>
        </div>

        {/* Columna 2: Enlaces Rápidos */}
        <div style={columnStyle}>
          <h4 style={titleStyle}>Enlaces Rápidos</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link to="/quienes-somos" style={linkStyle} onMouseEnter={e => e.currentTarget.style.color = '#FFC107'} onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}>
              <FaChevronRight size={10} color="#FFC107" /> Quiénes Somos
            </Link>
            <Link to="/politicas-envio" style={linkStyle} onMouseEnter={e => e.currentTarget.style.color = '#FFC107'} onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}>
              <FaChevronRight size={10} color="#FFC107" /> Políticas de Envío
            </Link>
            <Link to="/politica-devoluciones" style={linkStyle} onMouseEnter={e => e.currentTarget.style.color = '#FFC107'} onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}>
              <FaChevronRight size={10} color="#FFC107" /> Política de Devoluciones
            </Link>
            <Link to="/terminos" style={linkStyle} onMouseEnter={e => e.currentTarget.style.color = '#FFC107'} onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}>
              <FaChevronRight size={10} color="#FFC107" /> Términos y Condiciones
            </Link>
            <Link to="/privacidad" style={linkStyle} onMouseEnter={e => e.currentTarget.style.color = '#FFC107'} onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}>
              <FaChevronRight size={10} color="#FFC107" /> Política de Privacidad
            </Link>
          </div>
        </div>

        {/* Columna 3: Contacto */}
        <div style={columnStyle}>
          <h4 style={titleStyle}>Contacto</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={iconContainerStyle}>
              <FaMapMarkerAlt color="#FFC107" size={16} />
              <span>Alfonzo López - Medellin</span>
            </div>
            <div style={iconContainerStyle}>
              <FaPhoneAlt color="#FFC107" size={14} />
              <span>+57 300 6158180</span>
            </div>
            <div style={iconContainerStyle}>
              <FaEnvelope color="#FFC107" size={14} />
              <span>info@gmcaps.com</span>
            </div>
          </div>
        </div>

        {/* Columna 4: Síguenos */}
        <div style={columnStyle}>
          <h4 style={titleStyle}>Síguenos</h4>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={socialIconStyle} onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#1877F2'; e.currentTarget.style.transform = 'translateY(-3px)'; }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <FaFacebook size={18} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={socialIconStyle} onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#E1306C'; e.currentTarget.style.transform = 'translateY(-3px)'; }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <FaInstagram size={18} />
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" style={socialIconStyle} onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#000000'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.border = '1px solid #ff0050'; }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)'; }}>
              <FaTiktok size={18} />
            </a>
            <a href="https://wa.me/573006158180" target="_blank" rel="noopener noreferrer" style={socialIconStyle} onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#25D366'; e.currentTarget.style.transform = 'translateY(-3px)'; }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <FaWhatsapp size={18} />
            </a>
          </div>
          <p style={{ ...textStyle, fontSize: '0.85rem' }}>
            Contáctanos para consultas y pedidos especiales
          </p>
        </div>

      </div>

      {/* Línea Divisoria Inferior */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        height: '1px', 
        backgroundColor: 'rgba(255,255,255,0.05)',
        marginBottom: '15px'
      }}></div>

      <div style={{ textAlign: 'center' }}>
        <p style={{ ...textStyle, fontSize: '0.75rem', opacity: 0.5 }}>
          © 2025 GM CAPS. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;