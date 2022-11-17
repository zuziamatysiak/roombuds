import { TextField } from '@material-ui/core'

interface iFormFieldProps {
  id: string
  label: string
  value: string
  updateState: (newState: Object) => void
  required?: boolean
  fullWidth?: boolean
}

export const FormField = ({
  id,
  label,
  value,
  updateState,
  required = true, // defaults to true
  fullWidth = true, // defaults to true
}: iFormFieldProps) => {
  return (
    <TextField
      id={id}
      label={label}
      value={value}
      required={required}
      fullWidth={fullWidth}
      onChange={(e) => updateState({ [id]: e.target.value })}
    />
  )
}
