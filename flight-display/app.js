import { fetchFlights } from "./api/mock.js";

const typeSelect = document.getElementById("type");
const countrySelect = document.getElementById("country");
const airportSelect = document.getElementById("airport");
const airlineSelect = document.getElementById("airline");
const flightsContainer = document.getElementById("flights");

function updateFlights() {
    const filters = {
        type: typeSelect.value,
        country: countrySelect.value,
        airport: airportSelect.value,
        airline: airlineSelect.value,
    };
    const flights = fetchFlights(filters);
    flightsContainer.innerHTML = flights
        .map(
            (f) => `
      <div class="flight-card">
        <h3>${f.airline} (${f.type})</h3>
        <p><strong>From:</strong> ${f.departure}</p>
        <p><strong>To:</strong> ${f.arrival}</p>
        <p><strong>Date:</strong> ${f.date} ${f.time}</p>
        <p><strong>Airport:</strong> ${f.airport}</p>
      </div>
    `
        )
        .join("");
}

typeSelect.addEventListener("change", updateFlights);
countrySelect.addEventListener("change", updateFlights);
airportSelect.addEventListener("change", updateFlights);
airlineSelect.addEventListener("change", updateFlights);

document.addEventListener("DOMContentLoaded", updateFlights);