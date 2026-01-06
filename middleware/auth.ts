export default defineNuxtRouteMiddleware(async (to) => {
  const { user, initAuth, authInitialized } = useAuth();

  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ["/login", "/reset-password"];
  const isPublicRoute = publicRoutes.includes(to.path);

  // No servidor (SSR), permitir navegação para rotas públicas
  // Para rotas privadas, deixar o cliente verificar autenticação
  if (process.server) {
    // Se está tentando acessar rota pública, permitir
    if (isPublicRoute) {
      return;
    }
    // Para rotas privadas, renderizar a página e deixar o cliente verificar
    // Se não estiver autenticado, o cliente vai redirecionar
    return;
  }

  // No cliente, garantir inicialização apenas uma vez
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
