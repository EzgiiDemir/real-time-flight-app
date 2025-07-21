export function renderFlightDashboard(flights) {
    const container = document.getElementById('dashboard-container');
    container.innerHTML = flights.map(f => `
    <div class="flight-card">
      <strong>${f.flightNumber}</strong> - ${f.airline}<br />
      From ${f.departure} to ${f.arrival}<br />
      Time: ${f.time} - <span class="text-info">${f.status}</span>
    </div>
  `).join('');
}
