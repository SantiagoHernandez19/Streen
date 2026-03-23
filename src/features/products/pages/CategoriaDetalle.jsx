// src/pages/CategoriaDetalle.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { initialProducts, initialSizes } from "../../../data";
import Footer from "../../../shared/components/Footer";
import { 
  FaShoppingCart, FaTimes, FaStar, FaRegStar, FaStarHalfAlt, FaArrowLeft, FaMinus, FaPlus, FaCheckCircle
} from "react-icons/fa";

/* =========================
DESCUENTO POR MAYOR (Mismo que en Home)
========================= */
const BULK_MIN_QTY = 6;
const BULK_DISCOUNT = 0.1;

const applyBulkDiscount = (cart) => {
  const totalQty = cart.reduce((acc, it) => acc + (Number(it.quantity) || 0), 0);
  if (totalQty < BULK_MIN_QTY) {
    return cart.map((it) => ({
      ...it,
      price: Number(it.originalPrice ?? it.price),
    }));
  }
  return cart.map((it) => {
    const base = Number(it.originalPrice ?? it.price) || 0;
    const discounted = Math.round(base * (1 - BULK_DISCOUNT));
    return { ...it, originalPrice: base, price: discounted };
  });
};

/* =========================
HELPERS (Mismo que en Home)
========================= */
const clampRating = (r) => {
  const n = Number(r);
  if (Number.isNaN(n)) return null;
  return Math.max(0, Math.min(5, n));
};

const getRatingFromProduct = (p) =>
  clampRating(p?.rating) ??
  clampRating(p?.calificacion) ??
  clampRating(p?.stars) ??
  clampRating(p?.score) ??
  null;

const RatingStars = ({ value }) => {
  if (value == null) return null;
  const full = Math.floor(value);
  const half = value - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    <span className="gm-rating" title={`Calificación: ${value}/5`}>
      {Array.from({ length: full }).map((_, i) => (
        <FaStar key={`f-${i}`} />
      ))}
      {half === 1 && <FaStarHalfAlt key="half" />}
      {Array.from({ length: empty }).map((_, i) => (
        <FaRegStar key={`e-${i}`} />
      ))}
    </span>
  );
};

const normalizeSizes = (product) => {
  const t = product?.tallas;
  if (!t) return [];
  if (Array.isArray(t))
    return t.filter(Boolean).map((x) => String(x).trim()).filter(Boolean);
  if (typeof t === "string")
    return t.split(",").map((s) => s.trim()).filter(Boolean);
  return [];
};

const safeImg = (product) => {
  const first =
    product?.imagenes?.[0]?.trim?.() ||
    product?.imagen?.trim?.() ||
    "https://via.placeholder.com/800x800?text=Sin+Imagen";
  return first;
};

