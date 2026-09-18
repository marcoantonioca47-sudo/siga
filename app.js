const STORAGE_USER='siga30_portal_user_v2';
const STORAGE_DATA='siga30_portal_data_v2';
const STORAGE_API='siga30_portal_api_v1';

const state={
  user:null,
  permissions:{separacoes:true,carregamentos:true,atividades:true,desempenho:true,conferencias:false,admin:false},
  page:'home',
  lastSync:null,
  syncing:false
};

const sampleSeps=[
 {lote:'LT-1025',pedido:'PED-4587',destino:'Ponte Nova',peso:'860 kg',volumes:'42',inicio:'08:15',fim:'09:02',status:'Finalizada',resultado:'OK',usuario_id:'joao.silva'},
 {lote:'LT-1038',pedido:'PED-4621',destino:'Viçosa',peso:'620 kg',volumes:'31',inicio:'10:20',fim:'11:10',status:'Em andamento',resultado:'',usuario_id:'joao.silva'},
 {lote:'LT-1029',pedido:'PED-4601',destino:'Ubá',peso:'740 kg',volumes:'38',inicio:'11:45',fim:'12:30',status:'Finalizada',resultado:'OK',usuario_id:'joao.silva'},
 {lote:'LT-1030',pedido:'PED-4590',destino:'Rio Casca',peso:'510 kg',volumes:'25',inicio:'13:12',fim:'14:05',status:'Finalizada',resultado:'OK',usuario_id:'joao.silva'},
 {lote:'LT-1018',pedido:'PED-4560',destino:'Mariana',peso:'380 kg',volumes:'18',inicio:'15:20',fim:'16:10',status:'Pendente',resultado:'',usuario_id:'joao.silva'}
];
const sampleCars=[
 {romaneio:'ROM-783',destino:'Ponte Nova',motorista:'João Silva',placa:'OFA-4452',peso:'12.500 kg',volumes:'48',inicio:'10:20',fim:'12:05',resultado:'OK',status:'Finalizado',usuario_id:'joao.silva'},
 {romaneio:'ROM-782',destino:'Ubá',motorista:'Carlos Lima',placa:'OQP-9621',peso:'8.600 kg',volumes:'36',inicio:'11:20',fim:'12:06',resultado:'OK',status:'Finalizado',usuario_id:'joao.silva'},
 {romaneio:'ROM-781',destino:'Rio Casca',motorista:'Pedro Alves',placa:'HKG-7810',peso:'7.400 kg',volumes:'28',inicio:'09:10',fim:'11:00',resultado:'NÃO OK',status:'Finalizado',usuario_id:'joao.silva'},
 {romaneio:'ROM-780',destino:'Mariana',motorista:'Rafael Souza',placa:'KBS-2055',peso:'5.400 kg',volumes:'20',inicio:'08:10',fim:'09:50',resultado:'OK',status:'Finalizado',usuario_id:'joao.silva'}
];
const sampleActs=[
 {hora:'08:15',tipo:'Separação',descricao_original:'Início da separação • LT-1025 • Ponte Nova',status:'Em andamento',usuario_id:'joao.silva'},
 {hora:'09:02',tipo:'Separação',descricao_original:'Separação finalizada • LT-1025',status:'Finalizada',usuario_id:'joao.silva'},
 {hora:'09:10',tipo:'Conferência',descricao_original:'Conferência • PED-4587',status:'OK',usuario_id:'joao.silva'},
 {hora:'10:20',tipo:'Carregamento',descricao_original:'Início do carregamento • ROM-783 • Viçosa',status:'Em andamento',usuario_id:'joao.silva'},
 {hora:'11:05',tipo:'Carregamento',descricao_original:'Carregamento finalizado • ROM-783',status:'OK',usuario_id:'joao.silva'},
 {hora:'12:15',tipo:'Conferência',descricao_original:'Conferência • PED-4612 • 3 volumes divergentes',status:'NÃO OK',usuario_id:'joao.silva'},
 {hora:'13:30',tipo:'Carregamento',descricao_original:'Carregamento finalizado • ROM-785 • 2 volumes divergentes',status:'NÃO OK',usuario_id:'joao.silva'}
];
const sampleConfs=[
 {operacao:'Separação',referencia:'PED-4587',hora:'09:10',resultado:'OK',ocorrencia:'—',quantidade_divergente:'—',observacao:'—',usuario_id:'joao.silva'},
 {operacao:'Separação',referencia:'LT-1025',hora:'10:45',resultado:'OK',ocorrencia:'—',quantidade_divergente:'—',observacao:'—',usuario_id:'joao.silva'},
 {operacao:'Carregamento',referencia:'ROM-783',hora:'12:15',resultado:'OK',ocorrencia:'—',quantidade_divergente:'—',observacao:'—',usuario_id:'joao.silva'},
 {operacao:'Conferência',referencia:'PED-4612',hora:'12:15',resultado:'NÃO OK',ocorrencia:'3 volumes',quantidade_divergente:'3',observacao:'Volumes faltantes',usuario_id:'joao.silva'},
 {operacao:'Carregamento',referencia:'ROM-785',hora:'13:30',resultado:'NÃO OK',ocorrencia:'2 volumes',quantidade_divergente:'2',observacao:'Volumes a menos',usuario_id:'joao.silva'}
];
const users=[['JS','João Silva','Operador','Separação • Carregamento • Atividades'],['CS','Carlos Souza','Conferente','Conferência • Atividades'],['PA','Pedro Alves','Operador + Conferente','Todas as funções'],['RM','Rafael Mendes','Operador','Separação • Atividades']];

let portalData=loadData();
function loadData(){
 let data;
 try{const x=JSON.parse(localStorage.getItem(STORAGE_DATA)||'null');data={separacoes:Array.isArray(x?.separacoes)?x.separacoes:sampleSeps,carregamentos:Array.isArray(x?.carregamentos)?x.carregamentos:sampleCars,atividades:Array.isArray(x?.atividades)?x.atividades:sampleActs,conferencias:Array.isArray(x?.conferencias)?x.conferencias:sampleConfs};}
 catch{data={separacoes:sampleSeps,carregamentos:sampleCars,atividades:sampleActs,conferencias:sampleConfs};}
 return addDemoData(data);
}
function addDemoData(data){
 const key='siga30_demo_seed_v3';
 if(localStorage.getItem(key))return data;
 const seps=[
  {lote:'LT-1041',pedido:'PED-4678',destino:'Viçosa',peso:'690 kg',volumes:'34',inicio:'07:40',fim:'08:28',status:'Finalizada',resultado:'OK',usuario_id:'joao.silva',filial_id:'CDD'},
  {lote:'LT-1045',pedido:'PED-4682',destino:'Mariana',peso:'920 kg',volumes:'46',inicio:'09:05',fim:'10:02',status:'Finalizada',resultado:'OK',usuario_id:'joao.silva',filial_id:'CDD'},
  {lote:'LT-1048',pedido:'PED-4690',destino:'Rio Casca',peso:'540 kg',volumes:'27',inicio:'10:35',fim:'',status:'Em andamento',resultado:'',usuario_id:'joao.silva',filial_id:'CDD'},
  {lote:'LT-1050',pedido:'PED-4694',destino:'Ubá',peso:'780 kg',volumes:'39',inicio:'11:20',fim:'12:08',status:'Finalizada',resultado:'OK',usuario_id:'joao.silva',filial_id:'CDD'},
  {lote:'LT-1054',pedido:'PED-4701',destino:'Ponte Nova',peso:'430 kg',volumes:'21',inicio:'13:10',fim:'14:00',status:'Finalizada',resultado:'NÃO OK',usuario_id:'joao.silva',filial_id:'CDD'},
  {lote:'LT-1058',pedido:'PED-4708',destino:'Ouro Preto',peso:'610 kg',volumes:'30',inicio:'14:25',fim:'',status:'Pendente',resultado:'',usuario_id:'joao.silva',filial_id:'CDD'}
 ];
 const cars=[
  {romaneio:'ROM-786',destino:'Viçosa',motorista:'André Martins',placa:'QWE-3184',peso:'9.200 kg',volumes:'41',inicio:'08:40',fim:'10:15',resultado:'OK',status:'Finalizado',usuario_id:'joao.silva',filial_id:'CDD'},
  {romaneio:'ROM-787',destino:'Mariana',motorista:'Lucas Ferreira',placa:'RTA-5027',peso:'11.300 kg',volumes:'52',inicio:'10:30',fim:'12:10',resultado:'OK',status:'Finalizado',usuario_id:'joao.silva',filial_id:'CDD'},
  {romaneio:'ROM-788',destino:'Rio Casca',motorista:'Bruno Costa',placa:'HLM-7412',peso:'6.800 kg',volumes:'29',inicio:'12:35',fim:'14:00',resultado:'NÃO OK',status:'Finalizado',usuario_id:'joao.silva',filial_id:'CDD'},
  {romaneio:'ROM-789',destino:'Ubá',motorista:'Diego Souza',placa:'PXR-9041',peso:'8.100 kg',volumes:'35',inicio:'14:20',fim:'',resultado:'',status:'Em andamento',usuario_id:'joao.silva',filial_id:'CDD'},
  {romaneio:'ROM-790',destino:'Ponte Nova',motorista:'Marcelo Reis',placa:'QOP-6619',peso:'10.500 kg',volumes:'47',inicio:'15:10',fim:'',resultado:'',status:'Pendente',usuario_id:'joao.silva',filial_id:'CDD'}
 ];
 const acts=[
  {hora:'07:40',tipo:'Separação',descricao_original:'Início da separação • LT-1041 • Viçosa',status:'Em andamento',usuario_id:'joao.silva',filial_id:'CDD'},
  {hora:'08:28',tipo:'Separação',descricao_original:'Separação finalizada • LT-1041',status:'Finalizada',usuario_id:'joao.silva',filial_id:'CDD'},
  {hora:'08:35',tipo:'Conferência',descricao_original:'Conferência • PED-4678 • carga conferida',status:'OK',usuario_id:'joao.silva',filial_id:'CDD'},
  {hora:'09:05',tipo:'Separação',descricao_original:'Início da separação • LT-1045 • Mariana',status:'Em andamento',usuario_id:'joao.silva',filial_id:'CDD'},
  {hora:'10:02',tipo:'Separação',descricao_original:'Separação finalizada • LT-1045',status:'Finalizada',usuario_id:'joao.silva',filial_id:'CDD'},
  {hora:'10:18',tipo:'Carregamento',descricao_original:'Início do carregamento • ROM-786 • Viçosa',status:'Em andamento',usuario_id:'joao.silva',filial_id:'CDD'},
  {hora:'11:10',tipo:'Carregamento',descricao_original:'Carregamento finalizado • ROM-786',status:'OK',usuario_id:'joao.silva',filial_id:'CDD'},
  {hora:'13:10',tipo:'Separação',descricao_original:'Início da separação • LT-1054 • Ponte Nova',status:'Em andamento',usuario_id:'joao.silva',filial_id:'CDD'},
  {hora:'14:00',tipo:'Conferência',descricao_original:'Conferência • PED-4701 • 2 volumes divergentes',status:'NÃO OK',usuario_id:'joao.silva',filial_id:'CDD'},
  {hora:'14:20',tipo:'Carregamento',descricao_original:'Carregamento em andamento • ROM-789 • Ubá',status:'Em andamento',usuario_id:'joao.silva',filial_id:'CDD'}
 ];
 const confs=[
  {operacao:'Separação',referencia:'PED-4678',hora:'08:35',resultado:'OK',ocorrencia:'—',quantidade_divergente:'—',observacao:'Conferência concluída sem divergências',usuario_id:'joao.silva',filial_id:'CDD'},
  {operacao:'Separação',referencia:'PED-4682',hora:'10:15',resultado:'OK',ocorrencia:'—',quantidade_divergente:'—',observacao:'Carga conforme',usuario_id:'joao.silva',filial_id:'CDD'},
  {operacao:'Carregamento',referencia:'ROM-786',hora:'11:10',resultado:'OK',ocorrencia:'—',quantidade_divergente:'—',observacao:'Carregamento conforme',usuario_id:'joao.silva',filial_id:'CDD'},
  {operacao:'Separação',referencia:'PED-4701',hora:'14:00',resultado:'NÃO OK',ocorrencia:'2 volumes',quantidade_divergente:'2',observacao:'Volumes faltantes',usuario_id:'joao.silva',filial_id:'CDD'},
  {operacao:'Carregamento',referencia:'ROM-788',hora:'14:05',resultado:'NÃO OK',ocorrencia:'1 volume',quantidade_divergente:'1',observacao:'Divergência no carregamento',usuario_id:'joao.silva',filial_id:'CDD'}
 ];
 const merge=(base,extra,id)=>{const seen=new Set(base.map(x=>String(x[id]||'')));return base.concat(extra.filter(x=>!seen.has(String(x[id]||''))));};
 data.separacoes=merge(data.separacoes,seps,'lote');
 data.carregamentos=merge(data.carregamentos,cars,'romaneio');
 data.atividades=data.atividades.concat(acts);
 data.conferencias=data.conferencias.concat(confs);
 localStorage.setItem(STORAGE_DATA,JSON.stringify(data));
 localStorage.setItem(key,'1');
 return data;
}
function saveData(){localStorage.setItem(STORAGE_DATA,JSON.stringify(portalData));}
function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
function norm(v){return String(v??'').trim().toLowerCase();}
function sameUser(o){
 const u=state.user||{};
 if(isAuthor())return true;
 const ids=[o.usuario_id,o.user_id,o.operador_id,o.conferente_id,o.usuario,o.operador,o.conferente].filter(Boolean).map(norm);
 const names=[u.id,u.usuario,u.username,u.login,u.name,u.nome].filter(Boolean).map(norm);
 if(!ids.length)return false;
 return ids.some(id=>names.includes(id));
}
function resultClass(v){const x=norm(v);return x==='ok'||x==='finalizada'||x==='finalizado'?'ok':x.includes('não ok')||x.includes('nao ok')?'bad':'pending';}
function badge(t,c){return `<span class="badge ${c||resultClass(t)}">${esc(t)}</span>`;}
function bar(label,value,max,cls=''){const pct=max?Math.min(100,Math.round(value/max*100)):0;return `<div class="bar-row"><label>${esc(label)}</label><div class="bar"><div class="fill ${cls}" style="width:${pct}%"></div></div><strong>${value}</strong></div>`;}
function tablePage(title,sub,heads,rows){return `<div class="page-title"><h1>${esc(title)}</h1><p>${esc(sub)}</p></div><div class="panel"><div class="filters"><input placeholder="Pesquisar..." oninput="filterRows(this.value)"><select id="periodFilter"><option>Hoje</option><option>Últimos 7 dias</option><option value="month">Este mês</option></select><select id="statusFilter"><option>Todos os status</option><option>Finalizada</option><option>Em andamento</option><option>OK</option><option>NÃO OK</option></select><button class="btn" onclick="applyFilters()">Filtrar</button></div><div class="table-wrap"><table class="table"><thead><tr>${heads.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody id="dataRows">${rows||'<tr><td colspan="20" class="empty">Nenhum registro encontrado.</td></tr>'}</tbody></table></div></div>`;}
function userSeps(){return portalData.separacoes.filter(sameUser);}
function userCars(){return portalData.carregamentos.filter(sameUser);}
function userActs(){return portalData.atividades.filter(sameUser);}
function userConfs(){return portalData.conferencias.filter(sameUser);}

