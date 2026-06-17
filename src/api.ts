import { Todo } from "./types";

export async function getTodos(): Promise<Todo[]> {
  const res = await fetch("/api/todos");
  if (!res.ok) throw new Error("Error al cargar las tareas.");
  return res.json();
}

export async function createTodo(data: {
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  category?: string;
  dueDate?: string;
}): Promise<Todo> {
  const res = await fetch("/api/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || "Error al crear la tarea.");
  }
  return res.json();
}

export async function updateTodo(
  id: string,
  updates: Partial<Todo>
): Promise<Todo> {
  const res = await fetch(`/api/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || "Error al actualizar la tarea.");
  }
  return res.json();
}

export async function deleteTodo(id: string): Promise<void> {
  const res = await fetch(`/api/todos/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar la tarea.");
}

export async function clearCompletedTodos(): Promise<void> {
  const res = await fetch("/api/todos/clear-completed", {
    method: "POST",
  });
  if (!res.ok) throw new Error("Error al limpiar las tareas completadas.");
}
