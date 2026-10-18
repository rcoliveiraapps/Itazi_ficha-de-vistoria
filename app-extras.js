/* Itazi Engenharia – faixa "Instalar no celular" */
(function () {
  var css = document.createElement('style');
  css.textContent =
    '#faixaInstalar{display:none;max-width:900px;margin:0 auto 12px;background:#2f855a;color:#fff;border:none;border-radius:8px;' +
    'padding:16px 18px;font:bold 15pt Arial,sans-serif;width:100%;cursor:pointer;box-shadow:0 3px 8px rgba(0,0,0,.25);text-align:center}' +
    '#faixaInstalar small{display:block;font:normal 10pt Arial,sans-serif;opacity:.92;margin-top:4px}' +
    '#faixaInstalar:active{transform:scale(.98)}';
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
  faixa.style.display = instalado() ? 'none' : 'block';
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); pedido = e; });
  window.addEventListener('appinstalled', function () { faixa.style.display = 'none'; pedido = null; alert('App instalado! Abra pelo ícone "Ficha Vistoria" na tela inicial.'); });
  faixa.onclick = function () {
    if (pedido) { pedido.prompt(); pedido.userChoice.then(function () { pedido = null; }); return; }
    if (navInterno) return aviso('Abra no navegador do celular', [
      'Você abriu o link dentro de outro aplicativo (WhatsApp, Teams, e-mail…).',
      'Toque nos <b>3 pontinhos</b> no canto da tela.',
      'Escolha <b>Abrir no Chrome</b> (Android) ou <b>Abrir no Safari</b> (iPhone).',
      'Toque de novo neste botão verde.']);
    if (ehIOS) return aviso('Instalar no iPhone', [
      'Confirme que está no <b>Safari</b>.',
      'Toque em <b>Compartilhar</b> (quadrado com seta para cima), na barra de baixo.',
      'Role e toque em <b>Adicionar à Tela de Início</b>.', 'Toque em <b>Adicionar</b>.']);
    if (!ehMovel) return aviso('Instalar no computador', [
      'Use o <b>Chrome</b> ou o <b>Edge</b>.',
      'Clique no ícone de <b>instalar</b> no lado direito da barra de endereço.',
      'Para o celular, abra este mesmo link no aparelho.']);
    aviso('Instalar no Android', [
      'Toque no menu <b>⋮</b> (canto superior direito do Chrome).',
      'Toque em <b>Instalar app</b> ou <b>Adicionar à tela inicial</b>.', 'Confirme em <b>Instalar</b>.',
      'Se a opção não aparecer, feche a aba, abra o link de novo e repita.']);
  };
})();
