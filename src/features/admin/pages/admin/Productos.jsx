// src/pages/admin/Productos.jsx
import React, { useState, useEffect } from "react";
// ===== COMPONENTES =====
import Alert from "../../../../shared/components/Alert";
import EntityTable from "../../components/EntityTable";
import SearchInput from "../../../../shared/components/SearchInput";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import UniversalModal from "../../../../shared/components/UniversalModal";
// ===== ICONOS =====
import {
  FaArrowLeft,
  FaPlus,
  FaMinus,
  FaTrash,
  FaTimes,
  FaSave,
  FaEye
} from "react-icons/fa";
// ===== DATOS =====
import { initialProducts, initialSizes } from "../../../../data";

const ProductosPage = () => {
  // =========================
  // ESTADOS PARA CONTROL DE VISTA
  // =========================
  const [modoVista, setModoVista] = useState("lista");
  const [productoEditando, setProductoEditando] = useState(null);
  const [productoViendo, setProductoViendo] = useState(null);

  // =========================
  // ESTADOS PARA LA LISTA
  // =========================
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // =========================
  // ESTADOS PARA MODALES Y ALERTAS
  // =========================
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, producto: null, customMessage: '' });

  // =========================
  // ESTADOS DEL FORMULARIO
  // =========================
  const [formData, setFormData] = useState({
    nombre: "",
    categoria: "BEISBOLERA PREMIUM",
    precioCompra: "",
    precioVenta: "",
    precioOferta: "",
    precioMayorista6: "",
    precioMayorista80: "",
    enOfertaVenta: false,
    descripcion: "",
    enInventario: false,
    isActive: true
  });
  const [tallasStock, setTallasStock] = useState([]);
  const [colores, setColores] = useState([]);
  const [, setAllTallas] = useState([]);
  const [categoriasUnicas, setCategoriasUnicas] = useState(['Todas']);
  const [urlsImagenes, setUrlsImagenes] = useState(['']);
  const [errors, setErrors] = useState({});
  const listaColoresAPI = [
    { name: "AliceBlue", hex: "F0F8FF" }, { name: "AntiqueWhite", hex: "FAEBD7" }, { name: "Aqua", hex: "00FFFF" },
    { name: "Aquamarine", hex: "7FFFD4" }, { name: "Azure", hex: "F0FFFF" }, { name: "Beige", hex: "F5F5DC" },
    { name: "Bisque", hex: "FFE4C4" }, { name: "Black", hex: "000000" }, { name: "BlanchedAlmond", hex: "FFEBCD" },
    { name: "Blue", hex: "0000FF" }, { name: "BlueViolet", hex: "8A2BE2" }, { name: "Brown", hex: "A52A2A" },
    { name: "Burlywood", hex: "DEB887" }, { name: "CadetBlue", hex: "5F9EA0" }, { name: "Chartreuse", hex: "7FFF00" },
    { name: "Chocolate", hex: "D2691E" }, { name: "Coral", hex: "FF7F50" }, { name: "CornflowerBlue", hex: "6495ED" },
    { name: "Cornsilk", hex: "FFF8DC" }, { name: "Crimson", hex: "DC143C" }, { name: "Cyan", hex: "00FFFF" },
    { name: "DarkBlue", hex: "00008B" }, { name: "DarkCyan", hex: "008B8B" }, { name: "DarkGoldenrod", hex: "B8860B" },
    { name: "DarkGray", hex: "A9A9A9" }, { name: "DarkGreen", hex: "006400" }, { name: "DarkGrey", hex: "A9A9A9" },
    { name: "DarkKhaki", hex: "BDB76B" }, { name: "DarkMagenta", hex: "8B008B" }, { name: "DarkOliveGreen", hex: "556B2F" },
    { name: "DarkOrange", hex: "FF8C00" }, { name: "DarkOrchid", hex: "9932CC" }, { name: "DarkRed", hex: "8B0000" },
    { name: "DarkSalmon", hex: "E9967A" }, { name: "DarkSeaGreen", hex: "8FBC8F" }, { name: "DarkSlateBlue", hex: "483D8B" },
    { name: "DarkSlateGray", hex: "2F4F4F" }, { name: "DarkSlateGrey", hex: "2F4F4F" }, { name: "DarkTurquoise", hex: "00CED1" },
    { name: "DarkViolet", hex: "9400D3" }, { name: "DeepPink", hex: "FF1493" }, { name: "DeepSkyBlue", hex: "00BFFF" },
    { name: "DimGray", hex: "696969" }, { name: "DimGrey", hex: "696969" }, { name: "DodgerBlue", hex: "1E90FF" },
    { name: "FireBrick", hex: "B22222" }, { name: "FloralWhite", hex: "FFFAF0" }, { name: "ForestGreen", hex: "228B22" },
    { name: "Fuchsia", hex: "FF00FF" }, { name: "Gainsboro", hex: "DCDCDC" }, { name: "GhostWhite", hex: "F8F8FF" },
    { name: "Gold", hex: "FFD700" }, { name: "Goldenrod", hex: "DAA520" }, { name: "Gray", hex: "808080" },
    { name: "Green", hex: "008000" }, { name: "GreenYellow", hex: "ADFF2F" }, { name: "Grey", hex: "808080" },
    { name: "HoneyDew", hex: "F0FFF0" }, { name: "HotPink", hex: "FF69B4" }, { name: "IndianRed", hex: "CD5C5C" },
    { name: "Indigo", hex: "4B0082" }, { name: "Ivory", hex: "FFFFF0" }, { name: "Khaki", hex: "F0E68C" },
    { name: "Lavender", hex: "E6E6FA" }, { name: "LavenderBlush", hex: "FFF0F5" }, { name: "LawnGreen", hex: "7CFC00" },
    { name: "LemonChiffon", hex: "FFFACD" }, { name: "LightBlue", hex: "ADD8E6" }, { name: "LightCoral", hex: "F08080" },
    { name: "LightCyan", hex: "E0FFFF" }, { name: "LightGoldenrodYellow", hex: "FAFAD2" }, { name: "LightGray", hex: "D3D3D3" },
    { name: "LightGreen", hex: "90EE90" }, { name: "LightGrey", hex: "D3D3D3" }, { name: "LightPink", hex: "FFB6C1" },
    { name: "LightSalmon", hex: "FFA07A" }, { name: "LightSeaGreen", hex: "20B2AA" }, { name: "LightSkyBlue", hex: "87CEFA" },
    { name: "LightSlateGray", hex: "778899" }, { name: "LightSlateGrey", hex: "778899" }, { name: "LightSteelBlue", hex: "B0C4DE" },
    { name: "LightYellow", hex: "FFFFE0" }, { name: "Lime", hex: "00FF00" }, { name: "LimeGreen", hex: "32CD32" },
    { name: "Linen", hex: "FAF0E6" }, { name: "Magenta", hex: "FF00FF" }, { name: "Maroon", hex: "800000" },
    { name: "MediumAquaMarine", hex: "66CDAA" }, { name: "MediumBlue", hex: "0000CD" }, { name: "MediumOrchid", hex: "BA55D3" },
    { name: "MediumPurple", hex: "9370DB" }, { name: "MediumSeaGreen", hex: "3CB371" }, { name: "MediumSlateBlue", hex: "7B68EE" },
    { name: "MediumSpringGreen", hex: "00FA9A" }, { name: "MediumTurquoise", hex: "48D1CC" }, { name: "MediumVioletRed", hex: "C71585" },
    { name: "MidnightBlue", hex: "191970" }, { name: "MintCream", hex: "F5FFFA" }, { name: "MistyRose", hex: "FFE4E1" },
    { name: "Moccasin", hex: "FFE4B5" }, { name: "NavajoWhite", hex: "FFDEAD" }, { name: "Navy", hex: "000080" },
    { name: "OldLace", hex: "FDF5E6" }, { name: "Olive", hex: "808000" }, { name: "OliveDrab", hex: "6B8E23" },
    { name: "Orange", hex: "FFA500" }, { name: "OrangeRed", hex: "FF4500" }, { name: "Orchid", hex: "DA70D6" },
    { name: "PaleGoldenrod", hex: "EEE8AA" }, { name: "PaleGreen", hex: "98FB98" }, { name: "PaleTurquoise", hex: "AFEEEE" },
    { name: "PaleVioletRed", hex: "DB7093" }, { name: "PapayaWhip", hex: "ffefd5" }, { name: "PeachPuff", hex: "ffdab9" },
    { name: "Peru", hex: "cd853f" }, { name: "Pink", hex: "ffc0cb" }, { name: "Plum", hex: "dda0dd" },
    { name: "PowderBlue", hex: "b0e0e6" }, { name: "Purple", hex: "800080" }, { name: "RebeccaPurple", hex: "663399" },
    { name: "Red", hex: "ff0000" }, { name: "RosyBrown", hex: "bc8f8f" }, { name: "RoyalBlue", hex: "4169e1" },
    { name: "SaddleBrown", hex: "8b4513" }, { name: "Salmon", hex: "fa8072" }, { name: "SandyBrown", hex: "f4a460" },
    { name: "SeaGreen", hex: "2e8b57" }, { name: "SeaShell", hex: "fff5ee" }, { name: "Sienna", hex: "a0522d" },
    { name: "Silver", hex: "c0c0c0" }, { name: "SkyBlue", hex: "87ceeb" }, { name: "SlateBlue", hex: "6a5acd" },
    { name: "SlateGray", hex: "708090" }, { name: "SlateGrey", hex: "708090" }, { name: "Snow", hex: "fffafa" },
    { name: "SpringGreen", hex: "00ff7f" }, { name: "SteelBlue", hex: "4682b4" }, { name: "Tan", hex: "d2b48c" },
    { name: "Teal", hex: "008080" }, { name: "Thistle", hex: "d8bfd8" }, { name: "Tomato", hex: "ff6347" },
    { name: "Turquoise", hex: "40e0d0" }, { name: "Violet", hex: "ee82ee" }, { name: "Wheat", hex: "f5deb3" },
    { name: "White", hex: "ffffff" }, { name: "WhiteSmoke", hex: "f5f5f5" }, { name: "Yellow", hex: "ffff00" },
    { name: "YellowGreen", hex: "9acd32" }
  ];

  // =========================
  // CARGAR DATOS INICIALES DESDE EL BACKEND (BD)
  // =========================
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch('https://backend-streen.onrender.com/api/products');
        const resData = await response.json();
        
        if (resData.status === 'success' && resData.data.products) {
          // Adaptamos lo que nos manda PostgreSQL (snake_case) a lo que espera React (camelCase)
          const productosDatabase = resData.data.products.map((product) => ({
            id: product.id_producto,
            nombre: product.nombre,
            categoria: product.categoria_nombre || "BEISBOLERA PREMIUM",
            precioCompra: "",
            precioVenta: product.precio_normal,
            precioOferta: product.precio_descuento,
            precioMayorista6: (product.precio_normal * 0.9).toString(),
            precioMayorista80: (product.precio_normal * 0.8).toString(),
            stock: product.stock,
            enOfertaVenta: product.has_discount || false,
            descripcion: product.descripcion || "",
            tallas: product.tallas || [],
            colores: product.colores || [],
            tallasStock: product.tallas?.map(t => ({ talla: t, cantidad: Math.floor(product.stock / product.tallas.length) })) || [],
            imagenes: product.imagenes || [],
            destacado: product.is_featured || false,
            sales: product.sales_count || 0,
            isActive: product.is_active !== undefined ? product.is_active : true,
            enInventario: false
          }));

          setProductos(productosDatabase);
          setFilteredProductos(productosDatabase);
          const cats = ['Todas', ...new Set(productosDatabase.map(p => p.categoria))];
          setCategoriasUnicas(cats);
        }
      } catch (error) {
        console.error("Error trayendo productos del Backend:", error);
      }
    };

    fetchProductos();
  }, []);

  useEffect(() => {
    const tallasUnicas = initialSizes.map(size => ({
      value: size.value,
      label: size.label
    }));
    setAllTallas(tallasUnicas);
  }, []);

  // =========================
  // FILTRADO Y PAGINACIÓN
  // =========================
  useEffect(() => {
    let filtrados = productos;
    if (searchTerm) {
      filtrados = filtrados.filter(p =>
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (categoriaFiltro !== "Todas") {
      filtrados = filtrados.filter(p => p.categoria === categoriaFiltro);
    }
    setFilteredProductos(filtrados);
    setCurrentPage(1);
  }, [searchTerm, categoriaFiltro, productos]);

  const totalPages = Math.ceil(filteredProductos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredProductos.length);
  const paginatedProductos = filteredProductos.slice(startIndex, endIndex);
  const showingStart = filteredProductos.length > 0 ? startIndex + 1 : 0;

  // =========================
  // FUNCIONES DE UTILIDAD
  // =========================
  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleFilterSelect = (categoria) => {
    setCategoriaFiltro(categoria);
    setCurrentPage(1);
  };

  // =========================
  // FUNCIONES DE TALLAS
  // =========================
  const agregarTalla = () => {
    setTallasStock(prev => [...prev, { talla: "", cantidad: 0 }]);
  };

  const eliminarTalla = (index) => {
    setTallasStock(prev => prev.filter((_, i) => i !== index));
  };

  const handleTallaChange = (index, value) => {
    const nuevasTallas = [...tallasStock];
    nuevasTallas[index].talla = value;
    setTallasStock(nuevasTallas);
  };

  const incrementarCantidad = (index) => {
    const nuevasTallas = [...tallasStock];
    nuevasTallas[index].cantidad += 1;
    setTallasStock(nuevasTallas);
  };

  const decrementarCantidad = (index) => {
    const nuevasTallas = [...tallasStock];
    if (nuevasTallas[index].cantidad > 0) {
      nuevasTallas[index].cantidad -= 1;
      setTallasStock(nuevasTallas);
    }
  };

  const handleCantidadChange = (index, value) => {
    const nuevasTallas = [...tallasStock];
    const numValue = value === "" ? 0 : parseInt(value);
    if (!isNaN(numValue)) {
      nuevasTallas[index].cantidad = numValue;
      setTallasStock(nuevasTallas);
    }
  };

  // =========================
  // FUNCIONES DE URLS DE IMÁGENES
  // =========================
  const agregarUrlImagen = () => {
    if (urlsImagenes.length < 4) {
      setUrlsImagenes(prev => [...prev, '']);
    }
  };

  const eliminarUrlImagen = (index) => {
    if (urlsImagenes.length > 1) {
      setUrlsImagenes(prev => prev.filter((_, i) => i !== index));
    }
  };

  const actualizarUrlImagen = (index, value) => {
    const nuevasUrls = [...urlsImagenes];
    nuevasUrls[index] = value;
    setUrlsImagenes(nuevasUrls);
  };

  // =========================
  // FUNCIONES DE COLORES
  // =========================
  const agregarColor = () => {
    setColores(prev => [...prev, ""]);
  };

  const eliminarColor = (index) => {
    setColores(prev => prev.filter((_, i) => i !== index));
  };

  const handleColorChange = (index, value) => {
    const nuevosColores = [...colores];
    nuevosColores[index] = value;
    setColores(nuevosColores);
  };

  // =========================
  // FUNCIONES PARA CAMBIAR ENTRE VISTAS
  // =========================
  const mostrarLista = () => {
    setModoVista("lista");
    setProductoEditando(null);
    setProductoViendo(null);
    setFormData({
      nombre: "",
      categoria: "BEISBOLERA PREMIUM",
      precioCompra: "",
      precioVenta: "",
      precioOferta: "",
      precioMayorista6: "",
      precioMayorista80: "",
      enOfertaVenta: false,
      descripcion: "",
      enInventario: false,
      isActive: true
    });
    setTallasStock([]);
    setColores([]);
    setUrlsImagenes(['']);
    setErrors({});
  };

  const mostrarFormulario = (producto = null) => {
    if (producto) {
      setProductoEditando(producto);
      setFormData({
        nombre: producto.nombre,
        categoria: producto.categoria,
        precioCompra: producto.precioCompra || "",
        precioVenta: producto.precioVenta,
        precioOferta: producto.precioOferta || "",
        precioMayorista6: producto.precioMayorista6 || "",
        precioMayorista80: producto.precioMayorista80 || "",
        enOfertaVenta: producto.enOfertaVenta || false,
        descripcion: producto.descripcion || "",
        enInventario: producto.enInventario !== undefined ? producto.enInventario : true,
        isActive: producto.isActive !== undefined ? producto.isActive : true
      });
      setColores(producto.colores || []);
      const tallasDelProducto = producto.tallasStock?.length > 0
        ? producto.tallasStock
        : producto.tallas?.map(talla => ({
          talla: talla,
          cantidad: producto.stock ? Math.floor(producto.stock / producto.tallas.length) : 10
        })) || [];
      setTallasStock(tallasDelProducto);
      if (producto.imagenes && producto.imagenes.length > 0) {
        setUrlsImagenes(producto.imagenes);
      } else {
        setUrlsImagenes(['']);
      }
    } else {
      setProductoEditando(null);
      setFormData({
        nombre: "",
        categoria: "BEISBOLERA PREMIUM",
        precioCompra: "",
        precioVenta: "",
        precioOferta: "",
        precioMayorista6: "",
        precioMayorista80: "",
        enOfertaVenta: false,
        descripcion: "",
        enInventario: false,
        isActive: true
      });
      setTallasStock([]);
      setColores([]);
      setUrlsImagenes(['']);
    }
    setErrors({});
    setModoVista("formulario");
  };

  const mostrarDetalle = (producto) => {
    setProductoViendo(producto);
    setModoVista("detalle");
  };

  // =========================
  // FUNCIONES DE ACCIONES CRUD
  // =========================
  const handleAgregarProducto = () => {
    mostrarFormulario();
  };

  const handleEditarProducto = (producto) => {
    mostrarFormulario(producto);
  };

  const handleVerDetalle = (producto) => {
    mostrarDetalle(producto);
  };

  const handleToggleActivo = (producto) => {
    setProductos(prev => prev.map(p =>
      p.id === producto.id ? { ...p, isActive: !p.isActive } : p
    ));
    const nuevoEstado = !producto.isActive;
    showAlert(`Producto ${nuevoEstado ? 'activado' : 'desactivado'} correctamente`, 'success');
  };

  const confirmarEliminacion = (producto) => {
    if (producto.isActive) {
      showAlert(`No se puede eliminar el producto "${producto.nombre}" porque está activo. Desactívelo primero.`, 'error');
      return;
    }
    const mensaje = `¿Estás seguro que deseas eliminar permanentemente el producto "${producto.nombre}"?`;
    setDeleteModal({
      isOpen: true,
      producto,
      customMessage: mensaje
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, producto: null, customMessage: '' });
  };

  const handleDelete = async () => {
    if (deleteModal.producto) {
      try {
        const res = await fetch(`https://backend-streen.onrender.com/api/products/${deleteModal.producto.id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          setProductos(prev => prev.filter(p => String(p.id) !== String(deleteModal.producto.id)));
          showAlert('Producto eliminado permanentemente de Internet', 'delete');
        } else {
          showAlert('Error al eliminar en la Base de Datos', 'error');
        }
      } catch (err) {
        console.error("Error borrando:", err);
        showAlert('Error de conexión con la Nube', 'error');
      }
    }
    closeDeleteModal();
  };

  const handleDesactivar = (producto) => {
    if (producto.isActive) {
      setProductos(prev =>
        prev.map(p =>
          String(p.id) === String(producto.id) ? { ...p, isActive: false } : p
        )
      );
      showAlert(`Producto "${producto.nombre}" desactivado`, 'error');
    }
  };

  const handleReactivar = (producto) => {
    if (!producto.isActive) {
      setProductos(prev =>
        prev.map(p =>
          String(p.id) === String(producto.id) ? { ...p, isActive: true } : p
        )
      );
      showAlert(`Producto "${producto.nombre}" reactivado correctamente`, 'success');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre del producto es obligatorio';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showAlert("Por favor complete los campos obligatorios", "error");
      return;
    }

    const imagenesValidas = urlsImagenes.filter(url => url.trim() !== '');

    if (productoEditando) {
      // === MAGIA BACKEND AQUÍ (ACTUALIZAR EN NUBE) ===
      try {
        const payloadPUT = {
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          precio_normal: formData.precioVenta,
          precio_descuento: formData.precioOferta,
          stock: tallasStock.reduce((acc, curr) => acc + curr.cantidad, 0) || formData.stock || 0,
          id_categoria: 1, 
          tallas: tallasStock.map(t => t.talla),
          colores: colores,
          imagenes: imagenesValidas,
          is_active: formData.isActive,
          has_discount: formData.enOfertaVenta
        };

        const resPUT = await fetch(`https://backend-streen.onrender.com/api/products/${productoEditando.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payloadPUT)
        });

        if (resPUT.ok) {
          const dataBD = await resPUT.json();
          // Actualizar react
          setProductos(prev =>
            prev.map(p => String(p.id) === String(productoEditando.id) ? {
              ...p,
              ...formData,
              tallas: dataBD.data.product.tallas,
              tallasStock: tallasStock,
              imagenes: dataBD.data.product.imagenes,
              isActive: dataBD.data.product.is_active,
              stock: dataBD.data.product.stock
            } : p)
          );
          showAlert(`Producto "${formData.nombre}" actualizado en Internet con éxito`);
        } else {
          const errorData = await resPUT.json();
          showAlert(`Error Nube: ${errorData.message || 'Filtro de seguridad o error interno'}`, 'error');
        }
      } catch (error) {
        console.error(error);
        showAlert('Error de conexión a la Nube al actualizar', 'error');
      }
      setTimeout(() => mostrarLista(), 1500);
    } else {
      // === MAGIA BACKEND AQUÍ (GUARDAR EN NUBE) ===
      try {
        const payload = {
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          precio_normal: formData.precioVenta,
          precio_descuento: formData.precioOferta,
          stock: tallasStock.reduce((acc, curr) => acc + curr.cantidad, 0) || formData.stock || 0,
          id_categoria: 1, // Luego conectamos selector dinámico, ahora forzamos id=1 (Gorras)
          tallas: tallasStock.map(t => t.talla),
          colores: colores,
          imagenes: imagenesValidas,
          has_discount: formData.enOfertaVenta
        };

        const res = await fetch('https://backend-streen.onrender.com/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const dataBD = await res.json();
          // Añadimos visualmente la respuesta oficial de la base de datos a React
          const newBDProd = {
            ...formData,
            id: dataBD.data.product.id_producto,
            tallas: dataBD.data.product.tallas,
            tallasStock: tallasStock,
            imagenes: dataBD.data.product.imagenes,
            isActive: dataBD.data.product.is_active,
            stock: dataBD.data.product.stock,
            destacado: false,
            sales: 0
          };
          setProductos(prev => [newBDProd, ...prev]);
          showAlert(`¡Producto "${formData.nombre}" grabado con éxito en Internet!`, 'success');
        } else {
          const errorData = await res.json();
          showAlert(`Error Nube: ${errorData.message || 'Error desconocido en el servidor'}`, 'error');
        }
      } catch (err) {
        console.error(err);
        showAlert('Error de conexión a la Base de Datos', 'error');
      }
      setTimeout(() => mostrarLista(), 1500);
    }
  };

  // =========================
  // COMPONENTES INTERNOS
  // =========================
  const CategoryFilter = () => {
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
          {categoriaFiltro}
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
            minWidth: '160px',
            maxHeight: '250px',
            overflowY: 'auto',
            zIndex: 1000
          }}>
            {categoriasUnicas.map(cat => (
              <button
                key={cat}
                onClick={() => { handleFilterSelect(cat); setOpen(false); }}
                style={{
                  width: '100%',
                  padding: '4px 10px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#F5C81B',
                  fontSize: '12px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const StatusPill = ({ stock, isActive }) => {
    if (isActive === false) {
      return (
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "3px 8px",
          borderRadius: "10px",
          backgroundColor: '#EF444420',
          color: '#EF4444',
          fontWeight: 600,
          fontSize: "0.65rem",
          border: '1px solid #EF444440',
        }}>
          <span style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: '#EF4444', marginRight: 3 }} />
          Inactivo
        </span>
      );
    }
    const stockColor = stock > 10 ? '#10B981' : stock > 0 ? '#F59E0B' : '#EF4444';
    const stockText = stock > 10 ? 'Disponible' : stock > 0 ? 'Bajo stock' : 'Agotado';

    return (
      <span style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 8px",
        borderRadius: "10px",
        backgroundColor: `${stockColor}20`,
        color: stockColor,
        fontWeight: 600,
        fontSize: "0.65rem",
        border: `1px solid ${stockColor}40`,
      }}>
        <span style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: stockColor, marginRight: 3 }} />
        {stockText}
      </span>
    );
  };

  const Switch = ({ checked, onChange, id, disabled = false }) => (
    <label style={{
      position: 'relative',
      display: 'inline-block',
      width: '36px',
      height: '20px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1
    }}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        style={{
          opacity: 0,
          width: 0,
          height: 0
        }}
      />
      <span style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: checked ? '#F5C81B' : '#4B5563',
        borderRadius: '20px',
        transition: 'background-color 0.2s',
        cursor: disabled ? 'not-allowed' : 'pointer'
      }}>
        <span style={{
          position: 'absolute',
          height: '16px',
          width: '16px',
          left: checked ? '18px' : '2px',
          bottom: '2px',
          backgroundColor: '#000',
          borderRadius: '50%',
          transition: 'left 0.2s',
          boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
        }} />
      </span>
    </label>
  );

  const columns = [
    {
      header: 'Producto',
      field: 'nombre',
      render: (item) => <span style={{ color: '#fff', fontWeight: '500', fontSize: '13px' }}>{item.nombre}</span>
    },
    {
      header: 'Categoría',
      field: 'categoria',
      render: (item) => <span style={{ color: '#9CA3AF', fontSize: '13px' }}>{item.categoria}</span>
    },
    {
      header: 'Precio',
      field: 'precioVenta',
      render: (item) => <span style={{ color: '#F5C81B', fontWeight: '600', fontSize: '13px' }}>${parseInt(item.precioVenta).toLocaleString()}</span>
    },
    {
      header: 'Estado',
      field: 'estado',
      render: (item) => <StatusPill stock={item.stock} isActive={item.isActive} />
    }
  ];

  // =========================
  // COMPONENTE DE VISTA DETALLE
  // =========================
  const DetalleProductoView = () => {
    if (!productoViendo) return null;
    const producto = productoViendo;
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        flex: 1
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: producto.enInventario ? '1fr 1fr' : '1fr',
          gap: '12px',
        }}>
          <div style={{
            backgroundColor: '#111',
            border: '1px solid #333',
            borderRadius: '8px',
            padding: '16px',
            width: '100%'
          }}>
            <h3 style={{ color: '#F5C81B', fontSize: '14px', fontWeight: '600', margin: '0 0 12px 0', textTransform: 'uppercase' }}>
              INFORMACIÓN GENERAL
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#F5C81B', fontWeight: '500', marginBottom: '4px', display: 'block' }}>
                    Nombre
                  </label>
                  <div style={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    color: '#ffffff',
                    fontSize: '13px',
                    width: '100%',
                    minHeight: '38px',
                    boxSizing: 'border-box'
                  }}>
                    {producto.nombre}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#F5C81B', fontWeight: '500', marginBottom: '4px', display: 'block' }}>
                    Categoría
                  </label>
                  <div style={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    color: '#ffffff',
                    fontSize: '13px',
                    width: '100%',
                    minHeight: '38px',
                    boxSizing: 'border-box'
                  }}>
                    {producto.categoria}
                  </div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#F5C81B', fontWeight: '500', marginBottom: '4px', display: 'block' }}>
                  Descripción
                </label>
                <div style={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  color: '#ffffff',
                  fontSize: '13px',
                  width: '100%',
                  minHeight: '38px',
                  boxSizing: 'border-box'
                }}>
                  {producto.descripcion || 'Sin descripción'}
                </div>
              </div>
            </div>
          </div>

          {producto.enInventario && (
            <div style={{
              backgroundColor: '#111',
              border: '1px solid #333',
              borderRadius: '8px',
              padding: '16px',
              width: '100%'
            }}>
              <h4 style={{ color: '#F5C81B', fontSize: '14px', fontWeight: '600', margin: '0 0 12px 0' }}>
                PRECIOS
              </h4>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px'
              }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', color: '#9CA3AF', fontSize: '11px', marginBottom: '4px', fontWeight: '500' }}>
                    Venta
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      padding: '8px',
                      color: '#F5C81B',
                      fontWeight: '600',
                      fontSize: '13px',
                      width: '100%',
                      minHeight: '38px',
                      boxSizing: 'border-box',
                      paddingRight: '55px'
                    }}>
                      ${parseInt(producto.precioVenta).toLocaleString()}
                    </div>
                    {producto.enOfertaVenta && (
                      <div style={{
                        position: 'absolute',
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        backgroundColor: '#F5C81B',
                        color: '#000',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '9px',
                        fontWeight: '700'
                      }}>
                        OFERTA
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', color: '#9CA3AF', fontSize: '11px', marginBottom: '4px', fontWeight: '500' }}>
                    +6
                  </label>
                  <div style={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    padding: '8px',
                    color: '#F5C81B',
                    fontWeight: '600',
                    fontSize: '13px',
                    width: '100%',
                    minHeight: '38px',
                    boxSizing: 'border-box'
                  }}>
                    ${parseInt(producto.precioMayorista6 || 0).toLocaleString()}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', color: '#9CA3AF', fontSize: '11px', marginBottom: '4px', fontWeight: '500' }}>
                    +80
                  </label>
                  <div style={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    padding: '8px',
                    color: '#F5C81B',
                    fontWeight: '600',
                    fontSize: '13px',
                    width: '100%',
                    minHeight: '38px',
                    boxSizing: 'border-box'
                  }}>
                    ${parseInt(producto.precioMayorista80 || 0).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
        }}>
          <div style={{
            backgroundColor: '#111',
            border: '1px solid #333',
            borderRadius: '8px',
            padding: '16px',
            width: '100%'
          }}>
            <h3 style={{ color: '#F5C81B', fontSize: '14px', fontWeight: '600', margin: '0 0 12px 0', textTransform: 'uppercase' }}>
              TALLAS Y STOCK
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
              {producto.tallasStock && producto.tallasStock.length > 0 ? (
                producto.tallasStock.map((item, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#1a1a1a',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #333'
                  }}>
                    <div style={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '10px',
                      color: '#F5C81B',
                      fontSize: '12px',
                      fontWeight: '500',
                      padding: '4px 10px',
                      minWidth: '70px',
                      textAlign: 'center'
                    }}>
                      {item.talla || 'Talla'}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span style={{ color: '#9CA3AF', fontSize: '11px', fontWeight: '500' }}>
                        Cant:
                      </span>
                      <span style={{
                        backgroundColor: '#0f172a',
                        border: '1px solid #334155',
                        borderRadius: '10px',
                        minWidth: '35px',
                        textAlign: 'center',
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: '600',
                        padding: '4px 8px'
                      }}>
                        {item.cantidad}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '20px',
                  color: '#9CA3AF',
                  fontSize: '12px',
                  backgroundColor: '#0a0a0a',
                  borderRadius: '6px',
                  border: '1px dashed #333'
                }}>
                  No hay tallas registradas
                </div>
              )}
            </div>
          </div>

          <div style={{
            backgroundColor: '#111',
            border: '1px solid #333',
            borderRadius: '8px',
            padding: '16px',
            width: '100%'
          }}>
            <h3 style={{ color: '#F5C81B', fontSize: '14px', fontWeight: '600', margin: '0 0 12px 0', textTransform: 'uppercase' }}>
              IMÁGENES
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '200px', overflowY: 'auto' }}>
              {producto.imagenes && producto.imagenes.length > 0 ? (
                producto.imagenes.map((url, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#1a1a1a',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid #333'
                  }}>
                    <span style={{
                      color: '#fff',
                      fontSize: '12px',
                      flex: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {url}
                    </span>
                  </div>
                ))
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '20px',
                  color: '#9CA3AF',
                  fontSize: '12px',
                  backgroundColor: '#0a0a0a',
                  borderRadius: '6px',
                  border: '1px dashed #333'
                }}>
                  No hay imágenes
                </div>
              )}
            </div>

            {producto.imagenes && producto.imagenes.filter(u => u.trim() !== '').length > 0 && (
              <div style={{ marginTop: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                  {producto.imagenes.filter(u => u.trim() !== '').map((url, idx) => (
                    <div key={idx} style={{
                      aspectRatio: '1/1',
                      backgroundColor: '#1e293b',
                      borderRadius: '4px',
                      border: '1px solid #334155',
                      overflow: 'hidden'
                    }}>
                      <img
                        src={url}
                        alt={`Preview ${idx + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #6B7280; font-size: 9px;">Error</div>';
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // =========================
  // RENDER PRINCIPAL
  // =========================
  return (
    <>
      {alert.show && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ show: false, message: '', type: 'success' })}
        />
      )}
      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        entityName="producto"
        entityData={deleteModal.producto}
        customMessage={deleteModal.customMessage}
      />

      <div style={{ display: "flex", flexDirection: "column", padding: "4px 16px 0 16px", flex: 1, height: "100%" }}>
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
                  {modoVista === "formulario" && "Registrar Productos"}
                  {modoVista === "detalle" && "Detalle del Producto"}
                  {modoVista === "lista" && "Productos"}
                </h1>
                <p style={{ color: "#9CA3AF", fontSize: "14px", margin: "4px 0 0 0" }}>
                  {modoVista === "formulario" && 'Complete el formulario para registrar un nuevo producto'}
                  {modoVista === "detalle" && `Información detallada de "${productoViendo?.nombre}"`}
                  {modoVista === "lista" && 'Gestión de productos y stock'}
                </p>
              </div>
            </div>

            {modoVista === "lista" && (
              <button
                onClick={handleAgregarProducto}
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
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#F5C81B20";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                }}
              >
                <FaPlus size={12} />
                Registrar
              </button>
            )}

            {modoVista === "formulario" && (
              <button
                type="submit"
                form="productoForm"
                style={{
                  padding: "6px 12px",
                  backgroundColor: "transparent",
                  border: "1px solid #F5C81B",
                  color: "#F5C81B",
                  borderRadius: "6px",
                  fontSize: "12px",
                  cursor: "pointer",
                  fontWeight: "600"
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#F5C81B20";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                }}
              >
                {productoEditando ? "Actualizar" : "Registrar Producto"}
              </button>
            )}

            {modoVista === "detalle" && (
              <button
                onClick={() => mostrarFormulario(productoViendo)}
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
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#F5C81B20";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                }}
              >
                <FaEye size={12} />
                Editar
              </button>
            )}
          </div>

          {modoVista === "lista" && (
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <SearchInput
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Buscar..."
                  onClear={() => setSearchTerm('')}
                  fullWidth={true}
                  inputStyle={{
                    border: '1px solid #F5C81B',
                    backgroundColor: '#0a0a0a',
                    color: '#fff',
                    borderRadius: '6px',
                    height: '36px',
                    padding: '0 12px',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
              </div>
              <CategoryFilter />
            </div>
          )}
        </div>

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
                entities={paginatedProductos}
                columns={columns}
                onView={handleVerDetalle}
                onEdit={handleEditarProducto}
                onAnular={handleDesactivar}
                onReactivar={handleReactivar}
                onDelete={confirmarEliminacion}
                onToggle={handleToggleActivo}
                showAnularButton={true}
                showDeleteButton={true}
                showReactivarButton={true}
                showToggle={true}
                idField="id"
                estadoField="isActive"
                switchProps={{
                  activeColor: "#10b981",
                  inactiveColor: "#ef4444"
                }}
                moduleType="productos"
                style={{ border: 'none', borderRadius: '0' }}
                tableStyle={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}
                headerStyle={{
                  padding: '10px',
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
              <span>{showingStart}–{endIndex} de {filteredProductos.length}</span>
              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  style={{
                    background: 'transparent',
                    border: '1px solid #F5C81B',
                    color: currentPage === 1 ? '#6B7280' : '#F5C81B',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  }}
                >
                  ‹
                </button>
                <span style={{ padding: '5px 10px', fontWeight: '600', color: '#F5C81B' }}>
                  {currentPage}/{totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  style={{
                    background: 'transparent',
                    border: '1px solid #F5C81B',
                    color: currentPage >= totalPages ? '#6B7280' : '#F5C81B',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                  }}
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        ) : modoVista === "formulario" ? (
          <form
            id="productoForm"
            onSubmit={handleSubmit}
            style={{
              display: 'grid',
              gridTemplateRows: 'auto auto',
              gap: '16px',
              flex: 1,
            }}
          >
            <div style={{
              display: 'grid',
              gridTemplateColumns: formData.enInventario ? '1fr 1fr' : '1fr',
              gap: '16px',
            }}>
              <div style={{
                backgroundColor: '#111',
                border: '1px solid #333',
                borderRadius: '8px',
                padding: '16px',
                width: '100%'
              }}>
                <h3 style={{ color: '#F5C81B', fontSize: '14px', fontWeight: '600', margin: '0 0 12px 0', textTransform: 'uppercase' }}>
                  INFORMACIÓN GENERAL
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '12px', color: '#F5C81B', fontWeight: '500', marginBottom: '4px', display: 'block' }}>
                        Nombre <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        placeholder="Ej: Gorra Yankees"
                        style={{
                          backgroundColor: errors.nombre ? '#451a1a' : '#1e293b',
                          border: `1px solid ${errors.nombre ? '#ef4444' : '#334155'}`,
                          borderRadius: '6px',
                          padding: '8px 12px',
                          color: '#ffffff',
                          fontSize: '13px',
                          width: '100%',
                          outline: 'none',
                          boxSizing: 'border-box',
                          height: '38px'
                        }}
                      />
                      {errors.nombre && (
                        <div style={{ color: '#f87171', fontSize: '11px', marginTop: '4px' }}>{errors.nombre}</div>
                      )}
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', color: '#F5C81B', fontWeight: '500', marginBottom: '4px', display: 'block' }}>
                        Categoría <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <select
                        value={formData.categoria}
                        onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                        style={{
                          backgroundColor: '#1e293b',
                          border: '1px solid #334155',
                          borderRadius: '6px',
                          padding: '8px 12px',
                          color: '#ffffff',
                          fontSize: '13px',
                          width: '100%',
                          outline: 'none',
                          height: '38px'
                        }}
                      >
                        {categoriasUnicas.filter(c => c !== "Todas").map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                    <div>
                      <label style={{ fontSize: '12px', color: '#F5C81B', fontWeight: '500', marginBottom: '4px', display: 'block' }}>
                        Descripción
                      </label>
                      <input
                        type="text"
                        value={formData.descripcion}
                        onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                        placeholder="Descripción..."
                        style={{
                          backgroundColor: '#1e293b',
                          border: '1px solid #334155',
                          borderRadius: '6px',
                          padding: '8px 12px',
                          color: '#ffffff',
                          fontSize: '13px',
                          width: '100%',
                          outline: 'none',
                          boxSizing: 'border-box',
                          height: '38px'
                        }}
                      />
                    </div>

                    <div style={{ marginTop: '4px' }}>
                      <label style={{ fontSize: '12px', color: '#F5C81B', fontWeight: '500', marginBottom: '8px', display: 'block' }}>
                        ¿Este producto se encuentra en tu inventario?
                      </label>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, enInventario: true })}
                          style={{
                            flex: 1,
                            padding: '8px',
                            backgroundColor: formData.enInventario ? '#F5C81B20' : '#1e293b',
                            color: formData.enInventario ? '#F5C81B' : '#fff',
                            border: `1px solid ${formData.enInventario ? '#F5C81B' : '#334155'}`,
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                          }}
                        >
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: formData.enInventario ? '#F5C81B' : '#6B7280' }} />
                          Si
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, enInventario: false })}
                          style={{
                            flex: 1,
                            padding: '8px',
                            backgroundColor: !formData.enInventario ? '#F5C81B20' : '#1e293b',
                            color: !formData.enInventario ? '#F5C81B' : '#fff',
                            border: `1px solid ${!formData.enInventario ? '#F5C81B' : '#334155'}`,
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                          }}
                        >
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: !formData.enInventario ? '#F5C81B' : '#6B7280' }} />
                          No
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {formData.enInventario && (
                  <div style={{
                    backgroundColor: '#111',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    padding: '16px',
                    width: '100%'
                  }}>
                    <h4 style={{ color: '#F5C81B', fontSize: '14px', fontWeight: '600', margin: '0 0 12px 0' }}>
                      PRECIOS
                    </h4>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '10px'
                    }}>
                      <div>
                        <label style={{ display: 'block', color: '#9CA3AF', fontSize: '11px', marginBottom: '4px', fontWeight: '500' }}>
                          Venta (Normal) <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.precioVenta}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            setFormData({ ...formData, precioVenta: value });
                          }}
                          placeholder="0"
                          style={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: '6px',
                            padding: '8px',
                            color: '#fff',
                            fontWeight: '600',
                            fontSize: '13px',
                            width: '100%',
                            outline: 'none',
                            boxSizing: 'border-box',
                            height: '38px',
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', color: '#9CA3AF', fontSize: '11px', marginBottom: '4px', fontWeight: '500' }}>
                          Precio Oferta
                        </label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type="text"
                            value={formData.precioOferta}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^0-9]/g, '');
                              setFormData({ ...formData, precioOferta: value });
                            }}
                            placeholder="0"
                            style={{
                              backgroundColor: '#1e293b',
                              border: '1px solid #334155',
                              borderRadius: '6px',
                              padding: '8px 70px 8px 8px',
                              color: '#F5C81B',
                              fontWeight: '600',
                              fontSize: '13px',
                              width: '100%',
                              outline: 'none',
                              boxSizing: 'border-box',
                              height: '38px',
                            }}
                          />
                          <div style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Switch
                              id="ofertaVenta"
                              checked={formData.enOfertaVenta}
                              onChange={(e) => setFormData({ ...formData, enOfertaVenta: e.target.checked })}
                            />
                            <label htmlFor="ofertaVenta" style={{ color: '#F5C81B', fontSize: '9px', cursor: 'pointer', fontWeight: '600' }}>
                              OFERTA
                            </label>
                          </div>
                        </div>
                      </div>

                      {formData.enOfertaVenta && formData.precioVenta && formData.precioOferta && (
                        <div style={{ 
                          gridColumn: 'span 2', 
                          backgroundColor: '#F5C81B15', 
                          padding: '10px', 
                          borderRadius: '6px', 
                          border: '1px dashed #F5C81B40',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: '10px'
                        }}>
                          <span style={{ fontSize: '11px', color: '#9CA3AF' }}>Descuento:</span>
                          <span style={{ fontSize: '14px', color: '#F5C81B', fontWeight: '700' }}>
                            {Math.round(((parseInt(formData.precioVenta) - parseInt(formData.precioOferta)) / parseInt(formData.precioVenta)) * 100)}% de ahorro
                          </span>
                        </div>
                      )}

                      <div>
                        <label style={{ display: 'block', color: '#9CA3AF', fontSize: '11px', marginBottom: '4px', fontWeight: '500' }}>
                          +6 Unidades
                        </label>
                        <input
                          type="text"
                          value={formData.precioMayorista6}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            setFormData({ ...formData, precioMayorista6: value });
                          }}
                          placeholder="0"
                          style={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: '6px',
                            padding: '8px',
                            color: '#fff',
                            fontSize: '13px',
                            width: '100%',
                            outline: 'none',
                            boxSizing: 'border-box',
                            height: '38px'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', color: '#9CA3AF', fontSize: '11px', marginBottom: '4px', fontWeight: '500' }}>
                          +80 Unidades
                        </label>
                        <input
                          type="text"
                          value={formData.precioMayorista80}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            setFormData({ ...formData, precioMayorista80: value });
                          }}
                          placeholder="0"
                          style={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: '6px',
                            padding: '8px',
                            color: '#fff',
                            fontSize: '13px',
                            width: '100%',
                            outline: 'none',
                            boxSizing: 'border-box',
                            height: '38px'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
            }}>
              {/* SECCIÓN DOBLE: TALLAS Y COLORES (INDEPENDIENTES) */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                marginTop: '16px',
                width: '100%'
              }}>
                {/* COLUMNA IZQUIERDA: TALLAS */}
                <div style={{
                  backgroundColor: '#111',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  padding: '16px',
                  flex: 1
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <h3 style={{ color: '#F5C81B', fontSize: '14px', fontWeight: '600', margin: 0, textTransform: 'uppercase' }}>
                      TALLAS Y STOCK
                    </h3>
                    <button
                      type="button"
                      onClick={agregarTalla}
                      style={{
                        backgroundColor: 'transparent',
                        border: '1px solid #F5C81B',
                        color: '#F5C81B',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <FaPlus size={8} />
                      Agregar
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {tallasStock.map((item, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: '#1a1a1a',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #333'
                      }}>
                        <select
                          value={item.talla}
                          onChange={(e) => handleTallaChange(index, e.target.value)}
                          style={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                            color: '#F5C81B',
                            fontSize: '12px',
                            fontWeight: '500',
                            padding: '6px 8px',
                            minWidth: '60px',
                            maxWidth: '100px',
                            width: 'auto',
                            textAlign: 'center',
                            outline: 'none',
                            height: '34px',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="">Talla</option>
                          <option value="XS">XS</option>
                          <option value="S">S</option>
                          <option value="M">M</option>
                          <option value="L">L</option>
                          <option value="XL">XL</option>
                          <option value="XXL">XXL</option>
                        </select>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
                          <span style={{ color: '#9CA3AF', fontSize: '11px', fontWeight: '500', marginRight: '6px' }}>
                            Cant:
                          </span>
                          <button
                            type="button"
                            onClick={() => decrementarCantidad(index)}
                            style={{
                              backgroundColor: '#1e293b',
                              border: '1px solid #334155',
                              color: '#F5C81B',
                              width: '28px',
                              height: '30px',
                              borderRadius: '8px 0 0 8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              fontSize: '10px'
                            }}
                          >
                            <FaMinus size={8} />
                          </button>
                          <input
                            type="text"
                            value={item.cantidad}
                            onChange={(e) => {
                              const val = e.target.value.replace(/[^0-9]/g, '');
                              handleCantidadChange(index, val);
                            }}
                            style={{
                              backgroundColor: '#0f172a',
                              border: '1px solid #334155',
                              borderLeft: 'none',
                              borderRight: 'none',
                              width: '40px',
                              textAlign: 'center',
                              color: '#fff',
                              fontSize: '13px',
                              fontWeight: '600',
                              padding: '0',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              height: '30px',
                              outline: 'none',
                              boxSizing: 'border-box'
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => incrementarCantidad(index)}
                            style={{
                              backgroundColor: '#1e293b',
                              border: '1px solid #334155',
                              color: '#F5C81B',
                              width: '28px',
                              height: '30px',
                              borderRadius: '0 8px 8px 0',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              fontSize: '10px'
                            }}
                          >
                            <FaPlus size={8} />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => eliminarTalla(index)}
                          style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            width: '28px',
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px'
                          }}
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    ))}

                    {tallasStock.length === 0 && (
                      <div style={{
                        textAlign: 'center',
                        padding: '20px',
                        color: '#9CA3AF',
                        fontSize: '12px',
                        backgroundColor: '#0a0a0a',
                        borderRadius: '6px',
                        border: '1px dashed #333'
                      }}>
                        No hay tallas
                      </div>
                    )}
                  </div>
                </div>

                {/* COLUMNA DERECHA: COLORES */}
                <div style={{
                  backgroundColor: '#111',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  padding: '16px',
                  flex: 1
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h4 style={{ color: '#F5C81B', fontSize: '14px', fontWeight: '600', margin: 0 }}>
                      COLORES
                    </h4>
                    <button
                      type="button"
                      onClick={agregarColor}
                      style={{
                        backgroundColor: 'transparent',
                        border: '1px solid #F5C81B',
                        color: '#F5C81B',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <FaPlus size={8} /> Agregar
                    </button>
                  </div>

                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}>
                    {colores.map((color, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        backgroundColor: '#1a1a1a',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #333'
                      }}>
                        <select
                          value={color}
                          onChange={(e) => handleColorChange(index, e.target.value)}
                          style={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                            color: '#F5C81B',
                            fontSize: '12px',
                            fontWeight: '500',
                            padding: '6px 12px',
                            flex: 1,
                            outline: 'none',
                            height: '34px',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="">Selecciona un color...</option>
                          {listaColoresAPI.map((c) => (
                            <option key={c.name} value={c.name} style={{ backgroundColor: '#111', color: `#${c.hex}` }}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: listaColoresAPI.find(c => c.name === color)?.hex ? `#${listaColoresAPI.find(c => c.name === color).hex}` : 'transparent',
                          border: '1px solid #333'
                        }} />
                        <button
                          type="button"
                          onClick={() => eliminarColor(index)}
                          style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    ))}

                    {colores.length === 0 && (
                      <div style={{
                        textAlign: 'center',
                        padding: '20px',
                        color: '#9CA3AF',
                        fontSize: '12px',
                        backgroundColor: '#0a0a0a',
                        borderRadius: '6px',
                        border: '1px dashed #333'
                      }}>
                        No hay colores añadidos
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div style={{
                backgroundColor: '#111',
                border: '1px solid #333',
                borderRadius: '8px',
                padding: '16px',
                width: '100%'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <h3 style={{ color: '#F5C81B', fontSize: '14px', fontWeight: '600', margin: 0, textTransform: 'uppercase' }}>
                    URLS DE IMÁGENES
                  </h3>
                  {urlsImagenes.length < 4 && (
                    <button
                      type="button"
                      onClick={agregarUrlImagen}
                      style={{
                        backgroundColor: 'transparent',
                        border: '1px solid #F5C81B',
                        color: '#F5C81B',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <FaPlus size={8} />
                      Agregar
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                  {urlsImagenes.map((url, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: '#1a1a1a',
                      padding: '8px',
                      borderRadius: '6px',
                      border: '1px solid #333'
                    }}>
                      <input
                        type="text"
                        value={url}
                        onChange={(e) => actualizarUrlImagen(index, e.target.value)}
                        placeholder={`URL ${index + 1}`}
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: '#fff',
                          fontSize: '12px',
                          flex: 1,
                          outline: 'none'
                        }}
                      />
                      {urlsImagenes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => eliminarUrlImagen(index)}
                          style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '16px'
                          }}
                        >
                          <FaTrash size={16} />
                        </button>
                      )}
                    </div>
                  ))}

                  {urlsImagenes.length === 1 && urlsImagenes[0] === '' && (
                    <div style={{
                      textAlign: 'center',
                      padding: '20px',
                      color: '#9CA3AF',
                      fontSize: '12px',
                      backgroundColor: '#0a0a0a',
                      borderRadius: '6px',
                      border: '1px dashed #333'
                    }}>
                      Agrega URLs (opcional)
                    </div>
                  )}
                </div>

                {urlsImagenes.filter(u => u.trim() !== '').length > 0 && (
                  <div style={{ marginTop: '12px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                      {urlsImagenes.filter(u => u.trim() !== '').map((url, idx) => (
                        <div key={idx} style={{
                          aspectRatio: '1/1',
                          backgroundColor: '#1e293b',
                          borderRadius: '4px',
                          border: '1px solid #334155',
                          overflow: 'hidden'
                        }}>
                          <img
                            src={url}
                            alt={`Preview ${idx + 1}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </form>
        ) : modoVista === "detalle" ? (
          <DetalleProductoView />
        ) : null}
      </div>
    </>
  );
};

export default ProductosPage;
