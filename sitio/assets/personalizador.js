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

  /* ═════════ Prendas dibujadas a mano ═════════ */
  const oscuro = (hex, f = .8) => { const n = parseInt(hex.slice(1), 16); const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(v => Math.round(v * f)); return '#' + c.map(v => v.toString(16).padStart(2, '0')).join(''); };
  const linea = 'stroke="rgba(0,0,0,.28)" stroke-width="2.5" stroke-linejoin="round"';
  const sombra = (u, w, h, clips, pliegues, extra = '') => `<defs><clipPath id="c${u}">${clips.map(d => `<path d="${d}"/>`).join('')}</clipPath>
    <linearGradient id="g${u}" x1="0" x2="1"><stop offset="0" stop-opacity=".2"/><stop offset=".2" stop-opacity="0"/><stop offset=".8" stop-opacity="0"/><stop offset="1" stop-opacity=".2"/></linearGradient>
    <linearGradient id="v${u}" y1="0" y2="1" x1="0" x2="0"><stop offset="0" stop-opacity=".06"/><stop offset=".5" stop-opacity="0"/><stop offset="1" stop-opacity=".14"/></linearGradient>
    <filter id="f${u}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="9"/></filter></defs>
    <g clip-path="url(#c${u})"><rect width="${w}" height="${h}" fill="url(#g${u})"/><rect width="${w}" height="${h}" fill="url(#v${u})"/>
    <g filter="url(#f${u})" fill="none" stroke="#000" stroke-linecap="round" opacity=".12">${pliegues}</g>${extra}</g>`;
  const brilloCil = (u, x, y, w, h) => `<defs><linearGradient id="b${u}" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".22" stop-color="#fff" stop-opacity=".55"/><stop offset=".3" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#b${u})"/>`;
  const cilindro = (u, x, y, w, h) => `<defs><linearGradient id="k${u}" x1="0" x2="1"><stop offset="0" stop-opacity=".34"/><stop offset=".28" stop-opacity="0"/><stop offset=".62" stop-opacity=".04"/><stop offset="1" stop-opacity=".38"/></linearGradient></defs><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#k${u})"/>`;

  const CAMI_F = 'M222 52 C250 104 350 104 378 52 L470 84 L562 190 L497 236 L470 208 L472 612 Q300 628 128 612 L130 208 L103 236 L38 190 L130 84 Z';
  const CAMI_E = 'M222 52 C262 70 338 70 378 52 L470 84 L562 190 L497 236 L470 208 L472 612 Q300 628 128 612 L130 208 L103 236 L38 190 L130 84 Z';
  const BUZO = 'M200 80 L122 104 C84 150 64 262 54 400 L44 556 L100 562 L112 404 C120 334 130 288 142 256 L144 580 L456 580 L458 256 C470 288 480 334 488 404 L500 562 L556 556 L546 400 C536 262 516 150 478 104 L400 80 C372 122 228 122 200 80 Z';
  const PUNO_I = 'M44 556 L100 562 L98 608 L46 604 Z', PUNO_D = 'M556 556 L500 562 L502 608 L554 604 Z', PRETINA = 'M144 580 L456 580 L452 634 Q300 642 148 634 Z';
  const costuras = '<path d="M130 84 L130 208 M470 84 L470 208" fill="none" stroke="rgba(0,0,0,.14)" stroke-width="2"/><path d="M132 598 Q300 612 468 598 M45 186 L102 228 M555 186 L498 228" fill="none" stroke="rgba(0,0,0,.18)" stroke-width="2" stroke-dasharray="6 5"/>';
  const PLIEG_CAMI = '<path d="M190 300 C230 380 220 480 200 600" stroke-width="16"/><path d="M412 280 C380 380 396 470 412 600" stroke-width="16"/><path d="M300 150 C292 220 312 270 300 330" stroke-width="9"/><path d="M140 214 C170 240 196 250 230 252" stroke-width="12"/><path d="M460 214 C430 240 404 250 370 252" stroke-width="12"/>';
  const PLIEG_BUZO = '<path d="M200 300 C236 380 226 470 208 570" stroke-width="16"/><path d="M402 300 C370 380 384 470 400 570" stroke-width="16"/><path d="M80 300 C92 380 86 460 74 540" stroke-width="12"/><path d="M520 300 C508 380 514 460 526 540" stroke-width="12"/><path d="M150 260 C176 290 200 300 232 300" stroke-width="10"/><path d="M450 260 C424 290 400 300 368 300" stroke-width="10"/>';

  const COL_ROPA = [['Blanco', '#FFFFFF'], ['Negro', '#1E1F24'], ['Gris jaspe', '#B8BCC4'], ['Azul marino', '#1C2A4C'], ['Azul cielo', '#58C3E8'], ['Rojo vino', '#7C1D3B'], ['Amarillo', '#F4C430']];
  const COL_GORRA = [['Blanco', '#FFFFFF'], ['Negro', '#1E1F24'], ['Azul marino', '#1C2A4C'], ['Rojo vino', '#7C1D3B'], ['Gris jaspe', '#B8BCC4']];
  const COL_BLANCO = [['Blanco', '#FFFFFF']];
  const TALLAS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const PRENDAS = {
    camiseta: {nombre: 'Camiseta', art: 'una camiseta', tecnica: 'DTF', colores: COL_ROPA, tallas: TALLAS, vistas: {
      frente: {nombre: 'Frente', vb: [600, 660], area: [200, 135, 200, 250], cm: 28, cuello: 92,
        base: (c, d) => `<path d="M222 52 C262 38 338 38 378 52 C350 92 250 92 222 52 Z" fill="${d}"/><path d="${CAMI_F}" fill="${c}" ${linea}/><path d="M224 54 C252 102 348 102 376 54" fill="none" stroke="${d}" stroke-width="12" stroke-linecap="round"/>`,
        sombra: u => sombra(u, 600, 660, [CAMI_F], PLIEG_CAMI, costuras)},
      espalda: {nombre: 'Espalda', vb: [600, 660], area: [195, 125, 210, 266], cm: 30, cuello: 62,
        base: (c, d) => `<path d="${CAMI_E}" fill="${c}" ${linea}/><path d="M224 54 C262 70 338 70 376 54" fill="none" stroke="${d}" stroke-width="10" stroke-linecap="round"/>`,
        sombra: u => sombra(u, 600, 660, [CAMI_E], PLIEG_CAMI, costuras)}}},
    buzo: {nombre: 'Buzo con capota', corto: 'Buzo', art: 'un buzo', tecnica: 'DTF', colores: COL_ROPA, tallas: TALLAS, vistas: {
      frente: {nombre: 'Frente', vb: [600, 660], area: [205, 150, 190, 230], cm: 28, cuello: 112,
        base: (c, d) => `<path d="M196 98 C186 18 414 18 404 98 Z" fill="${d}" ${linea}/><path d="${BUZO}" fill="${c}" ${linea}/><path d="${PUNO_I}" fill="${c}" ${linea}/><path d="${PUNO_D}" fill="${c}" ${linea}/><path d="${PRETINA}" fill="${c}" ${linea}/>
          <path d="M200 80 C228 126 372 126 400 80 C380 62 220 62 200 80 Z" fill="${d}"/><path d="M202 82 C230 126 370 126 398 82" fill="none" stroke="${c}" stroke-width="15" stroke-linecap="round"/>
          <path d="M196 410 L404 410 L432 528 L168 528 Z" fill="${c}" ${linea}/><path d="M196 410 C190 450 176 490 168 528 M404 410 C410 450 424 490 432 528" fill="none" stroke="rgba(0,0,0,.3)" stroke-width="4"/>
          <path d="M270 114 L262 236 M330 114 L338 236" stroke="${d}" stroke-width="6" stroke-linecap="round"/><rect x="255" y="232" width="13" height="20" rx="3" fill="${d}"/><rect x="332" y="232" width="13" height="20" rx="3" fill="${d}"/>`,
        sombra: u => sombra(u, 600, 660, [BUZO, PUNO_I, PUNO_D, PRETINA], PLIEG_BUZO, '<path d="M146 592 L454 592 M52 570 L98 574 M548 570 L502 574" stroke="rgba(0,0,0,.2)" stroke-width="3" stroke-dasharray="3 6"/>')},
      espalda: {nombre: 'Espalda', vb: [600, 660], area: [180, 262, 240, 280], cm: 32, cuello: 84,
        base: (c, d) => `<path d="${BUZO}" fill="${c}" ${linea}/><path d="${PUNO_I}" fill="${c}" ${linea}/><path d="${PUNO_D}" fill="${c}" ${linea}/><path d="${PRETINA}" fill="${c}" ${linea}/>
          <path d="M206 84 C230 64 370 64 394 84 L386 222 C352 256 248 256 214 222 Z" fill="${c}" ${linea}/><path d="M300 70 L300 246" stroke="rgba(0,0,0,.18)" stroke-width="2.5"/>`,
        sombra: u => sombra(u, 600, 660, [BUZO, PUNO_I, PUNO_D, PRETINA], PLIEG_BUZO, '<path d="M214 222 C252 262 348 262 386 222" fill="none" stroke="#000" stroke-opacity=".22" stroke-width="12" filter="url(#f' + u + ')"/>')}}},
    gorra: {nombre: 'Gorra', art: 'una gorra', tecnica: 'DTF', colores: COL_GORRA, tallas: null, vistas: {
      frente: {nombre: 'Frente', vb: [600, 520], area: [220, 182, 160, 96], cm: 10,
        base: (c, d) => `<path d="M120 330 C118 160 206 92 300 92 C394 92 482 160 480 330 Z" fill="${c}" ${linea}/>
          <path d="M300 94 L300 330 M300 94 C230 120 196 220 196 330 M300 94 C370 120 404 220 404 330" fill="none" stroke="rgba(0,0,0,.18)" stroke-width="3"/>
          <circle cx="226" cy="178" r="6" fill="${d}"/><circle cx="374" cy="178" r="6" fill="${d}"/><circle cx="300" cy="94" r="12" fill="${c}" ${linea}/>
          <path d="M84 334 C150 300 450 300 516 334 C528 368 506 404 470 410 C400 392 200 392 130 410 C94 404 72 368 84 334 Z" fill="${c}" ${linea}/><path d="M130 410 C200 392 400 392 470 410 C420 432 180 432 130 410 Z" fill="${d}"/>`,
        sombra: u => sombra(u, 600, 520, ['M120 330 C118 160 206 92 300 92 C394 92 482 160 480 330 Z', 'M84 334 C150 300 450 300 516 334 C528 368 506 404 470 410 C400 392 200 392 130 410 C94 404 72 368 84 334 Z'],
          '<path d="M180 300 C176 240 200 180 240 140" stroke-width="18"/><path d="M420 300 C424 240 400 180 360 140" stroke-width="18"/>', '<path d="M90 340 C160 318 440 318 510 340" fill="none" stroke="rgba(0,0,0,.2)" stroke-width="3" stroke-dasharray="6 6"/>')}}},
    mug: {nombre: 'Mug', art: 'un mug', tecnica: 'Sublimación', colores: COL_BLANCO, tallas: null, vistas: {
      frente: {nombre: 'Frente', vb: [600, 560], area: [175, 205, 220, 208], cm: 9,
        base: (c, d) => `<path d="M410 190 C530 186 540 410 410 410 L410 370 C490 372 488 228 410 230 Z" fill="${c}" ${linea}/><path d="M150 120 L420 120 L420 500 C420 524 150 524 150 500 Z" fill="${c}" ${linea}/><ellipse cx="285" cy="120" rx="135" ry="20" fill="${c}" ${linea}/><ellipse cx="285" cy="122" rx="122" ry="13" fill="${d}"/>`,
        sombra: u => `<defs><clipPath id="c${u}"><path d="M150 120 L420 120 L420 500 C420 524 150 524 150 500 Z"/></clipPath></defs><g clip-path="url(#c${u})">${cilindro(u, 150, 100, 270, 430)}</g><path d="M410 190 C530 186 540 410 410 410 L410 370 C490 372 488 228 410 230 Z" fill="#000" opacity=".12"/>`,
        brillo: u => `<g clip-path="url(#c${u})">${brilloCil(u, 150, 100, 270, 430)}</g>`},
      reverso: {nombre: 'Reverso', espejo: true, vb: [600, 560], area: [175, 205, 220, 208], cm: 9}}},
    termo: {nombre: 'Termo', art: 'un termo', tecnica: 'Sublimación', colores: COL_BLANCO, tallas: null, vistas: {
      frente: {nombre: 'Frente', vb: [600, 660], area: [238, 232, 124, 284], cm: 7,
        base: (c, d) => `<rect x="232" y="56" width="136" height="70" rx="14" fill="${c}" ${linea}/><rect x="244" y="122" width="112" height="22" fill="${d}"/><path d="M222 150 Q222 140 232 140 L368 140 Q378 140 378 150 L378 610 Q378 628 360 628 L240 628 Q222 628 222 610 Z" fill="${c}" ${linea}/>`,
        sombra: u => `<defs><clipPath id="c${u}"><path d="M222 150 Q222 140 232 140 L368 140 Q378 140 378 150 L378 610 Q378 628 360 628 L240 628 Q222 628 222 610 Z"/><rect x="232" y="56" width="136" height="70" rx="14"/></clipPath></defs><g clip-path="url(#c${u})">${cilindro(u, 222, 50, 156, 590)}</g>`,
        brillo: u => `<defs><clipPath id="c${u}"><path d="M222 150 Q222 140 232 140 L368 140 Q378 140 378 150 L378 610 Q378 628 360 628 L240 628 Q222 628 222 610 Z"/></clipPath></defs><g clip-path="url(#c${u})">${brilloCil(u, 222, 140, 156, 490)}</g>`},
      reverso: {nombre: 'Reverso', espejo: true, vb: [600, 660], area: [238, 232, 124, 284], cm: 7}}},
  };
  // el reverso del mug y del termo es el frente en espejo
  ['mug', 'termo'].forEach(p => { const f = PRENDAS[p].vistas.frente, r = PRENDAS[p].vistas.reverso; Object.assign(r, {base: f.base, sombra: f.sombra, brillo: f.brillo}); });
  const vistaDe = (p, v) => PRENDAS[p].vistas[v];
  const areaDe = v => { const [x, y, w, h] = v.area; return v.espejo ? [v.vb[0] - x - w, y, w, h] : [x, y, w, h]; };
  let uid = 0;
  function svgDe(p, vista, capa, color) {
    const v = vistaDe(p, vista), [w, h] = v.vb, u = 'p' + (++uid);
    let dentro = capa === 'base' ? v.base(color, oscuro(color, color.toUpperCase() === '#FFFFFF' ? .9 : .78)) : capa === 'sombra' ? v.sombra(u) : (v.brillo ? (capa === 'brillo' ? (v.sombra(u).match(/<defs>[\s\S]*?<\/defs>/) || [''])[0] + v.brillo(u) : '') : '');
    if (v.espejo) dentro = `<g transform="translate(${w} 0) scale(-1 1)">${dentro}</g>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${dentro}</svg>`;
  }
  const imgDeSvg = svg => new Promise(ok => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(null); i.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg); });

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
  const S = {prod: 'buzo', color: '#1C2A4C', vista: 'frente', capas: {}, sel: null, guias: true, modo: 'tallas', tallas: {M: 1}, cant: 1, nombres: [{nombre: '', talla: 'M'}], notas: '', cliente: '', ciudad: ''};
  let hist = [], hi = -1, codigo = null;
  const capasVista = (v = S.vista) => (S.capas[v] ||= []);
  const nuevoId = () => 'e' + Math.random().toString(36).slice(2, 8);
  const elSel = () => capasVista().find(e => e.id === S.sel);

  function nuevoTexto(extra = {}) { return Object.assign({id: nuevoId(), tipo: 'texto', x: .5, y: .3, w: .7, rot: 0, texto: 'TU NOMBRE', fuente: 'pop', color: '#FECF03', contorno: false, colorBorde: T, grosor: 3, curva: 0, variable: false}, extra); }
  function instantanea() { return JSON.stringify({prod: S.prod, color: S.color, capas: S.capas}); }
  function guardarHist() { const s = instantanea(); if (hist[hi] === s) return; hist = hist.slice(0, hi + 1); hist.push(s); if (hist.length > 80) hist.shift(); hi = hist.length - 1; codigo = null; botonesHist(); guardarBorrador(); }
  function restaurar(s) { const o = JSON.parse(s); S.prod = o.prod; S.color = o.color; S.capas = o.capas; S.sel = null; if (!vistaDe(S.prod, S.vista)) S.vista = 'frente'; todo(); }
  const deshacer = () => { if (hi > 0) { hi--; restaurar(hist[hi]); botonesHist(); guardarBorrador(); } };
  const rehacer = () => { if (hi < hist.length - 1) { hi++; restaurar(hist[hi]); botonesHist(); guardarBorrador(); } };
  function botonesHist() { $('#deshacer').disabled = hi <= 0; $('#rehacer').disabled = hi >= hist.length - 1; }
  function guardarBorrador() {
    const usadas = new Set(Object.values(S.capas).flat().filter(e => e.img && !e.img.startsWith('st:')).map(e => e.img));
    const imgs = {}; usadas.forEach(id => { if (IMGS[id]) imgs[id] = {src: IMGS[id].src, w: IMGS[id].w, h: IMGS[id].h, nombre: IMGS[id].nombre}; });
    const b = {prod: S.prod, color: S.color, vista: S.vista, capas: S.capas, modo: S.modo, tallas: S.tallas, cant: S.cant, nombres: S.nombres, notas: S.notas, imgs};
    if (!guardarLS('transfer-editor', b)) { b.imgs = {}; guardarLS('transfer-editor', b); }
  }

  /* ═════════ Escena ═════════ */
  const escena = $('#escena');
  function renderEscena() {
    const v = vistaDe(S.prod, S.vista), [w, h] = v.vb, [ax, ay, aw, ah] = areaDe(v);
    const pc = (n, t) => (n / t * 100) + '%';
    escena.style.aspectRatio = w + ' / ' + h; escena.dataset.ar = w / h; ajustarEscena();
    const n = parseInt(S.color.slice(1), 16), lum = (.299 * (n >> 16 & 255) + .587 * (n >> 8 & 255) + .114 * (n & 255)) / 255;
    escena.classList.toggle('oscura', lum < .45);
    escena.innerHTML = `<div class="capa-p base">${svgDe(S.prod, S.vista, 'base', S.color)}</div>
      <div class="area${S.guias ? ' guias' : ''}" id="area" style="left:${pc(ax, w)};top:${pc(ay, h)};width:${pc(aw, w)};height:${pc(ah, h)}"><span class="area-et"><span class="largo">Área de impresión · </span>${cm(v.cm)} × ${cm(v.cm * ah / aw)} cm</span></div>
      <div class="capa-p sombra">${svgDe(S.prod, S.vista, 'sombra', S.color)}</div>
      ${v.brillo ? `<div class="capa-p brillo">${svgDe(S.prod, S.vista, 'brillo', S.color)}</div>` : ''}
      <div class="capa-ui" style="left:${pc(ax, w)};top:${pc(ay, h)};width:${pc(aw, w)};height:${pc(ah, h)}"><i class="guia-v"></i><i class="guia-h"></i>
        <div class="marco" hidden><button class="h-borrar" aria-label="Borrar" title="Borrar (Supr)">×</button><button class="h-rot" aria-label="Girar" title="Girar">⟳</button><button class="h-tam" aria-label="Cambiar tamaño" title="Tamaño">⤡</button></div></div>`;
    renderCapas();
  }
  // El escenario mantiene siempre la proporcion de la prenda: asi el area de impresion coincide con la ficha
  function ajustarEscena() {
    const col = escena.parentElement, ar = +escena.dataset.ar || 1, movil = matchMedia('(max-width:1080px)').matches;
    const W = col.clientWidth - 28, Hmax = movil ? innerHeight * .34 : innerHeight - 230;
    escena.style.width = Math.max(200, Math.min(W, Math.max(movil ? 230 : 300, Hmax) * ar)) + 'px';
  }
  addEventListener('resize', () => { ajustarEscena(); actualizarMarco(); });
  function renderCapas() {
    const area = $('#area'); if (!area) return;
    area.querySelectorAll('.el').forEach(n => n.remove());
    capasVista().forEach(el => area.appendChild(nodoEl(el)));
    actualizarMarco(); revisarLimites();
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
    const fuera = capasVista().filter(el => esquinas(el).some(([x, y]) => x < -.01 || x > 1.01 || y < -.01 || y > 1.01));
    $$('.el').forEach(d => d.classList.toggle('fuera', fuera.some(f => f.id === d.dataset.id)));
    const v = vistaDe(S.prod, S.vista), [, , aw, ah] = areaDe(v);
    $('#estado-esc').innerHTML = fuera.length ? '<b class="alerta">Una parte del diseño queda fuera del área de impresión. Muévelo o hazlo más pequeño.</b>'
      : (capasVista().length ? `Área de impresión de ${PRENDAS[S.prod].nombre.toLowerCase()} · ${vistaDe(S.prod, S.vista).nombre.toLowerCase()}: ${cm(v.cm)} × ${cm(v.cm * ah / aw)} cm. Arrastra para mover.` : 'Agrega un texto, tu logo o un sticker desde el paso 2.');
  }

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
    escena.setPointerCapture(e.pointerId); e.preventDefault();
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
      el.w = Math.min(1.6, Math.max(.05, a.w0 * Math.hypot(e.clientX - a.cx, e.clientY - a.cy) / a.d0));
    } else {
      let g = Math.atan2(e.clientY - a.cy, e.clientX - a.cx) * 180 / Math.PI + 90;
      const cerca = Math.round(g / 45) * 45; if (Math.abs(g - cerca) < 5) g = cerca;
      el.rot = Math.round(((g + 540) % 360) - 180);
    }
    const d = $(`.el[data-id="${el.id}"]`); if (d) posicionar(d, el); actualizarMarco(); revisarLimites(); medidas();
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
    $('#prods-p').innerHTML = Object.entries(PRENDAS).map(([k, p]) => `<button type="button" data-p="${k}" class="${k === S.prod ? 'on' : ''}" aria-pressed="${k === S.prod}"><span class="ico-p">${svgDe(k, 'frente', 'base', '#E6E0D2')}</span><b>${p.corto || p.nombre}</b><small>${p.tecnica}</small></button>`).join('');
    const P = PRENDAS[S.prod];
    $('#colores-p').innerHTML = P.colores.map(([n, h]) => `<button type="button" style="--c:${h}" data-c="${h}" class="${h === S.color ? 'on' : ''}" aria-label="${n}" title="${n}"></button>`).join('');
    $('#color-nombre').textContent = (P.colores.find(c => c[1] === S.color) || ['—'])[0];
    $('#info-tec').innerHTML = P.tecnica === 'DTF'
      ? `<b>Estampado DTF.</b> Funciona en tela clara u oscura y a todo color. Áreas de impresión: ${Object.values(P.vistas).map(v => `${v.nombre.toLowerCase()} hasta ${cm(v.cm)} × ${cm(v.cm * areaDe(v)[3] / areaDe(v)[2])} cm`).join(' · ')}.`
      : `<b>Sublimación.</b> El diseño queda dentro del material; por eso ${P.art} va en blanco. Área por cada lado: ${cm(P.vistas.frente.cm)} × ${cm(P.vistas.frente.cm * P.vistas.frente.area[3] / P.vistas.frente.area[2])} cm.`;
  }
  $('#prods-p').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; cambiarProducto(b.dataset.p); });
  function cambiarProducto(p) {
    if (!PRENDAS[p]) return; S.prod = p; const P = PRENDAS[p];
    if (!P.colores.some(c => c[1] === S.color)) S.color = P.colores[0][1];
    if (!P.vistas[S.vista]) S.vista = 'frente';
    S.sel = null; todo(); guardarHist();
  }
  $('#colores-p').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; S.color = b.dataset.c; renderEscena(); panelProducto(); vistasBar(); guardarHist(); });
  function vistasBar() {
    const P = PRENDAS[S.prod];
    $('#vistas').innerHTML = Object.entries(P.vistas).map(([k, v]) => `<button type="button" data-v="${k}" class="${k === S.vista ? 'on' : ''}">${v.nombre}${(S.capas[k] || []).length ? `<i>${S.capas[k].length}</i>` : ''}</button>`).join('');
  }
  $('#vistas').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; S.vista = b.dataset.v; S.sel = null; todo(); guardarBorrador(); });

  /* ═════════ Paso 2: diseño ═════════ */
  $('#add-texto').addEventListener('click', () => { agregar(nuevoTexto({texto: 'TU TEXTO', color: S.color === '#FFFFFF' || S.color === '#F4C430' || S.color === '#B8BCC4' || S.color === '#58C3E8' ? '#053468' : '#FECF03', y: capasVista().length ? .6 : .35})); setTimeout(() => $('#t-texto')?.select(), 50); });
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
      else agregar({id: nuevoId(), tipo: 'imagen', img: id, x: .5, y: .42, w: .55, rot: 0, sinFondo: false});
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
  $('#stickers-p').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; agregar({id: nuevoId(), tipo: 'imagen', img: 'st:' + b.dataset.s, x: .5, y: .45, w: .42, rot: 0}); $('#stickers-p').hidden = true; });

  const PLANTILLAS = [
    {n: 'Nombre y número', d: 'En la espalda, como camiseta de equipo', prendas: ['camiseta', 'buzo'], arma: () => { S.modo = 'nombres'; return [['espalda', nuevoTexto({texto: 'NOMBRE', variable: true, fuente: 'poster', x: .5, y: .16, w: .78})], ['espalda', nuevoTexto({texto: '10', fuente: 'poster', x: .5, y: .58, w: .5})]]; }},
    {n: 'Logo al pecho', d: 'Pequeño a la izquierda, como dotación', prendas: ['camiseta', 'buzo'], arma: () => [['frente', nuevoTexto({texto: 'TU LOGO', fuente: 'pop', x: .76, y: .14, w: .3})]], luego: 'Toca «Imagen o logo» para cambiarlo por el tuyo.'},
    {n: 'Familia de Navidad', d: 'Sticker navideño y apellido en curva', prendas: ['camiseta', 'buzo'], arma: () => [['frente', nuevoTexto({texto: 'FAMILIA PÉREZ', curva: 38, x: .5, y: .16, w: .86, color: '#B30A51', contorno: true, colorBorde: '#FFFFFF'})], ['frente', {id: nuevoId(), tipo: 'imagen', img: 'st:navidad', x: .5, y: .52, w: .46, rot: 0}], ['frente', nuevoTexto({texto: 'NAVIDAD 2026', x: .5, y: .88, w: .7, color: '#1F9D55'})]]},
    {n: 'Promoción', d: 'Curso y año al frente, nombre en la espalda', prendas: ['buzo', 'camiseta'], arma: () => { S.modo = 'nombres'; return [['frente', nuevoTexto({texto: 'PROMOCIÓN', curva: 32, x: .5, y: .2, w: .82})], ['frente', nuevoTexto({texto: '2026', fuente: 'poster', x: .5, y: .62, w: .55})], ['espalda', nuevoTexto({texto: 'NOMBRE', variable: true, fuente: 'pop', x: .5, y: .12, w: .7})]]; }},
    {n: 'Frase centrada', d: 'Una frase grande en el pecho', prendas: null, arma: () => [['frente', nuevoTexto({texto: 'TU FRASE\nAQUÍ', x: .5, y: .45, w: .8})]]},
    {n: 'Foto con nombre', d: 'Para mugs y termos de regalo', prendas: ['mug', 'termo'], arma: () => [['frente', {id: nuevoId(), tipo: 'imagen', img: 'st:estrella', x: .5, y: .4, w: .6, rot: 0}], ['frente', nuevoTexto({texto: 'NOMBRE', x: .5, y: .86, w: .8, color: '#053468'})]], luego: 'Toca la estrella y usa «Cambiar imagen» para poner tu foto.'},
  ];
  $('#add-plantilla').addEventListener('click', () => { $('#plantillas-p').hidden = !$('#plantillas-p').hidden; $('#stickers-p').hidden = true; });
  $('#plantillas-p').innerHTML = PLANTILLAS.map((p, i) => `<button type="button" data-i="${i}"><b>${p.n}</b><small>${p.d}</small></button>`).join('');
  $('#plantillas-p').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return; const p = PLANTILLAS[+b.dataset.i];
    if (capasVista('frente').length + capasVista('espalda').length && !confirm('La plantilla reemplaza tu diseño actual. ¿Seguimos?')) return;
    if (p.prendas && !p.prendas.includes(S.prod)) cambiarProducto(p.prendas[0]);
    S.capas = {}; const piezas = p.arma(); piezas.forEach(([v, el]) => { if (vistaDe(S.prod, v)) capasVista(v).push(el); });
    S.vista = piezas[0][0]; S.sel = null; $('#plantillas-p').hidden = true; todo(); guardarHist();
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
    m.innerHTML = `Medida: <b>${cm(wcm)} × ${cm(hcm)} cm</b>${q}`;
  }
  function panelEl() {
    const box = $('#editor-el'), el = elSel(); listaCapas();
    if (!el) { box.innerHTML = '<p class="vacio-el">Toca un elemento del diseño para editarlo, o agrega uno arriba.</p>'; return; }
    const comunes = `<div class="fila-r"><label>Tamaño</label><input type="range" id="t-w" min="5" max="160" value="${Math.round(el.w * 100)}"></div>
      <div class="fila-r"><label>Giro</label><input type="range" id="t-rot" min="-180" max="180" value="${el.rot}"><span>${el.rot}°</span></div>
      <p class="medida" id="medida-el"></p>
      <div class="acciones-el"><button type="button" data-a="centrar">Centrar</button><button type="button" data-a="dup">Duplicar</button><button type="button" data-a="arriba">Traer adelante</button><button type="button" data-a="abajo">Enviar atrás</button><button type="button" data-a="borrar" class="peligro">Borrar</button></div>`;
    if (el.tipo === 'texto') {
      box.innerHTML = `<label class="et" for="t-texto">Texto</label><textarea id="t-texto" rows="2" maxlength="60" ${el.variable ? 'disabled' : ''}>${esc(el.texto)}</textarea>
        <label class="check"><input type="checkbox" id="t-var" ${el.variable ? 'checked' : ''}> Cambia en cada prenda (un nombre por prenda)</label>
        <label class="et">Letra</label><div class="fuentes">${Object.entries(FUENTES).map(([k, f]) => `<button type="button" data-f="${k}" class="${k === el.fuente ? 'on' : ''}" style="font-family:${f.fam.replace(/"/g, "'")};font-weight:${f.peso}">${f.nombre}</button>`).join('')}</div>
        <label class="et">Color del texto</label><div class="tintas-p" data-para="color">${TINTAS.map(([n, h]) => `<button type="button" style="--c:${h}" data-c="${h}" class="${h.toLowerCase() === el.color.toLowerCase() ? 'on' : ''}" title="${n}" aria-label="${n}"></button>`).join('')}<input type="color" value="${el.color}" aria-label="Otro color" title="Otro color"></div>
        <label class="check"><input type="checkbox" id="t-borde" ${el.contorno ? 'checked' : ''}> Contorno</label>
        <div class="borde-op" ${el.contorno ? '' : 'hidden'}><div class="tintas-p" data-para="colorBorde">${TINTAS.map(([n, h]) => `<button type="button" style="--c:${h}" data-c="${h}" class="${h.toLowerCase() === el.colorBorde.toLowerCase() ? 'on' : ''}" title="${n}" aria-label="${n}"></button>`).join('')}</div><div class="fila-r"><label>Grosor</label><input type="range" id="t-grosor" min="1" max="8" value="${el.grosor}"></div></div>
        <div class="fila-r"><label>Curva</label><input type="range" id="t-curva" min="-100" max="100" value="${el.curva}"><span>${el.curva}</span></div>` + comunes;
    } else {
      const i = IMGS[el.img] || {}, propia = !i.sticker;
      box.innerHTML = `<p class="archivo-el">${propia ? '<b>Tu imagen:</b> ' + esc(i.nombre || '') + (i.w ? ` · ${i.w} × ${i.h} px` : '') : '<b>Sticker</b>'}</p>
        <div class="acciones-el"><button type="button" data-a="cambiar">Cambiar imagen</button>${propia && !i.svg ? `<label class="check"><input type="checkbox" id="t-fondo" ${el.sinFondo ? 'checked' : ''}> Quitar fondo blanco</label>` : ''}</div>` + comunes;
    }
    medidas();
  }
  const box = $('#editor-el');
  box.addEventListener('input', e => {
    const el = elSel(); if (!el) return; const t = e.target;
    if (t.id === 't-texto') el.texto = t.value;
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
      (S.modo === 'tallas' ? `<div class="tallas-g">${P.tallas.map(t => `<div><b>${t}</b><div class="paso-n" data-k="${t}"><button type="button" data-d="-1" aria-label="Menos ${t}">−</button><input type="number" min="0" value="${S.tallas[t] || 0}" aria-label="Cantidad ${t}"><button type="button" data-d="1" aria-label="Más ${t}">+</button></div></div>`).join('')}</div>`
      : `<p class="ayuda-p">Cada prenda sale con su nombre. ${Object.values(S.capas).flat().some(e => e.variable) ? '' : '<b>Ojo:</b> marca un texto como «Cambia en cada prenda» en el paso 2, o usa la plantilla «Nombre y número».'}</p>
        <div class="nombres-t">${S.nombres.map((n, i) => `<div class="fila-n"><span>${i + 1}</span><input value="${esc(n.nombre)}" data-i="${i}" placeholder="Nombre" maxlength="24" aria-label="Nombre ${i + 1}"><select data-i="${i}" aria-label="Talla ${i + 1}">${P.tallas.map(t => `<option ${t === n.talla ? 'selected' : ''}>${t}</option>`).join('')}</select><button type="button" data-borrar="${i}" aria-label="Quitar">×</button></div>`).join('')}</div>
        <div class="acciones-el"><button type="button" id="mas-nombre">+ Agregar persona</button><button type="button" id="pegar-lista">Pegar una lista</button></div>
        <textarea id="lista-n" hidden rows="5" placeholder="Un nombre por línea. Opcional: la talla después de una coma.&#10;Ana, M&#10;Juan, L"></textarea>`);
    $('#total-u').textContent = totalUnidades() + (totalUnidades() === 1 ? ' unidad' : ' unidades');
  }
  const tc = $('#tallas-c');
  tc.addEventListener('click', e => {
    const m = e.target.closest('[data-m]'); if (m) { S.modo = m.dataset.m; panelTallas(); guardarBorrador(); return; }
    const d = e.target.closest('[data-d]'); if (d) { const k = d.closest('.paso-n').dataset.k, inp = d.parentNode.querySelector('input'); const v = Math.max(k === 'cant' ? 1 : 0, (+inp.value || 0) + +d.dataset.d); inp.value = v; if (k === 'cant') S.cant = v; else S.tallas[k] = v; panelTallas(); guardarBorrador(); return; }
    const b = e.target.closest('[data-borrar]'); if (b) { S.nombres.splice(+b.dataset.borrar, 1); if (!S.nombres.length) S.nombres.push({nombre: '', talla: 'M'}); panelTallas(); renderCapas(); guardarBorrador(); return; }
    if (e.target.id === 'mas-nombre') { S.nombres.push({nombre: '', talla: S.nombres.at(-1)?.talla || 'M'}); panelTallas(); $$('.fila-n input').at(-1).focus(); }
    if (e.target.id === 'pegar-lista') { const t = $('#lista-n'); t.hidden = !t.hidden; t.focus(); }
  });
  tc.addEventListener('input', e => {
    const t = e.target;
    if (t.matches('.paso-n input')) { const k = t.parentNode.dataset.k, v = Math.max(0, +t.value || 0); if (k === 'cant') S.cant = Math.max(1, v); else S.tallas[k] = v; $('#total-u').textContent = totalUnidades() + ' unidades'; guardarBorrador(); }
    if (t.matches('.fila-n input')) { S.nombres[+t.dataset.i].nombre = t.value; $('#total-u').textContent = totalUnidades() + ' unidades'; clearTimeout(tc._t); tc._t = setTimeout(() => { renderCapas(); guardarBorrador(); }, 250); }
  });
  tc.addEventListener('change', e => {
    const t = e.target;
    if (t.matches('.fila-n select')) { S.nombres[+t.dataset.i].talla = t.value; guardarBorrador(); }
    if (t.id === 'lista-n') { const P = PRENDAS[S.prod]; const filas = t.value.split('\n').map(l => l.trim()).filter(Boolean).map(l => { const [n, ta] = l.split(/[,;\t]/).map(s => s.trim()); return {nombre: n, talla: P.tallas.includes((ta || '').toUpperCase()) ? ta.toUpperCase() : 'M'}; });
      if (filas.length) { S.nombres = S.nombres.filter(n => n.nombre.trim()).concat(filas); panelTallas(); renderCapas(); guardarBorrador(); aviso(filas.length + ' nombres agregados.'); } }
  });

  /* ═════════ Paso 4: ficha, WhatsApp, pedido ═════════ */
  const nuevoCodigo = () => 'TR-' + Date.now().toString(36).toUpperCase().slice(-5) + Math.random().toString(36).slice(2, 4).toUpperCase();
  function ficha() {
    codigo ||= nuevoCodigo();
    const P = PRENDAS[S.prod], color = (P.colores.find(c => c[1] === S.color) || ['', S.color])[0];
    const vistas = Object.entries(P.vistas).filter(([k]) => (S.capas[k] || []).length);
    const lineasVista = vistas.map(([k, v]) => {
      const [ax, ay, aw, ah] = areaDe(v), ucm = aw / v.cm;
      return {vista: v.nombre, items: S.capas[k].slice().reverse().map(el => {
        const ar = el.tipo === 'texto' ? (c => c.height / c.width)(canvasTexto(el)) : (IMGS[el.img]?.w ? IMGS[el.img].h / IMGS[el.img].w : (el._ar || 1));
        const wcm = el.w * v.cm, hcm = wcm * ar, dx = (el.x - .5) * v.cm, top = (el.y * ah - hcm * ucm / 2) / ucm;
        const pos = (Math.abs(dx) < .4 ? 'centrado' : `${cm(Math.abs(dx))} cm a la ${dx < 0 ? 'izquierda' : 'derecha'} del centro`) + (v.cuello ? `, a ${cm(top + (ay - v.cuello) / ucm)} cm del cuello` : `, a ${cm(top)} cm del borde superior del área`) + (el.rot ? `, girado ${el.rot}°` : '');
        if (el.tipo === 'texto') { const f = FUENTES[el.fuente]; return `${el.variable ? `Nombre de cada persona (misma altura de letra; el ancho es el del nombre más largo, «${nombreMasLargo(el)}»)` : `Texto «${el.texto.replace(/\n/g, ' / ')}»`} · letra ${f.nombre} · color ${nombreTinta(el.color)} (${el.color.toUpperCase()})${el.contorno ? ` · contorno ${nombreTinta(el.colorBorde)} grosor ${el.grosor}` : ''}${el.curva ? ` · en curva (${el.curva})` : ''} · ${cm(wcm)} × ${cm(hcm)} cm · ${pos}`; }
        const i = IMGS[el.img] || {};
        if (i.sticker) return `${i.nombre} · ${cm(wcm)} × ${cm(hcm)} cm · ${pos}`;
        const ppp = i.w ? Math.round(i.w / (wcm / 2.54)) : 0;
        return `Imagen «${i.nombre}»${i.w ? ` (${i.w} × ${i.h} px, ${ppp} ppp)` : ''}${el.sinFondo ? ' · sin fondo blanco' : ''} · ${cm(wcm)} × ${cm(hcm)} cm · ${pos}`;
      })};
    });
    const cantidades = !P.tallas ? `${S.cant} ${S.cant === 1 ? 'unidad' : 'unidades'}` : S.modo === 'nombres'
      ? S.nombres.filter(n => n.nombre.trim()).map(n => `${n.nombre} (${n.talla})`).join(', ') || 'Sin nombres todavía'
      : Object.entries(S.tallas).filter(([, n]) => n > 0).map(([t, n]) => `${t} × ${n}`).join(', ') || 'Sin tallas todavía';
    return {codigo, producto: P.nombre, color, tecnica: P.tecnica, total: totalUnidades(), cantidades, modoNombres: S.modo === 'nombres' && !!P.tallas, vistas: lineasVista, notas: S.notas.trim(), cliente: S.cliente.trim(), ciudad: S.ciudad.trim(),
      archivos: Object.values(S.capas).flat().filter(e => e.img && IMGS[e.img] && !IMGS[e.img].sticker).map(e => IMGS[e.img])};
  }
  function textoWA(f) {
    let t = `Hola Tránsfer!, quiero cotizar este diseño: *${f.codigo}*\n\n• Producto: ${f.producto} · color ${f.color} · ${f.tecnica}\n• ${f.modoNombres ? 'Nombres y tallas' : 'Cantidad'}: ${f.cantidades} (total ${f.total})\n`;
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
    const [ax, ay, aw, ah] = areaDe(v);
    for (const el of S.capas[vista] || []) {
      let src;
      if (el.tipo === 'texto') src = canvasTexto(el, 2);
      else src = await new Promise(ok => { const im = new Image(); im.onload = () => ok(im); im.onerror = () => ok(null); im.src = fuenteImg(el); });
      if (!src) continue;
      const sw = src.naturalWidth || src.width, sh = src.naturalHeight || src.height, ew = el.w * aw, eh = ew * sh / sw;
      x.save(); x.translate(ax + el.x * aw, ay + el.y * ah); x.rotate(el.rot * Math.PI / 180); x.drawImage(src, -ew / 2, -eh / 2, ew, eh); x.restore();
    }
    if (som) { x.globalCompositeOperation = 'multiply'; x.drawImage(som, 0, 0, w, h); }
    if (bri) { x.globalCompositeOperation = 'screen'; x.drawImage(bri, 0, 0, w, h); }
    x.globalCompositeOperation = 'source-over';
    return c;
  }
  async function canvasFicha() {
    const f = ficha(), P = PRENDAS[S.prod], vistas = Object.keys(P.vistas), W = 1400, pad = 50;
    const mocks = await Promise.all(vistas.map(v => renderMockup(v, 600)));
    const c = document.createElement('canvas'); c.width = W; c.height = 4000; const x = c.getContext('2d');
    x.fillStyle = '#FBF6EC'; x.fillRect(0, 0, W, c.height);
    x.fillStyle = '#053468'; x.fillRect(0, 0, W, 120);
    x.fillStyle = '#FECF03'; x.font = '900 46px Rubik'; x.fillText('Tránsfer!', pad, 75);
    x.fillStyle = '#fff'; x.font = '700 22px Rubik'; x.fillText('Ficha de diseño para producción', pad + 250, 72);
    x.textAlign = 'right'; x.font = '900 34px Rubik'; x.fillStyle = '#FECF03'; x.fillText(f.codigo, W - pad, 62);
    x.font = '500 18px Rubik'; x.fillStyle = '#fff'; x.fillText(new Date().toLocaleString('es-CO', {dateStyle: 'long', timeStyle: 'short'}), W - pad, 92); x.textAlign = 'left';
    const n = mocks.length, mw = Math.min(600, (W - pad * 2 - (n - 1) * 30) / n); let y = 160;
    mocks.forEach((m, i) => { const mx = pad + i * (mw + 30), mh = mw * m.height / m.width;
      x.fillStyle = '#fff'; x.strokeStyle = T; x.lineWidth = 3; x.beginPath(); x.roundRect(mx, y, mw, mh + 56, 22); x.fill(); x.stroke();
      x.drawImage(m, mx + 10, y + 10, mw - 20, mh - 20 * mh / mw);
      x.fillStyle = T; x.font = '900 22px Rubik'; x.fillText(Object.values(P.vistas)[i].nombre.toUpperCase() + ((S.capas[vistas[i]] || []).length ? '' : ' · sin diseño'), mx + 20, y + mh + 36); });
    y += Math.max(...mocks.map(m => mw * m.height / m.width)) + 100;
    const ancho = W - pad * 2;
    const parrafo = (t, fuente, color, salto = 30) => { x.font = fuente; x.fillStyle = color; const pal = t.split(' '); let l = ''; for (const p of pal) { const prueba = l ? l + ' ' + p : p; if (x.measureText(prueba).width > ancho) { x.fillText(l, pad, y); y += salto; l = p; } else l = prueba; } if (l) { x.fillText(l, pad, y); y += salto; } };
    const titulo = t => { y += 14; x.fillStyle = '#B30A51'; x.font = '900 24px Rubik'; x.fillText(t.toUpperCase(), pad, y); y += 36; };
    titulo('Producto'); parrafo(`${f.producto} · color ${f.color} (${S.color}) · técnica ${f.tecnica}`, '600 24px Rubik', T, 34);
    titulo(f.modoNombres ? `Nombres y tallas (${f.total})` : `Cantidad (${f.total})`); parrafo(f.cantidades, '500 22px Rubik', T, 32);
    f.vistas.forEach(v => { titulo(v.vista); v.items.forEach((it, i) => parrafo(`${i + 1}. ${it}`, '500 21px Rubik', '#2E3850', 30)); });
    if (f.notas) { titulo('Notas del cliente'); parrafo(f.notas, '500 22px Rubik', T, 32); }
    if (f.cliente || f.ciudad) { titulo('Cliente'); parrafo([f.cliente, f.ciudad].filter(Boolean).join(' · '), '500 22px Rubik', T, 32); }
    if (f.archivos.length) { titulo('Archivos para pedir al cliente'); parrafo(f.archivos.map(a => a.nombre).join(', '), '500 21px Rubik', T, 30); }
    y += 20; x.fillStyle = '#053468'; x.fillRect(0, y, W, 70); x.fillStyle = '#fff'; x.font = '700 20px Rubik'; x.fillText('Tránsfer! · Piedecuesta, Santander · WhatsApp 321 280 8077 · Medidas y colores de referencia: se confirman antes de producir.', pad, y + 43); y += 70;
    const out = document.createElement('canvas'); out.width = W; out.height = y; out.getContext('2d').drawImage(c, 0, 0); return out;
  }
  const blobDe = c => new Promise(ok => c.toBlob(ok, 'image/png'));
  function descargar(blob, nombre) { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = nombre; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500); }

  async function resumen() {
    const f = ficha(), P = PRENDAS[S.prod];
    $('#codigo-p').textContent = f.codigo;
    $('#mocks-r').innerHTML = '<p class="cargando-r">Preparando la vista previa…</p>';
    const vistas = Object.keys(P.vistas), mocks = await Promise.all(vistas.map(v => renderMockup(v, 420)));
    $('#mocks-r').innerHTML = mocks.map((m, i) => `<figure><img src="${m.toDataURL('image/png')}" alt="Vista ${P.vistas[vistas[i]].nombre}"><figcaption>${P.vistas[vistas[i]].nombre}</figcaption></figure>`).join('');
    const vacio = !f.vistas.length;
    $('#spec-r').innerHTML = `<li><b>Producto</b>${f.producto} · ${f.color} · ${f.tecnica}</li><li><b>${f.modoNombres ? 'Nombres' : 'Cantidad'}</b>${esc(f.cantidades)} <em>(${f.total} en total)</em></li>` +
      f.vistas.map(v => `<li><b>${v.vista}</b><ol>${v.items.map(i => `<li>${esc(i)}</li>`).join('')}</ol></li>`).join('') +
      (vacio ? '<li class="alerta">Todavía no hay diseño. Vuelve al paso 2.</li>' : '') + (!f.total ? '<li class="alerta">Falta la cantidad o la lista de nombres (paso 3).</li>' : '');
    $('#enviar-p').disabled = $('#agregar-p').disabled = vacio || !f.total;
  }
  $('#notas-p').addEventListener('input', e => { S.notas = e.target.value; guardarBorrador(); });
  $('#cliente-p').addEventListener('input', e => { S.cliente = e.target.value; });
  $('#ciudad-p').addEventListener('input', e => { S.ciudad = e.target.value; });
  $('#descargar-p').addEventListener('click', async () => { aviso('Preparando la ficha…'); const c = await canvasFicha(); descargar(await blobDe(c), `Ficha-${codigo}.png`); aviso('Ficha descargada. Adjúntala en WhatsApp con tus archivos.'); });
  $('#enviar-p').addEventListener('click', async () => {
    const f = ficha(), txt = textoWA(f), c = await canvasFicha(), blob = await blobDe(c);
    const archivos = [new File([blob], `Ficha-${f.codigo}.png`, {type: 'image/png'}), ...f.archivos.map(a => a.archivo).filter(Boolean)];
    guardarFicha(f);
    if (navigator.canShare && navigator.canShare({files: archivos})) {
      try { await navigator.share({files: archivos, text: txt, title: 'Diseño ' + f.codigo}); return; } catch (e) { if (e.name === 'AbortError') return; }
    }
    descargar(blob, `Ficha-${f.codigo}.png`);
    window.open(WA + encodeURIComponent(txt), '_blank', 'noopener');
    aviso('Se descargó la ficha: adjúntala en el chat' + (f.archivos.length ? ' junto con tus imágenes originales.' : '.'));
  });
  $('#agregar-p').addEventListener('click', async () => {
    const f = ficha(), m = await renderMockup(S.vista in PRENDAS[S.prod].vistas && (S.capas[S.vista] || []).length ? S.vista : 'frente', 160);
    guardarFicha(f);
    window.TRANSFER.agregar({perso: true, nombre: `${f.producto} personalizado`.replace('Camiseta personalizado', 'Camiseta personalizada').replace('Gorra personalizado', 'Gorra personalizada'), img: m.toDataURL('image/webp', .8), tono: 't-crema', detalle: `${f.codigo} · ${f.color}${f.modoNombres ? ' · ' + f.total + ' nombres' : ''}`, talla: '—', cant: f.total || 1});
  });
  function guardarFicha(f) { const todas = leerLS('transfer-fichas', {}); todas[f.codigo] = textoWA(f); const llaves = Object.keys(todas); if (llaves.length > 20) delete todas[llaves[0]]; guardarLS('transfer-fichas', todas); }

  /* Mis diseños y enlace para compartir */
  $('#guardar-p').addEventListener('click', async () => {
    const f = ficha(), m = await renderMockup('frente', 180), lista = leerLS('transfer-disenos', []);
    const usadas = {}; Object.values(S.capas).flat().forEach(e => { if (e.img && !e.img.startsWith('st:') && IMGS[e.img]) usadas[e.img] = {src: IMGS[e.img].src, w: IMGS[e.img].w, h: IMGS[e.img].h, nombre: IMGS[e.img].nombre}; });
    const d = {codigo: f.codigo, fecha: Date.now(), prod: S.prod, color: S.color, capas: S.capas, modo: S.modo, tallas: S.tallas, cant: S.cant, nombres: S.nombres, thumb: m.toDataURL('image/webp', .7), imgs: usadas};
    const nueva = [d, ...lista.filter(x => x.codigo !== f.codigo)].slice(0, 12);
    if (guardarLS('transfer-disenos', nueva)) aviso('Diseño guardado en este navegador. Lo encuentras en «Mis diseños».');
    else { d.imgs = {}; guardarLS('transfer-disenos', [d, ...lista.filter(x => x.codigo !== f.codigo)].slice(0, 12)) ? aviso('Guardado, pero sin tus imágenes: son muy pesadas para el navegador.') : aviso('No se pudo guardar: el navegador no tiene espacio.'); }
  });
  $('#enlace-p').addEventListener('click', async () => {
    const capas = JSON.parse(JSON.stringify(S.capas)); let quitadas = 0;
    Object.keys(capas).forEach(k => { capas[k] = capas[k].filter(e => { const ok = !e.img || e.img.startsWith('st:'); if (!ok) quitadas++; return ok; }); });
    const datos = btoa(unescape(encodeURIComponent(JSON.stringify({prod: S.prod, color: S.color, capas})))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    const url = location.origin + location.pathname + '#d=' + datos;
    try { await navigator.clipboard.writeText(url); aviso('Enlace copiado.' + (quitadas ? ' Las imágenes que subiste no viajan en el enlace.' : '')); } catch (e) { prompt('Copia este enlace:', url); }
  });
  const dlg = $('#dlg-disenos');
  $('#mis-dis').addEventListener('click', () => {
    const lista = leerLS('transfer-disenos', []);
    $('#lista-dis').innerHTML = lista.length ? lista.map((d, i) => `<div class="dis"><img src="${d.thumb}" alt=""><div><b>${PRENDAS[d.prod]?.nombre || ''} · ${d.codigo}</b><small>${new Date(d.fecha).toLocaleDateString('es-CO')}</small></div><button type="button" class="btn-mini" data-abrir="${i}">Abrir</button><button type="button" class="quitar-d" data-quitar="${i}" aria-label="Borrar">×</button></div>`).join('') : '<p class="vacio-el">Todavía no tienes diseños guardados. Usa «Guardar diseño» en el paso 4.</p>';
    dlg.showModal();
  });
  dlg.addEventListener('click', e => {
    if (e.target === dlg || e.target.closest('[data-cerrar-dlg]')) dlg.close();
    const lista = leerLS('transfer-disenos', []);
    const a = e.target.closest('[data-abrir]'); if (a) { const d = lista[+a.dataset.abrir]; cargarDiseno(d); dlg.close(); aviso('Diseño ' + d.codigo + ' abierto.'); }
    const q = e.target.closest('[data-quitar]'); if (q) { lista.splice(+q.dataset.quitar, 1); guardarLS('transfer-disenos', lista); $('#mis-dis').click(); }
  });
  function cargarDiseno(d) {
    Object.entries(d.imgs || {}).forEach(([id, i]) => { IMGS[id] = i; });
    Object.assign(S, {prod: d.prod, color: d.color, capas: d.capas || {}, modo: d.modo || 'tallas', tallas: d.tallas || {M: 1}, cant: d.cant || 1, nombres: d.nombres?.length ? d.nombres : [{nombre: '', talla: 'M'}], vista: 'frente', sel: null});
    Object.values(S.capas).flat().forEach(e => { if (e.img && !IMGS[e.img]) e.img = 'st:estrella'; });
    codigo = d.codigo || null; todo(); guardarHist();
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
  if (hash) { try { const o = JSON.parse(decodeURIComponent(escape(atob(hash[1].replace(/-/g, '+').replace(/_/g, '/'))))); Object.assign(S, {prod: o.prod, color: o.color, capas: o.capas}); } catch (e) {} }
  else if (q.get('producto') && PRENDAS[q.get('producto')]) { S.prod = q.get('producto'); S.color = PRENDAS[S.prod].colores[0][1]; if (S.prod === 'buzo') S.color = '#1C2A4C'; S.capas = {frente: [nuevoTexto({texto: q.get('texto') || 'TU NOMBRE', color: S.color === '#FFFFFF' ? '#053468' : '#FECF03', y: .35})]}; }
  else if (q.get('texto')) { S.capas = {frente: [nuevoTexto({texto: q.get('texto').slice(0, 30), y: .35})]}; }
  else if (borrador && Object.values(borrador.capas || {}).flat().length) { Object.entries(borrador.imgs || {}).forEach(([id, i]) => { IMGS[id] = i; }); Object.assign(S, borrador); Object.values(S.capas).flat().forEach(e => { if (e.img && !IMGS[e.img]) e.img = 'st:estrella'; }); S.sel = null; }
  else S.capas = {frente: [nuevoTexto({y: .35})]};
  if (!vistaDe(S.prod, S.vista)) S.vista = 'frente';
  todo(); guardarHist();
  // repinta los textos cuando terminen de cargar las letras
  Promise.all(['900 40px Rubik', '500 40px Rubik', '300 40px Rubik', '400 40px Anton'].map(f => document.fonts.load(f))).then(() => { renderCapas(); });
  window.PERSONALIZADOR = {S, ficha, textoWA, canvasFicha, renderMockup};
})();
