import Image from 'next/image'
import {
  AppBar,
  Toolbar,
  CssBaseline,
  Typography,
  Button,
} from '@material-ui/core'
import { useUser } from '../utils/auth'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useCookies } from 'react-cookie'
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded'
import { COLORS } from '../utils/colors'
import { useState } from 'react'
import {
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
} from '@mui/material'
import { Logout } from '@mui/icons-material'
import QuizIcon from '@mui/icons-material/Quiz'
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead'
import FaceIcon from '@mui/icons-material/Face'

export const Navbar = () => {
  const [user] = useUser()
  const [cookies, setCookie, removeCookie] = useCookies(['user'])

  const router = useRouter()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <AppBar position="static" style={{ background: '#FFFFFF' }}>
      <CssBaseline />
      <Toolbar style={{ justifyContent: 'space-between' }}>
        <Typography variant="h4">
          <div style={{ width: '20%', paddingTop: '5px' }}>
            <Link href={user.email ? '/explore' : '/'}>
              <Image src="/logo.png" alt="logo" width={190} height={60} />
            </Link>
          </div>
        </Typography>
        {!user.email ||
        router.pathname === '/' ||
        router.pathname === '/login' ? (
          <Button
            style={{
              backgroundColor: '#459b55',
              color: 'white',
            }}
            variant="contained"
            href="/login"
          >
            Log in
          </Button>
        ) : (
          <div style={{ display: 'flex' }}>
            <Button
              style={{
                marginRight: '1em',
              }}
              variant="outlined"
              onClick={() => {
                router.push('/explore')
              }}
            >
              Explore
            </Button>
            <Button
              style={{
                marginRight: '1em',
              }}
              variant="outlined"
              onClick={() => {
                router.push('/matches')
              }}
            >
              Matches
            </Button>
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={Boolean(anchorEl) ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
            >
              <AccountCircleRoundedIcon
                style={{ fill: COLORS.GREEN, fontSize: '36px' }}
              />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={Boolean(anchorEl)}
              onClose={handleClose}
              onClick={handleClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <div style={{ padding: '0.25rem 1rem' }}>
                <p
                  style={{
                    color: COLORS.GREEN,
                    fontSize: '1.2rem',
                    marginBottom: '0',
                    fontWeight: '600',
                  }}
                >{`${user.firstName} ${user.lastName}`}</p>
                <p style={{ fontSize: '12px', marginTop: '0' }}>
                  {user.username}
                </p>
              </div>
              <Divider />
              <MenuItem
                onClick={() => router.push(`/profile/${user.username}`)}
                style={{ fontFamily: 'Quicksand' }}
              >
                <ListItemIcon>
                  <FaceIcon fontSize="small" style={{ fill: COLORS.GREEN }} />
                </ListItemIcon>
                Profile
              </MenuItem>
              {!user.verified && (
                <MenuItem
                  onClick={() => {
                    router.push('/verify')
                  }}
                  style={{ fontFamily: 'Quicksand' }}
                >
                  <ListItemIcon>
                    <MarkEmailReadIcon
                      fontSize="small"
                      style={{ fill: COLORS.GREEN }}
                    />
                  </ListItemIcon>
                  Verify Email
                </MenuItem>
              )}
              <MenuItem
                onClick={() => {
                  router.push('/quizzes')
                }}
                style={{ fontFamily: 'Quicksand' }}
              >
                <ListItemIcon>
                  <QuizIcon fontSize="small" style={{ fill: COLORS.GREEN }} />
                </ListItemIcon>
                Quizzes
              </MenuItem>
              <MenuItem
                onClick={() => {
                  removeCookie('user', { path: '/' })
                  localStorage.clear()
                  router.push('/')
                }}
                style={{ fontFamily: 'Quicksand' }}
              >
                <ListItemIcon>
                  <Logout fontSize="small" style={{ fill: COLORS.GREEN }} />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </div>
        )}
      </Toolbar>
    </AppBar>
  )
}
