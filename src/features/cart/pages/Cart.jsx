import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus, FaShoppingCart, FaTimes, FaArrowLeft, FaWhatsapp } from 'react-icons/fa';
import Footer from '../../../shared/components/Footer';
import jsPDF from 'jspdf';

// ✨ FACTURA MODAL MEJORADA — ESTRECHA, CON LOGO, IVA Y SCROLL
const InvoiceModal = ({ isOpen, onClose, invoiceData }) => {
  if (!isOpen) return null;
  
  const {
    invoiceNumber,
    date,
    customerEmail,
    items,
    subtotal,
    shipping = '',
    total,
    businessName = "GM CAPS",
    businessAddress = "Tienda de Gorras Premium",
    businessEmail = "contacto@gmcaps.com"
  } = invoiceData;

  const handleDownloadPDF = () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    
    doc.setFontSize(18);
    doc.text("FACTURA", 105, 25, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`No. INV-${invoiceNumber}`, 105, 35, { align: 'center' });
    doc.text(`Fecha: ${date}`, 105, 42, { align: 'center' });

    doc.setFontSize(14);
    doc.text(businessName, 20, 60);
    doc.setFontSize(10);
    doc.text(businessAddress, 20, 67);
    doc.text(businessEmail, 20, 74);

    doc.setFontSize(12);
    doc.text("Facturado a:", 20, 90);
    doc.text(customerEmail, 20, 97);

    let yPos = 110;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text("Producto", 20, yPos);
    doc.text("Cant.", 90, yPos);
    doc.text("Precio", 110, yPos);
    doc.text("Total", 140, yPos);
    yPos += 8;

    items.forEach(item => {
      doc.setFont('helvetica', 'normal');
      doc.text(item.name.length > 30 ? item.name.substring(0, 30) + "..." : item.name, 20, yPos);
      doc.text(String(item.quantity), 90, yPos);
      doc.text(`$${item.price.toLocaleString()}`, 110, yPos);
      doc.text(`$${(item.price * item.quantity).toLocaleString()}`, 140, yPos);
      yPos += 7;
    });

    yPos += 10;
    doc.setFont('helvetica', 'bold');
    doc.text("Subtotal:", 120, yPos);
    doc.text(`$${subtotal.toLocaleString()}`, 150, yPos);
    yPos += 7;
    doc.text("Envío:", 120, yPos);
    doc.text(shipping || 'N/A', 150, yPos);
    yPos += 12;
    doc.setFontSize(14);
    doc.text("TOTAL:", 120, yPos);
    doc.setFontSize(16);
    doc.text(`$${total.toLocaleString()}`, 150, yPos);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.text("Gracias por tu compra. Recibirás un correo de confirmación.", 20, yPos + 20);

    doc.save(`factura_GMCAPS_${invoiceNumber}.pdf`);
  };

  const handlePrint = () => window.print();

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.85)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10000,
      padding: '15px'
    }}>
      <div style={{
        background: '#0f172a',
        color: 'white',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '450px',
        maxHeight: '90vh',
        overflowY: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        border: '1px solid #FFC107',
        padding: '20px',
        position: 'relative'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '15px' }}>
          <img
            src="/logo.png"
            alt="Logo GM CAPS"
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '6px',
              border: '1px solid #FFC107',
              objectFit: 'contain'
            }}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/50x50/1E293B/FFC107?text=GM';
            }}
          />
          <h3 style={{
            color: '#FFC107',
            margin: '10px 0 0 0',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            ¡Compra Exitosa!
          </h3>
        </div>

        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'transparent',
            border: 'none',
            color: '#FFC107',
            fontSize: '18px',
            cursor: 'pointer',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255, 193, 7, 0.1)'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          <FaTimes />
        </button>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '15px',
          paddingBottom: '10px',
          borderBottom: '1px solid rgba(255, 193, 7, 0.2)',
          fontSize: '12px'
        }}>
          <div>
            <div style={{ fontWeight: 'bold', color: '#FFC107' }}>{businessName}</div>
            <div>{businessAddress}</div>
            <div>{businessEmail}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 'bold' }}>FACTURA</div>
            <div>No. INV-{invoiceNumber}</div>
            <div>{date}</div>
          </div>
        </div>

        <div style={{
          marginBottom: '15px',
          padding: '8px 0',
          borderBottom: '1px solid rgba(255, 193, 7, 0.2)',
          fontSize: '12px'
        }}>
          <strong>Facturado a:</strong> {customerEmail}
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '6px 0', fontWeight: 'bold' }}>Producto</th>
              <th style={{ textAlign: 'center', padding: '6px 0', fontWeight: 'bold' }}>Cant.</th>
              <th style={{ textAlign: 'right', padding: '6px 0', fontWeight: 'bold' }}>Precio</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(255, 193, 7, 0.1)' }}>
                <td style={{ padding: '7px 0' }}>{item.name}</td>
                <td style={{ textAlign: 'center', padding: '7px 0' }}>{item.quantity}</td>
                <td style={{ textAlign: 'right', padding: '7px 0' }}>
                  ${(item.price * item.quantity).toLocaleString()}
                  {item.quantity > 1 && (
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>
                      c/u ${item.price.toLocaleString()}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: '16px', textAlign: 'right', fontSize: '13px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '5px 0' }}>
            <span>Envío:</span>
            <strong style={{ fontStyle: 'italic' }}>{shipping || 'N/A'}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '15px', color: '#FFC107', fontWeight: 'bold' }}>
            <span>Total:</span>
            <span>${total.toLocaleString()}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '22px' }}>
          <button
            onClick={handleDownloadPDF}
            style={{
              flex: 1,
              padding: '9px',
              backgroundColor: '#fff',
              color: '#000',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            📥 Descargar PDF
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '9px',
              backgroundColor: '#FFC107',
              color: '#000',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Cerrar
          </button>
        </div>

        {/* Mensaje de envío */}
        <div style={{ margin: '16px 0 0 0', padding: '12px', backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ color: '#10B981', fontSize: '12px', fontWeight: '600', margin: '0', lineHeight: '1.5' }}>
            🚚 El costo del envío será asumido por el cliente y deberá pagarse directamente a la agencia de envío encargada del domicilio (Inter Rapidísimo, Envía, COONORTE o ZExpress).
          </p>
        </div>
      </div>
    </div>
  );
};

