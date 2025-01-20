<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { Niivue, SHOW_RENDER, MULTIPLANAR_TYPE, NVImage } from '@niivue/niivue'
import { useNiivueStore } from '@/stores/niivueStore'
import { vec3 } from 'gl-matrix'
import type {
  Annotation,
  ImagesMeshesAction,
  NodeAction,
  ServerAction,
  TimerSeriesAction,
} from '@/types'
import { HandlePromisseError, IndexLayoutType, IndexSliceType } from '@/utils/utils'
import SideBar from '../components/SideBar.vue'

const niivueStore = useNiivueStore()

// Niivue Location Change handles
const handleLocationChange = (data: any) => {
  niivueStore.setIntensity(data.string.trim())
}

// Niivue Volume load callback
const handleOnImageLoaded = (data: NVImage) => {
  niivueStore.addVolume(data)
}

// Handle Mouse Events
const handleMouseUp = (event: any) => {
  if (event.fracPos[0] > 0 && !event.mouseButtonCenterDown && !event.mouseButtonRightDown) {
    const fracVec = vec3.fromValues(event.fracPos[0], event.fracPos[1], event.fracPos[2])
    niivueStore.setCursosPosition(fracVec)

    if (niivueStore.addAnnotationPointEnabled) {
      const XYZmmVec = nv.frac2mm(fracVec)
      const posMM = vec3.fromValues(XYZmmVec[0], XYZmmVec[1], XYZmmVec[2])
      addPointToMesh(posMM, fracVec)
    }
  }
}

const options = {
  backColor: [0, 0, 0, 1],
  show3Dcrosshair: true,
  onLocationChange: handleLocationChange,
  onImageLoaded: handleOnImageLoaded,
  onMouseUp: handleMouseUp,
}
const nv = new Niivue(options)
nv.opts.dragMode = nv.dragModes.none
// Render settings
nv.opts.multiplanarShowRender = SHOW_RENDER.ALWAYS
nv.opts.showLegend = false
nv.graph.autoSizeMultiplanar = true
nv.setHeroImage(0.5)
nv.setClipPlane([0.2, 0, 120])
nv.graph.normalizeValues = false
nv.graph.opacity = 1.0

onMounted(() => {
  nv.attachTo('gl')
})

// Slice Type Watcher
watch(
  () => niivueStore.sliceType,
  () => {
    switch (niivueStore.sliceType) {
      case '0':
        nv.setSliceType(nv.sliceTypeAxial)
        break
      case '1':
        nv.setSliceType(nv.sliceTypeSagittal)
        break
      case '2':
        nv.setSliceType(nv.sliceTypeCoronal)
        break
      case '3':
        nv.setSliceType(nv.sliceTypeRender)
        break
      case '4':
        nv.setSliceType(nv.sliceTypeMultiplanar)
        nv.opts.multiplanarShowRender = SHOW_RENDER.NEVER
        nv.setHeroImage(0)
        break
      case '5':
        nv.setSliceType(nv.sliceTypeMultiplanar)
        nv.opts.multiplanarShowRender = SHOW_RENDER.ALWAYS
        nv.setHeroImage(0.5)
        break
      default:
        break
    }
  },
)
// Layout Watcher
watch(
  () => niivueStore.layout,
  () => {
    switch (niivueStore.layout) {
      case '0':
        nv.opts.multiplanarLayout = MULTIPLANAR_TYPE.AUTO
        break
      case '1':
        nv.opts.multiplanarLayout = MULTIPLANAR_TYPE.COLUMN
        break
      case '2':
        nv.opts.multiplanarLayout = MULTIPLANAR_TYPE.GRID
        break
      case '3':
        nv.opts.multiplanarLayout = MULTIPLANAR_TYPE.ROW
        break
      default:
        break
    }

    nv.updateGLVolume()
  },
)
// Render Proportion Watcher
watch(
  () => niivueStore.renderProportion,
  () => {
    nv.setHeroImage(niivueStore.renderProportion)
    nv.updateGLVolume()
  },
)
// Color Bar Visibility Watcher
watch(
  () => niivueStore.colorBarVisibility,
  () => {
    nv.opts.isColorbar = niivueStore.colorBarVisibility
    nv.drawScene()
  },
)
// Radiological Watcher
watch(
  () => niivueStore.radiologicalConvention,
  () => {
    nv.opts.isRadiologicalConvention = niivueStore.radiologicalConvention
    nv.drawScene()
  },
)
// Orientation Cube Watcher
watch(
  () => niivueStore.orientationCubeVisibility,
  () => {
    nv.opts.isOrientCube = niivueStore.orientationCubeVisibility
    nv.updateGLVolume()
  },
)
// Color Map Watcher
watch(
  () => niivueStore.colorMap,
  () => {
    switch (niivueStore.colorMap) {
      case '0':
        nv.volumes[0].colormap = 'gray'
        break
      case '1':
        nv.volumes[0].colormap = 'plasma'
        break
      case '2':
        nv.volumes[0].colormap = 'viridis'
        break
      case '3':
        nv.volumes[0].colormap = 'inferno'
        break
      default:
        break
    }
    nv.updateGLVolume()
  },
)
// Mouse Drag Watcher
watch(
  () => niivueStore.mouseDrag,
  () => {
    switch (niivueStore.mouseDrag) {
      case '0':
        nv.opts.dragMode = nv.dragModes.none
        break
      case '1':
        nv.opts.dragMode = nv.dragModes.pan
        break
      case '2':
        nv.opts.dragMode = nv.dragModes.measurement
        break
      case '3':
        nv.opts.dragMode = nv.dragModes.contrast
        break
      default:
        break
    }
  },
)

