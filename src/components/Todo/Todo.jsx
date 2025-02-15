import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './Todo.css'

const Todo = () => {

    const [todo, setTodo] = useState([])
    const [newTodo, setNewTodo] = useState('')
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        let response = await axios.get('http://127.0.0.1:8000/api/todo/')
        setTodo(response.data)
        console.log(response.data)
    }

    const submitHandler = async () => {
        console.log(newTodo);

        if (editingId) {
            await taskUpdate(editingId, newTodo);

        } else {
            let response = await axios.post('http://127.0.0.1:8000/api/todo/', {
                task: newTodo,
                complete: false
            });
            setTodo([...todo, response.data]);
        }
        setNewTodo('');
    }


    const taskDelete = async (id) => {
        await axios.delete(`http://127.0.0.1:8000/api/todo/${id}/`)
        let updateData = [...todo]
        updateData.splice(id, 1)
        setTodo(updateData)
        fetchData()
    }

    const taskUpdate = async (id, updatedTask) => {
        await axios.put(`http://127.0.0.1:8000/api/todo/${id}/`, {
            task: updatedTask,
            complete: false
        });
        fetchData();
    };

    return (
        <div className='todo-container'>
            <div className="todo">
                <h1>Todo App</h1>
                <div className="form">
                    <input type="text" placeholder='Enter Todo' value={newTodo} onChange={(e) => setNewTodo(e.target.value)} />
                    <button type='submit' className='form-btn' onClick={submitHandler}>Submit</button>
                </div>
            </div>
            <div className="task-content">
                {
                    todo.map((data, id) =>
                        <div className="data" key={id}>
                            <div className="text">
                                <h6>{id + 1}: </h6>
                                <h6>{data.task}</h6>
                            </div>

                            <div className="btn">
                                <button type='submit' onClick={() => {
                                    setNewTodo(data.task);
                                    setEditingId(data.id);
                                }}>Update</button>
                                <button type='submit' onClick={() => taskDelete(data.id)}>Delete</button>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Todo
