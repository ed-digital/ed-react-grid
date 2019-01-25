import { Breakpoint, GridDef, Grid } from './types'

function calculateSizes(breakpoint: Breakpoint) {
  let columnWidth =
    (breakpoint.width - (breakpoint.columns - 1) * breakpoint.gutter - breakpoint.padding * 2) /
    breakpoint.columns
  return {
    width: breakpoint.width,
    column: columnWidth,
    gutter: breakpoint.gutter,
    padding: breakpoint.padding
  }
}

export default function createGrid(grid: GridDef): Grid {
  // Compile an array of breakpoints
  let breakpoints = []
  let breakpointsByName: { [name: string]: any } = {}
  for (let k in grid.breakpoints) {
    let item = grid.breakpoints[k]
    let breakpoint = {
      ...item,
      name: k,
      columns: item.columns || grid.columns,
      min: typeof item.at === 'number' ? item.at : Array.isArray(item.at) ? item.at[0] : 0,
      max: Array.isArray(item.at) ? item.at[1] : undefined,
      explicitMax: Array.isArray(item.at)
    }
    breakpointsByName[breakpoint.name] = breakpoint
    breakpoints.push(breakpoint)
  }

  // Sort by 'at' (the minimum size)
  breakpoints.sort((a, b) => a.min - b.min)

  for (let k = 0; k < breakpoints.length; k++) {
    let breakpoint = (breakpoints[k] as unknown) as Breakpoint
    let next = breakpoints.length >= k && breakpoints[k + 1]
    breakpoint.max = breakpoint.max || (next && next.min) || null
    breakpoint.columns = breakpoint.columns || grid.columns || 12
    breakpoint.rangedQuery =
      '(min-width: ' +
      (breakpoint.min || 0) +
      'px) and (max-width: ' +
      (breakpoint.max || 99999) +
      'px)'
    breakpoint.query = breakpoint.explicitMax
      ? breakpoint.rangedQuery
      : '(min-width: ' + (breakpoint.min || 0) + 'px)'
    breakpoint.size = calculateSizes(breakpoint)
    breakpoint.units = breakpoint.fluid ? 'vw' : 'px'
    breakpoint.colWidths = {}
    for (let k = 1; k <= breakpoint.columns; k++) {
      breakpoint.colWidths[k] = k * breakpoint.size.column + (k - 1) * breakpoint.size.gutter
    }
  }

  return {
    columns: grid.columns,
    breakpoints: (breakpoints as unknown) as Breakpoint[],
    breakpointsByName: breakpointsByName
  }
}
