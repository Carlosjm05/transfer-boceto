/* Tránsfer! · Prendas dibujadas a mano en SVG (22 nov 2026). Las usan el personalizador y el héroe de la portada.
   El color cambia en vivo: la base se pinta con el color elegido y la capa de sombra va con mix-blend-mode:multiply. */
(() => {
  const T = '#0B1B33';
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

  // Superficie extendida de un cilindro: hoja blanca y, debajo, qué parte es cada tramo
  const extendido = (x, y, w, h, tramos) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="#fff" ${linea}/>` +
    tramos.map((t, i) => { const px = x + w * i / (tramos.length - 1), a = i === 0 ? 'start' : i === tramos.length - 1 ? 'end' : 'middle'; return t ? `<path d="M${px} ${y + h + 4} v10" stroke="#0B1B33" stroke-opacity=".5" stroke-width="2"/><text x="${px}" y="${y + h + 36}" text-anchor="${a}" font-family="Rubik,Arial,sans-serif" font-weight="800" font-size="21" fill="#0B1B33" fill-opacity=".7">${t}</text>` : ''; }).join('');

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
      // El diseño se arma extendido y cubre todo el mug; frente y reverso solo sirven para dibujarlo
      vuelta: {nombre: 'Todo el mug', sangrado: true, vb: [700, 420], area: [20, 44, 660, 313.5], cm: 20,
        cil: {cx: 285, r: 135, y0: 120, y1: 500, c0: 20, c1: 18, circ: 25.7, lados: [{n: 'Asa a la izquierda', vt: 'reverso', giro: -90}, {n: 'De frente', vt: 'frente', giro: 0, sinAsa: true}, {n: 'Asa a la derecha', vt: 'frente', giro: 90}]},
        base: () => extendido(20, 44, 660, 313.5, ['Asa', 'Un lado', 'Frente', 'Otro lado', 'Asa']), sombra: () => ''},
      frente: {soloDibujo: true, nombre: 'Frente', vb: [600, 560], area: [175, 205, 220, 208], cm: 9,
        base: (c, d) => `<path d="M410 190 C530 186 540 410 410 410 L410 370 C490 372 488 228 410 230 Z" fill="${c}" ${linea}/><path d="M150 120 L420 120 L420 500 C420 524 150 524 150 500 Z" fill="${c}" ${linea}/><ellipse cx="285" cy="120" rx="135" ry="20" fill="${c}" ${linea}/><ellipse cx="285" cy="122" rx="122" ry="13" fill="${d}"/>`,
        sombra: u => `<defs><clipPath id="c${u}"><path d="M150 120 L420 120 L420 500 C420 524 150 524 150 500 Z"/></clipPath></defs><g clip-path="url(#c${u})">${cilindro(u, 150, 100, 270, 430)}</g><path d="M410 190 C530 186 540 410 410 410 L410 370 C490 372 488 228 410 230 Z" fill="#000" opacity=".12"/>`,
        brillo: u => `<g clip-path="url(#c${u})">${brilloCil(u, 150, 100, 270, 430)}</g>`},
      reverso: {soloDibujo: true, nombre: 'Reverso', espejo: true, vb: [600, 560], area: [175, 205, 220, 208], cm: 9}}},
    termo: {nombre: 'Termo', art: 'un termo', tecnica: 'Sublimación', colores: COL_BLANCO, tallas: null, vistas: {
      vuelta: {nombre: 'Todo el termo', sangrado: true, vb: [700, 580], area: [40, 44, 620, 472.4], cm: 21,
        cil: {cx: 300, r: 78, y0: 146, y1: 622, c0: 0, c1: 0, circ: 22, lados: [{n: 'De frente', vt: 'frente', giro: 0}, {n: 'Por detrás', vt: 'frente', giro: 180}]},
        base: () => extendido(40, 44, 620, 472.4, ['Atrás', '', 'Frente', '', 'Atrás']), sombra: () => ''},
      frente: {soloDibujo: true, nombre: 'Frente', vb: [600, 660], area: [238, 232, 124, 284], cm: 7,
        base: (c, d) => `<rect x="232" y="56" width="136" height="70" rx="14" fill="${c}" ${linea}/><rect x="244" y="122" width="112" height="22" fill="${d}"/><path d="M222 150 Q222 140 232 140 L368 140 Q378 140 378 150 L378 610 Q378 628 360 628 L240 628 Q222 628 222 610 Z" fill="${c}" ${linea}/>`,
        sombra: u => `<defs><clipPath id="c${u}"><path d="M222 150 Q222 140 232 140 L368 140 Q378 140 378 150 L378 610 Q378 628 360 628 L240 628 Q222 628 222 610 Z"/><rect x="232" y="56" width="136" height="70" rx="14"/></clipPath></defs><g clip-path="url(#c${u})">${cilindro(u, 222, 50, 156, 590)}</g>`,
        brillo: u => `<defs><clipPath id="c${u}"><path d="M222 150 Q222 140 232 140 L368 140 Q378 140 378 150 L378 610 Q378 628 360 628 L240 628 Q222 628 222 610 Z"/></clipPath></defs><g clip-path="url(#c${u})">${brilloCil(u, 222, 140, 156, 490)}</g>`},
      reverso: {soloDibujo: true, nombre: 'Reverso', espejo: true, vb: [600, 660], area: [238, 232, 124, 284], cm: 7}}},
  };
  // el reverso del mug y del termo es el frente en espejo
  ['mug', 'termo'].forEach(p => { const f = PRENDAS[p].vistas.frente, r = PRENDAS[p].vistas.reverso; Object.assign(r, {base: f.base, sombra: f.sombra, brillo: f.brillo}); });
  const vistaDe = (p, v) => PRENDAS[p].vistas[v];
  const areaDe = v => { const [x, y, w, h] = v.area; return v.espejo ? [v.vb[0] - x - w, y, w, h] : [x, y, w, h]; };
  const vistasDe = P => Object.entries(P.vistas).filter(([, v]) => !v.soloDibujo);   // las que el cliente diseña
  let uid = 0;
  function svgDe(p, vista, capa, color) {
    const v = vistaDe(p, vista), [w, h] = v.vb, u = 'p' + (++uid);
    let dentro = capa === 'base' ? v.base(color, oscuro(color, color.toUpperCase() === '#FFFFFF' ? .9 : .78)) : capa === 'sombra' ? v.sombra(u) : (v.brillo ? (capa === 'brillo' ? (v.sombra(u).match(/<defs>[\s\S]*?<\/defs>/) || [''])[0] + v.brillo(u) : '') : '');
    if (v.espejo) dentro = `<g transform="translate(${w} 0) scale(-1 1)">${dentro}</g>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${dentro}</svg>`;
  }
  const imgDeSvg = svg => new Promise(ok => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(null); i.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg); });

  window.TR_PRENDAS = {PRENDAS, vistaDe, vistasDe, areaDe, svgDe, imgDeSvg, oscuro};
})();
