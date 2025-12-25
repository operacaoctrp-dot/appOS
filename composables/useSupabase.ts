import { createClient } from "@supabase/supabase-js";

// Criar instância única do Supabase client
let supabaseInstance: ReturnType<typeof createClient> | null = null;

export const useSupabase = () => {
  const config = useRuntimeConfig();

  // Retornar instância existente se já foi criada
  if (supabaseInstance) {
    return supabaseInstance;
  }

  // Criar nova instância apenas na primeira vez
  supabaseInstance = createClient(
    config.public.supabaseUrl,
    config.public.supabaseKey,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storage:
          typeof window !== "undefined" ? window.localStorage : undefined,
        storageKey: "supabase.auth.token",
      },
    }
  );

  return supabaseInstance;
};