/* =========================
COMPONENT: TARJETA DE PRODUCTO
========================= */
const ProductCard = ({ product, onOpenModal }) => {
  const images = Array.isArray(product.imagenes) && product.imagenes.filter(Boolean).length
    ? product.imagenes.filter(Boolean).map((x) => String(x).trim()).filter(Boolean).slice(0, 4)
    : [safeImg(product)];
  
  const [imgIndex, setImgIndex] = useState(0);
  const imageUrl = images[imgIndex] || images[0];
  const rating = getRatingFromProduct(product);

  const handleImageClick = (e) => {
    e.stopPropagation();
    if (images.length > 1) {
      setImgIndex((prev) => (prev + 1) % images.length);
    }
  };

  return (
    <div className="gm-card">
      <div className="gm-img-wrapper" onClick={handleImageClick}>
        <img
          src={imageUrl}
          alt={product.nombre || "Producto"}
          className="gm-img"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = "https://via.placeholder.com/800x800?text=Sin+Imagen";
          }}
        />
        {(product.hasDiscount || product.oferta) && (
          <span className="gm-badge gm-badge--fill gm-badge--oferta">OFERTA</span>
        )}
        {images.length > 1 && (
          <div className="gm-img-dots">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`gm-dot ${i === imgIndex ? "active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setImgIndex(i);
                }}
              />
            ))}
          </div>
        )}
      </div>
      <div className="gm-info">
        <h3 className="gm-product-name">{product.nombre}</h3>
        <div className="gm-stars-row">
          <RatingStars value={rating} />
        </div>
        <div className="gm-actions-row">
          <span className="gm-price-actions">
            ${Math.round(product.precio || 0).toLocaleString()}
          </span>
          <button
            className="gm-btn gm-btn-cart"
            onClick={(e) => {
              e.stopPropagation();
              onOpenModal(product);
            }}
            type="button"
          >
            <FaShoppingCart size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ======================================================
PÁGINA DETALLE DE CATEGORÍA
====================================================== */
const CategoriaDetalle = ({ updateCart, cartItems }) => {
  const { nombreCategoria } = useParams();
  const [productos, setProductos] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showSizeError, setShowSizeError] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  useEffect(() => {
    const categoria = decodeURIComponent(nombreCategoria).toLowerCase();
    const filtrados = initialProducts.filter(
      (p) => p.categoria.toLowerCase() === categoria && p.isActive !== false
    );
    setProductos(filtrados);
    window.scrollTo(0, 0);
  }, [nombreCategoria]);

  const sizesForModal = selectedProduct ? normalizeSizes(selectedProduct) : [];

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setSelectedSize(null);
    setQuantity(1);
    setShowSizeError(false);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setSelectedSize(null);
    setQuantity(1);
    setShowSizeError(false);
  };

  const handleSizeSelect = (talla) => {
    if (selectedSize === talla) {
      setSelectedSize(null);
    } else {
      setSelectedSize(talla);
      setShowSizeError(false);
    }
  };

  const incrementQuantity = () => {
    if (quantity < 10) setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    if (sizesForModal.length > 0 && !selectedSize) {
      setShowSizeError(true);
      setTimeout(() => setShowSizeError(false), 2000);
      return;
    }

    const size = selectedSize || (sizesForModal.length > 0 ? sizesForModal[0] : "Única");
    const currentCart = Array.isArray(cartItems) ? cartItems : [];

    const cartItem = {
      id: selectedProduct.id,
      name: selectedProduct.nombre,
      originalPrice: Math.round(selectedProduct.precio || 0),
      price: Math.round(selectedProduct.precio || 0),
      image: safeImg(selectedProduct),
      quantity: quantity,
      color: size,
      idUnico: `${selectedProduct.id}-${size}-${Date.now()}`
    };

    const idx = currentCart.findIndex(
      (it) => it.id === cartItem.id && it.color === cartItem.color
    );

    let newCart;
    if (idx > -1) {
      newCart = currentCart.map((item, i) =>
        i === idx ? { ...item, quantity: item.quantity + quantity } : item
      );
    } else {
      newCart = [...currentCart, cartItem];
    }

    const discountedCart = applyBulkDiscount(newCart);
    localStorage.setItem("cart", JSON.stringify(discountedCart));

    if (updateCart) {
      updateCart(discountedCart);
    }

    window.dispatchEvent(new CustomEvent('cartUpdated', { 
      detail: { cart: discountedCart } 
    }));

    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
    closeModal();
  };

  return (
    <div className="gm-home page-container" style={{ background: "var(--gm-bg)" }}>
      
      {/* BANNER SIMPLIFICADO */}
      <section className="gm-hero" style={{ height: 'auto', padding: '120px 20px 40px', background: 'transparent' }}>
        <Link to="/categorias" className="gm-pill-btn" style={{ position: 'absolute', top: '40px', left: '40px' }}>
          <FaArrowLeft /> <span>Volver a Categorías</span>
        </Link>
        <div className="gm-hero-inner">
          <h1 className="gm-hero-title">{decodeURIComponent(nombreCategoria)}</h1>
          <p className="gm-hero-sub">
            Explora nuestra colección exclusiva con los mejores diseños.
          </p>
        </div>
      </section>

      {/* GRID DE PRODUCTOS */}
      <div className="gm-container">
        <div className="gm-grid" style={{ marginTop: '0' }}>
          {productos.map((product) => (
            <div key={product.id} className="gm-slot" style={{ minWidth: 'auto', padding: '0' }}>
              <ProductCard 
                product={product} 
                onOpenModal={handleOpenModal}
              />
            </div>
          ))}
        </div>
      </div>

      {/* MODAL DE PRODUCTO */}
      {selectedProduct && (
        <div className="gm-modal-overlay" onClick={closeModal}>
          <div className="gm-modal" onClick={(e) => e.stopPropagation()}>
            <button className="gm-modal-close" onClick={closeModal} type="button">
              <FaTimes size={18} />
            </button>
            <div className="gm-modal-left">
              <div className="gm-modal-imgbox">
                <img src={safeImg(selectedProduct)} alt={selectedProduct.nombre} className="gm-modal-img" />
              </div>
            </div>
            <div className="gm-modal-right">
              <div className="gm-modal-header-row">
                <div className="gm-modal-title-row">
                  <h2 className="gm-modal-title">{selectedProduct.nombre}</h2>
                  <div className="gm-modal-tags-inline">
                    {(selectedProduct.hasDiscount || selectedProduct.oferta) && (
                      <span className="gm-tag gm-tag--offer">Oferta</span>
                    )}
                  </div>
                </div>
                <div className="gm-price-tags-row">
                  <div className="gm-modal-price-below">
                    ${Math.round(selectedProduct.precio || 0).toLocaleString()}
                  </div>
                </div>
              </div>
              
              <div className="gm-bulk-discount-info">
                A partir de {BULK_MIN_QTY} unidades tienes descuento por mayor
              </div>

              {sizesForModal.length > 0 && (
                <div className="gm-sizes">
                  <div className="gm-sizes-head">
                    <span className="gm-sizes-label">Talla: </span>
                  </div>
                  <div className="gm-sizes-wrap">
                    {sizesForModal.map((t) => (
                      <button
                        key={t}
                        type="button"
                        className={`gm-size-chip ${selectedSize === t ? "is-selected" : ""}`}
                        onClick={() => handleSizeSelect(t)}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  {showSizeError && (
                    <div className="gm-size-error-msg">⚠️ Debes seleccionar una talla primero</div>
                  )}
                </div>
              )}

              <div className="gm-quantity-selector">
                <span className="gm-quantity-label">Cantidad: </span>
                <div className="gm-quantity-controls">
                  <button className="gm-qty-btn" onClick={decrementQuantity} disabled={quantity <= 1}>
                    <FaMinus size={10} />
                  </button>
                  <span className="gm-qty-value">{quantity}</span>
                  <button className="gm-qty-btn" onClick={incrementQuantity} disabled={quantity >= 10}>
                    <FaPlus size={10} />
                  </button>
                </div>
              </div>

              <div className="gm-modal-buttons-row">
                <button 
                  className={`gm-btn-add-cart ${showSizeError ? "gm-btn-error" : ""}`}
                  onClick={handleAddToCart}
                >
                  <FaShoppingCart size={16} /> Añadir al Carrito
                </button>
                <Link to="/cart" className="gm-btn-view-cart-thin" onClick={closeModal}>
                  Ver Carrito
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOAST DE ÉXITO */}
      {showSuccessToast && (
        <div className="success-toast-container">
          <div className="success-toast-content">
            <FaCheckCircle size={24} color="#10B981" />
            <div className="toast-text">
              <h4>¡Agregado con éxito!</h4>
              <p>El producto está en tu carrito</p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        :root {
          --gm-bg: #030712;
          --gm-black: #000;
          --gm-yellow-border: #FFD700;
          --gm-yellow-text: #FFC107;
          --gm-yellow-strong: #FFB300;
          --gm-yellow-solid: #D4A017;
          --gm-yellow-hover: #C59210;
          --gm-blue-dark: #1E3A5F;
          --gm-blue-medium: #152744;
          --gm-blue-light: #2A4A6F;
          --gm-blue-text: #E8F1F8;
          --gm-text: #fff;
          --gm-muted: rgba(255,255,255,.72);
          --gm-error: #ef4444;
        }

        .gm-hero { position: relative; width: 100%; overflow: hidden; background: var(--gm-black); margin-bottom: 30px; }
        .gm-hero-inner { position: relative; z-index: 2; max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; }
        .gm-hero-title { font-size: clamp(2rem, 4vw, 3.5rem); font-weight: 900; margin: 0 0 15px 0; color: var(--gm-text); letter-spacing: 0.4px; text-transform: uppercase; }
        .gm-hero-sub { color: var(--gm-muted); font-size: clamp(0.95rem, 1.2vw, 1.1rem); margin: 0; max-width: 700px; }

        .gm-container { max-width: 1200px; margin: 0 auto; padding: 0 20px 40px 20px; }
        .gm-grid { display: grid; gap: 20px; grid-template-columns: repeat(4, 1fr); margin-top: 20px; }

        /* REUTILIZANDO TODO EL CSS DE HOME (GM-...) */
        .gm-pill-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 18px;
          border-radius: 999px;
          border: 1px solid var(--gm-yellow-border);
          color: var(--gm-yellow-text);
          background: transparent;
          text-decoration: none;
          font-weight: 700;
          font-size: 0.8rem;
          white-space: nowrap;
          transition: 180ms ease;
        }
        .gm-pill-btn:hover { background: rgba(255,215,0,0.08); }

        .gm-card { background: transparent; border-radius: 12px; }
        .gm-img-wrapper { height: 200px; position: relative; overflow: hidden; border-radius: 16px; background: #000; border: 1px solid rgba(255,255,255,0.08); cursor: pointer; }
        .gm-img { width: 100%; height: 100%; object-fit: cover; transition: transform 240ms ease; }
        .gm-img-wrapper:hover .gm-img { transform: scale(1.02); }

        .gm-badge { position: absolute; top: 10px; left: 10px; padding: 6px 10px; border-radius: 12px; font-weight: 900; font-size: 0.72rem; letter-spacing: .4px; border: 1px solid rgba(255,255,255,0.12); color: #0b1220; }
        .gm-badge--oferta { background: linear-gradient(135deg, #FFD700, #E6C85A); }

        .gm-img-dots { position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); display: flex; gap: 8px; z-index: 3; background: rgba(0,0,0,.35); padding: 6px 10px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.10); backdrop-filter: blur(6px); opacity: 0; pointer-events: none; transition: opacity 160ms ease; }
        .gm-img-wrapper:hover .gm-img-dots { opacity: 1; pointer-events: auto; }
        .gm-dot { width: 9px; height: 9px; border-radius: 999px; border: 1px solid var(--gm-yellow-border); background: rgba(0,0,0,0.2); cursor: pointer; }
        .gm-dot.active { background: rgba(255,215,0,0.95); box-shadow: 0 0 10px rgba(255,215,0,.35); }

        .gm-info { padding: 12px 8px 10px 8px; }
        .gm-product-name { margin: 0 0 8px 0; font-size: 0.95rem; font-weight: 400; line-height: 1.25; color: rgba(255,255,255,.92); overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
        .gm-rating { display: inline-flex; gap: 2px; color: rgba(255,215,0, 0.92); }
        .gm-rating svg { width: 14px; height: 14px; }
        .gm-price-actions { font-variant-numeric: tabular-nums; font-family: "Times New Roman", Times, serif; font-size: 1.15rem; font-weight: 900; color: var(--gm-yellow-strong); }
        .gm-actions-row { margin-top: 12px; display: flex; align-items: center; justify-content: space-between; }
        .gm-btn-cart { width: 44px; height: 44px; padding: 0; border-radius: 50%; border: none; background: #FFC107; color: #000; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 180ms ease; }
        .gm-btn-cart:hover { background: #FFB300; transform: scale(1.05); }

        /* MODAL */
        .gm-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.82); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 18px; }
        .gm-modal { position: relative; width: min(900px, 100%); background: #030712; border-radius: 16px; display: flex; gap: 12px; padding: 12px; box-shadow: 0 20px 50px rgba(0,0,0,0.55); border: 1px solid rgba(255,255,255,0.05); }
        .gm-modal-close { position: absolute; top: 10px; right: 10px; width: 32px; height: 32px; border-radius: 50%; border: none; background: transparent; color: #fff; cursor: pointer; z-index: 10; display: flex; align-items: center; justify-content: center; }
        .gm-modal-left { flex: 0 0 45%; min-width: 320px; border-radius: 12px; overflow: hidden; }
        .gm-modal-imgbox { width: 100%; height: 100%; min-height: 380px; background: #000; display: flex; align-items: center; justify-content: center; }
        .gm-modal-img { width: 100%; height: 100%; object-fit: cover; }
        .gm-modal-right { flex: 1; display: flex; flex-direction: column; gap: 10px; padding: 10px; }
        .gm-modal-title { margin: 0; font-size: 1.5rem; font-weight: 500; color: #fff; }
        .gm-modal-price-below { color: var(--gm-yellow-strong); font-weight: 900; font-size: 1.4rem; font-family: "Times New Roman", Times, serif; }
        .gm-tag { padding: 4px 10px; border-radius: 12px; font-weight: 700; font-size: 0.72rem; border: 1px solid rgba(96,165,250,0.35); color: #fff; background: var(--gm-blue-medium); border-color: var(--gm-blue-dark); }
        .gm-bulk-discount-info { font-size: 0.85rem; font-weight: 600; color: var(--gm-blue-text); margin: 2px 0 4px 0; padding: 5px 10px; background: rgba(42,74,111,0.4); border-radius: 6px; }

        .gm-sizes { background: rgba(42,74,111,0.3); border: 1px solid rgba(96,165,250,0.2); border-radius: 12px; padding: 10px; }
        .gm-size-chip { padding: 6px 14px; border-radius: 20px; border: 1px solid rgba(96,165,250,0.3); background: rgba(42,74,111,0.4); color: #fff; font-weight: 600; cursor: pointer; transition: 0.2s; }
        .gm-size-chip.is-selected { background: rgba(255, 215, 0, 0.15); border-color: var(--gm-yellow-border); color: var(--gm-yellow-text); }

        .gm-quantity-controls { display: flex; alignItems: center; border: 1px solid var(--gm-blue-light); border-radius: 20px; overflow: hidden; margin-left: 10px; }
        .gm-qty-btn { width: 32px; height: 32px; border: none; background: rgba(42,74,111,0.6); color: #fff; cursor: pointer; }
        .gm-qty-value { min-width: 40px; text-align: center; font-weight: 900; color: #fff; }

        .gm-modal-buttons-row { display: flex; gap: 10px; margin-top: auto; }
        .gm-btn-add-cart { flex: 2; height: 42px; background: #FFB300; color: #000; font-weight: 700; border-radius: 10px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .gm-btn-view-cart-thin { flex: 1; height: 42px; border: 1.5px solid #FFB300; color: #FFB300; text-decoration: none; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 0.75rem; }

        .success-toast-container { position: fixed; top: 100px; right: 20px; z-index: 10000; animation: slideInRight 0.4s ease-out; }
        .success-toast-content { background: #1e293b; border: 1px solid var(--gm-yellow-border); border-radius: 12px; padding: 16px 20px; display: flex; align-items: center; gap: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }

        @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }

        @media (max-width: 980px) {
          .gm-grid { grid-template-columns: repeat(2, 1fr); }
          .gm-modal { flex-direction: column; width: 95%; max-height: 90vh; overflow-y: auto; }
          .gm-modal-left { min-width: auto; width: 100%; flex: none; }
          .gm-modal-imgbox { min-height: 300px; }
          .gm-modal-buttons-row { flex-direction: column; }
        }
        @media (max-width: 480px) {
          .gm-grid { grid-template-columns: 1fr; }
          .category-title { font-size: 2rem; }
          .gm-pill-btn { top: 20px; left: 20px; }
        }
      `}</style>

      <Footer />
    </div>
  );
};

export default CategoriaDetalle;