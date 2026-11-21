
export default function Pagination({
  page,
  totalPages,
  totalCount,
  pageSize,
  setPage,
  setPageSize,
  loading,
}) {
  const start = totalCount === 0
    ? 0
    : (page - 1) * pageSize + 1

  const end = Math.min(page * pageSize, totalCount)

  return (
    <div className="flex flex-col justify-between gap-4 rounded-xl bg-white p-4 sm:flex-row sm:items-center">
      <div className="text-sm text-gray-600">
        Showing {start}–{end} of {totalCount}
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm">Rows:</label>

        <select
          value={pageSize}
          disabled={loading}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="rounded-lg border p-2"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>

        <button
          disabled={loading || page <= 1}
          onClick={() => setPage(page - 1)}
          className="rounded-lg border px-3 py-2 disabled:opacity-40"
        >
          Prev
        </button>

        <span className="text-sm font-medium">
          {page} / {Math.max(totalPages, 1)}
        </span>

        <button
          disabled={loading || page >= totalPages || totalPages === 0}
          onClick={() => setPage(page + 1)}
          className="rounded-lg border px-3 py-2 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  )
}
