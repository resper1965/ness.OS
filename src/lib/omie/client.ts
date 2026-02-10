/**
 * Cliente HTTP para API Omie (server-only).
 * Credenciais: OMIE_APP_KEY e OMIE_APP_SECRET em env.
 * Base: https://app.omie.com.br/api/v1
 */

const OMIE_BASE = 'https://app.omie.com.br/api/v1';

export type OmieApiError = {
  faultstring?: string;
  faultcode?: string;
  descricao?: string;
};

function getCredentials(): { appKey: string; appSecret: string } {
  const appKey = process.env.OMIE_APP_KEY;
  const appSecret = process.env.OMIE_APP_SECRET;
  if (!appKey || !appSecret) {
    throw new Error('OMIE_APP_KEY e OMIE_APP_SECRET devem estar definidos.');
  }
  return { appKey, appSecret };
}

/**
 * POST para um endpoint Omie. Inclui app_key e app_secret no body.
 */
export async function omiePost<TBody extends Record<string, unknown>, TResponse = unknown>(
  path: string,
  body: TBody,
  options?: { signal?: AbortSignal; timeoutMs?: number }
): Promise<TResponse> {
  const { appKey, appSecret } = getCredentials();
  const url = `${OMIE_BASE}/${path.replace(/^\//, '')}`;
  const payload = {
    app_key: appKey,
    app_secret: appSecret,
    ...body,
  };

  const controller = new AbortController();
  const timeout = options?.timeoutMs ?? 30_000;
  const id = setTimeout(() => controller.abort(), timeout);
  const signal = options?.signal ?? controller.signal;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
  }).finally(() => clearTimeout(id));

  const data = (await res.json().catch(() => ({}))) as TResponse & { faultstring?: string; descricao?: string };
  if (!res.ok) {
    const errMsg = (data as OmieApiError).faultstring ?? (data as OmieApiError).descricao ?? res.statusText;
    throw new Error(`Omie API ${res.status}: ${errMsg}`);
  }
  if ((data as OmieApiError).faultstring) {
    throw new Error(`Omie: ${(data as OmieApiError).faultstring}`);
  }
  return data as TResponse;
}

/**
 * ListarClientes — lista clientes com paginação.
 * Payload: listar_clientes { pagina, registros_por_pagina, ...filtros }
 * Doc: https://app.omie.com.br/developer/
 */
export type OmieCliente = {
  codigo_cliente_omie?: string;
  razao_social?: string;
  cnpj_cpf?: string;
  email?: string;
  [key: string]: unknown;
};

/** Resposta ListarClientes: clientes_listfull_response — doc Omie usa clientes_cadastro */
export type ListarClientesResponse = {
  pagina?: number;
  total_de_paginas?: number;
  registros?: number;
  total_de_registros?: number;
  clientes_cadastro?: OmieCliente[];
  /** Fallback: alguns clientes usam lista_clientes_cadastro */
  lista_clientes_cadastro?: OmieCliente[];
};

/**
 * Filtro opcional para ListarClientes.
 * clientesFiltro.tags: no Omie cliente e fornecedor compartilham o mesmo cadastro;
 * usar tag (ex.: "Cliente") para trazer apenas quem tem essa tag.
 * Configurável via OMIE_TAG_APENAS_CLIENTE no env.
 */
export type ListarClientesFiltro = {
  /** Tags do cadastro (ex.: ["Cliente"] para excluir fornecedores). */
  tags?: string[];
};

export async function listarClientes(params: {
  pagina?: number;
  registros_por_pagina?: number;
  filtro?: ListarClientesFiltro;
}): Promise<ListarClientesResponse> {
  const { pagina = 1, registros_por_pagina = 50, filtro } = params;
  const param: Record<string, unknown> = { pagina, registros_por_pagina };
  if (filtro?.tags?.length) {
    param.clientesFiltro = {
      tags: filtro.tags.map((tag) => ({ tag })),
    };
  }
  return omiePost<{ call: string; param: unknown[] }, ListarClientesResponse>('geral/clientes/', {
    call: 'ListarClientes',
    param: [param],
  });
}

/**
 * ListarContasReceber — contas a receber (filtro por período).
 * Parâmetros conforme doc Omie (lcrListarRequest): filtrar_por_data_de, filtrar_por_data_ate (dd/mm/aaaa).
 * Resposta: lcrListarResponse com conta_receber_cadastro; cada item tem codigo_cliente_fornecedor e valor_documento.
 * @see https://app.omie.com.br/api/v1/financas/contareceber/
 */
export type OmieContaReceber = {
  codigo_cliente_omie?: string;
  codigo_cliente_fornecedor?: number;
  valor?: number;
  valor_documento?: number;
  data_vencimento?: string;
  [key: string]: unknown;
};

export type ListarContasReceberResponse = {
  total_de_registros?: number;
  total_de_paginas?: number;
  conta_receber_cadastro?: OmieContaReceber[];
  /** Fallback: nome alternativo em algumas versões da API */
  lista_contas_receber?: OmieContaReceber[];
};

export async function listarContasReceber(params: {
  filtrar_por_data_de?: string;
  filtrar_por_data_ate?: string;
  pagina?: number;
  registros_por_pagina?: number;
}): Promise<ListarContasReceberResponse> {
  const {
    filtrar_por_data_de,
    filtrar_por_data_ate,
    pagina = 1,
    registros_por_pagina = 100,
  } = params;
  const param: Record<string, unknown> = { pagina, registros_por_pagina };
  if (filtrar_por_data_de) param.filtrar_por_data_de = filtrar_por_data_de;
  if (filtrar_por_data_ate) param.filtrar_por_data_ate = filtrar_por_data_ate;
  return omiePost<{ call: string; param: unknown[] }, ListarContasReceberResponse>('financas/contareceber/', {
    call: 'ListarContasReceber',
    param: [param],
  });
}

/**
 * ListarServicos — lista cadastros de serviços.
 * @see https://app.omie.com.br/api/v1/servicos/servico/
 */
export type OmieServico = {
  int_serv_codigo?: number;
  codigo?: string;
  descricao?: string;
  valor_unitario?: number;
  [key: string]: unknown;
};

export type ListarServicosResponse = {
  pagina?: number;
  total_de_paginas?: number;
  servicos_cadastro?: OmieServico[];
};

export async function listarServicos(params: {
  pagina?: number;
  registros_por_pagina?: number;
}): Promise<ListarServicosResponse> {
  const { pagina = 1, registros_por_pagina = 50 } = params;
  return omiePost<{ call: string; param: unknown[] }, ListarServicosResponse>('servicos/servico/', {
    call: 'ListarServicos',
    param: [{ pagina, registros_por_pagina }],
  });
}

/**
 * ListarOrdensServico — lista ordens de serviço.
 * @see https://app.omie.com.br/api/v1/servicos/os/
 */
export async function listarOrdensServico(params: {
  pagina?: number;
  registros_por_pagina?: number;
  filtrar_por_data_de?: string;
  filtrar_por_data_ate?: string;
}): Promise<unknown> {
  const { pagina = 1, registros_por_pagina = 50, filtrar_por_data_de, filtrar_por_data_ate } = params;
  const param: Record<string, unknown> = { pagina, registros_por_pagina };
  if (filtrar_por_data_de) param.data_de = filtrar_por_data_de;
  if (filtrar_por_data_ate) param.data_ate = filtrar_por_data_ate;
  return omiePost('servicos/os/', {
    call: 'ListarOS',
    param: [param],
  });
}
