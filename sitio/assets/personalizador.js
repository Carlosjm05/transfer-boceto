/* Tránsfer! · Personalizador v2 (22 nov 2026). Sin librerías.
   Prendas dibujadas a mano en SVG (el color cambia en vivo), diseño en capas (textos, imágenes, stickers),
   medidas en cm, tallas o un nombre por prenda, y una ficha de producción para el taller. */
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const WA = window.TRANSFER.WA, T = '#0B1B33';
  const guardarLS = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } };
  const leerLS = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } };
  const esc = t => String(t).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
  const cm = n => n.toFixed(1).replace('.', ',');

  const {PRENDAS, vistaDe: vistaBase, vistasDe: vistasBase, areaDe, svgDe: dibujo, imgDeSvg, oscuro, tiposDe, fondoDe, vistaTalla, medidaDe} = window.TR_PRENDAS;   // dibujo de prendas: assets/prendas.js
  const {producto: prodDe, pesos, unidad, textoBaja} = window.TR_DATOS;   // precios y colores reales: assets/datos.js
  // Cada prenda tiene uno o varios tipos (por ejemplo, 3 camisetas), y cada tipo es un producto con su precio
  const tipo = () => tiposDe(S.prod).find(x => x.id === S.tipo) || tiposDe(S.prod)[0];
  const colores = () => tipo().colores;
  // La vista, la guía y el dibujo dependen de la talla que se esté viendo (S.talla)
  const tallaV = () => PRENDAS[S.prod].tallas ? S.talla : undefined;
  const vistaDe = (p, v) => p === S.prod ? vistaTalla(p, v, tipo().id, tallaV()) : vistaBase(p, v);
  const vistasDe = P => vistasBase(P).map(([k]) => [k, vistaDe(S.prod, k)]);
  const svgDe = (p, v, capa, color) => p === S.prod ? dibujo(p, v, capa, color, tipo().id, tallaV()) : dibujo(p, v, capa, color);
  const enTalla = (t, fn) => { const a = S.talla; S.talla = t; try { return fn(); } finally { S.talla = a; } };
  const tallasPedido = () => { const P = PRENDAS[S.prod]; if (!P.tallas) return [null]; const l = S.modo === 'nombres' ? P.tallas.filter(t => S.nombres.some(n => n.nombre.trim() && n.talla === t)) : P.tallas.filter(t => S.tallas[t] > 0); return l.length ? l : [S.talla]; };
  const medCm = v => `${cm(v.cm)} × ${cm(v.cm * areaDe(v)[3] / areaDe(v)[2])} cm`;
  const dosLados = () => !!tipo().dos && ['frente', 'espalda'].every(k => (S.capas[k] || []).length);
  const precioU = () => unidad(tipo(), {dosLados: dosLados(), total: totalUnidades()});

  /* ═════════ Letras ═════════ */
  const FUENTES = {
    pop: {fam: 'Rubik', peso: 900, nombre: 'Rubik gruesa'}, normal: {fam: 'Rubik', peso: 500, nombre: 'Rubik normal'}, delgada: {fam: 'Rubik', peso: 300, nombre: 'Rubik delgada'},
    poster: {fam: 'Anton', peso: 400, nombre: 'Anton (póster)'}, clasica: {fam: 'Georgia, serif', peso: 700, nombre: 'Clásica'},
    maquina: {fam: '"Courier New", monospace', peso: 700, nombre: 'Máquina'}, manuscrita: {fam: '"Segoe Script","Brush Script MT",cursive', peso: 400, nombre: 'Manuscrita'}};
  const TINTAS = [['Blanco', '#FFFFFF'], ['Negro', '#111111'], ['Amarillo', '#FECF03'], ['Cian', '#01CFFA'], ['Azul marino', '#053468'], ['Vino', '#B30A51'], ['Rojo', '#E3262F'], ['Verde', '#1F9D55'], ['Naranja', '#FF8A00'], ['Rosado', '#FF7EB6'], ['Dorado', '#C9A227'], ['Gris', '#8A8F98']];
  const nombreTinta = hex => (TINTAS.find(t => t[1].toLowerCase() === hex.toLowerCase()) || [hex.toUpperCase()])[0];

  const nombresLlenos = () => S.nombres.map(n => n.nombre.trim()).filter(Boolean);
  function nombreMasLargo(el) { const f = FUENTES[el.fuente] || FUENTES.pop, c = document.createElement('canvas').getContext('2d'); c.font = `${f.peso} 100px ${f.fam}`; const l = nombresLlenos(); return l.length ? l.reduce((a, b) => c.measureText(b).width > c.measureText(a).width ? b : a) : 'NOMBRE'; }
  function canvasTexto(el, escala = 1) {
    const f = FUENTES[el.fuente] || FUENTES.pop, size = 120 * escala;
    const txt = el.variable ? (S.nombres.find(n => n.nombre.trim())?.nombre || 'NOMBRE') : (el.texto || ' ');
    const borde = el.contorno ? Math.max(2, el.grosor * size / 40) : 0, pad = borde + 14 * escala;
    const c = document.createElement('canvas'), x = c.getContext('2d');
    const fuente = `${f.peso} ${size}px ${f.fam}`;
    x.font = fuente;
    const pinta = (t, px, py) => { if (borde) { x.lineWidth = borde * 2; x.lineJoin = 'round'; x.strokeStyle = el.colorBorde; x.strokeText(t, px, py); } x.fillStyle = el.color; x.fillText(t, px, py); };
    const curva = el.curva || 0;
    if (!curva) {
      const lineas = txt.split('\n'), lh = size * 1.08, anchos = lineas.map(l => x.measureText(l).width);
      if (el.variable) anchos.push(x.measureText(nombreMasLargo(el)).width);   // todos los nombres con la misma altura de letra
      c.width = Math.ceil(Math.max(...anchos, 10) + pad * 2); c.height = Math.ceil(lineas.length * lh + pad * 2);
      x.font = fuente; x.textAlign = 'center'; x.textBaseline = 'middle';
      lineas.forEach((l, i) => pinta(l, c.width / 2, pad + lh * (i + .5)));
      return c;
    }
    const linea1 = txt.replace(/\n/g, ' '), chars = [...linea1], anchos = chars.map(ch => x.measureText(ch).width), total = anchos.reduce((a, b) => a + b, 0) || 1;
    const ang = Math.abs(curva) / 100 * Math.PI * 1.15, R = total / ang, s = curva > 0 ? 1 : -1;
    let acc = 0; const pos = chars.map((ch, i) => { const centro = acc + anchos[i] / 2; acc += anchos[i]; const th = (centro - total / 2) / R; return {ch, th, x: R * Math.sin(th), y: s * (R - R * Math.cos(th))}; });
    const xs = pos.map(p => p.x), ys = pos.map(p => p.y), m = size * .7 + pad;
    const minX = Math.min(...xs) - m, maxX = Math.max(...xs) + m, minY = Math.min(...ys) - m, maxY = Math.max(...ys) + m;
    c.width = Math.ceil(maxX - minX); c.height = Math.ceil(maxY - minY);
    x.font = fuente; x.textAlign = 'center'; x.textBaseline = 'middle';
    pos.forEach(p => { x.save(); x.translate(p.x - minX, p.y - minY); x.rotate(s * p.th); pinta(p.ch, 0, 0); x.restore(); });
    return c;
  }

  /* ═════════ Estado ═════════ */
  const IMGS = {};       // id -> {src, sinFondo, w, h, nombre, archivo}
  const STICKERS = ['estrella', 'rompecabezas', 'navidad', 'mascota', 'gorra', 'taza', 'trio', 'camion', 'lapiz', 'manos'];
  STICKERS.forEach(n => { IMGS['st:' + n] = {src: '../img/ilus/' + n + '.webp', nombre: 'Sticker ' + n, sticker: true}; });
  const S = {prod: 'buzo', tipo: 'buzo', talla: 'M', color: '#1D3C78', vista: 'frente', capas: {}, sel: null, guias: true, modo: 'tallas', tallas: {M: 1}, cant: 1, nombres: [{nombre: '', talla: 'M'}], notas: '', cliente: '', ciudad: '', otro: null};   // otro: null o el texto del color que no está en la lista
  let hist = [], hi = -1, codigo = null;
  const capasVista = (v = S.vista) => (S.capas[v] ||= []);
  const nuevoId = () => 'e' + Math.random().toString(36).slice(2, 8);
  const vista0 = () => vistasDe(PRENDAS[S.prod])[0][0];
  const vistaBuena = () => { const v = vistaDe(S.prod, S.vista); if (!v || v.soloDibujo) S.vista = vista0(); };
  // El tipo siempre es de la prenda escogida, y el color, uno de los que se manejan en ese tipo (salvo «Otro»)
  const tipoBueno = () => { S.tipo = tipo().id; if (PRENDAS[S.prod].tallas && !PRENDAS[S.prod].tallas.includes(S.talla)) S.talla = 'M'; if (S.otro === null && !colores().some(c => c[1] === S.color)) S.color = colores()[0][1]; };
  const claro = hex => { const n = parseInt(hex.slice(1), 16); return (.299 * (n >> 16 & 255) + .587 * (n >> 8 & 255) + .114 * (n & 255)) / 255 > .6; };
  const colorNombre = () => { const l = (colores().find(c => c[1] === S.color) || [])[0]; if (S.otro === null) return l || S.color.toUpperCase(); const t = S.otro.trim(), m = PRENDAS[S.prod].tecnica === 'DTF' ? ` (muestra ${S.color.toUpperCase()})` : ''; return `Otro: ${t || 'por definir'}${m}, por confirmar`; };
  // El mug y el termo se diseñan extendidos (vista «vuelta»). Al pasar de una prenda a un mug, o al abrir un diseño viejo, se copia lo que había.
  function prepararCapas() {
    const P = PRENDAS[S.prod], copia = (l, f) => (l || []).map(e => Object.assign(JSON.parse(JSON.stringify(e)), {id: nuevoId()}, f(e)));
    if (P.vistas.vuelta) {
      const k = P.vistas.frente.cm / P.vistas.vuelta.cm, hay = (S.capas.reverso || []).length;
      if (!(S.capas.vuelta || []).length) S.capas.vuelta = [...copia(S.capas.frente, e => ({x: (hay ? .73 : .5) + (e.x - .5) * k, w: e.w * k})), ...copia(S.capas.reverso, e => ({x: .27 + (e.x - .5) * k, w: e.w * k}))];
    } else if (!(S.capas.frente || []).length && (S.capas.vuelta || []).length) S.capas.frente = copia(S.capas.vuelta, e => ({x: Math.min(.9, Math.max(.1, .5 + (e.x - .5) / .45)), w: Math.min(1, e.w / .45)}));
    vistaBuena();
  }
  const elSel = () => capasVista().find(e => e.id === S.sel);

  function nuevoTexto(extra = {}) { return Object.assign({id: nuevoId(), tipo: 'texto', x: .5, y: .3, w: .7, rot: 0, texto: 'TU NOMBRE', fuente: 'pop', color: '#FECF03', contorno: false, colorBorde: T, grosor: 3, curva: 0, variable: false}, extra); }
  function instantanea() { return JSON.stringify({prod: S.prod, tipo: S.tipo, color: S.color, otro: S.otro, capas: S.capas}); }
  function guardarHist() { const s = instantanea(); if (hist[hi] === s) return; hist = hist.slice(0, hi + 1); hist.push(s); if (hist.length > 80) hist.shift(); hi = hist.length - 1; codigo = null; botonesHist(); guardarBorrador(); }
  function restaurar(s) { const o = JSON.parse(s); S.prod = o.prod; S.tipo = o.tipo; S.color = o.color; S.otro = o.otro ?? null; S.capas = o.capas; S.sel = null; tipoBueno(); vistaBuena(); todo(); }
  const deshacer = () => { if (hi > 0) { hi--; restaurar(hist[hi]); botonesHist(); guardarBorrador(); } };
  const rehacer = () => { if (hi < hist.length - 1) { hi++; restaurar(hist[hi]); botonesHist(); guardarBorrador(); } };
  function botonesHist() { $('#deshacer').disabled = hi <= 0; $('#rehacer').disabled = hi >= hist.length - 1; }
  function guardarBorrador() {
    const usadas = new Set(Object.values(S.capas).flat().filter(e => e.img && !e.img.startsWith('st:')).map(e => e.img));
    const imgs = {}; usadas.forEach(id => { if (IMGS[id]) imgs[id] = {src: IMGS[id].src, w: IMGS[id].w, h: IMGS[id].h, nombre: IMGS[id].nombre}; });
    const b = {prod: S.prod, tipo: S.tipo, talla: S.talla, color: S.color, otro: S.otro, vista: S.vista, capas: S.capas, modo: S.modo, tallas: S.tallas, cant: S.cant, nombres: S.nombres, notas: S.notas, imgs};
    if (!guardarLS('transfer-editor', b)) { b.imgs = {}; guardarLS('transfer-editor', b); }
  }

  /* ═════════ Escena ═════════ */
  const escena = $('#escena');
  function renderEscena() {
    const v = vistaDe(S.prod, S.vista), [w, h] = v.vb, [ax, ay, aw, ah] = areaDe(v);
    const pc = (n, t) => (n / t * 100) + '%';
    escena.style.aspectRatio = w + ' / ' + h; escena.dataset.ar = w / h; ajustarEscena();
    const n = parseInt(fondoDe(S.prod, S.color, S.tipo).slice(1), 16), lum = (.299 * (n >> 16 & 255) + .587 * (n >> 8 & 255) + .114 * (n & 255)) / 255;
    escena.classList.toggle('oscura', lum < .45);
    const etiqueta = `<span class="area-et"><span class="largo">${v.sangrado ? 'De borde a borde' : 'Área de impresión'} · </span>${cm(v.cm)} × ${cm(v.cm * ah / aw)} cm</span>`;
    escena.innerHTML = `<div class="capa-p base">${svgDe(S.prod, S.vista, 'base', S.color)}</div>
      <div class="area${S.guias ? ' guias' : ''}${v.sangrado ? ' sangra' : ''}" id="area" style="left:${pc(ax, w)};top:${pc(ay, h)};width:${pc(aw, w)};height:${pc(ah, h)}">${v.sangrado ? '' : etiqueta}</div>
      <div class="capa-p sombra">${svgDe(S.prod, S.vista, 'sombra', S.color)}</div>
      ${v.brillo ? `<div class="capa-p brillo">${svgDe(S.prod, S.vista, 'brillo', S.color)}</div>` : ''}
      <div class="capa-ui" style="left:${pc(ax, w)};top:${pc(ay, h)};width:${pc(aw, w)};height:${pc(ah, h)}">${v.sangrado ? etiqueta : ''}<i class="guia-v"></i><i class="guia-h"></i>
        <div class="marco" hidden><button class="h-borrar" aria-label="Borrar" title="Borrar (Supr)">×</button><button class="h-rot" aria-label="Girar" title="Girar">⟳</button><button class="h-tam" aria-label="Cambiar tamaño" title="Tamaño">⤡</button></div></div>`;
    renderCapas();
  }
  // El escenario mantiene siempre la proporcion de la prenda: asi el area de impresion coincide con la ficha
  function ajustarEscena() {
    const col = escena.parentElement, ar = +escena.dataset.ar || 1, movil = matchMedia('(max-width:1080px)').matches;
    const W = col.clientWidth - 28, Hmax = movil ? innerHeight * (PRENDAS[S.prod].vistas.vuelta ? .23 : .29) : innerHeight - (PRENDAS[S.prod].vistas.vuelta ? 400 : 270);
    escena.style.width = Math.max(200, Math.min(W, Math.max(movil ? 180 : 300, Hmax) * ar)) + 'px';
  }
  addEventListener('resize', () => { ajustarEscena(); actualizarMarco(); });
  function renderCapas() {
    const area = $('#area'); if (!area) return;
    area.querySelectorAll('.el').forEach(n => n.remove());
    capasVista().forEach(el => area.appendChild(nodoEl(el)));
    actualizarMarco(); revisarLimites(); previa();
  }
  function fuenteImg(el) { const i = IMGS[el.img]; return i ? (el.sinFondo && i.sinFondo ? i.sinFondo : i.src) : ''; }
  function nodoEl(el) {
    const d = document.createElement('div'); d.className = 'el' + (el.id === S.sel ? ' sel' : ''); d.dataset.id = el.id;
    if (el.tipo === 'texto') { const c = canvasTexto(el); el._ar = c.height / c.width; d.appendChild(c); }
    else { const im = new Image(); im.src = fuenteImg(el); im.alt = ''; im.draggable = false; im.onload = () => { el._ar = im.naturalHeight / im.naturalWidth; actualizarMarco(); revisarLimites(); }; d.appendChild(im); }
    posicionar(d, el); return d;
  }
  function posicionar(d, el) { Object.assign(d.style, {left: el.x * 100 + '%', top: el.y * 100 + '%', width: el.w * 100 + '%', transform: `translate(-50%,-50%) rotate(${el.rot}deg)`}); }
  function actualizarMarco() {
    const m = $('.marco'), el = elSel(); if (!m) return;
    const d = el && $(`.el[data-id="${el.id}"]`);
    if (!d) { m.hidden = true; return; }
    m.hidden = false;
    Object.assign(m.style, {left: el.x * 100 + '%', top: el.y * 100 + '%', width: d.offsetWidth + 'px', height: d.offsetHeight + 'px', transform: `translate(-50%,-50%) rotate(${el.rot}deg)`});
  }
  function esquinas(el) { // en fracciones del area
    const v = vistaDe(S.prod, S.vista), [, , aw, ah] = areaDe(v), ar = el._ar || 1;
    const w = el.w * aw, h = w * ar, r = el.rot * Math.PI / 180, cx = el.x * aw, cy = el.y * ah;
    return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([sx, sy]) => { const px = sx * w / 2, py = sy * h / 2; return [(cx + px * Math.cos(r) - py * Math.sin(r)) / aw, (cy + px * Math.sin(r) + py * Math.cos(r)) / ah]; });
  }
  function revisarLimites() {
    const sangra = vistaDe(S.prod, S.vista).sangrado, fuera = sangra ? [] : capasVista().filter(el => esquinas(el).some(([x, y]) => x < -.01 || x > 1.01 || y < -.01 || y > 1.01));
    $$('.el').forEach(d => d.classList.toggle('fuera', fuera.some(f => f.id === d.dataset.id)));
    const v = vistaDe(S.prod, S.vista), [, , aw, ah] = areaDe(v);
    $('#estado-esc').innerHTML = fuera.length ? '<b class="alerta">Una parte del diseño queda fuera del área de impresión. Muévelo o hazlo más pequeño.</b>'
      : sangra && capasVista().length ? `El diseño cubre ${PRENDAS[S.prod].art} completo, de borde a borde (${cm(v.cm)} × ${cm(v.cm * ah / aw)} cm). Puedes pasarte del borde: lo que sobra se corta ahí.`
      : (capasVista().length ? `${v.talla ? `<b>Talla ${v.talla}</b> · prenda ${v.prenda[0]} × ${v.prenda[1]} cm · ` : ''}guía ${cm(v.cm)} × ${cm(v.cm * ah / aw)} cm · <b>tu diseño: ${medidaDiseno(S.vista)}</b>` : 'Agrega un texto, tu logo o un sticker desde el paso 2.');
  }

  // Caja que ocupa el diseño de una vista, en fracciones del área de impresión
  const arDe = el => el.tipo === 'texto' ? (c => c.height / c.width)(canvasTexto(el)) : (IMGS[el.img]?.w ? IMGS[el.img].h / IMGS[el.img].w : (el._ar || 1));
  function cajaDiseno(k) {
    const l = S.capas[k] || []; if (!l.length) return null;
    const v = vistaDe(S.prod, k), [, , aw, ah] = areaDe(v), xs = [], ys = [];
    l.forEach(el => { const w = el.w * aw, h = w * arDe(el), r = el.rot * Math.PI / 180; [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([a, b]) => { const px = a * w / 2, py = b * h / 2; xs.push(el.x + (px * Math.cos(r) - py * Math.sin(r)) / aw); ys.push(el.y + (px * Math.sin(r) + py * Math.cos(r)) / ah); }); });
    return {x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys)};
  }
  function tamDiseno(k) { const b = cajaDiseno(k); if (!b) return null; const v = vistaDe(S.prod, k), [, , aw, ah] = areaDe(v); return v.sangrado ? [v.cm, v.cm * ah / aw] : [(b.x1 - b.x0) * v.cm, (b.y1 - b.y0) * v.cm * ah / aw]; }
  const medidaDiseno = k => { const t = tamDiseno(k); return t ? `${cm(t[0])} × ${cm(t[1])} cm` : ''; };

  /* ═════════ Arrastrar, girar y cambiar tamaño ═════════ */
  let accion = null;
  escena.addEventListener('pointerdown', e => {
    const area = $('#area'); if (!area) return;
    const r = area.getBoundingClientRect(), h = e.target.closest('.h-tam, .h-rot, .h-borrar'), d = e.target.closest('.el');
    if (h && h.classList.contains('h-borrar')) { borrarSel(); e.preventDefault(); return; }
    let el = elSel();
    if (!h) { if (!d) { S.sel = null; renderCapas(); panelEl(); return; } if (d.dataset.id !== S.sel) { S.sel = d.dataset.id; el = elSel(); renderCapas(); panelEl(); irPaso(2, true); } }
    if (!el) return;
    const cx = r.left + el.x * r.width, cy = r.top + el.y * r.height;
    accion = {tipo: h ? (h.classList.contains('h-tam') ? 'tam' : 'rot') : 'mover', r, x0: e.clientX, y0: e.clientY, ex: el.x, ey: el.y, w0: el.w, d0: Math.hypot(e.clientX - cx, e.clientY - cy) || 1, cx, cy, movio: false};
    try { escena.setPointerCapture(e.pointerId); } catch (err) {} e.preventDefault();
  });
  escena.addEventListener('pointermove', e => {
    if (!accion) return; const el = elSel(); if (!el) return; const a = accion; a.movio = true;
    const gv = $('.guia-v'), gh = $('.guia-h');
    if (a.tipo === 'mover') {
      let x = a.ex + (e.clientX - a.x0) / a.r.width, y = a.ey + (e.clientY - a.y0) / a.r.height;
      const sx = Math.abs(x - .5) < .025, sy = Math.abs(y - .5) < .025; if (sx) x = .5; if (sy) y = .5;
      gv.classList.toggle('ver', sx); gh.classList.toggle('ver', sy);
      el.x = Math.min(1.2, Math.max(-.2, x)); el.y = Math.min(1.2, Math.max(-.2, y));
    } else if (a.tipo === 'tam') {
      el.w = Math.min(vistaDe(S.prod, S.vista).sangrado ? 3 : 1.6, Math.max(.05, a.w0 * Math.hypot(e.clientX - a.cx, e.clientY - a.cy) / a.d0));
    } else {
      let g = Math.atan2(e.clientY - a.cy, e.clientX - a.cx) * 180 / Math.PI + 90;
      const cerca = Math.round(g / 45) * 45; if (Math.abs(g - cerca) < 5) g = cerca;
      el.rot = Math.round(((g + 540) % 360) - 180);
    }
    const d = $(`.el[data-id="${el.id}"]`); if (d) posicionar(d, el); actualizarMarco(); revisarLimites(); medidas(); previa();
  });
  const soltar = () => { if (!accion) return; const m = accion.movio; accion = null; $$('.guia-v, .guia-h').forEach(g => g.classList.remove('ver')); if (m) { guardarHist(); panelEl(); } };
  escena.addEventListener('pointerup', soltar); escena.addEventListener('pointercancel', soltar);
  addEventListener('resize', actualizarMarco);

  document.addEventListener('keydown', e => {
    const escribiendo = /input|textarea|select/i.test(document.activeElement.tagName);
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !escribiendo) { e.preventDefault(); e.shiftKey ? rehacer() : deshacer(); return; }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y' && !escribiendo) { e.preventDefault(); rehacer(); return; }
    const el = elSel(); if (!el || escribiendo) return;
    if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); borrarSel(); }
    else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') { e.preventDefault(); duplicarSel(); }
    else if (e.key.startsWith('Arrow')) { e.preventDefault(); const p = e.shiftKey ? .02 : .004; if (e.key === 'ArrowLeft') el.x -= p; if (e.key === 'ArrowRight') el.x += p; if (e.key === 'ArrowUp') el.y -= p; if (e.key === 'ArrowDown') el.y += p; renderCapas(); clearTimeout(e.target._t); e.target._t = setTimeout(guardarHist, 300); }
    else if (e.key === 'Escape') { S.sel = null; renderCapas(); panelEl(); }
  });

  function agregar(el, vista = S.vista) { if (vista !== S.vista) { S.vista = vista; } capasVista().push(el); S.sel = el.id; todo(); guardarHist(); }
  function borrarSel() { const l = capasVista(), i = l.findIndex(e => e.id === S.sel); if (i < 0) return; l.splice(i, 1); S.sel = null; renderCapas(); panelEl(); guardarHist(); }
  function duplicarSel() { const el = elSel(); if (!el) return; const c = JSON.parse(JSON.stringify(el)); c.id = nuevoId(); c.x += .05; c.y += .05; agregar(c); }
  function moverCapa(dir) { const l = capasVista(), i = l.findIndex(e => e.id === S.sel); const j = i + dir; if (i < 0 || j < 0 || j >= l.length) return; [l[i], l[j]] = [l[j], l[i]]; renderCapas(); panelEl(); guardarHist(); }

  /* ═════════ Paso 1: producto y color ═════════ */
  function panelProducto() {
    $('#prods-p').innerHTML = Object.entries(PRENDAS).map(([k, p]) => `<button type="button" data-p="${k}" class="${k === S.prod ? 'on' : ''}" aria-pressed="${k === S.prod}"><span class="ico-p">${dibujo(k, 'frente', 'base', '#E6E0D2', k === S.prod ? tipo().id : undefined)}</span><b>${p.corto || p.nombre}</b><small>Desde ${pesos(Math.min(...tiposDe(k).map(x => x.precio)))}</small></button>`).join('');
    const P = PRENDAS[S.prod], T1 = tipo(), varios = tiposDe(S.prod);
    $('#tipos-p').hidden = varios.length < 2; $('#tipos-p').innerHTML = varios.map(x => `<button type="button" data-t="${x.id}" class="${x.id === T1.id ? 'on' : ''}" aria-pressed="${x.id === T1.id}"><b>${x.corto}</b><small>${pesos(x.precio)}</small></button>`).join('');
    $('#colores-p').innerHTML = colores().map(([n, h]) => `<button type="button" style="--c:${h}" data-c="${h}" class="${h === S.color && S.otro === null ? 'on' : ''}" aria-label="${n}" title="${n}"></button>`).join('') + `<button type="button" class="otro-c${S.otro !== null ? ' on' : ''}" data-otro aria-pressed="${S.otro !== null}"><i></i>Otro</button>`;
    const oc = $('#otro-color'); oc.hidden = S.otro === null;
    if (S.otro !== null && !oc.contains(document.activeElement)) { const tela = P.tecnica === 'DTF'; oc.innerHTML = `<label class="et" for="otro-txt">¿Qué color quieres?</label><div class="otro-f">${tela ? `<input type="color" id="otro-hex" value="${S.color}" aria-label="Muestra del color">` : ''}<input type="text" id="otro-txt" maxlength="60" value="${esc(S.otro)}" placeholder="${tela ? 'Ej.: verde militar' : S.prod === 'mug' ? 'Ej.: interior y asa rojos' : 'Ej.: tapa negra'}"></div><p class="nota-r">${tela ? 'Elige una muestra parecida y escribe el nombre.' : `La parte estampada va sobre blanco; dinos si quieres otro color por dentro${S.prod === 'mug' ? ' o en el asa' : ' o en la tapa'}.`} Te confirmamos si lo tenemos antes de producir.</p>`; }
    $('#color-nombre').textContent = S.otro === null ? colorNombre() : 'Otro';
    const precios = `<b>${T1.nombre}: ${pesos(T1.precio)}${T1.dos ? ` por un lado y ${pesos(T1.dos)} por los dos` : ''}.</b> ${T1.baja ? textoBaja(T1) + '. ' : ''}Nombres y diseño sin costo.<br>`;
    $('#info-tec').innerHTML = precios + (P.tecnica === 'DTF'
      ? `<b>Estampado DTF.</b> Funciona en tela clara u oscura y a todo color. ${P.tallas ? `En talla ${S.talla} la guía es` : 'Medida de referencia'}: ${vistasDe(P).map(([, v]) => `${v.nombre.toLowerCase()} ${medCm(v)}`).join(' · ')}.`
      : `<b>Sublimación.</b> El diseño queda dentro del material. Puede cubrirlo todo${S.prod === 'mug' ? ', de asa a asa' : ''}: ${cm(P.vistas.vuelta.cm)} × ${cm(P.vistas.vuelta.cm * P.vistas.vuelta.area[3] / P.vistas.vuelta.area[2])} cm.`);
    tablaMedidas();
  }
  function tablaMedidas() {
    const P = PRENDAS[S.prod], c = $('#tabla-medidas'); c.hidden = !P.tallas; if (!P.tallas) return;
    $('#tabla-m').innerHTML = `<tr><th>Talla</th><th>Prenda<small>ancho × largo</small></th>${vistasDe(P).map(([, v]) => `<th>Guía ${v.nombre.toLowerCase()}<small>ancho × alto</small></th>`).join('')}</tr>` + P.tallas.map(t => enTalla(t, () => { const l = vistasDe(P); return `<tr class="${t === S.talla ? 'on' : ''}"><td><b>${t}</b></td><td>${l[0][1].prenda.join(' × ')}</td>${l.map(([, v]) => `<td>${medCm(v).replace(/,0/g, '').replace(' cm', '')}</td>`).join('')}</tr>`; })).join('');
  }
  $('#tipos-p').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; S.tipo = b.dataset.t; tipoBueno(); renderEscena(); panelProducto(); vistasBar(); panelTallas(); guardarHist(); });
  $('#prods-p').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; cambiarProducto(b.dataset.p); });
  function cambiarProducto(p) {
    if (!PRENDAS[p]) return; const antes = PRENDAS[S.prod].tecnica; S.prod = p; S.tipo = tiposDe(p)[0].id; const P = PRENDAS[p];
    if (antes !== P.tecnica) S.otro = null;
    tipoBueno();
    prepararCapas(); S.sel = null; todo(); guardarHist();
  }
  $('#colores-p').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return;
    if ('otro' in b.dataset) { S.otro = S.otro === null ? '' : S.otro; } else { S.otro = null; S.color = b.dataset.c; }
    renderEscena(); panelProducto(); vistasBar(); guardarHist(); if ('otro' in b.dataset) $('#otro-txt').focus(); });
  $('#otro-color').addEventListener('input', e => {
    if (e.target.id === 'otro-txt') S.otro = e.target.value;
    if (e.target.id === 'otro-hex') { S.color = e.target.value.toUpperCase(); renderEscena(); }
    clearTimeout(escena._o); escena._o = setTimeout(guardarHist, 400);
  });
  function vistasBar() {
    if ($('#precio-p')) pintarTotal();
    const P = PRENDAS[S.prod];
    $('#vistas').classList.toggle('una', vistasDe(P).length === 1); $('#vistas').innerHTML = vistasDe(P).map(([k, v]) => `<button type="button" data-v="${k}" class="${k === S.vista ? 'on' : ''}">${v.nombre}${(S.capas[k] || []).length ? `<i>${S.capas[k].length}</i>` : ''}</button>`).join('');
    const te = $('#tallas-esc'); te.hidden = !P.tallas; if (P.tallas) te.innerHTML = `<span>Ver en talla</span>` + P.tallas.map(t => `<button type="button" data-ver="${t}" class="${t === S.talla ? 'on' : ''}" aria-pressed="${t === S.talla}">${t}${S.modo === 'tallas' && S.tallas[t] > 0 ? `<i>${S.tallas[t]}</i>` : ''}</button>`).join('');
  }
  function verTalla(t) { if (!PRENDAS[S.prod].tallas?.includes(t) || t === S.talla) return; S.talla = t; renderEscena(); vistasBar(); panelProducto(); medidas(); guardarBorrador(); }
  $('#tallas-esc').addEventListener('click', e => { const b = e.target.closest('[data-ver]'); if (b) verTalla(b.dataset.ver); });
  $('#vistas').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; S.vista = b.dataset.v; S.sel = null; todo(); guardarBorrador(); });

  /* ═════════ Paso 2: diseño ═════════ */
  $('#add-texto').addEventListener('click', () => { agregar(nuevoTexto({texto: 'TU TEXTO', color: claro(fondoDe(S.prod, S.color, S.tipo)) ? '#053468' : '#FECF03', y: capasVista().length ? .6 : .35})); setTimeout(() => $('#t-texto')?.select(), 50); });
  $('#add-img').addEventListener('click', () => $('#archivo-p').click());
  $('#archivo-p').addEventListener('change', e => { const f = e.target.files[0]; if (f) cargarImagen(f); e.target.value = ''; });
  escena.addEventListener('dragover', e => { e.preventDefault(); escena.classList.add('soltando'); });
  escena.addEventListener('dragleave', () => escena.classList.remove('soltando'));
  escena.addEventListener('drop', e => { e.preventDefault(); escena.classList.remove('soltando'); const f = e.dataTransfer.files[0]; if (f && f.type.startsWith('image/')) cargarImagen(f); });
  function cargarImagen(f, reemplazar) {
    if (!/image\/(png|jpe?g|webp|svg\+xml|gif)/.test(f.type)) { aviso('Ese archivo no es una imagen. Usa PNG, JPG, WEBP o SVG.'); return; }
    const lector = new FileReader();
    lector.onload = () => { const im = new Image(); im.onload = () => {
      const id = 'im' + Math.random().toString(36).slice(2, 8);
      IMGS[id] = {src: lector.result, w: im.naturalWidth, h: im.naturalHeight, nombre: f.name, archivo: f, svg: f.type.includes('svg')};
      if (reemplazar) { const el = elSel(); el.img = id; el.sinFondo = false; renderCapas(); panelEl(); guardarHist(); }
      else { Object.keys(S.capas).forEach(k => { S.capas[k] = S.capas[k].filter(e => !(e.defecto && e.texto === 'TU NOMBRE')); }); const v = vistaDe(S.prod, S.vista), [, , aw, ah] = areaDe(v); agregar({id: nuevoId(), tipo: 'imagen', img: id, x: .5, y: v.sangrado ? .5 : .42, w: v.sangrado ? Math.min(.55, .9 * ah / aw * im.naturalWidth / im.naturalHeight) : .55, rot: 0, sinFondo: false}); }
    }; im.src = lector.result; };
    lector.readAsDataURL(f);
  }
  function quitarFondo(id) {
    const i = IMGS[id]; if (i.sinFondo) return Promise.resolve();
    return new Promise(ok => { const im = new Image(); im.onload = () => {
      const k = Math.min(1, 1600 / Math.max(im.naturalWidth, im.naturalHeight)), c = document.createElement('canvas'); c.width = Math.round(im.naturalWidth * k); c.height = Math.round(im.naturalHeight * k);
      const x = c.getContext('2d'); x.drawImage(im, 0, 0, c.width, c.height); const d = x.getImageData(0, 0, c.width, c.height), p = d.data;
      for (let n = 0; n < p.length; n += 4) { const m = Math.min(p[n], p[n + 1], p[n + 2]); if (m > 238) p[n + 3] = 0; else if (m > 210) p[n + 3] = Math.round(p[n + 3] * (238 - m) / 28); }
      x.putImageData(d, 0, 0); i.sinFondo = c.toDataURL('image/png'); ok(); }; im.src = i.src; });
  }
  $('#add-sticker').addEventListener('click', () => { $('#stickers-p').hidden = !$('#stickers-p').hidden; $('#plantillas-p').hidden = true; });
  $('#stickers-p').innerHTML = STICKERS.map(n => `<button type="button" data-s="${n}" aria-label="Sticker ${n}"><img src="../img/ilus/${n}.webp" alt="" loading="lazy"></button>`).join('');
  $('#stickers-p').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; agregar({id: nuevoId(), tipo: 'imagen', img: 'st:' + b.dataset.s, x: .5, y: .45, w: vistaDe(S.prod, S.vista).sangrado ? .28 : .42, rot: 0}); $('#stickers-p').hidden = true; });

  const PLANTILLAS = [
    {n: 'Nombre y número', d: 'En la espalda, como camiseta de equipo', prendas: ['camiseta', 'buzo', 'polo'], arma: () => { S.modo = 'nombres'; return [['espalda', nuevoTexto({texto: 'NOMBRE', variable: true, fuente: 'poster', x: .5, y: .16, w: .78})], ['espalda', nuevoTexto({texto: '10', fuente: 'poster', x: .5, y: .58, w: .5})]]; }},
    {n: 'Logo al pecho', d: 'Pequeño a la izquierda, como dotación', prendas: ['polo', 'camiseta', 'buzo'], arma: () => [['frente', nuevoTexto({texto: 'TU LOGO', fuente: 'pop', x: .76, y: .14, w: .3})]], luego: 'Toca «Imagen o logo» para cambiarlo por el tuyo.'},
    {n: 'Familia de Navidad', d: 'Sticker navideño y apellido en curva', prendas: ['camiseta', 'buzo'], arma: () => [['frente', nuevoTexto({texto: 'FAMILIA PÉREZ', curva: 38, x: .5, y: .16, w: .86, color: '#B30A51', contorno: true, colorBorde: '#FFFFFF'})], ['frente', {id: nuevoId(), tipo: 'imagen', img: 'st:navidad', x: .5, y: .52, w: .46, rot: 0}], ['frente', nuevoTexto({texto: 'NAVIDAD 2026', x: .5, y: .88, w: .7, color: '#1F9D55'})]]},
    {n: 'Promoción', d: 'Curso y año al frente, nombre en la espalda', prendas: ['buzo', 'camiseta'], arma: () => { S.modo = 'nombres'; return [['frente', nuevoTexto({texto: 'PROMOCIÓN', curva: 32, x: .5, y: .2, w: .82})], ['frente', nuevoTexto({texto: '2026', fuente: 'poster', x: .5, y: .62, w: .55})], ['espalda', nuevoTexto({texto: 'NOMBRE', variable: true, fuente: 'pop', x: .5, y: .12, w: .7})]]; }},
    {n: 'Frase centrada', d: 'Una frase grande en el pecho', prendas: null, arma: () => [['frente', nuevoTexto({texto: 'TU FRASE\nAQUÍ', x: .5, y: .45, w: .8})]]},
    {n: 'Foto con nombre', d: 'Para mugs y termos de regalo', prendas: ['mug', 'termo'], arma: () => [['frente', {id: nuevoId(), tipo: 'imagen', img: 'st:estrella', x: .5, y: .4, w: .6, rot: 0}], ['frente', nuevoTexto({texto: 'NOMBRE', x: .5, y: .86, w: .8, color: '#053468'})]], luego: 'Toca la estrella y usa «Cambiar imagen» para poner tu foto.'},
  ];
  $('#add-plantilla').addEventListener('click', () => { $('#plantillas-p').hidden = !$('#plantillas-p').hidden; $('#stickers-p').hidden = true; });
  $('#plantillas-p').innerHTML = PLANTILLAS.map((p, i) => `<button type="button" data-i="${i}"><b>${p.n}</b><small>${p.d}</small></button>`).join('');
  $('#plantillas-p').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return; const p = PLANTILLAS[+b.dataset.i];
    if (vistasDe(PRENDAS[S.prod]).some(([k]) => capasVista(k).length) && !confirm('La plantilla reemplaza tu diseño actual. ¿Seguimos?')) return;
    if (p.prendas && !p.prendas.includes(S.prod)) cambiarProducto(p.prendas[0]);
    S.capas = {}; const piezas = p.arma(); piezas.forEach(([v, el]) => { if (vistaDe(S.prod, v)) capasVista(v).push(el); });
    S.vista = piezas[0][0]; prepararCapas(); S.sel = null; $('#plantillas-p').hidden = true; todo(); guardarHist();
    if (p.luego) aviso(p.luego); if (S.modo === 'nombres') aviso('Esta plantilla usa un nombre por prenda: llena la lista en el paso 3.');
  });

  function medidas() {
    const el = elSel(), m = $('#medida-el'); if (!el || !m) return;
    const v = vistaDe(S.prod, S.vista), wcm = el.w * v.cm, hcm = wcm * (el._ar || 1);
    let q = '';
    if (el.tipo === 'imagen' && IMGS[el.img] && !IMGS[el.img].sticker && !IMGS[el.img].svg) {
      const ppp = Math.round(IMGS[el.img].w / (wcm / 2.54));
      const [cl, tx] = ppp >= 200 ? ['ok', 'Calidad excelente'] : ppp >= 130 ? ['ok', 'Buena calidad'] : ppp >= 90 ? ['med', 'Calidad regular: puede verse un poco borrosa'] : ['mal', 'Calidad baja: se verá pixelada. Usa una imagen más grande o redúcela'];
      q = `<span class="calidad ${cl}">${tx} · ${ppp} ppp</span>`;
    }
    const P = PRENDAS[S.prod], otras = P.tallas ? `<span class="por-talla">${P.tallas.map(t => enTalla(t, () => { const x = vistaDe(S.prod, S.vista); return `<span class="${t === S.talla ? 'on' : ''}"><b>${t}</b> ${cm(el.w * x.cm)} × ${cm(el.w * x.cm * (el._ar || 1))}</span>`; })).join('')}</span>` : '';
    m.innerHTML = `Medida${P.tallas ? ' en talla ' + S.talla : ''}: <b>${cm(wcm)} × ${cm(hcm)} cm</b>${q}${otras}`;
  }
  const otroTinta = c => `<label class="otro-c${TINTAS.some(t => t[1].toLowerCase() === c.toLowerCase()) ? '' : ' on'}"><i></i>Otro<input type="color" value="${c}" aria-label="Otro color"></label>`;
  function panelEl() {
    const box = $('#editor-el'), el = elSel(); listaCapas();
    if (!el) { box.innerHTML = '<p class="vacio-el">Toca un elemento del diseño para editarlo, o agrega uno arriba.</p>'; return; }
    const comunes = `<div class="fila-r"><label>Tamaño</label><input type="range" id="t-w" min="5" max="${vistaDe(S.prod, S.vista).sangrado ? 300 : 160}" value="${Math.round(el.w * 100)}"></div>
      <div class="fila-r"><label>Giro</label><input type="range" id="t-rot" min="-180" max="180" value="${el.rot}"><span>${el.rot}°</span></div>
      <p class="medida" id="medida-el"></p>
      <div class="acciones-el"><button type="button" data-a="centrar">Centrar</button><button type="button" data-a="dup">Duplicar</button><button type="button" data-a="arriba">Traer adelante</button><button type="button" data-a="abajo">Enviar atrás</button><button type="button" data-a="borrar" class="peligro">Borrar</button></div>`;
    if (el.tipo === 'texto') {
      box.innerHTML = `<label class="et" for="t-texto">Texto</label><textarea id="t-texto" rows="2" maxlength="60" ${el.variable ? 'disabled' : ''}>${esc(el.texto)}</textarea>
        <label class="check"><input type="checkbox" id="t-var" ${el.variable ? 'checked' : ''}> Cambia en cada prenda (un nombre por prenda)</label>
        <label class="et">Letra</label><div class="fuentes">${Object.entries(FUENTES).map(([k, f]) => `<button type="button" data-f="${k}" class="${k === el.fuente ? 'on' : ''}" style="font-family:${f.fam.replace(/"/g, "'")};font-weight:${f.peso}">${f.nombre}</button>`).join('')}</div>
        <label class="et">Color del texto</label><div class="tintas-p" data-para="color">${TINTAS.map(([n, h]) => `<button type="button" style="--c:${h}" data-c="${h}" class="${h.toLowerCase() === el.color.toLowerCase() ? 'on' : ''}" title="${n}" aria-label="${n}"></button>`).join('')}${otroTinta(el.color)}</div>
        <label class="check"><input type="checkbox" id="t-borde" ${el.contorno ? 'checked' : ''}> Contorno</label>
        <div class="borde-op" ${el.contorno ? '' : 'hidden'}><div class="tintas-p" data-para="colorBorde">${TINTAS.map(([n, h]) => `<button type="button" style="--c:${h}" data-c="${h}" class="${h.toLowerCase() === el.colorBorde.toLowerCase() ? 'on' : ''}" title="${n}" aria-label="${n}"></button>`).join('')}${otroTinta(el.colorBorde)}</div><div class="fila-r"><label>Grosor</label><input type="range" id="t-grosor" min="1" max="8" value="${el.grosor}"></div></div>
        <div class="fila-r"><label>Curva</label><input type="range" id="t-curva" min="-100" max="100" value="${el.curva}"><span>${el.curva}</span></div>` + comunes;
    } else {
      const i = IMGS[el.img] || {}, propia = !i.sticker;
      box.innerHTML = `<p class="archivo-el">${propia ? '<b>Tu imagen:</b> ' + esc(i.nombre || '') + (i.w ? ` · ${i.w} × ${i.h} px` : '') : '<b>Sticker</b>'}</p>
        <div class="acciones-el"><button type="button" data-a="cambiar">Cambiar imagen</button>${vistaDe(S.prod, S.vista).sangrado ? `<button type="button" data-a="cubrir">Cubrir todo ${PRENDAS[S.prod].art.replace('un ', 'el ')}</button>` : ''}${propia && !i.svg ? `<label class="check"><input type="checkbox" id="t-fondo" ${el.sinFondo ? 'checked' : ''}> Quitar fondo blanco</label>` : ''}</div>` + comunes;
    }
    medidas();
  }
  const box = $('#editor-el');
  box.addEventListener('input', e => {
    const el = elSel(); if (!el) return; const t = e.target;
    if (t.id === 't-texto') { el.texto = t.value; delete el.defecto; }
    else if (t.id === 't-w') el.w = t.value / 100;
    else if (t.id === 't-rot') { el.rot = +t.value; t.nextElementSibling.textContent = t.value + '°'; }
    else if (t.id === 't-curva') { el.curva = +t.value; t.nextElementSibling.textContent = t.value; }
    else if (t.id === 't-grosor') el.grosor = +t.value;
    else if (t.type === 'color') { el[t.closest('.tintas-p').dataset.para] = t.value; }
    else return;
    renderCapas(); medidas(); clearTimeout(box._t); box._t = setTimeout(guardarHist, 400);
  });
  box.addEventListener('change', async e => {
    const el = elSel(); if (!el) return; const t = e.target;
    if (t.id === 't-var') { el.variable = t.checked; if (t.checked) { S.modo = 'nombres'; panelTallas(); aviso('Llena la lista de nombres en el paso 3. En la vista previa ves el primero.'); } }
    else if (t.id === 't-borde') el.contorno = t.checked;
    else if (t.id === 't-fondo') { if (t.checked) { aviso('Quitando el fondo blanco…'); await quitarFondo(el.img); } el.sinFondo = t.checked; }
    else return;
    renderCapas(); panelEl(); guardarHist();
  });
  box.addEventListener('click', e => {
    const el = elSel(); if (!el) return;
    const f = e.target.closest('[data-f]'); if (f) { el.fuente = f.dataset.f; renderCapas(); panelEl(); guardarHist(); return; }
    const c = e.target.closest('.tintas-p button'); if (c) { el[c.closest('.tintas-p').dataset.para] = c.dataset.c; renderCapas(); panelEl(); guardarHist(); return; }
    const a = e.target.closest('[data-a]')?.dataset.a; if (!a) return;
    if (a === 'centrar') { el.x = .5; renderCapas(); guardarHist(); }
    if (a === 'cubrir') { const [, , aw, ah] = areaDe(vistaDe(S.prod, S.vista)); Object.assign(el, {x: .5, y: .5, rot: 0, w: Math.max(1, ah / aw / (el._ar || 1))}); renderCapas(); panelEl(); guardarHist(); }
    if (a === 'dup') duplicarSel(); if (a === 'borrar') borrarSel(); if (a === 'arriba') moverCapa(1); if (a === 'abajo') moverCapa(-1);
    if (a === 'cambiar') { const inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'image/*'; inp.onchange = () => inp.files[0] && cargarImagen(inp.files[0], true); inp.click(); }
  });
  function listaCapas() {
    const l = capasVista();
    $('#capas-p').innerHTML = l.length ? [...l].reverse().map(el => `<button type="button" data-id="${el.id}" class="${el.id === S.sel ? 'on' : ''}"><span class="mini-c">${el.tipo === 'texto' ? 'T' : `<img src="${fuenteImg(el)}" alt="">`}</span>${el.tipo === 'texto' ? esc(el.variable ? 'Nombre (cambia por prenda)' : el.texto.replace(/\n/g, ' ')) : esc(IMGS[el.img]?.nombre || 'Imagen')}</button>`).join('') : '<p class="vacio-el">Esta vista no tiene diseño todavía.</p>';
  }
  $('#capas-p').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; S.sel = b.dataset.id; renderCapas(); panelEl(); });

  /* ═════════ Paso 3: tallas o nombres ═════════ */
  function totalUnidades() { const P = PRENDAS[S.prod]; if (!P.tallas) return S.cant; if (S.modo === 'nombres') return S.nombres.filter(n => n.nombre.trim()).length; return Object.values(S.tallas).reduce((a, b) => a + b, 0); }
  function panelTallas() {
    const P = PRENDAS[S.prod], c = $('#tallas-c');
    if (!P.tallas) c.innerHTML = `<label class="et">Cantidad</label><div class="paso-n" data-k="cant"><button type="button" data-d="-1" aria-label="Menos">−</button><input type="number" min="1" value="${S.cant}" aria-label="Cantidad"><button type="button" data-d="1" aria-label="Más">+</button></div>`;
    else c.innerHTML = `<div class="modos"><button type="button" data-m="tallas" class="${S.modo === 'tallas' ? 'on' : ''}">Tallas y cantidades</button><button type="button" data-m="nombres" class="${S.modo === 'nombres' ? 'on' : ''}">Un nombre por prenda</button></div>` +
      (S.modo === 'tallas' ? `<div class="tallas-g">${P.tallas.map(t => `<div><b>${t}</b><div class="paso-n" data-k="${t}"><button type="button" data-d="-1" aria-label="Menos ${t}">−</button><input type="number" min="0" value="${S.tallas[t] || 0}" aria-label="Cantidad ${t}"><button type="button" data-d="1" aria-label="Más ${t}">+</button></div><small>${enTalla(t, () => Object.keys(S.capas).filter(k => vistaDe(S.prod, k) && !vistaDe(S.prod, k).soloDibujo && (S.capas[k] || []).length).map(k => `${vistaDe(S.prod, k).nombre} ${medidaDiseno(k)}`).join('<br>')) || 'Sin diseño'}</small></div>`).join('')}</div>`
      : `<p class="ayuda-p">Cada prenda sale con su nombre. ${Object.values(S.capas).flat().some(e => e.variable) ? '' : '<b>Ojo:</b> marca un texto como «Cambia en cada prenda» en el paso 2, o usa la plantilla «Nombre y número».'}</p>
        <div class="nombres-t">${S.nombres.map((n, i) => `<div class="fila-n"><span>${i + 1}</span><input value="${esc(n.nombre)}" data-i="${i}" placeholder="Nombre" maxlength="24" aria-label="Nombre ${i + 1}"><select data-i="${i}" aria-label="Talla ${i + 1}">${P.tallas.map(t => `<option ${t === n.talla ? 'selected' : ''}>${t}</option>`).join('')}</select><button type="button" data-borrar="${i}" aria-label="Quitar">×</button></div>`).join('')}</div>
        <div class="acciones-el"><button type="button" id="mas-nombre">+ Agregar persona</button><button type="button" id="pegar-lista">Pegar una lista</button></div>
        <textarea id="lista-n" hidden rows="5" placeholder="Un nombre por línea. Opcional: la talla después de una coma.&#10;Ana, M&#10;Juan, L"></textarea>`);
    pintarTotal();
  }
  function pintarTotal() {
    const n = totalUnidades(), u = precioU(), p = tipo(), falta = p.baja && n && n < p.baja.desde ? p.baja.desde - n : 0;
    $('#total-u').textContent = n + (n === 1 ? ' unidad' : ' unidades') + (n ? ` · ${pesos(u * n)}` : '');
    $('#precio-p').innerHTML = n ? `${pesos(u)} por unidad${p.dos ? (dosLados() ? ', por los dos lados' : ', por un lado') : ''}${p.baja && n >= p.baja.desde ? `, ya con ${pesos(p.baja.menos)} menos por pedir ${p.baja.desde} o más` : ''}.${falta ? ` Con ${falta} más, la unidad baja ${pesos(p.baja.menos)}.` : ''} El envío va aparte.` : '';
    $('#nota-nino').hidden = !(PRENDAS[S.prod].tallas && (S.modo === 'nombres' ? S.nombres.some(x => x.talla === 'Niño') : S.tallas['Niño'] > 0));
  }
  const tc = $('#tallas-c');
  tc.addEventListener('click', e => {
    const m = e.target.closest('[data-m]'); if (m) { S.modo = m.dataset.m; panelTallas(); guardarBorrador(); return; }
    const d = e.target.closest('[data-d]'); if (d) { const k = d.closest('.paso-n').dataset.k, inp = d.parentNode.querySelector('input'); const v = Math.max(k === 'cant' ? 1 : 0, (+inp.value || 0) + +d.dataset.d); inp.value = v; if (k === 'cant') S.cant = v; else { S.tallas[k] = v; if (v) verTalla(k); } panelTallas(); vistasBar(); guardarBorrador(); return; }
    const b = e.target.closest('[data-borrar]'); if (b) { S.nombres.splice(+b.dataset.borrar, 1); if (!S.nombres.length) S.nombres.push({nombre: '', talla: 'M'}); panelTallas(); renderCapas(); guardarBorrador(); return; }
    if (e.target.id === 'mas-nombre') { S.nombres.push({nombre: '', talla: S.nombres.at(-1)?.talla || 'M'}); panelTallas(); $$('.fila-n input').at(-1).focus(); }
    if (e.target.id === 'pegar-lista') { const t = $('#lista-n'); t.hidden = !t.hidden; t.focus(); }
  });
  tc.addEventListener('input', e => {
    const t = e.target;
    if (t.matches('.paso-n input')) { const k = t.parentNode.dataset.k, v = Math.max(0, +t.value || 0); if (k === 'cant') S.cant = Math.max(1, v); else S.tallas[k] = v; pintarTotal(); guardarBorrador(); }
    if (t.matches('.fila-n input')) { S.nombres[+t.dataset.i].nombre = t.value; pintarTotal(); clearTimeout(tc._t); tc._t = setTimeout(() => { renderCapas(); guardarBorrador(); }, 250); }
  });
  tc.addEventListener('change', e => {
    const t = e.target;
    if (t.matches('.fila-n select')) { S.nombres[+t.dataset.i].talla = t.value; verTalla(t.value); pintarTotal(); guardarBorrador(); }
    if (t.id === 'lista-n') { const P = PRENDAS[S.prod]; const filas = t.value.split('\n').map(l => l.trim()).filter(Boolean).map(l => { const [n, ta] = l.split(/[,;\t]/).map(s => s.trim()); return {nombre: n, talla: P.tallas.find(x => x.toUpperCase() === (ta || '').toUpperCase()) || (/^ni[nñ]/i.test(ta || '') ? 'Niño' : 'M')}; });
      if (filas.length) { S.nombres = S.nombres.filter(n => n.nombre.trim()).concat(filas); panelTallas(); renderCapas(); guardarBorrador(); aviso(filas.length + ' nombres agregados.'); } }
  });

  /* ═════════ Paso 4: ficha, WhatsApp, pedido ═════════ */
  const nuevoCodigo = () => 'TR-' + Date.now().toString(36).toUpperCase().slice(-5) + Math.random().toString(36).slice(2, 4).toUpperCase();
  function ficha() {
    codigo ||= nuevoCodigo();
    const P = PRENDAS[S.prod], color = colorNombre();
    const vistas = vistasDe(P).filter(([k]) => (S.capas[k] || []).length);
    const lineasVista = vistas.map(([k, v]) => {
      const [ax, ay, aw, ah] = areaDe(v);
      return {vista: v.nombre + (v.sangrado ? ` (extendido, ${cm(v.cm)} × ${cm(v.cm * ah / aw)} cm, de borde a borde)` : ''), items: S.capas[k].slice().reverse().map(el => {
        const ar = arDe(el);
        const en = t => enTalla(t ?? S.talla, () => { const v = vistaDe(S.prod, k), [ax, ay, aw, ah] = areaDe(v), ucm = aw / v.cm;
        const wcm = el.w * v.cm, hcm = wcm * ar, dx = (el.x - .5) * v.cm, top = (el.y * ah - hcm * ucm / 2) / ucm;
        const pos = (Math.abs(dx) < .4 ? 'centrado' : `${cm(Math.abs(dx))} cm a la ${dx < 0 ? 'izquierda' : 'derecha'} del centro`) + (v.sangrado ? (S.prod === 'mug' ? ' (el centro es el frente, opuesto al asa)' : ' (el centro es el frente)') : '') + (v.cuello ? `, a ${cm(top + (ay - v.cuello) / ucm)} cm del cuello` : (top < 0 ? `, pasa ${cm(-top)} cm el borde superior (se corta ahí)` : `, a ${cm(top)} cm del borde superior`)) + (el.rot ? `, girado ${el.rot}°` : '');
        return `${t ? `talla ${t}: ` : ''}${cm(wcm)} × ${cm(hcm)} cm, ${pos}`; });
        const med = tallasPedido().map(en).join(' · ');
        if (el.tipo === 'texto') { const f = FUENTES[el.fuente]; return `${el.variable ? `Nombre de cada persona (misma altura de letra; el ancho es el del nombre más largo, «${nombreMasLargo(el)}»)` : `Texto «${el.texto.replace(/\n/g, ' / ')}»`} · letra ${f.nombre} · color ${nombreTinta(el.color)} (${el.color.toUpperCase()})${el.contorno ? ` · contorno ${nombreTinta(el.colorBorde)} grosor ${el.grosor}` : ''}${el.curva ? ` · en curva (${el.curva})` : ''} · ${med}`; }
        const i = IMGS[el.img] || {};
        if (i.sticker) return `${i.nombre} · ${med}`;
        const ppp = i.w ? Math.round(i.w / (Math.max(...tallasPedido().map(t => enTalla(t ?? S.talla, () => el.w * vistaDe(S.prod, k).cm))) / 2.54)) : 0;
        return `Imagen «${i.nombre}»${i.w ? ` (${i.w} × ${i.h} px, ${ppp} ppp)` : ''}${el.sinFondo ? ' · sin fondo blanco' : ''} · ${med}`;
      })};
    });
    const cantidades = !P.tallas ? `${S.cant} ${S.cant === 1 ? 'unidad' : 'unidades'}` : S.modo === 'nombres'
      ? S.nombres.filter(n => n.nombre.trim()).map(n => `${n.nombre} (${n.talla})`).join(', ') || 'Sin nombres todavía'
      : Object.entries(S.tallas).filter(([, n]) => n > 0).map(([t, n]) => `${t} × ${n}`).join(', ') || 'Sin tallas todavía';
    const nU = totalUnidades(), vU = precioU();
    const porTalla = !P.tallas ? [] : tallasPedido().map(t => enTalla(t, () => { const l = vistasDe(P).filter(([k]) => (S.capas[k] || []).length), n = S.modo === 'nombres' ? S.nombres.filter(x => x.nombre.trim() && x.talla === t).length : (S.tallas[t] || 0);
      return {talla: t, n, prenda: vistasDe(P)[0][1].prenda, vistas: l.map(([k, v]) => ({nombre: v.nombre.toLowerCase(), guia: medCm(v), diseno: medidaDiseno(k)}))}; }));
    return {porTalla, codigo, producto: tipo().nombre, unidad: vU, valor: vU * nU, dos: dosLados(), color, tecnica: P.tecnica, total: totalUnidades(), cantidades, modoNombres: S.modo === 'nombres' && !!P.tallas, vistas: lineasVista, notas: S.notas.trim(), cliente: S.cliente.trim(), ciudad: S.ciudad.trim(),
      archivos: vistas.flatMap(([k]) => S.capas[k]).filter(e => e.img && IMGS[e.img] && !IMGS[e.img].sticker).map(e => IMGS[e.img])};
  }
  function textoWA(f) {
    let t = `Hola Tránsfer!, quiero pedir este diseño: *${f.codigo}*\n\n• Producto: ${f.producto} · color ${f.color} · ${f.tecnica}\n• ${f.modoNombres ? 'Nombres y tallas' : 'Cantidad'}: ${f.cantidades} (total ${f.total})\n• Precio en la página: ${pesos(f.unidad)} por unidad${tipo().dos ? (f.dos ? ' (dos lados)' : ' (un lado)') : ''}, ${pesos(f.valor)} sin envío\n`;
    f.vistas.forEach(v => { t += `\n*${v.vista}*\n` + v.items.map(i => '- ' + i).join('\n') + '\n'; });
    if (f.notas) t += `\nNotas: ${f.notas}\n`;
    if (f.cliente || f.ciudad) t += `\n${f.cliente ? 'A nombre de ' + f.cliente : ''}${f.cliente && f.ciudad ? ', ' : ''}${f.ciudad ? 'envío a ' + f.ciudad : ''}\n`;
    t += `\nTe envío la ficha del diseño${f.archivos.length ? ' y mis archivos originales' : ''}.`;
    return t;
  }
  async function renderMockup(vista, ancho) {
    const v = vistaDe(S.prod, vista), [w, h] = v.vb, k = ancho / w, c = document.createElement('canvas'); c.width = Math.round(w * k); c.height = Math.round(h * k);
    const x = c.getContext('2d'); x.scale(k, k);
    const [base, som, bri] = await Promise.all([imgDeSvg(svgDe(S.prod, vista, 'base', S.color)), imgDeSvg(svgDe(S.prod, vista, 'sombra', S.color)), v.brillo ? imgDeSvg(svgDe(S.prod, vista, 'brillo', S.color)) : null]);
    if (base) x.drawImage(base, 0, 0, w, h);
    await dibujarCapas(x, vista);
    if (som) { x.globalCompositeOperation = 'multiply'; x.drawImage(som, 0, 0, w, h); }
    if (bri) { x.globalCompositeOperation = 'screen'; x.drawImage(bri, 0, 0, w, h); }
    x.globalCompositeOperation = 'source-over';
    return c;
  }
  // Pinta las capas de una vista en coordenadas del dibujo; si va de borde a borde, recorta en el borde
  async function dibujarCapas(x, vista) {
    const v = vistaDe(S.prod, vista), [ax, ay, aw, ah] = areaDe(v);
    x.save(); if (v.sangrado) { x.beginPath(); x.rect(ax, ay, aw, ah); x.clip(); }
    for (const el of S.capas[vista] || []) {
      let src;
      if (el.tipo === 'texto') src = canvasTexto(el, 2);
      else src = await new Promise(ok => { const im = new Image(); im.onload = () => ok(im); im.onerror = () => ok(null); im.src = fuenteImg(el); });
      if (!src) continue;
      const sw = src.naturalWidth || src.width, sh = src.naturalHeight || src.height, ew = el.w * aw, eh = ew * sh / sw;
      x.save(); x.translate(ax + el.x * aw, ay + el.y * ah); x.rotate(el.rot * Math.PI / 180); x.drawImage(src, -ew / 2, -eh / 2, ew, eh); x.restore();
    }
    x.restore();
  }
  // Solo el arte extendido, sin el dibujo: es el archivo que va a la impresora de sublimación
  async function arteExtendido(ancho) {
    const [ax, ay, aw, ah] = areaDe(vistaDe(S.prod, 'vuelta')), k = ancho / aw, c = document.createElement('canvas'); c.width = Math.round(ancho); c.height = Math.round(ah * k);
    const x = c.getContext('2d'); x.scale(k, k); x.translate(-ax, -ay); await dibujarCapas(x, 'vuelta'); return c;
  }
  // El mug o el termo armado, visto por un lado: cada columna del arte se dobla sobre el cilindro
  async function renderCilindro(lado, ancho) {
    const cil = vistaDe(S.prod, 'vuelta').cil, L = cil.lados[lado], vt = L.vt, v = vistaDe(S.prod, vt), [w, h] = v.vb, k = ancho / w, c = document.createElement('canvas'); c.width = Math.round(w * k); c.height = Math.round(h * k);
    const x = c.getContext('2d'), arte = await arteExtendido(Math.max(700, ancho * 2));
    const [base, som, bri] = await Promise.all(['base', 'sombra', 'brillo'].map(q => imgDeSvg(L.sinAsa && q === 'sombra' ? svgDe(S.prod, vt, q, S.color).replace(/<path d="M410 190[^>]*opacity="\.12"\/>/, '') : svgDe(S.prod, vt, q, S.color))));
    const cx = v.espejo ? w - cil.cx : cil.cx, giro = L.giro, paso = 1 / k;
    x.scale(k, k); if (L.sinAsa) { x.beginPath(); x.rect(cx - cil.r - 1.5, 0, cil.r * 2 + 3, h); x.clip(); }
    if (base) x.drawImage(base, 0, 0, w, h);
    for (let px = cx - cil.r; px < cx + cil.r; px += paso) {
      const t = Math.max(-1, Math.min(1, (px - cx) / cil.r)), curva = Math.sqrt(1 - t * t), ang = ((Math.asin(t) * 180 / Math.PI + giro + 540) % 360) - 180;
      const u = .5 + ang / 360 * cil.circ / vistaDe(S.prod, 'vuelta').cm; if (u < 0 || u >= 1) continue;
      const y0 = cil.y0 + cil.c0 * curva, y1 = cil.y1 + cil.c1 * curva;
      x.drawImage(arte, Math.min(arte.width - 1, u * arte.width), 0, 1, arte.height, px, y0, paso * 1.6, y1 - y0);
    }
    if (som) { x.globalCompositeOperation = 'multiply'; x.drawImage(som, 0, 0, w, h); }
    if (bri) { x.globalCompositeOperation = 'screen'; x.drawImage(bri, 0, 0, w, h); }
    x.globalCompositeOperation = 'source-over'; return c;
  }
  // Todas las vistas para el resumen y la ficha
  async function mockups(ancho) {
    const P = PRENDAS[S.prod], l = await Promise.all(vistasDe(P).map(async ([k, v]) => ({nombre: v.sangrado ? 'Extendido' : v.nombre, vacia: !(S.capas[k] || []).length, c: await renderMockup(k, ancho)})));
    if (P.vistas.vuelta) for (const [i, L] of P.vistas.vuelta.cil.lados.entries()) l.push({nombre: L.n, vacia: false, c: await renderCilindro(i, ancho)});
    return l;
  }
  // Vista armada en vivo, debajo del escenario
  let tPrevia = 0, nPrevia = 0;
  function previa() {
    const caja = $('#previa-cil'), hay = !!PRENDAS[S.prod].vistas.vuelta; caja.hidden = !hay; if (!hay) return;
    clearTimeout(tPrevia); tPrevia = setTimeout(async () => {
      const n = ++nPrevia, lados = PRENDAS[S.prod].vistas.vuelta?.cil.lados || [], fotos = await Promise.all(lados.map((_, i) => renderCilindro(i, 260))); if (n !== nPrevia || !PRENDAS[S.prod].vistas.vuelta) return;
      caja.replaceChildren(...fotos.map((c, i) => { const f = document.createElement('figure'), p = document.createElement('figcaption'); p.textContent = lados[i].n; f.append(c, p); return f; }));
    }, 130);
  }
  // Solo el diseño, recortado a lo que ocupa y sobre el color de la prenda
  async function disenoSolo(k, ancho, alto) {
    const v = vistaDe(S.prod, k), [ax, ay, aw, ah] = areaDe(v), b = v.sangrado ? {x0: 0, x1: 1, y0: 0, y1: 1} : cajaDiseno(k), m = v.sangrado ? 0 : .05 * (b.x1 - b.x0) * aw;
    const bx = ax + b.x0 * aw - m, by = ay + b.y0 * ah - m, bw = (b.x1 - b.x0) * aw + 2 * m, bh = (b.y1 - b.y0) * ah + 2 * m, s = Math.min(ancho / bw, alto / bh);
    const c = document.createElement('canvas'); c.width = Math.max(1, Math.round(bw * s)); c.height = Math.max(1, Math.round(bh * s));
    const x = c.getContext('2d'); x.fillStyle = fondoDe(S.prod, S.color, S.tipo); x.fillRect(0, 0, c.width, c.height); x.scale(s, s); x.translate(-bx, -by); await dibujarCapas(x, k);
    return {c, nombre: v.sangrado ? 'Diseño completo' : 'Diseño del ' + (k === 'espalda' ? 'reverso (espalda)' : 'frente'), medida: (tallasPedido()[0] ? `Talla ${tallasPedido()[0]}: ` : '') + enTalla(tallasPedido()[0] ?? S.talla, () => medidaDiseno(k))};
  }
  const vistasConDiseno = () => vistasDe(PRENDAS[S.prod]).map(([k]) => k).filter(k => (S.capas[k] || []).length);
  // Recuadro blanco con un dibujo centrado y su rótulo
  function cuadro(x, img, px, py, w, h, rotulo, sub) {
    x.fillStyle = '#fff'; x.strokeStyle = T; x.lineWidth = 3; x.beginPath(); x.roundRect(px, py, w, h, 22); x.fill(); x.stroke();
    const pie = sub ? 78 : 50, k = Math.min((w - 28) / img.width, (h - pie - 22) / img.height), iw = img.width * k, ih = img.height * k;
    x.drawImage(img, px + (w - iw) / 2, py + 14 + (h - pie - 22 - ih) / 2, iw, ih);
    x.fillStyle = T; x.font = '900 22px Rubik'; x.fillText(rotulo.toUpperCase(), px + 20, py + h - (sub ? 46 : 20));
    if (sub) { x.font = '700 20px Rubik'; x.fillStyle = '#B30A51'; x.fillText(sub, px + 20, py + h - 18); }
  }
  async function filaCuadros(x, piezas, pad, W, y, alto) {
    const n = piezas.length, g = 26, w = (W - pad * 2 - (n - 1) * g) / n;
    piezas.forEach((p, i) => cuadro(x, p.c, pad + i * (w + g), y, w, alto, p.nombre, p.medida));
    return y + alto;
  }
  const estadoAprob = () => { const a = leerLS('transfer-aprobaciones', []).find(z => z.codigo === codigo); return a ? `${a.estado}${a.cliente ? ' · ' + a.cliente : ''} · ${new Date(a.cuando || a.fecha).toLocaleString('es-CO', {dateStyle: 'medium', timeStyle: 'short'})}` : 'Sin enviar al cliente'; };
  async function canvasFicha() {
    const f = ficha(), W = 1400, pad = 50;
    const info = await mockups(600), mocks = info.map(m => m.c);
    const c = document.createElement('canvas'); c.width = W; c.height = 7000; const x = c.getContext('2d');
    x.fillStyle = '#FBF6EC'; x.fillRect(0, 0, W, c.height);
    x.fillStyle = '#053468'; x.fillRect(0, 0, W, 120);
    x.fillStyle = '#FECF03'; x.font = '900 46px Rubik'; x.fillText('Tránsfer!', pad, 75);
    x.fillStyle = '#fff'; x.font = '700 22px Rubik'; x.fillText('Ficha de diseño para producción', pad + 250, 72);
    x.textAlign = 'right'; x.font = '900 34px Rubik'; x.fillStyle = '#FECF03'; x.fillText(f.codigo, W - pad, 62);
    x.font = '500 18px Rubik'; x.fillStyle = '#fff'; x.fillText(new Date().toLocaleString('es-CO', {dateStyle: 'long', timeStyle: 'short'}), W - pad, 92); x.textAlign = 'left';
    let y = 160;
    const solos = await Promise.all(vistasConDiseno().map(k => disenoSolo(k, 1300, 760)));
    if (solos.length) { x.fillStyle = '#B30A51'; x.font = '900 24px Rubik'; x.fillText('EL DISEÑO', pad, y + 10); y = await filaCuadros(x, solos, pad, W, y + 30, 640) + 50; }
    x.fillStyle = '#B30A51'; x.font = '900 24px Rubik'; x.fillText('EN EL PRODUCTO' + (PRENDAS[S.prod].tallas ? ` · VISTO EN TALLA ${S.talla.toUpperCase()}` : ''), pad, y + 10);
    y = await filaCuadros(x, info.map(m => ({c: m.c, nombre: m.nombre + (m.vacia ? ' · sin diseño' : '')})), pad, W, y + 30, info.length > 2 ? 400 : 560) + 50;
    const ancho = W - pad * 2;
    const parrafo = (t, fuente, color, salto = 30) => { x.font = fuente; x.fillStyle = color; const pal = t.split(' '); let l = ''; for (const p of pal) { const prueba = l ? l + ' ' + p : p; if (x.measureText(prueba).width > ancho) { x.fillText(l, pad, y); y += salto; l = p; } else l = prueba; } if (l) { x.fillText(l, pad, y); y += salto; } };
    const titulo = t => { y += 14; x.fillStyle = '#B30A51'; x.font = '900 24px Rubik'; x.fillText(t.toUpperCase(), pad, y); y += 36; };
    titulo('Producto'); parrafo(`${f.producto} · color ${f.color}${S.otro === null ? ` (${S.color})` : ''} · técnica ${f.tecnica}`, '600 24px Rubik', T, 34);
    titulo(f.modoNombres ? `Nombres y tallas (${f.total})` : `Cantidad (${f.total})`); parrafo(f.cantidades, '500 22px Rubik', T, 32);
    if (f.porTalla.length) { titulo('Medidas por talla (de referencia)'); f.porTalla.forEach(p => parrafo(`${p.talla}${p.n ? ' × ' + p.n : ''} · prenda ${p.prenda.join(' × ')} cm` + p.vistas.map(v => ` · ${v.nombre}: guía ${v.guia}, diseño ${v.diseno}`).join(''), '600 21px Rubik', T, 30)); }
    f.vistas.forEach(v => { titulo(v.vista); v.items.forEach((it, i) => parrafo(`${i + 1}. ${it}`, '500 21px Rubik', '#2E3850', 30)); });
    titulo('Aprobación del cliente'); parrafo(estadoAprob(), '700 22px Rubik', T, 32);
    if (f.notas) { titulo('Notas del cliente'); parrafo(f.notas, '500 22px Rubik', T, 32); }
    if (f.cliente || f.ciudad) { titulo('Cliente'); parrafo([f.cliente, f.ciudad].filter(Boolean).join(' · '), '500 22px Rubik', T, 32); }
    if (f.archivos.length) { titulo('Archivos para pedir al cliente'); parrafo(f.archivos.map(a => a.nombre).join(', '), '500 21px Rubik', T, 30); }
    y += 20; x.fillStyle = '#053468'; x.fillRect(0, y, W, 70); x.fillStyle = '#fff'; x.font = '700 20px Rubik'; x.fillText('Tránsfer! · Piedecuesta, Santander · WhatsApp 321 280 8077 · Medidas y colores de referencia: se confirman antes de producir.', pad, y + 43); y += 70;
    const out = document.createElement('canvas'); out.width = W; out.height = y; out.getContext('2d').drawImage(c, 0, 0); return out;
  }
  async function canvasHoja(cliente) {
    const f = ficha(), W = 1080, pad = 44, c = document.createElement('canvas'); c.width = W; c.height = 5000; const x = c.getContext('2d');
    x.fillStyle = '#FBF6EC'; x.fillRect(0, 0, W, c.height); x.fillStyle = '#053468'; x.fillRect(0, 0, W, 130);
    x.fillStyle = '#FECF03'; x.font = '900 50px Rubik'; x.fillText('Tránsfer!', pad, 82); x.textAlign = 'right'; x.font = '900 34px Rubik'; x.fillText(f.codigo, W - pad, 66);
    x.fillStyle = '#fff'; x.font = '500 20px Rubik'; x.fillText(new Date().toLocaleString('es-CO', {dateStyle: 'long', timeStyle: 'short'}), W - pad, 100); x.textAlign = 'left';
    let y = 196; x.fillStyle = '#053468'; x.font = '900 46px Rubik'; x.fillText((cliente ? cliente.split(' ')[0] + ', revisa' : 'Revisa') + ' y aprueba tu diseño', pad, y); y += 46;
    x.fillStyle = '#2E3850'; x.font = '500 25px Rubik'; x.fillText('Empezamos a producir cuando nos digas que sí.', pad, y); y += 50;
    const solos = await Promise.all(vistasConDiseno().map(k => disenoSolo(k, 1300, 900)));
    for (const s of solos) { const h = Math.min(820, Math.max(360, (W - pad * 2 - 28) * s.c.height / s.c.width + 100)); cuadro(x, s.c, pad, y, W - pad * 2, h, s.nombre, s.medida); y += h + 26; }
    const info = (await mockups(620)).filter(m => !m.vacia && m.nombre !== 'Extendido'); y += 18; x.fillStyle = '#B30A51'; x.font = '900 28px Rubik'; x.fillText('ASÍ SE VE PUESTO', pad, y); y = await filaCuadros(x, info.map(m => ({c: m.c, nombre: m.nombre})), pad, W, y + 20, info.length > 2 ? 420 : 600) + 54;
    const dato = (a, b) => { x.fillStyle = '#B30A51'; x.font = '900 22px Rubik'; x.fillText(a.toUpperCase(), pad, y); y += 34; x.fillStyle = T; x.font = '600 26px Rubik'; let l = ''; for (const p of b.split(' ')) { const pr = l ? l + ' ' + p : p; if (x.measureText(pr).width > W - pad * 2) { x.fillText(l, pad, y); y += 36; l = p; } else l = pr; } x.fillText(l, pad, y); y += 48; };
    dato('Producto', `${f.producto} · color ${f.color}`); dato(f.modoNombres ? 'Nombres y tallas' : 'Cantidad', f.cantidades);
    if (f.porTalla.length) dato('Tamaño del diseño', f.porTalla.map(p => `${p.talla}: ` + p.vistas.map(v => `${v.nombre} ${v.diseno}`).join(', ')).join(' · '));
    dato('Antes de aprobar, revisa', 'letras y nombres, colores, tamaño, ubicación, tallas y cantidades. Los colores en pantalla pueden verse un poco distintos.');
    x.fillStyle = '#053468'; x.fillRect(0, y, W, 80); x.fillStyle = '#fff'; x.font = '700 24px Rubik'; x.fillText('Apruébalo en el enlace que te enviamos o responde este chat.', pad, y + 50); y += 80;
    const out = document.createElement('canvas'); out.width = W; out.height = y; out.getContext('2d').drawImage(c, 0, 0); return out;
  }
  const b64u = s => s.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  // El enlace lleva los datos y una vista pequeña. En la tienda real el diseño queda guardado y se ve en alta calidad.
  async function enlaceAprob(f, cliente) {
    const k = vistasConDiseno()[0], solo = (await disenoSolo(k, 500, 500)).c, info = (await mockups(400)).filter(m => !m.vacia && m.nombre !== 'Extendido'), puesto = (info.find(m => m.nombre === 'De frente') || info[0]).c;
    let foto = '';
    for (const [w, q] of [[300, .6], [300, .4], [240, .4], [200, .35], [160, .3], [130, .25]]) {
      const c = document.createElement('canvas'); c.width = w * 2; c.height = w; const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, w * 2, w);
      [solo, puesto].forEach((im, i) => { const s = Math.min(w * .94 / im.width, w * .94 / im.height); x.drawImage(im, i * w + (w - im.width * s) / 2, (w - im.height * s) / 2, im.width * s, im.height * s); });
      foto = c.toDataURL('image/webp', q); if (!foto.startsWith('data:image/webp')) foto = c.toDataURL('image/jpeg', q);
      if (foto.length < 2700) break;
    }
    const d = {c: f.codigo, n: cliente.split(' ')[0], p: f.producto, k: f.color, q: f.cantidades, m: f.porTalla.map(p => `${p.talla}: ` + p.vistas.map(v => `${v.nombre} ${v.diseno}`).join(', ')).join(' · '), f: Date.now()};
    return new URL('aprobar.html', location.href).href.split(/[?#]/)[0] + '#d=' + b64u(btoa(unescape(encodeURIComponent(JSON.stringify(d))))) + (foto.length < 3400 ? '&i=' + (foto.startsWith('data:image/webp') ? 'w' : 'j') + b64u(foto.split(',')[1]) : '');
  }
  const blobDe = c => new Promise(ok => c.toBlob(ok, 'image/png'));
  function descargar(blob, nombre) { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = nombre; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500); }

  async function resumen() {
    const f = ficha();
    $('#codigo-p').textContent = f.codigo;
    $('#mocks-r').innerHTML = '<p class="cargando-r">Preparando la vista previa…</p>';
    const mocks = await mockups(420);
    $('#mocks-r').innerHTML = mocks.map(m => `<figure><img src="${m.c.toDataURL('image/png')}" alt="Vista ${m.nombre}"><figcaption>${m.nombre}</figcaption></figure>`).join('');
    const vacio = !f.vistas.length, muestra = Object.entries(S.capas).filter(([k]) => vistasConDiseno().includes(k)).flatMap(([, l]) => l).find(e => e.tipo === 'texto' && !e.variable && /^(TU NOMBRE|TU TEXTO|TU LOGO|TU FRASE\nAQUÍ)$/.test(e.texto));
    $('#spec-r').innerHTML = `<li><b>Producto</b>${f.producto} · ${esc(f.color)} · ${f.tecnica}</li><li><b>${f.modoNombres ? 'Nombres' : 'Cantidad'}</b>${esc(f.cantidades)} <em>(${f.total} en total)</em></li><li><b>Precio</b>${pesos(f.unidad)} por unidad${tipo().dos ? (f.dos ? ', por los dos lados' : ', por un lado') : ''} · <em>${pesos(f.valor)} sin envío</em></li>` +
      (f.porTalla.length ? `<li><b>Medidas por talla</b><ol class="sin-n">${f.porTalla.map(p => `<li><em>${p.talla}${p.n ? ' × ' + p.n : ''}</em> · prenda ${p.prenda.join(' × ')} cm${p.vistas.map(v => ` · ${v.nombre} ${v.diseno}`).join('')}</li>`).join('')}</ol></li>` : '') +
      f.vistas.map(v => `<li><b>${v.vista}</b><ol>${v.items.map(i => `<li>${esc(i)}</li>`).join('')}</ol></li>`).join('') +
      (muestra ? `<li class="alerta">El diseño todavía dice «${muestra.texto.replace('\n', ' ')}». Cámbialo o bórralo en el paso 2.</li>` : '') + (vacio ? '<li class="alerta">Todavía no hay diseño. Vuelve al paso 2.</li>' : '') + (!f.total ? '<li class="alerta">Falta la cantidad o la lista de nombres (paso 3).</li>' : '');
    $('#enviar-p').disabled = $('#agregar-p').disabled = vacio || !f.total;
    $('#aprob-p').disabled = $('#hoja-p').disabled = vacio || !f.total || !!muestra; listaAprob();
  }
  $('#notas-p').addEventListener('input', e => { S.notas = e.target.value; guardarBorrador(); });
  $('#cliente-p').addEventListener('input', e => { S.cliente = e.target.value; });
  $('#ciudad-p').addEventListener('input', e => { S.ciudad = e.target.value; });
  $('#descargar-p').addEventListener('click', async () => { aviso('Preparando la ficha…'); const c = await canvasFicha(); descargar(await blobDe(c), `Ficha-${codigo}.png`); aviso('Ficha descargada. Adjúntala en WhatsApp con tus archivos.'); });
  $('#enviar-p').addEventListener('click', async () => {
    const f = ficha(), txt = textoWA(f), c = await canvasFicha(), blob = await blobDe(c);
    const arte = PRENDAS[S.prod].vistas.vuelta ? await blobDe(await arteExtendido(Math.round(vistaDe(S.prod, 'vuelta').cm / 2.54 * 300))) : null;   // a 300 ppp
    const archivos = [new File([blob], `Ficha-${f.codigo}.png`, {type: 'image/png'}), ...(arte ? [new File([arte], `Arte-${f.codigo}.png`, {type: 'image/png'})] : []), ...f.archivos.map(a => a.archivo).filter(Boolean)];
    guardarFicha(f);
    if (navigator.canShare && navigator.canShare({files: archivos})) {
      try { await navigator.share({files: archivos, text: txt, title: 'Diseño ' + f.codigo}); return; } catch (e) { if (e.name === 'AbortError') return; }
    }
    descargar(blob, `Ficha-${f.codigo}.png`); if (arte) descargar(arte, `Arte-${f.codigo}.png`);
    window.open(WA + encodeURIComponent(txt), '_blank', 'noopener');
    aviso((arte ? 'Se descargaron la ficha y el arte: adjúntalos en el chat' : 'Se descargó la ficha: adjúntala en el chat') + (f.archivos.length ? ' junto con tus imágenes originales.' : '.'));
  });
  $('#agregar-p').addEventListener('click', async () => {
    const f = ficha(), m = PRENDAS[S.prod].vistas.vuelta ? await renderCilindro(PRENDAS[S.prod].vistas.vuelta.cil.lados.findIndex(L => L.vt === 'frente'), 160) : await renderMockup((S.capas[S.vista] || []).length ? S.vista : vista0(), 160);
    guardarFicha(f);
    window.TRANSFER.agregar({id: tipo().id, dos: f.dos, perso: true, nombre: f.producto, img: m.toDataURL('image/webp', .8), tono: 't-crema', detalle: `${f.codigo} · ${f.color}${f.modoNombres ? ' · ' + f.total + ' nombres' : ''}`, talla: '—', cant: f.total || 1});
  });
  /* ═════════ Modo taller: enviar el diseño al cliente para que lo apruebe ═════════ */
  let taller = leerLS('transfer-taller', false);
  function pintarTaller() { document.body.classList.toggle('modo-taller', taller); $('#taller-r').hidden = !taller; $('#modo-taller').textContent = taller ? 'Salir del modo taller' : '¿Eres del taller? Activa el modo taller'; $('#pasos-p [data-paso="4"]').lastChild.textContent = taller ? 'Aprobar' : 'Enviar'; }
  const cambiarTaller = v => { taller = v; guardarLS('transfer-taller', v); pintarTaller(); };
  $('#modo-taller').addEventListener('click', () => cambiarTaller(!taller));
  if (new URLSearchParams(location.search).has('taller')) cambiarTaller(true); else pintarTaller();
  const telCliente = () => { const n = $('#tel-cli').value.replace(/\D/g, '').replace(/^57(?=3\d{9}$)/, ''); return /^3\d{9}$/.test(n) ? n : ''; };
  $('#nom-cli').addEventListener('input', e => { S.cliente = e.target.value; $('#cliente-p').value = e.target.value; });
  $('#hoja-p').addEventListener('click', async () => { aviso('Preparando la hoja…'); const c = await canvasHoja($('#nom-cli').value.trim()); descargar(await blobDe(c), `Diseno-${codigo}.png`); aviso('Hoja del cliente descargada.'); });
  $('#aprob-p').addEventListener('click', async () => {
    const nombre = $('#nom-cli').value.trim(), tel = telCliente();
    if (!nombre) { aviso('Escribe el nombre del cliente.'); $('#nom-cli').focus(); return; }
    if (!tel) { aviso('Escribe el WhatsApp del cliente: 10 dígitos, empieza por 3.'); $('#tel-cli').focus(); return; }
    const f = ficha(), w = window.open('', '_blank'), hoja = await canvasHoja(nombre), enlace = await enlaceAprob(f, nombre);
    guardarFicha(f); const im = hoja.toDataURL('image/webp', .72); const fotos = leerLS('transfer-aprob-img', {}); fotos[f.codigo] = im; const ll = Object.keys(fotos); if (ll.length > 3) delete fotos[ll[0]]; guardarLS('transfer-aprob-img', fotos);
    const l = leerLS('transfer-aprobaciones', []).filter(a => a.codigo !== f.codigo); l.unshift({codigo: f.codigo, cliente: nombre, tel, producto: f.producto, fecha: Date.now(), estado: 'Enviado'}); guardarLS('transfer-aprobaciones', l.slice(0, 30)); listaAprob();
    descargar(await blobDe(hoja), `Diseno-${f.codigo}.png`);
    const txt = `Hola ${nombre.split(' ')[0]}, te escribimos de Tránsfer!. Este es tu diseño *${f.codigo}* (${f.producto}, color ${f.color}, ${f.cantidades}).\n\nRevísalo y apruébalo aquí:\n${enlace}\n\nSi quieres un cambio, nos lo pides en el mismo enlace o por este chat. Empezamos a producir cuando lo apruebes.`;
    const url = 'https://wa.me/57' + tel + '?text=' + encodeURIComponent(txt);
    if (w) w.location.href = url; else window.open(url, '_blank', 'noopener');
    aviso('Se abrió el chat del cliente y se descargó la hoja: adjúntala ahí.');
  });
  function listaAprob() {
    const l = leerLS('transfer-aprobaciones', []);
    $('#lista-aprob').innerHTML = l.length ? l.map((a, i) => `<div class="ap"><div><b>${a.codigo}</b><small>${esc(a.cliente)} · ${esc(a.producto || '')} · ${new Date(a.cuando || a.fecha).toLocaleString('es-CO', {dateStyle: 'short', timeStyle: 'short'})}</small></div><select data-ap="${i}" aria-label="Estado de ${a.codigo}">${['Enviado', 'Aprobado', 'Pidió cambio'].map(e => `<option ${e === a.estado ? 'selected' : ''}>${e}</option>`).join('')}</select><button type="button" data-ap-x="${i}" aria-label="Quitar ${a.codigo}">×</button></div>`).join('') : '<p class="vacio-el">Todavía no has enviado diseños para aprobación.</p>';
  }
  $('#lista-aprob').addEventListener('change', e => { const l = leerLS('transfer-aprobaciones', []), a = l[+e.target.dataset.ap]; if (!a) return; a.estado = e.target.value; a.cuando = Date.now(); guardarLS('transfer-aprobaciones', l); listaAprob(); });
  $('#lista-aprob').addEventListener('click', e => { const b = e.target.closest('[data-ap-x]'); if (!b) return; const l = leerLS('transfer-aprobaciones', []); l.splice(+b.dataset.apX, 1); guardarLS('transfer-aprobaciones', l); listaAprob(); });
  function guardarFicha(f) { const todas = leerLS('transfer-fichas', {}); todas[f.codigo] = textoWA(f); const llaves = Object.keys(todas); if (llaves.length > 20) delete todas[llaves[0]]; guardarLS('transfer-fichas', todas); }

  /* Mis diseños y enlace para compartir */
  $('#guardar-p').addEventListener('click', async () => {
    const f = ficha(), m = PRENDAS[S.prod].vistas.vuelta ? await renderCilindro(PRENDAS[S.prod].vistas.vuelta.cil.lados.findIndex(L => L.vt === 'frente'), 180) : await renderMockup('frente', 180), lista = leerLS('transfer-disenos', []);
    const usadas = {}; Object.values(S.capas).flat().forEach(e => { if (e.img && !e.img.startsWith('st:') && IMGS[e.img]) usadas[e.img] = {src: IMGS[e.img].src, w: IMGS[e.img].w, h: IMGS[e.img].h, nombre: IMGS[e.img].nombre}; });
    const d = {codigo: f.codigo, fecha: Date.now(), prod: S.prod, tipo: S.tipo, color: S.color, otro: S.otro, capas: S.capas, modo: S.modo, tallas: S.tallas, cant: S.cant, nombres: S.nombres, thumb: m.toDataURL('image/webp', .7), imgs: usadas};
    const nueva = [d, ...lista.filter(x => x.codigo !== f.codigo)].slice(0, 12);
    if (guardarLS('transfer-disenos', nueva)) aviso('Diseño guardado en este navegador. Lo encuentras en «Mis diseños».');
    else { d.imgs = {}; guardarLS('transfer-disenos', [d, ...lista.filter(x => x.codigo !== f.codigo)].slice(0, 12)) ? aviso('Guardado, pero sin tus imágenes: son muy pesadas para el navegador.') : aviso('No se pudo guardar: el navegador no tiene espacio.'); }
  });
  $('#enlace-p').addEventListener('click', async () => {
    const capas = JSON.parse(JSON.stringify(S.capas)); let quitadas = 0;
    Object.keys(capas).forEach(k => { capas[k] = capas[k].filter(e => { const ok = !e.img || e.img.startsWith('st:'); if (!ok) quitadas++; return ok; }); });
    const datos = btoa(unescape(encodeURIComponent(JSON.stringify({prod: S.prod, tipo: S.tipo, color: S.color, otro: S.otro, capas})))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    const url = location.origin + location.pathname + '#d=' + datos;
    try { await navigator.clipboard.writeText(url); aviso('Enlace copiado.' + (quitadas ? ' Las imágenes que subiste no viajan en el enlace.' : '')); } catch (e) { prompt('Copia este enlace:', url); }
  });
  const dlg = $('#dlg-disenos');
  $('#mis-dis').addEventListener('click', () => {
    const lista = leerLS('transfer-disenos', []);
    $('#lista-dis').innerHTML = lista.length ? lista.map((d, i) => `<div class="dis"><img src="${d.thumb}" alt=""><div><b>${PRENDAS[d.prod]?.nombre || ''} · ${d.codigo}</b><small>${new Date(d.fecha).toLocaleDateString('es-CO')}</small></div><button type="button" class="btn-mini" data-abrir="${i}">Abrir</button><button type="button" class="quitar-d" data-quitar-d="${i}" aria-label="Borrar">×</button></div>`).join('') : '<p class="vacio-el">Todavía no tienes diseños guardados. Usa «Guardar diseño» en el paso 4.</p>';
    if (!dlg.open) dlg.showModal();
  });
  dlg.addEventListener('click', e => {
    if (e.target === dlg || e.target.closest('[data-cerrar-dlg]')) dlg.close();
    const lista = leerLS('transfer-disenos', []);
    const a = e.target.closest('[data-abrir]'); if (a) { const d = lista[+a.dataset.abrir]; cargarDiseno(d); dlg.close(); aviso('Diseño ' + d.codigo + ' abierto.'); }
    const q = e.target.closest('[data-quitar-d]'); if (q) { lista.splice(+q.dataset.quitarD, 1); guardarLS('transfer-disenos', lista); $('#mis-dis').click(); }
  });
  function cargarDiseno(d) {
    Object.entries(d.imgs || {}).forEach(([id, i]) => { IMGS[id] = i; });
    Object.assign(S, {prod: d.prod, tipo: d.tipo, color: d.color, otro: d.otro ?? null, capas: d.capas || {}, modo: d.modo || 'tallas', tallas: d.tallas || {M: 1}, cant: d.cant || 1, nombres: d.nombres?.length ? d.nombres : [{nombre: '', talla: 'M'}], vista: 'frente', sel: null});
    Object.values(S.capas).flat().forEach(e => { if (e.img && !IMGS[e.img]) e.img = 'st:estrella'; });
    tipoBueno(); prepararCapas(); todo(); guardarHist(); codigo = d.codigo || null;
  }

  /* ═════════ Pasos ═════════ */
  function irPaso(n, suave) {
    $$('#pasos-p button').forEach(b => b.classList.toggle('on', +b.dataset.paso === n));
    $$('.hoja-p').forEach(h => h.classList.toggle('on', +h.dataset.paso === n));
    if (n === 3) panelTallas(); if (n === 4) resumen();
    if (!suave && matchMedia('(max-width:1080px)').matches) $('#pasos-p').scrollIntoView({behavior: 'smooth', block: 'start'});
  }
  $('#pasos-p').addEventListener('click', e => { const b = e.target.closest('button'); if (b) irPaso(+b.dataset.paso); });
  document.addEventListener('click', e => { const s = e.target.closest('[data-ir]'); if (s) irPaso(+s.dataset.ir); });
  $('#deshacer').addEventListener('click', deshacer); $('#rehacer').addEventListener('click', rehacer);
  $('#guias-btn').addEventListener('click', e => { S.guias = !S.guias; e.currentTarget.setAttribute('aria-pressed', S.guias); $('#area')?.classList.toggle('guias', S.guias); });

  function aviso(t) { const a = $('#aviso-p'); a.textContent = t; a.classList.add('ver'); clearTimeout(a._t); a._t = setTimeout(() => a.classList.remove('ver'), 3800); }
  function todo() { renderEscena(); panelProducto(); vistasBar(); panelEl(); panelTallas(); }

  /* ═════════ Arranque ═════════ */
  const q = new URLSearchParams(location.search), hash = location.hash.match(/#d=([\w-]+)/);
  const borrador = leerLS('transfer-editor', null);
  if (hash) { try { const o = JSON.parse(decodeURIComponent(escape(atob(hash[1].replace(/-/g, '+').replace(/_/g, '/'))))); Object.assign(S, {prod: o.prod, tipo: o.tipo, color: o.color, otro: o.otro ?? null, capas: o.capas}); } catch (e) {} }
  else if (q.get('producto') && PRENDAS[q.get('producto')]) { S.prod = q.get('producto'); S.tipo = q.get('tipo'); S.tipo = tipo().id; S.color = colores()[0][1]; if (S.prod === 'buzo') S.color = '#1D3C78'; const cq = (q.get('color') || '').toUpperCase(); if (colores().some(c => c[1].toUpperCase() === cq)) S.color = colores().find(c => c[1].toUpperCase() === cq)[1]; S.capas = {frente: [nuevoTexto({defecto: !q.get('texto'), texto: q.get('texto') || 'TU NOMBRE', color: claro(fondoDe(S.prod, S.color, S.tipo)) ? '#053468' : '#FECF03', y: .35})]}; }
  else if (q.get('texto')) { S.capas = {frente: [nuevoTexto({texto: q.get('texto').slice(0, 30), y: .35})]}; }
  else if (borrador && Object.values(borrador.capas || {}).flat().length) { Object.entries(borrador.imgs || {}).forEach(([id, i]) => { IMGS[id] = i; }); Object.assign(S, borrador); Object.values(S.capas).flat().forEach(e => { if (e.img && !IMGS[e.img]) e.img = 'st:estrella'; }); S.sel = null; }
  else S.capas = {frente: [nuevoTexto({y: .35, defecto: true})]};
  if (!PRENDAS[S.prod]) S.prod = 'buzo';
  if (S.otro === null && S.tallas) Object.keys(S.tallas).forEach(k => { if (PRENDAS[S.prod].tallas && !PRENDAS[S.prod].tallas.includes(k)) delete S.tallas[k]; });   // borradores viejos con tallas que no se manejan
  tipoBueno(); prepararCapas(); todo(); guardarHist();
  // repinta los textos cuando terminen de cargar las letras
  Promise.all(['900 40px Rubik', '500 40px Rubik', '300 40px Rubik', '400 40px Anton'].map(f => document.fonts.load(f))).catch(() => {}).finally(() => { renderCapas(); });
  window.PERSONALIZADOR = {S, ficha, textoWA, canvasFicha, canvasHoja, enlaceAprob, disenoSolo, renderMockup, arteExtendido, medidaDiseno, enTalla};
})();
