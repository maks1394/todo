import {AlertSeverityType, AlertType} from "../NotificationsBar/NotificationsBar";

type AppReducerStateType = {
    isOpen: boolean
    alerts: AlertType[]
}

const initialState: AppReducerStateType = {
    isOpen: true,
    alerts: []
}

type AppActionsType = ReturnType<typeof setIsOpen> | ReturnType<typeof closeAlert> | ReturnType<typeof setAlert> | ReturnType<typeof clearAlerts>
export const appReducer = (state: AppReducerStateType = initialState, action: AppActionsType) => {
    switch (action.type) {
        case "SET-IS-OPEN": {
            return {...state, isOpen: action.payload.isOpen}
        }
        case "CLOSE-ALERT": {
            return {...state, alerts: state.alerts.filter((_, i) => i !== action.payload.index)}
        }
        case "SET-ALERT":{
            const newAlert:AlertType = {
                message:action.payload.message,
                status:action.payload.status
            }
            return {...state,alerts:[newAlert,...state.alerts].slice(0,7)}
        }
        case "CLEAR-ALERTS":{
            return {...state,alerts:[]}
        }
        default: {
            return state
        }
    }
}

export const setIsOpen = (isOpen: boolean) => {
    return {
        type: 'SET-IS-OPEN',
        payload: {
            isOpen
        }
    } as const
}

export const closeAlert = (index: number) => {
    return {
        type: 'CLOSE-ALERT',
        payload: {
            index
        }
    } as const
}

export const setAlert = (message:string,status:AlertSeverityType)=>{
    return {
        type:'SET-ALERT',
        payload:{
            message,
            status
        }
    } as const
}

export const clearAlerts = ()=>{
    return {
        type:'CLEAR-ALERTS',

    } as const
}