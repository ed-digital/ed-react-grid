import { createContext } from 'react'
import { Grid } from './types'

export const GridContext = createContext<Grid>({
  columns: 0,
  breakpointsByName: {},
  breakpoints: []
})
