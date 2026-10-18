/* Itazi Engenharia – faixa "Instalar no celular" + correção das fotos (memória/HEIC) */
(function () {
  /* =================== FAIXA DE INSTALAÇÃO =================== */
  var css = document.createElement('style');
  css.textContent =
    '#faixaInstalar{display:none;max-width:900px;margin:0 auto 12px;background:#2f855a;color:#fff;border:none;border-radius:8px;' +
    'padding:16px 18px;font:bold 15pt Arial,sans-serif;width:100%;cursor:pointer;box-shadow:0 3px 8px rgba(0,0,0,.25);text-align:center}' +
    '#faixaInstalar small{display:block;font:normal 10pt Arial,sans-serif;opacity:.92;margin-top:4px}' +
    '#faixaInstalar:active{transform:scale(.98)}' +
    '#ajudaInstalar{position:fixed;inset:0;background:rgba(0,0,0,.6);display:none;align-items:center;justify-content:center;z-index:99;padding:14px}' +
    '#ajudaInstalar>div{background:#fff;border-radius:10px;max-width:420px;padding:20px;font:11pt Arial,sans-serif;line-height:1.5}' +
    '#ajudaInstalar h3{margin:0 0 10px;color:#1a365d}#ajudaInstalar ol{padding-left:20px;margin:0 0 14px}' +
    '#ajudaInstalar button{background:#1a365d;color:#fff;border:none;border-radius:5px;padding:10px 18px;font:bold 11pt Arial;width:100%}';
  document.head.appendChild(css);

  var ua = navigator.userAgent;
  var ehIOS = /iphone|ipad|ipod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var ehMovel = ehIOS || /Android|Mobile/i.test(ua);
  var navInterno = /FBAN|FBAV|Instagram|WhatsApp|Teams|; wv\)/i.test(ua);
  var instalado = function () { return matchMedia('(display-mode: standalone)').matches || navigator.standalone === true; };
  var pedido = null;

  var faixa = document.createElement('button');
  faixa.id = 'faixaInstalar'; faixa.type = 'button';
  faixa.innerHTML = '📲 TOQUE AQUI PARA INSTALAR NO CELULAR<small>O app fica com ícone na tela inicial e funciona sem internet</small>';
  document.body.insertBefore(faixa, document.body.firstChild);

  var ajuda = document.createElement('div');
  ajuda.id = 'ajudaInstalar';
  ajuda.innerHTML = '<div><h3 id="ajTit"></h3><ol id="ajPassos"></ol><button type="button">Entendi</button></div>';
  document.body.appendChild(ajuda);
  ajuda.querySelector('button').onclick = function () { ajuda.style.display = 'none'; };
  ajuda.onclick = function (e) { if (e.target === ajuda) ajuda.style.display = 'none'; };
  function mostrar(tit, passos) {
    document.getElementById('ajTit').textContent = tit;
    document.getElementById('ajPassos').innerHTML = passos.map(function (p) { return '<li>' + p + '</li>'; }).join('');
    ajuda.style.display = 'flex';
  }

  faixa.style.display = instalado() ? 'none' : 'block';
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); pedido = e; });
  window.addEventListener('appinstalled', function () { faixa.style.display = 'none'; pedido = null; alert('App instalado! Abra pelo ícone "Ficha Vistoria" na tela inicial.'); });

  faixa.onclick = function () {
    if (pedido) { pedido.prompt(); pedido.userChoice.then(function () { pedido = null; }); return; }
    if (navInterno) return mostrar('Abra no navegador do celular', [
      'Você abriu o link dentro de outro aplicativo (WhatsApp, Teams, e-mail…).',
      'Toque nos <b>3 pontinhos</b> no canto da tela.',
      'Escolha <b>Abrir no Chrome</b> (Android) ou <b>Abrir no Safari</b> (iPhone).',
      'Toque de novo neste botão verde.']);
    if (ehIOS) return mostrar('Instalar no iPhone', [
      'Confirme que está no <b>Safari</b>.',
      'Toque em <b>Compartilhar</b> (quadrado com seta para cima), na barra de baixo.',
      'Role e toque em <b>Adicionar à Tela de Início</b>.',
      'Toque em <b>Adicionar</b>.']);
    if (!ehMovel) return mostrar('Instalar no computador', [
      'Use o <b>Chrome</b> ou o <b>Edge</b>.',
      'Clique no ícone de <b>instalar</b> no lado direito da barra de endereço.',
      'Para o celular, abra este mesmo link no aparelho.']);
    mostrar('Instalar no Android', [
      'Toque no menu <b>⋮</b> (canto superior direito do Chrome).',
      'Toque em <b>Instalar app</b> ou <b>Adicionar à tela inicial</b>.',
      'Confirme em <b>Instalar</b>.',
      'Se a opção não aparecer, feche a aba, abra o link de novo e repita.']);
  };

  /* =================== FOTOS: MENOS MEMÓRIA + MENSAGENS CORRETAS =================== */
  if (typeof fotos === 'undefined' || typeof renderFotos !== 'function') return;
  var MAX = 1600, QUAL = 0.8;
  var ehHEIC = function (f) { return /hei[cf]/i.test(f.type || '') || /\.(heic|heif)$/i.test(f.name || ''); };

  // Decodifica a foto já reduzida, sem carregar a imagem inteira de 50–200 MP na memória
  async function decodificar(file) {
    if (window.createImageBitmap) {
      try { return await createImageBitmap(file, { resizeWidth: MAX, resizeQuality: 'medium', imageOrientation: 'from-image' }); } catch (e) {}
      try { return await createImageBitmap(file, { imageOrientation: 'from-image' }); } catch (e) {}
    }
    var url = URL.createObjectURL(file);   // evita gerar um texto base64 gigante
    try { var img = new Image(); img.src = url; await img.decode(); return img; }
    finally { setTimeout(function () { URL.revokeObjectURL(url); }, 3000); }
  }

  async function processarLeve(file) {
    var bmp = await decodificar(file);
    var w0 = bmp.width, h0 = bmp.height, f = Math.min(1, MAX / Math.max(w0, h0));
    var c = document.createElement('canvas'); c.width = Math.round(w0 * f); c.height = Math.round(h0 * f);
    var g = c.getContext('2d'); g.drawImage(bmp, 0, 0, c.width, c.height);
    if (bmp.close) bmp.close();
    var quando = new Date(file.lastModified || Date.now());
    var linhas = [quando.toLocaleDateString('pt-BR') + '  ' + quando.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })];
    var coord = (typeof textoCoordFoto === 'function') ? textoCoordFoto() : ''; if (coord) linhas.push(coord);
    var fs = Math.max(14, Math.round(c.width / 42)), pad = Math.round(fs * 0.5);
    g.font = 'bold ' + fs + 'px Arial, Helvetica, sans-serif';
    var larg = Math.max.apply(null, linhas.map(function (l) { return g.measureText(l).width; })) + pad * 2, alt = linhas.length * fs * 1.25 + pad * 1.2;
    g.fillStyle = 'rgba(0,0,0,0.55)'; g.fillRect(c.width - larg, c.height - alt, larg, alt);
    g.fillStyle = '#fff'; g.textBaseline = 'top';
    linhas.forEach(function (l, i) { g.fillText(l, c.width - larg + pad, c.height - alt + pad * 0.6 + i * fs * 1.25); });
    var src = c.toDataURL('image/jpeg', QUAL);
    c.width = c.height = 0;   // libera a memória do desenho
    return src;
  }
  processarFoto = processarLeve;

  handlePhotoUpload = async function (files) {
    localStorage.removeItem('abrindoCamera');
    var lista = Array.prototype.slice.call(files || []); if (!lista.length) return;
    if (!textoCoordFoto()) toast('Dica: capture a posição antes das fotos para gravar as coordenadas nelas', 3500);
    var ok = 0, heic = 0, falha = 0;
    for (var i = 0; i < lista.length; i++) {   // uma por vez, para não estourar a memória
      try { fotos.push({ src: await processarLeve(lista[i]), leg: '' }); ok++; }
      catch (e) { if (ehHEIC(lista[i])) heic++; else falha++; }
    }
    renderFotos(); autoSalvar();
    if (heic) return avisoFoto('Foto em formato HEIC/HEIF', ok, [
      'Este navegador não abre fotos HEIC.',
      'Samsung: abra o app <b>Câmera</b> → ⚙️ Configurações → <b>Formatos e opções avançadas</b> → desligue <b>Imagens HEIF</b>.',
      'Outras marcas: nas configurações da câmera, troque o formato para <b>JPG/JPEG</b>.',
      'Depois tire a foto de novo.']);
    if (falha) return avisoFoto('Não foi possível processar ' + falha + ' foto(s)', ok, [
      'O celular ficou sem memória para abrir a imagem.',
      'Feche outros aplicativos abertos e tente de novo.',
      'Se usar câmera de 50, 108 ou 200 MP, troque a resolução para <b>12 MP</b> (ou 3:4 padrão) nas configurações da câmera.']);
    toast(ok === 1 ? 'Foto adicionada (' + fotos.length + ' no total)' : ok + ' fotos adicionadas');
  };

  function avisoFoto(tit, ok, passos) {
    mostrar(tit, (ok ? ['<b>' + ok + ' foto(s) foram adicionadas normalmente.</b>'] : []).concat(passos));
  }

  // Detecta quando o Android fechou o app enquanto a câmera estava aberta (falta de memória)
  var cam = document.getElementById('cameraInput');
  if (cam) {
    cam.addEventListener('click', function () { localStorage.setItem('abrindoCamera', String(Date.now())); });
    cam.addEventListener('cancel', function () { localStorage.removeItem('abrindoCamera'); });
  }
  var t = +localStorage.getItem('abrindoCamera');
  localStorage.removeItem('abrindoCamera');
  if (t && Date.now() - t < 5 * 60 * 1000) {
    setTimeout(function () {
      mostrar('O celular fechou o app ao abrir a câmera', [
        'Isso acontece quando falta memória: o Android fecha o navegador enquanto a câmera está aberta. <b>Sua ficha foi salva</b>; só a última foto se perdeu.',
        'Feche os outros aplicativos abertos e tente <b>📷 TIRAR FOTO</b> de novo.',
        'Se continuar: tire as fotos pelo app <b>Câmera</b> do celular e depois use <b>🖼️ ESCOLHER DA GALERIA</b>.',
        'Ajuda também baixar a resolução da câmera para <b>12 MP</b>.']);
    }, 800);
  }
})();
