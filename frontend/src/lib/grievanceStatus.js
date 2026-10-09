export function getStatusColor(status) {
  switch (status) {
    case "Resolved":    return "bg-emerald-50 text-emerald-700 border-emerald-100";
    case "In Progress": return "bg-blue-50 text-blue-700 border-blue-100";
    default:            return "bg-amber-50 text-amber-700 border-amber-100";
  }
}
