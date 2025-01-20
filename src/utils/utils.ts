import { MULTIPLANAR_TYPE, SLICE_TYPE } from '@niivue/niivue'

export const IndexSliceType = (n: number) => {
  switch (n) {
    case 0:
      return SLICE_TYPE.AXIAL
    case 1:
      return SLICE_TYPE.SAGITTAL
    case 2:
      return SLICE_TYPE.CORONAL
    case 3:
      return SLICE_TYPE.RENDER
    case 4:
      return SLICE_TYPE.MULTIPLANAR
    case 5:
      return SLICE_TYPE.MULTIPLANAR
  }
}

export const IndexLayoutType = (n: number) => {
  switch (n) {
    case 0:
      return MULTIPLANAR_TYPE.AUTO
    case 1:
      return MULTIPLANAR_TYPE.COLUMN
    case 2:
      return MULTIPLANAR_TYPE.GRID
    case 3:
      return MULTIPLANAR_TYPE.ROW
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const HandlePromisseError = (error: any) => {
  if (error.response) {
    console.log('Error: unknown status code: ', error.response.status)
  } else if (error.request) {
    console.log(error.request)
  } else {
    console.log('Error', error.message)
  }
}
