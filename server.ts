import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { Todo } from "./src/types";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory array of todos
  let todos: Todo[] = [
    {
      id: "1",
      title: "Configurar el proyecto base",
      description: "Establecer la estructura cliente-servidor con Node/Express y React/Vite.",
      completed: true,
      priority: "high",
      category: "Desarrollo",
      createdAt: new Date().toISOString(),
      dueDate: new Date().toISOString().split("T")[0]
    },
    {
      id: "2",
      title: "Diseñar la interfaz de usuario",
      description: "Desarrollar una interfaz elegante, intuitiva y responsive con Tailwind CSS.",
      completed: false,
      priority: "medium",
      category: "Diseño",
      createdAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + 86400000).toISOString().split("T")[0]
    },
    {
      id: "3",
      title: "Añadir interacciones con API",
      description: "Conectar los botones de añadir, editar y eliminar tareas con el backend de Express.",
      completed: false,
      priority: "high",
      category: "Integración",
      createdAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + 172800000).toISOString().split("T")[0]
    }
  ];

  // API Routes
  app.get("/api/todos", (req, res) => {
    res.json(todos);
  });

  app.post("/api/todos", (req, res) => {
    const { title, description, priority, category, dueDate } = req.body;
    
    if (!title || typeof title !== "string" || title.trim() === "") {
      res.status(400).json({ error: "El título es obligatorio" });
      return;
    }

    const newTodo: Todo = {
      id: Math.random().toString(36).substring(2, 9),
      title: title.trim(),
      description: description ? String(description).trim() : "",
      completed: false,
      priority: priority && ["low", "medium", "high"].includes(priority) ? priority : "medium",
      category: category ? String(category).trim() : "General",
      createdAt: new Date().toISOString(),
      dueDate: dueDate ? String(dueDate) : undefined
    };

    todos.push(newTodo);
    res.status(201).json(newTodo);
  });

  app.put("/api/todos/:id", (req, res) => {
    const { id } = req.params;
    const { title, description, completed, priority, category, dueDate } = req.body;

    const todoIndex = todos.findIndex(t => t.id === id);
    if (todoIndex === -1) {
      res.status(404).json({ error: "Tarea no encontrada" });
      return;
    }

    const existing = todos[todoIndex];
    const updatedTodo: Todo = {
      ...existing,
      title: typeof title === "string" ? title.trim() : existing.title,
      description: typeof description === "string" ? description.trim() : existing.description,
      completed: typeof completed === "boolean" ? completed : existing.completed,
      priority: priority && ["low", "medium", "high"].includes(priority) ? priority : existing.priority,
      category: typeof category === "string" ? category.trim() : existing.category,
      dueDate: dueDate !== undefined ? dueDate : existing.dueDate
    };

    todos[todoIndex] = updatedTodo;
    res.json(updatedTodo);
  });

  app.delete("/api/todos/:id", (req, res) => {
    const { id } = req.params;
    const todoIndex = todos.findIndex(t => t.id === id);
    if (todoIndex === -1) {
      res.status(404).json({ error: "Tarea no encontrada" });
      return;
    }
    todos.splice(todoIndex, 1);
    res.status(200).json({ success: true, message: "Tarea eliminada exitosamente" });
  });

  app.post("/api/todos/clear-completed", (req, res) => {
    todos = todos.filter(t => !t.completed);
    res.json({ success: true, message: "Tareas completadas eliminadas" });
  });

  // Vite configuration for dev/prod serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
