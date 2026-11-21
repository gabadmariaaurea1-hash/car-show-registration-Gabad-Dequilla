
import StatusBadge from "./StatusBadge"
import PaymentBadge from "./PaymentBadge"

const peso = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
})

export default function RegistrationTable({
  registrations,
  page,
  pageSize,
  totalCount,
}) {
  function formatDate(date) {
    return new Date(date).toLocaleString("en-PH", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  // Registration count summary
  const start = totalCount === 0
    ? 0
    : (page - 1) * pageSize + 1

  const end = Math.min(page * pageSize, totalCount)

  return (
    <div>
      <p className="mb-3 text-sm text-gray-500">
        Showing {start}–{end} of {totalCount} registrations
      </p>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full min-w-[1100px] text-left text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-4">Registration No.</th>
              <th className="p-4">Date</th>
              <th className="p-4">Participant</th>
              <th className="p-4">Car Details</th>
              <th className="p-4">Type</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Fee / Paid</th>
              <th className="p-4">Payment</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {registrations.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="p-4 font-semibold">
                  {item.registrationNumber}
                </td>

                <td className="p-4 whitespace-nowrap">
                  {formatDate(item.registrationDate)}
                </td>

                <td className="p-4">
                  <p className="font-medium">
                    {item.participantName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.contactNumber}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.email}
                  </p>
                </td>

                <td className="p-4">
                  <p className="font-medium">
                    {item.carMakeModel}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.plateNumber}
                  </p>
                </td>

                <td className="p-4">
                  {item.registrationType}
                </td>

                <td className="p-4">
                  <StatusBadge status={item.status} />
                </td>

                <td className="p-4 text-right whitespace-nowrap">
                  <p>{peso.format(item.registrationFee)}</p>
                  <p className="text-xs text-gray-500">
                    {peso.format(item.amountPaid)}
                  </p>
                </td>

                <td className="p-4">
                  <PaymentBadge status={item.paymentStatus} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

