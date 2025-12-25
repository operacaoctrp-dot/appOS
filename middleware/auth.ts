export default defineNuxtRouteMiddleware(async (to) => {
  // No servidor, não bloquear navegação (SSR)
  if (process.server) {
    return;
  }

  const { user, initAuth, authInitialized } = useAuth();

  // Garantir inicialização apenas uma vez
  if (!authInitialized.value) {
    await initAuth();
  }

  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ["/login", "/reset-password"];
  const isPublicRoute = publicRoutes.includes(to.path);

  // Se não está autenticado e tentando acessar rota protegida
  if (!user.value && !isPublicRoute) {
    return navigateTo("/login");
  }

  // Se está autenticado e tentando acessar login, redirecionar para home
  if (user.value && to.path === "/login") {
    return navigateTo("/");
  }
});
