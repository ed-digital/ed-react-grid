import * as React from 'react'
import styled from 'styled-components'
import { rowGenerator, columnPadding } from './generators'
import { basicRowStyle } from './styles'
import { VerticalGutterPaddingProps, StyledProps } from './types'
import { default as Grid, WrapperContext } from './Grid'
export type RowProps = VerticalGutterPaddingProps & {
  children: React.ReactNode
}

export default function Row(props: RowProps) {
  const hasWrapper = React.useContext(WrapperContext)
  const result = <RowStyle {...props} />
  return hasWrapper ? result : <Grid>{result}</Grid>
}

const RowStyle = styled.div`
  ${basicRowStyle}
  ${rowGenerator()}
  ${(props: RowProps & StyledProps) => columnPadding(props)(props)}
`