/* ===== FILIAIS / ISOLAMENTO DE ACESSO ===== */
const BRANCH_STORE='siga30_branches_v1';
const DEFAULT_BRANCHES=[{id:'CDD',nome:'CD Bela Vista',codigo:'CDD',cidade:'Ponte Nova',ativa:true}];
function branchList(){try{const a=JSON.parse(localStorage.getItem(BRANCH_STORE)||'null');if(Array.isArray(a)&&a.length)return a;}catch{}localStorage.setItem(BRANCH_STORE,JSON.stringify(DEFAULT_BRANCHES));return DEFAULT_BRANCHES;}
function saveBranches(a){localStorage.setItem(BRANCH_STORE,JSON.stringify(a));}
function isAuthor(){return /autor|administrador/i.test(String(state.user?.role||''));}
function recordBranch(o){return String(o?.filial_id||o?.filial||o?.cd||o?.unidade_id||o?.unidade||'CDD').trim()||'CDD';}
function sameBranch(o){return isAuthor()||recordBranch(o)===String(state.user?.cd||'CDD');}
function userSeps(){return portalData.separacoes.filter(o=>sameBranch(o)&&sameUser(o));}
function userCars(){return portalData.carregamentos.filter(o=>sameBranch(o)&&sameUser(o));}
function userActs(){return portalData.atividades.filter(o=>sameBranch(o)&&sameUser(o));}
function userConfs(){return portalData.conferencias.filter(o=>sameBranch(o)&&sameUser(o));}
function accessibleBranches(){return isAuthor()?branchList():branchList().filter(b=>String(b.id)===String(state.user?.cd||'CDD'));}
function branchPage(){const a=branchList();return '<div class="page-title"><h1>Cadastrar Filiais</h1><p>Somente o Autor pode cadastrar, editar e visualizar todas as filiais.</p></div><div class="admin-grid"><div class="panel"><h3>🏢 Nova filial</h3><form onsubmit="saveBranch(event)"><div class="user-form" style="margin-top:12px"><div class="field"><label>Código<input id="branchId" required placeholder="FILIAL01"></label></div><div class="field"><label>Nome da filial<input id="branchName" required placeholder="Filial Ponte Nova"></label></div><div class="field"><label>Cidade<input id="branchCity" placeholder="Ponte Nova"></label></div></div><button class="btn" style="margin-top:13px">Cadastrar filial</button></form></div><div class="panel"><div class="panel-title"><div><h3>Filiais cadastradas</h3><div class="sub">Usuários comuns enxergam somente a própria filial.</div></div></div><div class="user-list" style="margin-top:12px">'+a.map(b=>'<div class="user-row"><div class="avatar">CD</div><div><b>'+esc(b.nome||b.id)+'</b><small>'+esc(b.id)+' • '+esc(b.cidade||'')+'</small></div><span class="badge ok">'+(b.ativa===false?'Inativa':'Ativa')+'</span></div>').join('')+'</div></div></div>';}
function saveBranch(ev){ev.preventDefault();if(!isAuthor()){showToast('Somente o Autor pode cadastrar filiais.');return;}const id=norm(document.querySelector('#branchId')?.value).toUpperCase(),nome=document.querySelector('#branchName')?.value.trim(),cidade=document.querySelector('#branchCity')?.value.trim();if(!id||!nome){showToast('Informe código e nome da filial.');return;}const a=branchList();if(a.some(b=>String(b.id).toUpperCase()===id)){showToast('Código de filial já cadastrado.');return;}a.push({id,nome,cidade,ativa:true});saveBranches(a);showToast('Filial cadastrada com sucesso.');render();}
function totals(){const s=userSeps(),c=userCars(),f=userConfs(),a=userActs();return {s:s.length,c:c.length,f:f.length,a:a.length,fok:f.filter(x=>norm(x.resultado)==='ok').length,fbad:f.filter(x=>norm(x.resultado).includes('não ok')||norm(x.resultado).includes('nao ok')).length,cok:c.filter(x=>norm(x.resultado)==='ok').length,cbad:c.filter(x=>norm(x.resultado).includes('não ok')||norm(x.resultado).includes('nao ok')).length};}
function navItems(){return [['home','⌂','Início',true],['separacoes','▣','Minhas Separações',state.permissions.separacoes],['carregamentos','▰','Meus Carregamentos',state.permissions.carregamentos],['conferencias','✓','Minhas Conferências',state.permissions.conferencias],['atividades','◷','Minhas Atividades',state.permissions.atividades],['desempenho','▥','Meu Desempenho',state.permissions.desempenho],['perfil','●','Perfil / Acesso',true],['admin','⚙','Gestão de Usuários',state.permissions.admin],['logout','↪','Sair',true]];}
function renderNav(){const el=document.querySelector('#nav');if(!el)return;el.innerHTML=navItems().filter(x=>x[3]).map(x=>`<button class="nav-item ${state.page===x[0]?'active':''}" data-page="${x[0]}"><span class="nav-icon">${x[1]}</span>${esc(x[2])}</button>`).join('');el.querySelectorAll('.nav-item').forEach(b=>b.onclick=()=>{const p=b.dataset.page;if(p==='logout'){logout();return;}state.page=p;render();});}
function updateUserUI(){if(!state.user)return;const n=state.user.name||state.user.nome||'Usuário';const initials=(state.user.avatar||n.split(/\s+/).map(x=>x[0]).join('').slice(0,2)).toUpperCase();['sideInitials','headerInitials'].forEach(id=>{const e=document.getElementById(id);if(e)e.textContent=initials;});const sn=document.getElementById('sideName');if(sn)sn.textContent=n;const sr=document.getElementById('sideRole');if(sr)sr.textContent=state.user.role||'Operador';const hw=document.getElementById('headerWho');if(hw)hw.textContent=`${state.user.cd||'CDD'} · ${n}`;}
function render(){if(!state.user)return;document.querySelector('#login')?.classList.add('hide');document.querySelector('#app')?.classList.remove('hide');updateUserUI();renderNav();const pages={home,separacoes:separacoesPage,carregamentos:carregamentosPage,conferencias:conferenciasPage,atividades:atividadesPage,desempenho:desempenhoPage,perfil:perfilPage,admin:adminPage,filiais:branchPage};const main=document.querySelector('#main');if(main)main.innerHTML=(pages[state.page]||home)();closeMenu();}
function home(){const t=totals();const acts=userActs();return `<div class="hero"><div><div class="eyebrow">Painel do usuário</div><h1>Olá, ${esc((state.user.name||'Usuário').split(' ')[0])}!</h1><p>Aqui está o resumo das suas atividades de hoje.</p></div><button class="btn secondary" onclick="refreshData(true)">↻ Atualizar agora</button></div><div class="cards"><div class="stat blue"><div class="stat-top"><span>SEPARAÇÕES</span><span class="stat-icon">▣</span></div><strong>${t.s}</strong><small>Hoje</small></div><div class="stat green"><div class="stat-top"><span>CARREGAMENTOS</span><span class="stat-icon">▰</span></div><strong>${t.c}</strong><small>Hoje</small></div><div class="stat purple"><div class="stat-top"><span>CONFERÊNCIAS</span><span class="stat-icon">✓</span></div><strong>${t.f}</strong><small>Hoje</small></div><div class="stat dark"><div class="stat-top"><span>ATIVIDADES</span><span class="stat-icon">☷</span></div><strong>${t.a}</strong><small>Hoje</small></div></div><div class="grid2"><div class="panel"><div class="panel-title"><div><h3>📋 Atividades feitas hoje</h3><div class="sub">Registro individual do usuário</div></div><button class="btn secondary" onclick="state.page='atividades';render()">Ver todas →</button></div><div class="timeline">${acts.length?acts.map(e=>`<div class="event"><span class="dot"></span><div><b>${esc(e.hora||e.inicio||'')} • ${esc(e.tipo||'Atividade')}</b><small>${esc(e.descricao_original||e.descricao||e.atividade||e.texto||'')}</small></div>${badge(e.status||'PENDENTE',resultClass(e.status))}</div>`).join(''):'<div class="empty">Nenhuma atividade registrada.</div>'}</div></div><div><div class="panel"><h3>📊 Atividades de hoje</h3><div class="sub">Gráfico horizontal</div>${bar('Separações',t.s,Math.max(t.s,t.c,t.f,t.a,1),'')}${bar('Carregamentos',t.c,Math.max(t.s,t.c,t.f,t.a,1),'green')}${bar('Conferências',t.f,Math.max(t.s,t.c,t.f,t.a,1),'purple')}${bar('Atividades',t.a,Math.max(t.s,t.c,t.f,t.a,1),'dark')}</div><div class="panel"><h3>📈 Resultados das operações</h3><div class="sub">OK e NÃO OK</div>${bar('Conferências OK',t.fok,Math.max(t.f,1),'green')}${bar('Conferências NÃO OK',t.fbad,Math.max(t.f,1),'red')}${bar('Carregamentos OK',t.cok,Math.max(t.c,1),'green')}${bar('Carregamentos NÃO OK',t.cbad,Math.max(t.c,1),'red')}</div></div></div><div class="sub" style="margin-top:10px">Última atualização: ${esc(state.lastSync?new Date(state.lastSync).toLocaleTimeString('pt-BR'):'agora')}</div>`;}
function separacoesPage(){
 const d=userSeps();
 const rows=d.map((r,i)=>`<tr data-search="${esc([r.lote||r.numero_lote,r.pedido||r.numero_pedido,r.destino||r.rota,r.peso||r.peso_total_kg,r.volumes||r.volume_total,r.inicio,r.fim].join(' '))}" data-status="${esc(r.status||r.resultado||'PENDENTE')}">
 <td>${esc(r.lote||r.numero_lote)}</td><td>${esc(r.pedido||r.numero_pedido)}</td><td>${esc(r.destino||r.rota)}</td><td>${esc(r.peso||r.peso_total_kg)}</td><td>${esc(r.volumes||r.volume_total)}</td><td>${esc(r.inicio)}</td><td>${esc(r.fim)}</td><td>${badge(r.status||'PENDENTE',resultClass(r.status||r.resultado))}</td><td><button class="btn secondary" onclick="details('${esc(r.lote||'')}')">Ver</button></td></tr>`).join('');
 return myTablePage('Minhas Separações','Consulte e filtre somente as separações vinculadas ao seu usuário.',['Lote','Pedido','Destino','Peso','Volumes','Início','Fim','Status',''],rows,'separacoes');
}
function carregamentosPage(){
 const d=userCars();
 const rows=d.map(r=>`<tr data-search="${esc([r.romaneio||r.numero_romaneio,r.destino||r.rota,r.motorista,r.placa||r.veiculo,r.peso||r.peso_total_kg,r.volumes||r.volume_total,r.inicio,r.fim].join(' '))}" data-status="${esc(r.resultado||r.status||'PENDENTE')}">
 <td>${esc(r.romaneio||r.numero_romaneio)}</td><td>${esc(r.destino||r.rota)}</td><td>${esc(r.motorista)}</td><td>${esc(r.placa||r.veiculo)}</td><td>${esc(r.peso||r.peso_total_kg)}</td><td>${esc(r.volumes||r.volume_total)}</td><td>${esc(r.inicio)}</td><td>${esc(r.fim)}</td><td>${badge(r.resultado||r.status||'PENDENTE',resultClass(r.resultado||r.status))}</td></tr>`).join('');
 return myTablePage('Meus Carregamentos','Consulte e filtre somente os carregamentos vinculados ao seu usuário.',['Romaneio','Rota/Destino','Motorista','Placa','Peso','Volumes','Início','Fim','Resultado'],rows,'carregamentos');
}
function myTablePage(title,sub,heads,rows,type){
 const ph=type==='separacoes'?'Pesquisar lote, pedido, destino...':'Pesquisar romaneio, motorista, placa, destino...';
 return '<div class="page-title"><h1>'+esc(title)+'</h1><p>'+esc(sub)+'</p></div>'+
 '<div class="panel my-filter-panel" data-filter-type="'+type+'"><div class="filters my-filters">'+
 '<input id="mySearchFilter" type="search" placeholder="'+ph+'" autocomplete="off">'+
 '<select id="myPeriodFilter"><option value="all">Todo período</option><option value="today">Hoje</option><option value="7">Últimos 7 dias</option><option value="30">Últimos 30 dias</option><option value="month">Este mês</option></select>'+
 '<select id="myStatusFilter"><option value="">Todos os status</option><option value="finalizada">Finalizada</option><option value="finalizado">Finalizado</option><option value="andamento">Em andamento</option><option value="ok">OK</option><option value="nao ok">NÃO OK</option><option value="pendente">Pendente</option></select>'+
 '<button type="button" class="btn" id="myApplyFilter">Filtrar</button><button type="button" class="btn secondary" id="myClearFilter">Limpar</button>'+
 '<span id="myFilterCount" class="filter-count"></span></div>'+
 '<div class="table-wrap"><table class="table"><thead><tr>'+heads.map(h=>'<th>'+esc(h)+'</th>').join('')+'</tr></thead><tbody id="myDataRows">'+(rows||'<tr><td colspan="20" class="empty">Nenhum registro encontrado.</td></tr>')+'</tbody></table></div></div>';
}
function conferenciasPage(){const d=userConfs();return tablePage('Minhas Conferências','Somente usuários com permissão de conferência.',['Operação','Lote/Pedido','Data/Hora','Resultado','Divergência','Qtd. divergente','Observação'],d.map(r=>`<tr><td>${esc(r.operacao||r.tipo_operacao)}</td><td>${esc(r.referencia||r.lote||r.pedido)}</td><td>${esc(r.hora||r.fim||r.inicio)}</td><td>${badge(r.resultado||'PENDENTE',resultClass(r.resultado))}</td><td>${esc(r.ocorrencia||'—')}</td><td>${esc(r.quantidade_divergente||r.qtd||'—')}</td><td>${esc(r.observacao||'—')}</td></tr>`).join(''));}
function atividadesPage(){const d=userActs();return tablePage('Minhas Atividades','Preserva a descrição original registrada no SIGA, mesmo quando o texto varia.',['Hora','Tipo','Descrição original','Status','Detalhes'],d.map(e=>`<tr><td>${esc(e.hora||e.inicio||'')}</td><td>${esc(e.tipo||'Atividade')}</td><td>${esc(e.descricao_original||e.descricao||e.atividade||e.texto||e.detalhes||'')}</td><td>${badge(e.status||'PENDENTE',resultClass(e.status))}</td><td><button class="btn secondary" onclick="showToast('Detalhes da atividade')">Ver</button></td></tr>`).join(''));}
function relatoriosPage(){const s=userSeps(),c=userCars(),f=userConfs(),a=userActs(),okF=f.filter(x=>norm(x.resultado)==='ok').length,badF=f.filter(x=>/não ok|nao ok/i.test(x.resultado||'')).length,okC=c.filter(x=>norm(x.resultado)==='ok').length,badC=c.filter(x=>/não ok|nao ok/i.test(x.resultado||'')).length,total=s.length+c.length+f.length,results=okF+badF+okC+badC,rate=results?Math.round((okF+okC)/results*100):0;return '<div class="page-title"><div class="panel-title"><div><h1>Relatórios Operacionais</h1><p>Resumo dos registros disponíveis para este usuário.</p></div><div class="hero-actions"><button class="btn secondary" onclick="exportReport()">⇩ Exportar relatório</button><button class="btn" onclick="window.print()">🖨 Imprimir</button></div></div></div><div class="report-kpis"><div class="perf-kpi"><span>Separações</span><strong>'+s.length+'</strong><small>Registros vinculados</small></div><div class="perf-kpi"><span>Carregamentos</span><strong>'+c.length+'</strong><small>Registros vinculados</small></div><div class="perf-kpi"><span>Conferências</span><strong>'+f.length+'</strong><small>Registros vinculados</small></div><div class="perf-kpi"><span>Conformidade registrada</span><strong>'+rate+'%</strong><small>'+results+' resultados OK/NÃO OK</small></div></div><div class="grid2"><div class="panel"><h3>📦 Produção operacional</h3><div class="sub">Quantidade de registros por tipo</div>'+bar('Separações',s.length,Math.max(total,1),'')+bar('Carregamentos',c.length,Math.max(total,1),'green')+bar('Conferências',f.length,Math.max(total,1),'purple')+bar('Atividades',a.length,Math.max(a.length,s.length,c.length,f.length,1),'dark')+'</div><div class="panel"><h3>✓ Qualidade e ocorrências</h3><div class="sub">Resultados registrados nas conferências e carregamentos</div>'+bar('Conferências OK',okF,Math.max(f.length,1),'green')+bar('Conferências NÃO OK',badF,Math.max(f.length,1),'red')+bar('Carregamentos OK',okC,Math.max(c.length,1),'green')+bar('Carregamentos NÃO OK',badC,Math.max(c.length,1),'red')+'</div></div><div class="panel report-table"><div class="panel-title"><div><h3>Resumo por operação</h3><div class="sub">Valores calculados a partir dos registros atuais.</div></div></div><div class="table-wrap"><table class="table"><thead><tr><th>Operação</th><th>Total</th><th>OK</th><th>NÃO OK</th><th>Sem resultado</th></tr></thead><tbody><tr><td>Separações</td><td>'+s.length+'</td><td>'+s.filter(x=>norm(x.resultado)==='ok').length+'</td><td>'+s.filter(x=>/não ok|nao ok/i.test(x.resultado||'')).length+'</td><td>'+s.filter(x=>!x.resultado).length+'</td></tr><tr><td>Carregamentos</td><td>'+c.length+'</td><td>'+okC+'</td><td>'+badC+'</td><td>'+c.filter(x=>!x.resultado).length+'</td></tr><tr><td>Conferências</td><td>'+f.length+'</td><td>'+okF+'</td><td>'+badF+'</td><td>'+f.filter(x=>!x.resultado).length+'</td></tr><tr><td>Atividades</td><td>'+a.length+'</td><td>—</td><td>—</td><td>'+a.filter(x=>!x.status).length+'</td></tr></tbody></table></div></div>';}
function exportReport(){const t=totals();exportRows('relatorio-operacional.csv',['Indicador','Quantidade'],[['Separações',t.s],['Carregamentos',t.c],['Conferências',t.f],['Atividades',t.a],['Conferências OK',t.fok],['Conferências NÃO OK',t.fbad],['Carregamentos OK',t.cok],['Carregamentos NÃO OK',t.cbad]]);}
function desempenhoPage(){const t=totals();const max=Math.max(t.s,t.c,t.f,t.a,1);return `<div class="page-title"><h1>Meu Desempenho</h1><p>Resumo calculado a partir das operações vinculadas ao usuário.</p></div><div class="cards"><div class="stat blue"><div class="stat-top">SEPARAÇÕES</div><strong>${t.s}</strong><small>Registros</small></div><div class="stat green"><div class="stat-top">CARREGAMENTOS</div><strong>${t.c}</strong><small>Registros</small></div><div class="stat purple"><div class="stat-top">CONFERÊNCIAS</div><strong>${t.f}</strong><small>Registros</small></div><div class="stat dark"><div class="stat-top">ATIVIDADES</div><strong>${t.a}</strong><small>Registros</small></div></div><div class="grid2"><div class="panel"><h3>Desempenho</h3><div class="sub">Indicadores em barras horizontais</div>${bar('Separações',t.s,max,'')}${bar('Carregamentos',t.c,max,'green')}${bar('Conferências',t.f,max,'purple')}${bar('Atividades',t.a,max,'dark')}</div><div class="panel"><h3>Resultados</h3><div class="sub">Conferências e carregamentos</div>${bar('Conferências OK',t.fok,Math.max(t.f,1),'green')}${bar('Conferências NÃO OK',t.fbad,Math.max(t.f,1),'red')}${bar('Carregamentos OK',t.cok,Math.max(t.c,1),'green')}${bar('Carregamentos NÃO OK',t.cbad,Math.max(t.c,1),'red')}</div></div>`;}
function perfilPage(){return `<div class="page-title"><h1>Perfil / Acesso</h1><p>Seu perfil e as permissões liberadas pelo administrador.</p></div><div class="profile"><div class="panel profile-card"><div class="avatar">${esc(state.user.avatar||'US')}</div><h3>${esc(state.user.name)}</h3><p class="sub">${esc(state.user.role||'Operador')}</p><div class="info" style="margin-top:15px;text-align:left"><small>Unidade</small><b>${esc(state.user.cd||'CDD')}</b></div></div><div class="panel"><h3>Permissões</h3>${permission('separacoes','Visualizar minhas separações')}${permission('carregamentos','Visualizar meus carregamentos')}${permission('atividades','Visualizar minhas atividades')}${permission('desempenho','Visualizar meu desempenho')}${permission('conferencias','Visualizar minhas conferências')}<button class="btn" style="margin-top:12px" onclick="showToast('Permissões administradas pelo perfil Autor')">Solicitar alteração</button></div></div>`;}
function permission(k,label){return `<div class="permission"><input type="checkbox" ${state.permissions[k]?'checked':''} disabled> ${esc(label)}</div>`;}
function adminPage(){return `<div class="page-title"><h1>Gestão de Usuários e Permissões</h1><p>Perfil Autor / Administrador • crie usuários, senhas e libere funções individualmente.</p></div><div class="admin-grid"><div class="panel"><div class="panel-title"><div><h3>👤 Usuários cadastrados</h3><div class="sub">Acesso controlado por usuário</div></div><button class="btn" onclick="showToast('Formulário de novo usuário')">+ Criar usuário</button></div><div class="user-list" style="margin-top:12px">${users.map(u=>`<div class="user-row"><div class="avatar">${u[0]}</div><div><b>${esc(u[1])}</b><small>${esc(u[2])} • ${esc(u[3])}</small></div><button class="btn secondary" onclick="showToast('Editando ${esc(u[1])}')">Editar</button></div>`).join('')}</div></div><div class="panel"><h3>🔐 Novo acesso</h3><div class="filters" style="margin-top:12px"><input placeholder="Nome completo"><input placeholder="Usuário"><input placeholder="Criar senha"><select><option>Operador</option><option>Conferente</option><option>Operador + Conferente</option><option>Administrador</option></select></div><h3 style="margin-top:8px">Liberar funções</h3><div class="checkgrid"><label class="check"><input type="checkbox" checked> Minhas Separações</label><label class="check"><input type="checkbox"> Meus Carregamentos</label><label class="check"><input type="checkbox" checked> Minhas Atividades</label><label class="check"><input type="checkbox"> Meu Desempenho</label><label class="check"><input type="checkbox"> Minhas Conferências</label></div><button class="btn" style="margin-top:13px" onclick="showToast('Usuário criado com permissões selecionadas')">Criar acesso</button></div></div>`;}
function details(lote){const r=userSeps().find(x=>(x.lote||x.numero_lote)===lote)||userSeps()[0];if(!r){state.page='separacoes';render();return;}document.querySelector('#main').innerHTML=`<div class="page-title"><button class="btn secondary" onclick="render()">← Voltar</button><h1 style="margin-top:8px">Detalhes da separação</h1><p>Operação ${esc(lote)}</p></div><div class="panel"><div class="hero"><div><h1 style="font-size:16px">Lote ${esc(r.lote||'')}</h1><p>Pedido ${esc(r.pedido||'')} • Destino ${esc(r.destino||'')}</p></div>${badge(r.status||'PENDENTE',resultClass(r.status||r.resultado))}</div><div class="detail-grid"><div class="info"><small>Peso</small><b>${esc(r.peso||'')}</b></div><div class="info"><small>Volumes</small><b>${esc(r.volumes||'')}</b></div><div class="info"><small>Início</small><b>${esc(r.inicio||'')}</b></div><div class="info"><small>Fim</small><b>${esc(r.fim||'')}</b></div></div></div>`;}
function filterRows(v){const q=norm(v);document.querySelectorAll('#dataRows tr').forEach(r=>r.style.display=norm(r.innerText).includes(q)?'':'none');}
function clearFilters(){const s=document.querySelector('#searchFilter');const p=document.querySelector('#periodFilter');const st=document.querySelector('#statusFilter');if(s)s.value='';if(p)p.value='all';if(st)st.value='Todos os status';document.querySelectorAll('#dataRows tr').forEach(r=>r.style.display='');const fc=document.querySelector('#filterCount');if(fc)fc.textContent='';showToast('Filtros limpos');}
function applyFilters(){const q=document.querySelector('.filters input')?.value||'';filterRows(q);showToast('Filtro aplicado');}
function showToast(m){const t=document.querySelector('#toast');if(t){t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200);}}
function closeMenu(){document.querySelector('#sidebar')?.classList.remove('open');document.querySelector('#overlay')?.classList.remove('show');document.querySelector('aside')?.classList.remove('open');}
function login(){const u=(document.querySelector('#u')?.value||'').trim();const p=document.querySelector('#pw')?.value||'';const msg=document.querySelector('#loginmsg');if(!u||!p){if(msg)msg.textContent='Informe usuário e senha.';return;}state.user={id:u.toLowerCase(),usuario:u,username:u,name:u==='01022005'?'Marco':u,role:u==='01022005'?'Autor / Administrador':'Operador',cd:document.querySelector('#fil')?.value||'CDD',avatar:(u==='01022005'?'MA':u.slice(0,2).toUpperCase())};state.permissions={separacoes:true,carregamentos:true,atividades:true,desempenho:true,conferencias:u==='01022005',admin:u==='01022005'};localStorage.setItem(STORAGE_USER,JSON.stringify(state.user));localStorage.setItem('siga30_portal_permissions_v2',JSON.stringify(state.permissions));state.page='home';render();refreshData(true);}
function logout(){localStorage.removeItem(STORAGE_USER);localStorage.removeItem('siga30_portal_permissions_v2');state.user=null;document.querySelector('#app')?.classList.add('hide');document.querySelector('#login')?.classList.remove('hide');}
function restoreSession(){try{const u=JSON.parse(localStorage.getItem(STORAGE_USER)||'null');if(!u)return false;state.user=u;const p=JSON.parse(localStorage.getItem('siga30_portal_permissions_v2')||'null');if(p)state.permissions={...state.permissions,...p};render();return true;}catch{return false;}}
function snapshotFormState(){const root=document.querySelector('#main');if(!root)return null;const fields=[...root.querySelectorAll('input,select,textarea')].map((el,i)=>({key:el.id||el.name||('__idx_'+i),tag:el.tagName,type:el.type||'',value:el.value,checked:!!el.checked,selectedIndex:el.selectedIndex}));const active=document.activeElement;return {fields,activeKey:active?(active.id||active.name||null):null,selection:active&&typeof active.selectionStart==='number'?{start:active.selectionStart,end:active.selectionEnd}:null};}
function restoreFormState(s){if(!s)return;const root=document.querySelector('#main');if(!root)return;const all=[...root.querySelectorAll('input,select,textarea')];s.fields.forEach((x,i)=>{let el=x.key?root.querySelector('#'+CSS.escape(x.key)):null;if(!el)el=all[i];if(!el)return;if(el.type==='checkbox'||el.type==='radio')el.checked=x.checked;else el.value=x.value;if(el.tagName==='SELECT'&&x.selectedIndex>=0)el.selectedIndex=x.selectedIndex;});if(s.activeKey){const el=root.querySelector('#'+CSS.escape(s.activeKey))||root.querySelector('[name="'+CSS.escape(s.activeKey)+'"]');if(el){el.focus({preventScroll:true});if(s.selection&&typeof el.setSelectionRange==='function'){try{el.setSelectionRange(s.selection.start,s.selection.end)}catch(e){}}}}}
async function refreshData(manual=false){
 if(!state.user||state.syncing)return;
 state.syncing=true;
 const formState=snapshotFormState();
 const uiState={
  page:state.page,
  search:document.querySelector('#searchFilter')?.value||'',
  period:document.querySelector('#periodFilter')?.value||'all',
  status:document.querySelector('#statusFilter')?.value||'Todos os status',
  mySearch:document.querySelector('#mySearchFilter')?.value||'',
  myStatus:document.querySelector('#myStatusFilter')?.value||'',
  myPeriod:document.querySelector('#myPeriodFilter')?.value||'all',
  scroll:document.querySelector('.area')?.scrollTop||window.scrollY||0
 };
 try{
  portalData=loadData();
  const url=(localStorage.getItem(STORAGE_API)||'').trim();
  if(url){
   const res=await fetch(url,{cache:'no-store'});
   if(!res.ok)throw new Error('HTTP '+res.status);
   const json=await res.json();
   portalData={
    separacoes:Array.isArray(json.separacoes)?json.separacoes:portalData.separacoes,
    carregamentos:Array.isArray(json.carregamentos)?json.carregamentos:portalData.carregamentos,
    atividades:Array.isArray(json.atividades)?json.atividades:portalData.atividades,
    conferencias:Array.isArray(json.conferencias)?json.conferencias:portalData.conferencias
   };
   saveData();
  }
  state.lastSync=Date.now();
 }catch(e){
  state.lastSync=Date.now();
 }finally{
  state.syncing=false;
  if(state.user){
   const detailOpen=!!document.querySelector('#main .page-title h1') && /detalhes da separação|detalhes do carregamento/i.test(document.querySelector('#main .page-title h1')?.textContent||'');
   state.page=uiState.page;
   if(!detailOpen) render();
   restoreFormState(formState);
   const q=document.querySelector('#searchFilter'),p=document.querySelector('#periodFilter'),s=document.querySelector('#statusFilter');
   if(q)q.value=uiState.search;
   if(p) p.value=uiState.period;
   if(s) s.value=uiState.status;
   const mq=document.querySelector('#mySearchFilter'),ms=document.querySelector('#myStatusFilter'),mp=document.querySelector('#myPeriodFilter');
   if(mq)mq.value=uiState.mySearch||'';
   if(ms)ms.value=uiState.myStatus||'';
   if(mp)mp.value=uiState.myPeriod||'all';
   if(document.querySelector('.my-filter-panel')&&typeof applyMyFilters==='function')applyMyFilters();
   else if(typeof applyFilters==='function')applyFilters();
   requestAnimationFrame(()=>{
    const area=document.querySelector('.area');
    if(area)area.scrollTop=uiState.scroll;
    else window.scrollTo(0,uiState.scroll);
   });
  }
  if(manual)showToast('Atualização concluída sem perder filtros ou dados digitados.');
 }
}
function clock(){const e=document.querySelector('#clock');if(e)e.textContent=new Date().toLocaleString('pt-BR',{dateStyle:'short',timeStyle:'short'});}
document.addEventListener('DOMContentLoaded',()=>{document.querySelector('#menuBtn')?.addEventListener('click',()=>{document.querySelector('#sidebar')?.classList.add('open');document.querySelector('#overlay')?.classList.add('show');});document.querySelector('#overlay')?.addEventListener('click',closeMenu);document.querySelector('#profileBtn')?.addEventListener('click',()=>{state.page='perfil';render();});setInterval(clock,1000);clock();if(!restoreSession()){document.querySelector('#login')?.classList.remove('hide');document.querySelector('#app')?.classList.add('hide');}}});

