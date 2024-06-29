import React from 'react'
import styled from 'styled-components'

const Logo = ({ page }) => {
  return (
    <Wrapper>
      <div className={page !== 'navbar' ? '' : 'div-logo'}>
        <h1>J</h1>
      </div>
      <h3 className={page !== 'navbar' ? '' : 'h3-logo'}>JobQuest</h3>
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

  .h3-logo {
    display: none;
  }

  @media (min-width: 450px) {
    .div-logo {
      display: none;
    }

    .h3-logo {
      display: block;
      margin-top: 1rem;
    }
  }
`

export default Logo
