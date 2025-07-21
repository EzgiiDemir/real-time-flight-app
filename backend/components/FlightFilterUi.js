export function renderFlightFilters(flights, onFilterChange) {
    const airlines = [...new Set(flights.map(f => f.airline))];
    const departureCities = [...new Set(flights.map(f => f.departure))];

    const filterHTML = `
    <div class="row">
      <div class="col-md-4">
        <label>Airline</label>
        <select id="airline-filter" class="form-select">
          <option value="">All</option>
          ${airlines.map(a => `<option value="${a}">${a}</option>`).join('')}
        </select>
      </div>
      <div class="col-md-4">
        <label>Departure</label>
        <select id="departure-filter" class="form-select">
          <option value="">All</option>
          ${departureCities.map(d => `<option value="${d}">${d}</option>`).join('')}
        </select>
      </div>
    </div>
  `;

    document.getElementById('filter-container').innerHTML = filterHTML;

    document.getElementById('airline-filter').addEventListener('change', () => onFilterChange());
    document.getElementById('departure-filter').addEventListener('change', () => onFilterChange());
}
