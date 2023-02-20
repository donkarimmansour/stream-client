import React from 'react'
import { useNavigate } from 'react-router-dom'
import * as FaIcons from 'react-icons/fa'
import './SideNavbar.css'
import styles from '../../styles/styles'
import eventTrack from '../../utils/eventTrack'

function SideNavbar(props) {
  const navigate = useNavigate()
  const url = window.location.pathname

  return (
    <ul
      className={!url.includes('studio') ? 'side-navbar' : 'side-navbar-hidden'}
    >
      {/* Broadcasts */}
      <li
        id='side-navbar-broadcasts-li'
        onClick={() => navigate('/broadcast')}
        style={
          window.location.pathname === '/broadcast'
            ? { backgroundColor: styles.sideNavbarHoverColor }
            : null
        }
      >
        <div
          style={
            window.location.pathname === '/broadcast' ? { color: '#fff' } : null
          }
          className='side-navbar-icon'
        >
          <FaIcons.FaVideo size={styles.sideNavbarIconSize} />
        </div>
        <div
          style={
            window.location.pathname === '/broadcast' ? { color: '#fff' } : null
          }
          className='side-navbar-title'
        >
          Broadcast
        </div>
      </li>
      {/* Destinations */}
      <li
        onClick={() => {
          navigate('/destinations')
          eventTrack('App', 'Destinations Tab Clicked', 'Button')
        }}
        style={
          window.location.pathname === '/destinations'
            ? { backgroundColor: styles.sideNavbarHoverColor }
            : null
        }
      >
        <div
          style={
            window.location.pathname === '/destinations'
              ? { color: '#fff' }
              : null
          }
          className='side-navbar-icon'
        >
          <FaIcons.FaKey size={styles.sideNavbarIconSize} />
        </div>
        <div
          style={
            window.location.pathname === '/destinations'
              ? { color: '#fff' }
              : null
          }
          className='side-navbar-title'
        >
          Destinations
        </div>
      </li>
      {/* Referrals */}

      {/* <li
        onClick={() => history.push('/referrals')}
        style={
          window.location.pathname === '/referrals'
            ? { backgroundColor: styles.sideNavbarHoverColor }
            : null
        }
        className='tablinks'
      >
        <div className='side-navbar-icon'>
          <FaIcons.FaShare size={styles.sideNavbarIconSize} />
        </div>
        <div className='side-navbar-title'>Referrals</div>
      </li> */}
    </ul>
  )
}

export default SideNavbar
