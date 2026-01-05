import { ref, computed } from "vue";
import type { User, Session } from "@supabase/supabase-js";
import type { UserRole } from "~/types/user";

export const useAuth = () => {
  const supabase = useSupabase();
  const user = useState<User | null>("auth-user", () => null);
  const session = useState<Session | null>("auth-session", () => null);
  const userRole = useState<UserRole | null>("user-role", () => null);
  const authInitialized = useState<boolean>("auth-initialized", () => false);
  const loading = ref(false);

  const isAuthenticated = computed(() => !!user.value);
  const isManutencao = computed(
    () => userRole.value === "manutencao" || userRole.value === "admin"
  );
  const isAdmin = computed(() => userRole.value === "admin");

  // Verificar e renovar sessão se necessário
  const refreshSession = async () => {
    try {
      console.log("Tentando renovar sessão...");
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error("Erro ao renovar sessão:", error);
        return false;
      }
      if (data.session) {
        session.value = data.session;
        user.value = data.session.user;
        console.log("Sessão renovada com sucesso para:", user.value?.email);
        return true;
      }
      console.warn("Nenhuma sessão retornada no refresh");
      return false;
    } catch (error) {
      console.error("Exceção ao renovar sessão:", error);
      return false;
    }
  };

  // Garantir que a sessão está válida antes de fazer operações
  const ensureValidSession = async (): Promise<boolean> => {
    try {
      // Primeiro, tentar obter a sessão atual
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      if (!currentSession) {
        console.log("Sem sessão ativa, tentando refresh...");
        const renewed = await refreshSession();
        if (!renewed) {
          console.warn("Falha ao renovar sessão, tentando novamente após 1 segundo...");
          // Esperar um pouco e tentar novamente (pode estar sincronizando)
          await new Promise(resolve => setTimeout(resolve, 1000));
          return await refreshSession();
        }
        return renewed;
      }

      // Verificar se o token está próximo de expirar (menos de 5 minutos)
      const expiresAt = currentSession.expires_at;
      if (expiresAt) {
        const now = Math.floor(Date.now() / 1000);
        const timeUntilExpiry = expiresAt - now;

        if (timeUntilExpiry < 300) {
          // menos de 5 minutos
          console.log(`Token expira em ${timeUntilExpiry}s, renovando...`);
          const renewed = await refreshSession();
          if (!renewed) {
            console.warn("Falha ao renovar sessão, tentando novamente...");
            await new Promise(resolve => setTimeout(resolve, 1000));
            return await refreshSession();
          }
          return renewed;
        }
      }

      // Sessão válida
      session.value = currentSession;
      user.value = currentSession.user;
      return true;
    } catch (error) {
      console.error("Erro ao verificar sessão:", error);
      const renewed = await refreshSession();
      if (!renewed) {
        console.warn("Falha no refresh, tentando novamente...");
        await new Promise(resolve => setTimeout(resolve, 1000));
        return await refreshSession();
      }
      return renewed;
    }
  };

  // Buscar role do usuário
  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("role")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Erro ao buscar role:", error);
        // Se não encontrar perfil, definir como visualizador por padrão
        userRole.value = "visualizador";
      } else {
        userRole.value = data?.role || "visualizador";
      }
    } catch (error) {
      console.error("Erro ao buscar role:", error);
      userRole.value = "visualizador";
    }
  };

  // Inicializar sessão
  const initAuth = async () => {
    try {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      if (currentSession) {
        session.value = currentSession;
        user.value = currentSession.user;
        await fetchUserRole(currentSession.user.id);
      }

      // Registrar listener apenas uma vez
      if (!authInitialized.value) {
        authInitialized.value = true;

        // Escutar mudanças de autenticação
        supabase.auth.onAuthStateChange(async (event, newSession) => {
          console.log(
            "Auth state changed:",
            event,
            "User:",
            newSession?.user?.email
          );
          session.value = newSession;
          user.value = newSession?.user ?? null;
          if (newSession?.user) {
            await fetchUserRole(newSession.user.id);
          } else {
            userRole.value = null;
          }
        });

        // Configurar refresh automático a cada 2 minutos
        if (process.client) {
          console.log(
            "Configurando refresh automático da sessão a cada 2 minutos"
          );
          setInterval(async () => {
            if (user.value) {
              console.log("Renovando sessão automaticamente...");
              const renewed = await refreshSession();
              console.log("Sessão renovada:", renewed);
            }
          }, 2 * 60 * 1000); // 2 minutos

          // Renovar sessão quando a página volta a ficar visível (após inatividade)
          document.addEventListener("visibilitychange", async () => {
            if (document.visibilityState === "visible" && user.value) {
              console.log(
                "Página voltou a ficar visível, verificando sessão..."
              );
              await ensureValidSession();
            }
          });

          // Renovar sessão quando o usuário interage após período de inatividade
          let lastActivity = Date.now();
          const checkInactivity = () => {
            const now = Date.now();
            const inactiveTime = now - lastActivity;
            // Se ficou inativo por mais de 1 minuto, renovar sessão
            if (inactiveTime > 60000 && user.value) {
              console.log(
                `Atividade detectada após ${Math.round(
                  inactiveTime / 1000
                )}s de inatividade, renovando sessão...`
              );
              ensureValidSession();
            }
            lastActivity = now;
          };

          ["mousedown", "keydown", "touchstart", "scroll"].forEach((event) => {
            document.addEventListener(event, checkInactivity, {
              passive: true,
            });
          });
        }
      }
    } catch (error) {
      console.error("Erro ao inicializar autenticação:", error);
    }
  };

  // Login com email e senha
  const signIn = async (email: string, password: string) => {
    loading.value = true;
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      session.value = data.session;
      user.value = data.user;

      return { success: true };
    } catch (error: any) {
      console.error("Erro no login:", error);

      // Traduzir mensagens de erro do Supabase
      let errorMessage = "Erro ao fazer login";
      if (error.message) {
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Email ou senha inválidos";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Email não confirmado";
        } else if (error.message.includes("User not found")) {
          errorMessage = "Usuário não encontrado";
        } else {
          errorMessage = error.message;
        }
      }

      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      loading.value = false;
    }
  };

  // Registro de novo usuário
  const signUp = async (email: string, password: string, metadata?: any) => {
    loading.value = true;
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (error) throw error;

      return {
        success: true,
        message: "Conta criada com sucesso! Verifique seu email.",
      };
    } catch (error: any) {
      console.error("Erro no registro:", error);

      let errorMessage = "Erro ao criar conta";
      if (error.message) {
        if (error.message.includes("User already registered")) {
          errorMessage = "Este email já está cadastrado";
        } else if (error.message.includes("Password should be at least")) {
          errorMessage = "A senha deve ter no mínimo 6 caracteres";
        } else if (error.message.includes("Unable to validate email")) {
          errorMessage = "Email inválido";
        } else {
          errorMessage = error.message;
        }
      }

      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      loading.value = false;
    }
  };

  // Logout
  const signOut = async () => {
    loading.value = true;
    try {
      // Limpar estados primeiro
      user.value = null;
      session.value = null;
      userRole.value = null;
      authInitialized.value = false;

      // Fazer logout no Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Redirecionar para login
      await navigateTo("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      loading.value = false;
    }
  };

  // Resetar senha
  const resetPassword = async (email: string) => {
    loading.value = true;
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      return {
        success: true,
        message:
          "Email de recuperação enviado! Verifique sua caixa de entrada.",
      };
    } catch (error: any) {
      console.error("Erro ao resetar senha:", error);

      let errorMessage = "Erro ao enviar email de recuperação";
      if (error.message) {
        if (error.message.includes("User not found")) {
          errorMessage = "Email não encontrado";
        } else if (error.message.includes("Unable to validate email")) {
          errorMessage = "Email inválido";
        } else {
          errorMessage = error.message;
        }
      }

      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      loading.value = false;
    }
  };

  // Atualizar senha
  const updatePassword = async (newPassword: string) => {
    loading.value = true;
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      return {
        success: true,
        message: "Senha atualizada com sucesso!",
      };
    } catch (error: any) {
      console.error("Erro ao atualizar senha:", error);

      let errorMessage = "Erro ao atualizar senha";
      if (error.message) {
        if (error.message.includes("Password should be at least")) {
          errorMessage = "A senha deve ter no mínimo 6 caracteres";
        } else if (error.message.includes("New password should be different")) {
          errorMessage = "A nova senha deve ser diferente da atual";
        } else {
          errorMessage = error.message;
        }
      }

      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      loading.value = false;
    }
  };

  return {
    user,
    session,
    userRole,
    loading,
    isAuthenticated,
    isManutencao,
    isAdmin,
    authInitialized,
    initAuth,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    fetchUserRole,
    refreshSession,
    ensureValidSession,
  };
};
