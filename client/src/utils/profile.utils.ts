export function getProfileUserId(userId: string | undefined, currentUserId: number | null) {
  const idFromRoute = userId ?? new URLSearchParams(window.location.search).get("id");
  const parsedId = Number(idFromRoute ?? currentUserId);
  return Number.isFinite(parsedId) && parsedId > 0 ? parsedId : currentUserId;
}


export function formatDate(dateInput?: string | null) {
  if (!dateInput) return "Not updated.";
  const dateObj = new Date(dateInput);
  if (Number.isNaN(dateObj.getTime())) return "Invalid date.";
  return dateObj.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function toDateInputValue(dateInput?: string | null) {
  if (!dateInput) return "";
  return dateInput.includes("T") ? dateInput.split("T")[0] : dateInput;
}
