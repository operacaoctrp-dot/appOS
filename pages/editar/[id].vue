<template>
  <div>
    <AppNavigation />
    <Breadcrumbs
      :items="[
        { label: 'Gerenciar OS', to: '/gerenciar' },
        { label: `Editar OS #${ordemId}` },
      ]"
    />
    <OrdemServicoForm :ordem-id="ordemId" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

const route = useRoute();
const ordemId = computed(() => Number(route.params.id));
</script>
