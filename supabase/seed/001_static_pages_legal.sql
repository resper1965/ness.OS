-- Seed páginas legais (privacidade, termos) a partir de locales/pt/legal.json
-- Executar após migration 002

insert into public.static_pages (slug, title, seo_description, content_json, last_updated)
values (
  'privacidade',
  'Política de Privacidade',
  'Política de Privacidade da NESS - LGPD e proteção de dados pessoais.',
  '{
    "sections": [
      {"title": "1. Introdução", "content": "A NESS está comprometida com a proteção da privacidade e segurança dos dados pessoais de seus clientes, parceiros e usuários. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018) e demais regulamentações aplicáveis."},
      {"title": "2. Dados Coletados", "content": "Coletamos os seguintes tipos de dados pessoais:", "items": ["Dados de identificação: nome, e-mail, telefone, CPF/CNPJ", "Dados profissionais: empresa, cargo, área de atuação", "Dados de navegação: IP, cookies, logs de acesso", "Dados de comunicação: mensagens, feedbacks, solicitações"]},
      {"title": "3. Finalidade do Tratamento", "content": "Utilizamos seus dados para:", "items": ["Prestação de serviços contratados", "Comunicação sobre produtos, serviços e novidades", "Atendimento de solicitações e suporte técnico", "Cumprimento de obrigações legais e regulatórias", "Análise e melhoria de nossos serviços", "Segurança da informação e prevenção de fraudes"]},
      {"title": "4. Base Legal", "content": "O tratamento de dados pessoais pela NESS tem como base legal: consentimento do titular, execução de contrato, cumprimento de obrigação legal, legítimo interesse e proteção do crédito."},
      {"title": "5. Compartilhamento de Dados", "content": "Seus dados podem ser compartilhados com:", "items": ["Parceiros comerciais e fornecedores de serviços", "Autoridades governamentais quando exigido por lei", "Empresas do grupo NESS para finalidades compatíveis"], "note": "Nunca vendemos seus dados pessoais a terceiros."},
      {"title": "6. Segurança", "content": "Implementamos medidas técnicas e organizacionais adequadas para proteger seus dados contra acesso não autorizado, perda, destruição ou alteração, incluindo: criptografia, controles de acesso, monitoramento contínuo, auditorias de segurança e treinamento de equipe."},
      {"title": "7. Direitos do Titular", "content": "Você tem direito a:", "items": ["Confirmar a existência de tratamento de seus dados", "Acessar seus dados", "Corrigir dados incompletos, inexatos ou desatualizados", "Solicitar a anonimização, bloqueio ou eliminação de dados", "Solicitar a portabilidade de dados", "Revogar o consentimento", "Informar-se sobre o compartilhamento de dados"]},
      {"title": "8. Retenção de Dados", "content": "Mantemos seus dados pelo período necessário para cumprir as finalidades descritas nesta política, respeitando os prazos legais de retenção e prescrição."},
      {"title": "9. Cookies", "content": "Utilizamos cookies e tecnologias similares para melhorar sua experiência. Para mais informações, consulte nossa Política de Cookies."},
      {"title": "10. Alterações", "content": "Podemos atualizar esta política periodicamente. Notificaremos sobre alterações significativas através de nosso site ou por e-mail."},
      {"title": "11. Contato", "content": "Para exercer seus direitos ou esclarecer dúvidas: DPO: privacy@ness.com.br | Telefone: +55 (11) 2504-7650 | Endereço: Rua George Ohm 230 Torre A Cj 82, Brooklin Paulista, São Paulo/SP - CEP 04576-020"}
    ]
  }'::jsonb,
  '2025-01-15'
)
on conflict (slug) do update set
  title = excluded.title,
  seo_description = excluded.seo_description,
  content_json = excluded.content_json,
  last_updated = excluded.last_updated;

