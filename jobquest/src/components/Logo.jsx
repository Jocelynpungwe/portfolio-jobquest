import React from 'react'
import styled from 'styled-components'

const Logo = () => {
  return (
    <Wrapper>
      <div>
        <h1>J</h1>
      </div>
      <h3>JobQuest</h3>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;

  div {
    color: var(--white);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    background: var(--primary-500);
    border-radius: 10px;
  }
  h1 {
    font-size: 2rem;
    margin: auto;
  }

  h3 {
    color: var(--primary-500);
    font-weight: 900;
    margin-top: 5px;
    margin-left: 8px;
  }
`

export default Logo
