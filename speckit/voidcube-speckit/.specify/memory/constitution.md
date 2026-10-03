# VoidCube Constitution

**Version:** 1.0.0  
**Ratified:** 2026-09-14  
**Scope:** Toda a plataforma VoidCube, incluindo site público, dashboard, backend central e módulos futuros.

## Core Principles

### I. Modularidade e contratos públicos

O sistema MUST ser organizado em módulos com responsabilidades claras e baixo acoplamento. Um módulo só pode depender de outro por interfaces públicas documentadas. Interfaces públicas MUST possuir responsabilidade, dependências, configuração, DTOs ou tipos expostos, eventos e erros documentados quando aplicável. Entidades internas de persistência, incluindo entidades JPA, MUST NOT atravessar fronteiras públicas entre módulos.

Mudanças incompatíveis em interfaces públicas MUST criar uma nova versão do contrato em vez de quebrar consumidores existentes. Eventos públicos que mudarem de forma incompatível MUST ser publicados como novos eventos versionados.

### II. Código pequeno, reutilizável e de fácil manutenção

Arquivos e unidades de código MUST permanecer pequenos e coesos. A solução MUST priorizar reutilização, separação por contexto e redução de redundância. Dependências externas, bibliotecas, frameworks e serviços adicionais MUST ser minimizados e adicionados apenas quando justificarem claramente sua complexidade e custo de manutenção.

### III. Segurança, isolamento e menor privilégio

Dados de empresas MUST permanecer isolados por empresa. Autorização MUST ser validada no backend e não pode depender exclusivamente de controles do frontend. Usuários MUST receber apenas os privilégios necessários para sua operação e permissões MUST ser avaliadas no contexto da empresa ativa.

A existência de empresas, módulos ou recursos MUST NOT ser revelada a usuários não autorizados quando essa revelação representar exposição indevida de informação. Módulos contratados MUST ser verificados antes de liberar funcionalidades correspondentes. Dados sensíveis MUST receber tratamento específico de segurança.

Credenciais, tokens, chaves de API e demais segredos MUST permanecer fora do código-fonte, MUST ser fornecidos por variáveis de ambiente ou mecanismos equivalentes, MUST NOT aparecer em logs, MUST suportar rotação e MUST permanecer separados por ambiente.

### IV. Performance mensurável

Performance MUST possuir limites mensuráveis para áreas críticas, incluindo dashboard, API, banco de dados, autenticação e módulos. Regressões de performance acima dos limites definidos MUST impedir a conclusão de uma alteração ou release até correção ou aprovação explícita de exceção.

Para o site público, os requisitos de performance definidos na especificação e checklist da feature MUST ser tratados como gates de entrega.

### V. Qualidade verificável

Alterações relevantes MUST passar por build, testes, verificações de segurança e verificações de performance antes de serem consideradas concluídas. Testes automatizados MUST existir para alterações relevantes de acordo com o risco e a área modificada.

Build falhando, testes obrigatórios falhando, vulnerabilidade crítica, regressão de performance, quebra de isolamento entre empresas ou falha de autorização MUST bloquear uma entrega.

### VI. Observabilidade e isolamento de falhas

O sistema MUST possuir logs, rastreamento de erros, métricas ou sinais de performance, health checks e correlation IDs quando aplicável. Falhas internas de um módulo SHOULD ser isoladas para evitar propagação desnecessária aos demais módulos.

Eventos operacionais relevantes, falhas de integração e tentativas de acesso ocultadas com HTTP 404 por motivo de segurança MUST ser registradas para análise administrativa.

### VII. Evolução segura dos dados

Alterações estruturais de banco de dados MUST utilizar migrations versionadas. Exclusões de registros importantes MUST respeitar as regras de retenção e auditoria definidas no modelo de dados. Histórico de auditoria MUST sobreviver à exclusão física dos registros relacionados quando assim definido pelo domínio.

## Documentation Requirements

Cada módulo MUST documentar, no mínimo:

- sua responsabilidade;
- suas interfaces públicas;
- suas dependências;
- sua configuração necessária;
- seus eventos públicos e erros quando existirem;
- as decisões que afetem compatibilidade ou isolamento.

## Governance

Esta constituição prevalece sobre preferências locais de implementação. Exceções ou alterações futuras MUST possuir justificativa documentada. Mudanças que enfraqueçam segurança, isolamento, qualidade, observabilidade ou compatibilidade MUST explicitar o risco aceito e a razão pela qual uma alternativa compatível não foi suficiente.

Mudanças incompatíveis em contratos públicos MUST ser versionadas. Mudanças de banco MUST ser realizadas por migrations. Novas dependências externas MUST ser justificadas e mantidas no mínimo necessário.

Toda feature MUST executar um Constitution Check durante o planejamento e antes da conclusão da implementação.
