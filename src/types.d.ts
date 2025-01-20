export type Annotation = {
  type: 'point'
  name: string
  data: vec3
}

export type NodeAction = {
  type: 'add' | 'remove' | 'hide' | 'moveTo'
  id?: string
}

export type ImagesMeshesAction = {
  type: 'toggleVisibility' | 'delete' | 'upload'
  id?: string
  is4d?: boolean
  file?: File
}

export type TimerSeriesAction = {
  type: 'select' | 'deselect' | 'forward' | 'backward' | 'animate_toggle'
  id?: string
}

export type ServerAction = {
  type: 'loadFile'
  file: string
  is4D?: boolean
}
