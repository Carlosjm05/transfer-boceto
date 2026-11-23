/* Tránsfer! · Héroe de la portada (22 nov 2026): una demostración en vivo del personalizador.
   La prenda cambia de producto y color, el nombre se escribe letra por letra, cae un sticker y sale el sello.
   El visitante puede escribir su nombre, elegir producto y color, y seguir en el personalizador con todo cargado. */
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const vit = $('#vitrina'); if (!vit || !window.TR_PRENDAS) return;
  const {PRENDAS, vistaDe, areaDe, svgDe} = window.TR_PRENDAS;
  const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ORDEN = ['buzo', 'camiseta', 'gorra', 'mug', 'termo'];
  const PALABRA = {buzo: 'buzos', camiseta: 'camisetas', gorra: 'gorras', mug: 'mugs', termo: 'termos'};
  const COLOR_DEMO = {buzo: '#1C2A4C', camiseta: '#F4C430', gorra: '#7C1D3B', mug: '#FFFFFF', termo: '#FFFFFF'};
  const STICKER = {buzo: 'estrella', camiseta: 'rompecabezas', gorra: 'estrella', mug: 'navidad', termo: 'estrella'};
  const S = {prod: 'buzo', color: COLOR_DEMO.buzo, texto: '', auto: !reducido};
  const prenda = $('#v-prenda'), rota = $('#rota'), entrada = $('#nombre-h');
  const claro = hex => { const n = parseInt(hex.slice(1), 16); return (.299 * (n >> 16 & 255) + .587 * (n >> 8 & 255) + .114 * (n & 255)) / 255 > .6; };
  const nombre = () => (entrada.value.trim() || 'TU NOMBRE').toUpperCase().slice(0, 16);

  function pintar() {
    const v = vistaDe(S.prod, 'frente'), [w, h] = v.vb, [ax, ay, aw, ah] = areaDe(v), pc = (n, t) => n / t * 100 + '%';
    prenda.style.aspectRatio = w + ' / ' + h;
    prenda.innerHTML = `<div class="v-capa">${svgDe(S.prod, 'frente', 'base', S.color)}</div>
      <div class="v-area" style="left:${pc(ax, w)};top:${pc(ay, h)};width:${pc(aw, w)};height:${pc(ah, h)}">
        <span class="v-texto" style="color:${claro(S.color) ? '#053468' : '#FECF03'}"></span>
        <img class="v-sticker" src="../img/ilus/${STICKER[S.prod]}.webp" alt=""></div>
      <div class="v-capa v-sombra">${svgDe(S.prod, 'frente', 'sombra', S.color)}</div>
      ${v.brillo ? `<div class="v-capa v-brillo">${svgDe(S.prod, 'frente', 'brillo', S.color)}</div>` : ''}`;
    $$('#v-prods button').forEach(b => b.classList.toggle('on', b.dataset.p === S.prod));
    $('#v-colores').innerHTML = PRENDAS[S.prod].colores.map(([n, c]) => `<button type="button" style="--c:${c}" data-c="${c}" class="${c === S.color ? 'on' : ''}" aria-label="Color ${n}" title="${n}"></button>`).join('');
    $('#v-tec').textContent = PRENDAS[S.prod].tecnica === 'DTF' ? 'Estampado DTF · tela clara u oscura' : 'Sublimación · el diseño queda dentro del material';
  }
  function ajustarTexto(t) {
    const el = $('.v-texto'), area = $('.v-area'); if (!el || !area) return;
    el.textContent = t;
    const r = area.getBoundingClientRect(), c = document.createElement('canvas').getContext('2d');
    c.font = '900 100px Rubik'; const ancho = c.measureText(nombre()).width || 1;
    el.style.fontSize = Math.max(10, Math.min(r.width * .9 / ancho * 100, r.height * .3)) + 'px';
  }
  function cambiarPalabra(p) {
    rota.textContent = PALABRA[p] + '!'; rota.classList.remove('cambia'); void rota.offsetWidth; rota.classList.add('cambia');
  }

  // Línea de tiempo: producto → escribe el nombre → sticker → sello
  let pasoId = 0;
  const espera = ms => new Promise(r => setTimeout(r, ms));
  async function demo(p, color) {
    const id = ++pasoId; vit.classList.remove('editando');
    prenda.classList.remove('entra'); prenda.classList.add('sale'); await espera(reducido ? 0 : 240); if (id !== pasoId) return;
    S.prod = p; S.color = color || COLOR_DEMO[p]; pintar(); cambiarPalabra(p);
    prenda.classList.remove('sale'); prenda.classList.add('entra');
    $('.sello-listo').classList.remove('ver');
    const t = nombre();
    if (reducido) { ajustarTexto(t); $('.v-sticker').classList.add('ver'); return; }
    $('.v-texto').classList.add('escribiendo'); vit.classList.add('editando');
    for (let i = 1; i <= t.length; i++) { ajustarTexto(t.slice(0, i)); await espera(85); if (id !== pasoId) return; }
    $('.v-texto').classList.remove('escribiendo'); vit.classList.remove('editando');
    await espera(250); if (id !== pasoId) return;
    $('.v-sticker').classList.add('ver');
    await espera(420); if (id !== pasoId) return;
    vit.classList.remove('estampa'); void vit.offsetWidth; vit.classList.add('estampa'); $('.sello-listo').classList.add('ver');
  }
  let visible = true, ciclo = null, pausaHasta = 0;
  function siguiente() { if (!S.auto || !visible || Date.now() < pausaHasta) return; const i = ORDEN.indexOf(S.prod); demo(ORDEN[(i + 1) % ORDEN.length]); }
  const pausar = () => { pausaHasta = Date.now() + 14000; };

  // Controles
  $('#v-prods').innerHTML = ORDEN.map(p => `<button type="button" data-p="${p}" aria-label="${PRENDAS[p].nombre}" title="${PRENDAS[p].nombre}"><span>${svgDe(p, 'frente', 'base', '#E6E0D2')}</span><b>${PRENDAS[p].corto || PRENDAS[p].nombre}</b></button>`).join('');
  $('#v-prods').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; pausar(); demo(b.dataset.p); });
  $('#v-colores').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; pausar(); demo(S.prod, b.dataset.c); });
  entrada.addEventListener('input', () => { pausar(); ++pasoId; ajustarTexto(nombre()); $('.v-texto').classList.remove('escribiendo'); $('.v-sticker')?.classList.add('ver'); vit.classList.add('editando'); });
  entrada.addEventListener('blur', () => vit.classList.remove('editando'));
  // El formulario y "Empezar mi diseño" abren el personalizador con lo que el visitante dejó escogido
  const urlEditor = () => { const q = new URLSearchParams({producto: S.prod, color: S.color}); if (entrada.value.trim()) q.set('texto', entrada.value.trim()); return 'personaliza.html?' + q.toString(); };
  $('#prueba-h').addEventListener('submit', e => { e.preventDefault(); location.href = urlEditor(); });
  const ir = $('#ir-h'); if (ir) ir.addEventListener('click', () => { ir.href = urlEditor(); });
  addEventListener('resize', () => ajustarTexto($('.v-texto')?.textContent || nombre()));

  // Días para Navidad en el acceso de temporada
  const hoy = new Date(), dias = Math.ceil((new Date(hoy.getFullYear(), 11, 25) - hoy) / 864e5);
  const nd = $('[data-dias-h]'); if (nd && (hoy.getMonth() >= 10) && dias > 0) nd.textContent = `Faltan ${dias} días · separa tu pedido`;

  new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(vit);
  pintar(); cambiarPalabra(S.prod);
  document.fonts.load('900 40px Rubik').catch(() => {}).then(() => { demo('buzo'); if (!reducido) ciclo = setInterval(siguiente, 4600); });
})();
