import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Rotas públicas (não requerem autenticação)
const PUBLIC_ROUTES = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify',
];

// Rotas que requerem roles específicas
const ROLE_ROUTES: Record<string, string[]> = {
  '/admin': ['superadmin'],
  '/admin/users': ['superadmin'],
  '/admin/permissions': ['superadmin'],
};

// Rotas por módulo
const MODULE_ROUTES: Record<string, string> = {
  '/fin': 'fin',
  '/ops': 'ops',
  '/growth': 'growth',
  '/jur': 'jur',
  '/gov': 'gov',
  '/people': 'people',
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignorar assets e API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // arquivos estáticos
  ) {
    return NextResponse.next();
  }

  // Criar response para manipular cookies
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Criar cliente Supabase
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Verificar sessão
  const { data: { user } } = await supabase.auth.getUser();

  // Rota pública - permitir acesso
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    // Se já está logado, redirecionar para dashboard
    if (user) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return response;
  }

  // Rota protegida - verificar autenticação
  if (!user) {
    const redirectUrl = new URL('/auth/login', request.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Buscar perfil e permissões do usuário
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, ativo')
    .eq('id', user.id)
    .single();

  // Usuário inativo
  if (!profile?.ativo) {
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL('/auth/login?error=inactive', request.url));
  }

  // Verificar rotas com roles específicas
  for (const [route, roles] of Object.entries(ROLE_ROUTES)) {
    if (pathname.startsWith(route)) {
      if (!roles.includes(profile.role)) {
        return NextResponse.redirect(new URL('/dashboard?error=unauthorized', request.url));
      }
    }
  }

  // Verificar rotas de módulos
  for (const [route, module] of Object.entries(MODULE_ROUTES)) {
    if (pathname.startsWith(route)) {
      // Superadmin tem acesso a tudo
      if (profile.role === 'superadmin') {
        return response;
      }

      // Verificar permissão no módulo
      const { data: permission } = await supabase
        .from('user_permissions')
        .select('id')
        .eq('user_id', user.id)
        .eq('modulo', module)
        .maybeSingle();

      if (!permission) {
        return NextResponse.redirect(new URL('/dashboard?error=no_module_access', request.url));
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
