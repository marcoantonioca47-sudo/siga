(function () {
  'use strict';

  var USER_KEY = 'siga30_portal_user_v3';
  var DATA_KEY = 'siga30_portal_data_v3';

  var accounts = [
    { id:'01022005', name:'Marco', password:'01022005', role:'Autor / Administrador', cd:'CDD', admin:true },
    { id:'maximo', name:'Maximo', password:'1234', role:'Administrador', cd:'CDD', admin:true },
    { id:'joao.silva', name:'João Silva', password:'1234', role:'Operador', cd:'CDD', admin:false }
  ];

  var state = { user:null, page:'home' };

  function byId(id){ return document.getElementById(id); }
  function norm(v){ return String(v == null ? '' : v).trim().toLowerCase(); }
  function esc(v){
    return String(v == null ? '' : v).replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function setMessage(text){
    var el = byId('loginmsg');
    if(el) el.textContent = text || '';
  }

  function showApp(){
    var login = byId('login');
    var app = byId('app');
    if(login) login.classList.add('hide');
    if(app) app.classList.remove('hide');
  }

  function showLogin(){
    var login = byId('login');
    var app = byId('app');
    if(login) login.classList.remove('hide');
    if(app) app.classList.add('hide');
  }

  function applyUser(user){
    state.user = {
      id:user.id, name:user.name, role:user.role, cd:user.cd,
      avatar:user.name.split(/\s+/).map(function(x){return x.charAt(0);}).join('').slice(0,2).toUpperCase()
    };
    try { localStorage.setItem(USER_KEY, JSON.stringify(state.user)); } catch(e) {}
    showApp();
    updateHeader();
    renderHome();
  }

  window.login = function(){
    try {
      var input = byId('u');
      var pass = byId('pw');
      var id = norm(input ? input.value : '');
      var password = pass ? String(pass.value || '') : '';

      if(!id || !password){
        setMessage('Informe usuário e senha.');
        return false;
      }

      var user = accounts.find(function(a){
        return norm(a.id) === id || norm(a.name) === id;
      });

      if(!user || String(user.password) !== password){
        setMessage('Usuário ou senha inválidos.');
        return false;
      }

      setMessage('');
      applyUser(user);
      return false;
    } catch(error) {
      console.error(error);
      setMessage('Erro interno no login. Tente novamente.');
      return false;
    }
  };

  window.logout = function(){
    state.user = null;
    try { localStorage.removeItem(USER_KEY); } catch(e) {}
    showLogin();
    setMessage('');
    var input = byId('u');
    if(input) input.focus();
  };

  function updateHeader(){
    if(!state.user) return;
    var map = {
      sideName:state.user.name,
      sideRole:state.user.role,
      headerName:state.user.name,
      headerRole:state.user.role,
      headerBranch:state.user.cd,
      headerWho:state.user.cd,
      sideInitials:state.user.avatar,
      headerInitials:state.user.avatar
    };
    Object.keys(map).forEach(function(id){
      var el = byId(id);
      if(el) el.textContent = map[id];
    });
  }

  function renderHome(){
    var main = byId('main');
    if(!main || !state.user) return;
    main.innerHTML =
      '<div class="page-title"><div><h1>Olá, ' + esc(state.user.name) + ' 👋</h1>' +
      '<p>Bem-vindo ao SIGA 3.0. Login realizado com sucesso.</p></div></div>' +
      '<div class="cards">' +
      '<div class="stat blue"><div class="stat-top"><span>SEPARAÇÕES</span></div><strong>0</strong><small>Registros</small></div>' +
      '<div class="stat green"><div class="stat-top"><span>CARREGAMENTOS</span></div><strong>0</strong><small>Registros</small></div>' +
      '<div class="stat purple"><div class="stat-top"><span>CONFERÊNCIAS</span></div><strong>0</strong><small>Registros</small></div>' +
      '<div class="stat dark"><div class="stat-top"><span>ATIVIDADES</span></div><strong>0</strong><small>Registros</small></div>' +
      '</div>' +
      '<div class="panel"><h3>Sistema online</h3><p>Sessão ativa para ' + esc(state.user.name) + ' • Filial ' + esc(state.user.cd) + '.</p></div>';
  }

  function restore(){
    try {
      var saved = JSON.parse(localStorage.getItem(USER_KEY) || 'null');
      if(!saved || !saved.id) return false;
      var user = accounts.find(function(a){ return norm(a.id) === norm(saved.id); });
      if(!user) return false;
      applyUser(user);
      return true;
    } catch(e) {
      return false;
    }
  }

  document.addEventListener('DOMContentLoaded', function(){
    var btn = byId('loginBtn');
    if(btn) btn.onclick = function(e){ e.preventDefault(); return window.login(); };

    var pw = byId('pw');
    if(pw) pw.onkeydown = function(e){
      if(e.key === 'Enter'){
        e.preventDefault();
        window.login();
      }
    };

    var clock = byId('headerClock');
    function updateClock(){
      if(clock) clock.textContent = new Date().toLocaleString('pt-BR');
    }
    updateClock();
    setInterval(updateClock, 15000);

    if(!restore()) showLogin();
  });
})();