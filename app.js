/* SIGA 3.0 - núcleo estável */
(function(){
'use strict';

const STORAGE_USER='siga30_portal_user_v3';
const STORAGE_DATA='siga30_portal_data_v3';
const ACCOUNT_STORE='siga30_accounts_v4';

const state={
 user:null,
 page:'home',
 permissions:{separacoes:true,carregamentos:true,atividades:true,desempenho:true,conferencias:false,admin:false}
};

const demo={
 separacoes:[
  {lote:'LT-1025',pedido:'PED-4587',destino:'Ponte Nova',peso:'860 kg',volumes:'42',inicio:'18/09/2026 08:15',fim:'18/09/2026 09:02',status:'Finalizada',resultado:'OK',usuario_id:'joao.silva',filial_id:'CDD'},
  {lote:'LT-1038',pedido:'PED-4621',destino:'Viçosa',peso:'620 kg',volumes:'31',inicio:'18/09/2026 10:20',fim:'',status:'Em andamento',resultado:'',usuario_id:'joao.silva',filial_id:'CDD'},
  {lote:'LT-1054',pedido:'PED-4701',destino:'Ponte Nova',peso:'430 kg',volumes:'21',inicio:'18/09/2026 13:10',fim:'18/09/2026 14:00',status:'Finalizada',resultado:'NÃO OK',usuario_id:'joao.silva',filial_id:'CDD'}
 ],
 carregamentos:[
  {romaneio:'ROM-783',destino:'Ponte Nova',motorista:'João Silva',placa:'OFA-4452',peso:'12.500 kg',volumes:'48',inicio:'18/09/2026 10:20',fim:'18/09/2026 12:05',resultado:'OK',status:'Finalizado',usuario_id:'joao.silva',filial_id:'CDD'},
  {romaneio:'ROM-788',destino:'Rio Casca',motorista:'Bruno Costa',placa:'HLM-7412',peso:'6.800 kg',volumes:'29',inicio:'18/09/2026 12:35',fim:'18/09/2026 14:00',resultado:'NÃO OK',status:'Finalizado',usuario_id:'joao.silva',filial_id:'CDD'}
 ],
 atividades:[
  {hora:'18/09/2026 08:15',tipo:'Separação',descricao_original:'Início da separação • LT-1025 • Ponte Nova',status:'Em andamento',usuario_id:'joao.silva',filial_id:'CDD'},
  {hora:'18/09/2026 09:02',tipo:'Separação',descricao_original:'Separação finalizada • LT-1025',status:'Finalizada',usuario_id:'joao.silva',filial_id:'CDD'},
  {hora:'18/09/2026 12:15',tipo:'Conferência',descricao_original:'Conferência • PED-4612 • 3 volumes divergentes',status:'NÃO OK',usuario_id:'joao.silva',filial_id:'CDD'}
 ],
 conferencias:[
  {operacao:'Separação',referencia:'PED-4587',hora:'18/09/2026 09:10',resultado:'OK',ocorrencia:'—',quantidade_divergente:'—',observacao:'Carga conforme',usuario_id:'joao.silva',filial_id:'CDD'},
  {operacao:'Conferência',referencia:'PED-4612',hora:'18/09/2026 12:15',resultado:'NÃO OK',ocorrencia:'3 volumes',quantidade_divergente:'3',observacao:'Volumes faltantes',usuario_id:'joao.silva',filial_id:'CDD'}
 ]
};

function clone(o){return JSON.parse(JSON.stringify(o));}
function loadData(){
 try{
  const x=JSON.parse(localStorage.getItem(STORAGE_DATA)||'null');
  if(x&&typeof x==='object'){
   return {separacoes:Array.isArray(x.separacoes)?x.separacoes:clone(demo.separacoes),carregamentos:Array.isArray(x.carregamentos)?x.carregamentos:clone(demo.carregamentos),atividades:Array.isArray(x.atividades)?x.atividades:clone(demo.atividades),conferencias:Array.isArray(x.conferencias)?x.conferencias:clone(demo.conferencias)};
  }
 }catch(e){}
 const d=clone(demo);try{localStorage.setItem(STORAGE_DATA,JSON.stringify(d));}catch(e){}return d;
}
let portalData=loadData();

function saveData(){try{localStorage.setItem(STORAGE_DATA,JSON.stringify(portalData));}catch(e){}}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];});}
function norm(v){return String(v==null?'':v).trim().toLowerCase();}
function isAdmin(){return !!state.user&&/autor|administrador/i.test(state.user.role||'');}
function sameUser(o){
 if(isAdmin())return true;
 const ids=[o.usuario_id,o.user_id,o.usuario,o.operador_id,o.operador,o.conferente_id,o.conferente].filter(Boolean).map(norm);
 const u=[state.user.id,state.user.usuario,state.user.username,state.user.name].filter(Boolean).map(norm);
 return ids.length>0&&ids.some(function(x){return u.indexOf(x)>=0;});
}
function sameBranch(o){return isAdmin()||String(o.filial_id||o.filial||o.cd||'CDD')===String(state.user.cd||'CDD');}
function rows(key){return (portalData[key]||[]).filter(function(o){return sameUser(o)&&sameBranch(o);});}
function resultClass(v){const x=norm(v);if(x==='ok'||x==='finalizada'||x==='finalizado')return'ok';if(x==='não ok'||x==='nao ok')return'bad';return'pending';}
function badge(v){return '<span class="badge '+resultClass(v)+'">'+esc(v||'PENDENTE')+'</span>';}
function toast(v){const e=document.querySelector('#toast');if(!e)return;e.textContent=v;e.classList.add('show');setTimeout(function(){e.classList.remove('show');},2200);}
window.showToast=toast;

