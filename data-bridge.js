/* SIGA 3.0 — camada de entrada de dados
   Preparada para futura conexão com Supabase/API.
   Não depende de banco e não altera o fluxo atual do sistema.
*/
(function(){
  'use strict';
  const STORE='siga30_portal_data_v3';
  const KEYS=['separacoes','carregamentos','atividades','conferencias'];

  const empty=()=>({separacoes:[],carregamentos:[],atividades:[],conferencias:[]});
  const clone=o=>JSON.parse(JSON.stringify(o));
  const read=()=>{try{return JSON.parse(localStorage.getItem(STORE)||'null')||empty();}catch(e){return empty();}};
  const write=data=>{
    const base=Object.assign(empty(),read(),data||{});
    KEYS.forEach(k=>{if(!Array.isArray(base[k]))base[k]=[];});
    localStorage.setItem(STORE,JSON.stringify(base));
    window.dispatchEvent(new CustomEvent('siga:data-updated',{detail:clone(base)}));
    return base;
  };

  function normalizeRecord(type,r){
    const x=Object.assign({},r||{});
    x.filial_id=x.filial_id||x.filial||x.cd||'CDD';
    x.usuario_id=x.usuario_id||x.user_id||x.usuario||x.operador_id||x.operador||x.conferente_id||'';
    x.recebido_em=x.recebido_em||new Date().toISOString();
    if(type==='atividades'){
      x.hora=x.hora||x.data_hora||x.dataHora||x.timestamp||x.created_at||x.inicio||x.recebido_em;
      x.tipo=x.tipo||x.acao||x.evento||x.operacao_tipo||'Atividade';
      x.operacao=x.operacao||x.operacao_lote||x.lote_operacao||x.lote||'';
      x.referencia=x.referencia||x.pedido||x.numero_pedido||x.numero_separacao||x.numero_romaneio||'';
      x.romaneio=x.romaneio||x.referencia_romaneio||x.referencia_romaneio_transbordo||'';
      x.rota=x.rota||x.rota_destino||x.destino||x.unidade_destino||'';
      x.etapa=x.etapa||x.fase||x.status_etapa||x.tipo||'';
      x.status=x.status||x.resultado||'Pendente';
      x.prioridade=x.prioridade||'Normal';
      x.operador=x.operador||x.operador_nome||x.operador_id||x.usuario||x.usuario_id||'';
      x.descricao_original=x.descricao_original||x.descricao||x.observacao||'';
    }
    return x;
  }

  window.SIGADataBridge={
    version:'1.0',
    status:'ready',
    getData:()=>clone(read()),
    replace:function(payload){return write(payload);},
    merge:function(payload){
      const current=read();
      const next=Object.assign({},current);
      KEYS.forEach(k=>{
        if(Array.isArray(payload&&payload[k])) next[k]=current[k].concat(payload[k].map(x=>normalizeRecord(k,x)));
      });
      return write(next);
    },
    receive:function(type,record){
      if(!KEYS.includes(type)) throw new Error('Tipo de operação inválido: '+type);
      const current=read();
      current[type].push(normalizeRecord(type,record));
      return write(current);
    },
    clear:function(type){
      if(type && KEYS.includes(type)){const d=read();d[type]=[];return write(d);}
      return write(empty());
    },
    configure:function(config){
      window.SIGA_DATA_CONFIG=Object.assign({mode:'supabase-ready',polling:false,endpoint:''},config||{});
      return clone(window.SIGA_DATA_CONFIG);
    },
    async fetchFromAPI(url,options){
      const response=await fetch(url,options||{});
      if(!response.ok) throw new Error('Falha ao receber dados: HTTP '+response.status);
      const payload=await response.json();
      return write(payload);
    }
  };

  window.SIGA_DATA_CONFIG={mode:'supabase-ready',polling:false,endpoint:''};
})();
