import { ref, onMounted, onUnmounted } from "vue";

export const useOffline = () => {
  const isOnline = ref(true);
  const wasOffline = ref(false);

  const updateOnlineStatus = () => {
    const previousStatus = isOnline.value;
    isOnline.value = navigator.onLine;

    // Se voltou a ficar online após estar offline
    if (isOnline.value && !previousStatus) {
      wasOffline.value = true;
      console.log("Conexão restaurada!");

      // Sincronizar dados pendentes se houver
      syncPendingData();
    } else if (!isOnline.value) {
      wasOffline.value = true;
      console.log("Modo offline ativado");
    }
  };

  const syncPendingData = async () => {
    // Verificar se há dados pendentes no localStorage para sincronizar
    const pendingData = localStorage.getItem("pending-sync");
    if (pendingData) {
      try {
        const data = JSON.parse(pendingData);
        // Processar sincronização aqui
        console.log("Sincronizando dados pendentes:", data);

        // Após sincronizar com sucesso, limpar
        localStorage.removeItem("pending-sync");
      } catch (error) {
        console.error("Erro ao sincronizar dados pendentes:", error);
      }
    }
  };

  onMounted(() => {
    isOnline.value = navigator.onLine;
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
  });

  onUnmounted(() => {
    window.removeEventListener("online", updateOnlineStatus);
    window.removeEventListener("offline", updateOnlineStatus);
  });

  return {
    isOnline,
    wasOffline,
  };
};
