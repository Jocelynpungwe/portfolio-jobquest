import React from 'react'
import Wrapper from '../assets/wrapper/BigSidebar'
import NavLinks from './NavLink'
import Logo from '../components/Logo'
import { useSelector } from 'react-redux'

const BigSidebar = () => {
  const { isSideBarOpen } = useSelector((store) => store.user)

  return (
    <Wrapper>
      <div
        className={
          isSideBarOpen
            ? 'sidebar-container '
            : 'sidebar-container show-sidebar'
        }
      >
        <div className="content">
          <header>
            <Logo />
          </header>
          <NavLinks />
        </div>
      </div>
    </Wrapper>
  )
}

export default BigSidebar
