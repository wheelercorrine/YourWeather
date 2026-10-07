const BASE = "https://api.weather.gov";

async function getJson(url) {
  const res = await fetch(url, { headers: { Accept: "application/geo+json" } });
  if (!res.ok) {
    throw new Error(
      res.status === 404
        ? "Location not supported (NWS covers US locations only)."
        : `Weather request failed (${res.status})`,
    );
  }
  return res.json();
}

async function geocode(query) {
  const params = new URLSearchParams({ q: query, format: "json", limit: "1" });
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?${params}`,
  );
  if (!res.ok) throw new Error(`Geocoding failed (${res.status})`);
  const results = await res.json();
  if (results.length === 0) throw new Error(`No match found for "${query}".`);
  return { lat: Number(results[0].lat), lon: Number(results[0].lon) };
}

export async function getForecast(query) {
  const { lat, lon } = await geocode(query);
  const point = await getJson(
    `${BASE}/points/${lat.toFixed(4)},${lon.toFixed(4)}`,
  );
  const { forecast, relativeLocation } = point.properties;
  const { city, state } = relativeLocation.properties;
  const forecastData = await getJson(forecast);
  return {
    location: `${city}, ${state}`,
    periods: forecastData.properties.periods,
  };
}
