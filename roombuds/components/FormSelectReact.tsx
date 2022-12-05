import Select from "react-select";
import {
    FormControl,
    InputLabel,
  } from '@material-ui/core'
const style1 = {
    control: (base, state) => ({
      ...base,
      border: "0 !important",
      borderRadius: "0 !important",
      boxShadow: "0px 1px 0px gray",
      "&:hover": {
        border: "0 !important"
      },
      backgroundColor: 'inherit',
    })
  };
export const FormSelectReact = ({
    label,
    value,
    updateState,
    options,
  }: {
    label: string
    value: undefined
    options: Array<any>
    updateState: (newState: Object) => void
  }) => {
    return (
    <div>
      <InputLabel style={{marginBottom: '0.5rem'}}>{label}</InputLabel>
      <FormControl fullWidth variant="standard">
        <Select
          styles={style1}
          fullWidth
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