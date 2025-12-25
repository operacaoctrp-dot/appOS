export default defineNuxtPlugin({
  name: "auth",
  enforce: "pre",
  async setup() {
    const { initAuth, user } = useAuth();

    // Sempre inicializar autenticação
    await initAuth();

    console.log(
      "[Auth Plugin] Inicializado. User:",
      user.value?.email || "não autenticado"
    );
  },
});
