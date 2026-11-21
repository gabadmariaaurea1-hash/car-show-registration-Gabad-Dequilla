
export default function RegistrationFilters({
  search,
  setSearch,
  type,
  setType,
  status,
  setStatus,
  onClear,
}) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-white p-5 md:flex-row">
      <div className="flex-1">
        <label className="mb-2 block text-sm font-medium">
          Search Participant
        </label>

        <div className="relative">
          <input
            type="text"
            placeholder="Search participant name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border px-4 py-2 pr-10 outline-none focus:ring-2 focus:ring-blue-500"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500"
              aria-label="Clear search"
              title="Clear search"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className="flex-1">
        <label className="mb-2 block text-sm font-medium">
          Registration Type
        </label>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full rounded-lg border px-4 py-2"
        >
          <option value="">All Types</option>
          <option value="Exhibitor">Exhibitor</option>
          <option value="Competitor">Competitor</option>
          <option value="VIP">VIP</option>
        </select>
      </div>

      <div className="flex-1">
        <label className="mb-2 block text-sm font-medium">
          Registration Status
        </label>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full rounded-lg border px-4 py-2"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="CheckedIn">Checked In</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="flex items-end">
        <button
          type="button"
          onClick={onClear}
          className="w-full rounded-lg bg-gray-200 px-5 py-2 font-medium hover:bg-gray-300 md:w-auto"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}