/* SIGA 3.0 user management patch */
function navItems(){return [['home','⌂','Início',true],['separacoes','▣','Minhas Separações',state.permissions.separacoes],['carregamentos','▰','Meus Carregamentos',state.permissions.carregamentos],['conferencias','✓','Minhas Conferências',state.permissions.conferencias],['atividades','◷','Minhas Atividades',state.permissions.atividades],['desempenho','▥','Meu Desempenho',state.permissions.desempenho],['relatorios','▤','Relatórios Operacionais',state.permissions.desempenho],['perfil','●','Perfil / Acesso',true],['admin','⚙','Cadastrar Usuários',state.permissions.admin],['filiais','🏢','Cadastrar Filiais',isAuthor()],['logout','↪','Sair',true]];}
const USER_STORE='siga30_portal_users_v3';
try{const saved=JSON.parse(localStorage.getItem(USER_STORE)||'null');if(Array.isArray(saved)){users.splice(0,users.length,...saved);}}catch(e){}
function adminPage(){if(!isAuthor())return '<div class="page-title"><h1>Acesso restrito</h1><p>Somente o Autor pode visualizar e administrar os usuários.</p></div>';return '<div class="page-title"><h1>Cadastrar Usuários</h1><p>Autor / Administrador • cadastre, edite e controle as permissões individualmente.</p></div><div class="admin-grid"><div class="panel"><div class="panel-title"><div><h3>👤 Usuários cadastrados</h3><div class="sub">Crie novos acessos ou edite os existentes.</div></div><button class="btn" onclick="openUserForm()">+ Novo usuário</button></div><div id="userList" class="user-list" style="margin-top:12px"></div></div><div class="panel" id="userFormPanel"><h3 id="userFormTitle">🔐 Novo usuário</h3><form id="userForm" onsubmit="saveUser(event)"><input type="hidden" id="editUserId"><div class="user-form" style="margin-top:12px"><div class="field"><label>Nome completo<input id="newName" required></label></div><div class="field"><label>Usuário<input id="newLogin" required></label></div><div class="field"><label>Senha<input id="newPassword" type="password"></label></div><div class="field"><label>Perfil<select id="newRole"><option>Operador</option><option>Conferente</option><option>Operador + Conferente</option><option>Administrador</option></select></label></div></div><h3 style="margin-top:14px">Liberar funções</h3><div class="checkgrid"><label class="check"><input id="pSep" type="checkbox"> Minhas Separações</label><label class="check"><input id="pCar" type="checkbox"> Meus Carregamentos</label><label class="check"><input id="pAct" type="checkbox"> Minhas Atividades</label><label class="check"><input id="pDes" type="checkbox"> Meu Desempenho</label><label class="check"><input id="pConf" type="checkbox"> Minhas Conferências</label></div><div class="form-actions"><button class="btn" type="submit">Salvar usuário</button><button class="btn secondary" type="button" onclick="openUserForm()">Limpar</button></div></form></div></div>';}
function renderUsers(){if(!isAuthor())return;const el=document.querySelector('#userList');if(!el)return;el.innerHTML=users.map((u,i)=>'<div class="user-row"><div class="avatar">'+esc(u[0])+'</div><div><b>'+esc(u[1])+'</b><small>'+esc(u[2])+' • '+esc(u[3])+'</small></div><button class="btn secondary" onclick="editUser('+i+')">Editar</button></div>').join('');}
function openUserForm(){const f=document.querySelector('#userForm');if(!f)return;f.reset();document.querySelector('#editUserId').value='';document.querySelector('#userFormTitle').textContent='🔐 Novo usuário';document.querySelector('#newLogin').disabled=false;document.querySelector('#newPassword').required=false;}
function editUser(i){const u=users[i];if(!u)return;document.querySelector('#editUserId').value=i;document.querySelector('#newName').value=u[1]||'';document.querySelector('#newLogin').value=(u[1]||'').toLowerCase().replace(/[^a-z0-9]+/g,'.').replace(/^\.|\.$/g,'');document.querySelector('#newLogin').disabled=true;document.querySelector('#newPassword').value='';document.querySelector('#newPassword').required=false;document.querySelector('#newRole').value=u[2]||'Operador';const s=u[3]||'';document.querySelector('#pSep').checked=/separa/i.test(s)||/todas/i.test(s);document.querySelector('#pCar').checked=/carreg/i.test(s)||/todas/i.test(s);document.querySelector('#pAct').checked=/ativ/i.test(s)||/todas/i.test(s);document.querySelector('#pDes').checked=/desempenho/i.test(s)||/todas/i.test(s);document.querySelector('#pConf').checked=/confer/i.test(s)||/todas/i.test(s);document.querySelector('#userFormTitle').textContent='✏️ Editar usuário';document.querySelector('#userFormPanel')?.scrollIntoView({behavior:'smooth',block:'start'});}
function saveUser(ev){ev.preventDefault();const idx=document.querySelector('#editUserId').value;const name=document.querySelector('#newName').value.trim();const login=document.querySelector('#newLogin').value.trim();if(!name||!login){showToast('Preencha nome e usuário');return;}const role=document.querySelector('#newRole').value;const perms=[];if(document.querySelector('#pSep').checked)perms.push('Separação');if(document.querySelector('#pCar').checked)perms.push('Carregamento');if(document.querySelector('#pAct').checked)perms.push('Atividades');if(document.querySelector('#pDes').checked)perms.push('Desempenho');if(document.querySelector('#pConf').checked)perms.push('Conferência');const avatar=(name.split(/\s+/).map(x=>x[0]).join('').slice(0,2)||'US').toUpperCase();const item=[avatar,name,role,perms.length?perms.join(' • '):'Nenhuma função'];if(idx==='')users.push(item);else users[Number(idx)]=item;localStorage.setItem(USER_STORE,JSON.stringify(users));showToast(idx===''?'Novo usuário cadastrado':'Usuário atualizado');state.page='admin';render();}
const oldRender=render;render=function(){oldRender();if(state.page==='admin')renderUsers();};

