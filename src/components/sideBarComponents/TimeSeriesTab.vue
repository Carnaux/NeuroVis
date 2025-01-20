<script setup lang="ts">
import { useNiivueStore } from '@/stores/niivueStore'
import type { TimerSeriesAction } from '@/types'
import TimeSeriesListItem from '../ListItemComponents/TimeSeriesListItem.vue'
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'timeSeriesAction', action: TimerSeriesAction): void
}>()

const niivueStore = useNiivueStore()

const selectedTimeSeries = ref('')
const animatingBtn = ref(false)

const handleTimeSeriesSelection = (name: string) => {
  selectedTimeSeries.value = name

  if (name !== '') {
    emit('timeSeriesAction', { type: 'select' })
  } else {
    emit('timeSeriesAction', { type: 'deselect' })
  }

  niivueStore.setTimeSeriesSelected(name)
}

const handlePlaybackSpeedChange = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  niivueStore.setTimerSeriesPlaybackSpeed(Number(value))
}

const handleAnimateButton = () => {
  animatingBtn.value = !animatingBtn.value
  emit('timeSeriesAction', { type: 'animate_toggle', id: selectedTimeSeries.value })
}
</script>

<template>
  <div class="timeSeriesTabContainer">
    <h3>Times Series</h3>
    <hr />
    <div v-if="niivueStore.volumes4DIndex.length === 0" class="warningSection section">
      <p>No Volumes or Meshes<br />containing time series data</p>
    </div>
    <div v-else class="timeSeriesContent">
      <div class="listSection section">
        <button
          class="deselectBtn"
          @click="
            () => {
              handleTimeSeriesSelection('')
            }
          "
        >
          Deselect
        </button>
        <div class="listContainer">
          <TimeSeriesListItem
            v-for="id in niivueStore.volumes4DIndex"
            :key="niivueStore.volumes[id].name"
            :name="niivueStore.volumes[id].name"
            :class="
              'listItem ' + (selectedTimeSeries === niivueStore.volumes[id].name ? 'selected' : '')
            "
            @click="
              () => {
                handleTimeSeriesSelection(niivueStore.volumes[id].name)
              }
            "
          />
        </div>
      </div>
      <div class="controlsSection section">
        <div class="subsection">
          <p>Manual Steps:</p>
          <div class="manualControlContainer">
            <button
              :disabled="selectedTimeSeries === ''"
              @click="$emit('timeSeriesAction', { type: 'backward', id: selectedTimeSeries })"
            >
              Backward
            </button>
            <button
              :disabled="selectedTimeSeries === ''"
              @click="$emit('timeSeriesAction', { type: 'forward', id: selectedTimeSeries })"
            >
              Forward
            </button>
          </div>
        </div>
        <div class="subsection">
          <p>Playback Speed:</p>
          <div class="playbackInputContainer">
            <input
              type="range"
              min="0.1"
              max="2"
              step="0.1"
              @input="handlePlaybackSpeedChange"
              value="1"
            />
            <p>{{ niivueStore.timerSeriesPlaybackSpeed }}</p>
          </div>
          <button
            :class="'animateBtn ' + (animatingBtn ? 'animationRunning' : '')"
            :disabled="selectedTimeSeries === ''"
            @click="handleAnimateButton"
          >
            Animate
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.timeSeriesTabContainer {
  width: 100%;
  height: 100%;
  border-left-style: solid;
  border-color: gray;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.timeSeriesContent {
  width: 100%;
}

.subsection {
  margin-top: 0.5rem;
}

.listContainer {
  display: flex;
  flex-direction: column;
  height: 20rem;
  margin-top: 0.2rem;
  background-color: var(--button-text-disabled);
  overflow-y: auto;
}

.manualControlContainer {
  display: flex;
  flex-direction: row;

  button:nth-of-type(1) {
    border-top-left-radius: 0.3rem;
    border-bottom-left-radius: 0.3rem;
  }

  button:nth-of-type(2) {
    border-top-right-radius: 0.3rem;
    border-bottom-right-radius: 0.3rem;
  }
}

.playbackInputContainer {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;

  input {
    width: 80%;
  }

  p {
    width: 20%;
  }
}

.deselectBtn {
  width: 80%;
  margin-top: 0.5rem;

  border-radius: 0.3rem;
}

.animateBtn {
  width: 80%;
  margin-top: 0.2rem;

  border-radius: 0.3rem;

  &.animationRunning {
    animation-name: colorPulse;
    animation-duration: 3s;
    animation-iteration-count: infinite;
    animation-direction: alternate-reverse;
    animation-timing-function: ease;
  }
}

@keyframes colorPulse {
  from {
  }
  to {
    background-color: var(--button-bg-hover);
  }
}
</style>
