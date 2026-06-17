import { Search, Tag, CheckSquare, AlertCircle } from "lucide-react";

interface TodoFiltersProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  statusFilter: "all" | "pending" | "completed";
  setStatusFilter: (val: "all" | "pending" | "completed") => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  selectedPriority: "all" | "low" | "medium" | "high";
  setSelectedPriority: (val: "all" | "low" | "medium" | "high") => void;
  categories: string[];
}

export default function TodoFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  selectedCategory,
  setSelectedCategory,
  selectedPriority,
  setSelectedPriority,
  categories,
}: TodoFiltersProps) {
  return (
    <div id="todo-filters-card" className="bg-white rounded-xl border border-neutral-100 p-6 space-y-6">
      {/* Search Input Widget */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Buscar tareas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-neutral-50/50 border border-neutral-100 rounded-full text-neutral-800 placeholder-neutral-400 text-xs focus:ring-1 focus:ring-black focus:outline-none focus:bg-white transition-all font-sans"
        />
      </div>

      {/* Status Filter */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1">
          <CheckSquare className="w-3.5 h-3.5" /> Estado
        </label>
        <div className="grid grid-cols-3 gap-1 bg-neutral-50/50 p-1 rounded-lg border border-neutral-100">
          {(["all", "pending", "completed"] as const).map((status) => {
            const labels = { all: "Todas", pending: "Pendientes", completed: "Listas" };
            const isActive = statusFilter === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`py-1 text-[11px] rounded-md font-semibold transition-all cursor-pointer ${
                  isActive ? "bg-white text-black shadow-3xs" : "text-neutral-400 hover:text-neutral-900"
                }`}
              >
                {labels[status]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Priority Selector */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" /> Prioridad
        </label>
        <div className="flex flex-wrap gap-1.5">
          {(["all", "low", "medium", "high"] as const).map((prio) => {
            const labels = { all: "Todas", low: "Baja", medium: "Media", high: "Alta" };
            const isActive = selectedPriority === prio;
            return (
              <button
                key={prio}
                type="button"
                onClick={() => setSelectedPriority(prio)}
                className={`text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  isActive
                    ? "bg-black border-black text-white font-bold"
                    : "bg-white border-neutral-100 text-neutral-500 hover:bg-neutral-50 hover:text-black"
                }`}
              >
                {labels[prio]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category List */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1">
          <Tag className="w-3.5 h-3.5" /> Categorías
        </label>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              selectedCategory === "all"
                ? "bg-black border-black text-white font-bold"
                : "bg-white border-neutral-100 text-neutral-500 hover:bg-neutral-50 hover:text-black"
            }`}
          >
            Todas
          </button>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  isActive
                    ? "bg-black border-black text-white font-bold"
                    : "bg-white border-neutral-100 text-neutral-500 hover:bg-neutral-50 hover:text-black"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
