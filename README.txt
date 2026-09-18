SIGA 3.0 — PORTAL DO OPERADOR / CONFERENTE

Atualização: fundo de login e fundo das telas com imagens fornecidas pelo usuário.
- login-truck.jpg = segunda imagem enviada, usada na tela de login.
- app-warehouse.jpg = primeira imagem enviada, usada como fundo das telas internas.

CONTAS DEMO
- Administrador: marco / 01022005 / CDD
- Operador: joao / 1234 / CDD
- Conferente: ana / 1234 / CDD
- Operador + Conferente: carlos / 1234 / CDD

ADMINISTRADOR
A tela "Cadastrar Usuários" só aparece para usuários com admin=true. O acesso também é protegido no JavaScript: não basta tentar abrir a tela diretamente.
O administrador pode cadastrar nome, usuário, senha, filial, função, status e permissões individuais.

PERMISSÕES
- visualizar minhas separações
- visualizar meus carregamentos
- visualizar minhas atividades
- visualizar minhas conferências
- visualizar meu desempenho

ATIVIDADES DO SIGA
O módulo foi preparado para receber atividades com descrições diferentes a cada lançamento. O campo descricao_original deve ser preservado sem exigir um nome fixo.
Exemplo de payload:
{
  "tipo": "atividade",
  "descricao_original": "texto exatamente como registrado no SIGA",
  "inicio": "2026-09-18T08:15:00",
  "fim": "2026-09-18T09:02:00",
  "usuario_id": "...",
  "status": "finalizada"
}

IMPORTANTE
Este pacote é um protótipo front-end. O localStorage permite testar cadastro/permissões no navegador, mas uma implantação real precisa de backend, autenticação segura e banco/API compartilhado com o SIGA 3.0. Não use senhas em texto puro em produção.
