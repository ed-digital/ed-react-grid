import { number, ReactComponentLike } from 'prop-types'
import { ReactElement, FunctionComponentElement, FunctionComponent } from 'react'

export type BreakpointDef = {
  at: number | [number, number]
  fluid: boolean
  gutter: number
  padding: number
  width: number
  columns?: number
}

export type GridDef = {
  columns: number
  breakpoints: {
    [name: string]: BreakpointDef
  }
}

export type BreakpointSizes = {
  width: number
  column: number
  gutter: number
  padding: number
}

export type Breakpoint = BreakpointDef & {
  name: string
  columns: number
  min: number
  max: number | null
  query: string
  rangedQuery: string
  colWidths: { [index: number]: number }
  units: string
  explicitMax: boolean
  size: BreakpointSizes
}

export type Grid = {
  columns: number
  breakpoints: Breakpoint[]
  breakpointsByName: { [index: string]: Breakpoint }
}

type Baseline<T> = ((props: StyledProps) => T) | T

export type Theme = {
  grid: Grid
  baseline?: Baseline<number>
}

export type StyledProps = {
  theme: Theme
}

export type VerticalGutterPaddingProps = {
  gutterTop?: true | number
  gutterBottom?: true | number
}

export type ColumnProps = {
  cols: number
  left?: number
  right?: number
  drift?: number
  visible?: boolean
  maxHeight?: boolean
  component?: FunctionComponent<any>
  [other: string]: any
}