/* ===== SIGA 3.0 UX / OPERATIONS UPGRADE ===== */
const ACCOUNT_STORE='siga30_accounts_v4';
const NOTIFY_STORE='siga30_notifications_v1';
function normalizeAccount(x){if(!x)return null;if(Array.isArray(x)){const d=x[3]||'';return {id:(x[1]||'').toLowerCase(),name:x[1]||'',password:'',role:x[2]||'Operador',cd:'CDD',permissions:{separacoes:/separa/i.test(d)||/todas/i.test(d),carregamentos:/carreg/i.test(d)||/todas/i.test(d),atividades:/ativ/i.test(d)||/todas/i.test(d),desempenho:/desempenho/i.test(d)||/todas/i.test(d),conferencias:/confer/i.test(d)||/todas/i.test(d),admin:/administrador|autor/i.test(x[2]||'')}};}return {...x,permissions:{...x.permissions}};}
function accountList(){
 const adminPerm={separacoes:true,carregamentos:true,atividades:true,desempenho:true,conferencias:true,admin:true};
 const defaults=[
  {id:'01022005',name:'Marco',password:'01022005',role:'Autor / Administrador',cd:'CDD',permissions:adminPerm},
  {id:'maximo',name:'Maximo',password:'1234',role:'Administrador',cd:'CDD',permissions:adminPerm},
  {id:'joao.silva',name:'João Silva',password:'1234',role:'Operador',cd:'CDD',permissions:{separacoes:true,carregamentos:true,atividades:true,desempenho:true,conferencias:false,admin:false}}
 ];
 try{
  const raw=JSON.parse(localStorage.getItem(ACCOUNT_STORE)||'null');
  let users=Array.isArray(raw)?raw.map(normalizeAccount).filter(Boolean):[];
  defaults.forEach(def=>{
   const key=String(def.id).toLowerCase();
   const found=users.find(u=>String(u.id||u.usuario||u.username||u.login||'').toLowerCase()===key);
   if(!found) users.push({...def,permissions:{...def.permissions}});
   else{
    if(key==='01022005'){
      found.id='01022005'; found.name='Marco'; found.password='01022005'; found.role='Autor / Administrador'; found.cd=found.cd||'CDD'; found.permissions={...adminPerm,...(found.permissions||{})};
    }
    if(key==='maximo'){
      found.id='maximo'; found.password='1234'; found.role='Administrador'; found.permissions={...adminPerm,...(found.permissions||{})};
    }
   }
  });
  localStorage.setItem(ACCOUNT_STORE,JSON.stringify(users));
  return users;
 }catch(e){ return defaults; }
}
function saveAccounts(a){localStorage.setItem(ACCOUNT_STORE,JSON.stringify(a));}
function getNotifications(){try{const n=JSON.parse(localStorage.getItem(NOTIFY_STORE)||'null');return Array.isArray(n)?n:[];}catch(e){return [];}}
function saveNotifications(n){localStorage.setItem(NOTIFY_STORE,JSON.stringify(n));}
function seedNotifications(){if(!getNotifications().length)saveNotifications([{id:1,title:'Portal pronto',text:'Seu painel operacional está atualizado.',time:new Date().toISOString(),read:false,type:'info'},{id:2,title:'Atenção operacional',text:'Confira as atividades pendentes do dia.',time:new Date().toISOString(),read:false,type:'warning'}]);}
function unreadNotifications(){return getNotifications().filter(x=>!x.read).length;}
function addNotification(title,text,type='info'){const n=getNotifications();n.unshift({id:Date.now(),title,text,time:new Date().toISOString(),read:false,type});saveNotifications(n.slice(0,50));}
function notificationPanel(){const n=getNotifications();return '<div class="notify-panel" id="notifyPanel"><div class="notify-head"><b>Notificações</b><button class="btn secondary" onclick="markNotificationsRead()">Marcar como lidas</button></div>'+(n.length?n.slice(0,8).map(x=>'<div class="notify-item '+(x.read?'read':'unread')+'"><span class="notify-dot '+esc(x.type||'info')+'"></span><div><b>'+esc(x.title)+'</b><p>'+esc(x.text)+'</p><small>'+esc(new Date(x.time).toLocaleString('pt-BR',{dateStyle:'short',timeStyle:'short'}))+'</small></div></div>').join(''):'<div class="empty">Nenhuma notificação.</div>')+'</div>';}
function toggleNotifications(){document.querySelector('#notifyPanel')?.classList.toggle('show');}
function markNotificationsRead(){saveNotifications(getNotifications().map(x=>({...x,read:true})));renderHeaderExtras();}
function renderHeaderExtras(){const h=document.querySelector('header');if(!h)return;let box=document.querySelector('#headerNotify');if(!box){box=document.createElement('div');box.id='headerNotify';box.className='header-actions';h.appendChild(box);}box.innerHTML='<button class="notify-btn" onclick="toggleNotifications()" aria-label="Notificações">◉'+(unreadNotifications()?'<em>'+unreadNotifications()+'</em>':'')+'</button>'+notificationPanel();}
function voiceCommand(){const Speech=window.SpeechRecognition||window.webkitSpeechRecognition;if(!Speech){showToast('Comando de voz não disponível neste navegador.');return;}const r=new Speech();r.lang='pt-BR';r.interimResults=false;r.maxAlternatives=1;showToast('🎙️ Fale um comando...');r.onresult=e=>{const q=norm(e.results[0][0].transcript);const map=[['separa','separacoes'],['carreg','carregamentos'],['confer','conferencias'],['atividade','atividades'],['desempenho','desempenho'],['perfil','perfil'],['usuário','admin'],['usuario','admin']];const m=map.find(x=>q.includes(x[0]));if(!m){showToast('Comando não reconhecido.');return;}state.page=m[1];render();};r.onerror=()=>showToast('Não foi possível reconhecer o comando.');r.start();}
function securePermission(page){
 const p=String(page||'home');
 if(isAuthor())return true;
 if(p==='admin'||p==='filiais'||p==='historico')return p==='historico' ? !!state.permissions.atividades : false;
 const map={separacoes:'separacoes',carregamentos:'carregamentos',conferencias:'conferencias',atividades:'atividades',desempenho:'desempenho'};
 return !map[p]||state.permissions[map[p]]===true;
}
function render(){if(!state.user)return;if(!securePermission(state.page)){state.page='home';showToast('Você não possui permissão para esta área.');}document.querySelector('#login')?.classList.add('hide');document.querySelector('#app')?.classList.remove('hide');updateUserUI();renderNav();const pages={home,separacoes:separacoesPage,carregamentos:carregamentosPage,conferencias:conferenciasPage,atividades:atividadesPage,desempenho:desempenhoPage,relatorios:relatoriosPage,perfil:perfilPage,admin:adminPage};const main=document.querySelector('#main');if(main)main.innerHTML=(pages[state.page]||home)();closeMenu();renderHeaderExtras();headerClock();if(state.page==='admin')renderUsers();}
function headerClock(){const h=document.querySelector('header');if(!h)return;let c=document.querySelector('#headerClock');if(!c){c=document.createElement('small');c.id='headerClock';c.className='header-clock';h.insertBefore(c,h.querySelector('.who'));}c.textContent=new Date().toLocaleString('pt-BR',{dateStyle:'short',timeStyle:'short'});}
function home(){const t=totals(),acts=userActs(),pending=acts.filter(x=>/andamento|pendente/i.test(x.status||'')).length;return '<div class="hero"><div><div class="eyebrow">Painel operacional • '+new Date().toLocaleDateString('pt-BR')+'</div><h1>Olá, '+esc((state.user.name||'Usuário').split(' ')[0])+'!</h1><p>Visão rápida das suas atividades, resultados e pendências.</p></div><div class="hero-actions"><button class="btn secondary" onclick="voiceCommand()">🎙️ Comando de voz</button><button class="btn secondary" onclick="refreshData(true)">↻ Atualizar agora</button></div></div><div class="cards"><div class="stat blue"><div class="stat-top"><span>SEPARAÇÕES</span><span class="stat-icon">▣</span></div><strong>'+t.s+'</strong><small>Hoje</small></div><div class="stat green"><div class="stat-top"><span>CARREGAMENTOS</span><span class="stat-icon">▰</span></div><strong>'+t.c+'</strong><small>Hoje</small></div><div class="stat purple"><div class="stat-top"><span>CONFERÊNCIAS</span><span class="stat-icon">✓</span></div><strong>'+t.f+'</strong><small>Hoje</small></div><div class="stat dark"><div class="stat-top"><span>ATIVIDADES</span><span class="stat-icon">☷</span></div><strong>'+t.a+'</strong><small>'+pending+' pendente(s)</small></div></div><div class="operational-strip"><div><span>STATUS</span><b>● Online</b></div><div><span>RESULTADOS OK</span><b>'+(t.fok+t.cok)+'</b></div><div><span>NÃO OK</span><b class="badtext">'+(t.fbad+t.cbad)+'</b></div><div><span>ATUALIZAÇÃO</span><b>'+(state.lastSync?new Date(state.lastSync).toLocaleTimeString('pt-BR'):'agora')+'</b></div></div><div class="grid2"><div class="panel"><div class="panel-title"><div><h3>📋 Atividades feitas hoje</h3><div class="sub">Linha do tempo individual • descrição original preservada</div></div><button class="btn secondary" onclick="state.page=\'atividades\';render()">Ver todas →</button></div><div class="timeline">'+(acts.length?acts.slice(0,10).map(e=>'<div class="event"><span class="dot"></span><div><b>'+esc(e.hora||e.inicio||'')+' • '+esc(e.tipo||'Atividade')+'</b><small>'+esc(e.descricao_original||e.descricao||e.atividade||e.texto||'')+'</small></div>'+badge(e.status||'PENDENTE',resultClass(e.status))+'</div>').join(''):'<div class="empty">Nenhuma atividade registrada.</div>')+'</div></div><div><div class="panel"><h3>📊 Atividades de hoje</h3><div class="sub">Volume de operações por categoria</div>'+bar('Separações',t.s,Math.max(t.s,t.c,t.f,t.a,1),'')+bar('Carregamentos',t.c,Math.max(t.s,t.c,t.f,t.a,1),'green')+bar('Conferências',t.f,Math.max(t.s,t.c,t.f,t.a,1),'purple')+bar('Atividades',t.a,Math.max(t.s,t.c,t.f,t.a,1),'dark')+'</div><div class="panel"><h3>📈 Resultados das operações</h3><div class="sub">OK e NÃO OK registrados</div>'+bar('Conferências OK',t.fok,Math.max(t.f,1),'green')+bar('Conferências NÃO OK',t.fbad,Math.max(t.f,1),'red')+bar('Carregamentos OK',t.cok,Math.max(t.c,1),'green')+bar('Carregamentos NÃO OK',t.cbad,Math.max(t.c,1),'red')+'</div></div></div>';}
function desempenhoPage(){const t=totals(),max=Math.max(t.s,t.c,t.f,t.a,1),ok=t.fok+t.cok,bad=t.fbad+t.cbad,total=ok+bad,rate=total?Math.round(ok/total*100):0;return '<div class="page-title"><h1>Meu Desempenho</h1><p>Indicadores operacionais do usuário no período disponível.</p></div><div class="performance-kpis"><div class="perf-kpi"><span>Taxa de conformidade</span><strong>'+rate+'%</strong><small>'+ok+' OK de '+total+' resultados</small></div><div class="perf-kpi"><span>Total de operações</span><strong>'+(t.s+t.c+t.f)+'</strong><small>Separações + carregamentos + conferências</small></div><div class="perf-kpi"><span>Atividades</span><strong>'+t.a+'</strong><small>Registros vinculados</small></div><div class="perf-kpi"><span>Ocorrências</span><strong>'+bad+'</strong><small>Resultados NÃO OK</small></div></div><div class="grid2"><div class="panel"><h3>Produção operacional</h3><div class="sub">Comparação das atividades registradas</div>'+bar('Separações',t.s,max,'')+bar('Carregamentos',t.c,max,'green')+bar('Conferências',t.f,max,'purple')+bar('Atividades',t.a,max,'dark')+'</div><div class="panel"><h3>Qualidade operacional</h3><div class="sub">Resultados registrados</div>'+bar('Conferências OK',t.fok,Math.max(t.f,1),'green')+bar('Conferências NÃO OK',t.fbad,Math.max(t.f,1),'red')+bar('Carregamentos OK',t.cok,Math.max(t.c,1),'green')+bar('Carregamentos NÃO OK',t.cbad,Math.max(t.c,1),'red')+'</div></div><div class="panel performance-note"><b>Leitura</b><span>A taxa considera somente resultados OK/NÃO OK registrados; atividades sem resultado ficam fora do cálculo.</span></div>';}
function adminPage(){return '<div class="page-title"><h1>Cadastrar Usuários</h1><p>Autor / Administrador • cadastro, edição e permissões individuais.</p></div><div class="admin-grid"><div class="panel"><div class="panel-title"><div><h3>👤 Usuários cadastrados</h3><div class="sub">Acesso por perfil e função</div></div><button class="btn" onclick="openUserForm()">+ Novo usuário</button></div><div id="userList" class="user-list" style="margin-top:12px"></div></div><div class="panel" id="userFormPanel"><h3 id="userFormTitle">🔐 Novo usuário</h3><form id="userForm" onsubmit="saveUser(event)"><input type="hidden" id="editUserId"><div class="user-form" style="margin-top:12px"><div class="field"><label>Nome completo<input id="newName" required></label></div><div class="field"><label>Usuário<input id="newLogin" required></label></div><div class="field"><label>Senha<input id="newPassword" type="password" minlength="4"></label></div><div class="field"><label>Filial<select id="newCd">'+branchList().map(b=>'<option value="'+esc(b.id)+'">'+esc(b.id+' • '+b.nome)+'</option>').join('')+'</select></label></div><div class="field"><label>Perfil<select id="newRole"><option>Operador</option><option>Conferente</option><option>Operador + Conferente</option><option>Administrador</option></select></label></div></div><h3 style="margin-top:14px">Liberar funções</h3><div class="checkgrid"><label class="check"><input id="pSep" type="checkbox"> Minhas Separações</label><label class="check"><input id="pCar" type="checkbox"> Meus Carregamentos</label><label class="check"><input id="pAct" type="checkbox"> Minhas Atividades</label><label class="check"><input id="pDes" type="checkbox"> Meu Desempenho</label><label class="check"><input id="pConf" type="checkbox"> Minhas Conferências</label></div><div class="admin-note">As funções são independentes. Um conferente também pode receber acesso a separações, carregamentos ou desempenho.</div><div class="form-actions"><button class="btn" type="submit">Salvar usuário</button><button class="btn secondary" type="button" onclick="openUserForm()">Limpar</button></div></form></div></div>';}
function renderUsers(){const el=document.querySelector('#userList');if(!el)return;const a=accountList();el.innerHTML=a.map((u,i)=>'<div class="user-row"><div class="avatar">'+esc((u.name||'US').split(/\s+/).map(x=>x[0]).join('').slice(0,2).toUpperCase())+'</div><div><b>'+esc(u.name)+'</b><small>'+esc(u.role)+' • '+esc(u.cd||'CDD')+' • '+Object.entries(u.permissions||{}).filter(([k,v])=>v&&k!=='admin').map(([k])=>k).join(', ')+'</small></div><button class="btn secondary" onclick="editUser('+i+')">Editar</button></div>').join('');}
function openUserForm(){const f=document.querySelector('#userForm');if(!f)return;f.reset();document.querySelector('#editUserId').value='';document.querySelector('#userFormTitle').textContent='🔐 Novo usuário';document.querySelector('#newLogin').disabled=false;document.querySelector('#newPassword').required=true;document.querySelector('#newCd').value='CDD';}
function editUser(i){const a=accountList(),u=a[i];if(!u)return;document.querySelector('#editUserId').value=i;document.querySelector('#newName').value=u.name||'';document.querySelector('#newLogin').value=u.id||'';document.querySelector('#newLogin').disabled=true;document.querySelector('#newPassword').value='';document.querySelector('#newPassword').required=false;document.querySelector('#newCd').value=u.cd||'CDD';document.querySelector('#newRole').value=u.role||'Operador';const p=u.permissions||{};document.querySelector('#pSep').checked=!!p.separacoes;document.querySelector('#pCar').checked=!!p.carregamentos;document.querySelector('#pAct').checked=!!p.atividades;document.querySelector('#pDes').checked=!!p.desempenho;document.querySelector('#pConf').checked=!!p.conferencias;document.querySelector('#userFormTitle').textContent='✏️ Editar usuário';document.querySelector('#userFormPanel')?.scrollIntoView({behavior:'smooth',block:'start'});}
function saveUser(ev){ev.preventDefault();if(!isAuthor()){showToast('Somente o Autor pode cadastrar ou editar usuários.');return;}let a=accountList(),idx=document.querySelector('#editUserId').value,name=document.querySelector('#newName').value.trim(),id=document.querySelector('#newLogin').value.trim().toLowerCase(),pw=document.querySelector('#newPassword').value;if(!name||!id||(idx===''&&!pw)){showToast('Preencha nome, usuário e senha.');return;}if(idx===''&&a.some(x=>x.id===id)){showToast('Esse usuário já existe.');return;}const old=idx===''?null:a[Number(idx)],role=document.querySelector('#newRole').value,cd=document.querySelector('#newCd').value.trim()||'CDD';const item={id,name,password:pw||old?.password||'',role,cd,filial_id:cd,permissions:{separacoes:!!document.querySelector('#pSep').checked,carregamentos:!!document.querySelector('#pCar').checked,atividades:!!document.querySelector('#pAct').checked,desempenho:!!document.querySelector('#pDes').checked,conferencias:!!document.querySelector('#pConf').checked,admin:false}};if(idx==='')a.push(item);else a[Number(idx)]=item;saveAccounts(a);addNotification('Acesso atualizado',name+' teve suas permissões configuradas.');showToast(idx===''?'Usuário cadastrado com sucesso':'Usuário atualizado com sucesso');state.page='admin';render();}
function login(){const id=(document.querySelector('#u')?.value||'').trim().toLowerCase(),pw=document.querySelector('#pw')?.value||'',msg=document.querySelector('#loginmsg');const u=accountList().find(x=>x.id===id);if(!id||!pw){if(msg)msg.textContent='Informe usuário e senha.';return;}if(!u||u.password!==pw){if(msg)msg.textContent='Usuário ou senha inválidos.';return;}state.user={id:u.id,usuario:u.id,username:u.id,name:u.name,role:u.role,cd:u.cd||'CDD',filial_id:u.filial_id||u.cd||'CDD',avatar:(u.name||'US').split(/\s+/).map(x=>x[0]).join('').slice(0,2).toUpperCase()};state.permissions={...state.permissions,...u.permissions};localStorage.setItem(STORAGE_USER,JSON.stringify(state.user));localStorage.setItem('siga30_portal_permissions_v2',JSON.stringify(state.permissions));seedNotifications();state.page='home';render();refreshData(true);}
function restoreSession(){try{const u=JSON.parse(localStorage.getItem(STORAGE_USER)||'null');if(!u)return false;const a=accountList().find(x=>x.id===u.id);if(!a)return false;state.user={...u,cd:a.cd||u.cd||'CDD',filial_id:a.filial_id||a.cd||u.filial_id||u.cd||'CDD'};state.permissions={...state.permissions,...a.permissions};render();return true;}catch{return false;}}

