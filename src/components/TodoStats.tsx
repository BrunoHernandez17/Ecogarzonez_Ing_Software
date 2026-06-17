import { Todo } from "../types";
import { Sparkles, Terminal } from "lucide-react";

interface TodoStatsProps {
  todos: Todo[];
}

export default function TodoStats({ todos }: TodoStatsProps) {
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const pending = total - completed;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  const highPriority = todos.filter((t) => !t.completed && t.priority === "high").length;
  const mediumPriority = todos.filter((t) => !t.completed && t.priority === "medium").length;
  const lowPriority = todos.filter((t) => !t.completed && t.priority === "low").length;

  return (
    <div id="todo-stats-card" className="space-y-4">
      {/* Dark minimalist accent block */}
      <div className="bg-black text-white rounded-xl p-5 border border-black/10">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] uppercase tracking-widest text-[#a3a3a3] font-bold flex items-center gap-1.5 font-mono">
            <Terminal className="w-3 h-3 text-white" /> Project Status
          </p>
          <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-neutral-800 text-white rounded-md">
            {percent}% Done
          </span>
        </div>
        <p className="text-2xl font-black font-sans leading-none mt-1">{percent}% Listo</p>
        
        {/* Sleek slim progress bar */}
        <div className="w-full bg-neutral-800 h-1 rounded-full mt-4 overflow-hidden">
          <div
            className="bg-white h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-neutral-400 font-mono mt-2">
          <span>{completed} completadas</span>
          <span>{pending} pendientes</span>
        </div>
      </div>

      {/* Simplified Light Stats Section */}
      <div className="bg-white rounded-xl border border-neutral-100 p-4 space-y-3">
        <h4 className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-neutral-400" /> Métricas generales
        </h4>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="border border-neutral-100 p-2.5 rounded-lg bg-neutral-50/50">
            <span className="text-[10px] text-neutral-400 block font-medium">Total</span>
            <span className="text-base font-bold text-neutral-900 font-mono mt-0.5 block">{total}</span>
          </div>
          <div className="border border-neutral-100 p-2.5 rounded-lg bg-neutral-50/50">
            <span className="text-[10px] text-red-500 block font-medium">Alta pr.</span>
            <span className="text-base font-bold text-neutral-900 font-mono mt-0.5 block">{highPriority}</span>
          </div>
          <div className="border border-neutral-100 p-2.5 rounded-lg bg-neutral-50/50">
            <span className="text-[10px] text-emerald-500 block font-medium">Listas</span>
            <span className="text-base font-bold text-neutral-900 font-mono mt-0.5 block">{completed}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

