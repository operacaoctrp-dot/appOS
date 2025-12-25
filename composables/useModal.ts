interface ModalState {
  show: boolean;
  titulo: string;
  mensagem: string;
  tipo: "alert" | "confirm" | "success" | "error";
  resolve?: (value: boolean) => void;
}

export const useModal = () => {
  const state = useState<ModalState>("modal", () => ({
    show: false,
    titulo: "",
    mensagem: "",
    tipo: "alert",
    resolve: undefined,
  }));

  const alert = (mensagem: string, titulo = "Aviso") => {
    return new Promise<boolean>((resolve) => {
      state.value = {
        show: true,
        titulo,
        mensagem,
        tipo: "alert",
        resolve,
      };
    });
  };

  const success = (mensagem: string, titulo = "Sucesso") => {
    return new Promise<boolean>((resolve) => {
      state.value = {
        show: true,
        titulo,
        mensagem,
        tipo: "success",
        resolve,
      };
    });
  };

  const error = (mensagem: string, titulo = "Erro") => {
    return new Promise<boolean>((resolve) => {
      state.value = {
        show: true,
        titulo,
        mensagem,
        tipo: "error",
        resolve,
      };
    });
  };

  const confirm = (mensagem: string, titulo = "Confirmação") => {
    return new Promise<boolean>((resolve) => {
      state.value = {
        show: true,
        titulo,
        mensagem,
        tipo: "confirm",
        resolve,
      };
    });
  };

  const close = (confirmed = false) => {
    if (state.value.resolve) {
      state.value.resolve(confirmed);
    }
    state.value.show = false;
  };

  return {
    state,
    alert,
    success,
    error,
    confirm,
    close,
  };
};
