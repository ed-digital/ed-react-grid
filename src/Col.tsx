import * as React from 'react'
import styled from 'styled-components'
import { column, columnPadding } from './generators'
import { basicColumnStyle } from './styles'
import { ColumnProps, StyledProps } from './types'

type ColProps = ColumnProps & { children: React.ReactNode }

export default function Col(props: ColProps) {
  return <ColStyle {...props} />
}

const ColStyle = styled.div`
  ${basicColumnStyle}
  ${(props: ColumnProps & StyledProps) => column(props)(props)}
`

//  ${props => columnPadding(props)(props)}
