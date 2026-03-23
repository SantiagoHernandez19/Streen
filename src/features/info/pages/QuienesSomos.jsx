import React, { useEffect } from 'react';
import Footer from '../../../shared/components/Footer';

const QuienesSomos = () => {
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

  const highlightStyle = {
    color: '#FFC107',
    fontWeight: '600',
  };

  const timelineStyle = {
    position: 'relative',
    paddingLeft: '30px',
    borderLeft: '2px solid rgba(255, 193, 7, 0.3)',
    marginTop: '30px',
  };

  const timelineItemStyle = {
    marginBottom: '30px',
    position: 'relative',
  };

  const timelineDotStyle = {
    position: 'absolute',
    left: '-37px',
    top: '5px',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#FFC107',
    boxShadow: '0 0 10px rgba(255, 193, 7, 0.5)',
  };

  const yearStyle = {
    fontSize: '1.2rem',
    fontWeight: '800',
    color: '#FFC107',
    marginBottom: '5px',
    display: 'block',
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <header style={headerStyle}>
          <h1 style={titleStyle}>Quiénes Somos</h1>
          <p style={{ color: '#94a3b8', fontSize: '1.2rem' }}>Conoce la historia de Gorras Medellín Caps</p>
        </header>

        <section style={sectionStyle}>
          <p>
            <span style={highlightStyle}>Gorras Medellín Caps</span> es una empresa dedicada a la comercialización de gorras de alta calidad, nacida en el corazón de Medellín. Nuestra pasión por el estilo y los accesorios nos ha llevado a consolidarnos como una marca reconocida en el sector.
          </p>
        </section>

        <div style={timelineStyle}>
          <div style={timelineItemStyle}>
            <div style={timelineDotStyle}></div>
            <span style={yearStyle}>2019</span>
            <p>Fundación de la empresa con el objetivo de ofrecer al público una amplia variedad de modelos de gorras, priorizando siempre la calidad y el diseño.</p>
          </div>

          <div style={timelineItemStyle}>
            <div style={timelineDotStyle}></div>
            <span style={yearStyle}>2020</span>
            <p>Debido a los retos de la pandemia, nos transformamos. Optamos por operar exclusivamente de manera virtual a través de <span style={highlightStyle}>WhatsApp</span>, gestionando todas nuestras ventas desde bodega para seguir llegando a nuestros clientes.</p>
          </div>

          <div style={timelineItemStyle}>
            <div style={timelineDotStyle}></div>
            <span style={yearStyle}>2021</span>
            <p>Con la reactivación económica, dimos un gran paso: abrimos nuestro <span style={highlightStyle}>primer punto físico</span> en el barrio Alfonso López de Medellín. Esto nos permitió fortalecer la relación con nuestra comunidad y generar una mayor confianza.</p>
          </div>

          <div style={timelineItemStyle}>
            <div style={timelineDotStyle}></div>
            <span style={yearStyle}>2022</span>
            <p>Alcanzamos la formalización legal mediante nuestro registro en la <span style={highlightStyle}>Cámara de Comercio</span>, consolidándonos como una marca seria y comprometida con el mercado local.</p>
          </div>
        </div>

        <section style={{ ...sectionStyle, marginTop: '50px', textAlign: 'center' }}>
          <p style={{ fontStyle: 'italic', color: '#94a3b8' }}>
            Hoy, ubicados en la <span style={highlightStyle}>Calle 91a #67a-111, Medellín</span>, seguimos trabajando para brindarte la mejor experiencia y los mejores productos.
          </p>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default QuienesSomos;
