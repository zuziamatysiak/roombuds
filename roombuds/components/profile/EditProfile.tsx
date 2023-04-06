import { ChangeEvent, useCallback, useState } from 'react'

import { Box, Button, TextField, Typography } from '@material-ui/core'
import Modal from '@mui/material/Modal'
import { COLORS } from '../../utils/colors'
import { Subtitle } from '../Text'
import { Avatar } from './Avatar'
import { deleteS3, uploadS3 } from '../../utils/s3'
import { useUser } from '../../utils/auth'
import { put, update } from '../../utils/database'
import {
  RANDOM_PATH,
  S3_BUCKET_URL,
  USER_PREFERENCES_TABLE,
  USER_PROFILE_PICTURES,
} from '../../utils/constants'
import { OnboardQuestionnaire } from '../OnboardQuestionnaire'

interface IEditProfileModal {
  open: boolean
  setOpen: (open: boolean) => void
  userPrefs: any
}

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '25%',
  left: '50%',
  transform: 'translate(-50%, -25%)',
  width: '50%',
  border: `1px solid ${COLORS.GREEN}`,
  backgroundColor: 'white',
  padding: '2rem',
  overflowY: 'auto' as 'auto',
  height: '100vh',
}

export const EditProfileModal = ({
  open,
  setOpen,
  userPrefs,
}: IEditProfileModal) => {
  const [user] = useUser()
  const [state, setState] = useState<any>(userPrefs)
  const [profPic, setProfPic] = useState<File | null>(null)

  const updateState = useCallback((newState: any) => {
    setState((currentState: any) => ({ ...currentState, ...newState }))
  }, [])

  const handleClose = () => setOpen(false)

  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      let img = e.target.files[0]
      setProfPic(img)
      updateState({
        profilePicPath: URL.createObjectURL(img),
      })
    }
  }

  const handleSave = () => {
    if (profPic) {
      // delete old profile pic from s3 (if not default pic)
      if (userPrefs.profilePicPath !== RANDOM_PATH) {
        let oldImgKey = userPrefs.profilePicPath.split('/').pop()
        deleteS3(oldImgKey)
          .then()
          .catch((err) => {
            console.log(err)
          })
      }
      let imgType = profPic.name.split('.')[1]
      let imgKey = user.username + '.' + imgType
      uploadS3(profPic, imgKey)
        .then()
        .catch((err) => console.log(err))

      // update profile pic URL in db
      update(
        { profilePicPath: S3_BUCKET_URL + imgKey },
        'username',
        user.username,
        USER_PROFILE_PICTURES
      )
    }
    // update table with new preferences
    put({ username: user.username, ...state }, USER_PREFERENCES_TABLE).catch(
      (err) => console.log(err)
    )

    location.reload()
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <Box style={modalStyle}>
        <Typography variant="h4">Editing Profile</Typography>
        <Subtitle text="Profile Picture" />
        <Avatar
          src={state.profilePicPath}
          width={200}
          height={200}
          alt="profile_picture"
        />
        <Button variant="outlined" style={{ float: 'right' }} component="label">
          Upload Photo
          <input
            type="file"
            name="prof-pic-upload"
            hidden
            onChange={handleImage}
          />
        </Button>
        <Subtitle text="Update Personal Information" />
        <TextField
          id={'bio'}
          label={'Bio'}
          value={state.bio}
          fullWidth
          multiline
          minRows={4}
          onChange={(e) => updateState({ ['bio']: e.target.value })}
          style={{ margin: '1rem 0' }}
          variant="outlined"
        />
        <OnboardQuestionnaire state={state} updateState={updateState} />
        <div>
          <Button
            style={{ backgroundColor: COLORS.GREEN, color: 'white' }}
            variant="contained"
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </Box>
    </Modal>
  )
}