// Handle Emits
const handleImageMeshesAction = (action: ImagesMeshesAction) => {
  if (action.type === 'toggleVisibility') {
    toggleVolumeOpacity(action.id!)
  } else if (action.type === 'delete') {
    deleteVolume(action.id!)
  } else if (action.type === 'upload') {
    loadLocalFile(action)
  }
}

const handleNodeAction = (action: NodeAction) => {
  if (action.type === 'remove') {
    niivueStore.toggleAddAnnotationPointEnabled(false)
    removePointFormMesh(action.id!)
  } else if (action.type === 'hide') {
    const annotationConnectomeMesh = nv.meshes[niivueStore.annotationMeshIndex] as any
    annotationConnectomeMesh.visible = !annotationConnectomeMesh.visible
    nv.drawScene()
  } else if (action.type === 'moveTo') {
    const node = niivueStore.annotationPoints.find((node) => node.name === action.id)
    nv.scene.crosshairPos = node?.data
    nv.drawScene()
  }
}

const handleTimeSeriesAction = (action: TimerSeriesAction) => {
  const volume = nv.volumes.find((volume) => volume.name === action.id)

  //TODO refactor
  if (action.type === 'select') {
    nv.setSliceType(nv.sliceTypeMultiplanar)
    nv.opts.multiplanarShowRender = SHOW_RENDER.NEVER
    nv.opts.multiplanarLayout = MULTIPLANAR_TYPE.GRID
    nv.setHeroImage(0.5)
  } else if (action.type === 'deselect') {
    ApplyStoreQuickSettings()
  } else if (action.type === 'forward') {
    if (volume) {
      let currentVol = nv.getFrame4D(volume.id)
      currentVol++
      currentVol = Math.min(currentVol, volume.nFrame4D! - 1)
      nv.setFrame4D(volume.id, currentVol)
    }
  } else if (action.type === 'backward') {
    if (volume) {
      let currentVol = nv.getFrame4D(volume.id)
      currentVol--
      currentVol = Math.max(currentVol, 0)
      nv.setFrame4D(volume.id, currentVol)
    }
  } else if (action.type === 'animate_toggle') {
    if (volume) {
      if (niivueStore.timerSeriesAnimator === 0) {
        const intervalID = setInterval(() => {
          let currentVol = nv.getFrame4D(volume.id)
          currentVol++
          if (currentVol >= volume.nFrame4D!) {
            currentVol = 0
          }
          nv.setFrame4D(volume.id, currentVol)
        }, 100 / niivueStore.timerSeriesPlaybackSpeed)
        niivueStore.setTimerSeriesAnimator(intervalID)
      } else {
        clearInterval(niivueStore.timerSeriesAnimator)
        niivueStore.resetTimerSeriesAnimator()
      }
    }
  }

  nv.updateGLVolume()
}

const handleServerAction = (action: ServerAction) => {
  if (action.type === 'loadFile') {
    const url = 'http://localhost:8000/static/' + action.file
    console.log(action)
    NVImage.loadFromUrl({
      url: url,
      colormap: 'gray',
      opacity: 1,
      frame4D: action.is4D ? 2 : 0,
    })
      .then((image) => {
        nv.addVolume(image)
      })
      .catch((error) => {
        HandlePromisseError(error)
        return Promise.reject(error)
      })
  }
}

// Volume Actions Methods
const toggleVolumeOpacity = (id: string) => {
  const index = nv.getVolumeIndexByID(id)
  const newOpacity = nv.volumes[index].opacity === 0 ? 1 : 0
  nv.volumes[index].opacity = newOpacity
  nv.updateGLVolume()
}

