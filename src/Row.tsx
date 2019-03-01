import * as React from 'react'
import styled, { css } from 'styled-components'
import { row, columnPadding } from './generators'
import { basicRowStyle } from './styles'
import { VerticalGutterPaddingProps, StyledProps } from './types'
import { default as Grid, WrapperContext } from './Grid'

export type RowProps = VerticalGutterPaddingProps & {
  children: React.ReactNode
  noWrap?: true
}

export default function Row(props: RowProps) {
  const hasWrapper = React.useContext(WrapperContext)
  const result = <RowStyle {...props} />
  return hasWrapper ? result : <Grid>{result}</Grid>
}

export const RowStyle = styled.div`
  ${basicRowStyle}
  ${row()}
  ${(props: RowProps & StyledProps) => columnPadding(props)(props)}
  ${props =>
    props.noWrap &&
    css`
      white-space: nowrap;

      > div {
        white-space: auto;
      }
    `}
`
