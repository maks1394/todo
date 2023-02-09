import { TasksStateType } from '../App';
import { v1 } from 'uuid';
import {AddTodolistActionType, RemoveTodolistActionType, setTodosAC, SetTodosACType} from './todolists-reducer';
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from '../api/todolists-api'
import {Dispatch, GetState} from "./store";

export type RemoveTaskActionType = {
    type: 'REMOVE-TASK',
    todolistId: string
    taskId: string
}

export type AddTaskActionType = {
    type: 'ADD-TASK',
    todolistId: string
    newTask:TaskType
}

export type ChangeTaskStatusActionType = {
    type: 'CHANGE-TASK-STATUS',
    todolistId: string
    task:TaskType
    // status: TaskStatuses
}

export type ChangeTaskTitleActionType = {
    type: 'CHANGE-TASK-TITLE',
    todolistId: string
    taskId: string
    title: string
}

type ActionsType = RemoveTaskActionType | AddTaskActionType
    | ChangeTaskStatusActionType
    | ChangeTaskTitleActionType
    | AddTodolistActionType
    | RemoveTodolistActionType
|SetTodosACType
|SetTasksACType
| SetUpdatedTaskACType

const initialState: TasksStateType = {
    /*"todolistId1": [
        { id: "1", title: "CSS", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "2", title: "JS", status: TaskStatuses.Completed, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "3", title: "React", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
    ],
    "todolistId2": [
        { id: "1", title: "bread", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "2", title: "milk", status: TaskStatuses.Completed, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "3", title: "tea", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
    ]*/

}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK': {
            const stateCopy = {...state}
            const tasks = stateCopy[action.todolistId];
            const newTasks = tasks.filter(t => t.id !== action.taskId);
            stateCopy[action.todolistId] = newTasks;
            return stateCopy;
        }
        case 'ADD-TASK': {
            const stateCopy = {...state}
            const newTask: TaskType = action.newTask
            return {...state,[action.todolistId]:[newTask,...state[action.todolistId]]}
            // const newTask: TaskType = {
            //     id: v1(),
            //     title: action.title,
            //     status: TaskStatuses.New,
            //     todoListId: action.todolistId, description: '',
            //     startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low
            // }
        }
        case 'CHANGE-TASK-STATUS': {
            let todolistTasks = state[action.todolistId];
            let newTasksArray = todolistTasks
                .map(t => t.id === action.task.id ? {...action.task} : t);

            state[action.todolistId] = newTasksArray;
            return ({...state});
        }
        case 'CHANGE-TASK-TITLE': {
            let todolistTasks = state[action.todolistId];
            // найдём нужную таску:
            let newTasksArray = todolistTasks
                .map(t => t.id === action.taskId ? {...t, title: action.title} : t);

            state[action.todolistId] = newTasksArray;
            return ({...state});
        }
        case 'ADD-TODOLIST': {
            return {
                ...state,
                [action.newTodo.id]: []
            }
        }
        case 'REMOVE-TODOLIST': {
            const copyState = {...state};
            delete copyState[action.id];
            return copyState;
        }
        case "SET-TODOS":{
            let copyState = {...state}
            action.payload.todolists.forEach(el=>{
                copyState[el.id] =[]
            })
            return copyState
        }
        case "SET-TASKS":{
            return {...state,[action.payload.todolistId]:action.payload.tasks}
        }
        case "SET-UPDATED-TASK":{
            return {...state,[action.payload.todolistId]:state[action.payload.todolistId].map(el=>el.id === action.payload.task.id ? action.payload.task :el)}
        }
        default:
            return state;
    }
}

export const removeTaskAC = (todolistId: string,taskId: string): RemoveTaskActionType => {
    return {type: 'REMOVE-TASK', taskId: taskId, todolistId: todolistId}
}
export const addTaskAC = (todolistId: string,newTask:TaskType): AddTaskActionType => {
    return {type: 'ADD-TASK', newTask, todolistId}
}
export const changeTaskStatusAC = (task:TaskType, todolistId: string): ChangeTaskStatusActionType => {
    return {type: 'CHANGE-TASK-STATUS', todolistId, task}
}
export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string): ChangeTaskTitleActionType => {
    return {type: 'CHANGE-TASK-TITLE', title, todolistId, taskId}
}

type SetTasksACType = ReturnType<typeof setTasksAC>
export const setTasksAC = (todolistId: string,tasks:TaskType[])=>{
    return {
        type:'SET-TASKS',
        payload:{
            todolistId,
            tasks
        }
    } as const
}

export const setTasksTC = (todolistId: string)=>{
    return (dispatch:Dispatch)=>{
        todolistsAPI.getTasks(todolistId).then(resp=>{
            dispatch(setTasksAC(todolistId,resp.data.items))
        })
    }
}

export const deleteTaskTC = (todolistId: string, taskId: string) =>{
    return (dispatch:Dispatch)=>{
        todolistsAPI.deleteTask(todolistId,taskId).then(resp=>{
            dispatch(removeTaskAC(todolistId,taskId))
        })
    }
}

export const createTaskTC = (todolistId: string, title: string)=>{
    return (dispatch:Dispatch)=>{
        todolistsAPI.createTask(todolistId,title).then(resp=>{
            dispatch(addTaskAC(todolistId,resp.data.data.item))
        })
    }
}

type SetUpdatedTaskACType = ReturnType<typeof setUpdatedTaskAC>
export const setUpdatedTaskAC = (todolistId: string,task:TaskType)=>{
    return {
        type:'SET-UPDATED-TASK',
        payload:{
            todolistId,
            task
        }
    } as const
}

// export const updateTaskTC = (todolistId: string, taskId: string, model:TaskType)=>{
//     const taskToUpdateInUpdatedTypeForResponse:UpdateTaskModelType ={
//         title:model.title,
//         status:model.status,
//         deadline:model.deadline,
//         description:model.description,
//         priority:model.priority,
//         startDate:model.startDate
//     }
//     return (dispatch:Dispatch)=>{
//
//     }
// }

export const changeTasksStatusTC = (id: string, status: TaskStatuses, todolistId: string)=>{
    return (dispatch:Dispatch,getState:GetState)=>{
        let model = getState().tasks[todolistId].find(el=>el.id === id)
        if (model){
            const updatedTaskInTypeForResponse:UpdateTaskModelType ={
                title:model.title,
                status:status,
                deadline:model.deadline,
                description:model.description,
                priority:model.priority,
                startDate:model.startDate
            }
            todolistsAPI.updateTask(todolistId,id,updatedTaskInTypeForResponse).then(resp=>{
                dispatch(setUpdatedTaskAC(todolistId,resp.data.data.item))
            })
        }
    }
}

export const changeTaskTitleTC = (id: string, newTitle: string, todolistId: string)=>{
    return (dispatch:Dispatch,getState:GetState)=>{
        let model = getState().tasks[todolistId].find(el=>el.id === id)
        if (model){
            const updatedTaskInTypeForResponse:UpdateTaskModelType ={
                title:newTitle,
                status:model.status,
                deadline:model.deadline,
                description:model.description,
                priority:model.priority,
                startDate:model.startDate
            }
            todolistsAPI.updateTask(todolistId,id,updatedTaskInTypeForResponse).then(resp=>{
                dispatch(setUpdatedTaskAC(todolistId,resp.data.data.item))
            })
        }
    }
}