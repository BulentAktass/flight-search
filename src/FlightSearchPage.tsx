import React, { useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import {
  PlaneLanding,
  PlaneTakeoff,
  CalendarDays,
  Car,
  Building2,
  Palmtree,
} from "lucide-react";
import "./FlightSearchPage.css";

interface Flight {
  flightName: string;
  route: {
    destinations: string[];
  };
  scheduleTime: string;
  airport: string;
  flightDirection: string;
  prefixIATA: string;
  estimatedLandingTime: string;
  terminal: string;
}

export default function FlightSearchPage() {
  const [searchParams, setSearchParams] = useState({
    from: "",
    to: "",
    departDate: "",
    returnDate: "",
  });
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("http://localhost:5000/flights", {
        params: {
          scheduleDate: format(new Date(searchParams.departDate), "yyyy-MM-dd"),
          route: `${searchParams.from}-${searchParams.to}`,
        },
      });
      setFlights(response.data.flights);
    } catch (err) {
      setError("An error occurred while fetching flights. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flight-search-page">
      <header className="header">
        <div className="logo">
          <div className="logo-icon">
            <PlaneTakeoff size={24} />
          </div>
          <h1>PLANE SCAPE</h1>
        </div>
        <nav className="nav">
          <a href="#" className="nav-link">
            Deals
          </a>
          <a href="#" className="nav-link">
            Discover
          </a>
          <div className="avatar">
            <img src="https://github.com/shadcn.png" alt="@shadcn" />
          </div>
        </nav>
      </header>

      <main className="main">
        <div className="search-card">
          <div className="tabs">
            <h2 className="search-title">
              <PlaneTakeoff className="icon" />
              BOOK YOUR FLIGHT
            </h2>
            <div className="tabs">
              <button className="tab active">Round trip</button>
              <button className="tab">One way</button>
            </div>
          </div>
          <form onSubmit={handleSearch} className="search-form">
            <div className="input-group">
              <PlaneTakeoff className="input-icon" />
              <input
                type="text"
                placeholder="From"
                value={searchParams.from}
                onChange={(e) =>
                  setSearchParams({ ...searchParams, from: e.target.value })
                }
              />
            </div>
            <div className="input-group">
              <PlaneLanding className="input-icon" />
              <input
                type="text"
                placeholder="To"
                value={searchParams.to}
                onChange={(e) =>
                  setSearchParams({ ...searchParams, to: e.target.value })
                }
              />
            </div>
            <div className="input-group">
              <CalendarDays className="input-icon" />
              <input
                type="date"
                value={searchParams.departDate}
                onChange={(e) =>
                  setSearchParams({
                    ...searchParams,
                    departDate: e.target.value,
                  })
                }
              />
            </div>
            <div className="input-group">
              <CalendarDays className="input-icon" />
              <input
                type="date"
                value={searchParams.returnDate}
                onChange={(e) =>
                  setSearchParams({
                    ...searchParams,
                    returnDate: e.target.value,
                  })
                }
              />
            </div>
            <button type="submit" className="search-button">
              {loading ? "Searching..." : "Show flights"}
            </button>
          </form>
        </div>

        <div className="content">
          <div className="flights-list">
            {error && <div className="error-card">{error}</div>}
            {flights.length > 0
              ? flights.map((flight, index) => (
                  <div key={index} className="flight-card">
                    <div className="flight-header">
                      <h3>{`${flight.route.destinations[0]} - ${flight.route.destinations[1]}`}</h3>
                      <span>Flight: {flight.flightName}</span>
                    </div>
                    <div className="flight-details">
                      <div className="flight-time">
                        <p className="time">{flight.scheduleTime}</p>
                        <p className="airport">Airport: {flight.airport}</p>
                      </div>
                      <div className="flight-info">
                        <p>{flight.flightDirection}</p>
                        <div className="flight-line"></div>
                        <p>{flight.prefixIATA}</p>
                      </div>
                      <div className="flight-time">
                        <p className="time">{flight.estimatedLandingTime}</p>
                        <p className="airport">Terminal: {flight.terminal}</p>
                      </div>
                      <div className="flight-price">
                        <p className="price">
                          ${Math.floor(Math.random() * 300) + 100}
                        </p>
                        <p className="trip-type">One Way</p>
                      </div>
                      <button className="book-button">Book Flight</button>
                    </div>
                  </div>
                ))
              : !loading && (
                  <div className="no-flights">
                    No flights found. Please try a different search.
                  </div>
                )}
          </div>
          <div className="sidebar">
            <div className="sidebar-card car-rentals">
              <h3>
                <Car className="icon" />
                CAR RENTALS
              </h3>
              <p>Find the best deals on car rentals for your trip.</p>
            </div>
            <div className="sidebar-card hotels">
              <h3>
                <Building2 className="icon" />
                HOTELS
              </h3>
              <p>Book your stay at top-rated hotels.</p>
            </div>
            <div className="sidebar-card travel-packages">
              <h3>
                <Palmtree className="icon" />
                TRAVEL PACKAGES
              </h3>
              <p>
                Explore our curated travel packages for the best experiences.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
