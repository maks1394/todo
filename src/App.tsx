import React, {useCallback, useEffect, useState} from 'react'
import './App.css';
import { Todolist } from './Todolist';
import { AddItemForm } from './AddItemForm';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { Menu } from '@mui/icons-material';
import {
    addTodolistAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC, createTodolistTC, deleteTodolistTC,
    FilterValuesType,
    removeTodolistAC, setTodosAC, setTodosTC,
    TodolistDomainType, updateTodolistTC
} from './state/todolists-reducer'
import {
    addTaskAC,
    changeTasksStatusTC,
    changeTaskStatusAC,
    changeTaskTitleAC, changeTaskTitleTC,
    removeTaskAC
} from './state/tasks-reducer';
import { useDispatch, useSelector } from 'react-redux';
import {AppRootStateType, useAppDispatch} from './state/store';
import {TaskStatuses, TaskType, todolistsAPI} from './api/todolists-api'
import {NotificationsBar} from "./NotificationsBar/NotificationsBar";
import {setAlert} from "./state/app-reducer";


export type TasksStateType = {
    [key: string]: Array<TaskType>
}


function App() {
    const dispatch = useAppDispatch();
    useEffect(()=>{
        dispatch(setTodosTC())
    },[])
    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)

    const addTodolist =  (title: string) => {
         dispatch(createTodolistTC(title,setItemFormDisable));
    }
    const [itemFormDisable,setItemFormDisable] = useState<boolean>(false)
    return (
        <div className="App">
            <NotificationsBar/>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style={{padding: '20px'}}>
                    <AddItemForm addItem={addTodolist} disable={itemFormDisable}/>
                </Grid>
                <Grid container spacing={3}>
                    {
                        todolists.map(tl => {
                            let allTodolistTasks = tasks[tl.id];
                            return <Grid item key={tl.id}>
                                <Paper style={{padding: '10px'}}>
                                    <Todolist
                                        id={tl.id}
                                        title={tl.title}
                                        tasks={allTodolistTasks}
                                        filter={tl.filter}
                                    />
                                </Paper>
                            </Grid>
                        })
                    }
                </Grid>
            </Container>
        </div>
    );
}

export default App;
