<script setup lang="ts">
import { useNiivueStore } from '@/stores/niivueStore'
import VolumeListItem from '../ListItemComponents/VolumeListItem.vue'
import type { ImagesMeshesAction } from '@/types'
import { ref } from 'vue'

const niivueStore = useNiivueStore()

const fileIs4d = ref(false)

const emit = defineEmits<{
  (e: 'imageMeshesAction', action: ImagesMeshesAction): void
}>()

const handleFileInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  // TODO multiple file loading
  if (target.files) {
    const file = target.files[0]
    emit('imageMeshesAction', { type: 'upload', file: file })
  }
}

const handleIs4dChange = (e: Event) => {
  fileIs4d.value = (e.target as HTMLInputElement).checked
}
</script>

<template>
  <div class="imagesMeshesTabContainer">
    <h3>Images & Meshes</h3>
    <hr />
    <div class="listSection section">
      <div class="listContainer">
        <VolumeListItem
          v-for="volume in niivueStore.volumes"
          :key="volume.url"
          :name="volume.name.split('.')[0]"
          :id="volume.id"
          @imageMeshesAction="(action: ImagesMeshesAction) => $emit('imageMeshesAction', action)"
        />
      </div>
      <div class="is4dCheck">
        <input type="checkbox" @change="handleIs4dChange($event)" />
        <label>Is 4D volume</label>
      </div>
      <input id="fileLoader" type="file" @change="handleFileInput" />
    </div>
    <!-- TODO -->
    <!-- selected volume/mesh properties -->
  </div>
</template>

<style scoped>
.imagesMeshesTabContainer {
  width: 100%;
  height: 100%;
  border-left-style: solid;
  border-color: gray;
  display: flex;
  flex-direction: column;
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

.fileLoader {
  width: 100%;
}

input::file-selector-button {
  /* width: 100%; */
  height: 2.5rem;
  background-color: var(--button-bg);
  color: white;
  border-style: none;
}

input::file-selector-button:hover {
  background-color: var(--button-bg-hover);
  transition: background-color 200ms linear;
}

input::file-selector-button:active {
  transform: scale(0.95);
  transition: transform 200ms linear;
}

.is4dCheck {
  label {
    margin-left: 0.25rem;
  }
}
</style>
