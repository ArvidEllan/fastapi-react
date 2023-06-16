
import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  Stack,
  Text,
} from "@chakra-ui/react";

const TodosContext = React.createContext({
  todos: [],
  fetchTodos: () => {},
});

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const fetchTodos = async () => {
    try {
      const response = await fetch("http://localhost:8000/todo");
      const todosData = await response.json();
      setTodos(todosData.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };
  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <TodosContext.Provider value={{ todos, fetchTodos }}>
      <AddTodo />
      <Stack spacing={5}>
        {todos.map((todo) => (
          <Text key={todo.id}>{todo.item}</Text>
        ))}
      </Stack>
    </TodosContext.Provider>
  );
}

function AddTodo() {
  const [item, setItem] = useState("");
  const { todos, fetchTodos } = useContext(TodosContext);

  const handleInput = (event) => {
    setItem(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const newTodo = {
      id: todos.length + 1,
      item: item,
    };

    fetch("http://localhost:8000/todo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTodo),
    })
      .then(() => {
        fetchTodos();
      })
      .catch((error) => {
        console.error("Error adding todo:", error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputGroup size="md">
        <Input
          pr="4.5rem"
          type="text"
          placeholder="Add a todo item"
          aria-label="Add a todo item"
          onChange={handleInput}
        />
      </InputGroup>
    </form>
  );
}
