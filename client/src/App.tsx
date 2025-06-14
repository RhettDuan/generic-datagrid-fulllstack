import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';

import ListPage from './pages/ListPage';
import DetailPage from './pages/DetailPage';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';

function App() {
  return (
    <div className="App" style={{ minHeight: '100vh', width: '100vw', overflowX: 'hidden' }}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/data" replace />} />
          <Route path="/data" element={<ListPage />} />
          <Route path="/detail/:id" element={<DetailPage />} />
          <Route path="*" element={<Navigate to="/data" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

/*
import React, { useEffect, useState } from 'react'
import TodoItem from './components/TodoItem'
import AddTodo from './components/AddTodo'
import { getTodos, addTodo, updateTodo, deleteTodo } from './API'

const App: React.FC = () => {
  const [todos, setTodos] = useState<ITodo[]>([])

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = (): void => {
    getTodos()
    .then(({ data: { todos } }: ITodo[] | any) => setTodos(todos))
    .catch((err: Error) => console.log(err))
  }

 const handleSaveTodo = (e: React.FormEvent, formData: ITodo): void => {
   e.preventDefault()
   addTodo(formData)
   .then(({ status, data }) => {
    if (status !== 201) {
      throw new Error('Error! Todo not saved')
    }
    setTodos(data.todos)
  })
  .catch((err) => console.log(err))
}

  const handleUpdateTodo = (todo: ITodo): void => {
    updateTodo(todo)
    .then(({ status, data }) => {
        if (status !== 200) {
          throw new Error('Error! Todo not updated')
        }
        setTodos(data.todos)
      })
      .catch((err) => console.log(err))
  }

  const handleDeleteTodo = (_id: string): void => {
    deleteTodo(_id)
    .then(({ status, data }) => {
        if (status !== 200) {
          throw new Error('Error! Todo not deleted')
        }
        setTodos(data.todos)
      })
      .catch((err) => console.log(err))
  }

  return (
    <main className='App'>
      <h1>To-do list</h1>
      <AddTodo saveTodo={handleSaveTodo} />
      {todos.map((todo: ITodo) => (
        <TodoItem
          key={todo._id}
          updateTodo={handleUpdateTodo}
          deleteTodo={handleDeleteTodo}
          todo={todo}
        />
      ))}
    </main>
  )
}

export default App

**/