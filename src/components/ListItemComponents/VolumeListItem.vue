<script setup lang="ts">
import { ref } from 'vue'
import DeleteIcon from '../icons/DeleteIcon.vue'
import VisibilityIcon from '../icons/VisibilityIcon.vue'
import type { ImagesMeshesAction } from '@/types'

const props = defineProps(['name', 'id'])

const emit = defineEmits<{
  (e: 'imageMeshesAction', action: ImagesMeshesAction): void
}>()

const hidden = ref(false)

const handleToggleHiddenIcon = () => {
  hidden.value = !hidden.value
  emit('imageMeshesAction', { type: 'toggleVisibility', id: props.id })
}
</script>

<template>
  <div class="listItem">
    <button class="hideBtn" @click="handleToggleHiddenIcon">
      <VisibilityIcon :hidden="hidden" />
    </button>
    <p>{{ props.name }}</p>
    <button class="deleteBtn" @click="$emit('imageMeshesAction', { type: 'delete', id: props.id })">
      <DeleteIcon />
    </button>
  </div>
</template>

<style scoped>
.listItem {
  width: 100%;
  height: 2rem;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  background-color: rgba(59, 58, 58, 0.5);

  border-top: none;
  border-right: none;
  border-bottom: none;
  border-left-style: solid;
  border-left-width: 0.5rem;
  border-left-color: transparent;

  margin-top: 0.3rem;

  p {
    width: 30%;
  }

  button {
    background-color: transparent;
    width: 2rem;
    height: 100%;
  }

  &.selected {
    border-color: var(--button-bg-hover);
    background-color: var(--button-bg-main);
  }
}

.listItem:hover {
  border-color: var(--button-bg-hover);
  transition: border-color 200ms linear;
}

.hideBtn:active,
.deleteBtn:active {
  transform: scale(0.8);
  transition: transform 200ms linear;
}
</style>
