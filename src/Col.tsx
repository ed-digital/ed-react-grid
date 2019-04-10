import * as React from 'react'
import styled from 'styled-components'
import { column, columnPadding } from './generators'
import { basicColumnStyle } from './styles'
import { ColumnProps, StyledProps } from './types'

type ColProps = ColumnProps & { children: React.ReactNode }

const Col = styled.div`
  ${basicColumnStyle}
  ${(props: ColProps & StyledProps) => column(props)(props)}
`

type ColComponentProps = ColumnProps & { component: React.FunctionComponent }

export const ColComponent = (props: ColComponentProps) => styled(props.component)`
  ${basicColumnStyle}
  ${(props: ColProps & StyledProps) => column(props)(props)}
`
Col.displayName = 'Col'
ColComponent.displayName = 'ColComponent'

export default Col
