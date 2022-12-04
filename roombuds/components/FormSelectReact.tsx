import Select from "react-select";
import {
    FormControl,
    InputLabel,
    MenuItem
  } from '@material-ui/core'

export const FormSelectReact = ({
    label,
    value,
    updateState,
    options
  }: {
    label: string
    value: undefined
    options: Array<any>
    updateState: (newState: Object) => void
  }) => {
    return (
    <div>
      <InputLabel style={{marginBottom: '0.5rem'}}>{label}</InputLabel>
      <FormControl fullWidth>
        <Select
          options={options}
          onChange={(e) => updateState(e)}
          style={{ marginBottom: '1rem', }}
          placeholder={label}
          value={value}
          isSearchable={true}
          isMulti
        >
        </Select>
      </FormControl>
      </div>
    )
  }