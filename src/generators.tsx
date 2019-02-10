import { css } from 'styled-components'
import { ColumnProps, StyledProps, Breakpoint, VerticalGutterPaddingProps } from './types'

export const column = (conf: ColumnProps) => ({ theme }: StyledProps) => {
  let lastSizes = {
    cols: conf.cols || 1,
    drift: conf.drift || undefined,
    left: conf.left || undefined,
    right: conf.right || undefined,
    visible: conf.visible === false ? false : true,
    maxHeight: conf.maxHeight || false
  }
  return theme.grid.breakpoints
    .map(breakpoint => {
      let value = conf[breakpoint.name]
      let left = conf[breakpoint.name + 'Left']
      let right = conf[breakpoint.name + 'Right']
      let drift = conf[breakpoint.name + 'Drift']
      let maxHeight = conf[breakpoint.name + 'MaxHeight']
      let visible = conf[breakpoint.name + 'Visible']
      if (left !== undefined) lastSizes.left = left
      if (right !== undefined) lastSizes.right = right
      if (visible !== undefined) lastSizes.visible = visible
      if (drift !== undefined) lastSizes.drift = drift
      if (!value) {
        value = Math.min(breakpoint.columns, lastSizes.cols || 1)
      }
      lastSizes.cols = value
      if (maxHeight === undefined) maxHeight = lastSizes.maxHeight
      if (visible === undefined) visible = lastSizes.visible
      if (drift === undefined) drift = lastSizes.drift
      if (left === undefined) left = lastSizes.left
      if (right === undefined) right = lastSizes.right
      const width = breakpoint.size.column * value + breakpoint.size.gutter * (value - 1)
      return `
        @media ${breakpoint.rangedQuery} {
          width: ${width}${breakpoint.units};
          margin-left: ${breakpoint.size.gutter}${breakpoint.units};
          display: ${visible ? 'block' : 'none'};
          ${((drift || maxHeight) && 'position: relative;') || ''}
          ${
            typeof left === 'number'
              ? 'margin-left: ' +
                (breakpoint.size.column * left +
                  breakpoint.size.gutter * left +
                  breakpoint.size.gutter) +
                breakpoint.units
              : ''
          }
          ${
            typeof right === 'number'
              ? 'margin-right: ' +
                (breakpoint.size.column * right + breakpoint.size.gutter * right) +
                breakpoint.units
              : ''
          }
          ${
            typeof drift === 'number'
              ? 'left: ' +
                (breakpoint.size.column * drift + breakpoint.size.gutter * drift) +
                breakpoint.units
              : ''
          }
          ${(maxHeight && 'height: 100%;') || ''}
        }
      `
    })
    .join('\n')
}

export const row = () => ({ theme }: StyledProps) => {
  return theme.grid.breakpoints
    .map(
      breakpoint => `
        @media ${breakpoint.rangedQuery} {
          margin-left: ${-breakpoint.size.gutter}${breakpoint.units};
          box-sizing: border-box;
        }
      `
    )
    .join('\n')
}

export const wrapperGenerator = () => ({ theme }: StyledProps) => {
  return theme.grid.breakpoints
    .map(
      breakpoint => `
        @media ${breakpoint.rangedQuery} {
          width: ${breakpoint.size.width}${breakpoint.units};
          margin: auto;
          padding-left: ${breakpoint.size.padding}${breakpoint.units};
          padding-right: ${breakpoint.size.padding}${breakpoint.units};
          box-sizing: border-box;
        }
      `
    )
    .join('\n')
}

export const columnPadding = (conf: VerticalGutterPaddingProps, fromSize?: string) => ({
  theme
}: StyledProps) => {
  if (!conf.gutterTop && !conf.gutterBottom) return ''
  let lastDefinedTop = 0
  let lastDefinedBottom = 0
  return theme.grid.breakpoints
    .map(breakpoint => {
      if (fromSize && breakpoint.name !== fromSize) return ''
      let gutterTop: number = 0
      let gutterBottom: number = 0
      if (conf.gutterTop) {
        if (conf.gutterTop === true || typeof conf.gutterTop === 'number') {
          gutterTop = Number(conf.gutterTop)
        } else if (typeof conf.gutterTop === 'object') {
          if (breakpoint.name in conf.gutterTop) {
            gutterTop = lastDefinedTop = conf.gutterTop[breakpoint.name]
          } else {
            gutterTop = lastDefinedTop
          }
        }
      }
      if (conf.gutterBottom) {
        if (conf.gutterBottom === true || typeof conf.gutterBottom === 'number') {
          gutterBottom = Number(conf.gutterBottom)
        } else if (typeof conf.gutterBottom === 'object') {
          if (breakpoint.name in conf.gutterBottom) {
            gutterBottom = lastDefinedBottom = conf.gutterBottom[breakpoint.name]
          } else {
            gutterBottom = lastDefinedBottom
          }
        }
      }
      const gutterTopSize = gutterTop * breakpoint.size.gutter
      const gutterBottomSize = gutterBottom * breakpoint.size.gutter
      return `
        @media ${breakpoint.query} {
          ${gutterTopSize ? `margin-top: ${gutterTopSize}${breakpoint.units};` : ''}
          ${gutterBottomSize ? `margin-bottom: ${gutterBottomSize}${breakpoint.units};` : ''}
        }
      `
    })
    .join('\n')
}

