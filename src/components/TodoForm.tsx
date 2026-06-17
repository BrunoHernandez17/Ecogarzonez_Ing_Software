import React, { useState } from "react";
import { Plus, Tag, Calendar, ChevronDown, ChevronUp, Loader2 } from "lucide-react";

interface TodoFormProps {
  onSubmit: (data: {
    title: string;
    description?: string;
    priority: "low" | "medium" | "high";
    category?: string;
    dueDate?: string;
  }) => Promise<void>;
}

export default function TodoForm({ onSubmit }: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [category, setCategory] = useState("Desarrollo");
  const [dueDate, setDueDate] = useState("");
  
  const [showAdvance, setShowAdvance] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = ["Desarrollo", "Diseño", "Integración", "General", "Personal", "Urgente"];

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("El título de la tarea es requerido");
      return;
    }
    setError(null);
    setSubmitting(true);

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() ? description.trim() : undefined,
        priority,
        category,
        dueDate: dueDate || undefined,
      });
      // Reset form
      setTitle("");
      setDescription("");
      setPriority("medium");
      setCategory("Desarrollo");
      setDueDate("");
      setShowAdvance(false);
    } catch (err: any) {
      setError(err?.message || "Ocurrió un error al crear la tarea.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      id="todo-form"
      onSubmit={handleFormSubmit}
      className="bg-white rounded-xl border border-neutral-100 p-6 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-sans font-bold text-black text-sm tracking-tight uppercase">New Task</h3>
        <button
          type="button"
          onClick={() => setShowAdvance(!showAdvance)}
          className="text-xs text-neutral-400 hover:text-black flex items-center gap-1 transition-colors cursor-pointer"
        >
          {showAdvance ? "Ocultar" : "Más detalles"}
          {showAdvance ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="space-y-4">
        {/* Core title input */}
        <div className="relative">
          <input
            type="text"
            placeholder="¿Qué necesitas hacer hoy?"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError(null);
            }}
            disabled={submitting}
            className="w-full px-4 py-3 bg-neutral-50/50 border border-neutral-100 rounded-lg text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-all text-xs font-sans"
          />
        </div>

        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

        {/* Collapsible advanced section */}
        {showAdvance && (
          <div className="space-y-4 pt-1 animate-fade-in border-t border-neutral-50">
            {/* Description textarea */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                Descripción
              </label>
              <textarea
                placeholder="Añade detalles o notas para la tarea..."
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={submitting}
                className="w-full px-4 py-2.5 bg-neutral-50/50 border border-neutral-100 rounded-lg text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black focus:bg-white text-xs transition-all"
              />
            </div>

            {/* Grid of selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category picker */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block flex items-center gap-1">
                  <Tag className="w-3 h-3" /> Categoría
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={submitting}
                  className="w-full px-3 py-2 bg-neutral-50/50 border border-neutral-100 rounded-lg text-neutral-700 text-xs focus:outline-none focus:border-black focus:bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Due date picker */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Fecha de entrega
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  disabled={submitting}
                  className="w-full px-3 py-2 bg-neutral-50/50 border border-neutral-100 rounded-lg text-neutral-700 text-xs focus:outline-none focus:border-black focus:bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Priority and Submit Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
          {/* Priority selector buttons */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-400 font-medium font-sans">Prioridad:</span>
            <div className="flex rounded-lg overflow-hidden border border-neutral-100 p-0.5 bg-neutral-50">
              {(["low", "medium", "high"] as const).map((lvl) => {
                const labelMap = { low: "Baja", medium: "Media", high: "Alta" };
                const isSelected = priority === lvl;
                const colorMap = {
                  low: isSelected
                    ? "bg-black text-white font-semibold"
                    : "text-neutral-400 hover:text-black",
                  medium: isSelected
                    ? "bg-amber-500 text-white font-semibold"
                    : "text-neutral-400 hover:text-black",
                  high: isSelected
                    ? "bg-red-500 text-white font-semibold"
                    : "text-neutral-400 hover:text-black",
                };

                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setPriority(lvl)}
                    disabled={submitting}
                    className={`px-3 py-1 text-[10px] uppercase tracking-wider rounded-md transition-all cursor-pointer ${colorMap[lvl]}`}
                  >
                    {labelMap[lvl]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit CTA button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto bg-black text-white px-5 py-2.5 rounded-lg font-semibold text-xs hover:bg-neutral-800 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
          >
            {submitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>+ Agregar Tarea</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
