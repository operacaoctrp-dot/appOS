<template>
  <div>
    <!-- Indicador de status offline -->
    <OfflineIndicator />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <!-- Modal Global -->
    <Modal
      v-model="modalState.show"
      :titulo="modalState.titulo"
      :mensagem="modalState.mensagem"
      :tipo="modalState.tipo"
      @confirm="() => closeModal(true)"
      @cancel="() => closeModal(false)"
    />

    <!-- PWA Install Prompt -->
    <PwaPrompt />
  </div>
</template>

<script setup lang="ts">
const { state: modalState, close: closeModal } = useModal();

// Meta tags para PWA
useHead({
  htmlAttrs: {
    lang: "pt-BR",
  },
  meta: [
    {
      name: "viewport",
      content:
        "width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes",
    },
    { name: "theme-color", content: "#1e293b" },
    { name: "mobile-web-app-capable", content: "yes" },
    { name: "apple-mobile-web-app-capable", content: "yes" },
    {
      name: "apple-mobile-web-app-status-bar-style",
      content: "black-translucent",
    },
    { name: "apple-mobile-web-app-title", content: "appOS" },
    {
      name: "description",
      content:
        "Sistema de gerenciamento de ordens de serviço da Marquise Ambiental",
    },
    { name: "format-detection", content: "telephone=no" },
  ],
  link: [{ rel: "apple-touch-icon", href: "/apple-touch-icon.png" }],
});
</script>
