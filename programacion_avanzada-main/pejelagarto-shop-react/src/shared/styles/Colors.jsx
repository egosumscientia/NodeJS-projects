import { makeStyles } from "@material-ui/core";
const primaryColor = 'green';
const Colors = makeStyles({
    primary: {
        backgroundColor: primaryColor
    },
    btnPrimary: {
        color: 'white',
        backgroundColor: primaryColor
    },
    btnDanger:{
        color: 'white',
        backgroundColor: 'red'
    }
})
export {Colors, primaryColor};