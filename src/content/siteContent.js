export const navigation = [
  { label: 'Soluções', href: '/#solucoes' },
  { label: 'Sobre', href: '/sobre' },
  { label: 'Blog', href: '/blog' },
]

export const projects = [
  {
    type: 'project', slug: 'pedidos-do-comercial-a-expedicao', sector: 'Distribuição', category: 'Projetos',
    title: 'Pedidos fluindo do comercial à expedição', result: '68%', metricLabel: 'menos retrabalho operacional',
    tags: ['ERP', 'WMS', 'BI'], date: '18 JUN 2026', read: '7 min',
    summary: 'Uma operação conectada para que pedidos, estoque e expedição compartilhem o mesmo estado do trabalho.',
    sections: [
      ['Contexto', 'O fluxo atravessava comercial, estoque e expedição com atualizações manuais entre etapas.'],
      ['Problema', 'A equipe precisava reconhecer o estado real de cada pedido sem depender de planilhas paralelas.'],
      ['Arquitetura', 'Uma camada de integração organiza eventos do ERP e do WMS e entrega uma visão operacional única.'],
      ['Resultado', 'O resultado atual registrado no projeto é uma redução de 68% no retrabalho operacional.'],
    ],
  },
  {
    type: 'project', slug: 'faturamento-recorrente-sem-planilhas', sector: 'Serviços B2B', category: 'Projetos',
    title: 'Faturamento recorrente sem planilhas paralelas', result: '11h', metricLabel: 'de operação manual poupadas por semana',
    tags: ['CRM', 'Financeiro', 'NFe'], date: '03 JUN 2026', read: '6 min',
    summary: 'Contratos, faturamento e documentos fiscais coordenados num fluxo verificável e preparado para exceções.',
    sections: [
      ['Contexto', 'O fechamento recorrente exigia conferências repetidas entre CRM, financeiro e emissão fiscal.'],
      ['Problema', 'Planilhas intermediárias escondiam exceções e tornavam o fechamento dependente de poucas pessoas.'],
      ['Implementação', 'O processo passou a validar contratos, preparar cobranças e encaminhar divergências para decisão humana.'],
      ['Resultado', 'O resultado atual registrado é uma economia de 11 horas de operação manual por semana.'],
    ],
  },
  {
    type: 'project', slug: 'painel-unico-industria', sector: 'Indústria', category: 'Projetos',
    title: 'Um painel único para chão de fábrica e gestão', result: '99,7%', metricLabel: 'de disponibilidade nos últimos 12 meses',
    tags: ['MES', 'IoT', 'ERP'], date: '21 MAI 2026', read: '8 min',
    summary: 'Sinais de produção, manutenção e gestão reunidos sem apagar os sistemas que já sustentavam a fábrica.',
    sections: [
      ['Contexto', 'A produção e a gestão observavam o mesmo processo por sistemas e recortes diferentes.'],
      ['Problema', 'A divergência entre fontes atrasava decisões e dificultava reconhecer falhas de integração.'],
      ['Arquitetura', 'Uma camada observável conecta MES, sinais IoT e ERP, preservando a responsabilidade de cada sistema.'],
      ['Resultado', 'A disponibilidade registrada nos últimos 12 meses é de 99,7%.'],
    ],
  },
]

export const posts = [
  {
    type: 'article', slug: 'integrar-ou-substituir-erp', category: 'Arquitetura', date: '12 AGO 2026', read: '6 min',
    title: 'Quando integrar é melhor do que substituir seu ERP',
    summary: 'Se o ERP ainda sustenta financeiro e fiscal, substituí-lo pode ampliar o risco sem resolver o gargalo.',
    sections: [
      ['O ponto de partida', 'Trocar o sistema central parece uma resposta completa, mas o problema costuma estar nos fluxos que acontecem ao redor dele.'],
      ['Preservar o que funciona', 'Uma camada de integração bem delimitada mantém o núcleo confiável e libera novos processos por etapas.'],
      ['Decidir com evidência', 'Mapeie exceções, dependências e custo de transição antes de escolher entre integrar e substituir.'],
    ],
  },
  {
    type: 'article', slug: 'automacao-comeca-pelas-excecoes', category: 'Automação', date: '29 JUL 2026', read: '8 min',
    title: 'Automação saudável começa pelas exceções, não pelo caminho feliz',
    summary: 'O projeto ganha robustez quando define quem decide, quais dados precisa e como retoma o fluxo após uma falha.',
    sections: [
      ['O caminho feliz é a parte fácil', 'A sequência normal raramente representa todo o trabalho. É nas exceções que a operação revela suas regras reais.'],
      ['Automação com responsabilidade', 'Cada desvio precisa ter dados suficientes, uma pessoa responsável e um caminho seguro de retomada.'],
      ['Medir depois da entrega', 'Uma automação só está pronta quando reduz trabalho sem esconder risco operacional.'],
    ],
  },
  {
    type: 'article', slug: 'integracao-sem-observabilidade', category: 'Integrações', date: '08 JUL 2026', read: '5 min',
    title: 'O custo invisível de uma integração sem observabilidade',
    summary: 'Correlação, métricas e reprocessamento seguro transformam falhas silenciosas em ocorrências tratáveis.',
    sections: [
      ['Transportar não é integrar', 'Mover dados entre sistemas resolve apenas a primeira metade do problema.'],
      ['Falhas precisam de contexto', 'Identificadores de correlação e eventos legíveis permitem descobrir onde o processo parou.'],
      ['Retomar com segurança', 'Reprocessamento idempotente reduz intervenção manual e protege a consistência dos dados.'],
    ],
  },
]

export const journalItems = [...posts, ...projects]

export const aboutContent = {
  eyebrow: 'Sobre / Void',
  headline: ['Engenharia não começa', 'no código.', 'Começa entendendo', 'o que precisa funcionar.'],
  manifesto: '[TEXTO INSTITUCIONAL A DEFINIR]',
  introduction: 'A forma de trabalhar já está definida: entrar perto da operação, tornar decisões explícitas e continuar responsável pelo que chega à produção.',
  principles: [
    { verb: 'Ouvir', title: 'Começar pelo processo', text: 'Ferramentas vêm depois do diagnóstico.' },
    { verb: 'Testar', title: 'Projetar para o imprevisto', text: 'O sistema precisa funcionar fora do caminho feliz.' },
    { verb: 'Provar', title: 'Medir no trabalho real', text: 'A entrega termina quando o resultado aparece.' },
  ],
  values: ['Perseverança', 'Confiança', 'Lealdade'],
}
