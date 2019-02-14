import * as React from 'react'
import styled from 'styled-components'
import { column, columnPadding } from './generators'
import { basicColumnStyle } from './styles'
import { ColumnProps, StyledProps } from './types'

type ColProps = ColumnProps & { children: React.ReactNode }

const Col = (props: ColProps) => {
  const Component = props.component
    ? styled(props.component)`
        ${basicColumnStyle}
        ${(props: ColProps & StyledProps) => column(props)(props)}
      `
    : styled.div`
        ${basicColumnStyle}
        ${(props: ColProps & StyledProps) => column(props)(props)}
      `

  return <Component {...props} />
}

export default Col
