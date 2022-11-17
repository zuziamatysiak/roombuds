import { createTheme } from '@material-ui/core/styles'

export const theme = createTheme({
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