const accounts=[
 {id:'01022005',name:'Marco',password:'01022005',role:'Autor / Administrador',cd:'CDD',permissions:{separacoes:true,carregamentos:true,atividades:true,desempenho:true,conferencias:true,admin:true}},
 {id:'maximo',name:'Maximo',password:'1234',role:'Administrador',cd:'CDD',permissions:{separacoes:true,carregamentos:true,atividades:true,desempenho:true,conferencias:true,admin:true}},
 {id:'joao.silva',name:'João Silva',password:'1234',role:'Operador',cd:'CDD',permissions:{separacoes:true,carregamentos:true,atividades:true,desempenho:true,conferencias:false,admin:false}}
];
function accountList(){
 try{
  const raw=JSON.parse(localStorage.getItem(ACCOUNT_STORE)||'null');
  if(Array.isArray(raw)&&raw.length)return accounts.concat(raw).filter(function(x,i,a){return a.findIndex(function(y){return norm(y.id)===norm(x.id);})===i;});
 }catch(e){}
 return accounts;
}

function applyUser(u){
 state.user={id:u.id,usuario:u.id,username:u.id,name:u.name,role:u.role,cd:u.cd||'CDD',filial_id:u.cd||'CDD',avatar:u.name.split(/\s+/).map(function(x){return x[0];}).join('').slice(0,2).toUpperCase()};
 state.permissions={separacoes:false,carregamentos:false,atividades:false,desempenho:false,conferencias:false,admin:false};
 Object.assign(state.permissions,u.permissions||{});
 if(/autor|administrador/i.test(state.user.role))Object.keys(state.permissions).forEach(function(k){state.permissions[k]=true;});
 try{localStorage.setItem(STORAGE_USER,JSON.stringify(state.user));}catch(e){}
 render();
}

window.login=function(){
 const msg=document.querySelector('#loginmsg');
 const id=norm(document.querySelector('#u')&&document.querySelector('#u').value);
 const pw=(document.querySelector('#pw')&&document.querySelector('#pw').value)||'';
 if(!id||!pw){if(msg)msg.textContent='Informe usuário e senha.';return false;}
 const u=accountList().find(function(x){return norm(x.id)===id||norm(x.name)===id;});
 if(!u||String(u.password)!==String(pw)){if(msg)msg.textContent='Usuário ou senha inválidos.';return false;}
 if(msg)msg.textContent='';
 applyUser(u);
 return false;
};

window.restoreSession=function(){
 try{
  const s=JSON.parse(localStorage.getItem(STORAGE_USER)||'null');
  if(!s||!s.id)return false;
  const u=accountList().find(function(x){return norm(x.id)===norm(s.id);});
  if(!u)return false;
  applyUser(u);return true;
 }catch(e){return false;}
};