/* ===== SIGA 3.0 COMPLETE LOCAL UX PACK ===== */
const HISTORY_STORE='siga30_history_v1';
function csvCell(v){return '"'+String(v??'').replace(/"/g,'""')+'"';}
function exportRows(filename,headers,rows){const csv='\\ufeff'+[headers,...rows].map(r=>r.map(csvCell).join(';')).join('\\r\\n');const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);showToast('Arquivo exportado com sucesso.');}
function exportCurrent(){const d=state.page==='separacoes'?userSeps():state.page==='carregamentos'?userCars():state.page==='conferencias'?userConfs():userActs();if(state.page==='separacoes')return exportRows('minhas-separacoes.csv',['Lote','Pedido','Destino','Peso','Volumes','Inicio','Fim','Status'],d.map(x=>[x.lote||x.numero_lote,x.pedido||x.numero_pedido,x.destino||x.rota,x.peso||x.peso_total_kg,x.volumes||x.volume_total,x.inicio,x.fim,x.status||x.resultado]));if(state.page==='carregamentos')return exportRows('meus-carregamentos.csv',['Romaneio','Destino','Motorista','Placa','Peso','Volumes','Inicio','Fim','Resultado'],d.map(x=>[x.romaneio||x.numero_romaneio,x.destino||x.rota,x.motorista,x.placa||x.veiculo,x.peso||x.peso_total_kg,x.volumes||x.volume_total,x.inicio,x.fim,x.resultado||x.status]));if(state.page==='conferencias')return exportRows('minhas-conferencias.csv',['Operacao','Referencia','Data/Hora','Resultado','Ocorrencia','Qtd divergente','Observacao'],d.map(x=>[x.operacao||x.tipo_operacao,x.referencia||x.lote||x.pedido,x.hora||x.fim||x.inicio,x.resultado,x.ocorrencia,x.quantidade_divergente||x.qtd,x.observacao]));return exportRows('minhas-atividades.csv',['Hora','Tipo','Descricao original','Status'],d.map(x=>[x.hora||x.inicio,x.tipo||'Atividade',x.descricao_original||x.descricao||x.atividade||x.texto,x.status]));}
function activityDetail(i){const d=userActs(),e=d[i];if(!e)return;const desc=e.descricao_original||e.descricao||e.atividade||e.texto||e.detalhes||'Sem descrição';const overlay=document.createElement('div');overlay.className='detail-modal';overlay.innerHTML='<div class="detail-modal-box"><button class="modal-close" onclick="this.closest(\'.detail-modal\').remove()">×</button><div class="eyebrow">Atividade registrada</div><h2>'+esc(e.tipo||'Atividade')+'</h2><div class="detail-modal-grid"><div><small>Início</small><b>'+esc(e.inicio||e.hora||'—')+'</b></div><div><small>Fim</small><b>'+esc(e.fim||'—')+'</b></div><div><small>Status</small><b>'+esc(e.status||'—')+'</b></div></div><div class="original-text"><small>Descrição original</small><p>'+esc(desc)+'</p></div></div>';document.body.appendChild(overlay);}
function historyPage(){const all=[...userActs()].sort((a,b)=>String(b.inicio||b.hora||'').localeCompare(String(a.inicio||a.hora||'')));return '<div class="page-title"><div class="panel-title"><div><h1>Histórico Completo</h1><p>Todos os registros de atividade disponíveis para o usuário, sem alterar a descrição original.</p></div><button class="btn" onclick="exportCurrent()">⇩ Exportar CSV</button></div></div><div class="panel"><div class="filters"><input placeholder="Pesquisar no histórico..." oninput="filterRows(this.value)"><select id="statusFilter"><option>Todos os status</option><option>Finalizada</option><option>Em andamento</option><option>OK</option><option>NÃO OK</option></select><button class="btn secondary" onclick="applyFilters()">Filtrar</button></div><div class="table-wrap"><table class="table"><thead><tr><th>Data/Hora</th><th>Tipo</th><th>Descrição original</th><th>Status</th><th></th></tr></thead><tbody id="dataRows">'+(all.length?all.map((e,i)=>'<tr><td>'+esc(e.inicio||e.hora||'')+'</td><td>'+esc(e.tipo||'Atividade')+'</td><td>'+esc(e.descricao_original||e.descricao||e.atividade||e.texto||'')+'</td><td>'+badge(e.status||'PENDENTE',resultClass(e.status))+'</td><td><button class="btn secondary" onclick="activityDetail('+i+')">Detalhes</button></td></tr>').join(''):'<tr><td colspan="5" class="empty">Nenhum registro.</td></tr>')+'</tbody></table></div></div>';}
function enhancedNavItems(){return [['home','⌂','Início',true],['separacoes','▣','Minhas Separações',state.permissions.separacoes],['carregamentos','▰','Meus Carregamentos',state.permissions.carregamentos],['conferencias','✓','Minhas Conferências',state.permissions.conferencias],['atividades','◷','Minhas Atividades',state.permissions.atividades],['historico','◴','Histórico Completo',state.permissions.atividades],['desempenho','▥','Meu Desempenho',state.permissions.desempenho],['relatorios','▤','Relatórios',state.permissions.atividades||state.permissions.desempenho],['perfil','●','Perfil / Acesso',true],['admin','⚙','Cadastrar Usuários',isAuthor()],['filiais','🏢','Cadastrar Filiais',isAuthor()],['logout','↪','Sair',true]];}
function renderNav(){const el=document.querySelector('#nav');if(!el)return;el.innerHTML=enhancedNavItems().filter(x=>x[3]).map(x=>'<button class="nav-item '+(state.page===x[0]?'active':'')+'" data-page="'+x[0]+'"><span class="nav-icon">'+x[1]+'</span>'+esc(x[2])+'</button>').join('');el.querySelectorAll('.nav-item').forEach(b=>b.onclick=()=>{const p=b.dataset.page;if(p==='logout'){logout();return;}if(!securePermission(p)){showToast('Acesso restrito ao Autor / Administrador.');return;}state.page=p;render();});};
function tablePage(title,sub,heads,rows){return '<div class="page-title"><div class="panel-title"><div><h1>'+esc(title)+'</h1><p>'+esc(sub)+'</p></div><button class="btn secondary" onclick="exportCurrent()">⇩ Exportar CSV</button></div></div><div class="panel"><div class="filters"><input id="searchFilter" placeholder="Pesquisar lote, pedido, rota, descrição..." oninput="filterRows(this.value)"><select id="periodFilter" onchange="applyFilters()"><option value="today">Hoje</option><option value="7">Últimos 7 dias</option><option value="month">Este mês</option><option value="all">Todo período</option></select><select id="statusFilter" onchange="applyFilters()"><option>Todos os status</option><option>Finalizada</option><option>Em andamento</option><option>OK</option><option>NÃO OK</option><option>Pendente</option></select><button class="btn" onclick="applyFilters()">Filtrar</button><button class="btn secondary" onclick="clearFilters()">Limpar</button><span id="filterCount" class="filter-count"></span></div><div class="table-wrap"><table class="table"><thead><tr>'+heads.map(h=>'<th>'+esc(h)+'</th>').join('')+'</tr></thead><tbody id="dataRows">'+(rows||'<tr><td colspan="20" class="empty">Nenhum registro encontrado.</td></tr>')+'</tbody></table></div></div>';}
function applyFilters(){const q=norm(document.querySelector('#searchFilter')?.value||''),status=norm(document.querySelector('#statusFilter')?.value||'todos'),period=document.querySelector('#periodFilter')?.value||'all';let visible=0,total=0;document.querySelectorAll('#dataRows tr').forEach(r=>{total++;const txt=norm(r.innerText);const statusOk=status==='todos os status'||status==='todos'||txt.includes(status);let periodOk=true;if(period!=='all'){const raw=r.cells?.[0]?.innerText||'';if(/^\\d{1,2}:\\d{2}/.test(raw)||!raw)periodOk=true;else{const d=new Date(raw);if(!Number.isNaN(d.getTime())){const days=(Date.now()-d.getTime())/86400000;periodOk=period==='today'?days<1:days<=Number(period);}}}const ok=(!q||txt.includes(q))&&statusOk&&periodOk;r.style.display=ok?'':'none';if(ok)visible++;});const fc=document.querySelector('#filterCount');if(fc)fc.textContent=visible+' de '+total+' registros';showToast(visible+' registro(s) encontrado(s)');}
function desempenhoPage(){const t=totals(),max=Math.max(t.s,t.c,t.f,t.a,1),ok=t.fok+t.cok,bad=t.fbad+t.cbad,total=ok+bad,rate=total?Math.round(ok/total*100):0,coverage=t.a?Math.round((t.s+t.c+t.f)/t.a*100):0;return '<div class="page-title"><h1>Meu Desempenho</h1><p>Indicadores operacionais do usuário no período disponível.</p></div><div class="performance-kpis"><div class="perf-kpi"><span>Taxa de conformidade</span><strong>'+rate+'%</strong><small>'+ok+' OK de '+total+' resultados</small></div><div class="perf-kpi"><span>Total de operações</span><strong>'+(t.s+t.c+t.f)+'</strong><small>Separações + carregamentos + conferências</small></div><div class="perf-kpi"><span>Atividades</span><strong>'+t.a+'</strong><small>Registros vinculados</small></div><div class="perf-kpi"><span>Não conformidades</span><strong>'+bad+'</strong><small>Resultados NÃO OK</small></div></div><div class="grid2"><div class="panel"><h3>Produção operacional</h3><div class="sub">Volume registrado por categoria</div>'+bar('Separações',t.s,max,'')+bar('Carregamentos',t.c,max,'green')+bar('Conferências',t.f,max,'purple')+bar('Atividades',t.a,max,'dark')+'</div><div class="panel"><h3>Qualidade operacional</h3><div class="sub">Resultados registrados</div>'+bar('Conferências OK',t.fok,Math.max(t.f,1),'green')+bar('Conferências NÃO OK',t.fbad,Math.max(t.f,1),'red')+bar('Carregamentos OK',t.cok,Math.max(t.c,1),'green')+bar('Carregamentos NÃO OK',t.cbad,Math.max(t.c,1),'red')+'<div class="performance-note"><b>Índice de cobertura</b><span>'+coverage+'% entre operações e atividades registradas.</span></div></div></div>' ;}
function render(){if(!state.user)return;if(!securePermission(state.page)){state.page='home';showToast('Você não possui permissão para esta área.');}document.querySelector('#login')?.classList.add('hide');document.querySelector('#app')?.classList.remove('hide');updateUserUI();renderNav();const pages={home,separacoes:separacoesPage,carregamentos:carregamentosPage,conferencias:conferenciasPage,atividades:atividadesPage,historico:historyPage,desempenho:desempenhoPage,relatorios:relatoriosPage,perfil:perfilPage,admin:adminPage,filiais:branchPage};const main=document.querySelector('#main');if(main)main.innerHTML=(pages[state.page]||home)();closeMenu();renderHeaderExtras();headerClock();if(state.page==='admin')renderUsers();}
function markBadNotifications(){const bad=[...userConfs(),...userCars()].filter(x=>/não ok|nao ok/i.test(x.resultado||''));if(!bad.length)return;const sig='bad-'+bad.map(x=>x.hora||x.fim||x.referencia||x.romaneio||'').join('|');const last=localStorage.getItem('siga30_bad_sig');if(last!==sig){localStorage.setItem('siga30_bad_sig',sig);addNotification('Atenção operacional',bad.length+' resultado(s) NÃO OK precisam de acompanhamento.','danger');}}
setTimeout(()=>{if(state.user){seedNotifications();markBadNotifications();renderHeaderExtras();}},500);


/* ===== FINAL UX / FILTERS / ACTIONS ===== */
function goPage(page){if(!state.user)return;if(!securePermission(page)){showToast('Você não possui permissão para esta área.');return;}state.page=page;render();}
function filterStatusMatch(row,wanted){const w=norm(wanted||'todos os status'),b=norm(row.querySelector('.badge')?.textContent||'');if(w==='todos os status'||w==='todos')return true;if(w==='ok')return b==='ok';if(w==='não ok'||w==='nao ok')return b==='não ok'||b==='nao ok';return b===w;}
function rowIsInPeriod(row,period){if(period==='all')return true;const raw=(row.cells?.[0]?.textContent||'').trim();if(!raw||/^\d{1,2}:\d{2}(?::\d{2})?$/.test(raw))return true;let d=null,m=raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);if(m)d=new Date(+m[3],+m[2]-1,+m[1],+(m[4]||0),+(m[5]||0));else{const x=new Date(raw);if(!Number.isNaN(x.getTime()))d=x;}if(!d)return true;const now=new Date(),start=new Date(now.getFullYear(),now.getMonth(),now.getDate());if(period==='today')return d>=start;const days=+period;return d>=new Date(start.getTime()-(days-1)*86400000)&&d<=now;}
function applyFilters(){const root=document.querySelector('#dataRows');if(!root)return;const q=norm(document.querySelector('#searchFilter')?.value||''),status=norm(document.querySelector('#statusFilter')?.value||'todos os status'),period=document.querySelector('#periodFilter')?.value||'all',rows=[...root.querySelectorAll('tr')];let total=0,visible=0;rows.forEach(r=>{if(!r.cells?.length)return;total++;const ok=(!q||norm(r.innerText||'').includes(q))&&filterStatusMatch(r,status)&&rowIsInPeriod(r,period);r.style.display=ok?'':'none';if(ok)visible++;});const fc=document.querySelector('#filterCount');if(fc)fc.textContent=visible+' de '+total+' registros';}
function filterRows(v){const s=document.querySelector('#searchFilter');if(s)s.value=v||'';applyFilters();}
function clearFilters(){const s=document.querySelector('#searchFilter'),p=document.querySelector('#periodFilter'),st=document.querySelector('#statusFilter');if(s)s.value='';if(p)p.value='all';if(st)st.value='Todos os status';applyFilters();showToast('Filtros limpos');}
function loadingDetails(i){const d=userCars(),r=d[i];if(!r)return;const o=document.createElement('div');o.className='detail-modal';o.innerHTML='<div class="detail-modal-box"><button class="modal-close" onclick="this.closest(\'.detail-modal\').remove()">×</button><div class="eyebrow">Carregamento registrado</div><h2>'+esc(r.romaneio||r.numero_romaneio||'Carregamento')+'</h2><div class="detail-modal-grid"><div><small>Destino</small><b>'+esc(r.destino||r.rota||'—')+'</b></div><div><small>Motorista</small><b>'+esc(r.motorista||'—')+'</b></div><div><small>Placa</small><b>'+esc(r.placa||r.veiculo||'—')+'</b></div><div><small>Peso</small><b>'+esc(r.peso||r.peso_total_kg||'—')+'</b></div><div><small>Volumes</small><b>'+esc(r.volumes||r.volume_total||'—')+'</b></div><div><small>Resultado</small><b>'+esc(r.resultado||r.status||'PENDENTE')+'</b></div></div></div>';document.body.appendChild(o);}
function separacoesPage(){const d=userSeps();return tablePage('Minhas Separações','Apenas separações vinculadas ao seu usuário.',['Lote','Pedido','Destino','Peso','Volumes','Início','Fim','Status',''],d.map((r,i)=>'<tr><td>'+esc(r.lote||r.numero_lote)+'</td><td>'+esc(r.pedido||r.numero_pedido)+'</td><td>'+esc(r.destino||r.rota)+'</td><td>'+esc(r.peso||r.peso_total_kg)+'</td><td>'+esc(r.volumes||r.volume_total)+'</td><td>'+esc(r.inicio)+'</td><td>'+esc(r.fim)+'</td><td>'+badge(r.status||r.resultado||'PENDENTE',resultClass(r.status||r.resultado))+'</td><td><button class="btn secondary" onclick="details(\''+esc(r.lote||r.numero_lote||'')+'\')">Ver</button></td></tr>').join(''));}
function carregamentosPage(){const d=userCars();return tablePage('Meus Carregamentos','Apenas carregamentos vinculados ao seu usuário.',['Romaneio','Rota/Destino','Motorista','Placa','Peso','Volumes','Início','Fim','Resultado',''],d.map((r,i)=>'<tr><td>'+esc(r.romaneio||r.numero_romaneio)+'</td><td>'+esc(r.destino||r.rota)+'</td><td>'+esc(r.motorista)+'</td><td>'+esc(r.placa||r.veiculo)+'</td><td>'+esc(r.peso||r.peso_total_kg)+'</td><td>'+esc(r.volumes||r.volume_total)+'</td><td>'+esc(r.inicio)+'</td><td>'+esc(r.fim)+'</td><td>'+badge(r.resultado||r.status||'PENDENTE',resultClass(r.resultado||r.status))+'</td><td><button class="btn secondary" onclick="loadingDetails('+i+')">Ver</button></td></tr>').join(''));}
function atividadesPage(){const d=userActs();return tablePage('Minhas Atividades','Preserva a descrição original registrada no SIGA, mesmo quando o texto varia.',['Hora','Tipo','Descrição original','Status','Detalhes'],d.map((e,i)=>'<tr><td>'+esc(e.hora||e.inicio||'')+'</td><td>'+esc(e.tipo||'Atividade')+'</td><td>'+esc(e.descricao_original||e.descricao||e.atividade||e.texto||e.detalhes||'')+'</td><td>'+badge(e.status||'PENDENTE',resultClass(e.status))+'</td><td><button class="btn secondary" onclick="activityDetail('+i+')">Ver</button></td></tr>').join(''));}


/* ===== HEADER / HOME FINAL OVERRIDES ===== */
function rowIsInPeriod(row,period){if(period==='all')return true;const raw=(row.cells?.[0]?.textContent||'').trim();if(!raw||/^\d{1,2}:\d{2}(?::\d{2})?$/.test(raw))return true;let d=null,m=raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);if(m)d=new Date(+m[3],+m[2]-1,+m[1],+(m[4]||0),+(m[5]||0));else{const x=new Date(raw);if(!Number.isNaN(x.getTime()))d=x;}if(!d)return true;const now=new Date(),start=new Date(now.getFullYear(),now.getMonth(),now.getDate());if(period==='today')return d>=start;if(period==='month')return d.getFullYear()===now.getFullYear()&&d.getMonth()===now.getMonth();const days=+period;return d>=new Date(start.getTime()-(days-1)*86400000)&&d<=now;}
function applyFilters(){const root=document.querySelector('#dataRows');if(!root)return;const input=document.querySelector('#searchFilter')||document.querySelector('.filters input');const q=norm(input?.value||''),status=norm(document.querySelector('#statusFilter')?.value||'todos os status'),period=document.querySelector('#periodFilter')?.value||'all',rows=[...root.querySelectorAll('tr')];let total=0,visible=0;rows.forEach(r=>{if(!r.cells?.length)return;total++;const ok=(!q||norm(r.innerText||'').includes(q))&&filterStatusMatch(r,status)&&rowIsInPeriod(r,period);r.style.display=ok?'':'none';if(ok)visible++;});const fc=document.querySelector('#filterCount');if(fc)fc.textContent=visible+' de '+total+' registros';}
function tablePage(title,sub,heads,rows){return '<div class="page-title"><div class="panel-title"><div><h1>'+esc(title)+'</h1><p>'+esc(sub)+'</p></div><button class="btn secondary" onclick="exportCurrent()">⇩ Exportar CSV</button></div></div><div class="panel"><div class="filters"><input id="searchFilter" placeholder="Pesquisar lote, pedido, rota, descrição..." oninput="applyFilters()"><select id="periodFilter" onchange="applyFilters()"><option value="today">Hoje</option><option value="7">Últimos 7 dias</option><option value="month">Este mês</option><option value="30">Últimos 30 dias</option><option value="all">Todo período</option></select><select id="statusFilter" onchange="applyFilters()"><option>Todos os status</option><option>Finalizada</option><option>Finalizado</option><option>Em andamento</option><option>OK</option><option>NÃO OK</option><option>Pendente</option></select><button class="btn" onclick="applyFilters()">Filtrar</button><button class="btn secondary" onclick="clearFilters()">Limpar</button><span id="filterCount" class="filter-count"></span></div><div class="table-wrap"><table class="table"><thead><tr>'+heads.map(h=>'<th>'+esc(h)+'</th>').join('')+'</tr></thead><tbody id="dataRows">'+(rows||'<tr><td colspan="20" class="empty">Nenhum registro encontrado.</td></tr>')+'</tbody></table></div></div>';}
function renderHeaderExtras(){const h=document.querySelector('header');if(!h)return;let box=document.querySelector('#headerNotify');if(!box){box=document.createElement('div');box.id='headerNotify';box.className='header-actions';}const who=h.querySelector('.who');if(who&&box.parentElement!==h)h.insertBefore(box,who);box.innerHTML='<button class="notify-btn" onclick="toggleNotifications()" aria-label="Notificações">🔔'+(unreadNotifications()?'<em>'+unreadNotifications()+'</em>':'')+'</button>'+notificationPanel();const branch=document.querySelector('#headerBranch');if(branch)branch.textContent=state.user?.cd||'CDD';const name=document.querySelector('#headerName');if(name)name.textContent=state.user?.name||'Usuário';const role=document.querySelector('#headerRole');if(role)role.textContent=state.user?.role||'Operador';const whoText=document.querySelector('#headerWho');if(whoText)whoText.textContent=state.user?.cd||'CDD';}
function home(){const t=totals(),acts=userActs(),pending=acts.filter(x=>/andamento|pendente/i.test(x.status||'')).length;return '<div class="hero"><div><div class="eyebrow">Painel operacional • '+new Date().toLocaleDateString('pt-BR')+'</div><h1>Olá, '+esc((state.user.name||'Usuário').split(' ')[0])+'!</h1><p>Visão rápida das suas atividades, resultados e pendências.</p></div><div class="hero-actions"><button class="btn secondary" onclick="voiceCommand()">🎙️ Comando de voz</button><button class="btn secondary" onclick="refreshData(true)">↻ Atualizar agora</button></div></div><div class="cards"><div class="stat blue clickable" onclick="goPage(\'separacoes\')"><div class="stat-top"><span>SEPARAÇÕES</span><span class="stat-icon">▣</span></div><strong>'+t.s+'</strong><small>Hoje • Ver separações →</small></div><div class="stat green clickable" onclick="goPage(\'carregamentos\')"><div class="stat-top"><span>CARREGAMENTOS</span><span class="stat-icon">▰</span></div><strong>'+t.c+'</strong><small>Hoje • Ver carregamentos →</small></div><div class="stat purple clickable" onclick="goPage(\'conferencias\')"><div class="stat-top"><span>CONFERÊNCIAS</span><span class="stat-icon">✓</span></div><strong>'+t.f+'</strong><small>Hoje • Ver conferências →</small></div><div class="stat dark clickable" onclick="goPage(\'atividades\')"><div class="stat-top"><span>ATIVIDADES</span><span class="stat-icon">☷</span></div><strong>'+t.a+'</strong><small>'+pending+' pendente(s) • Ver atividades →</small></div></div><div class="operational-strip"><div><span>STATUS</span><b>● Online</b></div><div><span>RESULTADOS OK</span><b>'+(t.fok+t.cok)+'</b></div><div><span>NÃO OK</span><b class="badtext">'+(t.fbad+t.cbad)+'</b></div><div><span>ATUALIZAÇÃO</span><b>'+new Date().toLocaleTimeString('pt-BR')+'</b></div></div><div class="grid2"><div class="panel"><div class="panel-title"><div><h3>📋 Atividades feitas hoje</h3><div class="sub">Linha do tempo individual • descrição original preservada</div></div><button class="btn secondary" onclick="goPage(\'atividades\')">Ver todas →</button></div><div class="timeline">'+(acts.length?acts.slice(0,10).map(e=>'<div class="event"><span class="dot"></span><div><b>'+esc(e.hora||e.inicio||'')+' • '+esc(e.tipo||'Atividade')+'</b><small>'+esc(e.descricao_original||e.descricao||e.atividade||e.texto||'')+'</small></div>'+badge(e.status||'PENDENTE',resultClass(e.status))+'</div>').join(''):'<div class="empty">Nenhuma atividade registrada.</div>')+'</div></div><div><div class="panel"><h3>📊 Atividades de hoje</h3><div class="sub">Volume de operações por categoria</div>'+bar('Separações',t.s,Math.max(t.s,t.c,t.f,t.a,1),'')+bar('Carregamentos',t.c,Math.max(t.s,t.c,t.f,t.a,1),'green')+bar('Conferências',t.f,Math.max(t.s,t.c,t.f,t.a,1),'purple')+bar('Atividades',t.a,Math.max(t.s,t.c,t.f,t.a,1),'dark')+'</div><div class="panel"><h3>📈 Resultados das operações</h3><div class="sub">OK e NÃO OK registrados</div>'+bar('Conferências OK',t.fok,Math.max(t.f,1),'green')+bar('Conferências NÃO OK',t.fbad,Math.max(t.f,1),'red')+bar('Carregamentos OK',t.cok,Math.max(t.c,1),'green')+bar('Carregamentos NÃO OK',t.cbad,Math.max(t.c,1),'red')+'</div></div></div>';}



