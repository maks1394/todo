import React, {useEffect, useRef} from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, {AlertProps} from '@mui/material/Alert';
import List from '@mui/material/List';
import {TransitionGroup} from 'react-transition-group';
import Collapse from '@mui/material/Collapse';
import ListItem from '@mui/material/ListItem';
import Fade from '@mui/material/Fade';
import {styled} from "@mui/material";
import {useTypedSelector} from "../state/store";
import {useDispatch} from "react-redux";
import {clearAlerts, closeAlert, setIsOpen} from "../state/app-reducer";


const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


export type AlertSeverityType = "error" | "warning" | "info" | "success"
export type AlertType = {
    message: string
    status: AlertSeverityType
}
export const NotificationsBar = () => {
    const open = useTypedSelector<boolean>(state=>state.app.isOpen)
    const dispatch = useDispatch()
    const alerts = useTypedSelector<AlertType[]>(state=>state.app.alerts)
    const timerId = useRef<number|undefined>(undefined)
    const handleClick = () => {
        dispatch(setIsOpen(true))
    };
    useEffect(()=>{
        if (alerts.length>0){
            timerId.current = +setTimeout(()=>{
                dispatch(clearAlerts())
            },6000)
        }
        return ()=>{
            clearTimeout(timerId.current)
        }
    },[alerts])

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        // setOpen(false);
        dispatch(setIsOpen(true)) // ?
    };
    const closeAlertHandler = (index:number)=>{
        // setAlerts((prev)=>prev.filter((el,i)=>i !== index))
        dispatch(closeAlert(index))
    }
    return (
        <>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <List>
                    <TransitionGroup>
                        {alerts.map((el, index) => {
                            return (
                                <Collapse key={index}>
                                    <ListItem>
                                        <Alert onClose={()=>closeAlertHandler(index)} severity={el.status} sx={{width: '100%'}}>
                                            {el.message}
                                        </Alert>
                                    </ListItem>
                                </Collapse>
                            )
                        })}
                    </TransitionGroup>
                </List>
                {/*<Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>*/}
                {/*    This is a success message!*/}
                {/*</Alert>*/}
            </Snackbar>
        </>
    );
};

const StyledTransitionGroup = styled(TransitionGroup)`
  display: flex;
  flex-direction: column-reverse;
`