function logout(){state.user=null;state.page='home';try{localStorage.removeItem(STORAGE_USER);}catch(e){}closeMobileMenu();document.querySelector('#app').classList.add('hide');document.querySelector('#login').classList.remove('hide');const m=document.querySelector('#loginmsg');if(m)m.textContent='';const u=document.querySelector('#u');if(u)u.focus();}
window.logout=logout;

function nav(){
 const adminAccess=isAdmin();
 const items=[['home','⌂','Início',true],['separacoes','▣','Minhas Separações',state.permissions.separacoes],['carregamentos','▰','Meus Carregamentos',state.permissions.carregamentos],['conferencias','✓','Minhas Conferências',state.permissions.conferencias],['atividades','◷','Minhas Atividades',state.permissions.atividades],['desempenho','▥','Meu Desempenho',state.permissions.desempenho],['perfil','●','Perfil / Acesso',true],['admin','⚙','Administrador',adminAccess],['logout','↪','Sair',true]];
 const el=document.querySelector('#nav');if(!el)return;
 el.innerHTML=items.filter(function(x){return x[3];}).map(function(x){return '<button class="nav-item '+(state.page===x[0]?'active':'')+'" data-page="'+x[0]+'"><span class="nav-icon">'+x[1]+'</span>'+x[2]+'</button>';}).join('');
 el.querySelectorAll('.nav-item').forEach(function(b){b.onclick=function(){const p=b.dataset.page;if(p==='logout')return logout();if(!state.permissions[p]&&p!=='home'&&p!=='perfil'&&p!=='admin'){toast('Acesso não permitido.');return;}state.page=p;closeMobileMenu();render();};});
}

function updateUI(){
 const n=state.user.name||'Usuário',ini=state.user.avatar||'US';
 ['sideInitials','headerInitials'].forEach(function(id){const e=document.getElementById(id);if(e)e.textContent=ini;});
 const a=[['sideName',n],['sideRole',state.user.role],['headerName',n],['headerRole',state.user.role],['headerBranch',state.user.cd||'CDD'],['headerWho',state.user.cd||'CDD']];
 a.forEach(function(x){const e=document.getElementById(x[0]);if(e)e.textContent=x[1];});
}

