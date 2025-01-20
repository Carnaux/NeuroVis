<script setup lang="ts">
import { useNiivueStore } from '@/stores/niivueStore'
import AnnotationListItem from '../ListItemComponents/AnnotationListItem.vue'
import type { NodeAction } from '@/types'
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'nodeAction', action: NodeAction): void
}>()

const niivueStore = useNiivueStore()

const addEnabled = ref(false)

const handleAddButton = () => {
  addEnabled.value = !addEnabled.value
  niivueStore.toggleAddAnnotationPointEnabled(addEnabled.value)
}
</script>

<template>
  <div class="annotationTabContainer">
    <h3>Annotations</h3>
    <hr />
    <button @click="handleAddButton" :class="{ addBtn: true, active: addEnabled ? 'active' : '' }">
      Add node
    </button>
    <div class="listSection section">
      <div class="listContainer">
        <AnnotationListItem
          v-for="node in niivueStore.annotationPoints"
          :key="node.name"
          :name="node.name"
          @nodeAction="(action: NodeAction) => $emit('nodeAction', action)"
        />
      </div>
    </div>
    <button @click="emit('nodeAction', { type: 'hide' })">Toggle Points Visibility</button>
  </div>
</template>

<style scoped>
.annotationTabContainer {
  width: 100%;
  height: 100%;
  border-left-style: solid;
  border-color: gray;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.listContainer {
  display: flex;
  flex-direction: column;
  height: 20rem;
  margin-top: 0.8rem;
  background-color: var(--button-text-disabled);
  overflow-y: auto;
}

.section {
  width: 100%;
}

.addBtn {
  width: 80%;
  margin-top: 0.5rem;

  border-radius: 0.3rem;

  &.active {
    background-color: var(--button-bg-hover);
  }
}
</style>
