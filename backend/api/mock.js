export const mockFlights = [
    {
        id: 1,
        airline: "Turkish Airlines",
        departure: "Istanbul",
        arrival: "London",
        date: "2025-07-18",
        time: "14:30",
        country: "Turkey",
        airport: "IST",
        type: "Departure"
    },
    {
        id: 2,
        airline: "Lufthansa",
        departure: "Berlin",
        arrival: "Paris",
        date: "2025-07-18",
        time: "16:00",
        country: "Germany",
        airport: "BER",
        type: "Departure"
    },
    {
        id: 3,
        airline: "Emirates",
        departure: "Dubai",
        arrival: "Cyprus",
        date: "2025-07-18",
        time: "10:00",
        country: "UAE",
        airport: "DXB",
        type: "Arrival"
    },
    {
        id: 4,
        airline: "Pegasus",
        departure: "Ankara",
        arrival: "Cyprus",
        date: "2025-07-18",
        time: "12:00",
        country: "Turkey",
        airport: "ESB",
        type: "Arrival"
    }
];

export const fetchFlights = (filters = {}) => {
    return mockFlights.filter((flight) => {
        const matchType = filters.type ? flight.type === filters.type : true;
        const matchCountry = filters.country ? flight.country === filters.country : true;
        const matchAirport = filters.airport ? flight.airport === filters.airport : true;
        const matchAirline = filters.airline ? flight.airline === filters.airline : true;
        return matchType && matchCountry && matchAirport && matchAirline;
    });
};