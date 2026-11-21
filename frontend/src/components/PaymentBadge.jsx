const paymentStyles = {
  Unpaid: "bg-red-100 text-red-700",
  Partial: "bg-amber-100 text-amber-700",
  Paid: "bg-green-100 text-green-700",
}

export default function PaymentBadge({ status }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        paymentStyles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  )
}