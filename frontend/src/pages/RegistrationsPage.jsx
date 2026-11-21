
import { useEffect, useState } from "react"

import {
  getRegistrations,
  getSummary,
} from "../services/api"

import useDebounce from "../hooks/useDebounce"

import KpiCards from "../components/KpiCards"
import RegistrationFilters from "../components/RegistrationFilters"
import RegistrationTable from "../components/RegistrationTable"
import Pagination from "../components/Pagination"

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState([])
  const [summary, setSummary] = useState(null)

  const [search, setSearch] = useState("")
  const [type, setType] = useState("")
  const [status, setStatus] = useState("")

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [retry, setRetry] = useState(0)

  const debouncedSearch = useDebounce(search, 400)

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, type, status, pageSize])

  useEffect(() => {
    let cancelled = false

    async function loadDashboard() {
      try {
        setLoading(true)
        setError("")

        const [registrationData, summaryData] =
          await Promise.all([
            getRegistrations({
              participantName: debouncedSearch,
              type,
              status,
              page,
              pageSize,
            }),
            getSummary(),
          ])

        if (cancelled) return

        setRegistrations(registrationData.items)
        setTotalCount(registrationData.totalCount)
        setTotalPages(registrationData.totalPages)
        setSummary(summaryData)
      } catch (err) {
        if (!cancelled) {
          setError("Unable to load dashboard data.")
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadDashboard()

    return () => {
      cancelled = true
    }
  }, [debouncedSearch, type, status, page, pageSize, retry])

  function clearFilters() {
    setSearch("")
    setType("")
    setStatus("")
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gray-900 px-6 py-6 text-white">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold">
            AutoVista Events
          </h1>

          <p className="mt-1 text-sm text-gray-300">
            Car Show 2027 Registration Dashboard
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Registration Overview
          </h2>

          <p className="mt-1 text-gray-500">
            Monitor registrations and event payments.
          </p>
        </div>

        <KpiCards summary={summary} />

        <RegistrationFilters
          search={search}
          setSearch={setSearch}
          type={type}
          setType={setType}
          status={status}
          setStatus={setStatus}
          onClear={clearFilters}
        />

        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-bold">
              Car Registrations
            </h2>

            <p className="text-sm text-gray-500">
              View and manage registered participants.
            </p>
          </div>

          {/* LOADING STATE */}
{loading && (
  <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
    <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900"></div>

    <p className="font-semibold text-gray-800">
      Loading registrations...
    </p>

    <p className="mt-1 text-sm text-gray-500">
      Please wait while we retrieve the dashboard data.
    </p>
  </div>
)}

{/* ERROR STATE */}
{!loading && error && (
  <div className="rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm">
    <h3 className="text-lg font-bold text-red-600">
      Unable to Load Dashboard
    </h3>

    <p className="mt-2 text-sm text-gray-600">
      {error} Please check your API connection and try again.
    </p>

    <button
      onClick={() => setRetry((current) => current + 1)}
      className="mt-4 rounded-lg bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-gray-700"
    >
      Try Again
    </button>
  </div>
)}

{/* EMPTY STATE */}
{!loading && !error && registrations.length === 0 && (
  <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
    <h3 className="text-lg font-bold text-gray-800">
      No Registrations Found
    </h3>

    <p className="mt-2 text-sm text-gray-500">
      There are no registrations matching your current filters.
    </p>

    <button
      onClick={clearFilters}
      className="mt-4 rounded-lg bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-gray-700"
    >
      Clear Filters
    </button>
  </div>
)}

          {!loading && !error && registrations.length > 0 && (
            <>
              <RegistrationTable
                registrations={registrations}
              />

              <Pagination
                page={page}
                totalPages={totalPages}
                totalCount={totalCount}
                pageSize={pageSize}
                setPage={setPage}
                setPageSize={setPageSize}
                loading={loading}
              />
            </>
          )}
        </section>
      </main>
    </div>
  )
}
