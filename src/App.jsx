import { useState } from "react";
import "./App.css";
import { getForecast } from "./weather";

function App() {
  const [query, setQuery] = useState("Washington, DC");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function load(location) {
    setLoading(true);
    setError(null);
    try {
      setData(await getForecast(location));
    } catch (err) {
      setData(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    load(query);
  }

  return (
    <main className="app">
      <h1>Weather</h1>
      <form onSubmit={handleSubmit} className="controls">
        <label>
          Location
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="City, address, or ZIP"
            required
          />
        </label>
        <button type="submit">Get forecast</button>
      </form>

      {loading && <p>Loading…</p>}
      {error && <p className="error">{error}</p>}

      {data && (
        <>
          <h2>{data.location}</h2>
          <section className="today">
            <h3>{data.periods[0].name}</h3>
            <img src={data.periods[0].icon} alt="" width="96" height="96" />
            <p className="today-temp">
              {data.periods[0].temperature}°{data.periods[0].temperatureUnit}
            </p>
            <p className="today-short">{data.periods[0].shortForecast}</p>
            <p>{data.periods[0].detailedForecast}</p>
            <p className="wind">
              Wind {data.periods[0].windSpeed} {data.periods[0].windDirection}
            </p>
          </section>
          <ul className="periods">
            {data.periods.slice(1).map((p) => (
              <li key={p.number} className="period">
                <h4>{p.name}</h4>
                <img src={p.icon} alt="" width="40" height="40" />
                <p className="temp">
                  {p.temperature}°{p.temperatureUnit}
                </p>
                <p>{p.shortForecast}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}

export default App;
