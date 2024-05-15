import React from 'react'
import Wrapper from '../assets/wrapper/LandingPage'
import { Logo } from '../components'
import main from '../assets/images/main.svg'
import { Link } from 'react-router-dom'

const LandingPage = () => {
  return (
    <Wrapper>
      <nav>
        <Logo />
      </nav>
      <div className="container page">
        {/* info */}
        <div className="info">
          <h1>
            job <span>tracking</span> app
          </h1>
          <p>
            JobQuest is a powerful job tracking app designed to assist job
            seekers in their quest for employment. Our mission is simple: to
            help you secure your dream job. Whether you’re actively searching or
            passively exploring opportunities, JobQuest provides a seamless
            experience.
          </p>
          <Link to="/register" className="btn btn-hero">
            Login/Register
          </Link>
        </div>
        <img src={main} alt="job hunt" className="img main-img" />
      </div>
    </Wrapper>
  )
}

export default LandingPage
