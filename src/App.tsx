import ScoreTable from './ScoreTable'
import styled from 'styled-components'

function App() {
  return (
    <AppWrapper>
      <ScoreTable />
    </AppWrapper>
  )
}

const AppWrapper = styled.div`
  margin-top: 15px;
`

export default App
