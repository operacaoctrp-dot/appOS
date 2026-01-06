export default defineNuxtRouteMiddleware(async (to) => {
  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ["/login", "/reset-password"];
  const isPublicRoute = publicRoutes.includes(to.path);

  // No servidor (SSR), sempre permitir renderização inicial
  // O cliente vai verificar autenticação depois
  if (process.server) {
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