insert into public.static_pages (slug, title, seo_description, content_json, last_updated)
values (
  'termos',
  'Termos de Uso',
  'Termos de Uso do site e serviços da NESS.',
  '{
    "sections": [
      {"title": "1. Aceitação dos Termos", "content": "Ao acessar e utilizar o site e os serviços da NESS, você concorda com estes Termos de Uso. Se você não concorda com qualquer parte destes termos, não deve utilizar nossos serviços."},
      {"title": "2. Definições", "items": ["NESS: NESS Processos e Tecnologia Ltda., CNPJ 72.027.097/0001-37", "Usuário: Pessoa física ou jurídica que acessa e utiliza nossos serviços", "Serviços: Todos os produtos, soluções e serviços oferecidos pela NESS", "Plataforma: Site, aplicações e sistemas da NESS"]},
      {"title": "3. Uso da Plataforma", "content": "Ao utilizar nossa plataforma, você concorda em:", "items": ["Fornecer informações verdadeiras, precisas e atualizadas", "Manter a confidencialidade de suas credenciais de acesso", "Não utilizar a plataforma para fins ilícitos ou não autorizados", "Não tentar violar a segurança ou integridade dos sistemas", "Respeitar os direitos de propriedade intelectual da NESS"]},
      {"title": "4. Serviços Oferecidos", "content": "A NESS oferece: n.secops, n.infraops, n.devarch, n.autoops, n.privacy, n.cirt, forense.io, trustness.", "items": ["n.secops: Segurança operacional gerenciada 24x7", "n.infraops: Infraestrutura e help desk ITIL", "n.devarch: Arquitetura e SDLC seguro", "n.autoops: Automação com IA e orquestração", "n.privacy: Plataforma SaaS de privacidade e LGPD", "n.cirt: Resposta a incidentes cibernéticos", "forense.io: Investigação digital forense", "trustness.: Plataforma de confiança digital"]},
      {"title": "5. Contratação de Serviços", "content": "A contratação de serviços está sujeita a proposta comercial específica, que detalhará escopo, prazos, valores e condições. A prestação de serviços inicia-se após assinatura do contrato e/ou aceite da proposta comercial."},
      {"title": "6. Responsabilidades do Usuário", "content": "O usuário é responsável por garantir a adequação dos serviços às suas necessidades, fornecer informações necessárias, manter ambiente adequado, cumprir obrigações de pagamento e respeitar a propriedade intelectual da NESS."},
      {"title": "7. Responsabilidades da NESS", "content": "A NESS compromete-se a prestar os serviços conforme escopo contratado, manter equipe qualificada, garantir confidencialidade, cumprir regulamentações e fornecer suporte conforme SLA."},
      {"title": "8. Propriedade Intelectual", "content": "Todos os direitos de propriedade intelectual da plataforma, metodologias e documentação da NESS são de propriedade exclusiva. O usuário recebe apenas licença de uso limitada."},
      {"title": "9. Confidencialidade", "content": "As partes comprometem-se a manter confidencialidade sobre informações sensíveis trocadas durante a prestação dos serviços."},
      {"title": "10. Limitação de Responsabilidade", "content": "A NESS não se responsabiliza por danos indiretos, lucros cessantes, falhas causadas por terceiros ou uso inadequado pelos usuários."},
      {"title": "11. Prazo e Rescisão", "content": "Os contratos têm prazo determinado conforme proposta comercial. A rescisão antecipada está sujeita às condições contratuais específicas."},
      {"title": "12. Modificações", "content": "A NESS reserva-se o direito de modificar estes Termos a qualquer momento. Alterações entram em vigor após publicação no site."},
      {"title": "13. Lei Aplicável e Foro", "content": "Estes termos são regidos pelas leis brasileiras. Fica eleito o foro da Comarca de São Paulo/SP."},
      {"title": "14. Contato", "content": "Para dúvidas: contato@ness.com.br | Telefone: +55 (11) 2504-7650 | Rua George Ohm 230 Torre A Cj 82, Brooklin Paulista, São Paulo/SP - CEP 04576-020"}
    ]
  }'::jsonb,
  '2025-01-15'
)
on conflict (slug) do update set
  title = excluded.title,
  seo_description = excluded.seo_description,
  content_json = excluded.content_json,
  last_updated = excluded.last_updated;