// ✨ MODAL DE CONFIRMACIÓN DE COMPRA
const ConfirmPurchaseModal = ({
  isOpen,
  onConfirm,
  onCancel,
  total,
  subtotal,
  tax,
  itemCount,
  isProcessing = false
}) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.85)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10000,
      padding: '15px'
    }}>
      <div style={{
        background: '#0f172a',
        color: 'white',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '400px',
        border: '1px solid #FFC107',
        padding: '25px',
        position: 'relative'
      }}>
        <button
          onClick={onCancel}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'transparent',
            border: 'none',
            color: '#FFC107',
            fontSize: '18px',
            cursor: 'pointer',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255, 193, 7, 0.1)'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          <FaTimes />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            fontSize: '40px',
            color: '#FFC107',
            marginBottom: '10px'
          }}>
            🛒
          </div>
          <h3 style={{
            color: '#FFC107',
            margin: '0 0 10px 0',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            Confirmar Compra
          </h3>
          <p style={{
            color: '#CBD5E1',
            fontSize: '14px',
            lineHeight: '1.5',
            marginBottom: '5px'
          }}>
            ¿Deseas finalizar la compra por un total de:
          </p>
          <div style={{
            color: '#FFC107',
            fontSize: '20px',
            fontWeight: 'bold',
            margin: '15px 0'
          }}>
            ${total.toLocaleString()}
          </div>
          <p style={{
            color: '#94a3b8',
            fontSize: '12px',
            fontStyle: 'italic'
          }}>
            Se generará una factura con los detalles de tu compra
          </p>
        </div>

        <div style={{
          backgroundColor: 'rgba(255, 193, 7, 0.05)',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '20px',
          fontSize: '12px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span>Productos:</span>
            <span>{itemCount} items</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span>Subtotal:</span>
            <span>${subtotal.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span>IVA (19%):</span>
            <span>${tax.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '5px', borderTop: '1px solid rgba(255, 193, 7, 0.2)' }}>
            <strong>Total:</strong>
            <strong>${total.toLocaleString()}</strong>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: 'transparent',
              border: '1px solid #666',
              borderRadius: '6px',
              color: '#CBD5E1',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.borderColor = '#FFC107';
              e.target.style.color = '#FFC107';
            }}
            onMouseOut={(e) => {
              e.target.style.borderColor = '#666';
              e.target.style.color = '#CBD5E1';
            }}
          >
            Cancelar
          </button>
          
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: '#FFC107',
              border: 'none',
              borderRadius: '6px',
              color: '#000',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.3s ease',
              opacity: isProcessing ? 0.7 : 1
            }}
            onMouseOver={(e) => !isProcessing && (e.target.style.backgroundColor = '#FFD700')}
            onMouseOut={(e) => !isProcessing && (e.target.style.backgroundColor = '#FFC107')}
          >
            {isProcessing ? 'Procesando...' : 'Aceptar'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ✨ COMPONENTES DE ALERTA
const CustomConfirm = ({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  productName,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = "warning"
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          zIndex: 9998,
          animation: 'fadeIn 0.3s ease'
        }}
        onClick={onCancel}
      />
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: '#030712',
        border: '1px solid #FFC107',
        borderRadius: '15px',
        padding: '25px',
        maxWidth: '450px',
        width: '90%',
        zIndex: 9999,
        animation: 'slideUp 0.4s ease'
      }}>
        <button
          onClick={onCancel}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'transparent',
            border: 'none',
            color: '#FFC107',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '5px',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 193, 7, 0.1)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = 'transparent';
          }}
        >
          <FaTimes />
        </button>
        
        <h3 style={{
          color: '#FFC107',
          margin: '0 0 12px 0',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          textAlign: 'center',
          paddingRight: '20px'
        }}>
          {title}
        </h3>
        
        <p style={{
          color: '#CBD5E1',
          marginBottom: '5px',
          fontSize: '0.9rem',
          lineHeight: '1.4',
          textAlign: 'center'
        }}>
          {message}
        </p>

        {productName && (
          <div style={{
            margin: '15px 0 20px 0',
            textAlign: 'center'
          }}>
            <span style={{
              color: '#FFC107',
              fontWeight: 'bold',
              fontSize: '0.95rem',
              display: 'inline',
              padding: '4px 8px',
              backgroundColor: 'rgba(255, 193, 7, 0.08)',
              borderRadius: '4px'
            }}>
              {productName}
            </span>
          </div>
        )}
        
        <div style={{
          display: 'flex',
          gap: '10px',
          marginTop: '20px'
        }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '10px 5px',
              backgroundColor: 'transparent',
              border: '1px solid #666',
              borderRadius: '8px',
              color: '#CBD5E1',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '0.85rem',
              transition: 'all 0.3s ease',
              minHeight: '40px'
            }}
            onMouseOver={(e) => {
              e.target.style.borderColor = '#FFC107';
              e.target.style.color = '#FFC107';
            }}
            onMouseOut={(e) => {
              e.target.style.borderColor = '#666';
              e.target.style.color = '#CBD5E1';
            }}
          >
            {cancelText}
          </button>
          
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: '10px 5px',
              backgroundColor: type === "warning" ? '#FFC107' : '#ff4d4d',
              border: 'none',
              borderRadius: '8px',
              color: '#000',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '0.85rem',
              transition: 'all 0.3s ease',
              minHeight: '40px'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = type === "warning" ? '#FFD700' : '#ff6b6b';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = type === "warning" ? '#FFC107' : '#ff4d4d';
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translate(-50%, -40%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }
      `}</style>
    </>
  );
};

const CenterAlert = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        zIndex: 10000,
        animation: 'fadeIn 0.3s ease'
      }} />
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: '#030712',
        border: '1px solid #4CAF50',
        borderRadius: '15px',
        padding: '25px',
        maxWidth: '350px',
        width: '90%',
        textAlign: 'center',
        zIndex: 10001,
        animation: 'slideUp 0.4s ease'
      }}>
        <div style={{
          fontSize: '2rem',
          marginBottom: '12px',
          color: '#4CAF50'
        }}>
          ✓
        </div>
        
        <h3 style={{
          color: '#4CAF50',
          margin: '0 0 8px 0',
          fontSize: '1.1rem',
          fontWeight: 'bold'
        }}>
          ¡Éxito!
        </h3>
        
        <p style={{
          color: '#CBD5E1',
          marginBottom: '15px',
          fontSize: '0.9rem',
          lineHeight: '1.4'
        }}>
          {message}
        </p>
        
        <div style={{
          fontSize: '0.8rem',
          color: '#666',
          fontStyle: 'italic'
        }}>
          Esta alerta se cerrará automáticamente...
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translate(-50%, -40%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }
      `}</style>
    </>
  );
};

