import { createTheme } from '@material-ui/core/styles'
import { COLORS } from '../utils/colors'

export const theme = createTheme({
  palette: {
    primary: {
      main: COLORS.GREEN,
    },
  },
  typography: {
    fontFamily: [
      'QuickSand',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
})
