
import KpiCard from "./KpiCard"

export default function KpiCards({ summary }) {
  if (!summary) {
    return (
      <div className="grid grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="h-28 animate-pulse rounded-xl bg-gray-200"
          />
        ))}
      </div>
    )
  }

  const cards = [
    {
      title: "Total Registrations",
      value: summary.totalRegistrations,
      description: "All registered participants",
    },
    {
      title: "Confirmed",
      value: summary.confirmed,
      description: "Confirmed registrations",
    },
    {
      title: "Checked In",
      value: summary.checkedIn,
      description: "Participants checked in",
    },
    {
      title: "Pending",
      value: summary.pending,
      description: "Awaiting confirmation",
    },
    {
      title: "Cancelled",
      value: summary.cancelled,
      description: "Cancelled registrations",
    },
  ]

  return (
    <div className="grid grid-cols-5 gap-4">
      {cards.map((card) => (
        <KpiCard
          key={card.title}
          title={card.title}
          value={card.value}
          description={card.description}
        />
      ))}
    </div>
  )
}
