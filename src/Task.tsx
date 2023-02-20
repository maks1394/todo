import React, {ChangeEvent, useCallback, useState} from 'react'
import { EditableSpan } from './EditableSpan'
import { Delete } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import { TaskStatuses, TaskType } from './api/todolists-api'
import {useAppDispatch} from "./state/store";
import {changeTasksStatusTC, changeTaskTitleTC, deleteTaskTC} from "./state/tasks-reducer";

type TaskPropsType = {
    task: TaskType
    todolistId: string
}
export const Task = React.memo((props: TaskPropsType) => {
    const dispatch = useAppDispatch()
    const [disabled,setDisabled] = useState<boolean>(false)
    const onClickHandler = () => dispatch(deleteTaskTC(props.todolistId,props.task.id,setDisabled))

    const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked
        dispatch(changeTasksStatusTC(props.task.id,newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New,props.todolistId,setDisabled));
    }, [props.task.id, props.todolistId]);

    const onTitleChangeHandler = (newValue: string) => {
        dispatch(changeTaskTitleTC(props.task.id,newValue,props.todolistId,setDisabled));
    }

    return <div key={props.task.id} className={props.task.status === TaskStatuses.Completed ? 'is-done' : ''}>
        <Checkbox
            checked={props.task.status === TaskStatuses.Completed}
            color="primary"
            onChange={onChangeHandler}
            disabled={disabled}
        />

        <EditableSpan value={props.task.title} onChange={onTitleChangeHandler} disable={disabled}/>
        <IconButton onClick={onClickHandler} disabled={disabled}>
            <Delete/>
        </IconButton>
    </div>
})
