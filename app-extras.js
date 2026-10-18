/* Itazi Engenharia – logotipo fixo + botão "Instalar no celular" */
(function () {
  /* ---------- Faixa de instalação ---------- */
  var css = document.createElement('style');
  css.textContent =
    '#faixaInstalar{display:none;max-width:900px;margin:0 auto 12px;background:#2f855a;color:#fff;border:none;border-radius:8px;' +
    'padding:16px 18px;font:bold 15pt Arial,sans-serif;width:100%;cursor:pointer;box-shadow:0 3px 8px rgba(0,0,0,.25);text-align:center}' +
    '#faixaInstalar small{display:block;font:normal 10pt Arial,sans-serif;opacity:.92;margin-top:4px}' +
    '#faixaInstalar:active{transform:scale(.98)}' +
    '#ajudaInstalar{position:fixed;inset:0;background:rgba(0,0,0,.6);display:none;align-items:center;justify-content:center;z-index:99;padding:14px}' +
    '#ajudaInstalar div{background:#fff;border-radius:10px;max-width:420px;padding:20px;font:11pt Arial,sans-serif;line-height:1.5}' +
    '#ajudaInstalar h3{margin:0 0 10px;color:#1a365d}#ajudaInstalar ol{padding-left:20px;margin:0 0 14px}' +
    '#ajudaInstalar button{background:#1a365d;color:#fff;border:none;border-radius:5px;padding:10px 18px;font:bold 11pt Arial;width:100%}';
  document.head.appendChild(css);

  var ua = navigator.userAgent;
  var ehIOS = /iphone|ipad|ipod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
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
  function mostrar(tit, passos) {
    document.getElementById('ajTit').textContent = tit;
    document.getElementById('ajPassos').innerHTML = passos.map(function (p) { return '<li>' + p + '</li>'; }).join('');
    ajuda.style.display = 'flex';
  }

  function atualizar() { faixa.style.display = instalado() ? 'none' : 'block'; }
  atualizar();

  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); pedido = e; });
  window.addEventListener('appinstalled', function () { faixa.style.display = 'none'; alert('App instalado! Abra pelo ícone "Ficha Vistoria" na tela inicial.'); });

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
    mostrar('Instalar no Android', [
      'Toque no menu <b>⋮</b> (canto superior direito do Chrome).',
      'Toque em <b>Instalar app</b> ou <b>Adicionar à tela inicial</b>.',
      'Confirme em <b>Instalar</b>.',
      'Se a opção não aparecer, feche a aba, abra o link de novo e repita.']);
  };

  /* ---------- Logotipo Itazi fixo (tela, PDF e Word) ---------- */
  fetch('icons/logo-itazi.png').then(function (r) { return r.blob(); }).then(function (b) {
    var fr = new FileReader();
    fr.onload = function () {
      var url = fr.result, tent = 0;
      (function aplicar() {
        if (typeof db === 'undefined' || !db) { if (tent++ < 50) return setTimeout(aplicar, 100); return; }
        setTimeout(function () {
          logo = url;
          try { cfgSet('logo', url); } catch (e) {}
          var t = document.getElementById('logoTela');
          if (t) t.innerHTML = '<img src="' + url + '" alt="Itazi Engenharia">';
        }, 150);
      })();
    };
    fr.readAsDataURL(b);
  }).catch(function () {});
})();
