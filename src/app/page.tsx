'use client'


import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import { Todo } from './models/todo';
import { AnimatePresence, motion } from 'framer-motion';
import { getRandomQuote } from './libs/random';

const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [quote, setQuote] = useState({ author: "", quote: "" });

  // Load todos from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('todos');
    if (stored) {
      setTodos(JSON.parse(stored));
    } else {
      const defaultTodos: Todo[] = [
        { id: 1, text: 'Learn Next.js', completed: true },
        { id: 2, text: 'Build a todo app', completed: false },
        { id: 3, text: 'Deploy to production', completed: false }
      ];
      setTodos(defaultTodos);
      localStorage.setItem('todos', JSON.stringify(defaultTodos));
    }

    setQuote(getRandomQuote())
    console.log(quote);
  }, []);

  // Persist to localStorage on todos update
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);


  const addTodo = () => {
    if (inputValue.trim() !== '') {
      const newTodo = {
        id: Date.now(),
        text: inputValue.trim(),
        completed: false
      };
      setTodos([...todos, newTodo]);
      setInputValue('');
    }
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleComplete = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const startEditing = (id: number, text: string) => {
    setEditingId(id);
    setEditValue(text);
  };

  const saveEdit = () => {
    if (editValue.trim() !== '') {
      setTodos(todos.map(todo =>
        todo.id === editingId ? { ...todo, text: editValue.trim() } : todo
      ));
    }
    setEditingId(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  const getTodoStatus = (filter: string) => {
    if (filter === 'all')
      return 'No todos yet. Add one above!';

    if (filter === 'active')
      return 'No active todos!';


    return 'No completed todos!';
  }


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      }
    }
  };



  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="min-h-screen  py-8 px-4">
      <div className="max-w-2xl mx-auto ">
        {/* Header */}
        <motion.div
          className="text-center mb-8 mt-10 text-zinc-800"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h1
            className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-cyan-400/20 bg-clip-text text-transparent"
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: {
                y: 0,
                opacity: 1,
                transition: {
                  duration: 0.6,
                  ease: "easeOut"
                }
              }
            }}
          >
            What we gonna do today?
          </motion.h1>
          <motion.p
            className="text-zinc-600"
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: {
                y: 0,
                opacity: 1,
                transition: {
                  duration: 0.6,
                  ease: "easeOut"
                }
              }
            }}
          >
            Stay organized and productive
          </motion.p>
        </motion.div>
        {/* Quote */}
        {/* <div className="bg-gradient-to-br bg-glass backdrop-blur-sm text-slate-900/50 p-6 rounded-xl mb-6 shadow-md">
          <p className="text-xl italic mb-4">"{quote.quote}"</p>
          <p className="text-sm "> {quote.author}</p>
        </div> */}

        {/* Add  Form */}
        <div className="bg-white border border-zinc-200 rounded-xl shadow-lg p-6 mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTodo()}
              placeholder="What needs to be done?"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={addTodo}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              Add
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white border border-zinc-200 rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>{totalCount} total tasks</span>
            <span>{completedCount} completed</span>
            <span>{totalCount - completedCount} remaining</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: totalCount > 0 ? `${(completedCount / totalCount) * 100}%` : '0%' }}
            ></div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-2 mb-6">
          {['all', 'active', 'completed'].map(filterType => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-4 py-2 rounded-lg capitalize transition-colors ${filter === filterType
                ? 'bg-blue-500 text-white'
                : 'bg-white border border-zinc-200 text-gray-700 hover:bg-gray-100'
                }`}
            >
              {filterType}
            </button>
          ))}
        </div>

        {/*  List */}
        <div className="bg-white border border-zinc-200 rounded-xl shadow-lg overflow-hidden">
          {filteredTodos.length <= 0 && <div className="text-center py-5 text-slate-500 grid gap-2">
            <svg
              className='size-18 mx-auto '
              xmlns="http://www.w3.org/2000/svg"
              width="24" height="24"
              viewBox="0 0 24 24"><g fill="none" stroke="currentColor">
                <path d="M2 12c0-4.714 0-7.071 1.464-8.536C4.93 2 7.286 2 12 2s7.071 0 8.535 1.464C22 4.93 22 7.286 22 12s0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12Z" />
                <path strokeLinecap="round" d="M2 13h3.16c.905 0 1.358 0 1.756.183s.692.527 1.281 1.214l.606.706c.589.687.883 1.031 1.281 1.214s.85.183 1.756.183h.32c.905 0 1.358 0 1.756-.183s.692-.527 1.281-1.214l.606-.706c.589-.687.883-1.031 1.281-1.214S17.934 13 18.84 13H22"
                  opacity="0.5" />
              </g></svg>
            {getTodoStatus(filter)}
          </div>}
          <AnimatePresence>
            {filteredTodos.map(todo => (
              <motion.div
                key={todo.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={`p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors ${todo.completed ? 'bg-gray-50' : ''}`}
              >
                <button
                  onClick={() => toggleComplete(todo.id)}
                  className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${todo.completed
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-gray-300 hover:border-green-500'
                    }`}
                >
                  {todo.completed && <Check size={12} />}
                </button>

                {editingId === todo.id ? (
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                      className="flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                    <button
                      onClick={saveEdit}
                      className="text-green-600 hover:text-green-700 p-1"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <span
                      className={`flex-1 ${todo.completed
                        ? 'text-gray-500 line-through'
                        : 'text-gray-800'
                        }`}
                    >
                      {todo.text}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEditing(todo.id, todo.text)}
                        className="text-blue-600 hover:text-blue-700 p-1"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default TodoApp;