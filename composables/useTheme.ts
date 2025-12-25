export const useTheme = () => {
  const isDark = useState<boolean>("theme-dark", () => false);

  const initTheme = () => {
    // Verifica preferência salva no localStorage
    if (process.client) {
      const saved = localStorage.getItem("theme");
      if (saved === "dark") {
        isDark.value = true;
        document.documentElement.classList.add("dark");
      } else if (saved === "light") {
        isDark.value = false;
        document.documentElement.classList.remove("dark");
      } else {
        // Se não tem preferência salva, usa preferência do sistema
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        isDark.value = prefersDark;
        if (prefersDark) {
          document.documentElement.classList.add("dark");
        }
      }
    }
  };

  const toggleTheme = () => {
    isDark.value = !isDark.value;

    if (process.client) {
      if (isDark.value) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    }
  };

  const setTheme = (dark: boolean) => {
    isDark.value = dark;

    if (process.client) {
      if (dark) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    }
  };

  return {
    isDark,
    toggleTheme,
    setTheme,
    initTheme,
  };
};
