
import { useEffect, useState } from 'react';
import { getRegistrations } from './services/api';

function App() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadRegistrations() {
      try {
        const data = await getRegistrations();
        setRegistrations(data.items);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadRegistrations();
  }, []);

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial' }}>
      <h1>Car Show Registration System</h1>
      <h2>Registration List</h2>

      {loading && <p>Loading registrations...</p>}

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {!loading && !error && (
        <>
          <p>Total records on this page: {registrations.length}</p>

          {registrations.length === 0 ? (
            <p>No registrations found.</p>
          ) : (
            <table
              border="1"
              cellPadding="10"
              style={{ borderCollapse: 'collapse', width: '100%' }}
            >
              <thead>
                <tr>
                  <th>Registration No.</th>
                  <th>Participant Name</th>
                  <th>Car</th>
                  <th>Registration Type</th>
                  <th>Status</th>
                  <th>Payment Status</th>
                </tr>
              </thead>

              <tbody>
                {registrations.map((registration) => (
                  <tr key={registration.id}>
                    <td>{registration.registrationNumber}</td>
                    <td>{registration.participantName}</td>
                    <td>{registration.carMakeModel}</td>
                    <td>{registration.registrationType}</td>
                    <td>{registration.status}</td>
                    <td>{registration.paymentStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}

export default App;