/* ===== FILTER ENGINE V2 ===== */
function normalizeFilterText(v){return String(v??'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();}
function filterStatusMatch(row,wanted){
 const w=normalizeFilterText(wanted||'todos os status');
 if(!w||w==='todos'||w==='todos os status')return true;
 const badgeText=normalizeFilterText(row.querySelector('.badge')?.textContent||'');
 const rowText=normalizeFilterText(row.innerText||'');
 if(w==='ok')return badgeText==='ok';
 if(w==='nao ok')return badgeText==='nao ok';
 if(w==='pendente')return badgeText==='pendente';
 if(w==='finalizada'||w==='finalizado')return badgeText===w;
 if(w==='em andamento')return badgeText==='em andamento';
 return rowText.includes(w);
}
function rowIsInPeriod(row,period){
 if(!period||period==='all')return true;
 const raw=(row.dataset.date||row.cells?.[0]?.textContent||'').trim();
 if(!raw||/^\d{1,2}:\d{2}(?::\d{2})?$/.test(raw))return true;
 let d=null,m=raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
 if(m)d=new Date(+m[3],+m[2]-1,+m[1],+(m[4]||0),+(m[5]||0));
 else{const x=new Date(raw);if(!Number.isNaN(x.getTime()))d=x;}
 if(!d)return true;
 const now=new Date(),start=new Date(now.getFullYear(),now.getMonth(),now.getDate());
 if(period==='today')return d>=start&&d<=now;
 if(period==='month')return d.getFullYear()===now.getFullYear()&&d.getMonth()===now.getMonth();
 const days=Number(period);return Number.isFinite(days)?d>=new Date(start.getTime()-(days-1)*86400000)&&d<=now:true;
}
function applyFilters(){
 const root=document.querySelector('#dataRows');if(!root)return;
 const input=document.querySelector('#searchFilter')||document.querySelector('.filters input');
 const q=normalizeFilterText(input?.value||'');
 const status=document.querySelector('#statusFilter')?.value||'Todos os status';
 const period=document.querySelector('#periodFilter')?.value||'all';
 const rows=[...root.querySelectorAll('tr')].filter(r=>!r.classList.contains('filter-empty'));
 let visible=0;
 rows.forEach(r=>{
   const text=normalizeFilterText(r.innerText||'');
   const ok=(!q||text.includes(q))&&filterStatusMatch(r,status)&&rowIsInPeriod(r,period);
   r.style.display=ok?'':'none';if(ok)visible++;
 });
 let empty=root.querySelector('.filter-empty');
 if(!empty){empty=document.createElement('tr');empty.className='filter-empty';empty.innerHTML='<td colspan="20" class="empty">Nenhum registro corresponde aos filtros.</td>';root.appendChild(empty);}
 empty.style.display=visible?'none':'';
 const fc=document.querySelector('#filterCount');if(fc)fc.textContent=visible+' de '+rows.length+' registros';
}
function filterRows(v){const input=document.querySelector('#searchFilter')||document.querySelector('.filters input');if(input&&input.value!==String(v??''))input.value=v??'';applyFilters();}
function clearFilters(){
 const input=document.querySelector('#searchFilter'),period=document.querySelector('#periodFilter'),status=document.querySelector('#statusFilter');
 if(input)input.value='';if(period)period.value='all';if(status)status.value='Todos os status';applyFilters();showToast('Filtros limpos');
}



/* ===== FILTER ENGINE FINAL ===== */
function normalizeFilterText(v){return norm(String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,''));}
function filterPeriodKey(v){const x=normalizeFilterText(v);if(!x||x==='todos'||x==='todo periodo'||x==='todo')return'all';if(x==='hoje')return'today';if(x.includes('7'))return'7';if(x.includes('30'))return'30';if(x.includes('mes'))return'month';return'all';}
function filterStatusMatch(row,wanted){
 const w=normalizeFilterText(wanted);if(!w||w==='todos os status'||w==='todos')return true;
 const text=normalizeFilterText(row.innerText||'');
 if(w==='ok')return /(^|\s)ok(\s|$)/.test(text)&&!text.includes('nao ok');
 if(w==='nao ok')return text.includes('nao ok');
 if(w==='pendente')return text.includes('pendente');
 if(w==='em andamento')return text.includes('em andamento');
 if(w==='finalizada'||w==='finalizado')return text.includes('finalizada')||text.includes('finalizado');
 return text.includes(w);
}
function rowFilterDate(row){
 const text=(row.cells?.[0]?.textContent||'').trim();
 if(/^\d{1,2}:\d{2}(?::\d{2})?$/.test(text))return new Date();
 const m=text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
 if(m)return new Date(+m[3],+m[2]-1,+m[1],+(m[4]||0),+(m[5]||0));
 const d=new Date(text);return Number.isNaN(d.getTime())?new Date():d;
}
function rowMatchesPeriod(row,key){
 if(key==='all')return true;
 const d=rowFilterDate(row),now=new Date(),start=new Date(now.getFullYear(),now.getMonth(),now.getDate());
 if(key==='today')return d>=start&&d<=now;
 if(key==='month')return d.getFullYear()===now.getFullYear()&&d.getMonth()===now.getMonth();
 const days=Number(key);return Number.isFinite(days)?d>=new Date(start.getTime()-(days-1)*86400000)&&d<=now:true;
}
function applyFilters(){
 const root=document.querySelector('#dataRows');if(!root)return;
 const box=document.querySelector('.filters');
 const input=box?.querySelector('input');
 const selects=box?[...box.querySelectorAll('select')]:[];
 const period=selects.find(s=>s.id==='periodFilter'||normalizeFilterText(s.innerText).includes('7 dias')||normalizeFilterText(s.innerText).includes('mes'))?.value||'all';
 const status=document.querySelector('#statusFilter')?.value||'Todos os status';
 const q=normalizeFilterText(input?.value||'');
 const rows=[...root.querySelectorAll('tr')].filter(r=>r.querySelector('td'));
 let visible=0;
 rows.forEach(r=>{
  const text=normalizeFilterText(r.innerText||'');
  const ok=(!q||text.includes(q))&&filterStatusMatch(r,status)&&rowMatchesPeriod(r,filterPeriodKey(period));
  r.style.display=ok?'':'none';if(ok)visible++;
 });
 const fc=document.querySelector('#filterCount');if(fc)fc.textContent=visible+' de '+rows.length+' registros';
}
function filterRows(v){const input=document.querySelector('.filters input');if(input)input.value=v||'';applyFilters();}
function clearFilters(){
 const box=document.querySelector('.filters');if(!box)return;
 const input=box.querySelector('input');if(input)input.value='';
 const p=document.querySelector('#periodFilter');if(p)p.value=[...p.options].find(o=>filterPeriodKey(o.value)==='all')?.value||p.options[p.options.length-1]?.value||'';
 const st=document.querySelector('#statusFilter');if(st)st.value='Todos os status';
 applyFilters();showToast('Filtros limpos');
}
function tablePage(title,sub,heads,rows){
 return '<div class="page-title"><h1>'+esc(title)+'</h1><p>'+esc(sub)+'</p></div><div class="panel"><div class="filters"><input id="searchFilter" placeholder="Pesquisar lote, pedido, rota, descrição..." oninput="applyFilters()" autocomplete="off"><select id="periodFilter" onchange="applyFilters()"><option value="Hoje">Hoje</option><option value="7">Últimos 7 dias</option><option value="month">Este mês</option><option value="30">Últimos 30 dias</option><option value="all">Todo período</option></select><select id="statusFilter" onchange="applyFilters()"><option>Todos os status</option><option>Finalizada</option><option>Finalizado</option><option>Em andamento</option><option>OK</option><option>NÃO OK</option><option>Pendente</option></select><button class="btn" onclick="applyFilters()">Filtrar</button><button class="btn secondary" onclick="clearFilters()">Limpar</button><span id="filterCount" class="filter-count"></span></div><div class="table-wrap"><table class="table"><thead><tr>'+heads.map(h=>'<th>'+esc(h)+'</th>').join('')+'</tr></thead><tbody id="dataRows">'+(rows||'<tr><td colspan="20" class="empty">Nenhum registro encontrado.</td></tr>')+'</tbody></table></div></div>';
}



/* ===== PERSISTÊNCIA FORTE FINAL V2 ===== */
const UI_STATE_STORE_V2='siga30_ui_state_v2';
function persistUiStateV2(){
 try{
  const main=document.querySelector('#main')||document.body;
  const fields=[...main.querySelectorAll('input,select,textarea')].map((el,i)=>({id:el.id||'',name:el.name||'',value:el.value,checked:el.checked,selectedIndex:el.selectedIndex,index:i}));
  const filter={q:document.querySelector('#searchFilter')?.value||'',period:document.querySelector('#periodFilter')?.value||'',status:document.querySelector('#statusFilter')?.value||''};
  localStorage.setItem(UI_STATE_STORE_V2,JSON.stringify({page:state.page,fields,filter,scroll:document.querySelector('.area')?.scrollTop||window.scrollY||0,at:Date.now()}));
 }catch(e){}
}
function restoreUiStateV2(){
 try{
  const x=JSON.parse(localStorage.getItem(UI_STATE_STORE_V2)||'null');if(!x)return;
  if(x.page&&state.user&&securePermission(x.page))state.page=x.page;
  render();
  const main=document.querySelector('#main')||document.body,all=[...main.querySelectorAll('input,select,textarea')];
  (x.fields||[]).forEach((f,i)=>{let el=f.id?main.querySelector('#'+CSS.escape(f.id)):null;if(!el&&f.name)el=main.querySelector('[name="'+CSS.escape(f.name)+'"]');if(!el)el=all[f.index??i];if(!el)return;if(el.type==='checkbox'||el.type==='radio')el.checked=!!f.checked;else el.value=f.value;if(el.tagName==='SELECT'&&Number.isInteger(f.selectedIndex)&&f.selectedIndex<el.options.length)el.selectedIndex=f.selectedIndex;});
  const q=document.querySelector('#searchFilter'),p=document.querySelector('#periodFilter'),s=document.querySelector('#statusFilter');if(q)q.value=x.filter?.q||'';if(p&&x.filter?.period)p.value=x.filter.period;if(s&&x.filter?.status)s.value=x.filter.status;
  applyFilters();
  requestAnimationFrame(()=>{const area=document.querySelector('.area');if(area&&x.scroll!=null)area.scrollTop=x.scroll;else window.scrollTo(0,x.scroll||0);});
 }catch(e){}
}
window.addEventListener('beforeunload',persistUiStateV2);
document.addEventListener('input',persistUiStateV2,true);
document.addEventListener('change',persistUiStateV2,true);


/* ===== FILTROS UNIFICADOS V4 ===== */
function filterText(v){
 return String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
}
function getFilterControls(){
 const root=document.querySelector('#dataRows');
 if(!root)return null;
 return {
  root,
  input:document.querySelector('#searchFilter')||document.querySelector('.filters input'),
  period:document.querySelector('#periodFilter'),
  status:document.querySelector('#statusFilter')
 };
}
function filterDateFromRow(row){
 const raw=String(row?.cells?.[0]?.textContent||'').trim();
 if(!raw)return new Date();
 let m=raw.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
 if(m)return new Date(+m[3],+m[2]-1,+m[1],+(m[4]||0),+(m[5]||0));
 if(/^\d{1,2}:\d{2}(?::\d{2})?$/.test(raw)){
  const [hh,mm,ss='0']=raw.split(':').map(Number),d=new Date();
  d.setHours(hh,mm,Number(ss),0);return d;
 }
 const d=new Date(raw);
 return Number.isNaN(d.getTime())?new Date():d;
}
function filterStatus(row){
 const badge=row.querySelector('.badge');
 return filterText(badge?badge.textContent:row.innerText);
}
function filterDateOK(row,key){
 key=filterText(key);
 if(!key||key==='all'||key==='todos'||key==='todo periodo')return true;
 const d=filterDateFromRow(row),now=new Date();
 const start=new Date(now.getFullYear(),now.getMonth(),now.getDate());
 if(key==='hoje'||key==='today')return d>=start&&d<=now;
 if(key==='mes'||key==='este mes'||key==='month')return d.getFullYear()===now.getFullYear()&&d.getMonth()===now.getMonth();
 const n=parseInt(key,10);
 if(Number.isFinite(n))return d>=new Date(start.getTime()-(n-1)*86400000)&&d<=now;
 return true;
}
function filterStatusOK(row,wanted){
 const w=filterText(wanted);
 if(!w||w==='todos'||w==='todos os status')return true;
 const s=filterStatus(row);
 if(w==='ok')return s==='ok'||(s.includes('ok')&&!s.includes('nao ok'));
 if(w==='nao ok')return s.includes('nao ok');
 if(w==='finalizada')return s.includes('finalizada');
 if(w==='finalizado')return s.includes('finalizado');
 if(w==='em andamento')return s.includes('em andamento');
 if(w==='pendente')return s.includes('pendente');
 return s.includes(w);
}
function applyFilters(){
 const c=getFilterControls();if(!c)return;
 const q=filterText(c.input?.value||''),period=c.period?.value||'all',status=c.status?.value||'Todos os status';
 const rows=[...c.root.querySelectorAll('tr')].filter(r=>r.cells&&r.cells.length);
 let visible=0;
 rows.forEach(row=>{
  const hay=filterText(row.textContent);
  const ok=(!q||hay.includes(q))&&filterStatusOK(row,status)&&filterDateOK(row,period);
  row.hidden=!ok;
  row.style.display=ok?'':'none';
  if(ok)visible++;
 });
 const count=document.querySelector('#filterCount');if(count)count.textContent=visible+' de '+rows.length+' registros';
}
function filterRows(value){
 const input=document.querySelector('#searchFilter')||document.querySelector('.filters input');
 if(input)input.value=String(value??'');
 applyFilters();
}
function clearFilters(){
 const c=getFilterControls();if(!c)return;
 if(c.input)c.input.value='';
 if(c.period)c.period.value='all';
 if(c.status)c.status.value='Todos os status';
 applyFilters();
 showToast('Filtros limpos');
}
document.addEventListener('click',e=>{
 const b=e.target.closest('.filters .btn');
 if(b&&b.textContent.trim().toLowerCase().includes('filtrar')){e.preventDefault();applyFilters();}
});


/* ===== FILTROS REALMENTE FUNCIONAIS V5 ===== */
function fxNorm(v){
 return String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
}
function fxStatus(row){
 const b=row.querySelector('.badge');
 return fxNorm(b?b.textContent:row.textContent);
}
function fxDate(row){
 const cells=row.cells||[];
 const candidates=[cells[0]?.textContent,cells[5]?.textContent,cells[6]?.textContent].filter(Boolean).map(x=>String(x).trim());
 for(const raw of candidates){
  let m=raw.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
  if(m)return new Date(+m[3],+m[2]-1,+m[1],+(m[4]||0),+(m[5]||0));
  m=raw.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if(m){const d=new Date();d.setHours(+m[1],+m[2],+(m[3]||0),0);return d;}
 }
 return null;
}
function fxPeriod(row,value){
 const p=fxNorm(value);
 if(!p||p==='all'||p==='todos'||p==='todo periodo')return true;
 const d=fxDate(row);if(!d)return true;
 const now=new Date(),today=new Date(now.getFullYear(),now.getMonth(),now.getDate());
 if(p==='hoje'||p==='today')return d>=today&&d<=now;
 if(p==='month'||p==='mes'||p==='este mes')return d.getFullYear()===today.getFullYear()&&d.getMonth()===today.getMonth();
 const n=parseInt(p,10);
 return Number.isFinite(n)?d>=new Date(today.getTime()-(n-1)*86400000)&&d<=now:true;
}
function fxStatusOK(row,value){
 const w=fxNorm(value);
 if(!w||w==='todos'||w==='todos os status')return true;
 const s=fxStatus(row);
 if(w==='ok')return s==='ok'||(s.includes(' ok')&&!s.includes('nao ok'));
 if(w==='nao ok')return s.includes('nao ok');
 return s.includes(w);
}
function applyFilters(){
 const root=document.querySelector('#dataRows');if(!root)return;
 const input=document.querySelector('#searchFilter')||document.querySelector('.filters input');
 const period=document.querySelector('#periodFilter');
 const status=document.querySelector('#statusFilter');
 const q=fxNorm(input?.value||''),pv=period?.value||'all',sv=status?.value||'Todos os status';
 const rows=[...root.querySelectorAll('tr')].filter(r=>r.cells&&r.cells.length);
 let visible=0;
 rows.forEach(r=>{
  const match=(!q||fxNorm(r.textContent).includes(q))&&fxStatusOK(r,sv)&&fxPeriod(r,pv);
  r.hidden=!match;
  r.style.display=match?'table-row':'none';
  if(match)visible++;
 });
 const counter=document.querySelector('#filterCount');if(counter)counter.textContent=visible+' de '+rows.length+' registros';
}
function filterRows(v){
 const input=document.querySelector('#searchFilter')||document.querySelector('.filters input');
 if(input)input.value=String(v??'');
 applyFilters();
}
function clearFilters(){
 const input=document.querySelector('#searchFilter')||document.querySelector('.filters input');
 const period=document.querySelector('#periodFilter'),status=document.querySelector('#statusFilter');
 if(input)input.value='';
 if(period)period.value='all';
 if(status)status.value='Todos os status';
 applyFilters();
}
document.addEventListener('input',e=>{
 if(e.target.matches('#searchFilter,.filters input'))applyFilters();
},true);
document.addEventListener('change',e=>{
 if(e.target.matches('#periodFilter,#statusFilter'))applyFilters();
},true);


/* ===== FILTROS V6 DEFINITIVOS ===== */
(function(){
 const N=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
 function C(){const root=document.getElementById('dataRows'),box=document.querySelector('.filters');return root&&box?{root,input:box.querySelector('input'),period:box.querySelector('#periodFilter'),status:box.querySelector('#statusFilter')}:null}
 function D(row,key){
  key=N(key);if(!key||key==='all'||key==='todos'||key==='todo periodo')return true;
  const cells=[...row.cells].map(x=>String(x.textContent||'').trim());let d=null;
  for(const x of cells){let m=x.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);if(m){d=new Date(+m[3],+m[2]-1,+m[1],+(m[4]||0),+(m[5]||0));break}}
  if(!d)for(const x of cells){let m=x.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);if(m){d=new Date();d.setHours(+m[1],+m[2],+(m[3]||0),0);break}}
  if(!d)return true;
  const now=new Date(),today=new Date(now.getFullYear(),now.getMonth(),now.getDate());
  if(key==='hoje'||key==='today')return d>=today&&d<=now;
  if(key==='month'||key==='mes'||key==='este mes')return d.getFullYear()===today.getFullYear()&&d.getMonth()===today.getMonth();
  const days=parseInt(key,10);return Number.isFinite(days)?d>=new Date(today.getTime()-(days-1)*86400000)&&d<=now:true;
 }
 function S(row,w){
  w=N(w);if(!w||w==='todos'||w==='todos os status')return true;
  const b=row.querySelector('.badge'),s=N(b?b.textContent:row.textContent);
  if(w==='ok')return s==='ok';
  if(w==='nao ok')return s.includes('nao ok');
  return s.includes(w);
 }
 function RUN(){
  const c=C();if(!c)return;
  const q=N(c.input?.value||''),rows=[...c.root.children].filter(x=>x.tagName==='TR');let v=0;
  rows.forEach(r=>{const ok=(!q||N(r.textContent).includes(q))&&S(r,c.status?.value||'Todos os status')&&D(r,c.period?.value||'all');r.hidden=!ok;r.style.display=ok?'table-row':'none';if(ok)v++});
  const z=document.getElementById('filterCount');if(z)z.textContent=v+' de '+rows.length+' registros';
 }
 function CLEAR(){const c=C();if(!c)return;if(c.input)c.input.value='';if(c.period)c.period.value='all';if(c.status)c.status.value='Todos os status';RUN()}
 window.applyFilters=RUN;
 window.filterRows=function(v){const c=C();if(c?.input)c.input.value=String(v??'');RUN()};
 window.clearFilters=CLEAR;
})();

/* ===== FILTROS NOVOS - MINHAS SEPARACOES / MEUS CARREGAMENTOS ===== */
(function(){
 const N=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
 function dateFromRow(row){
  const vals=[row.dataset.date,...[...row.cells].map(x=>x.textContent.trim())];
  for(const x of vals){const m=x.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);if(m)return new Date(+m[3],+m[2]-1,+m[1],+(m[4]||0),+(m[5]||0));}
  for(const x of vals){const m=x.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);if(m){const d=new Date();d.setHours(+m[1],+m[2],+(m[3]||0),0);return d;}}
  return null;
 }
 function periodOK(row,key){
  key=N(key);if(!key||key==='all')return true;
  const d=dateFromRow(row);if(!d)return true;
  const now=new Date(),today=new Date(now.getFullYear(),now.getMonth(),now.getDate());
  if(key==='today')return d>=today&&d<=now;
  if(key==='month')return d.getFullYear()===today.getFullYear()&&d.getMonth()===today.getMonth();
  const days=Number(key);return Number.isFinite(days)?d>=new Date(today.getTime()-(days-1)*86400000)&&d<=now:true;
 }
 function apply(){
  const p=document.querySelector('.my-filter-panel');if(!p)return;
  const q=N(p.querySelector('#mySearchFilter')?.value),st=N(p.querySelector('#myStatusFilter')?.value),per=p.querySelector('#myPeriodFilter')?.value||'all';
  const rows=[...p.querySelectorAll('#myDataRows > tr')].filter(r=>r.cells?.length);let count=0;
  rows.forEach(r=>{
   const text=N(r.dataset.search||r.textContent),status=N(r.dataset.status||'');
   let ok=!q||text.includes(q);
   if(ok&&st)ok=st==='ok'?status==='ok':st==='nao ok'?status.includes('nao ok'):status.includes(st);
   if(ok)ok=periodOK(r,per);
   r.hidden=!ok;r.style.display=ok?'':'none';if(ok)count++;
  });
  const n=p.querySelector('#myFilterCount');if(n)n.textContent=count+' de '+rows.length+' registros';
 }
 function clear(){
  const p=document.querySelector('.my-filter-panel');if(!p)return;
  p.querySelector('#mySearchFilter').value='';p.querySelector('#myStatusFilter').value='';p.querySelector('#myPeriodFilter').value='all';apply();
 }
 document.addEventListener('click',e=>{if(e.target.closest('#myApplyFilter')){e.preventDefault();apply();}if(e.target.closest('#myClearFilter')){e.preventDefault();clear();}});
 document.addEventListener('input',e=>{if(e.target.id==='mySearchFilter')apply();});
 document.addEventListener('change',e=>{if(e.target.id==='myStatusFilter'||e.target.id==='myPeriodFilter')apply();});
 window.applyMyFilters=apply;window.clearMyFilters=clear;
})();

