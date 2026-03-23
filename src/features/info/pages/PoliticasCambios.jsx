import React, { useEffect } from 'react';
import Footer from '../../../shared/components/Footer';
import { FaExchangeAlt, FaTimesCircle, FaTools, FaHeadset } from 'react-icons/fa';

const PoliticasCambios = () => {
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
    flexShrink: 0
  };

  const highlightStyle = {
    color: '#FFC107',
    fontWeight: '600',
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <header style={headerStyle}>
          <h1 style={titleStyle}>Políticas de Cambios y Devoluciones 🔁</h1>
          <p style={{ color: '#94a3b8', fontSize: '1.2rem' }}>Queremos que estés 100% satisfecho</p>
        </header>

        <section style={sectionStyle}>
          <div style={cardStyle}>
            <div style={iconStyle}><FaExchangeAlt /></div>
            <div>
              <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '10px' }}>🔁 Cambios</h3>
              <p>Se aceptan solicitudes de cambio dentro de los <span style={highlightStyle}>primeros 5 días</span> posteriores a la recepción del producto.</p>
              <br />
              <p>Es indispensable que la gorra esté <span style={highlightStyle}>sin uso</span>, en <span style={highlightStyle}>perfecto estado</span> y con sus <span style={highlightStyle}>etiquetas originales</span>.</p>
            </div>
          </div>

          <div style={cardStyle}>
            <div style={iconStyle}><FaTimesCircle /></div>
            <div>
              <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '10px' }}>⚠️ Reembolsos</h3>
              <p><span style={highlightStyle}>No se realizan devoluciones de dinero</span>, solo se permiten cambios por otro producto de la tienda.</p>
              <br />
              <p>Los costos de envío asociados al cambio corren por cuenta del cliente, excepto en situaciones donde exista un <span style={highlightStyle}>defecto de fábrica</span>.</p>
            </div>
          </div>

          <div style={cardStyle}>
            <div style={iconStyle}><FaTools /></div>
            <div>
              <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '10px' }}>⚙️ Productos con Defecto</h3>
              <p>Si recibes un producto con algún defecto de fabricación, debes <span style={highlightStyle}>reportarlo dentro de las primeras 48 horas</span> después de la entrega.</p>
              <br />
              <p>En este escenario, <span style={highlightStyle}>nosotros asumimos el costo total del cambio</span> sin cargo adicional para ti.</p>
            </div>
          </div>

          <div style={cardStyle}>
            <div style={iconStyle}><FaHeadset /></div>
            <div>
              <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '10px' }}>📲 Atención al Cliente</h3>
              <p>Para cualquier solicitud o duda, puedes contactarnos a través de nuestra línea de <span style={highlightStyle}>WhatsApp</span> o mediante nuestras <span style={highlightStyle}>redes sociales</span> oficiales.</p>
              <br />
              <p>Estamos atentos para brindarte la mejor experiencia de compra.</p>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default PoliticasCambios;
