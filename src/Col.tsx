import * as React from 'react'
import styled from 'styled-components'
import { column, columnPadding } from './generators'
import { basicColumnStyle } from './styles'
import { ColumnProps, StyledProps } from './types'

type ColProps = ColumnProps & { children: React.ReactNode }

export default styled.div<ColProps>`
  ${basicColumnStyle}
  ${(props: ColProps & StyledProps) => column(props)(props)}
`
