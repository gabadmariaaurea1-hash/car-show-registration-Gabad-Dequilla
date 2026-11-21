
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

          {loading && (
            <div className="rounded-xl bg-white p-8 text-center">
              Loading registrations...
            </div>
          )}

          {!loading && error && (
            <div className="rounded-xl bg-white p-8 text-center">
              <p className="text-red-600">{error}</p>

              <button
                onClick={() => setRetry((current) => current + 1)}
                className="mt-3 rounded-lg bg-gray-900 px-4 py-2 text-white"
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !error && registrations.length === 0 && (
            <div className="rounded-xl bg-white p-8 text-center">
              <p className="font-medium">
                No registrations match your filters.
              </p>

              <button
                onClick={clearFilters}
                className="mt-3 rounded-lg bg-gray-900 px-4 py-2 text-white"
              >
                Clear filters
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
