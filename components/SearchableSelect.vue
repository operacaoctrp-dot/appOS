<template>
  <div class="relative" ref="container">
    <div class="relative">
      <input
        type="text"
        v-model="searchQuery"
        @focus="onFocus"
        @input="onSearch"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        class="w-full min-w-[180px] px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
        :class="[{ 'bg-gray-100': disabled }, fontSize]"
      />
      <div
        @click="toggleDropdown"
        class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
        :class="{ 'pointer-events-none': disabled }"
      >
        <svg
          class="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>

    <!-- Dropdown -->
    <div
      v-if="showDropdown && !disabled"
      class="absolute z-[9999] w-full min-w-[180px] mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
    >
      <div
        v-if="filteredOptions.length === 0"
        class="px-3 py-2 text-sm text-gray-500"
      >
        Nenhum resultado encontrado
      </div>
      <div
        v-for="option in filteredOptions"
        :key="option.value"
        @click="selectOption(option)"
        class="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
        :class="{ 'bg-blue-100': option.value === modelValue }"
      >
        {{ option.label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";

interface Option {
  value: any;
  label: string;
}

const props = withDefaults(
  defineProps<{
    modelValue: any;
    options: Option[];
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    fontSize?: string;
  }>(),
  {
    fontSize: "text-base",
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: any): void;
  (e: "change"): void;
}>();

const container = ref<HTMLElement | null>(null);
const searchQuery = ref("");
const showDropdown = ref(false);

// Computed
const filteredOptions = computed(() => {
  if (!searchQuery.value) {
    console.log("Retornando todas as opções:", props.options);
    return props.options;
  }

  const query = searchQuery.value.toLowerCase();
  const filtered = props.options.filter((option) =>
    option.label.toLowerCase().includes(query)
  );
  console.log("Opções filtradas:", filtered);
  return filtered;
});

const selectedOption = computed(() => {
  return props.options.find((opt) => opt.value === props.modelValue);
});

// Métodos
const selectOption = (option: Option) => {
  emit("update:modelValue", option.value);
  emit("change");
  searchQuery.value = option.label;
  showDropdown.value = false;
};

const onFocus = () => {
  showDropdown.value = true;
};

const onSearch = () => {
  showDropdown.value = true;
  console.log("onSearch - dropdown aberto, opções:", props.options.length);
};

const toggleDropdown = () => {
  if (props.disabled) return;

  if (!showDropdown.value) {
    // Ao abrir, limpar o campo de pesquisa para mostrar todas as opções
    searchQuery.value = "";
    showDropdown.value = true;
  } else {
    showDropdown.value = false;
    // Restaurar o texto selecionado
    if (selectedOption.value) {
      searchQuery.value = selectedOption.value.label;
    }
  }
};

const handleClickOutside = (event: MouseEvent) => {
  if (container.value && !container.value.contains(event.target as Node)) {
    showDropdown.value = false;
    // Restaurar o texto selecionado se fechou sem selecionar
    if (selectedOption.value) {
      searchQuery.value = selectedOption.value.label;
    } else {
      searchQuery.value = "";
    }
  }
};

// Watch para atualizar o texto quando o valor mudar externamente
watch(
  () => props.modelValue,
  () => {
    if (selectedOption.value) {
      searchQuery.value = selectedOption.value.label;
    } else {
      searchQuery.value = "";
    }
  },
  { immediate: true }
);

// Lifecycle
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
