export default defineNuxtRouteMiddleware(async (to) => {
  const { user, isManutencao } = useAuth();

  // Se não está autenticado, redirecionar para login
  if (!user.value) {
    return navigateTo("/login");
  }

  // Se não tem permissão de manutenção, redirecionar
  if (!isManutencao.value) {
    return navigateTo({
      path: "/",
      query: { error: "sem-permissao" },
    });
  }
});