function tablePage(title,sub,heads,body){
 return '<div class="page-title"><div><h1>'+esc(title)+'</h1><p>'+esc(sub)+'</p></div><div class="page-actions"><button class="btn secondary" onclick="exportCurrentCSV()">⇩ CSV</button><button class="btn secondary" onclick="printCurrent()">🖨 Imprimir</button></div></div><div class="panel"><div class="filters"><input id="searchFilter" placeholder="Pesquisar por lote, pedido, placa, destino..." oninput="filterRows(this.value)"><select id="statusFilter" onchange="applyFilters()"><option>Todos os status</option><option>Finalizada</option><option>Finalizado</option><option>Em andamento</option><option>OK</option><option>NÃO OK</option><option>Pendente</option></select></div><div class="table-wrap"><table class="table"><thead><tr>'+heads.map(function(h){return '<th>'+esc(h)+'</th>';}).join('')+'</tr></thead><tbody id="dataRows">'+(body||'<tr><td colspan="20" class="empty">Nenhum registro encontrado.</td></tr>')+'</tbody></table></div></div>';
}
function dt(v){if(!v)return'—';return esc(String(v));}
function sepPage(){
 const d=rows('separacoes');
 const body=d.map(function(r){return '<tr><td>'+esc(r.lote)+'</td><td>'+esc(r.pedido)+'</td><td>'+esc(r.destino)+'</td><td>'+esc(r.peso)+'</td><td>'+esc(r.volumes)+'</td><td>'+dt(r.inicio)+'</td><td>'+dt(r.fim)+'</td><td>'+badge(r.status)+'</td><td>'+badge(r.resultado)+'</td></tr>';}).join('');
 return tablePage('Minhas Separações','Acompanhe o status e o resultado de cada separação.',['Lote','Pedido','Destino','Peso','Volumes','Início — Data / Hora','Fim — Data / Hora','Status','Resultado'],body);
}
function carPage(){
 const d=rows('carregamentos');
 const body=d.map(function(r){return '<tr><td>'+esc(r.romaneio)+'</td><td>'+esc(r.destino)+'</td><td>'+esc(r.motorista)+'</td><td>'+esc(r.placa)+'</td><td>'+esc(r.peso)+'</td><td>'+esc(r.volumes)+'</td><td>'+dt(r.inicio)+'</td><td>'+dt(r.fim)+'</td><td>'+badge(r.resultado||r.status)+'</td></tr>';}).join('');
 return tablePage('Meus Carregamentos','Registros vinculados ao seu usuário.',['Romaneio','Destino','Motorista','Placa','Peso','Volumes','Início — Data / Hora','Fim — Data / Hora','Resultado'],body);
}
function actPage(){
 const d=rows('atividades');
 const body=d.map(function(r){return '<tr><td>'+dt(r.hora||r.inicio)+'</td><td>'+esc(r.tipo)+'</td><td>'+esc(r.descricao_original||r.descricao)+'</td><td>'+badge(r.status)+'</td></tr>';}).join('');
 return tablePage('Minhas Atividades','Histórico das atividades realizadas.',['Data / Hora','Tipo','Descrição','Status'],body);
}
function confPage(){
 const d=rows('conferencias');
 const body=d.map(function(r){return '<tr><td>'+esc(r.operacao)+'</td><td>'+esc(r.referencia)+'</td><td>'+dt(r.hora||r.inicio)+'</td><td>'+badge(r.resultado)+'</td><td>'+esc(r.ocorrencia||'—')+'</td><td>'+esc(r.quantidade_divergente||'—')+'</td><td>'+esc(r.observacao||'—')+'</td></tr>';}).join('');
 return tablePage('Minhas Conferências','Resultados das conferências.',['Operação','Lote/Pedido','Data / Hora','Resultado','Divergência','Qtd. divergente','Observação'],body);
}
function home(){
 const s=rows('separacoes'),c=rows('carregamentos'),f=rows('conferencias'),a=rows('atividades');
 const ok=f.filter(function(x){return norm(x.resultado)==='ok';}).length+c.filter(function(x){return norm(x.resultado)==='ok';}).length;
 const bad=f.filter(function(x){return /não ok|nao ok/i.test(x.resultado||'');}).length+c.filter(function(x){return /não ok|nao ok/i.test(x.resultado||'');}).length;
 const total=ok+bad,rate=total?Math.round(ok/total*100):0;
 const recent=a.slice(-6).reverse();
 return '<div class="hero"><div><div class="eyebrow">Painel operacional • '+esc(state.user.cd||'CDD')+'</div><h1>Olá, '+esc(state.user.name.split(' ')[0])+' 👋</h1><p>Acompanhe suas operações, resultados e atividades em um só lugar.</p></div><div class="hero-actions"><button class="btn secondary" onclick="refreshDashboard()">↻ Atualizar</button></div></div>'+
 '<div class="operational-strip"><div><span>STATUS DA SESSÃO</span><b class="oktext">● Online</b></div><div><span>CONFORMIDADE</span><b>'+rate+'%</b></div><div><span>OPERAÇÕES</span><b>'+(s.length+c.length)+'</b></div><div><span>OCORRÊNCIAS</span><b class="'+(bad?'badtext':'')+'">'+bad+'</b></div></div>'+
 '<div class="cards"><div class="stat blue clickable" onclick="goPage(\'separacoes\')"><div class="stat-top"><span>SEPARAÇÕES</span><span class="stat-icon">▣</span></div><strong>'+s.length+'</strong><small>Ver registros →</small></div>'+
 '<div class="stat green clickable" onclick="goPage(\'carregamentos\')"><div class="stat-top"><span>CARREGAMENTOS</span><span class="stat-icon">▰</span></div><strong>'+c.length+'</strong><small>Ver registros →</small></div>'+
 '<div class="stat purple clickable" onclick="goPage(\'conferencias\')"><div class="stat-top"><span>CONFERÊNCIAS</span><span class="stat-icon">✓</span></div><strong>'+f.length+'</strong><small>Ver resultados →</small></div>'+
 '<div class="stat dark clickable" onclick="goPage(\'atividades\')"><div class="stat-top"><span>ATIVIDADES</span><span class="stat-icon">☷</span></div><strong>'+a.length+'</strong><small>Ver histórico →</small></div></div>'+
 '<div class="grid2"><div class="panel"><div class="panel-title"><div><h3>📋 Atividades recentes</h3><div class="sub">Últimos registros vinculados ao seu acesso</div></div><button class="btn secondary" onclick="goPage(\'atividades\')">Ver tudo</button></div><div class="timeline">'+(recent.length?recent.map(function(e){return '<div class="event"><span class="dot"></span><div><b>'+dt(e.hora)+' • '+esc(e.tipo)+'</b><small>'+esc(e.descricao_original||'')+'</small></div>'+badge(e.status)+'</div>';}).join(''):'<div class="empty">Nenhuma atividade recente.</div>')+'</div></div>'+
 '<div class="panel"><div class="panel-title"><div><h3>📊 Resumo operacional</h3><div class="sub">Indicadores da sua sessão</div></div></div><div class="bar-row"><label>Conformidade</label><div class="bar"><div class="fill green" style="width:'+rate+'%"></div></div><strong>'+rate+'%</strong></div><div class="bar-row"><label>Operações OK</label><div class="bar"><div class="fill" style="width:'+(total?Math.round(ok/total*100):0)+'%"></div></div><strong>'+ok+'</strong></div><div class="bar-row"><label>Ocorrências</label><div class="bar"><div class="fill red" style="width:'+(total?Math.min(100,Math.round(bad/Math.max(total,1)*100)):0)+'%"></div></div><strong>'+bad+'</strong></div><div class="performance-note"><span>Atualização:</span><b>agora</b></div></div></div>';
}
function refreshDashboard(){render();toast('Painel atualizado.');}
function goPage(p){if(!state.permissions[p]&&p!=='home'&&p!=='perfil'&&p!=='admin'){toast('Acesso não permitido.');return;}state.page=p;closeMobileMenu();render();}
function closeMobileMenu(){const a=document.querySelector('aside');if(a)a.classList.remove('open');const o=document.querySelector('#menuOverlay');if(o)o.classList.remove('show');}
window.refreshDashboard=refreshDashboard;window.goPage=goPage;window.closeMobileMenu=closeMobileMenu;

