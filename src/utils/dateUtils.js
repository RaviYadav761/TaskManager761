export const formatDateLabel = (dateStr) => {
  if (!dateStr) return { text: "No due date", color: "text-neutral-400 bg-neutral-100 border-neutral-200", isOverdue: false, isToday: false };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [y, m, d] = dateStr.split("-").map(Number);
  const target = new Date(y, m - 1, d);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      text: `${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? "s" : ""} overdue`,
      color: "text-rose-600 bg-rose-50 border-rose-200",
      isOverdue: true,
      isToday: false,
    };
  } else if (diffDays === 0) {
    return {
      text: "Due Today",
      color: "text-amber-700 bg-amber-50 border-amber-200",
      isOverdue: false,
      isToday: true,
    };
  } else if (diffDays === 1) {
    return {
      text: "Due Tomorrow",
      color: "text-blue-600 bg-blue-50 border-blue-200",
      isOverdue: false,
      isToday: false,
    };
  } else {
    const formatted = target.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    return {
      text: `Due ${formatted}`,
      color: "text-neutral-700 bg-neutral-100 border-neutral-200",
      isOverdue: false,
      isToday: false,
    };
  }
};

export const getTodayDateInput = () => {
  return new Date().toISOString().split("T")[0];
};
