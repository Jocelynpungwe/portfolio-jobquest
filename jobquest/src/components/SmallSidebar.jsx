import React from 'react'
import Wrapper from '../assets/wrapper/SmallSidebar'
import { FaTimes } from 'react-icons/fa'
import Logo from './Logo'
import { useSelector, useDispatch } from 'react-redux'
import { toggleSideBar } from '../features/user/userSlice'
import NavLinks from './NavLink'

const SmallSidebar = () => {
  const { isSideBarOpen } = useSelector((store) => store.user)
  const dispatch = useDispatch()

  return (
    <Wrapper>
      <div
        className={
          isSideBarOpen ? 'sidebar-container show-sidebar' : 'sidebar-container'
        }
      >
        <div className="content">
          <button
            className="close-btn"
            onClick={() => dispatch(toggleSideBar())}
          >
            <FaTimes />
          </button>
          <header>
            <Logo />
          </header>
          <NavLinks toggleSidebar={() => dispatch(toggleSideBar())} />
        </div>
      </div>
    </Wrapper>
  )
}

export default SmallSidebar
