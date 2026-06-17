import React, { useState } from "react";
import { Todo } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { Trash2, Edit2, Calendar, Check, X, Tag, CornerDownRight } from "lucide-react";

interface TodoItemProps {
  key?: string;
  todo: Todo;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, updates: Partial<Todo>) => Promise<void>;
}

export default function TodoItem({ todo, onToggle, onDelete, onUpdate }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || "");
  const [editPriority, setEditPriority] = useState(todo.priority);
  const [isSaving, setIsSaving] = useState(false);

  // For due date display styling
  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date(new Date().setHours(0,0,0,0)) && !todo.completed;
  
  // Format readable due date
  const formatDueDate = (dateStr?: string) => {
    if (!dateStr) return null;
    const date = new Date(dateStr + 'T12:00:00'); // avoid timezone shifts
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Hoy";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Mañana";
    }
    return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
  };

  const handleSave = async () => {
    if (!editTitle.trim()) return;
    setIsSaving(true);
    try {
      await onUpdate(todo.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
        priority: editPriority,
      });
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || "");
    setEditPriority(todo.priority);
    setIsEditing(false);
  };

  // Border colors based on priority
  const priorityColors = {
    high: "hover:border-blue-200",
    medium: "hover:border-purple-200",
    low: "hover:border-neutral-200",
  };

  const priorityPills = {
    high: "bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded-md tracking-wider px-2.5 py-1 border border-blue-100/50",
    medium: "bg-purple-50 text-purple-600 text-[10px] font-bold uppercase rounded-md tracking-wider px-2.5 py-1 border border-purple-100/50",
    low: "bg-neutral-50 text-neutral-500 text-[10px] font-bold uppercase rounded-md tracking-wider px-2.5 py-1 border border-neutral-100",
  };

  return (
    <motion.div
      id={`todo-item-${todo.id}`}
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`group bg-white rounded-xl border border-neutral-100 p-5 flex flex-col gap-3 transition-all hover:shadow-xs ${
        todo.completed ? "opacity-60 bg-neutral-50/50 border-neutral-100" : ""
      } ${priorityColors[todo.priority]}`}
    >
      <AnimatePresence mode="wait">
        {!isEditing ? (
          /* View Mode */
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {/* Clean Minimalist Circular Checkbox */}
              <button
                type="button"
                onClick={() => onToggle(todo.id, !todo.completed)}
                className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all cursor-pointer shrink-0 mt-0.5 ${
                  todo.completed
                    ? "bg-black border-black text-white"
                    : "border-neutral-200 hover:border-black bg-white"
                }`}
              >
                {todo.completed && <Check className="w-3.5 h-3.5 stroke-[3.5]" />}
              </button>

              <div className="flex-1 min-w-0 space-y-1">
                {/* Title line */}
                <div className="flex flex-wrap items-center gap-2">
                  <h4
                    className={`font-semibold tracking-tight text-neutral-900 text-sm break-words ${
                      todo.completed ? "line-through text-neutral-400 font-normal" : ""
                    }`}
                  >
                    {todo.title}
                  </h4>

                  {/* Category Tag */}
                  {todo.category && (
                    <span className="bg-neutral-100 text-neutral-600 text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md flex items-center gap-1 border border-neutral-200/40">
                      <Tag className="w-2.5 h-2.5" />
                      {todo.category}
                    </span>
                  )}

                  {/* Due Date Indicator */}
                  {todo.dueDate && (
                    <span
                      className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                        isOverdue
                          ? "bg-red-50 text-red-600 border border-red-100/50 animate-pulse"
                          : "bg-neutral-100 text-neutral-500 border border-neutral-200/40"
                      }`}
                    >
                      <Calendar className="w-2.5 h-2.5" />
                      {formatDueDate(todo.dueDate)}
                    </span>
                  )}
                </div>

                {/* Description block */}
                {todo.description && (
                  <p className="text-xs text-neutral-400 font-sans mt-1">
                    {todo.description}
                  </p>
                )}
              </div>
            </div>

            {/* Right side metrics & actions panel */}
            <div className="flex items-center space-x-3 shrink-0">
              {/* Priority Label or Status Done */}
              {todo.completed ? (
                <span className="text-[10px] text-neutral-400 font-mono italic underline">Done</span>
              ) : (
                <span className={priorityPills[todo.priority]}>
                  {todo.priority === "high" ? "High" : todo.priority === "medium" ? "Medium" : "Low"}
                </span>
              )}

              {/* Developer Style Monospace Short Index */}
              <span className="text-[10px] text-neutral-300 font-mono select-none block sm:block">
                #EXP-{todo.id.slice(0, 4).toUpperCase()}
              </span>

              {/* Action Buttons visible on hover/focus */}
              <div className="flex items-center bg-white border border-neutral-100 rounded-lg overflow-hidden divide-x divide-neutral-100">
                <button
                  onClick={() => setIsEditing(true)}
                  title="Editar tarea"
                  className="p-1.5 text-neutral-400 hover:text-black transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onDelete(todo.id)}
                  title="Eliminar tarea"
                  className="p-1.5 text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Inline Editing Mode */
          <div className="space-y-3 w-full animate-fade-in py-1">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
              <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                <CornerDownRight className="w-3 h-3 text-black" /> editando tarea
              </span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="p-1 text-black hover:bg-neutral-100 rounded transition-colors cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="p-1 text-neutral-400 hover:bg-neutral-100 rounded transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {/* Edit title */}
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Título"
                className="w-full text-xs font-semibold text-neutral-900 bg-neutral-50/50 px-3 py-2 rounded-lg border border-neutral-100 focus:outline-none focus:border-black focus:bg-white"
              />

              {/* Edit description */}
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Descripción (opcional)"
                rows={2}
                className="w-full text-xs text-neutral-600 bg-neutral-50/50 px-3 py-2 rounded-lg border border-neutral-100 focus:outline-none focus:border-black focus:bg-white"
              />

              {/* Edit priority inline */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Prioridad:</span>
                <div className="flex bg-neutral-50 border border-neutral-100 rounded-lg p-0.5">
                  {(["low", "medium", "high"] as const).map((lvl) => {
                    const isSel = editPriority === lvl;
                    const cMap = {
                      low: isSel ? "bg-black text-white font-semibold" : "text-neutral-400 hover:text-black",
                      medium: isSel ? "bg-purple-600 text-white font-semibold" : "text-neutral-400 hover:text-black",
                      high: isSel ? "bg-blue-600 text-white font-semibold" : "text-neutral-400 hover:text-black",
                    };
                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setEditPriority(lvl)}
                        className={`text-[9px] uppercase tracking-widest px-2.5 py-1 rounded transition-all cursor-pointer ${cMap[lvl]}`}
                      >
                        {lvl === "high" ? "High" : lvl === "medium" ? "Med" : "Low"}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
