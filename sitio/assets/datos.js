/* Tránsfer! · Datos de la tienda (24 nov 2026). Es la única fuente: tienda, ficha, personalizador, carrito y
   textos leen de aquí. Para cambiar un precio, un color o una talla se cambia SOLO en este archivo. */
(() => {
  const REC = '../img/recortes/', ILUS = '../img/ilus/';
  const ROPA = [['Blanco', '#FFFFFF'], ['Negro', '#1E1F24'], ['Azul', '#1D3C78'], ['Rojo', '#D0202E'], ['Verde', '#1F8A4C'], ['Gris', '#B8BCC4'], ['Amarillo', '#F4C430'], ['Rosado', '#F3A0BE'], ['Naranja', '#F07C1E']];
  const GORRA = [['Rojo', '#D0202E'], ['Celeste', '#7CC6EE'], ['Amarillo', '#F4C430'], ['Verde', '#1F8A4C'], ['Negro', '#1E1F24'], ['Blanco', '#FFFFFF'], ['Naranja', '#F07C1E']];
  const BLANCO = [['Blanco', '#FFFFFF']];
  const TALLAS = ['S', 'M', 'L', 'XL', 'XXL', 'Niño'];
  const desde6 = menos => ({desde: 6, menos});

  // precio: una unidad por un lado · dos: por los dos lados · baja: lo que se descuenta por unidad desde 6
  // perso: prenda del personalizador; sin perso, el cliente manda su foto o su idea
  const PRODUCTOS = [
    {id: 'camiseta-durazno', sku: 'SUB-004', nombre: 'Camiseta piel de durazno', corto: 'Piel de durazno', cat: 'Camisetas', sub: 'Tela piel de durazno', img: REC + 'prod-camiseta-durazno.webp', tono: 't-amarillo', colores: ROPA, tallas: TALLAS, precio: 17000, dos: 22000, baja: desde6(1000), perso: 'camiseta', tecnica: 'DTF', detalle: 'Camiseta en tela piel de durazno. Se estampa por un lado o por los dos.'},
    {id: 'camiseta-algodon', sku: 'SUB-005', nombre: 'Camiseta tacto algodón', corto: 'Tacto algodón', cat: 'Camisetas', sub: 'Tela tacto algodón', img: REC + 'prod-camiseta-blanca.webp', tono: 't-azul', colores: ROPA, tallas: TALLAS, precio: 28000, dos: 32000, baja: desde6(1000), perso: 'camiseta', tecnica: 'DTF', detalle: 'Camiseta en tela tacto algodón. Se estampa por un lado o por los dos.'},
    {id: 'camiseta-oversize', sku: 'SUB-006', nombre: 'Camiseta oversize', corto: 'Oversize', cat: 'Camisetas', sub: 'Corte amplio', img: REC + 'prod-camiseta-negra.webp', tono: 't-vino', colores: ROPA, tallas: TALLAS, precio: 30000, dos: 35000, baja: desde6(1000), perso: 'camiseta', tecnica: 'DTF', detalle: 'Camiseta de corte oversize. Se estampa por un lado o por los dos.'},
    {id: 'buzo', sku: '', nombre: 'Buzo con capota', corto: 'Buzo', cat: 'Buzos', sub: 'Algodón, con capota', img: REC + 'prod-buzo-azul.webp', tono: 't-amarillo', colores: ROPA, tallas: TALLAS, precio: 70000, dos: 75000, baja: desde6(2000), perso: 'buzo', tecnica: 'DTF', detalle: 'Buzo de algodón con capota. Se estampa por un lado o por los dos.'},
    {id: 'polo', sku: 'SUB-007', nombre: 'Camiseta tipo polo', corto: 'Polo', cat: 'Polos', sub: 'Para dotación y equipos', img: REC + 'prod-polo-azul.webp', tono: 't-cian', colores: ROPA, tallas: TALLAS, precio: 40000, dos: 45000, baja: desde6(1000), perso: 'polo', tecnica: 'DTF', detalle: 'Camiseta tipo polo, con cuello. Se estampa por un lado o por los dos.'},
    {id: 'gorra-trucker', sku: 'SUB-008', nombre: 'Gorra de frente blanco', corto: 'Frente blanco', cat: 'Gorras', sub: 'Malla atrás, frente blanco', img: REC + 'prod-gorra-trucker.webp', tono: 't-cian', colores: GORRA, precio: 17000, baja: desde6(1000), perso: 'gorra', tecnica: 'DTF', detalle: 'Gorra de malla con el frente blanco, para que tu diseño resalte.'},
    {id: 'gorra-color', sku: 'SUB-009', nombre: 'Gorra de color', corto: 'De color', cat: 'Gorras', sub: 'Malla, de un solo color', img: REC + 'prod-gorra-color.webp', tono: 't-amarillo', colores: GORRA, precio: 17000, baja: desde6(1000), perso: 'gorra', tecnica: 'DTF', detalle: 'Gorra de malla de un solo color, con tu diseño al frente.'},
    {id: 'mug', sku: 'SUB-001', nombre: 'Mug blanco 11 oz', corto: 'Blanco', cat: 'Mugs', sub: 'Estampado de asa a asa', img: REC + 'prod-mug.webp', tono: 't-vino', colores: BLANCO, precio: 15000, baja: desde6(1000), perso: 'mug', tecnica: 'Sublimación', detalle: 'Mug de 11 onzas, estampado de asa a asa.'},
    {id: 'mug-color', sku: 'SUB-003', nombre: 'Mug con interior y asa de color 11 oz', corto: 'Interior y asa de color', cat: 'Mugs', sub: 'Interior y asa de color', img: REC + 'prod-mug-color.webp', tono: 't-azul', colores: [['Amarillo', '#FECF03']], precio: 18000, perso: 'mug', tecnica: 'Sublimación', detalle: 'Mug de 11 onzas con el interior y el asa de color, estampado de asa a asa. Dinos qué color quieres y te confirmamos si lo tenemos.'},
    {id: 'mug-magico', sku: 'SUB-002', nombre: 'Mug mágico 11 oz', corto: 'Mágico', cat: 'Mugs', sub: 'El diseño aparece con el calor', img: REC + 'prod-mug-magico.webp', tono: 't-amarillo', colores: BLANCO, precio: 25000, perso: 'mug', tecnica: 'Sublimación', detalle: 'Mug mágico de 11 onzas: tu diseño aparece cuando le sirves algo caliente.'},
    {id: 'tomatodo', sku: 'SUB-010', nombre: 'Tomatodo de aluminio 600 ml', corto: 'Aluminio 600 ml', cat: 'Termos', sub: 'Aluminio, 600 ml', img: REC + 'prod-tomatodo.webp', tono: 't-cian', colores: BLANCO, precio: 35000, perso: 'termo', tecnica: 'Sublimación', detalle: 'Tomatodo blanco de aluminio de 600 ml, estampado completo.'},
    {id: 'termo-acero', sku: 'SUB-011', nombre: 'Termo de acero inoxidable 500 ml', corto: 'Acero 500 ml', cat: 'Termos', sub: 'Acero inoxidable, 500 ml', img: REC + 'prod-termo-acero.webp', tono: 't-vino', colores: BLANCO, precio: 50000, perso: 'termo', tecnica: 'Sublimación', detalle: 'Termo blanco de acero inoxidable de 500 ml, estampado completo.'},
    {id: 'reno-navidad', sku: 'SUB-012', nombre: 'Reno especial de Navidad', corto: 'Reno de Navidad', cat: 'Termos', sub: 'Acero inoxidable', img: ILUS + 'navidad.webp', tono: 't-amarillo', sinFoto: true, precio: 50000, tecnica: 'Sublimación', detalle: 'Edición de Navidad en acero inoxidable. Escríbenos y te mandamos la foto.'},
    {id: 'portavasos', sku: 'SUB-013', nombre: 'Portavasos en neopreno o MDF', corto: 'Portavasos', cat: 'Accesorios', sub: 'Precio por unidad', img: REC + 'prod-portavasos.webp', tono: 't-azul', opciones: ['Neopreno', 'MDF'], precio: 5000, tecnica: 'Sublimación', detalle: 'Portavasos en neopreno o MDF con tu foto, tu logo o tu frase.'},
    {id: 'llavero', sku: 'SUB-014', nombre: 'Llavero en polímero o MDF', corto: 'Llavero', cat: 'Accesorios', sub: 'Polímero o MDF', img: REC + 'prod-llavero-mdf.webp', tono: 't-vino', opciones: ['Polímero', 'MDF'], precio: 8000, tecnica: 'Sublimación', detalle: 'Llavero en polímero o MDF con tu foto, tu logo o tu frase.'},
    {id: 'lapicero', sku: 'SUB-015', nombre: 'Lapicero personalizado', corto: 'Lapicero', cat: 'Accesorios', sub: 'Con tu nombre o tu logo', img: REC + 'prod-lapicero.webp', tono: 't-cian', precio: 15000, tecnica: 'Sublimación', detalle: 'Lapicero con tu nombre o el logo de tu marca.'},
    {id: 'lamina', sku: 'SUB-016', nombre: 'Lámina metálica portarretrato', corto: 'Lámina portarretrato', cat: 'Accesorios', sub: 'Tu foto en metal', img: REC + 'prod-lamina.webp', tono: 't-amarillo', precio: 30000, tecnica: 'Sublimación', detalle: 'Tu foto estampada en una lámina metálica.'},
    {id: 'rompecabezas', sku: 'SUB-017', nombre: 'Rompecabezas personalizado', corto: 'Rompecabezas', cat: 'Accesorios', sub: 'Con tu foto', img: REC + 'prod-rompecabezas.webp', tono: 't-azul', precio: 25000, tecnica: 'Sublimación', detalle: 'Rompecabezas con tu foto o tu diseño.'},
  ];
  const producto = id => PRODUCTOS.find(p => p.id === id);
  const pesos = n => '$' + Math.round(n).toLocaleString('es-CO');
  // Precio de cada unidad. `total`: unidades de ese producto en el pedido, sumando tallas y colores
  const unidad = (p, {dosLados = false, total = 1} = {}) => (dosLados && p.dos ? p.dos : p.precio) - (p.baja && total >= p.baja.desde ? p.baja.menos : 0);
  const textoBaja = p => p.baja ? `Desde ${p.baja.desde} unidades, ${pesos(p.baja.menos)} menos por unidad` : '';

  const NEGOCIO = {
    direccion: 'Calle 4 #13a-25, Puerto Madero · Piedecuesta, Santander', referencia: 'Frente a Copetran, papelería Nubeluz',
    mapa: 'https://www.google.com/maps/search/?api=1&query=Calle%204%20%2313a-25%2C%20Puerto%20Madero%2C%20Piedecuesta%2C%20Santander',
    whatsapp: '321 280 8077', correo: 'transferbga@gmail.com', horario: 'Lunes a viernes 8 a. m. a 12 m. y 2 a 5:30 p. m. · Sábados 8 a. m. a 12 m.',
  };
  window.TR_DATOS = {PRODUCTOS, producto, pesos, unidad, textoBaja, NEGOCIO, ROPA, GORRA, BLANCO, TALLAS};
})();
