
const participants = [
  "Juan Dela Cruz",
  "Maria Santos",
  "Pedro Reyes",
  "Ana Cruz",
  "Mark Garcia",
  "Angela Lopez",
  "Carlo Mendoza",
  "Sofia Ramos",
  "John Bautista",
  "Nicole Flores",
  "Miguel Torres",
  "Isabella Diaz",
  "Daniel Castro",
  "Andrea Villanueva",
  "Joshua Fernandez",
  "Camille Gonzales",
  "Rafael Aquino",
  "Patricia Morales",
  "Gabriel Navarro",
  "Christine Rivera",
  "Kevin Castillo",
  "Bea Santiago",
  "Adrian Perez",
  "Trisha Valdez",
  "Christian Lim",
]

const cars = [
  "Toyota Supra MK4",
  "Honda Civic Type R",
  "Mitsubishi Lancer Evo",
  "Nissan Skyline R34",
  "Mazda RX-7",
]

const types = ["Exhibitor", "Competitor", "VIP"]

const statuses = [
  "Pending",
  "Confirmed",
  "CheckedIn",
  "Cancelled",
]

const fees = {
  Exhibitor: 1500,
  Competitor: 2500,
  VIP: 5000,
}

export const sampleRegistrations = participants.map(
  (name, index) => {
    const type = types[index % 3]
    const status = statuses[index % 4]
    const fee = fees[type]

    const amountPaid = [0, 1000, fee][index % 3]

    return {
      id: `sample-${index + 1}`,
      registrationNumber: `CS27-${String(index + 1).padStart(4, "0")}`,
      registrationDate: new Date(
        Date.UTC(2027, 1, 10 + index, 8, 30)
      ).toISOString(),

      participantName: name,
      contactNumber: `0917123${String(index).padStart(4, "0")}`,
      email: `participant${index + 1}@example.com`,
      address: "Sorsogon City",

      carMakeModel: cars[index % cars.length],
      plateNumber: `ABC ${1000 + index}`,

      registrationType: type,
      status: status,

      registrationFee: fee,
      amountPaid: amountPaid,

      paymentStatus:
        amountPaid === 0
          ? "Unpaid"
          : amountPaid < fee
            ? "Partial"
            : "Paid",
    }
  }
)

export async function getRegistrations({
  participantName = "",
  type = "",
  status = "",
  page = 1,
  pageSize = 10,
} = {}) {
  let filtered = [...sampleRegistrations]

  if (participantName) {
    filtered = filtered.filter((item) =>
      item.participantName
        .toLowerCase()
        .includes(participantName.toLowerCase())
    )
  }

  if (type) {
    filtered = filtered.filter(
      (item) => item.registrationType === type
    )
  }

  if (status) {
    filtered = filtered.filter(
      (item) => item.status === status
    )
  }

  filtered.sort(
    (a, b) =>
      new Date(b.registrationDate) -
      new Date(a.registrationDate)
  )

  const totalCount = filtered.length
  const totalPages = Math.ceil(totalCount / pageSize)

  const start = (page - 1) * pageSize

  return {
    items: filtered.slice(start, start + pageSize),
    page,
    pageSize,
    totalCount,
    totalPages,
  }
}

export async function getSummary() {
  const active = sampleRegistrations.filter(
    (item) => item.status !== "Cancelled"
  )

  const totalFees = active.reduce(
    (sum, item) => sum + item.registrationFee,
    0
  )

  const totalPayments = active.reduce(
    (sum, item) => sum + item.amountPaid,
    0
  )

  return {
    totalRegistrations: sampleRegistrations.length,
    confirmed: sampleRegistrations.filter(
      (item) => item.status === "Confirmed"
    ).length,
    checkedIn: sampleRegistrations.filter(
      (item) => item.status === "CheckedIn"
    ).length,
    pending: sampleRegistrations.filter(
      (item) => item.status === "Pending"
    ).length,
    cancelled: sampleRegistrations.filter(
      (item) => item.status === "Cancelled"
    ).length,
    totalFees,
    totalPayments,
    uncollectedPayments: totalFees - totalPayments,
  }
}