// ✨ DATOS DE MÉTODOS DE PAGO
const PAYMENT_METHODS = [
  { id: 'nequi', name: 'Nequi', img: 'https://res.cloudinary.com/dxc5qqsjd/image/upload/v1773077199/WhatsApp_Image_2026-03-05_at_2.23.11_PM_4_ez06y3.jpg', group: 'upfront', qr: 'https://res.cloudinary.com/dxc5qqsjd/image/upload/v1773337920/WhatsApp_Image_2026-03-12_at_12.49.25_PM_vryssw.jpg' },
  { id: 'bancolombia', name: 'Bancolombia', img: 'https://res.cloudinary.com/dxc5qqsjd/image/upload/v1773079418/WhatsApp_Image_2026-03-09_at_1.01.39_PM_lgtfn2.jpg', group: 'upfront', qr: 'https://res.cloudinary.com/dxc5qqsjd/image/upload/v1773337951/bancolombia_u4ipqc.jpg' },
  { id: 'bold', name: 'Bold', img: 'https://res.cloudinary.com/dxc5qqsjd/image/upload/v1773077199/WhatsApp_Image_2026-03-05_at_2.23.11_PM_2_bjynti.jpg', group: 'upfront', link: 'https://checkout.bold.co/payment/LNK_UT9BG4IVNG' },
  { id: 'contraentrega', name: 'Al recibir (Efectivo)', img: null, group: 'delivery' }
];

