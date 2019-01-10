import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#0B3C5D',

        },
        secondary: {
            light: '#62efff',
            main: '#00bcd4',
            dark: '#008ba3',
            contrastText: '#000000'
        },
        action: {
            main: '#BF360c',
        },
        
    },

    typography: {
        fontSize: '14px',
        useNextVariants: true,
    }

});