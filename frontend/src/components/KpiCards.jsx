
import KpiCard from "./KpiCard"

const peso = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
})

export default function KpiCards({ summary }) {
  if (!summary) return null

  const cards = [
    {
      title: "Total Registrations",
      value: summary.totalRegistrations,
    },
    {
      title: "Total Payments",
      value: peso.format(summary.totalAmountPaid),
    },
    {
      title: "Uncollected Payments",
      value: peso.format(summary.totalOutstandingBalance),
    },
    {
      title: "Confirmed",
      value: summary.confirmed,
    },
    {
      title: "Checked In",
      value: summary.checkedIn,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((card) => (
        <KpiCard
          key={card.title}
          title={card.title}
          value={card.value}
        />
      ))}
    </div>
  )
}
