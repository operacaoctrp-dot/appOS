<template>
  <div class="animate-pulse">
    <div
      v-for="i in count"
      :key="i"
      class="bg-white rounded-xl shadow-sm p-6 mb-4"
    >
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <!-- Cabeçalho -->
          <div class="flex items-center gap-4 mb-4">
            <div class="h-8 w-16 bg-slate-200 rounded"></div>
            <div class="h-6 w-24 bg-slate-200 rounded-full"></div>
            <div class="h-6 w-32 bg-slate-200 rounded"></div>
          </div>

          <!-- Grid de informações -->
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div class="h-4 w-20 bg-slate-200 rounded mb-2"></div>
              <div class="h-5 w-40 bg-slate-200 rounded"></div>
            </div>
            <div>
              <div class="h-4 w-20 bg-slate-200 rounded mb-2"></div>
              <div class="h-5 w-32 bg-slate-200 rounded"></div>
            </div>
            <div>
              <div class="h-4 w-20 bg-slate-200 rounded mb-2"></div>
              <div class="h-5 w-36 bg-slate-200 rounded"></div>
            </div>
            <div>
              <div class="h-4 w-20 bg-slate-200 rounded mb-2"></div>
              <div class="h-5 w-28 bg-slate-200 rounded"></div>
            </div>
          </div>

          <!-- Sintoma/Defeito -->
          <div>
            <div class="h-4 w-32 bg-slate-200 rounded mb-2"></div>
            <div class="h-4 bg-slate-200 rounded w-full mb-1"></div>
            <div class="h-4 bg-slate-200 rounded w-4/5"></div>
          </div>
        </div>

        <!-- Botões -->
        <div class="flex flex-col gap-2 ml-4">
          <div class="h-10 w-32 bg-slate-200 rounded-lg"></div>
          <div class="h-10 w-32 bg-slate-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  count: {
    type: Number,
    default: 3,
  },
});
</script>
