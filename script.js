async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  const resultBox = document.getElementById("resultBox");

  if (!city) {
    resultBox.innerHTML = "<p>Please enter a city name.</p>";
    return;
  }

  resultBox.innerHTML = "<p>Loading...</p>";

  try {
    // 1. Get Lat/Lon
    const geoRes = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(city)}&key=e348d491ac954a5aba840196ae7b1a48`);
    const geoData = await geoRes.json();

    if (!geoData.results.length) {
      resultBox.innerHTML = "<p>City not found.</p>";
      return;
    }

    const { lat, lng } = geoData.results[0].geometry;

    // 2. Get Weather
    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum,windspeed_10m_max&timezone=auto`);
    const weatherData = await weatherRes.json();

    const icons = {
      0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️", 45: "🌫️", 48: "🌫️", 51: "🌦️",
      53: "🌧️", 55: "🌧️", 61: "🌧️", 63: "🌧️", 65: "🌧️",
      71: "❄️", 73: "❄️", 75: "❄️", 80: "🌧️", 81: "🌧️", 95: "⛈️"
    };

    let output = `<h2>📍 ${city}</h2>`;

    for (let i = 0; i < 2; i++) {
      const date = weatherData.daily.time[i];
      const code = weatherData.daily.weathercode[i];
      const icon = icons[code] || "🌡️";
      const max = weatherData.daily.temperature_2m_max[i];
      const min = weatherData.daily.temperature_2m_min[i];
      const wind = weatherData.daily.windspeed_10m_max[i];
      const rain = weatherData.daily.precipitation_sum[i];

      output += `
        <div style="margin-bottom: 15px;">
          <strong>${i === 0 ? "Today" : "Tomorrow"} (${date}):</strong><br>
          <span class="weather-icon">${icon}</span><br>
          🌡️ Max: ${max}°C | Min: ${min}°C<br>
          💨 Wind: ${wind} km/h<br>
          💧 Rain: ${rain} mm
        </div>
      `;
    }

    resultBox.innerHTML = output;
  } catch (error) {
    resultBox.innerHTML = "<p>Something went wrong!</p>";
  }
}
