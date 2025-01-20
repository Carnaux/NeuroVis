import type { Annotation } from '@/types'
import type { NVImage } from '@niivue/niivue'
import { defineStore } from 'pinia'
import { toRaw } from 'vue'
import { vec3 } from 'gl-matrix'

export const useNiivueStore = defineStore('niivue', {
  //state
  state() {
    return {
      sliceType: '5',
      layout: '0',
      renderProportion: 0.5,
      colorBarVisibility: false,
      radiologicalConvention: false,
      orientationCubeVisibility: false,
      colorMap: 'gray',
      intensity: '0x0x0 = 0',
      cursorPosition: vec3.create(),
      mouseDrag: '0',
      volumes: <Array<NVImage>>[],
      annotationMeshIndex: -1,
      annotationPoints: <Array<Annotation>>[],
      addAnnotationPointEnabled: false,
      volumes4DIndex: <Array<number>>[],
      timeSeriesSelected: '',
      timerSeriesPlaybackSpeed: 1,
      timerSeriesAnimator: 0,
    }
  },
  //methods
  actions: {
    setSliceType(sliceType: string) {
      this.sliceType = sliceType
    },
    setLayout(layout: string) {
      this.layout = layout
    },
    setRenderProportion(renderProportion: number) {
      this.renderProportion = renderProportion
    },
    setColorBarVisibility(showColorBar: boolean) {
      this.colorBarVisibility = showColorBar
    },
    setRadiologicalConvention(radiology: boolean) {
      this.radiologicalConvention = radiology
    },
    setOrientationCubeVisibility(showOrientationCube: boolean) {
      this.orientationCubeVisibility = showOrientationCube
    },
    setColorMap(colorMap: string) {
      this.colorMap = colorMap
    },
    setIntensity(intensity: string) {
      this.intensity = intensity
    },
    setCursosPosition(cursorPos: vec3) {
      this.cursorPosition = cursorPos
    },
    setMouseDrag(mouseDrag: string) {
      this.mouseDrag = mouseDrag
    },
    addVolume(volume: NVImage) {
      //Add volume
      const unProxyVolume = toRaw(this.volumes)
      this.volumes = [...unProxyVolume, volume]
      //Add volume index to volumes4DIndex
      if (volume.frame4D != 0) {
        const unProxyVolumes4DIndex = toRaw(this.volumes4DIndex)
        this.volumes4DIndex = [...unProxyVolumes4DIndex, this.volumes.length - 1]
      }
    },
    removeVolume(index: number) {
      const unProxyVolume = toRaw(this.volumes)
      unProxyVolume.splice(index, 1)
      this.volumes = [...unProxyVolume]

      if (this.volumes[index].frame4D != 0) {
        const unProxyVolumes4DIndex = toRaw(this.volumes4DIndex)
        unProxyVolumes4DIndex.splice(index, 1)
      }
    },
    setAnnotationMeshIndex(index: number) {
      this.annotationMeshIndex = index
    },
    addAnnotationPoint(point: Annotation) {
      const unProxyPoints = toRaw(this.annotationPoints)
      this.annotationPoints = [...unProxyPoints, point]
    },
    removeAnnotationPoint(name: string) {
      const unProxyPoints = toRaw(this.annotationPoints)

      const index = unProxyPoints.findIndex((point: Annotation) => point.name === name)
      unProxyPoints.splice(index, 1)
      this.annotationPoints = [...unProxyPoints]

      console.log('annotationPoints', this.annotationPoints)
    },
    toggleAddAnnotationPointEnabled(toggle: boolean) {
      this.addAnnotationPointEnabled = toggle
    },
    setTimeSeriesSelected(id: string) {
      this.timeSeriesSelected = id
    },
    setTimerSeriesPlaybackSpeed(speed: number) {
      this.timerSeriesPlaybackSpeed = speed
    },
    setTimerSeriesAnimator(id: number) {
      this.timerSeriesAnimator = id
    },
    resetTimerSeriesAnimator() {
      this.timerSeriesAnimator = 0
    },
  },
})
