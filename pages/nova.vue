<template>
  <div>
    <AppNavigation />
    <Breadcrumbs
      :items="[
        { label: 'Gerenciar OS', to: '/gerenciar' },
        { label: 'Nova Ordem de Serviço' },
      ]"
    />
    <OrdemServicoForm />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});
</script>
