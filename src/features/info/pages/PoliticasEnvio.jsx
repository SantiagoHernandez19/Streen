import React, { useEffect } from 'react';
import Footer from '../../../shared/components/Footer';
import { FaTruck, FaMapMarkerAlt, FaClock, FaBox } from 'react-icons/fa';

const PoliticasEnvio = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const pageStyle = {
    backgroundColor: '#030712',
    color: '#fff',
    minHeight: '100vh',
    paddingTop: '100px',
    fontFamily: "'Inter', sans-serif",
  };

  const containerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '0 20px 60px',
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '50px',
  };

  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: '#FFC107',
    marginBottom: '10px',
  };

  const sectionStyle = {
    marginBottom: '40px',
    lineHeight: '1.8',
    fontSize: '1.1rem',
    color: '#d1d5db',
  };

  const cardStyle = {
    backgroundColor: 'rgba(255, 193, 7, 0.05)',
    borderRadius: '16px',
    padding: '30px',
    border: '1px solid rgba(255, 193, 7, 0.2)',
    marginBottom: '30px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '20px',
  };

  const iconStyle = {
    fontSize: '1.8rem',
    color: '#FFC107',
    marginTop: '5px',
  };

  const highlightStyle = {
    color: '#FFC107',
    fontWeight: '600',
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <header style={headerStyle}>
          <h1 style={titleStyle}>Políticas de Envío 📦</h1>
          <p style={{ color: '#94a3b8', fontSize: '1.2rem' }}>Información importante sobre tu pedido</p>
        </header>

        <section style={sectionStyle}>
          <div style={cardStyle}>
            <div style={iconStyle}><FaMapMarkerAlt /></div>
            <div>
              <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '10px' }}>📦 Cobertura Nacional</h3>
              <p>Realizamos envíos a nivel nacional en todo el territorio de <span style={highlightStyle}>Colombia</span>.</p>
            </div>
          </div>

          <div style={cardStyle}>
            <div style={iconStyle}><FaClock /></div>
            <div>
              <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '10px' }}>⏳ Tiempos de Entrega</h3>
              <p>El tiempo estimado de entrega oscila entre <span style={highlightStyle}>2 y 5 días hábiles</span>, dependiendo de la ciudad de destino.</p>
            </div>
          </div>

          <div style={cardStyle}>
            <div style={iconStyle}><FaBox /></div>
            <div>
              <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '10px' }}>🔄 Procesamiento de Pedidos</h3>
              <p>Procesamos todos los pedidos en un plazo máximo de <span style={highlightStyle}>24 horas</span> después de confirmar el pago correspondiente.</p>
            </div>
          </div>

          <div style={cardStyle}>
            <div style={iconStyle}><FaTruck /></div>
            <div>
              <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '10px' }}>🚚 Transportadoras Confiables</h3>
              <p>Trabajamos con las transportadoras más fiables del país para garantizar que tu producto llegue en <span style={highlightStyle}>perfecto estado</span>.</p>
            </div>
          </div>

          <div style={{ ...sectionStyle, marginTop: '20px', textAlign: 'center' }}>
            <p>
              El costo de envío es variable y se calcula automáticamente al momento de realizar la compra.
            </p>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default PoliticasEnvio;