function csvEscape(v){return '"'+String(v==null?'':v).replace(/"/g,'""')+'"';}
function exportCurrentCSV(){
 const table=document.querySelector('.table'); if(!table){toast('Abra uma tabela para exportar.');return;}
 const lines=[...table.querySelectorAll('tr')].map(function(tr){return [...tr.children].map(function(c){return csvEscape(c.innerText);}).join(';');});
 const blob=new Blob(['\\ufeff'+lines.join('\\n')],{type:'text/csv;charset=utf-8'});
 const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='siga-'+state.page+'-'+new Date().toISOString().slice(0,10)+'.csv';a.click();setTimeout(function(){URL.revokeObjectURL(a.href);},1000);
}
function printCurrent(){window.print();}
window.exportCurrentCSV=exportCurrentCSV;window.printCurrent=printCurrent;

function details(){const all=[...rows('separacoes').map(x=>Object.assign({_tipo:'Separação'},x)),...rows('carregamentos').map(x=>Object.assign({_tipo:'Carregamento'},x)),...rows('conferencias').map(x=>Object.assign({_tipo:'Conferência'},x))];return '<div class="page-title"><div><h1>Detalhes das Operações</h1><p>Visão consolidada dos registros da sua sessão.</p></div><div class="page-actions"><button class="btn secondary" onclick="exportCurrentCSV()">⇩ CSV</button><button class="btn secondary" onclick="printCurrent()">🖨 Imprimir</button></div></div><div class="panel"><div class="detail-grid">'+(all.length?all.map(function(r){return '<div class="detail-card"><div><span class="detail-type">'+esc(r._tipo)+'</span>'+badge(r.resultado||r.status)+'</div><h3>'+esc(r.lote||r.romaneio||r.referencia||'Operação')+'</h3><p><b>Destino:</b> '+esc(r.destino||'—')+' &nbsp; <b>Data:</b> '+dt(r.hora||r.inicio)+'</p><p><b>Peso:</b> '+esc(r.peso||'—')+' &nbsp; <b>Volumes:</b> '+esc(r.volumes||r.quantidade_divergente||'—')+'</p><small>'+esc(r.observacao||r.ocorrencia||'Sem observações.')+'</small></div>';}).join(''):'<div class="empty">Nenhuma operação encontrada.</div>')+'</div></div>';}
function occurrences(){const list=[...rows('conferencias').filter(x=>/não ok|nao ok/i.test(x.resultado||'')),...rows('carregamentos').filter(x=>/não ok|nao ok/i.test(x.resultado||'')),...rows('separacoes').filter(x=>/não ok|nao ok/i.test(x.resultado||''))];return '<div class="page-title"><div><h1>Ocorrências</h1><p>Registros com divergências ou resultado NÃO OK.</p></div></div><div class="panel"><div class="occ-list">'+(list.length?list.map(function(r){return '<div class="occ-card"><div class="occ-icon">⚠</div><div><b>'+esc(r.referencia||r.lote||r.romaneio||'Ocorrência')+'</b><small>'+esc(r.ocorrencia||'Resultado NÃO OK')+'</small><small>'+esc(r.observacao||'Verifique os detalhes da operação.')+'</small></div>'+badge('NÃO OK')+'</div>';}).join(''):'<div class="empty">Nenhuma ocorrência encontrada.</div>')+'</div></div>';}
function reports(){const s=rows('separacoes'),c=rows('carregamentos'),f=rows('conferencias'),a=rows('atividades');const ok=c.filter(x=>norm(x.resultado)==='ok').length+f.filter(x=>norm(x.resultado)==='ok').length;const bad=c.filter(x=>/não ok|nao ok/i.test(x.resultado||'')).length+f.filter(x=>/não ok|nao ok/i.test(x.resultado||'')).length;const total=ok+bad;return '<div class="page-title"><div><h1>Relatórios e Indicadores</h1><p>Resumo operacional baseado nos dados carregados no sistema.</p></div><div class="page-actions"><button class="btn secondary" onclick="printCurrent()">🖨 Imprimir</button></div></div><div class="report-kpis"><div><span>Separações</span><b>'+s.length+'</b></div><div><span>Carregamentos</span><b>'+c.length+'</b></div><div><span>Conferências</span><b>'+f.length+'</b></div><div><span>Conformidade</span><b>'+(total?Math.round(ok/total*100):0)+'%</b></div></div><div class="report-grid"><div class="panel"><h3>Operações por módulo</h3><div class="report-bars"><div><span>Separações</span><i><em style="width:'+Math.min(100,s.length*20)+'%"></em></i><b>'+s.length+'</b></div><div><span>Carregamentos</span><i><em style="width:'+Math.min(100,c.length*20)+'%"></em></i><b>'+c.length+'</b></div><div><span>Conferências</span><i><em style="width:'+Math.min(100,f.length*20)+'%"></em></i><b>'+f.length+'</b></div><div><span>Atividades</span><i><em style="width:'+Math.min(100,a.length*20)+'%"></em></i><b>'+a.length+'</b></div></div></div><div class="panel"><h3>Resultados</h3><div class="result-summary"><strong class="oktext">'+ok+'</strong><span>OK</span><strong class="badtext">'+bad+'</strong><span>NÃO OK</span></div></div></div></div>';}
function perf(){
 const s=rows('separacoes'),c=rows('carregamentos'),f=rows('conferencias');
 const ok=f.filter(function(x){return norm(x.resultado)==='ok';}).length+c.filter(function(x){return norm(x.resultado)==='ok';}).length;
 const bad=f.filter(function(x){return norm(x.resultado).indexOf('não ok')>=0||norm(x.resultado).indexOf('nao ok')>=0;}).length+c.filter(function(x){return norm(x.resultado).indexOf('não ok')>=0||norm(x.resultado).indexOf('nao ok')>=0;}).length;
 const total=ok+bad;
 return '<div class="page-title"><h1>Meu Desempenho</h1><p>Indicadores operacionais do usuário.</p></div><div class="performance-kpis"><div class="perf-kpi"><span>Taxa de conformidade</span><strong>'+(total?Math.round(ok/total*100):0)+'%</strong><small>'+ok+' OK de '+total+'</small></div><div class="perf-kpi"><span>Total de operações</span><strong>'+(s.length+c.length+f.length)+'</strong></div><div class="perf-kpi"><span>Atividades</span><strong>'+rows('atividades').length+'</strong></div><div class="perf-kpi"><span>NÃO OK</span><strong>'+bad+'</strong></div></div>';
}
function profile(){return '<div class="page-title"><h1>Perfil / Acesso</h1><p>Dados da sua sessão atual.</p></div><div class="panel"><div class="user-row"><div class="avatar">'+esc(state.user.avatar)+'</div><div><b>'+esc(state.user.name)+'</b><small>'+esc(state.user.role)+' • Filial '+esc(state.user.cd)+'</small></div></div></div>';}
const PERMISSION_DEFS=[['separacoes','Separação'],['carregamentos','Carregamento'],['conferencias','Conferência'],['atividades','Atividades'],['desempenho','Desempenho'],['detalhes','Detalhes'],['ocorrencias','Ocorrências'],['relatorios','Relatórios'],['perfil','Perfil / Acesso']];
function accountList(){
 try{
  const raw=JSON.parse(localStorage.getItem(ACCOUNT_STORE)||'null'),map={};
  accounts.forEach(function(x){map[norm(x.id)]=Object.assign({},x,{permissions:Object.assign({},x.permissions||{})});});
  if(Array.isArray(raw))raw.forEach(function(x){if(x&&x.id){const k=norm(x.id);map[k]=Object.assign({},map[k]||{},x,{permissions:Object.assign({},map[k]&&map[k].permissions||{},x.permissions||{})});}});
  return Object.keys(map).map(function(k){return map[k];});
 }catch(e){return accounts.slice();}
}
function saveAccounts(list){try{localStorage.setItem(ACCOUNT_STORE,JSON.stringify(list));return true;}catch(e){return false;}}
function admin(){
 if(!isAdmin())return '<div class="panel"><h3>Acesso restrito</h3></div>';
 const list=accountList();
 const summary=reports();
 const occ=occurrences();
 const det=details();
 return '<div class="page-title"><div><h1>Administrador</h1><p>Gestão completa do sistema: usuários, detalhes, ocorrências e relatórios.</p></div><div class="page-actions"><button class="btn" onclick="newUserForm()">＋ Novo usuário</button></div></div><div class="panel"><div class="panel-title"><div><h3>Usuários cadastrados</h3><div class="sub">'+list.length+' contas • acesso administrativo completo</div></div></div><div class="user-list">'+list.map(function(u){const pc=PERMISSION_DEFS.length+1;return '<div class="user-row"><div class="avatar">'+esc((u.name||'US').slice(0,2).toUpperCase())+'</div><div><b>'+esc(u.name||u.id)+'</b><small>'+esc(u.id)+' • '+esc(u.role||'Operador')+' • '+esc(u.cd||'CDD')+'</small><small>'+pc+' permissões disponíveis</small></div><div style="display:flex;gap:6px"><button class="btn secondary" onclick="editUser(\''+esc(u.id)+'\')">Editar</button><button class="btn danger" onclick="deleteUser(\''+esc(u.id)+'\')">Excluir</button></div></div>';}).join('')+'</div></div><div class="admin-section">'+det+occ+summary+'</div>';
}
window.newUserForm=function(user){
 if(!isAdmin())return;
 user=user||{id:'',name:'',password:'',role:'Operador',cd:'CDD',permissions:{}};
 const checks=PERMISSION_DEFS.map(function(p){return '<label class="permission-item"><input type="checkbox" name="perm" value="'+p[0]+'" '+(user.permissions&&user.permissions[p[0]]?'checked':'')+'>'+p[1]+'</label>';}).join('');
 const adm=user.permissions&&user.permissions.admin?'checked':'';
 const edit=!!user.id;
 document.querySelector('#main').innerHTML='<div class="page-title"><div><h1>'+ (edit?'Editar usuário':'Novo usuário') +'</h1><p>Configure os dados e as permissões.</p></div></div><div class="panel admin-form"><div class="form-grid"><label>Usuário<input id="admId" value="'+esc(user.id)+'" '+(edit?'readonly':'')+'></label><label>Nome completo<input id="admName" value="'+esc(user.name)+'"></label><label>Senha<input id="admPass" type="password" value="'+esc(user.password||'')+'"></label><label>Perfil<select id="admRole"><option>Operador</option><option>Conferente</option><option>Supervisor</option><option>Administrador</option><option>Autor / Administrador</option></select></label><label>Filial / CD<input id="admCd" value="'+esc(user.cd||'CDD')+'"></label></div><h3 style="margin-top:22px">Permissões</h3><div class="permission-grid">'+checks+'<label class="permission-item admin-permission"><input id="permAdmin" type="checkbox" '+adm+'>Administrador / Gestão de Usuários</label></div><div class="form-actions"><button class="btn" onclick="saveUserAccount()">Salvar usuário</button><button class="btn secondary" onclick="state.page=\'admin\';render()">Cancelar</button></div></div>';
 document.querySelector('#admRole').value=user.role||'Operador';
};
window.editUser=function(id){const u=accountList().find(function(x){return norm(x.id)===norm(id);});if(u)newUserForm(u);};
window.saveUserAccount=function(){
 if(!isAdmin())return;
 const id=(document.querySelector('#admId')||{}).value||'',name=(document.querySelector('#admName')||{}).value||'',pass=(document.querySelector('#admPass')||{}).value||'',role=(document.querySelector('#admRole')||{}).value||'Operador',cd=(document.querySelector('#admCd')||{}).value||'CDD';
 if(!norm(id)||!norm(name)||!pass){toast('Preencha usuário, nome e senha.');return;}
 const permissions={};document.querySelectorAll('input[name="perm"]:checked').forEach(function(e){permissions[e.value]=true;});permissions.admin=!!((document.querySelector('#permAdmin')||{}).checked);
 const list=accountList(),idx=list.findIndex(function(x){return norm(x.id)===norm(id);}),obj={id:id.trim(),name:name.trim(),password:pass,role:role,cd:cd.trim()||'CDD',permissions:permissions};
 if(idx>=0)list[idx]=obj;else{if(list.some(function(x){return norm(x.id)===norm(id);}))return toast('Usuário já cadastrado.');list.push(obj);}
 if(saveAccounts(list)){state.page='admin';render();toast('Usuário salvo com sucesso.');}else toast('Falha ao salvar.');
};
window.deleteUser=function(id){
 if(!isAdmin())return;
 if(norm(id)===norm(state.user.id)){toast('Não é permitido excluir o usuário conectado.');return;}
 if(!confirm('Excluir o usuário '+id+'?'))return;
 const list=accountList().filter(function(x){return norm(x.id)!==norm(id);});
 if(saveAccounts(list)){render();toast('Usuário excluído.');}
};
function render(){
 if(!state.user)return;
 document.querySelector('#login').classList.add('hide');
 document.querySelector('#app').classList.remove('hide');
 updateUI();nav();
 const pages={home:home,separacoes:sepPage,carregamentos:carPage,atividades:actPage,conferencias:confPage,desempenho:perf,perfil:profile,admin:admin,relatorios:reports,ocorrencias:occurrences,detalhes:details};
 const main=document.querySelector('#main');if(main)main.innerHTML=(pages[state.page]||home)();
}
window.render=render;
window.filterRows=function(v){const q=norm(v);document.querySelectorAll('#dataRows tr').forEach(function(r){r.style.display=!q||norm(r.innerText).indexOf(q)>=0?'':'none';});};
window.applyFilters=function(){const q=norm((document.querySelector('#searchFilter')||{}).value||'');const st=norm((document.querySelector('#statusFilter')||{}).value||'');document.querySelectorAll('#dataRows tr').forEach(function(r){const t=norm(r.innerText);const okq=!q||t.indexOf(q)>=0;const oks=!st||st.indexOf('todos')===0||t.indexOf(st)>=0;r.style.display=okq&&oks?'':'none';});};

function clock(){const e=document.querySelector('#headerClock');if(e)e.textContent=new Date().toLocaleString('pt-BR',{hour:'2-digit',minute:'2-digit',second:'2-digit',day:'2-digit',month:'2-digit',year:'numeric'});}
document.addEventListener('click',function(e){const a=document.querySelector('aside');const o=document.querySelector('#menuOverlay');if(o&&e.target===o)closeMobileMenu();if(a&&window.innerWidth<=980&&a.classList.contains('open')&&!a.contains(e.target)&&!e.target.closest('.hamb'))closeMobileMenu();});
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeMobileMenu();});
document.addEventListener('DOMContentLoaded',function(){
 const btn=document.querySelector('#loginBtn');
 if(btn)btn.onclick=function(e){e.preventDefault();window.login();};
 const pw=document.querySelector('#pw');
 if(pw)pw.onkeydown=function(e){if(e.key==='Enter'){e.preventDefault();window.login();}};
 setInterval(clock,1000);clock();
 if(!window.restoreSession()){
  document.querySelector('#login').classList.remove('hide');
  document.querySelector('#app').classList.add('hide');
 }
});

})();