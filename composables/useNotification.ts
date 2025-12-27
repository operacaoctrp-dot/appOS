export const useNotification = () => {
  const { $toast } = useNuxtApp();

  const success = (mensagem: string, titulo?: string) => {
    $toast.success(titulo ? `${titulo}: ${mensagem}` : mensagem, {
      timeout: 3000,
    });
  };

  const error = (mensagem: string, titulo?: string) => {
    $toast.error(titulo ? `${titulo}: ${mensagem}` : mensagem, {
      timeout: 4000,
    });
  };

  const warning = (mensagem: string, titulo?: string) => {
    $toast.warning(titulo ? `${titulo}: ${mensagem}` : mensagem, {
      timeout: 3500,
    });
  };

  const info = (mensagem: string, titulo?: string) => {
    $toast.info(titulo ? `${titulo}: ${mensagem}` : mensagem, {
      timeout: 3000,
    });
  };

  // Mantém compatibilidade com o sistema de modal para confirmações
  const confirm = (mensagem: string, titulo = "Confirmação") => {
    return new Promise<boolean>((resolve) => {
      // Para confirmações, ainda usamos o modal
      const { confirm: modalConfirm } = useModal();
      modalConfirm(mensagem, titulo).then(resolve);
    });
  };

  return {
    success,
    error,
    warning,
    info,
    confirm,
  };
};