const deleteVolume = (id: string) => {
  const index = nv.getVolumeIndexByID(id)
  nv.removeVolumeByIndex(index)
  niivueStore.removeVolume(index)
  nv.updateGLVolume()
}

const loadLocalFile = (action: ImagesMeshesAction) => {
  // TODO add local file input parameters!
  nv.loadFromFile(action.file!)
}

// Node Actions Methods
const addPointToMesh = (posMM: vec3, posFrac: vec3) => {
  if (niivueStore.annotationMeshIndex !== -1) {
    const annotationConnectomeMesh = nv.meshes[niivueStore.annotationMeshIndex] as any

    annotationConnectomeMesh.addConnectomeNode({
      name: 'node' + niivueStore.annotationPoints.length,
      x: posMM[0],
      y: posMM[1],
      z: posMM[2],
      colorValue: 2,
      sizeValue: 2,
    })

    nv.meshes[niivueStore.annotationMeshIndex].updateMesh(nv.gl)
  } else {
    const connectome = {
      name: 'annotationConnectome',
      nodeColormap: 'warm',
      nodeColormapNegative: 'winter',
      nodeMinColor: 2,
      nodeMaxColor: 4,
      nodeScale: 3,
      edgeColormap: 'warm',
      edgeColormapNegative: 'winter',
      edgeMin: 2,
      edgeMax: 6,
      edgeScale: 1,
      legendLineThickness: 0,
      nodes: [
        {
          name: 'node0',
          x: posMM[0],
          y: posMM[1],
          z: posMM[2],
          colorValue: 2,
          sizeValue: 2,
        },
      ],
      edges: [],
    }

    nv.loadConnectome(connectome)

    for (let i = 0; i < nv.meshes.length; i++) {
      if (nv.meshes[i].name === 'annotationConnectome') {
        niivueStore.setAnnotationMeshIndex(i)
        break
      }
    }
  }

  const newAnnotation: Annotation = {
    type: 'point',
    name: 'node' + niivueStore.annotationPoints.length,
    data: posFrac,
  }

  niivueStore.addAnnotationPoint(newAnnotation)
  nv.updateGLVolume()
}

const removePointFormMesh = (name: string) => {
  const annotationConnectomeMesh = nv.meshes[niivueStore.annotationMeshIndex] as any

  if (annotationConnectomeMesh.nodes.length === 1) {
    nv.removeMesh(annotationConnectomeMesh)
    niivueStore.setAnnotationMeshIndex(-1)
    nv.updateGLVolume()

    niivueStore.removeAnnotationPoint(annotationConnectomeMesh.nodes[0].name)
  } else {
    const node = annotationConnectomeMesh.nodes.find((node: any) => node.name === name)

    if (node) {
      annotationConnectomeMesh.deleteConnectomeNode(node)
      annotationConnectomeMesh.updateMesh(nv.gl)
      nv.drawScene()

      niivueStore.removeAnnotationPoint(node.name)
    }
  }
}

// General Methods
const ApplyStoreQuickSettings = () => {
  const sliceType = IndexSliceType(parseInt(niivueStore.sliceType))
  nv.setSliceType(sliceType!)
  if (niivueStore.sliceType === '4') {
    nv.opts.multiplanarShowRender = SHOW_RENDER.NEVER
  } else if (niivueStore.sliceType === '5') {
    nv.opts.multiplanarShowRender = SHOW_RENDER.ALWAYS
  }

  const layoutType = IndexLayoutType(parseInt(niivueStore.layout))
  nv.opts.multiplanarLayout = layoutType!

  nv.setHeroImage(niivueStore.renderProportion)

  nv.updateGLVolume()
}
</script>

<template>
  <div>
    <SideBar
      @imageMeshesAction="(action: ImagesMeshesAction) => handleImageMeshesAction(action)"
      @nodeAction="(action: NodeAction) => handleNodeAction(action)"
      @timeSeriesAction="(action: TimerSeriesAction) => handleTimeSeriesAction(action)"
      @serverAction="(action: ServerAction) => handleServerAction(action)"
    />
    <canvas id="gl"></canvas>
    <div class="intensity">
      <p>Intensity:</p>
      <p>{{ niivueStore.intensity }}</p>
    </div>
  </div>
</template>

<style scoped>
canvas {
  position: absolute;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
  width: calc(100% - 15rem) !important;
  height: 100%;
  z-index: 1;
}

.intensity {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12rem;

  background-color: transparent;

  font-size: 0.85rem;
  color: white;

  z-index: 2;

  &.dark {
    color: black;
  }
}
</style>
