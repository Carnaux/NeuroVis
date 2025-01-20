<script setup lang="ts">
import { ref } from 'vue'
// Side Bar components
import QuickSetTab from './sideBarComponents/QuickSetTab.vue'
import ImagesMeshesTab from './sideBarComponents/ImagesMeshesTab.vue'
import AnnotationsTab from './sideBarComponents/AnnotationsTab.vue'
import type { ImagesMeshesAction, NodeAction, ServerAction, TimerSeriesAction } from '@/types'
import TimeSeriesTab from './sideBarComponents/TimeSeriesTab.vue'
import ServerTab from './sideBarComponents/ServerTab.vue'
import QuickSettingsIcon from './icons/QuickSettingsIcon.vue'
import ImagesMeshesIcon from './icons/ImagesMeshesIcon.vue'
import TimeSeriesIcon from './icons/TimeSeriesIcon.vue'
import AnnotationsIcon from './icons/AnnotationsIcon.vue'
import ServerIcon from './icons/ServerIcon.vue'

const currentTabSelected = ref('quickSet')

const toggleTabs = (tab: string) => {
  currentTabSelected.value = tab
}
</script>

<template>
  <div class="sidebarContainer">
    <div class="controls">
      <button
        :class="{ selected: currentTabSelected === 'quickSet' }"
        @click="toggleTabs('quickSet')"
        v-tooltip="'Quick Settings'"
      >
        <QuickSettingsIcon />
      </button>
      <button
        :class="{ selected: currentTabSelected === 'imageMeshes' }"
        @click="toggleTabs('imageMeshes')"
        v-tooltip="'Images & Meshes'"
      >
        <ImagesMeshesIcon />
      </button>
      <button
        :class="{ selected: currentTabSelected === 'timeSeries' }"
        @click="toggleTabs('timeSeries')"
        v-tooltip="'Time-Series'"
      >
        <TimeSeriesIcon />
      </button>
      <button
        :class="{ selected: currentTabSelected === 'annotations' }"
        @click="toggleTabs('annotations')"
        v-tooltip="'Annotations'"
      >
        <AnnotationsIcon />
      </button>
      <button
        :class="{ selected: currentTabSelected === 'server' }"
        @click="toggleTabs('server')"
        v-tooltip="'Server'"
      >
        <ServerIcon />
      </button>
    </div>
    <div class="inspector">
      <QuickSetTab v-show="currentTabSelected === 'quickSet'" />
      <ImagesMeshesTab
        v-show="currentTabSelected === 'imageMeshes'"
        @imageMeshesAction="(action: ImagesMeshesAction) => $emit('imageMeshesAction', action)"
      />
      <TimeSeriesTab
        v-show="currentTabSelected === 'timeSeries'"
        @timeSeriesAction="(action: TimerSeriesAction) => $emit('timeSeriesAction', action)"
      />
      <AnnotationsTab
        v-show="currentTabSelected === 'annotations'"
        @nodeAction="(action: NodeAction) => $emit('nodeAction', action)"
      />
      <ServerTab
        v-show="currentTabSelected === 'server'"
        @serverAction="(action: ServerAction) => $emit('serverAction', action)"
      />
    </div>
  </div>
</template>

<style scoped>
.sidebarContainer {
  position: absolute;
  top: 0;
  right: 0;
  width: 15rem;
  height: 100%;
  background-color: transparent;

  display: flex;
  flex-direction: row;
  overflow: visible;

  color: white;
}

.controls {
  width: 2.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: black;

  button {
    width: 2.3rem;
    height: 2rem;
    border: none;
    background-color: lightgray;
    color: black;
    font-size: 0.75rem;
    cursor: pointer;
    margin-top: 0.25rem;
    border-top-left-radius: 0.3rem;
    border-bottom-left-radius: 0.3rem;

    border-top-style: solid;
    border-left-style: solid;
    border-bottom-style: solid;
    border-color: rgba(118, 118, 118, 0.3);

    transform: scale(0.9) translateX(0.15rem);

    &.selected {
      background-color: rgb(216, 181, 237);
      border-color: var(--button-border-hover-main);
      transform: scale(1);
      border-top-left-radius: 0.5rem;
      border-bottom-left-radius: 0.5rem;
      color: white;
    }
  }

  button:hover {
    &.selected {
      border-color: var(--button-border-hover-main);
      transform: scale(1) translateX(0rem) !important;
    }

    border-color: var(--button-border-hover-main);
    background-color: rgba(216, 181, 237, 1);
    transform: scale(0.85) translateX(0.2rem);
    transition: all 200ms linear;
  }
}

.inspector {
  width: 13.5rem;
  height: 100%;
}
</style>
