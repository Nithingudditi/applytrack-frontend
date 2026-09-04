export const STATUS_OPTIONS = ['applied', 'interview', 'offer', 'rejected', 'withdrawn']

export function statusClass(status) {
  return `status-pill status-${status}`
}