<script setup lang="ts">
import { useNiivueStore } from '@/stores/niivueStore'
import { ref, watch } from 'vue'

const disableLayouts = ref(false)
const disableRenderProportion = ref(false)
const viewSelectorValue = ref('5')

const niivueStore = useNiivueStore()

const setRefsValues = (value: string) => {
  if (value !== '4' && value !== '5') {
    disableLayouts.value = true
  } else {
    disableLayouts.value = false
  }

  if (value !== '5') {
    disableRenderProportion.value = true
  } else {
    disableRenderProportion.value = false
  }
}

const handleViewChange = (e: Event) => {
  const value = (e.target as HTMLSelectElement).value
  niivueStore.setSliceType(value)

  setRefsValues(value)
}

const handleLayoutChange = (layout: string) => {
  niivueStore.setLayout(layout)
}

const handleRenderProportionChange = (proportion: number) => {
  niivueStore.setRenderProportion(proportion)
}

const handleColorBarToggle = (e: Event) => {
  const value = (e.target as HTMLInputElement).checked
  niivueStore.setColorBarVisibility(value)
}

const handleRadiologicalToggle = (e: Event) => {
  const value = (e.target as HTMLInputElement).checked
  niivueStore.setRadiologicalConvention(value)
}

const handleOrientationCubeToggle = (e: Event) => {
  const value = (e.target as HTMLInputElement).checked
  niivueStore.setOrientationCubeVisibility(value)
}

const handleColorMapChange = (e: Event) => {
  const value = (e.target as HTMLSelectElement).value
  niivueStore.setColorMap(value)
}

const handleMouseDragChange = (e: Event) => {
  const value = (e.target as HTMLSelectElement).value
  niivueStore.setMouseDrag(value)
}

const handleDefaultButton = () => {
  niivueStore.setLayout('0')
  niivueStore.setSliceType('5')
}

watch(
  () => niivueStore.sliceType,
  () => {
    viewSelectorValue.value = niivueStore.sliceType

    setRefsValues(niivueStore.sliceType)
  },
)

watch(
  () => niivueStore.timeSeriesSelected,
  () => {
    if (niivueStore.timeSeriesSelected !== '') {
      setRefsValues('0')
    } else {
      setRefsValues(niivueStore.sliceType)
    }
  },
)
</script>

