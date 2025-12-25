<template>
  <nav
    class="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1 md:py-3">
      <ol class="flex items-center space-x-2 text-sm">
        <li>
          <NuxtLink
            to="/gerenciar"
            class="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
          >
            🏠 Início
          </NuxtLink>
        </li>
        <template v-if="items.length > 0">
          <li
            v-for="(item, index) in items"
            :key="index"
            class="flex items-center"
          >
            <span class="mx-2 text-slate-400 dark:text-slate-500">/</span>
            <NuxtLink
              v-if="item.to && index < items.length - 1"
              :to="item.to"
              class="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
            >
              {{ item.label }}
            </NuxtLink>
            <span v-else class="text-slate-900 dark:text-white font-medium">
              {{ item.label }}
            </span>
          </li>
        </template>
      </ol>
    </div>
  </nav>
</template>

<script setup lang="ts">
interface BreadcrumbItem {
  label: string;
  to?: string;
}

defineProps<{
  items: BreadcrumbItem[];
}>();
</script>
