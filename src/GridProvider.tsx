import * as React from 'react'
import { ThemeProvider } from 'styled-components'
import { Grid } from './types'
import { GridContext } from './context'

type Props = {
  grid: Grid
  children: React.ReactElement<any>
}

export default function GridProvider(props: Props) {
  const grid = props.grid

  return (
    <GridContext.Provider value={grid}>
      <ThemeProvider theme={{ grid: grid }}>{props.children}</ThemeProvider>
    </GridContext.Provider>
  )
}

// export default class GridProvider extends ThemeProvider {
//   static childContextTypes = {
//     ...ThemeProvider.childContextTypes,
//     zooperGridSettings: React.PropTypes.object.isRequired
//   }
//
//   static propTypes = {
//     breakpoints: React.PropTypes.object
//   }
//
//   constructor(props, context) {
//     super(props, context)
//     this.props = props
//     this.grid = this.getGrid()
//   }
//
//   getTheme() {
//     let theme = ThemeProvider.prototype.getTheme.call(this, {
//       zooperGrid: this.grid
//     })
//     return theme
//   }
//
//   getChildContext() {
//     return {
//       ...ThemeProvider.prototype.getChildContext.call(this),
//       zooperGridSettings: this.grid
//     }
//   }
//
//   getGrid(props) {
//     return this.processGrid(this.props)
//   }
// }