<template>
  <div class="quickSetTabContainer">
    <h3>Quick Settings</h3>
    <hr />
    <div class="viewSection section">
      <div class="subsection">
        <p>View</p>
        <select
          @change="handleViewChange($event)"
          :disabled="niivueStore.timeSeriesSelected !== ''"
        >
          <option value="0" :selected="viewSelectorValue == '0'">Axial</option>
          <option value="1" :selected="viewSelectorValue == '1'">Sagittal</option>
          <option value="2" :selected="viewSelectorValue == '2'">Coronal</option>
          <option value="3" :selected="viewSelectorValue == '3'">Render</option>
          <option value="4" :selected="viewSelectorValue == '4'">A+S+C</option>
          <option value="5" :selected="viewSelectorValue == '5'">A+S+C+R</option>
        </select>
      </div>
      <div class="subsection">
        <p>Layout</p>
        <div class="layoutButtonContainer">
          <button
            :class="{ selected: niivueStore.layout === '0' }"
            :disabled="disableLayouts"
            @click="
              () => {
                handleLayoutChange('0')
              }
            "
          >
            Auto
          </button>
          <button
            :class="{ selected: niivueStore.layout === '1' }"
            :disabled="disableLayouts"
            @click="
              () => {
                handleLayoutChange('1')
              }
            "
          >
            Column
          </button>
          <button
            :class="{ selected: niivueStore.layout === '2' }"
            :disabled="disableLayouts"
            @click="
              () => {
                handleLayoutChange('2')
              }
            "
          >
            Grid
          </button>
          <button
            :class="{ selected: niivueStore.layout === '3' }"
            :disabled="disableLayouts"
            @click="
              () => {
                handleLayoutChange('3')
              }
            "
          >
            Row
          </button>
        </div>
      </div>
      <div class="subsection">
        <p>Render Size</p>
        <div class="renderSizeButtonContainer">
          <button
            :class="{ selected: niivueStore.renderProportion === 0 }"
            :disabled="disableRenderProportion"
            @click="
              () => {
                handleRenderProportionChange(0)
              }
            "
          >
            Even
          </button>
          <button
            :class="{ selected: niivueStore.renderProportion === 0.25 }"
            :disabled="disableRenderProportion"
            @click="
              () => {
                handleRenderProportionChange(0.25)
              }
            "
          >
            25%
          </button>
          <button
            :class="{ selected: niivueStore.renderProportion === 0.5 }"
            :disabled="disableRenderProportion"
            @click="
              () => {
                handleRenderProportionChange(0.5)
              }
            "
          >
            50%
          </button>
          <button
            :class="{ selected: niivueStore.renderProportion === 0.75 }"
            :disabled="disableRenderProportion"
            @click="
              () => {
                handleRenderProportionChange(0.75)
              }
            "
          >
            75%
          </button>
        </div>
      </div>
      <button
        class="defaultButton"
        @click="
          () => {
            handleDefaultButton()
          }
        "
        :disabled="niivueStore.timeSeriesSelected !== ''"
      >
        Default
      </button>
    </div>
    <hr />
    <div class="colorSection section">
      <h4>Color Maps</h4>
      <select @change="handleColorMapChange($event)" value="0">
        <option value="0">Gray</option>
        <option value="1">Plasma</option>
        <option value="2">Viridis</option>
        <option value="3">Inferno</option>
      </select>
    </div>
    <hr />
    <div class="dragSection section">
      <h4>Mouse Drag</h4>
      <select @change="handleMouseDragChange($event)" value="0">
        <option value="0">None</option>
        <option value="1">Pan</option>
        <option value="2">Measure</option>
        <option value="3">Contrast</option>
      </select>
    </div>
    <hr />
    <div class="additionalInfoSection section">
      <h4>Additional Info</h4>
      <div class="checkboxContainer subsection">
        <div>
          <input
            type="checkbox"
            id="showColorBar"
            name="showColorBar"
            value="showColorBar"
            @change="handleColorBarToggle($event)"
          />
          <label for="showColorBar">Show Color Bar</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="showRadiological"
            name="showRadiological"
            value="showRadiological"
            @change="handleRadiologicalToggle($event)"
          />
          <label for="showRadiological">Radiological</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="showOrientationCube"
            name="showOrientationCube"
            value="showOrientationCube"
            @change="handleOrientationCubeToggle($event)"
          />
          <label for="showOrientationCube">Orientation Cube</label>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.quickSetTabContainer {
  width: 100%;
  height: 100%;
  border-left-style: solid;
  border-color: gray;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.section {
  margin-top: 0.3rem;
  margin-bottom: 0.2rem;
}

.subsection {
  margin-top: 0.5rem;
}

.layoutButtonContainer,
.renderSizeButtonContainer {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-left: 0.1rem;
  margin-right: 0.1rem;

  button:nth-of-type(1) {
    border-top-left-radius: 0.3rem;
    border-bottom-left-radius: 0.3rem;
  }

  button:nth-of-type(4) {
    border-top-right-radius: 0.3rem;
    border-bottom-right-radius: 0.3rem;
  }
}

.defaultButton {
  width: 4.2rem;
  font-size: 0.9rem;
  border-radius: 0.3rem;
  border-style: solid;
  background-color: var(--button-bg-main);
  border-color: rgba(118, 118, 118, 0.3);
  margin-top: 1rem;
}

.defaultButton:disabled {
  background-color: var(--button-bg-disabled);
  color: var(--button-text-disabled);
}

.defaultButton:hover {
  background-color: var(--button-bg-hover-main);
  border-color: var(--button-border-hover-main);
  transition: all 200ms linear;
}

.defaultButton:disabled:hover {
  background-color: var(--button-bg-disabled);
  border-color: rgba(118, 118, 118, 0.3);
}

.colorSection,
.dragSection {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.checkboxContainer {
  display: flex;
  flex-direction: column;
  align-items: start;

  label {
    margin-left: 0.25rem;
  }

  input[type='checkbox'] {
    background-color: var(--button-bg-hover-main);
    border-color: var(--button-border-hover-main);
    transition: all 200ms linear;
  }
}
</style>