export const absoluteInset = (properties: string[], sizes?: string[]) => ({
  theme
}: StyledProps) => {
  if (sizes && !Array.isArray(sizes)) {
    throw new Error('The second argument to absoluteInsert should be an array, or undefined')
  }

  return theme.grid.breakpoints.map(breakpoint => {
    if (!sizes || sizes.indexOf(breakpoint.name) > -1) {
      return (
        '@media ' +
        breakpoint.rangedQuery +
        ' {\n' +
        properties
          .map(property => {
            if (property === 'left') {
              return (
                'left: 50%;\nmargin-left: ' +
                -(breakpoint.size.width / 2 - breakpoint.size.padding) +
                breakpoint.units +
                ';\n'
              )
            } else {
              return property + ': ' + breakpoint.size.gutter + breakpoint.units + ';\n'
            }
          })
          .join('\n') +
        '}'
      )
    } else {
      return ''
    }
  })
}

type BreakpointRenderer = (breakpoint: Breakpoint) => any

export const each = (callback: BreakpointRenderer) => {
  return ({ theme }: StyledProps) => {
    return css`
      ${theme.grid.breakpoints.map(breakpoint => {
        return css`
          @media ${breakpoint.rangedQuery} {
            ${callback(breakpoint)}
          }
        `
      })}
    `
  }
}

export const at = (
  sizes: string[] | string,
  callback: BreakpointRenderer | ReturnType<typeof css> | string
) => {
  return ({ theme }: StyledProps) => {
    return css`
      ${theme.grid.breakpoints.map(breakpoint => {
        if (!sizes || breakpoint.name === sizes || sizes.indexOf(breakpoint.name) > -1) {
          return css`
            @media ${breakpoint.rangedQuery} {
              ${typeof callback === 'function' ? callback(breakpoint) : callback}
            }
          `
        } else {
          return ''
        }
      })}
    `
  }
}


export const rem = (sizeInPixels:number, smart:boolean = false) => {
  if (smart) {
    return function (props:StyledProps) : string {
      const baseline = props.theme.baseline

      // Throw error if baseline has not been set and rem has tried to be set
      if (!baseline) {
        throw new Error(`Baseline is required in order to use a smart rem conversion.
Add 'export const baseline = number|function' to your theme.ts`)
      } 
      
      // Throw an error is baseline is not a number or function
      if (typeof baseline !== 'number' || typeof baseline !== 'function') {
        throw new Error(`baseline must of be either a number of function that returns a number`)
      }
      
      
      if (typeof baseline === 'function') {
        return (sizeInPixels / (baseline as Function)(props)) + 'rem'
      } else {
        return (sizeInPixels / baseline) + 'rem'
      }
    }
  }
}

export const from = (
  size: string,
  callback: BreakpointRenderer | ReturnType<typeof css> | string
) => {
  return ({ theme }: StyledProps) => {
    let active = false
    return css`
      ${theme.grid.breakpoints.map(breakpoint => {
        if (!active && size === breakpoint.name) active = true
        if (active) {
          return css`
            @media ${breakpoint.rangedQuery} {
              ${typeof callback === 'function' ? callback(breakpoint) : callback}
            }
          `
        } else {
          return ''
        }
      })}
    `
  }
}

export const until = (
  size: string,
  callback: BreakpointRenderer | ReturnType<typeof css> | string
) => {
  return ({ theme }: StyledProps) => {
    let active = true
    return css`
      ${theme.grid.breakpoints.map(breakpoint => {
        if (active && size === breakpoint.name) active = false
        if (active) {
          return css`
            @media ${breakpoint.rangedQuery} {
              ${typeof callback === 'function' ? callback(breakpoint) : callback}
            }
          `
        } else {
          return ''
        }
      })}
    `
  }
}

export const queryAt = (size: string | string[]) => {
  return ({ theme }: StyledProps) => {
    let items = []
    for (let breakpoint of theme.grid.breakpoints) {
      if (size === breakpoint.name || (Array.isArray(size) && size.indexOf(breakpoint.name) > -1)) {
        items.push(breakpoint.rangedQuery)
      }
    }
    if (items.length === 0) throw new Error('Unknown grid size(s) ' + size)
    return items.join(', ')
  }
}

export const queryFrom = (size: string) => {
  return ({ theme }: StyledProps) => {
    let breakpoint = theme.grid.breakpointsByName[size]
    if (!breakpoint) throw new Error('Unknown grid size: ' + size)
    return breakpoint.query
  }
}

export const columnWidth = (cols: number, size?: string) => {
  return ({ theme }: StyledProps) => {
    let active = false
    let items = []
    for (let breakpoint of theme.grid.breakpoints) {
      if (active || !size || breakpoint.name === size) {
        active = true
      }
      if (active) {
        items.push(
          '@media ' +
            breakpoint.rangedQuery +
            ' {\n width: ' +
            breakpoint.colWidths[cols] +
            breakpoint.units +
            ';\n}'
        )
      }
    }
    return items.join('\n')
  }
}

export const columnLeft = (cols: number, size?: string) => {
  return ({ theme }: StyledProps) => {
    let active = false
    let items = []
    for (let breakpoint of theme.grid.breakpoints) {
      if (active || !size || breakpoint.name === size) {
        active = true
      }
      if (active) {
        items.push(`
          @media ${breakpoint.rangedQuery} {
            left: 50%;
            margin-left: ${-breakpoint.colWidths[breakpoint.columns / 2] -
              breakpoint.size.gutter / 2 +
              (cols ? breakpoint.colWidths[cols] + breakpoint.size.gutter : 0)}${breakpoint.units};
          }
        `)
      }
    }
    return items.join('\n')
  }
}
