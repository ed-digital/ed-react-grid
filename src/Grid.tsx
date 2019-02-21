import * as React from 'react'
import styled from 'styled-components'
import { wrapperGenerator } from './generators'
import { basicGridWrapperStyle } from './styles'

export const WrapperContext = React.createContext<boolean>(false)

export default function Grid(props: { children: React.ReactNode }) {
  return (
    <WrapperContext.Provider value={true}>
      <GridStyle {...props} />
    </WrapperContext.Provider>
  )
}

export const GridStyle = styled.div`
  ${basicGridWrapperStyle}
  ${props => wrapperGenerator()(props)}
`
