import { Box, Button, Grid, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useUser } from '../../utils/auth'
import { EditProfileModal } from './EditProfile'
import { get } from '../../utils/database'
import { USER_PROFILE_PICTURES, USER_TABLE } from '../../utils/constants'
import { Avatar } from './Avatar'

interface iProfileHeader {
  username: any
  userPrefs: any
  userInfo: any
}

const ProfileHeader = ({ username, userPrefs, userInfo }: iProfileHeader) => {
  const [currUser] = useUser()
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [profilePicPath, setProfilePicPath] = useState('')

  useEffect(() => {
    async function fetchProfilePic() {
      const response = await get('username', username, USER_PROFILE_PICTURES)
      if (response.success) {
        setProfilePicPath(response.data?.profilePicPath)
      } else {
        console.log('no profile pic found', response)
      }
    }
    if (username) {
      fetchProfilePic()
    }
  })

  return (
    <Grid container>
      <Grid item xs={12} sm={12} md={4} lg={3}>
        {profilePicPath && (
          <Avatar
            src={profilePicPath}
            alt="profile_picture"
            width={200}
            height={200}
          />
        )}
      </Grid>
      <Grid item xs={12} sm={12} md={9}>
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            position: 'relative',
          }}
        >
          {/* Edit button appears if on our own profile */}
          {currUser.username === username && (
            <Button
              variant="outlined"
              style={{ position: 'absolute', top: 0, right: 0 }}
              onClick={() => setEditModalOpen(!editModalOpen)}
            >
              Edit
            </Button>
          )}
          {profilePicPath && (
            <EditProfileModal
              open={editModalOpen}
              setOpen={setEditModalOpen}
              userPrefs={{ ...userPrefs, ...{ profilePicPath } }}
            />
          )}
          <Typography variant="h4">
            {userInfo?.firstName} {userInfo?.lastName}{' '}
            {userInfo?.verified ? '✅' : ''}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  )
}

export default ProfileHeader
