import {useState, useEffect } from 'react';


const api_base = 'https://taskly-todo.onrender.com';

function App() {
	const [todos, setTodos] = useState([]);
	const [popupActive, setPopupActive] = useState(false);
	const [newTodo, setNewTodo] = useState("");

	useEffect(() => {
		GetTodos();
    console.log(todos)
	}, [todos]);

	const GetTodos = () => {
		fetch(api_base + '/todos')
			.then(res => res.json())
			.then(data => setTodos(data))
			.catch((err) => console.error("Error: ", err));
	}

  const completeTodo = async id => {
		const data = await fetch(api_base + '/todo/complete/' + id).then(res => res.json());

		setTodos(todos => todos.map(todo => {
			if (todo._id === data._id) {
				todo.complete = data.complete;
			}

			return todo;
		}));
		
	}


  const deleteTodo = async id =>{
    const data = await fetch(api_base + '/todo/delete/' + id,{
      method:"DELETE"
    }).then(res => res.json());

    setTodos(todos => todos.filter(todo => todo._id !== data._id));
  }

  const addTodo = async () =>{
    const data = await  fetch(api_base + "/todo/new", {
      method:"POST",
      headers: {
        "content-Type" : "application/json"
      },
      body :JSON.stringify({
        text: newTodo
      })
    }).then(res => res.json ());

    setTodos([...todos, data]);
    setPopupActive(false);
    setNewTodo("");
  }

  return (
    <div className="App">
      <h1>welcome lets's start your day</h1>
      <h3>Note down today's task</h3>
      <div className="todos">
        {todos.map(todo =>(
          <div className={
						"todo" + (todo.complete ? " is-complete" : "")
					} key={todo._id}>

            <div className="checkbox"></div>

            <div className="text" onClick={() => completeTodo(todo._id)}>{todo.text}</div>
            
            <div className="delete-todo" onClick={() => deleteTodo(todo._id)}>x</div>
         </div>
        ))} 
    </div>

    <div className='addPopoup' onClick={() => setPopupActive(true)}>+</div>
    {popupActive ? (
      <div className='popup'>
        <div className='closePopup' onClick={() => setPopupActive(false)}>x</div>
        <div className='content'>
            <h3>Add task's of the day</h3>
            <input type='text' className='add-todo-input'   onChange={e=> setNewTodo (e.target.value)} value={newTodo} required />
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <div className='button' onClick={addTodo} >Create Task</div>
        </div>
      </div>
    ):''}
    </div>
  );
}

export default App;
