"use client"

import React, { useState, useEffect } from "react";
import { 
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
  doc,
  updateDoc
} from 'firebase/firestore';
 
import { db } from "@/lib/firebaseConfig";

// Add TODO function
async function addTodoToFirebase(title: string, detail: string, dueDate: any) {
  try {
    const docRef = await addDoc(collection(db, "todos"), {      // Store data to firestore
      title: title,
      detail: detail,
      dueDate: dueDate,
      createdAt: serverTimestamp()
    });
    console.log("TODO added to firestore: ", docRef);
  } catch (error) {
    console.error("ADD_TODO_ERROR:", error);
    return null;
  }
};

// Fetch TODO function
async function fetchTodosFromFirebase() {
  const todosCollection = collection(db, "todos");
  const querySnapshot = await getDocs(query(todosCollection, orderBy("createdAt", "desc")));
  const todos: any = [];
  querySnapshot.forEach((doc) => {
    const todoData = doc.data();
    todos.push({ id: doc.id, ...todoData });
  });
  return todos;
}

// Delete TODO function
async function deleteTodosFromFirebase(todoId: string) {
  try {
    const delDoc = await deleteDoc(doc(db, "todos", todoId));
    console.log("Deleted TODO: ", delDoc);
  } catch (error) {
    console.error("DELETE_TODO_ERROR:", error);
    return null;
  }
}

export default function Home() {
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [dueDate, setDueDate] = useState("");
  
  const [todos, setTodos] = useState([]);

  const [selectedTodo, setSelectedTodo] = useState<any>(null);

  const [isUpdatedMode, setIsUpdatedMode] = useState(false);      // form is for update or create

  // Handle Submit function
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (isUpdatedMode) {
      if (selectedTodo) {
        try {
          const updatedTodo = {
            title,
            detail,
            dueDate
          };

          const todoRef = doc(db, "todos", selectedTodo.id);
          await updateDoc(todoRef, updatedTodo);

          // reset form state
          setTitle("");
          setDetail("");
          setDueDate("");
          setSelectedTodo(null);
          setIsUpdatedMode(false);

          console.log("Todo updated successfully");
          
        } catch (error) {
          console.error("UPDATE_TODO_ERROR:", error);
        }
      }
    } else {
      const added = await addTodoToFirebase(title, detail, dueDate);
      if (added) {
        // reset form state
        setTitle("");
        setDetail("");
        setDueDate("");

        console.log("Add the todo successfully");
      }
    }
  };

  // Fetch the todo data
  useEffect(() => {
    async function fetchTodos() {
      const todos = await fetchTodosFromFirebase();
      setTodos(todos);
    };
    fetchTodos();
  }, []);
  
  // Handle update function
  const handleUpdate = (todo: any) => {
    setTitle(todo.title || "");
    setDetail(todo.detail || "");
    setDueDate(todo.dueDate || "");

    setSelectedTodo(todo);
    setIsUpdatedMode(true);
  }

  return (
    <div className="flex flex-1 items-center justify-center flex-col md:flex-row min-h-screen">
      <section className="flex flex-1 md:flex-col items-center md:justify-start mx-auto">
        <div className="p-6 md:p-12 mt-10 rounded-lg shadow-xl w-full max-w-lg bg-white">
          <h2 className="text-center text-2xl font-bold leading-9 text-gray-900">
            {isUpdatedMode ? "Update your Todo" : "Create a new Todo"}
          </h2>
          <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-600">
                Title
              </label>
              <div className="mt-2">
                <input 
                  id="title"
                  name="title"
                  type="text" 
                  autoComplete="off"
                  required
                  value={title}
                  onChange={(e: any) =>setTitle(e.target.value)}
                  className="w-full rounded border py-2 text-gray-900 shadow ring"
                />
              </div>
            </div>
            <div>
              <label htmlFor="details" className="block text-sm font-medium leading-6 text-gray-600">
                Details
              </label>
              <div className="mt-2">
                <textarea 
                  id="details"
                  name="details"
                  rows={4}
                  autoComplete="off"
                  required
                  value={detail}
                  onChange={(e: any) => setDetail(e.target.value)}
                  className="w-full rounded border py-2 text-gray-900 shadow ring"
                ></textarea>
              </div>
            </div>
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium leading-6 text-gray-600">
                Due Date
              </label>
              <div className="mt-2">
                <input 
                  id="dueDate"
                  name="dueDate"
                  type="date" 
                  autoComplete="off"
                  required
                  value={dueDate}
                  onChange={(e: any) =>setTitle(e.target.value)}
                  className="w-full rounded border py-2 text-gray-900 shadow ring"
                />
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
