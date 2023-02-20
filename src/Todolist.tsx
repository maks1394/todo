import React, {useCallback, useEffect, useState} from 'react'
import {AddItemForm} from './AddItemForm'
import {EditableSpan} from './EditableSpan'
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { Delete } from '@mui/icons-material';
import {Task} from './Task'
import {TaskStatuses, TaskType} from './api/todolists-api'
import {changeTodolistFilterAC, deleteTodolistTC, FilterValuesType, updateTodolistTC} from './state/todolists-reducer'
import {useAppDispatch, useTypedSelector} from "./state/store";
import {createTaskTC, setTasksTC} from "./state/tasks-reducer";

type PropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    filter: FilterValuesType
}

export const Todolist = React.memo(function (props: PropsType) {
    const dispatch =useAppDispatch()
    useEffect(()=>{
        dispatch(setTasksTC(props.id))
    },[])
    console.log('Todolist called')

    const changeFilter =function (value: FilterValuesType, todolistId: string) {
        const action = changeTodolistFilterAC(todolistId, value);
        dispatch(action);
    }

    const addTask = (title: string) => {
        dispatch(createTaskTC(props.id,title,setItemFormDisable))
    }

    const removeTodolist = () => {
        dispatch(deleteTodolistTC(props.id,setTodoTitleDisable));
    }
    const changeTodolistTitle = (title: string) => {
        // props.changeTodolistTitle(props.id, title)
        dispatch(updateTodolistTC(props.id,title,setTodoTitleDisable));
    }

    const onAllClickHandler = useCallback(() => changeFilter('all', props.id), [props.id, changeFilter])
    const onActiveClickHandler = useCallback(() => changeFilter('active', props.id), [props.id, changeFilter])
    const onCompletedClickHandler = useCallback(() => changeFilter('completed', props.id), [props.id, changeFilter])


    let tasksForTodolist = props.tasks

    if (props.filter === 'active') {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (props.filter === 'completed') {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.Completed)
    }
    const [todoTitleDisable,setTodoTitleDisable] = useState<boolean>()
    const [itemFormDisable,setItemFormDisable] = useState<boolean>(false)
    return <div>
        <h3><EditableSpan value={props.title} onChange={changeTodolistTitle} disable={todoTitleDisable}/>
            <IconButton onClick={removeTodolist} disabled={todoTitleDisable}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask} disable={itemFormDisable}/>
        <div>
            {
                tasksForTodolist.map(t => <Task key={t.id} task={t} todolistId={props.id}/>)
            }
        </div>
        <div style={{paddingTop: '10px'}}>
            <Button variant={props.filter === 'all' ? 'outlined' : 'text'}
                    onClick={onAllClickHandler}
                    color={'inherit'}
            >All
            </Button>
            <Button variant={props.filter === 'active' ? 'outlined' : 'text'}
                    onClick={onActiveClickHandler}
                    color={'primary'}>Active
            </Button>
            <Button variant={props.filter === 'completed' ? 'outlined' : 'text'}
                    onClick={onCompletedClickHandler}
                    color={'secondary'}>Completed
            </Button>
        </div>
    </div>
})



