export default defineNuxtRouteMiddleware(async (to) => {
  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ["/login", "/reset-password"];
  const isPublicRoute = publicRoutes.includes(to.path);

  // No servidor (SSR), verificar se há cookie de sessão do Supabase
  if (process.server) {
    // Se está tentando acessar rota pública, permitir
    if (isPublicRoute) {
      return;
    }

    // Para rotas privadas no servidor, verificar se há cookies de sessão
    const cookies = useRequestHeaders(['cookie']);
    const hasCookie = cookies.cookie?.includes('sb-') || false;
    
    // Se não há cookie, redirecionar para login
    if (!hasCookie) {
      return navigateTo('/login');
    }
    
    // Se há cookie, deixar renderizar (o cliente vai validar depois)
    return;
  }

  // No cliente, usar a lógica normal de autenticação
  const { user, initAuth, authInitialized } = useAuth();

  // Garantir inicialização apenas uma vez
  if (!authInitialized.value) {
    await initAuth();
  }

  // Se não está autenticado e tentando acessar rota protegida
  if (!user.value && !isPublicRoute) {
    return navigateTo("/login");
  }

  // Se está autenticado e tentando acessar login, redirecionar para home
  if (user.value && to.path === "/login") {
    return navigateTo("/");
  }
});
