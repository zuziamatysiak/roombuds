import Select from 'react-select'
import { FormControl, InputLabel } from '@material-ui/core'
const style1 = {
  control: (base: any, state: any) => ({
    ...base,
    border: '0 !important',
    borderRadius: '0 !important',
    boxShadow: '0px 1px 0px gray',
    '&:hover': {
      border: '0 !important',
    },
    backgroundColor: 'inherit',
    marginBottom: '1rem',
  }),
}
export const FormSelectReact = ({
  label,
  value,
  updateState,
  options,
  placeholder,
  isMulti
}: {
  label: string
  value: any
  options: Array<any>
  updateState: (newState: Object) => void
  placeholder: string
  isMulti: boolean
}) => {
  return (
    <div>
      <InputLabel style={{ marginBottom: '0.5rem' }}>{label}</InputLabel>
      <FormControl fullWidth variant="standard">
        <Select
          styles={style1}
          options={options}
          onChange={(e) => updateState(e)}
          placeholder={placeholder}
          value={value}
          isSearchable={true}
          isMulti={isMulti}
        ></Select>
      </FormControl>
    </div>
  )
}
