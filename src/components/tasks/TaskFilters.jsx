import React from "react";
import { Search, Filter, ArrowUpDown, Tag } from "lucide-react";
import { CATEGORIES, PRIORITIES } from "../../data/initialTasks";

const TaskFilters = ({
  searchQuery,
  setSearchQuery,
  activeTab = "all",
  setActiveTab,
  priorityFilter,
  setPriorityFilter,
  categoryFilter,
  setCategoryFilter,
  sortBy,
  setSortBy,
  taskCounts = { all: 0, pending: 0, completed: 0, today: 0 },
}) => {
  const tabs = [
    { id: "all", label: "All Tasks", count: taskCounts.all },
    { id: "pending", label: "Pending", count: taskCounts.pending },
    { id: "completed", label: "Completed", count: taskCounts.completed },
    { id: "today", label: "Due Today", count: taskCounts.today },
  ];

  return (
    <div className="space-y-4 mb-6">
      {/* Navigation View Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-neutral-200/80">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab && setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-neutral-900 text-white shadow-xs"
                  : "bg-white text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 border border-neutral-200/70"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-neutral-100 text-neutral-500"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter and Sorting Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks by title, goal, or notes..."
            className="w-full bg-white border border-neutral-200 rounded-2xl pl-9 pr-8 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/10 transition-colors shadow-2xs font-medium"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-700"
            >
              ×
            </button>
          )}
        </div>

        {/* Dropdowns Row: Priority, Category, Sort */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Priority Filter */}
          <div className="flex items-center gap-1.5 bg-white border border-neutral-200 rounded-xl px-3 py-1.5 text-xs shadow-2xs">
            <Filter size={13} className="text-neutral-400 shrink-0" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-transparent text-neutral-700 font-semibold focus:outline-none cursor-pointer py-0.5 text-xs"
            >
              <option value="All">Priority: All</option>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 bg-white border border-neutral-200 rounded-xl px-3 py-1.5 text-xs shadow-2xs">
            <Tag size={13} className="text-neutral-400 shrink-0" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-neutral-700 font-semibold focus:outline-none cursor-pointer py-0.5 text-xs max-w-[130px] truncate"
            >
              <option value="All">Category: All</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Sorting */}
          <div className="flex items-center gap-1.5 bg-white border border-neutral-200 rounded-xl px-3 py-1.5 text-xs shadow-2xs">
            <ArrowUpDown size={13} className="text-neutral-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-neutral-700 font-semibold focus:outline-none cursor-pointer py-0.5 text-xs"
            >
              <option value="dueDateAsc">Due Date (Earliest)</option>
              <option value="dueDateDesc">Due Date (Latest)</option>
              <option value="priorityHigh">Priority (High → Low)</option>
              <option value="priorityLow">Priority (Low → High)</option>
              <option value="titleAsc">Title (A - Z)</option>
              <option value="newest">Newest Created</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;
