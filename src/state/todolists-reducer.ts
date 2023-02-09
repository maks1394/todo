import { v1 } from 'uuid';
import {todolistsAPI, TodolistType} from '../api/todolists-api'
import {Dispatch} from "./store";

export type RemoveTodolistActionType = {
    type: 'REMOVE-TODOLIST',
    id: string
}
export type AddTodolistActionType = {
    type: 'ADD-TODOLIST',
    newTodo: TodolistType
}
export type ChangeTodolistTitleActionType = {
    type: 'CHANGE-TODOLIST-TITLE',
    id: string
    title: string
}
export type ChangeTodolistFilterActionType = {
    type: 'CHANGE-TODOLIST-FILTER',
    id: string
    filter: FilterValuesType
}

type ActionsType = RemoveTodolistActionType | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType
|SetTodosACType

const initialState: Array<TodolistDomainType> = [
    /*{id: todolistId1, title: 'What to learn', filter: 'all', addedDate: '', order: 0},
    {id: todolistId2, title: 'What to buy', filter: 'all', addedDate: '', order: 0}*/
]

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST': {
            return state.filter(tl => tl.id !== action.id)
        }
        case 'ADD-TODOLIST': {
            return [{
                ...action.newTodo,
                filter: 'all',
            }, ...state]
        }
        case 'CHANGE-TODOLIST-TITLE': {
            const todolist = state.find(tl => tl.id === action.id);
            if (todolist) {
                // если нашёлся - изменим ему заголовок
                todolist.title = action.title;
            }
            return [...state]
        }
        case 'CHANGE-TODOLIST-FILTER': {
            const todolist = state.find(tl => tl.id === action.id);
            if (todolist) {
                // если нашёлся - изменим ему заголовок
                todolist.filter = action.filter;
            }
            return [...state]
        }
        case "SET-TODOS":{
            const newTodos:TodolistDomainType[] = action.payload.todolists.map(el=>({...el,filter:'all'}))
            return newTodos
        }
        default:
            return state;
    }
}

export const removeTodolistAC = (todolistId: string): RemoveTodolistActionType => {
    return {type: 'REMOVE-TODOLIST', id: todolistId}
}
export const addTodolistAC = (newTodo: TodolistType): AddTodolistActionType => {
    return {type: 'ADD-TODOLIST', newTodo}
}
export const changeTodolistTitleAC = (id: string, title: string): ChangeTodolistTitleActionType => {
    return {type: 'CHANGE-TODOLIST-TITLE', id: id, title: title}
}
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType): ChangeTodolistFilterActionType => {
    return {type: 'CHANGE-TODOLIST-FILTER', id: id, filter: filter}
}

export type SetTodosACType = ReturnType<typeof setTodosAC>
export const setTodosAC = (todolists:TodolistType[])=>{
    return {
        type:'SET-TODOS' ,
        payload:{
            todolists:todolists
        }
    } as const
}

export const setTodosTC = ()=>{
    return (dispatch:Dispatch)=>{
        todolistsAPI.getTodolists().then(resp=>{
            dispatch(setTodosAC(resp.data))
        })
    }
}

export const deleteTodolistTC = (id: string)=>{
    return (dispatch:Dispatch)=>{
        todolistsAPI.deleteTodolist(id).then(resp=>{
            dispatch(removeTodolistAC(id))
        })
    }
}

export const createTodolistTC = (title: string)=>{
    return (dispatch:Dispatch)=>{
        todolistsAPI.createTodolist(title).then(resp=>{
            dispatch(addTodolistAC(resp.data.data.item))
        })
    }
}

export const updateTodolistTC = (id: string, title: string)=>{
    return (dispatch:Dispatch)=>{
        todolistsAPI.updateTodolist(id,title).then(resp=>{
            dispatch(changeTodolistTitleAC(id,title))
        })
    }
}

