import { ChangeEvent, useCallback, useState } from 'react'

import { Box, Button, Typography } from '@material-ui/core'
import Modal from '@mui/material/Modal'
import { COLORS } from '../../utils/colors'
import { FormTextField } from '../Form'
import { Subtitle } from '../Text'
import { Avatar } from './Avatar'
import { deleteS3, hash, uploadS3 } from '../../utils/s3'
import { useUser } from '../../utils/auth'
import { update } from '../../utils/database'
import { S3_BUCKET_URL, USER_PROFILE_PICTURES } from '../../utils/constants'

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
      let oldImgKey = userPrefs.profilePicPath.split('/').pop()
      deleteS3(oldImgKey)
        .then()
        .catch((err) => {
          console.log(err)
        })
      let imgType = profPic.name.split('.')[1]
      // e.g. 1234567890.png
      let imgKey = String(hash(user.email)) + '.' + imgType
      uploadS3(profPic, imgKey).then()

      // update profile pic URL in db
      update(
        { profilePicPath: S3_BUCKET_URL + imgKey },
        'email',
        user.email,
        USER_PROFILE_PICTURES
      )
    }

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
        <FormTextField
          id="loc_city"
          label="Location (City)"
          value={state.loc_city}
          updateState={updateState}
        />
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
