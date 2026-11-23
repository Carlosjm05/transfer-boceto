/* Tránsfer! · comportamiento común del sitio (boceto v5). Sin librerías. */
(function () {
  const IMG = '../img/', REC = '../img/recortes/', RECURSOS = '../recursos/', ILUS = '../img/ilus/';
  const WA = 'https://wa.me/573212808077?text=';
  const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fino = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ───── Catálogo (lo usan tienda, menú, carrito y producto) ───── */
  const CATALOGO = [
    {id:'buzo-estrella', nombre:'Buzo estrella', cat:'Buzos', img:REC+'prod-buzo-azul.webp', tono:'t-amarillo', sub:'Estampado al frente', color:'Azul', nuevo:true},
    {id:'buzo-espalda', nombre:'Espalda total', cat:'Buzos', img:REC+'prod-buzo-cian-espalda.webp', tono:'t-azul', sub:'Diseño grande atrás', color:'Cian'},
    {id:'buzo-amarillo', nombre:'Buzo sol', cat:'Buzos', img:REC+'prod-buzo-amarillo.webp', tono:'t-azul', sub:'Estrella al pecho', color:'Amarillo', nuevo:true},
    {id:'buzo-vino', nombre:'Buzo constelación', cat:'Buzos', img:REC+'prod-buzo-vino.webp', tono:'t-vino', sub:'Estrellas en la espalda', color:'Vino'},
    {id:'buzo-negro', nombre:'Buzo noche', cat:'Buzos', img:REC+'prod-buzo-negro.webp', tono:'t-amarillo', sub:'DTF en tela oscura', color:'Negro'},
    {id:'camiseta-negra', nombre:'Camiseta negra', cat:'Camisetas', img:REC+'prod-camiseta-negra.webp', tono:'t-vino', sub:'DTF a todo color', color:'Negro'},
    {id:'camiseta-blanca', nombre:'Camiseta clásica', cat:'Camisetas', img:REC+'prod-camiseta-blanca.webp', tono:'t-amarillo', sub:'Tu diseño al pecho', color:'Blanco'},
    {id:'camiseta-cian', nombre:'Camiseta cielo', cat:'Camisetas', img:REC+'prod-camiseta-cian.webp', tono:'t-azul', sub:'Rompecabezas y estrella', color:'Cian', nuevo:true},
    {id:'polo-dotacion', nombre:'Polo de dotación', cat:'Dotación', img:REC+'prod-polo-azul.webp', tono:'t-amarillo', sub:'Logo pequeño al pecho', color:'Azul'},
    {id:'gorra', nombre:'Gorra con parche', cat:'Gorras', img:REC+'prod-gorra.webp', tono:'t-cian', sub:'Tu logo al frente', color:'Azul'},
    {id:'mug', nombre:'Mug sublimado', cat:'Mugs', img:REC+'prod-mug.webp', tono:'t-vino', sub:'Diseño alrededor', color:'Blanco'},
    {id:'termo', nombre:'Termo', cat:'Termos', img:REC+'prod-termo.webp', tono:'t-azul', sub:'Frío o caliente', color:'Cian'},
    {id:'llavero', nombre:'Llavero acrílico', cat:'Llaveros', img:REC+'prod-llavero.webp', tono:'t-amarillo', sub:'Sublimado por ambas caras', color:'Azul'}
  ];
  window.TRANSFER = {CATALOGO, tarjeta, WA};

  const GARABATOS = [
    '<path d="M10 80c20-40 40-60 60-30s30 10 40-20" /><path d="M20 30l12 12M32 30 20 42"/>',
    '<path d="M15 25c25 10 50-10 75 5M20 85c20-15 45 5 70-10"/><circle cx="85" cy="40" r="6"/>',
    '<path d="M12 60q15-30 30 0t30 0 30 0"/><path d="M70 15l6 12 12 2-9 8 2 12-11-6-11 6 2-12-9-8 12-2z"/>'
  ];
  function tarjeta(p, i = 0) {
    return `<a class="tarjeta ${p.tono}" href="producto.html?p=${p.id}" data-cat="${p.cat}" data-color="${p.color}">
      ${p.nuevo ? '<span class="sello-t">Nuevo</span>' : ''}
      <span class="etq">${p.cat}</span><span class="h3">${p.nombre}</span><span class="sub">${p.sub}</span>
      <div class="img"><span class="garabato"><svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">${GARABATOS[i % 3]}</svg></span><img src="${p.img}" alt="${p.nombre} personalizado con estampado" loading="lazy"></div>
      <span class="ir">↗</span></a>`;
  }

  /* ───── Íconos ───── */
  const SVG = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
    <symbol id="estrella" viewBox="0 0 24 24"><path fill="currentColor" d="M12 0c.8 6.4 5.6 11.2 12 12-6.4.8-11.2 5.6-12 12-.8-6.4-5.6-11.2-12-12C6.4 11.2 11.2 6.4 12 0z"/></symbol>
    <symbol id="lapiz" viewBox="0 0 120 60"><path d="M6 44c14-22 26-30 34-24s-6 22 6 22 18-26 30-26 6 20 18 18 14-14 20-20" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></symbol>
    <symbol id="bolsa" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" d="M5 8h14l-1.4 11a2 2 0 0 1-2 1.8H8.4a2 2 0 0 1-2-1.8zM9 8a3 3 0 0 1 6 0"/></symbol>
    <symbol id="lupa" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></g></symbol>
    <symbol id="i-camiseta" viewBox="0 0 24 24"><path fill="currentColor" d="M8 3 3 6l2 4 2-1v12h10V9l2 1 2-4-5-3c-.5 1.5-2 2.5-4 2.5S8.5 4.5 8 3z"/></symbol>
    <symbol id="i-mug" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2.2" d="M4 6h12v10a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4zM16 9h2a3 3 0 0 1 0 6h-2"/></symbol>
    <symbol id="i-gorra" viewBox="0 0 24 24"><path fill="currentColor" d="M3 15c0-5 3.6-9 8.5-9S20 9.6 20 14v1zM20 15h2c0 2-2 3-5 3H6c-2 0-3-1-3-3z"/></symbol>
    <symbol id="i-empresa" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" d="M4 21V5l8-2v18M12 9h8v12M7 8h2M7 12h2M7 16h2M15 13h2M15 17h2"/></symbol>
    <symbol id="i-envio" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" d="M2 7h12v9H2zM14 10h4l3 3v3h-7"/><circle cx="6" cy="18" r="2" fill="currentColor"/><circle cx="17" cy="18" r="2" fill="currentColor"/></symbol>
    <symbol id="i-calor" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" d="M3 14h18v4H3zM6 14V9a6 6 0 0 1 12 0v5M9 4c0 1-1 1.5-1 2.5M13 3c0 1-1 1.5-1 2.5"/></symbol>
    <symbol id="i-pincel" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" d="M14 4l6 6-9 9H5v-6zM12 6l6 6"/></symbol>
    <symbol id="i-chat" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" d="M4 5h16v11H9l-5 4z"/></symbol>
    <symbol id="i-ig" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/></g></symbol>
    <symbol id="i-tt" viewBox="0 0 24 24"><path fill="currentColor" d="M16 3c.4 2.4 2 4 4.5 4.3v3.4c-1.7 0-3.2-.5-4.5-1.4V16a6 6 0 1 1-6-6c.3 0 .7 0 1 .1v3.5a2.6 2.6 0 1 0 1.6 2.4V3z"/></symbol>
    <symbol id="i-fb" viewBox="0 0 24 24"><path fill="currentColor" d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v2H7v4h2v7h4v-7h3l1-4h-4V9c0-.6.4-1 1-1z"/></symbol>
    <symbol id="i-mail" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2.2" d="M3 6h18v12H3zM3 7l9 6 9-6"/></symbol>
    <symbol id="i-pin" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2.2" d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5" fill="currentColor"/></symbol>
    <symbol id="i-wa" viewBox="0 0 32 32"><path fill="currentColor" d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3zm0 23.6c-2 0-4-.6-5.7-1.6l-.4-.2-3.9 1 1-3.8-.3-.4A10.6 10.6 0 1 1 16 26.6zm5.8-7.9c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.2-.7.1a8.7 8.7 0 0 1-4.3-3.8c-.3-.6.3-.5.9-1.7.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.9.4 3.6 3.6 0 0 0-1.1 2.7 6.3 6.3 0 0 0 1.3 3.3c.2.2 2.3 3.5 5.5 4.9 2 .9 2.8.9 3.8.8.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.7-.4z"/></symbol>
  </defs></svg>`;

  const pagina = document.body.dataset.pagina || '';
  const enlaces = [['inicio','index.html','Inicio'],['tienda','tienda.html','Tienda'],['personaliza','personaliza.html','Personaliza'],['navidad','navidad.html','Navidad'],['empresas','empresas.html','Empresas'],['nosotros','nosotros.html','Nosotros'],['contacto','contacto.html','Contacto']];
  const mini = id => CATALOGO.find(p => p.id === id);

  const AVISO = `<div class="aviso cinta"><div class="pista">${[0,1].map(() => '<span>Desde <b>una sola pieza</b></span><span>Envíos a toda <b>Colombia</b></span><span>Estampamos en <b>DTF y sublimación</b></span><span>Pedidos para <b>empresas y colegios</b></span><span>Separa tus camisetas de <b>Navidad</b></span><span>Míralo puesto <b>antes de pedir</b></span><span>Hecho en <b>Piedecuesta, Santander</b></span>').join('')}</div></div>`;

  const MEGA = `<div class="mega">
      <div><h5>Prendas</h5><a href="tienda.html#Buzos"><img src="${mini('buzo-estrella').img}" alt="">Buzos</a><a href="tienda.html#Camisetas"><img src="${mini('camiseta-blanca').img}" alt="">Camisetas</a><a href="tienda.html#Dotación"><img src="${mini('polo-dotacion').img}" alt="">Dotación</a></div>
      <div><h5>Accesorios</h5><a href="tienda.html#Gorras"><img src="${mini('gorra').img}" alt="">Gorras</a><a href="tienda.html#Llaveros"><img src="${mini('llavero').img}" alt="">Llaveros</a></div>
      <div><h5>Hogar y oficina</h5><a href="tienda.html#Mugs"><img src="${mini('mug').img}" alt="">Mugs</a><a href="tienda.html#Termos"><img src="${mini('termo').img}" alt="">Termos</a></div>
      <a class="destacado" href="personaliza.html"><img src="${IMG}c-buzos.webp" alt=""><span><b style="color:var(--azul)">Hazlo tuyo ✦</b><br>Sube tu logo y míralo puesto</span></a>
    </div>`;

  const ENCABEZADO = `<header class="encabezado"><div class="env"><div class="barra-enc">
    <a class="logo" href="index.html"><img src="${RECURSOS}logo-azul.svg" alt="Tránsfer! Estampados y personalización"></a>
    <nav class="menu">${enlaces.map(([id, url, txt]) => `<div><a href="${url}" class="${id === pagina ? 'on' : ''}${id === 'navidad' ? ' temporada' : ''}">${txt}${id === 'tienda' ? ' <span class="flechita">▾</span>' : ''}</a>${id === 'tienda' ? MEGA : ''}</div>`).join('')}</nav>
    <div class="acciones-enc">
      <button class="redondo buscar" data-abrir-buscador aria-label="Buscar (tecla /)"><svg><use href="#lupa"/></svg></button>
      <button class="redondo" data-abrir-carrito aria-label="Carrito"><svg><use href="#bolsa"/></svg><b data-contador hidden>0</b></button>
      <a class="btn" href="personaliza.html" data-iman>Personalizar <i>✦</i></a>
      <button class="redondo hamb" data-abrir-menu aria-label="Menú"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
    </div></div></div></header>
    <div class="menu-movil" aria-hidden="true"><button class="cerrar" data-cerrar-menu aria-label="Cerrar">×</button>
      <nav>${enlaces.map(([id, url, txt], i) => `<a href="${url}" class="${id === pagina ? 'on' : ''}" style="--i:${i}">${txt}</a>`).join('')}</nav>
      <img class="ilus-m mece" src="${ILUS}mascota.webp" alt="">
      <div class="pie-m">321 280 8077 · transferbga@gmail.com<br>Piedecuesta, Santander</div></div>`;

  const CARRITO = `<div class="velo" data-cerrar-carrito></div>
    <aside class="carrito" aria-label="Tu pedido"><div class="cab"><span class="h3">Tu pedido</span><button class="redondo" data-cerrar-carrito aria-label="Cerrar">×</button></div>
      <div data-items></div>
      <div class="nota"><img class="mece" src="${ILUS}taza.webp" alt="">El precio depende de la cantidad y del diseño. Te enviamos la cotización por WhatsApp.</div>
      <a class="btn ancho" data-enviar-pedido href="#">Enviar pedido por WhatsApp <i>→</i></a></aside>`;

  const PIE = `<footer class="pie">
    <div class="env"><div class="pie-cta">
      <img class="mascota-pie mece" src="${ILUS}mascota.webp" alt="">
      <div><span class="etiqueta"><svg><use href="#estrella"/></svg>Cotización sin compromiso</span><p class="pie-cta-t">¿Listo para estampar tu idea?</p><p class="pie-cta-s">Escríbenos por WhatsApp con tu diseño, tu logo o solo la idea, y te respondemos con el precio.</p></div>
      <div class="pie-cta-b"><a class="btn" href="${WA}Hola%20Tr%C3%A1nsfer!%2C%20quiero%20cotizar" data-iman>Cotizar por WhatsApp <i>→</i></a><a class="btn blanco" href="personaliza.html" data-iman>Diseñar el mío <i>✦</i></a></div>
    </div></div>
    <div class="pie-cuerpo"><div class="env">
      <div class="cols">
        <div class="marca"><img src="${RECURSOS}logo-blanco.svg" alt="Tránsfer!"><p>Taller de estampados en Piedecuesta, Santander. Camisetas, buzos, gorras, mugs y termos personalizados para Bucaramanga, Floridablanca, Girón y toda Colombia.</p>
          <ul class="contacto-p"><li><a href="${WA}Hola%20Tr%C3%A1nsfer!"><svg><use href="#i-wa"/></svg>321 280 8077</a></li><li><a href="mailto:transferbga@gmail.com"><svg><use href="#i-mail"/></svg>transferbga@gmail.com</a></li><li><a href="https://www.google.com/maps/search/?api=1&query=Piedecuesta%2C%20Santander" target="_blank" rel="noopener"><svg><use href="#i-pin"/></svg>Calle 4 #13a-25, Puerto Madero · Piedecuesta</a></li></ul></div>
        <div><h5>Tienda</h5><ul><li><a href="tienda.html#Buzos">Buzos personalizados</a></li><li><a href="tienda.html#Camisetas">Camisetas personalizadas</a></li><li><a href="tienda.html#Gorras">Gorras</a></li><li><a href="tienda.html#Mugs">Mugs y termos</a></li><li><a href="tienda.html#Llaveros">Llaveros</a></li><li><a href="navidad.html">Camisetas navideñas</a></li></ul></div>
        <div><h5>Para empresas</h5><ul><li><a href="empresas.html">Dotación con tu logo</a></li><li><a href="empresas.html">Buzos de prom</a></li><li><a href="empresas.html">Regalos de fin de año</a></li><li><a href="empresas.html#cotizar">Cotizar un pedido</a></li></ul></div>
        <div><h5>Ayuda</h5><ul><li><a href="faq.html#pedidos">Cómo comprar</a></li><li><a href="faq.html">Preguntas frecuentes</a></li><li><a href="contacto.html">Contacto</a></li><li><a href="nosotros.html">Nosotros</a></li><li><a href="legal.html">Términos y datos personales</a></li></ul></div>
      </div>
      <div class="ruta" aria-label="Enviamos desde Piedecuesta a Bucaramanga, Bogotá, Medellín, Cali, Barranquilla y toda Colombia"><p class="ruta-t"><svg width="16" height="16"><use href="#estrella"/></svg>Enviamos a toda Colombia desde Piedecuesta</p><div class="ruta-via" aria-hidden="true"><span class="parada inicio" style="--x:4%"><b>Piedecuesta</b><svg class="pin taller" viewBox="0 0 34 30"><path d="M2 28V13l9 5V13l9 5V6h12v22z" fill="#01CFFA" stroke="#0B1B33" stroke-width="2.5" stroke-linejoin="round"/><path d="M24 10h4" stroke="#0B1B33" stroke-width="2.5"/></svg></span><span class="parada" style="--x:21%"><b>Bucaramanga</b><svg class="pin" viewBox="0 0 24 30"><path d="M12 29s-10-9-10-16a10 10 0 0 1 20 0c0 7-10 16-10 16z" fill="#FECF03" stroke="#0B1B33" stroke-width="2.5"/><circle cx="12" cy="12" r="4" fill="#0B1B33"/></svg><svg class="entrega" viewBox="0 0 26 24"><rect x="2" y="7" width="22" height="15" rx="2" fill="#FEAB01" stroke="#0B1B33" stroke-width="2.5"/><path d="M2 11h22M13 7v15" stroke="#0B1B33" stroke-width="2"/><circle cx="20" cy="5" r="5" fill="#25D366" stroke="#0B1B33" stroke-width="2"/><path d="M17.6 5l1.6 1.6 3-3" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg></span><span class="parada" style="--x:40%"><b>Bogotá</b><svg class="pin" viewBox="0 0 24 30"><path d="M12 29s-10-9-10-16a10 10 0 0 1 20 0c0 7-10 16-10 16z" fill="#FECF03" stroke="#0B1B33" stroke-width="2.5"/><circle cx="12" cy="12" r="4" fill="#0B1B33"/></svg><svg class="entrega" viewBox="0 0 26 24"><rect x="2" y="7" width="22" height="15" rx="2" fill="#FEAB01" stroke="#0B1B33" stroke-width="2.5"/><path d="M2 11h22M13 7v15" stroke="#0B1B33" stroke-width="2"/><circle cx="20" cy="5" r="5" fill="#25D366" stroke="#0B1B33" stroke-width="2"/><path d="M17.6 5l1.6 1.6 3-3" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg></span><span class="parada" style="--x:58%"><b>Medellín</b><svg class="pin" viewBox="0 0 24 30"><path d="M12 29s-10-9-10-16a10 10 0 0 1 20 0c0 7-10 16-10 16z" fill="#FECF03" stroke="#0B1B33" stroke-width="2.5"/><circle cx="12" cy="12" r="4" fill="#0B1B33"/></svg><svg class="entrega" viewBox="0 0 26 24"><rect x="2" y="7" width="22" height="15" rx="2" fill="#FEAB01" stroke="#0B1B33" stroke-width="2.5"/><path d="M2 11h22M13 7v15" stroke="#0B1B33" stroke-width="2"/><circle cx="20" cy="5" r="5" fill="#25D366" stroke="#0B1B33" stroke-width="2"/><path d="M17.6 5l1.6 1.6 3-3" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg></span><span class="parada" style="--x:76%"><b>Cali</b><svg class="pin" viewBox="0 0 24 30"><path d="M12 29s-10-9-10-16a10 10 0 0 1 20 0c0 7-10 16-10 16z" fill="#FECF03" stroke="#0B1B33" stroke-width="2.5"/><circle cx="12" cy="12" r="4" fill="#0B1B33"/></svg><svg class="entrega" viewBox="0 0 26 24"><rect x="2" y="7" width="22" height="15" rx="2" fill="#FEAB01" stroke="#0B1B33" stroke-width="2.5"/><path d="M2 11h22M13 7v15" stroke="#0B1B33" stroke-width="2"/><circle cx="20" cy="5" r="5" fill="#25D366" stroke="#0B1B33" stroke-width="2"/><path d="M17.6 5l1.6 1.6 3-3" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg></span><span class="parada" style="--x:93%"><b>Barranquilla</b><svg class="pin" viewBox="0 0 24 30"><path d="M12 29s-10-9-10-16a10 10 0 0 1 20 0c0 7-10 16-10 16z" fill="#FECF03" stroke="#0B1B33" stroke-width="2.5"/><circle cx="12" cy="12" r="4" fill="#0B1B33"/></svg><svg class="entrega" viewBox="0 0 26 24"><rect x="2" y="7" width="22" height="15" rx="2" fill="#FEAB01" stroke="#0B1B33" stroke-width="2.5"/><path d="M2 11h22M13 7v15" stroke="#0B1B33" stroke-width="2"/><circle cx="20" cy="5" r="5" fill="#25D366" stroke="#0B1B33" stroke-width="2"/><path d="M17.6 5l1.6 1.6 3-3" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg></span><svg class="furgon" viewBox="-36 0 196 80"><g class="carro"><path d="M-30 36H-6M-24 48H-2" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".7"/><rect x="30" y="6" width="30" height="16" rx="2" fill="#FEAB01" stroke="#0B1B33" stroke-width="4"/><rect x="62" y="10" width="26" height="12" rx="2" fill="#FECF03" stroke="#0B1B33" stroke-width="4"/><path d="M8 24H104L132 40Q148 44 148 56V64H8Z" fill="#01CFFA" stroke="#0B1B33" stroke-width="5" stroke-linejoin="round"/><path d="M107 29L126 41H107Z" fill="#fff" stroke="#0B1B33" stroke-width="4" stroke-linejoin="round"/><path d="M60 44 C62 57 66 61 78 63 C66 65 62 69 60 82 C58 69 54 65 42 63 C54 61 58 57 60 44 Z" fill="#FECF03" stroke="#0B1B33" stroke-width="5" transform="translate(30 20) scale(.6)"/><g class="rueda" transform="translate(38 66)"><circle r="11" fill="#0B1B33"/><circle r="5" fill="#FECF03"/><path d="M-7 0H7M0-7V7" stroke="#0B1B33" stroke-width="3"/></g><g class="rueda" transform="translate(118 66)"><circle r="11" fill="#0B1B33"/><circle r="5" fill="#FECF03"/><path d="M-7 0H7M0-7V7" stroke="#0B1B33" stroke-width="3"/></g></g></svg></div></div>
      <div class="legal"><span>© 2026 Tránsfer! · Estampados y personalización</span><span>Sitio hecho por Bytera</span></div>
    </div><div class="pie-marca" aria-hidden="true">Tránsfer!</div></div>
  </footer>
  <a class="wa" href="${WA}Hola%20Tr%C3%A1nsfer!%2C%20quiero%20cotizar" aria-label="Escríbenos por WhatsApp"><span class="burbuja">¿Te ayudamos con tu diseño? 👋</span><svg><use href="#i-wa"/></svg><span class="txt">¿Hablamos?</span></a>`;

  document.body.insertAdjacentHTML('afterbegin', SVG + AVISO + ENCABEZADO);
  document.body.insertAdjacentHTML('beforeend', PIE + CARRITO);

  /* ───── Pintar catálogos ───── */
  document.querySelectorAll('[data-catalogo]').forEach(el => {
    const ids = el.dataset.catalogo ? el.dataset.catalogo.split(',') : null;
    const lista = ids ? ids.map(mini).filter(Boolean) : CATALOGO;
    el.innerHTML = lista.map((p, i) => tarjeta(p, i)).join('');
  });

  /* ───── Títulos palabra por palabra ───── */
  document.querySelectorAll('[data-palabras]').forEach(el => {
    let i = 0;
    const partir = nodo => [...nodo.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(t => {
          if (!t) return;
          if (/^\s+$/.test(t)) { frag.append(t); return; }
          const p = document.createElement('span'); p.className = 'p';
          const s = document.createElement('span'); s.textContent = t; s.style.setProperty('--i', i++);
          p.append(s); frag.append(p);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && n.tagName !== 'BR') {
        if (n.classList.contains('trazo') || n.classList.contains('pegada')) { const p = document.createElement('span'); p.className = 'p'; n.replaceWith(p); const s = document.createElement('span'); s.style.setProperty('--i', i++); s.append(n); p.append(s); p.style.overflow = 'visible'; }
        else partir(n);
      }
    });
    partir(el); el.classList.add('palabras');
  });

  /* ───── Trazo de lápiz bajo las palabras marcadas ───── */
  document.querySelectorAll('.trazo').forEach(el => {
    el.insertAdjacentHTML('beforeend', '<svg class="linea-trazo" viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" stroke-width="7" d="M3 13c40-8 90-11 140-7 20 1 38 3 54 6"/><path pathLength="1" stroke-width="3.5" d="M34 18c40-4 88-5 136-2" style="transition-delay:.7s"/></svg>');
  });

  /* ───── Aparecer al bajar ───── */
  const vigilar = '[data-revela],.palabras,.trazo,.pasos,[data-cuenta],.vigila,.cinta-color';
  const obs = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('visto'); obs.unobserve(e.target);
    if (e.target.dataset.cuenta !== undefined) contar(e.target);
    e.target.querySelectorAll(':scope > .destapa').forEach(d => d.classList.add('visto'));
  }), {threshold: .15, rootMargin: '0px 0px -40px 0px'});
  document.querySelectorAll(vigilar).forEach(el => obs.observe(el));
  /* .destapa empieza recortada del todo (área cero) y Chrome nunca la da por visible:
     se vigila su contenedor y al aparecer este se destapa la foto. */
  document.querySelectorAll('.destapa').forEach(d => obs.observe(d.parentElement));
  document.querySelectorAll('[data-escalona]').forEach(g => [...g.children].forEach((c, i) => { c.setAttribute('data-revela', c.getAttribute('data-revela') || ''); c.style.setProperty('--d', i); obs.observe(c); }));

  function contar(el) {
    const fin = parseFloat(el.dataset.cuenta), suf = el.dataset.sufijo || '';
    if (reducido) { el.textContent = fin + suf; return; }
    const t0 = performance.now(), dur = 1400;
    const paso = t => { const k = Math.min(1, (t - t0) / dur), v = Math.round(fin * (1 - Math.pow(1 - k, 3))); el.textContent = v + suf; if (k < 1) requestAnimationFrame(paso); };
    requestAnimationFrame(paso);
  }

  /* ───── Encabezado: sombra y se esconde al bajar ───── */
  const enc = document.querySelector('.encabezado');
  let ultimo = 0;
  addEventListener('scroll', () => {
    const y = scrollY;
    enc.classList.toggle('sombra', y > 20);
    enc.classList.toggle('escondido', y > 400 && y > ultimo && !document.querySelector('.menu>div:hover'));
    ultimo = y;
  }, {passive: true});

  /* ───── Paralaje suave ───── */
  const para = [...document.querySelectorAll('[data-parallax]')];
  if (para.length && !reducido) {
    const mover = () => { para.forEach(el => { const r = el.getBoundingClientRect(), c = r.top + r.height / 2 - innerHeight / 2; el.style.translate = `0 ${(-c * parseFloat(el.dataset.parallax)).toFixed(1)}px`; }); };
    addEventListener('scroll', () => requestAnimationFrame(mover), {passive: true}); mover();
  }

  /* ───── Tarjetas que se inclinan y botones imán ───── */
  if (fino && !reducido) {
    document.addEventListener('pointermove', e => {
      const t = e.target.closest('[data-tilt]');
      document.querySelectorAll('[data-tilt].incl').forEach(x => { if (x !== t) { x.style.transform = ''; x.classList.remove('incl'); } });
      if (t) { const r = t.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        t.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px)`; t.classList.add('incl'); }
      const b = e.target.closest('[data-iman]');
      document.querySelectorAll('[data-iman].im').forEach(x => { if (x !== b) { x.style.translate = ''; x.classList.remove('im'); } });
      if (b) { const r = b.getBoundingClientRect(); b.style.translate = `${((e.clientX - r.left) / r.width - .5) * 10}px ${((e.clientY - r.top) / r.height - .5) * 8}px`; b.classList.add('im'); }
    });
    document.querySelectorAll('[data-iman]').forEach(b => b.addEventListener('pointerleave', () => { b.style.translate = ''; }));
  }

  /* ───── Menú del celular ───── */
  const mm = document.querySelector('.menu-movil');
  document.querySelector('[data-abrir-menu]').addEventListener('click', () => { mm.classList.add('abierto'); mm.setAttribute('aria-hidden', 'false'); });
  document.querySelector('[data-cerrar-menu]').addEventListener('click', () => { mm.classList.remove('abierto'); mm.setAttribute('aria-hidden', 'true'); });

  /* ───── Carrito ───── */
  // El pedido se guarda en este navegador (localStorage) para que no se pierda al cambiar de pagina.
  const CLAVE = 'transfer-pedido';
  let pedido = [];
  try { pedido = (JSON.parse(localStorage.getItem(CLAVE)) || []).filter(it => it.perso || mini(it.id)); } catch (e) { pedido = []; }
  const guardarPedido = () => { try { localStorage.setItem(CLAVE, JSON.stringify(pedido)); } catch (e) {} };
  const itemsEl = document.querySelector('[data-items]'), contador = document.querySelector('[data-contador]');
  function pintarCarrito() {
    itemsEl.innerHTML = pedido.map((it, i) => { const p = it.perso ? it : mini(it.id); return `<div class="item"><img class="${p.tono || 't-amarillo'}" src="${p.img}" alt=""><div><b>${p.nombre}</b><small>${it.perso ? it.detalle : p.cat}${it.talla && it.talla !== '—' ? ' · Talla ' + it.talla : ''} · Cant. ${it.cant}</small></div><button class="quitar" data-quitar="${i}" aria-label="Quitar">×</button></div>`; }).join('') || '<p style="color:var(--suave)">Tu pedido está vacío.</p>';
    const total = pedido.reduce((a, b) => a + b.cant, 0);
    contador.textContent = total; contador.hidden = !total;
    contador.classList.remove('salta'); void contador.offsetWidth; contador.classList.add('salta');
    const txt = 'Hola Tránsfer!, quiero cotizar: ' + pedido.map(it => { const n = it.perso ? it.nombre + ' (' + it.detalle + ')' : mini(it.id).nombre; return `${n}${it.talla && it.talla !== '—' ? ' (talla ' + it.talla + ')' : ''} x${it.cant}`; }).join(', ');
    document.querySelector('[data-enviar-pedido]').href = WA + encodeURIComponent(txt);
    guardarPedido();
  }
  const abrirCarrito = () => { document.querySelector('.carrito').classList.add('abierto'); document.querySelector('.velo').classList.add('abierto'); };
  const cerrarCarrito = () => { document.querySelector('.carrito').classList.remove('abierto'); document.querySelector('.velo').classList.remove('abierto'); };
  document.addEventListener('click', e => {
    if (e.target.closest('[data-abrir-carrito]')) abrirCarrito();
    if (e.target.closest('[data-cerrar-carrito]')) cerrarCarrito();
    const q = e.target.closest('[data-quitar]'); if (q) { pedido.splice(+q.dataset.quitar, 1); pintarCarrito(); }
    const a = e.target.closest('[data-agregar]');
    if (a) { e.preventDefault(); const talla = (document.querySelector('[data-tallas] .on') || {}).textContent || '—', cant = +(document.querySelector('[data-cant]') || {value: 1}).value || 1;
      pedido.push({id: a.dataset.agregar, talla, cant}); pintarCarrito(); conTope(volar(mini(a.dataset.agregar).img, a)).then(abrirCarrito); }
  });
  pintarCarrito();
  // La imagen del producto vuela hasta el carrito antes de abrirlo
  function volar(src, desde) {
    const meta = document.querySelector('[data-abrir-carrito]'); if (!src || !meta || reducido) return Promise.resolve();
    const a = desde ? desde.getBoundingClientRect() : {left: innerWidth / 2 - 32, top: innerHeight / 2 - 32, width: 64, height: 64}, b = meta.getBoundingClientRect();
    const im = new Image(); im.src = src; im.className = 'vuela'; im.alt = ''; document.body.appendChild(im);
    const x0 = a.left + a.width / 2 - 32, y0 = a.top + a.height / 2 - 32, x1 = b.left + b.width / 2 - 32, y1 = b.top + b.height / 2 - 32;
    return im.animate([{transform: `translate(${x0}px,${y0}px) scale(1)`, opacity: 1}, {transform: `translate(${(x0 + x1) / 2}px,${Math.min(y0, y1) - 80}px) scale(.8) rotate(-12deg)`, opacity: 1, offset: .55}, {transform: `translate(${x1}px,${y1}px) scale(.25)`, opacity: .6}], {duration: 750, easing: 'cubic-bezier(.5,0,.3,1)'}).finished.then(() => im.remove());
  }
  let ultimoClic = null; document.addEventListener('pointerdown', e => { ultimoClic = e.target.closest('button, a'); }, true);
  const conTope = p => Promise.race([p, new Promise(r => setTimeout(r, 850))]);   // la animacion nunca bloquea el pedido
  window.TRANSFER.agregar = item => { pedido.push(item); pintarCarrito(); conTope(volar(item.img, ultimoClic)).then(abrirCarrito); };

  /* ───── Buscador (productos, categorias y paginas) ───── */
  const sinTildes = t => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const PAGINAS = [
    ['Camisetas navideñas', 'navidad.html', 'Navidad, novena, familia, amigo secreto'],
    ['Personalizador en línea', 'personaliza.html', 'Diseña tu prenda, sube tu logo o tu foto'],
    ['Empresas y colegios', 'empresas.html', 'Dotación, buzos de prom, regalos de fin de año'],
    ['Preguntas frecuentes', 'faq.html', 'Pedidos, envíos, pagos, cuidados del estampado'],
    ['Contacto', 'contacto.html', 'WhatsApp, correo y dirección en Piedecuesta'],
    ['Nosotros', 'nosotros.html', 'El taller, DTF y sublimación'],
  ];
  document.body.insertAdjacentHTML('beforeend', `<div class="buscador" role="dialog" aria-modal="true" aria-label="Buscar" hidden>
    <div class="buscador-caja"><svg><use href="#lupa"/></svg><input type="search" placeholder="Busca buzos, mugs, Navidad, dotación…" aria-label="Buscar en Tránsfer!"><button class="redondo" data-cerrar-buscador aria-label="Cerrar">×</button></div>
    <div class="buscador-res" aria-live="polite"></div></div>`);
  const bus = document.querySelector('.buscador'), busIn = bus.querySelector('input'), busRes = bus.querySelector('.buscador-res');
  const sugeridos = '<p class="bus-t">Lo más buscado</p><div class="bus-chips">' + ['Buzos', 'Camisetas', 'Mugs', 'Navidad', 'Dotación', 'Termos'].map(x => `<button type="button">${x}</button>`).join('') + '</div>';
  function buscar() {
    const q = sinTildes(busIn.value.trim());
    if (!q) { busRes.innerHTML = sugeridos; return; }
    const prods = CATALOGO.filter(p => sinTildes(p.nombre + ' ' + p.cat + ' ' + p.sub + ' ' + p.color).includes(q));
    const pags = PAGINAS.filter(([t, , d]) => sinTildes(t + ' ' + d).includes(q));
    busRes.innerHTML = (prods.length || pags.length)
      ? (prods.length ? '<p class="bus-t">Productos</p>' + prods.slice(0, 6).map(p => `<a class="bus-item" href="producto.html?p=${p.id}"><img class="${p.tono}" src="${p.img}" alt=""><span><b>${p.nombre}</b><small>${p.cat} · ${p.sub}</small></span></a>`).join('') : '')
        + (pags.length ? '<p class="bus-t">Páginas</p>' + pags.map(([t, u, d]) => `<a class="bus-item pag" href="${u}"><i>→</i><span><b>${t}</b><small>${d}</small></span></a>`).join('') : '')
      : `<p class="bus-vacio">No encontramos «${busIn.value.replace(/[<>]/g, '')}». <a href="${WA}${encodeURIComponent('Hola Tránsfer!, busco: ' + busIn.value)}">Pregúntanos por WhatsApp →</a></p>`;
  }
  const abrirBuscador = () => { bus.hidden = false; requestAnimationFrame(() => bus.classList.add('abierto')); busIn.value = ''; buscar(); setTimeout(() => busIn.focus(), 50); };
  const cerrarBuscador = () => { bus.classList.remove('abierto'); setTimeout(() => { bus.hidden = true; }, 200); };
  busIn.addEventListener('input', buscar);
  busRes.addEventListener('click', e => { const c = e.target.closest('.bus-chips button'); if (c) { busIn.value = c.textContent; buscar(); busIn.focus(); } });
  bus.addEventListener('click', e => { if (e.target === bus || e.target.closest('[data-cerrar-buscador]')) cerrarBuscador(); });
  document.addEventListener('click', e => { if (e.target.closest('[data-abrir-buscador]')) abrirBuscador(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { if (!bus.hidden) cerrarBuscador(); cerrarCarrito(); }
    if (e.key === '/' && bus.hidden && !/input|textarea|select/i.test(document.activeElement.tagName)) { e.preventDefault(); abrirBuscador(); }
  });


  /* ───── Ruta de envios del pie: el furgon sale de Piedecuesta y deja una caja en cada ciudad ───── */
  const via = document.querySelector('.ruta-via');
  if (via) {
    const furgon = via.querySelector('.furgon'), paradas = [...via.querySelectorAll('.parada:not(.inicio)')];
    if (reducido) paradas.forEach(p => p.classList.add('entregado'));
    else {
      const DUR = 13000; let t0 = null, visibleR = false, vuelta = -1;
      const paso = ahora => {
        if (!visibleR) { t0 = null; return; }
        if (t0 === null) t0 = ahora - (vuelta >= 0 ? 0 : 0);
        const W = via.clientWidth, k = ((ahora - t0) % DUR) / DUR, n = Math.floor((ahora - t0) / DUR);
        if (n !== vuelta) { vuelta = n; paradas.forEach(p => p.classList.remove('entregado')); }
        const x = -130 + k * (W + 260);
        furgon.style.transform = `translateX(${x}px)`;
        paradas.forEach(p => { if (!p.classList.contains('entregado') && x + 60 >= p.offsetLeft) p.classList.add('entregado'); });
        requestAnimationFrame(paso);
      };
      new IntersectionObserver(e => { const antes = visibleR; visibleR = e[0].isIntersecting; if (visibleR && !antes) requestAnimationFrame(paso); }).observe(via);
    }
  }

  /* ───── Volver arriba y salto al contenido ───── */
  const main = document.querySelector('main'); if (main) main.id = main.id || 'contenido';
  document.body.insertAdjacentHTML('afterbegin', '<a class="saltar" href="#contenido">Saltar al contenido</a>');
  document.body.insertAdjacentHTML('beforeend', '<button class="arriba" aria-label="Volver arriba">↑</button>');
  const arriba = document.querySelector('.arriba');
  addEventListener('scroll', () => arriba.classList.toggle('ver', scrollY > 900), {passive: true});
  arriba.addEventListener('click', () => scrollTo({top: 0, behavior: reducido ? 'auto' : 'smooth'}));

  /* ───── Grupos de botones de una sola opción ───── */
  document.querySelectorAll('[data-grupo]').forEach(g => g.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b || !g.contains(b)) return;
    g.querySelectorAll('button').forEach(x => x.classList.remove('on')); b.classList.add('on');
  }));

  /* ───── Cantidad ───── */
  document.querySelectorAll('.cantidad').forEach(c => {
    const inp = c.querySelector('input');
    c.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; inp.value = Math.max(1, (+inp.value || 1) + (b.dataset.mas ? 1 : -1)); });
  });

  /* ───── Saludo de WhatsApp ───── */
  const wa = document.querySelector('.wa');
  setTimeout(() => wa.classList.add('saluda'), 3500);
  setTimeout(() => wa.classList.remove('saluda'), 9500);

  /* ───── Transición entre páginas ───── */
  document.body.classList.remove('cargando');
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]'); if (!a || reducido) return;
    const url = a.getAttribute('href');
    if (!url || url.startsWith('#') || url.startsWith('http') || a.target || e.ctrlKey || e.metaKey) return;
    e.preventDefault(); document.body.classList.add('saliendo'); setTimeout(() => location.href = url, 380);
  });
  addEventListener('pageshow', () => document.body.classList.remove('saliendo'));
})();
