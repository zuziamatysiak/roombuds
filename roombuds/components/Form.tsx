import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@material-ui/core'
export const FormTextField = ({
  id,
  label,
  value,
  updateState,
  type = "", // defaults to empty string
  required = true, // defaults to true
  fullWidth = true, // defaults to true
}: {
  id: string
  label: string
  value: string
  type?: string
  updateState: (newState: Object) => void
  required?: boolean
  fullWidth?: boolean
}) => {
  return (
    <TextField
      id={id}
      label={label}
      value={value}
      required={required}
      fullWidth={fullWidth}
      type={type}
      onChange={(e) => updateState({ [id]: e.target.value })}
      style={{ marginBottom: '1rem' }}
    />
  )
}

export const FormSelect = ({
  id,
  label,
  items,
  value,
  updateState,
  labelShrink = true,
  labelStyle = {},
  selectStyle = { marginBottom: '1rem' }
}: {
  id: string
  label: string
  items: Array<any>
  value: String
  updateState: (newState: Object) => void
  labelShrink?: boolean
  labelStyle?: {}
  selectStyle?: {}
}) => {
  return (
    <FormControl fullWidth>
      <InputLabel id={id} shrink={labelShrink} style={labelStyle}>{label}</InputLabel>
      <Select
        labelId={id}
        id={`${id}-select`}
        value={value}
        onChange={(e) => updateState({ [id]: e.target.value })}
        style={selectStyle}
      >
        {items.map((item) =>
          item.value && item.label ? (
            <MenuItem value={item.value}>{item.label}</MenuItem>
          ) : (
            <MenuItem value={item}>{item}</MenuItem>
          )
        )}
      </Select>
    </FormControl>
  )
}