/* ===== FILTRO DE MES - RELATORIOS E DESEMPENHO ===== */
function reportMonthKey(v){
  const x=String(v??'').trim().toLowerCase();
  if(!x||x==='all'||x==='todos')return'all';
  const n=Number(x);
  return Number.isInteger(n)&&n>=0&&n<=11?String(n):'all';
}
function reportRecordDate(o){
  const fields=['data','date','data_hora','dataHora','created_at','createdAt','timestamp','inicio_data','fim_data','inicio','fim','hora'];
  const vals=[];
  fields.forEach(k=>{if(o&&o[k]!=null)vals.push(String(o[k]).trim());});
  Object.values(o||{}).forEach(v=>{if(typeof v==='string')vals.push(v.trim());});
  for(const raw of vals){
    if(/^\d{4}-\d{2}-\d{2}/.test(raw)){
      const d=new Date(raw);if(!Number.isNaN(d.getTime()))return d;
    }
    let m=raw.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
    if(m)return new Date(+m[3],+m[2]-1,+m[1],+(m[4]||0),+(m[5]||0));
  }
  for(const raw of vals){
    const m=raw.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
    if(m){const d=new Date();d.setHours(+m[1],+m[2],+(m[3]||0),0);return d;}
  }
  return null;
}
function reportMonthMatch(o,month){
  const m=reportMonthKey(month);
  if(m==='all')return true;
  const d=reportRecordDate(o);
  return !!d&&d.getFullYear()===new Date().getFullYear()&&d.getMonth()===Number(m);
}
function reportMonthOptions(selected='all'){
  const names=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  return '<option value="all" '+(selected==='all'?'selected':'')+'>Todos os meses</option>'+names.map((n,i)=>'<option value="'+i+'" '+(String(selected)===String(i)?'selected':'')+'>'+n+'</option>').join('');
}
function selectedReportMonth(){
  return document.querySelector('#reportMonthFilter')?.value||'all';
}
function filteredReportData(){
  const m=selectedReportMonth();
  return {
    s:userSeps().filter(x=>reportMonthMatch(x,m)),
    c:userCars().filter(x=>reportMonthMatch(x,m)),
    f:userConfs().filter(x=>reportMonthMatch(x,m)),
    a:userActs().filter(x=>reportMonthMatch(x,m))
  };
}
function desempenhoPage(){
  const m=selectedReportMonth(),d=filteredReportData(),s=d.s,c=d.c,f=d.f,a=d.a;
  const t={s:s.length,c:c.length,f:f.length,a:a.length,fok:f.filter(x=>norm(x.resultado)==='ok').length,fbad:f.filter(x=>/não ok|nao ok/i.test(x.resultado||'')).length,cok:c.filter(x=>norm(x.resultado)==='ok').length,cbad:c.filter(x=>/não ok|nao ok/i.test(x.resultado||'')).length};
  const max=Math.max(t.s,t.c,t.f,t.a,1);
  return '<div class="page-title"><div class="panel-title"><div><h1>Meu Desempenho</h1><p>Resumo calculado a partir das operações vinculadas ao usuário.</p></div></div></div>'+
  '<div class="panel month-filter-panel"><div class="filters"><label class="month-filter-label">Mês de referência<select id="reportMonthFilter" onchange="renderMonthReport()">'+reportMonthOptions(m)+'</select></label></div></div>'+
  '<div class="cards"><div class="stat blue"><div class="stat-top">SEPARAÇÕES</div><strong>'+t.s+'</strong><small>Registros no mês</small></div><div class="stat green"><div class="stat-top">CARREGAMENTOS</div><strong>'+t.c+'</strong><small>Registros no mês</small></div><div class="stat purple"><div class="stat-top">CONFERÊNCIAS</div><strong>'+t.f+'</strong><small>Registros no mês</small></div><div class="stat dark"><div class="stat-top">ATIVIDADES</div><strong>'+t.a+'</strong><small>Registros no mês</small></div></div>'+
  '<div class="grid2"><div class="panel"><h3>Desempenho</h3><div class="sub">Indicadores do mês selecionado</div>'+bar('Separações',t.s,max,'')+bar('Carregamentos',t.c,max,'green')+bar('Conferências',t.f,max,'purple')+bar('Atividades',t.a,max,'dark')+'</div><div class="panel"><h3>Resultados</h3><div class="sub">Conferências e carregamentos do mês</div>'+bar('Conferências OK',t.fok,Math.max(t.f,1),'green')+bar('Conferências NÃO OK',t.fbad,Math.max(t.f,1),'red')+bar('Carregamentos OK',t.cok,Math.max(t.c,1),'green')+bar('Carregamentos NÃO OK',t.cbad,Math.max(t.c,1),'red')+'</div></div>';
}
function relatoriosPage(){
  const m=selectedReportMonth(),d=filteredReportData(),s=d.s,c=d.c,f=d.f,a=d.a;
  const okF=f.filter(x=>norm(x.resultado)==='ok').length,badF=f.filter(x=>/não ok|nao ok/i.test(x.resultado||'')).length,okC=c.filter(x=>norm(x.resultado)==='ok').length,badC=c.filter(x=>/não ok|nao ok/i.test(x.resultado||'')).length,total=s.length+c.length+f.length,results=okF+badF+okC+badC,rate=results?Math.round((okF+okC)/results*100):0;
  return '<div class="page-title"><div class="panel-title"><div><h1>Relatórios Operacionais</h1><p>Resumo dos registros disponíveis para este usuário.</p></div><div class="hero-actions"><button class="btn secondary" onclick="exportReport()">⇩ Exportar relatório</button><button class="btn" onclick="window.print()">🖨 Imprimir</button></div></div></div>'+
  '<div class="panel month-filter-panel"><div class="filters"><label class="month-filter-label">Mês de referência<select id="reportMonthFilter" onchange="renderMonthReport()">'+reportMonthOptions(m)+'</select></label></div></div>'+
  '<div class="report-kpis"><div class="perf-kpi"><span>Separações</span><strong>'+s.length+'</strong><small>Registros no mês</small></div><div class="perf-kpi"><span>Carregamentos</span><strong>'+c.length+'</strong><small>Registros no mês</small></div><div class="perf-kpi"><span>Conferências</span><strong>'+f.length+'</strong><small>Registros no mês</small></div><div class="perf-kpi"><span>Conformidade registrada</span><strong>'+rate+'%</strong><small>'+results+' resultados OK/NÃO OK</small></div></div>'+
  '<div class="grid2"><div class="panel"><h3>📦 Produção operacional</h3><div class="sub">Quantidade de registros no mês</div>'+bar('Separações',s.length,Math.max(total,1),'')+bar('Carregamentos',c.length,Math.max(total,1),'green')+bar('Conferências',f.length,Math.max(total,1),'purple')+bar('Atividades',a.length,Math.max(a.length,s.length,c.length,f.length,1),'dark')+'</div><div class="panel"><h3>✓ Qualidade e ocorrências</h3><div class="sub">Resultados registrados no mês</div>'+bar('Conferências OK',okF,Math.max(f.length,1),'green')+bar('Conferências NÃO OK',badF,Math.max(f.length,1),'red')+bar('Carregamentos OK',okC,Math.max(c.length,1),'green')+bar('Carregamentos NÃO OK',badC,Math.max(c.length,1),'red')+'</div></div>'+
  '<div class="panel report-table"><div class="panel-title"><div><h3>Resumo por operação</h3><div class="sub">Valores calculados para o mês selecionado.</div></div></div><div class="table-wrap"><table class="table"><thead><tr><th>Operação</th><th>Total</th><th>OK</th><th>NÃO OK</th><th>Sem resultado</th></tr></thead><tbody><tr><td>Separações</td><td>'+s.length+'</td><td>'+s.filter(x=>norm(x.resultado)==='ok').length+'</td><td>'+s.filter(x=>/não ok|nao ok/i.test(x.resultado||'')).length+'</td><td>'+s.filter(x=>!x.resultado).length+'</td></tr><tr><td>Carregamentos</td><td>'+c.length+'</td><td>'+okC+'</td><td>'+badC+'</td><td>'+c.filter(x=>!x.resultado).length+'</td></tr><tr><td>Conferências</td><td>'+f.length+'</td><td>'+okF+'</td><td>'+badF+'</td><td>'+f.filter(x=>!x.resultado).length+'</td></tr><tr><td>Atividades</td><td>'+a.length+'</td><td>—</td><td>—</td><td>'+a.filter(x=>!x.status).length+'</td></tr></tbody></table></div></div>';
}
function renderMonthReport(){
  const value=document.querySelector('#reportMonthFilter')?.value||'all';
  try{localStorage.setItem('siga30_report_month_v1',value);}catch(e){}
  render();
}
(function restoreReportMonthFilter(){
  const oldRender=render;
  render=function(){
    oldRender();
    const p=document.querySelector('#reportMonthFilter');
    if(p){
      const saved=localStorage.getItem('siga30_report_month_v1')||'all';
      p.value=saved;
      if(typeof desempenhoPage==='function'&&typeof relatoriosPage==='function'){
        /* selection is applied on the next render */
      }
    }
  };
})();


/* ===== CORRECAO: PERSISTIR MES SELECIONADO ===== */
function selectedReportMonth(){
  const el=document.querySelector('#reportMonthFilter');
  const saved=localStorage.getItem('siga30_report_month_v1');
  return el?.value||saved||'all';
}


/* ===== FILTRO MES + ANO — RELATORIOS E DESEMPENHO ===== */
function reportSelectedYear(){
  const el=document.querySelector('#reportYearFilter');
  const saved=localStorage.getItem('siga30_report_year_v1');
  return Number(el?.value||saved||new Date().getFullYear());
}
function reportYearOptions(selected){
  const current=new Date().getFullYear(),saved=Number(selected||current);
  let out='';
  const min=Math.min(current-10,saved),max=Math.max(current,saved); for(let y=max;y>=min;y--)out+='<option value="'+y+'" '+(y===saved?'selected':'')+'>'+y+'</option>';
  return out;
}
function reportFilterOptions(){
  const m=selectedReportMonth(),y=reportSelectedYear();
  const names=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  const months='<option value="all" '+(m==='all'?'selected':'')+'>Todos os meses</option>'+names.map((n,i)=>'<option value="'+i+'" '+(String(m)===String(i)?'selected':'')+'>'+n+'</option>').join('');
  return '<div class="report-filter-head"><div><span class="report-filter-kicker">PERÍODO DE ANÁLISE</span><strong>Selecione mês e ano</strong><small>Os indicadores, gráficos e resumo são recalculados automaticamente.</small></div><div class="report-filter-fields"><label>Mês<select id="reportMonthFilter" onchange="renderMonthReport()">'+months+'</select></label><label>Ano<select id="reportYearFilter" onchange="renderMonthReport()">'+reportYearOptions(y)+'</select></label></div></div>';
}
function selectedReportMonth(){
  return document.querySelector('#reportMonthFilter')?.value||localStorage.getItem('siga30_report_month_v1')||'all';
}
function filteredReportData(){
  const m=selectedReportMonth(),y=reportSelectedYear();
  const match=o=>{
    const d=reportRecordDate(o);
    if(!d)return false;
    if(d.getFullYear()!==y)return false;
    return m==='all'||d.getMonth()===Number(m);
  };
  return {s:userSeps().filter(match),c:userCars().filter(match),f:userConfs().filter(match),a:userActs().filter(match)};
}
function renderMonthReport(){
  const m=document.querySelector('#reportMonthFilter')?.value||'all';
  const y=document.querySelector('#reportYearFilter')?.value||new Date().getFullYear();
  localStorage.setItem('siga30_report_month_v1',m);
  localStorage.setItem('siga30_report_year_v1',y);
  render();
}
function desempenhoPage(){
  const d=filteredReportData(),s=d.s,c=d.c,f=d.f,a=d.a;
  const t={s:s.length,c:c.length,f:f.length,a:a.length,fok:f.filter(x=>norm(x.resultado)==='ok').length,fbad:f.filter(x=>/não ok|nao ok/i.test(x.resultado||'')).length,cok:c.filter(x=>norm(x.resultado)==='ok').length,cbad:c.filter(x=>/não ok|nao ok/i.test(x.resultado||'')).length};
  const max=Math.max(t.s,t.c,t.f,t.a,1);
  return '<div class="page-title"><div class="panel-title"><div><span class="report-eyebrow">ANÁLISE DE PERFORMANCE</span><h1>Meu Desempenho</h1><p>Acompanhe seus resultados por mês e ano.</p></div></div></div>'+
  '<div class="report-filter-card">'+reportFilterOptions()+'</div>'+
  '<div class="cards"><div class="stat blue"><div class="stat-top">SEPARAÇÕES</div><strong>'+t.s+'</strong><small>Registros no período</small></div><div class="stat green"><div class="stat-top">CARREGAMENTOS</div><strong>'+t.c+'</strong><small>Registros no período</small></div><div class="stat purple"><div class="stat-top">CONFERÊNCIAS</div><strong>'+t.f+'</strong><small>Registros no período</small></div><div class="stat dark"><div class="stat-top">ATIVIDADES</div><strong>'+t.a+'</strong><small>Registros no período</small></div></div>'+
  '<div class="grid2"><div class="panel report-chart-panel"><h3>Desempenho operacional</h3><div class="sub">Volume de atividades no período selecionado</div>'+bar('Separações',t.s,max,'')+bar('Carregamentos',t.c,max,'green')+bar('Conferências',t.f,max,'purple')+bar('Atividades',t.a,max,'dark')+'</div><div class="panel report-chart-panel"><h3>Resultados das conferências</h3><div class="sub">Distribuição dos resultados no período</div>'+bar('Conferências OK',t.fok,Math.max(t.f,1),'green')+bar('Conferências NÃO OK',t.fbad,Math.max(t.f,1),'red')+bar('Carregamentos OK',t.cok,Math.max(t.c,1),'green')+bar('Carregamentos NÃO OK',t.cbad,Math.max(t.c,1),'red')+'</div></div>';
}
function relatoriosPage(){
  const d=filteredReportData(),s=d.s,c=d.c,f=d.f,a=d.a;
  const okF=f.filter(x=>norm(x.resultado)==='ok').length,badF=f.filter(x=>/não ok|nao ok/i.test(x.resultado||'')).length,okC=c.filter(x=>norm(x.resultado)==='ok').length,badC=c.filter(x=>/não ok|nao ok/i.test(x.resultado||'')).length,total=s.length+c.length+f.length,results=okF+badF+okC+badC,rate=results?Math.round((okF+okC)/results*100):0;
  return '<div class="page-title"><div class="panel-title"><div><span class="report-eyebrow">GESTÃO E INDICADORES</span><h1>Relatórios Operacionais</h1><p>Visão consolidada das operações do período selecionado.</p></div><div class="hero-actions"><button class="btn secondary" onclick="exportReport()">⇩ Exportar relatório</button><button class="btn" onclick="window.print()">🖨 Imprimir</button></div></div></div>'+
  '<div class="report-filter-card">'+reportFilterOptions()+'</div>'+
  '<div class="report-kpis"><div class="perf-kpi"><span>Separações</span><strong>'+s.length+'</strong><small>No período</small></div><div class="perf-kpi"><span>Carregamentos</span><strong>'+c.length+'</strong><small>No período</small></div><div class="perf-kpi"><span>Conferências</span><strong>'+f.length+'</strong><small>No período</small></div><div class="perf-kpi"><span>Conformidade registrada</span><strong>'+rate+'%</strong><small>'+results+' resultados analisados</small></div></div>'+
  '<div class="grid2"><div class="panel report-chart-panel"><h3>📦 Produção operacional</h3><div class="sub">Quantidade de registros no período</div>'+bar('Separações',s.length,Math.max(total,1),'')+bar('Carregamentos',c.length,Math.max(total,1),'green')+bar('Conferências',f.length,Math.max(total,1),'purple')+bar('Atividades',a.length,Math.max(a.length,s.length,c.length,f.length,1),'dark')+'</div><div class="panel report-chart-panel"><h3>✓ Qualidade e ocorrências</h3><div class="sub">Resultados registrados no período</div>'+bar('Conferências OK',okF,Math.max(f.length,1),'green')+bar('Conferências NÃO OK',badF,Math.max(f.length,1),'red')+bar('Carregamentos OK',okC,Math.max(c.length,1),'green')+bar('Carregamentos NÃO OK',badC,Math.max(c.length,1),'red')+'</div></div>'+
  '<div class="panel report-table"><div class="panel-title"><div><h3>Resumo por operação</h3><div class="sub">Valores calculados para o período selecionado.</div></div></div><div class="table-wrap"><table class="table"><thead><tr><th>Operação</th><th>Total</th><th>OK</th><th>NÃO OK</th><th>Sem resultado</th></tr></thead><tbody><tr><td>Separações</td><td>'+s.length+'</td><td>'+s.filter(x=>norm(x.resultado)==='ok').length+'</td><td>'+s.filter(x=>/não ok|nao ok/i.test(x.resultado||'')).length+'</td><td>'+s.filter(x=>!x.resultado).length+'</td></tr><tr><td>Carregamentos</td><td>'+c.length+'</td><td>'+okC+'</td><td>'+badC+'</td><td>'+c.filter(x=>!x.resultado).length+'</td></tr><tr><td>Conferências</td><td>'+f.length+'</td><td>'+okF+'</td><td>'+badF+'</td><td>'+f.filter(x=>!x.resultado).length+'</td></tr><tr><td>Atividades</td><td>'+a.length+'</td><td>—</td><td>—</td><td>'+a.filter(x=>!x.status).length+'</td></tr></tbody></table></div></div>';
}


/* ===== DATAS COMPLETAS NOS REGISTROS ===== */
(function(){
 const today=new Date(),pad=n=>String(n).padStart(2,'0');
 const iso=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
 const dateForIndex=i=>{const d=new Date(today);d.setDate(d.getDate()-(i%5));return iso(d)};
 const stamp=(o,i)=>{if(!o)return; if(!o.data&&!o.date&&!o.data_hora&&!o.dataHora&&!o.created_at&&!o.createdAt&&!o.timestamp){o.data=dateForIndex(i); if(o.inicio&&!/^\\d{4}-\\d{2}-\\d{2}/.test(String(o.inicio)))o.inicio=o.data+'T'+o.inicio; if(o.fim&&!/^\\d{4}-\\d{2}-\\d{2}/.test(String(o.fim)))o.fim=o.data+'T'+o.fim; if(o.hora&&!/^\\d{4}-\\d{2}-\\d{2}/.test(String(o.hora)))o.hora=o.data+'T'+o.hora;}};
 ['separacoes','carregamentos','atividades','conferencias'].forEach(k=>{if(Array.isArray(portalData?.[k]))portalData[k].forEach(stamp);});
 try{saveData()}catch(e){}
})();