// ✨ CHECKOUT MODAL (FLUJO EN 2 PASOS)
const CheckoutModal = ({ isOpen, onClose, onConfirm, total, subtotal, selectedMethod, setSelectedMethod, deliveryType, setDeliveryType, address, setAddress, receiptFile, setReceiptFile, isProcessing, cartItems = [], getProductName: gPN, getProductPrice: gPP }) => {
  const [step, setStep] = React.useState(1);
  const [addressError, setAddressError] = React.useState(false);
  
  // Reset step when modal opens/closes
  React.useEffect(() => {
    if (isOpen) setStep(1);
  }, [isOpen]);

  if (!isOpen) return null;

  const upfrontMethods = PAYMENT_METHODS.filter(m => m.group === 'upfront');
  const otherMethods = PAYMENT_METHODS.filter(m => m.group !== 'upfront');
  const currentMethod = PAYMENT_METHODS.find(m => m.id === selectedMethod);
  const isUpfront = currentMethod?.group === 'upfront';
  const isPickup = deliveryType === 'recoger';
  const isDelivery = deliveryType === 'envio';
  const isContraentrega = selectedMethod === 'contraentrega';
  const isNequi = selectedMethod === 'nequi';
  const isBancolombia = selectedMethod === 'bancolombia';
  const isBold = selectedMethod === 'bold';

  const shippingText = isPickup ? 'recoger en el local' : (isUpfront ? 'no incluido' : 'contraentrega');

  const handleContinue = () => {
    if (!selectedMethod) return;
    if (isDelivery && !address.trim()) {
      setAddressError(true);
      return;
    }
    setAddressError(false);
    // Si es Bold, abrir enlace en nueva pestaña
    if (isBold) {
      window.open(currentMethod.link, '_blank');
    }
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleClose = () => {
    setStep(1);
    onClose();
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.88)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000, padding: '15px' }}>
      <div style={{ background: '#0f172a', color: 'white', borderRadius: '14px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', border: '1px solid #FFC107', padding: '22px', position: 'relative' }}>
        <button onClick={handleClose} style={{ position: 'absolute', top: '12px', right: '12px', background: 'transparent', border: 'none', color: '#FFC107', fontSize: '18px', cursor: 'pointer', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FaTimes />
        </button>

        {/* ========== PASO 1: SELECCIONAR MÉTODO ========== */}
        {step === 1 && (
          <>
            <h3 style={{ color: '#FFC107', textAlign: 'center', fontSize: '17px', margin: '0 0 18px 0' }}>Completa tu pedido</h3>

            {/* Selector de Entrega */}
            <div style={{ marginBottom: '16px' }}>
              <p style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', textAlign: 'center' }}>¿Cómo quieres recibir tu pedido?</p>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                <button onClick={() => setDeliveryType('envio')} style={{ flex: 1, padding: '10px 8px', background: deliveryType === 'envio' ? 'rgba(255,193,7,0.15)' : '#1e293b', border: deliveryType === 'envio' ? '2px solid #FFC107' : '1px solid #334155', borderRadius: '10px', color: deliveryType === 'envio' ? '#FFC107' : '#94a3b8', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}>🚚 Envío a domicilio</button>
                <button onClick={() => { setDeliveryType('recoger'); setAddressError(false); }} style={{ flex: 1, padding: '10px 8px', background: deliveryType === 'recoger' ? 'rgba(255,193,7,0.15)' : '#1e293b', border: deliveryType === 'recoger' ? '2px solid #FFC107' : '1px solid #334155', borderRadius: '10px', color: deliveryType === 'recoger' ? '#FFC107' : '#94a3b8', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}>🏪 Recoger en local</button>
              </div>
            </div>

            {/* Métodos principales centrados */}
            <div style={{ marginBottom: '16px' }}>
              <p style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: 'bold', marginBottom: '10px', textAlign: 'center' }}>Métodos de pago</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '8px' }}>
                {upfrontMethods.map(m => (
                  <button key={m.id} onClick={() => { setSelectedMethod(m.id); setAddressError(false); }} style={{ background: selectedMethod === m.id ? 'rgba(255,193,7,0.15)' : '#1e293b', border: selectedMethod === m.id ? '2px solid #FFC107' : '1px solid #334155', borderRadius: '10px', padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}>
                    <img src={m.img} alt={m.name} style={{ height: '28px', borderRadius: '6px', objectFit: 'contain' }} />
                    <span style={{ color: selectedMethod === m.id ? '#FFC107' : '#94a3b8', fontSize: '12px', fontWeight: '600' }}>{m.name}</span>
                  </button>
                ))}
              </div>

              {/* Mensaje de envío visible en verde */}
              {selectedMethod && isUpfront && !isPickup && (
                <div style={{ margin: '10px 0', padding: '10px 14px', backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', textAlign: 'center' }}>
                  <p style={{ color: '#10B981', fontSize: '12px', fontWeight: '600', margin: 0, lineHeight: '1.5' }}>
                    📦 Le informamos que usted asumirá el costo del envío correspondiente a su pedido.
                  </p>
                </div>
              )}

              <p style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: 'bold', marginTop: '14px', marginBottom: '8px', textAlign: 'center' }}>Otros métodos</p>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                {otherMethods.map(m => (
                  <button key={m.id} onClick={() => { setSelectedMethod(m.id); setAddressError(false); }} style={{ flex: 1, maxWidth: '180px', background: selectedMethod === m.id ? 'rgba(255,193,7,0.15)' : '#1e293b', border: selectedMethod === m.id ? '2px solid #FFC107' : '1px solid #334155', borderRadius: '10px', padding: '10px 8px', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <span style={{ color: selectedMethod === m.id ? '#FFC107' : '#94a3b8', fontSize: '11px', fontWeight: '600', display: 'block', textAlign: 'center' }}>{m.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dirección */}
            {selectedMethod && isDelivery && (
              <div style={{ marginBottom: '14px' }}>
                <label style={{ color: '#e2e8f0', fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                  Dirección de envío <span style={{ color: '#ff4d4d', fontWeight: 'normal' }}>*</span>:
                </label>
                <input type="text" value={address} onChange={(e) => { setAddress(e.target.value); setAddressError(false); }} placeholder={'Ingresa tu dirección completa'} style={{ width: '100%', padding: '10px 12px', backgroundColor: '#1e293b', border: addressError ? '1px solid #ff4d4d' : '1px solid #334155', borderRadius: '8px', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                {addressError && <p style={{ color: '#ff4d4d', fontSize: '11px', margin: '4px 0 0 0' }}>Debes ingresar una dirección de envío</p>}
              </div>
            )}

            {/* Resumen */}
            <div style={{ backgroundColor: 'rgba(255,193,7,0.05)', borderRadius: '8px', padding: '12px', marginBottom: '16px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ color: '#ccc' }}>Subtotal:</span>
                <span style={{ color: '#fff' }}>${subtotal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ color: '#ccc' }}>Envío:</span>
                <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>{shippingText || 'selecciona método'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid rgba(255,193,7,0.2)', fontSize: '14px' }}>
                <strong style={{ color: '#FFC107' }}>Total:</strong>
                <strong style={{ color: '#FFC107' }}>${total.toLocaleString()}</strong>
              </div>
            </div>

            {/* Botones Paso 1 */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleClose} style={{ flex: 1, padding: '11px', backgroundColor: 'transparent', border: '1px solid #666', borderRadius: '8px', color: '#CBD5E1', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>Cancelar</button>
              <button onClick={handleContinue} disabled={!selectedMethod} style={{ flex: 1, padding: '11px', backgroundColor: !selectedMethod ? '#555' : '#FFC107', border: 'none', borderRadius: '8px', color: '#000', fontWeight: 'bold', cursor: !selectedMethod ? 'not-allowed' : 'pointer', fontSize: '13px' }}>
                Continuar
              </button>
            </div>
          </>
        )}

        {/* ========== PASO 2: QR / COMPROBANTE ========== */}
        {step === 2 && (
          <>
            <h3 style={{ color: '#FFC107', textAlign: 'center', fontSize: '17px', margin: '0 0 18px 0' }}>
              {isBold ? 'Completa tu pago con Bold' : (isNequi || isBancolombia) ? `Paga con ${currentMethod?.name}` : 'Confirma tu pedido'}
            </h3>

            {/* QR Nequi */}
            {isNequi && (
              <div style={{ textAlign: 'center', margin: '0 0 16px 0', padding: '16px', backgroundColor: '#fff', borderRadius: '12px' }}>
                <p style={{ color: '#000', fontSize: '13px', fontWeight: 'bold', margin: '0 0 10px 0' }}>Escanea el QR para pagar con Nequi</p>
                <img src={currentMethod.qr} alt="QR Nequi" style={{ width: '220px', height: '220px', objectFit: 'contain', borderRadius: '8px', display: 'block', margin: '0 auto' }} />
              </div>
            )}

            {/* QR Bancolombia */}
            {isBancolombia && (
              <div style={{ textAlign: 'center', margin: '0 0 16px 0', padding: '16px', backgroundColor: '#fff', borderRadius: '12px' }}>
                <p style={{ color: '#000', fontSize: '13px', fontWeight: 'bold', margin: '0 0 10px 0' }}>Escanea el QR para pagar con Bancolombia</p>
                <img src={currentMethod.qr} alt="QR Bancolombia" style={{ width: '220px', height: '220px', objectFit: 'contain', borderRadius: '8px', display: 'block', margin: '0 auto' }} />
              </div>
            )}

            {/* Bold redirigido */}
            {isBold && (
              <div style={{ textAlign: 'center', margin: '0 0 16px 0', padding: '16px', backgroundColor: 'rgba(255,193,7,0.05)', borderRadius: '12px', border: '1px solid rgba(255,193,7,0.2)' }}>
                <p style={{ color: '#e2e8f0', fontSize: '13px', marginBottom: '8px' }}>Se ha abierto la pasarela de Bold en una nueva pestaña.</p>
                <p style={{ color: '#94a3b8', fontSize: '11px' }}>Completa tu pago allí y luego sube el comprobante aquí.</p>
                <a href={currentMethod.link} target="_blank" rel="noopener noreferrer" style={{ color: '#FFC107', fontWeight: 'bold', fontSize: '12px' }}>Abrir Bold nuevamente →</a>
              </div>
            )}

            {/* Mensaje para recoger / envio (contraentrega) */}
            {(isContraentrega || isPickup) && (
              <div style={{ textAlign: 'center', margin: '0 0 16px 0', padding: '16px', backgroundColor: 'rgba(16, 185, 129, 0.08)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <p style={{ color: '#10B981', fontSize: '13px', fontWeight: '600', margin: 0 }}>
                  {isPickup ? '🏪 Podrás recoger tu pedido en nuestro local y pagarlo al instante si así lo elegiste.' : '🚚 Pagarás al recibir tu pedido en la dirección indicada.'}
                </p>
              </div>
            )}

            {/* Comprobante de pago (OBLIGATORIO para métodos de pago adelantado) */}
            {isUpfront && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: '#e2e8f0', fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Comprobante de pago <span style={{ color: '#ff4d4d', fontWeight: 'normal' }}>*</span>:</label>
                <input type="file" accept="image/*" onChange={(e) => setReceiptFile(e.target.files[0] || null)} style={{ width: '100%', padding: '8px', backgroundColor: '#1e293b', border: !receiptFile ? '1px solid #ff4d4d' : '1px solid #334155', borderRadius: '8px', color: '#94a3b8', fontSize: '12px' }} />
                {!receiptFile && <p style={{ color: '#ff4d4d', fontSize: '11px', margin: '4px 0 0 0' }}>Debes adjuntar el comprobante de pago para continuar</p>}
              </div>
            )}

            {/* Lista de productos del pedido */}
            <div style={{ backgroundColor: 'rgba(255,193,7,0.05)', borderRadius: '8px', padding: '12px', marginBottom: '12px', fontSize: '11px' }}>
              <p style={{ color: '#FFC107', fontSize: '12px', fontWeight: 'bold', margin: '0 0 8px 0' }}>Tu pedido:</p>
              {cartItems.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', paddingBottom: '4px', borderBottom: '1px solid rgba(255,193,7,0.1)' }}>
                  <span style={{ color: '#CBD5E1', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>• {gPN ? gPN(item) : (item.nombre || item.name || 'Producto')} x{item.quantity || 1}</span>
                  <span style={{ color: '#FFC107', fontWeight: 'bold', whiteSpace: 'nowrap' }}>${((gPP ? gPP(item) : (item.precio || item.price || 0)) * (item.quantity || 1)).toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Resumen final */}
            <div style={{ backgroundColor: 'rgba(255,193,7,0.05)', borderRadius: '8px', padding: '12px', marginBottom: '16px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ color: '#ccc' }}>Método:</span>
                <span style={{ color: '#FFC107', fontWeight: 'bold' }}>{currentMethod?.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ color: '#ccc' }}>Envío:</span>
                <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>{shippingText}</span>
              </div>
              {address && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ color: '#ccc' }}>Dirección:</span>
                  <span style={{ color: '#fff', fontSize: '11px', maxWidth: '200px', textAlign: 'right' }}>{address}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid rgba(255,193,7,0.2)', fontSize: '14px' }}>
                <strong style={{ color: '#FFC107' }}>Total:</strong>
                <strong style={{ color: '#FFC107' }}>${total.toLocaleString()}</strong>
              </div>
            </div>

            {/* Botones Paso 2 */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleBack} style={{ flex: 1, padding: '11px', backgroundColor: 'transparent', border: '1px solid #666', borderRadius: '8px', color: '#CBD5E1', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>← Volver</button>
              <button onClick={onConfirm} disabled={isProcessing || (isUpfront && !receiptFile)} style={{ flex: 1, padding: '11px', backgroundColor: (isProcessing || (isUpfront && !receiptFile)) ? '#555' : '#FFC107', border: 'none', borderRadius: '8px', color: '#000', fontWeight: 'bold', cursor: (isProcessing || (isUpfront && !receiptFile)) ? 'not-allowed' : 'pointer', fontSize: '13px', opacity: isProcessing ? 0.7 : 1 }}>
                {isProcessing ? 'Procesando...' : 'Confirmar Compra'}
              </button>
            </div>

          </>
        )}
      </div>
      <style>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

// ✨ COMPONENTE PRINCIPAL
const Cart = ({ cartItems = [], updateCart, user }) => {
  const [centerAlert, setCenterAlert] = useState({ visible: false, message: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [productToDeleteName, setProductToDeleteName] = useState('');
  const [showInvoice, setShowInvoice] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [deliveryType, setDeliveryType] = useState('envio');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [receiptFile, setReceiptFile] = useState(null);
  const [selectedDetailProduct, setSelectedDetailProduct] = useState(null);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  
  const navigate = useNavigate();
  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];

  // Texto dinámico de envío
  const getShippingText = () => {
    if (deliveryType === 'recoger') return 'no aplica (recogida)';
    if (!selectedPaymentMethod) return '';
    const method = PAYMENT_METHODS.find(m => m.id === selectedPaymentMethod);
    if (method?.group === 'upfront') return 'no incluido';
    if (method?.group === 'delivery') return 'al recibir (efectivo)';
    return '';
  };

  const handleRemoveFromCart = (productId, productName) => {
    setItemToDelete(productId);
    setProductToDeleteName(productName);
    setShowDeleteConfirm(true);
  };

  const confirmRemoveFromCart = () => {
    const newCart = safeCartItems.filter(item => item.id !== itemToDelete);
    updateCart(newCart);
    setShowDeleteConfirm(false);
    setItemToDelete(null);
    setProductToDeleteName('');
    setCenterAlert({ visible: true, message: 'Producto eliminado con éxito' });
  };

  const updateQuantity = (productId, change) => {
    const newCart = safeCartItems.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    updateCart(newCart);
  };

  const handleClearCart = () => setShowClearConfirm(true);

  const confirmClearCart = () => {
    updateCart([]);
    setShowClearConfirm(false);
    setCenterAlert({ visible: true, message: 'Carrito vaciado con éxito' });
  };

  const calculateTotals = () => {
    if (safeCartItems.length === 0) return { subtotal: 0, total: 0 };
    
    const subtotal = safeCartItems.reduce((sum, item) => {
      const precio = Number(item.precio ?? item.price ?? item.originalPrice ?? 0);
      return sum + (precio * (item.quantity || 1));
    }, 0);
    
    return { subtotal, total: subtotal };
  };

  const { subtotal, total } = calculateTotals();

  const getImageUrl = (item) => {
    if (item.imagen && item.imagen.trim() !== '') return item.imagen;
    if (item.imagenes?.[0]) return item.imagenes[0];
    if (item.image && item.image.trim() !== '') return item.image;
    return 'https://via.placeholder.com/80x80/1E293B/FFC107?text=GM';
  };

  const getProductName = (item) => item.nombre?.trim() || item.name?.trim() || 'Producto sin nombre';
  const getProductPrice = (item) => Number(item.precio ?? item.price ?? item.originalPrice ?? 0);
  const getProductCategory = (item) => item.categoria?.trim() || item.category?.trim() || 'Sin categoría';

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/80x80/1E293B/FFC107?text=GM';
    e.target.alt = 'Imagen no disponible';
  };

  const handleFinishPurchase = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setSelectedPaymentMethod('');
    setDeliveryAddress('');
    setReceiptFile(null);
    setShowCheckout(true);
  };

  const confirmPurchaseFromCheckout = async () => {
    setIsProcessing(true);
    
    try {
      // 1. Preparar Payload para PostgreSQL
      const payloadSale = {
        customer_email: user?.email || 'cliente@anonimo.com',
        subtotal: subtotal,
        total: total,
        metodo_pago: selectedPaymentMethod,
        metodo_envio: deliveryType,
        direccion_envio: deliveryAddress || '',
        comprobante_url: '', // Por ahora no subimos imágenes aquí
        items: safeCartItems.map(item => ({
          id_producto: item.id || item.id_producto,
          talla: item.size || 'Unica',
          cantidad: item.quantity || 1,
          precio_unitario: getProductPrice(item)
        }))
      };

      // 2. Enviar a nuestro super servidor en la Nube
      const res = await fetch('https://backend-streen.onrender.com/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadSale)
      });

      if (!res.ok) {
        throw new Error('Error al enviar pedido a la Base de Datos');
      }

      const dbResponse = await res.json();
      const nroFactura = dbResponse.data?.sale?.id_venta || Date.now().toString();

      // 3. Mostrar Factura
      setShowCheckout(false);
      const invoice = {
        invoiceNumber: nroFactura,
        date: new Date().toLocaleDateString('es-ES'),
        customerEmail: user?.email || 'cliente@anonimo.com',
        items: safeCartItems.map(item => ({
          name: getProductName(item),
          quantity: item.quantity || 1,
          price: getProductPrice(item)
        })),
        subtotal: subtotal,
        shipping: getShippingText(),
        total: total
      };

      setInvoiceData(invoice);
      setShowInvoice(true);
      
      // Actualizar el carrito internamente si es necesario (se limpia al cerrar factura)

    } catch (error) {
      console.error(error);
      setCenterAlert({ visible: true, message: 'Ocurrió un error al procesar tu pago. Inténtalo de nuevo.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const cancelCheckout = () => {
    setShowCheckout(false);
  };

  const closeInvoice = () => {
    setShowInvoice(false);
    setShowFinalMessage(true);
  };

  const closeFinalMessage = () => {
    setShowFinalMessage(false);
    updateCart([]);
  };

  // Renderizado: Carrito vacío
  if (safeCartItems.length === 0) {
    return (
      <div className="page-container" style={{ background: '#030712' }}>
        <section style={{
          background: "#031326",
          padding: "100px 20px 70px",
          textAlign: "center",
          borderBottomLeftRadius: "30px",
          borderBottomRightRadius: "30px",
          position: "relative",
          overflow: "hidden"
        }}>
          {/* ✅ CORREGIDO: Era #FFFF (blanco), ahora es #031326 */}
          <div style={{ position: "absolute", top: "-40px", left: 0, width: "100%", height: "80px", background: "#031326" }} />
          <h1 style={{ color: "white", fontSize: "3rem", fontWeight: "700", marginBottom: "20px" }}>🛒 Carrito de Compras</h1>
          <p style={{ color: "#cbd5e1", fontSize: "1.2rem", maxWidth: "900px", margin: "0 auto", lineHeight: "1.6" }}>
            Gestiona todos tus productos seleccionados en un solo lugar.
          </p>
          <div style={{ position: "absolute", bottom: "-40px", left: 0, width: "100%", height: "80px", background: "#030712", borderTopLeftRadius: "50% 80%", borderTopRightRadius: "50% 80%" }} />
        </section>

        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center', 
          padding: '40px 20px',
          backgroundColor: '#030712'
        }}>
          <div style={{
            textAlign: 'center',
            padding: '30px 20px',
            maxWidth: '500px',
            width: '100%'
          }}>
            <div style={{
              fontSize: '40px',
              color: '#FFC107',
              marginBottom: '20px'
            }}>
              🛒
            </div>
            <h2 style={{
              color: '#FFC107',
              fontSize: '24px',
              marginBottom: '15px',
              fontWeight: 'bold'
            }}>
              Tu carrito está vacío
            </h2>
            <p style={{
              color: '#CBD5E1',
              fontSize: '16px',
              marginBottom: '20px',
              lineHeight: '1.6'
            }}>
              Agrega productos desde la tienda para verlos aquí
            </p>
            <Link 
              to="/" 
              style={{
                backgroundColor: '#FFC107',
                padding: '12px 24px',
                color: '#000',
                fontWeight: 'bold',
                borderRadius: '8px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '16px',
                border: 'none',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#FFD700'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#FFC107'}
            >
              <FaShoppingCart /> Ir a la Tienda
            </Link>
          </div>
        </div>

        <div style={{ 
          marginTop: 'auto',
          paddingTop: '20px',
          paddingBottom: '20px'
        }}>
          <Footer />
        </div>
      </div>
    );
  }

  // Renderizado: Carrito con productos
  return (
    <div className="page-container" style={{ background: '#030712' }}>
      <CustomConfirm 
        isOpen={showClearConfirm} 
        onConfirm={confirmClearCart} 
        onCancel={() => setShowClearConfirm(false)} 
        title="¿Vaciar carrito?" 
        message="¿Estás seguro que deseas eliminar todos los productos del carrito? Esta acción no se puede deshacer." 
        confirmText="Vaciar Carrito" 
        cancelText="Cancelar" 
        type="warning" 
      />
      
      <CustomConfirm 
        isOpen={showDeleteConfirm} 
        onConfirm={confirmRemoveFromCart} 
        onCancel={() => { 
          setShowDeleteConfirm(false); 
          setItemToDelete(null); 
          setProductToDeleteName(''); 
        }} 
        title="¿Eliminar producto?" 
        message="¿Estás seguro que deseas eliminar este producto del carrito?" 
        productName={productToDeleteName} 
        confirmText="Eliminar" 
        cancelText="Cancelar" 
        type="warning" 
      />
      
      <CenterAlert 
        message={centerAlert.message} 
        isVisible={centerAlert.visible} 
        onClose={() => setCenterAlert({ visible: false, message: '' })} 
      />
      
      <CheckoutModal
        isOpen={showCheckout}
        onClose={cancelCheckout}
        onConfirm={confirmPurchaseFromCheckout}
        total={total}
        subtotal={subtotal}
        selectedMethod={selectedPaymentMethod}
        setSelectedMethod={setSelectedPaymentMethod}
        deliveryType={deliveryType}
        setDeliveryType={setDeliveryType}
        address={deliveryAddress}
        setAddress={setDeliveryAddress}
        receiptFile={receiptFile}
        setReceiptFile={setReceiptFile}
        isProcessing={isProcessing}
        cartItems={safeCartItems}
        getProductName={getProductName}
        getProductPrice={getProductPrice}
      />
      
      {showInvoice && invoiceData && (
        <InvoiceModal 
          isOpen={showInvoice} 
          onClose={closeInvoice} 
          invoiceData={invoiceData} 
        />
      )}

      {/* MODAL MENSAJE FINAL */}
      {showFinalMessage && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.88)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10001, padding: '15px' }}>
          <div style={{ background: '#0f172a', color: 'white', borderRadius: '14px', width: '100%', maxWidth: '420px', border: '1px solid #FFC107', padding: '30px', textAlign: 'center' }}>
            <div style={{ fontSize: '50px', marginBottom: '16px' }}>📋</div>
            <h3 style={{ color: '#FFC107', fontSize: '18px', fontWeight: 'bold', margin: '0 0 14px 0' }}>Pedido registrado</h3>
            <p style={{ color: '#CBD5E1', fontSize: '14px', lineHeight: '1.6', margin: '0 0 20px 0' }}>
              Su pedido se encuentra en espera de su revisión. Puede consultar los detalles en su perfil.
            </p>
            <button onClick={closeFinalMessage} style={{ padding: '12px 40px', backgroundColor: '#FFC107', border: 'none', borderRadius: '8px', color: '#000', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', transition: 'all 0.3s ease' }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#FFD700'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#FFC107'}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE DETALLE DE PRODUCTO (SOLO LECTURA) */}
      {selectedDetailProduct && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000, padding: '15px' }} onClick={() => setSelectedDetailProduct(null)}>
          <div style={{ background: '#0f172a', borderRadius: '14px', width: '100%', maxWidth: '500px', border: '1px solid #FFC107', padding: '0', position: 'relative', overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedDetailProduct(null)} style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.5)', border: 'none', color: '#FFC107', fontSize: '18px', cursor: 'pointer', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
              <FaTimes />
            </button>
            <img src={getImageUrl(selectedDetailProduct)} alt={getProductName(selectedDetailProduct)} style={{ width: '100%', height: '280px', objectFit: 'cover' }} onError={handleImageError} />
            <div style={{ padding: '18px' }}>
              <h2 style={{ color: '#FFC107', fontSize: '18px', fontWeight: 'bold', margin: '0 0 10px 0' }}>{getProductName(selectedDetailProduct)}</h2>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', color: '#CBD5E1', backgroundColor: 'rgba(30, 41, 59, 0.7)', padding: '3px 8px', borderRadius: '8px' }}>{getProductCategory(selectedDetailProduct)}</span>
                {selectedDetailProduct.color && <span style={{ fontSize: '11px', color: '#CBD5E1', backgroundColor: 'rgba(30, 41, 59, 0.7)', padding: '3px 8px', borderRadius: '8px' }}>Color: {selectedDetailProduct.color}</span>}
                {selectedDetailProduct.talla && <span style={{ fontSize: '11px', color: '#CBD5E1', backgroundColor: 'rgba(30, 41, 59, 0.7)', padding: '3px 8px', borderRadius: '8px' }}>Talla: {selectedDetailProduct.talla}</span>}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ color: '#94a3b8', fontSize: '13px' }}>Cantidad en carrito:</span>
                <span style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>{selectedDetailProduct.quantity || 1}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid rgba(255,193,7,0.2)' }}>
                <span style={{ color: '#94a3b8', fontSize: '13px' }}>Precio unitario:</span>
                <span style={{ color: '#FFC107', fontSize: '18px', fontWeight: 'bold' }}>${getProductPrice(selectedDetailProduct).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                <span style={{ color: '#94a3b8', fontSize: '13px' }}>Subtotal:</span>
                <span style={{ color: '#FFC107', fontSize: '16px', fontWeight: 'bold' }}>${(getProductPrice(selectedDetailProduct) * (selectedDetailProduct.quantity || 1)).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TÍTULO DEL CARRITO */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '80px 20px 0', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '6px' }}>
          <FaShoppingCart style={{ color: '#FFC107', fontSize: '28px' }} />
          <h1 style={{ color: '#FFFFFF', fontSize: '28px', fontWeight: '700', margin: 0 }}>Carrito de Compras</h1>
        </div>
        <p style={{ color: '#94a3b8', fontSize: '14px', margin: '0' }}>Administra tus productos y avanza en tu compra</p>
      </div>

      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        overflow: 'hidden' 
      }}>
        <div style={{ 
          padding: '15px 20px 20px', 
          maxWidth: '1200px', 
          margin: '0 auto', 
          width: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          overflowY: 'auto', 
          flex: 1
        }}>

          <div style={{ 
            display: 'flex', 
            gap: '20px', 
            flexWrap: 'wrap', 
            justifyContent: 'center'
          }}>
            <div style={{ flex: 1, minWidth: '300px', maxWidth: '700px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h2 style={{ color: '#FFC107', fontSize: '16px', margin: 0 }}>
                  Productos seleccionados ({safeCartItems.length})
                </h2>
              </div>

              {safeCartItems.map((item, index) => {
                const precio = getProductPrice(item);
                const quantity = item.quantity || 1;
                const itemTotal = precio * quantity;
                const productName = getProductName(item);
                
                return (
                  <div 
                    key={index} 
                    style={{ 
                      backgroundColor: '#0f172a', 
                      border: '1px solid rgba(255, 193, 7, 0.4)', 
                      padding: '12px', 
                      borderRadius: '10px', 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: '12px', 
                      marginBottom: '12px' 
                    }}
                  >
                    <img 
                      src={getImageUrl(item)} 
                      alt={productName} 
                      style={{ 
                        width: '80px', 
                        height: '80px', 
                        borderRadius: '6px', 
                        objectFit: 'cover', 
                        border: '1px solid #FFC107',
                        cursor: 'pointer'
                      }} 
                      onError={handleImageError}
                      onClick={() => setSelectedDetailProduct(item)}
                    />
                    <div style={{ flex: 1 }}>
                      <h3 
                        style={{ margin: '0 0 5px 0', color: '#FFC107', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}
                        onClick={() => setSelectedDetailProduct(item)}
                      >
                        {productName}
                      </h3>
                      <div style={{ display: 'flex', gap: '5px', marginBottom: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '10px', color: '#CBD5E1', backgroundColor: 'rgba(30, 41, 59, 0.7)', padding: '2px 6px', borderRadius: '8px' }}>
                          {getProductCategory(item)}
                        </span>
                        {item.color && (
                          <span style={{ fontSize: '10px', color: '#CBD5E1', backgroundColor: 'rgba(30, 41, 59, 0.7)', padding: '2px 6px', borderRadius: '8px' }}>
                            Color: {item.color}
                          </span>
                        )}
                        {item.talla && (
                          <span style={{ fontSize: '10px', color: '#CBD5E1', backgroundColor: 'rgba(30, 41, 59, 0.7)', padding: '2px 6px', borderRadius: '8px' }}>
                            Talla: {item.talla}
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '11px', color: '#ccc' }}>Cantidad:</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <button 
                              onClick={() => updateQuantity(item.id, -1)} 
                              style={{ 
                                width: '22px', 
                                height: '22px', 
                                borderRadius: '4px', 
                                backgroundColor: 'transparent', 
                                border: '1px solid #FFC107', 
                                color: '#FFC107', 
                                cursor: 'pointer', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                fontSize: '10px' 
                              }}
                            >
                              <FaMinus />
                            </button>
                            <span style={{ minWidth: '20px', textAlign: 'center', fontSize: '13px', color: '#FFFFFF', fontWeight: 'bold' }}>
                              {quantity}
                            </span>
                            <button 
                              onClick={() => updateQuantity(item.id, 1)} 
                              style={{ 
                                width: '22px', 
                                height: '22px', 
                                borderRadius: '4px', 
                                backgroundColor: 'transparent', 
                                border: '1px solid #FFC107', 
                                color: '#FFC107', 
                                cursor: 'pointer', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                fontSize: '10px' 
                              }}
                            >
                              <FaPlus />
                            </button>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ color: '#FFC107', fontWeight: 'bold', margin: '0 0 2px 0', fontSize: '12px' }}>
                            ${precio.toLocaleString()} c/u
                          </p>
                          <p style={{ color: '#FFC107', fontWeight: 'bold', margin: 0, fontSize: '14px' }}>
                            ${itemTotal.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleRemoveFromCart(item.id, productName)} 
                      style={{ 
                        background: 'transparent', 
                        border: '1px solid #ff4d4d', 
                        color: '#ff4d4d', 
                        cursor: 'pointer', 
                        padding: '5px 8px', 
                        borderRadius: '4px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '3px', 
                        fontSize: '11px', 
                        fontWeight: 'bold', 
                        transition: 'all 0.3s ease', 
                        alignSelf: 'flex-start' 
                      }} 
                      onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255, 77, 77, 0.1)'} 
                      onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      <FaTrash />
                    </button>
                  </div>
                );
              })}
            </div>

            <div style={{ width: '320px', minWidth: '320px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginBottom: '10px' }}>
                <Link 
                  to="/" 
                  style={{ 
                    background: 'transparent', 
                    border: '1px solid #FFC107', 
                    color: '#FFC107', 
                    cursor: 'pointer', 
                    padding: '6px 12px', 
                    borderRadius: '6px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '5px', 
                    fontSize: '12px', 
                    fontWeight: 'bold',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,193,7,0.1)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <FaArrowLeft style={{ fontSize: '10px' }} /> Seguir comprando
                </Link>
                <button 
                  onClick={handleClearCart} 
                  style={{ 
                    background: 'transparent', 
                    border: '1px solid #ff4d4d', 
                    color: '#ff4d4d', 
                    cursor: 'pointer', 
                    padding: '6px 12px', 
                    borderRadius: '6px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '5px', 
                    fontSize: '12px', 
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,77,77,0.1)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <FaTrash /> Vaciar carrito
                </button>
              </div>
              <div style={{ 
                backgroundColor: '#0f172a', 
                border: '1px solid rgba(255, 193, 7, 0.4)', 
                padding: '15px', 
                borderRadius: '10px', 
                display: 'flex', 
                flexDirection: 'column', 
                height: 'fit-content' 
              }}>
                <h2 style={{ color: '#FFC107', margin: '0 0 12px 0', textAlign: 'center', fontSize: '15px', fontWeight: 'bold' }}>
                  Resumen del Pedido
                </h2>
                
                <div style={{ marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid rgba(255, 193, 7, 0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: '#ccc', fontSize: '11px' }}>Productos:</span>
                    <span style={{ color: '#FFFFFF', fontSize: '11px' }}>{safeCartItems.length} items</span>
                  </div>
                  {safeCartItems.slice(0, 3).map((item, index) => (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '10px', color: '#CBD5E1' }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '140px', paddingRight: '5px' }}>
                        • {getProductName(item)} x{item.quantity || 1}
                      </span>
                      <span style={{ color: '#FFC107', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                        ${(getProductPrice(item) * (item.quantity || 1)).toLocaleString()}
                      </span>
                    </div>
                  ))}
                  {safeCartItems.length > 3 && (
                    <div style={{ fontSize: '10px', color: '#CBD5E1', textAlign: 'center', marginTop: '3px' }}>
                      Y {safeCartItems.length - 3} productos más...
                    </div>
                  )}
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px' }}>
                  <span style={{ color: '#ccc' }}>Subtotal:</span>
                  <span style={{ color: '#FFFFFF', fontWeight: 'bold' }}>${subtotal.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px' }}>
                  <span style={{ color: '#ccc' }}>Envío:</span>
                  <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>{getShippingText() || 'selecciona al pagar'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid rgba(255, 193, 7, 0.2)', fontSize: '14px' }}>
                  <strong style={{ color: '#FFC107' }}>Total:</strong>
                  <strong style={{ color: '#FFC107', fontSize: '16px' }}>${total.toLocaleString()}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
                  <button
                    onClick={handleFinishPurchase}
                    style={{
                      width: '100%',
                      padding: '10px',
                      backgroundColor: '#FFC107',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontSize: '13px',
                      color: '#000',
                      transition: 'all 0.3s ease',
                      whiteSpace: 'nowrap'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#FFD700'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#FFC107'}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Procesando...' : 'Continuar'}
                  </button>
                </div>
              </div>

              {/* MÉTODOS DE PAGO DECORATIVOS */}
              <div style={{ 
                backgroundColor: '#0f172a', 
                border: '1px solid rgba(255, 193, 7, 0.4)', 
                padding: '15px', 
                borderRadius: '10px', 
                marginTop: '12px'
              }}>
                <h3 style={{ color: '#FFC107', margin: '0 0 12px 0', fontSize: '14px', fontWeight: 'bold' }}>Métodos de pago</h3>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <img src="https://res.cloudinary.com/dxc5qqsjd/image/upload/v1773077199/WhatsApp_Image_2026-03-05_at_2.23.11_PM_4_ez06y3.jpg" alt="Nequi" style={{ height: '32px', borderRadius: '6px', objectFit: 'contain' }} />
                  <img src="https://res.cloudinary.com/dxc5qqsjd/image/upload/v1773079418/WhatsApp_Image_2026-03-09_at_1.01.39_PM_lgtfn2.jpg" alt="Bancolombia" style={{ height: '32px', borderRadius: '6px', objectFit: 'contain' }} />
                  <img src="https://res.cloudinary.com/dxc5qqsjd/image/upload/v1773077199/WhatsApp_Image_2026-03-05_at_2.23.11_PM_2_bjynti.jpg" alt="Bold" style={{ height: '32px', borderRadius: '6px', objectFit: 'contain' }} />
                </div>

                <h4 style={{ color: '#94a3b8', margin: '14px 0 8px 0', fontSize: '12px', fontWeight: '600' }}>Otros métodos</h4>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <div style={{ backgroundColor: '#1e293b', padding: '8px 14px', borderRadius: '8px', border: '1px solid #334155' }}>
                    <span style={{ color: '#e2e8f0', fontSize: '12px', fontWeight: '500' }}>Al recibir (Efectivo)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>



        <div style={{ 
          marginTop: 'auto',
          paddingTop: '20px',
          paddingBottom: '20px'
        }}>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Cart;