/* ===== CORREÇÃO FINAL: DATA E HORA SEPARADAS + HORA EFETIVA ===== */
(function(){
 const pad=n=>String(n).padStart(2,'0');
 function parseDateTime(v){
  if(v==null||v==='')return null;
  const s=String(v).trim();
  let d=new Date(s);
  if(!Number.isNaN(d.getTime()))return d;
  let m=s.match(/^(\\d{1,2})[\\/\\-](\\d{1,2})[\\/\\-](\\d{4})(?:[ T]+(\\d{1,2}):(\\d{2})(?::(\\d{2}))?)?$/);
  if(m)return new Date(+m[3],+m[2]-1,+m[1],+(m[4]||0),+(m[5]||0),+(m[6]||0));
  m=s.match(/^(\\d{1,2}):(\\d{2})(?::(\\d{2}))?$/);
  if(m){const n=new Date();n.setHours(+m[1],+m[2],+(m[3]||0),0);return n;}
  return null;
 }
 function dt(o){
  const status=norm(o?.status||o?.resultado||'');
  const running=/andamento|iniciado|aberto/i.test(status);
  const finished=/finalizad|conclu|encerrad|terminad|ok|não ok|nao ok/i.test(status);
  let raw=running?(o.inicio||o.hora||o.data_hora||o.dataHora):(finished?(o.fim||o.hora||o.inicio||o.data_hora||o.dataHora):(o.hora||o.inicio||o.fim||o.data_hora||o.dataHora));
  return parseDateTime(raw);
 }
 function dateText(o){const d=dt(o);return d?pad(d.getDate())+'/'+pad(d.getMonth()+1)+'/'+d.getFullYear():'—';}
 function timeText(o){const d=dt(o);return d?pad(d.getHours())+':'+pad(d.getMinutes()):'—';}
 window.recordDateText=dateText; window.recordTimeText=timeText;
 function sepRows(d){return d.map((r,i)=>'<tr><td>'+esc(r.lote||r.numero_lote)+'</td><td>'+esc(r.pedido||r.numero_pedido)+'</td><td>'+esc(r.destino||r.rota)+'</td><td>'+esc(r.peso||r.peso_total_kg)+'</td><td>'+esc(r.volumes||r.volume_total)+'</td><td class="datetime-cell"><span>'+dateText(r)+'</span><small>'+timeText(r)+'</small></td><td>'+badge(r.status||r.resultado||'PENDENTE',resultClass(r.status||r.resultado))+'</td><td><button class="btn secondary" onclick="details(\''+esc(r.lote||r.numero_lote||'')+'\')">Ver</button></td></tr>').join('');}
 function carRows(d){return d.map((r,i)=>'<tr><td>'+esc(r.romaneio||r.numero_romaneio)+'</td><td>'+esc(r.destino||r.rota)+'</td><td>'+esc(r.motorista)+'</td><td>'+esc(r.placa||r.veiculo)+'</td><td>'+esc(r.peso||r.peso_total_kg)+'</td><td>'+esc(r.volumes||r.volume_total)+'</td><td class="datetime-cell"><span>'+dateText(r)+'</span><small>'+timeText(r)+'</small></td><td>'+badge(r.resultado||r.status||'PENDENTE',resultClass(r.resultado||r.status))+'</td><td><button class="btn secondary" onclick="loadingDetails('+i+')">Ver</button></td></tr>').join('');}
 function actRows(d){return d.map((e,i)=>'<tr><td class="datetime-cell"><span>'+dateText(e)+'</span><small>'+timeText(e)+'</small></td><td>'+esc(e.tipo||'Atividade')+'</td><td>'+esc(e.descricao_original||e.descricao||e.atividade||e.texto||e.detalhes||'')+'</td><td>'+badge(e.status||'PENDENTE',resultClass(e.status))+'</td><td><button class="btn secondary" onclick="activityDetail('+i+')">Ver</button></td></tr>').join('');}
 function confRows(d){return d.map(r=>'<tr><td>'+esc(r.operacao||r.tipo_operacao)+'</td><td>'+esc(r.referencia||r.lote||r.pedido)+'</td><td class="date-cell">'+dateText(r)+'</td><td class="time-cell">'+timeText(r)+'</td><td>'+badge(r.resultado||'PENDENTE',resultClass(r.resultado))+'</td><td>'+esc(r.ocorrencia||'—')+'</td><td>'+esc(r.quantidade_divergente||r.qtd||'—')+'</td><td>'+esc(r.observacao||'—')+'</td></tr>').join('');}
 window.separacoesPage=function(){const d=userSeps();return tablePage('Minhas Separações','Apenas separações vinculadas ao seu usuário.',['Lote','Pedido','Destino','Peso','Volumes','Data / Hora','Status',''],sepRows(d));};
 window.carregamentosPage=function(){const d=userCars();return tablePage('Meus Carregamentos','Apenas carregamentos vinculados ao seu usuário.',['Romaneio','Rota/Destino','Motorista','Placa','Peso','Volumes','Data / Hora','Resultado',''],carRows(d));};
 window.atividadesPage=function(){const d=userActs();return tablePage('Minhas Atividades','Preserva a descrição original registrada no SIGA. A hora exibida acompanha o início quando está em andamento e o fim quando está finalizada.',['Data / Hora','Tipo','Descrição original','Status','Detalhes'],actRows(d));};
 window.conferenciasPage=function(){const d=userConfs();return tablePage('Minhas Conferências','Somente usuários com permissão de conferência.',['Operação','Lote/Pedido','Data / Hora','Resultado','Divergência','Qtd. divergente','Observação'],confRows(d));};
})();


/* ===== LOGIN FINAL CORRIGIDO ===== */
(function(){
 window.login=function(){
  const id=(document.querySelector('#u')?.value||'').trim().toLowerCase();
  const pw=document.querySelector('#pw')?.value||'';
  const cd=document.querySelector('#fil')?.value||'CDD';
  const msg=document.querySelector('#loginmsg');
  if(!id||!pw){if(msg)msg.textContent='Informe usuário e senha.';return;}
  let u;if(id==='marco'||id==='01022005'){u={id:'01022005',name:'Marco',password:'01022005',role:'Autor / Administrador',cd:cd,permissions:{separacoes:true,carregamentos:true,atividades:true,desempenho:true,conferencias:true,admin:true}};}else{u=accountList().find(x=>{const keys=[x.id,x.usuario,x.username,x.login,x.name];return keys.some(k=>String(k||'').toLowerCase()===id);});}
  if(!u||String(u.password??'')!==pw){if(msg)msg.textContent='Usuário ou senha inválidos.';return;}
  state.user={id:u.id,usuario:u.id,username:u.id,name:u.name||u.nome||id,role:u.role||'Operador',cd:u.cd||cd,filial_id:u.filial_id||u.cd||cd,avatar:(u.name||u.nome||'US').split(/\\s+/).map(x=>x[0]).join('').slice(0,2).toUpperCase()};
  state.permissions={separacoes:false,carregamentos:false,atividades:false,desempenho:false,conferencias:false,admin:false,...(u.permissions||{})};
  if(/autor|administrador/i.test(String(state.user.role||'')))state.permissions={separacoes:true,carregamentos:true,atividades:true,desempenho:true,conferencias:true,admin:true,...state.permissions};
  localStorage.setItem(STORAGE_USER,JSON.stringify(state.user));
  localStorage.setItem('siga30_portal_permissions_v2',JSON.stringify(state.permissions));
  seedNotifications();
  state.page='home';
  if(msg)msg.textContent='';
  render();
  refreshData(true);
 };
 window.restoreSession=function(){
  try{
   const saved=JSON.parse(localStorage.getItem(STORAGE_USER)||'null');
   if(!saved?.id)return false;
   const u=accountList().find(x=>String(x.id||'').toLowerCase()===String(saved.id).toLowerCase());
   if(!u)return false;
   state.user={id:u.id,usuario:u.id,username:u.id,name:u.name||saved.name,role:u.role||saved.role||'Operador',cd:u.cd||saved.cd||'CDD',filial_id:u.filial_id||u.cd||saved.cd||'CDD',avatar:(u.name||saved.name||'US').split(/\\s+/).map(x=>x[0]).join('').slice(0,2).toUpperCase()};
   state.permissions={separacoes:false,carregamentos:false,atividades:false,desempenho:false,conferencias:false,admin:false,...(u.permissions||{})};
   if(/autor|administrador/i.test(String(state.user.role||'')))state.permissions={separacoes:true,carregamentos:true,atividades:true,desempenho:true,conferencias:true,admin:true,...state.permissions};
   localStorage.setItem(STORAGE_USER,JSON.stringify(state.user));
   localStorage.setItem('siga30_portal_permissions_v2',JSON.stringify(state.permissions));
   seedNotifications(); state.page='home'; render(); return true;
  }catch(e){return false;}
 };
})();

/* ===== REGISTRO OBRIGATÓRIO DE INÍCIO E FIM ===== */
(function(){
 const pad=n=>String(n).padStart(2,'0');
 const now=()=>{const d=new Date();return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())+'T'+pad(d.getHours())+':'+pad(d.getMinutes())+':'+pad(d.getSeconds());};
 const required=(form,selector,label)=>{
  const el=form?.querySelector(selector); if(!el)return;
  el.required=true;
  if(!el.dataset.requiredDateTime){
   el.dataset.requiredDateTime='1';
   el.addEventListener('change',()=>{if(!el.value)el.setCustomValidity('Informe '+label+'.');else el.setCustomValidity('');});
  }
 };
 function applyRequired(){
  document.querySelectorAll('form').forEach(f=>{
   const text=(f.innerText||'').toLowerCase();
   if(/separa|carreg|atividade|confer|romaneio|transbord|operação/.test(text)){
    required(f,'[name*="inicio" i],#inicio,#dataInicio,#data_inicio','data e hora de início');
    required(f,'[name*="fim" i],#fim,#dataFim,#data_fim','data e hora de fim');
   }
  });
 }
 const oldRender=window.render;
 if(typeof oldRender==='function'){
  window.render=function(){oldRender();setTimeout(applyRequired,0);};
 }
 window.requiredOperationDateTime=function(record){
  if(!record)return false;
  if(!record.inicio)record.inicio=now();
  if(!record.fim)record.fim=now();
  return true;
 };
 setTimeout(applyRequired,0);
})();


/* ===== CORREÇÃO DEFINITIVA: INÍCIO E FIM COM DATA + HORA ===== */
(function(){
  const pad=n=>String(n).padStart(2,'0');
  const today=()=>{const d=new Date();return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());};
  function parse(v){
    if(!v)return null;
    const s=String(v).trim();
    let d=new Date(s);
    if(!Number.isNaN(d.getTime()))return d;
    let m=s.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
    if(m){d=new Date();d.setHours(+m[1],+m[2],+(m[3]||0),0);return d;}
    m=s.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{1,2}):(\d{2})(?::(\d{2}))?/);
    if(m)return new Date(+m[1],+m[2]-1,+m[3],+m[4],+m[5],+(m[6]||0));
    return null;
  }
  function fullDate(v,fallback){
    if(!v)return fallback||today();
    const d=parse(v);
    return d?d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate()):fallback||today();
  }
  function fullDateTime(v,date){
    if(!v)return '';
    const d=parse(v);
    if(!d)return date+'T'+String(v);
    return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())+'T'+pad(d.getHours())+':'+pad(d.getMinutes())+':'+pad(d.getSeconds());
  }
  function completeRecord(o,index){
    if(!o)return;
    const baseDate=fullDate(o.data||o.date||o.data_hora||o.dataHora||o.inicio||o.hora||o.fim, (()=>{const d=new Date();d.setDate(d.getDate()-(index%5));return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())})());
    o.data=baseDate;
    if(o.inicio)o.inicio=fullDateTime(o.inicio,baseDate);
    if(o.fim)o.fim=fullDateTime(o.fim,baseDate);
    if(o.hora){
      o.hora=fullDateTime(o.hora,baseDate);
      if(!o.inicio)o.inicio=o.hora;
      if(!o.fim && /finalizad|conclu|encerrad|terminad|^ok$|não ok|nao ok/i.test(String(o.status||o.resultado||''))) o.fim=o.hora;
    }
  }
  ['separacoes','carregamentos','atividades','conferencias'].forEach(k=>{
    if(Array.isArray(portalData?.[k]))portalData[k].forEach(completeRecord);
  });
  try{saveData();}catch(e){}

  function dt(v){
    const d=parse(v);
    return d?pad(d.getDate())+'/'+pad(d.getMonth()+1)+'/'+d.getFullYear()+'<small>🕐 '+pad(d.getHours())+':'+pad(d.getMinutes())+'</small>':'—';
  }
  function cell(v,cls){
    return '<td class="'+(cls||'datetime-cell')+'">'+dt(v)+'</td>';
  }
  function startOf(o){return o?.inicio||o?.hora||o?.data_hora||o?.dataHora||'';}
  function endOf(o){
    return o?.fim||((/finalizad|conclu|encerrad|terminad|^ok$|não ok|nao ok/i.test(String(o?.status||o?.resultado||'')))?(o?.hora||o?.inicio||''):'');
  }

  window.separacoesPage=function(){
    const d=userSeps();
    const rows=d.map((r,i)=>'<tr><td>'+esc(r.lote||r.numero_lote)+'</td><td>'+esc(r.pedido||r.numero_pedido)+'</td><td>'+esc(r.destino||r.rota)+'</td><td>'+esc(r.peso||r.peso_total_kg)+'</td><td>'+esc(r.volumes||r.volume_total)+'</td>'+cell(startOf(r))+cell(endOf(r))+'<td>'+badge(r.status||r.resultado||'PENDENTE',resultClass(r.status||r.resultado))+'</td><td><button class="btn secondary" onclick="details(\''+esc(r.lote||r.numero_lote||'')+'\')">Ver</button></td></tr>').join('');
    return myTablePage('Minhas Separações','Data e hora obrigatórias no início e no fim da operação.',['Lote','Pedido','Destino','Peso','Volumes','Início — Data / Hora','Fim — Data / Hora','Status',''],rows,'separacoes');
  };

  window.carregamentosPage=function(){
    const d=userCars();
    const rows=d.map((r,i)=>'<tr><td>'+esc(r.romaneio||r.numero_romaneio)+'</td><td>'+esc(r.destino||r.rota)+'</td><td>'+esc(r.motorista)+'</td><td>'+esc(r.placa||r.veiculo)+'</td><td>'+esc(r.peso||r.peso_total_kg)+'</td><td>'+esc(r.volumes||r.volume_total)+'</td>'+cell(startOf(r))+cell(endOf(r))+'<td>'+badge(r.resultado||r.status||'PENDENTE',resultClass(r.resultado||r.status))+'</td></tr>').join('');
    return myTablePage('Meus Carregamentos','Data e hora obrigatórias no início e no fim da operação.',['Romaneio','Rota/Destino','Motorista','Placa','Peso','Volumes','Início — Data / Hora','Fim — Data / Hora','Resultado'],rows,'carregamentos');
  };

  window.atividadesPage=function(){
    const d=userActs();
    const rows=d.map((e,i)=>'<tr><td>'+esc(e.tipo||'Atividade')+'</td><td>'+esc(e.descricao_original||e.descricao||e.atividade||e.texto||e.detalhes||'')+'</td>'+cell(startOf(e))+cell(endOf(e))+'<td>'+badge(e.status||'PENDENTE',resultClass(e.status))+'</td><td><button class="btn secondary" onclick="activityDetail('+i+')">Ver</button></td></tr>').join('');
    return tablePage('Minhas Atividades','Cada atividade registra data/hora de início e, quando encerrada, data/hora de fim.',['Tipo','Descrição original','Início — Data / Hora','Fim — Data / Hora','Status','Detalhes'],rows);
  };

  window.conferenciasPage=function(){
    const d=userConfs();
    const rows=d.map(r=>'<tr><td>'+esc(r.operacao||r.tipo_operacao)+'</td><td>'+esc(r.referencia||r.lote||r.pedido)+'</td>'+cell(r.inicio||r.hora,'datetime-cell')+cell(r.fim||r.hora,'datetime-cell')+'<td>'+badge(r.resultado||'PENDENTE',resultClass(r.resultado))+'</td><td>'+esc(r.ocorrencia||'—')+'</td><td>'+esc(r.quantidade_divergente||r.qtd||'—')+'</td><td>'+esc(r.observacao||'—')+'</td></tr>').join('');
    return tablePage('Minhas Conferências','Data e hora de início e fim registradas na conferência.',['Operação','Lote/Pedido','Início — Data / Hora','Fim — Data / Hora','Resultado','Divergência','Qtd. divergente','Observação'],rows);
  };
})();


/* ===== FORMATAÇÃO GLOBAL DE DATA E HORA ===== */
(function(){
  const pad=n=>String(n).padStart(2,'0');
  function parse(v){
    if(v==null||v==='')return null;
    const s=String(v).trim();
    let m=s.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{1,2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?$/);
    if(m)return new Date(+m[1],+m[2]-1,+m[3],+m[4],+m[5],+(m[6]||0));
    m=s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if(m)return new Date(+m[1],+m[2]-1,+m[3]);
    m=s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})(?:[ T]+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/);
    if(m)return new Date(+m[3],+m[2]-1,+m[1],+(m[4]||0),+(m[5]||0),+(m[6]||0));
    return null;
  }
  function formatValue(v){
    const d=parse(v);
    if(!d)return null;
    const date=pad(d.getDate())+'/'+pad(d.getMonth()+1)+'/'+d.getFullYear();
    const hasTime=/T|:/.test(String(v));
    return {date,time:hasTime?pad(d.getHours())+':'+pad(d.getMinutes()):'',hasTime};
  }
  window.formatDateTimeBR=function(v){
    const x=formatValue(v);
    return x?(x.hasTime?x.date+' '+x.time:x.date):String(v??'');
  };

  function formatElement(el){
    if(!el||el.dataset.datetimeFormatted==='1')return;
    const tag=String(el.tagName||'').toLowerCase();
    if(['script','style','input','textarea','select','option','button'].includes(tag))return;
    if(el.children.length>0 && !el.classList.contains('datetime-cell'))return;
    const raw=(el.textContent||'').trim();
    if(!raw)return;
    const x=formatValue(raw);
    if(!x)return;
    if(x.hasTime){
      el.classList.add('datetime-cell');
      el.innerHTML='<span>'+x.date+'</span><small>🕐 '+x.time+'</small>';
    }else{
      el.textContent=x.date;
    }
    el.dataset.datetimeFormatted='1';
  }

  function scan(root){
    if(!root)return;
    if(root.nodeType===1)formatElement(root);
    const nodes=root.querySelectorAll?root.querySelectorAll('td,th,span,small,div,p,label,strong,b'): [];
    nodes.forEach(formatElement);
  }

  function run(){
    scan(document.body);
    document.querySelectorAll('input[type="date"],input[type="datetime-local"]').forEach(i=>{
      i.removeAttribute('data-datetime-formatted');
    });
  }

  const oldRender=window.render;
  if(typeof oldRender==='function'){
    window.render=function(){
      oldRender();
      setTimeout(run,20);
      setTimeout(run,150);
    };
  }
  const observer=new MutationObserver(mutations=>{
    let changed=false;
    mutations.forEach(m=>{if(m.addedNodes&&m.addedNodes.length)changed=true;});
    if(changed)setTimeout(run,0);
  });
  setTimeout(()=>observer.observe(document.body,{childList:true,subtree:true}),300);
  setTimeout(run,100);
})();


/* ===== ATUALIZAÇÃO AUTOMÁTICA SEM RECARREGAR A TELA ===== */
(function(){
  let busy=false;
  window.startAutoSync=function(){
    if(window.__sigaAutoSync)return;
    window.__sigaAutoSync=setInterval(async()=>{
      if(busy||!state.user)return;
      busy=true;
      try{
        const url=(localStorage.getItem(STORAGE_API)||'').trim();
        if(url){
          const res=await fetch(url,{cache:'no-store'});
          if(res.ok){
            const json=await res.json();
            portalData={
              separacoes:Array.isArray(json.separacoes)?json.separacoes:portalData.separacoes,
              carregamentos:Array.isArray(json.carregamentos)?json.carregamentos:portalData.carregamentos,
              atividades:Array.isArray(json.atividades)?json.atividades:portalData.atividades,
              conferencias:Array.isArray(json.conferencias)?json.conferencias:portalData.conferencias
            };
            saveData();
          }
        }
        state.lastSync=Date.now();
      }catch(e){}finally{busy=false;}
    },10000);
  };
  document.addEventListener('DOMContentLoaded',()=>startAutoSync());
})();
