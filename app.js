const clientId = '285eab5c8ab7438c99e5a48dea22214f'; // Replace with your Spotify Client ID
const clientSecret = '35d89951f3d6424382579f9f1d9d9910'; // Replace with your Spotify Client Secret
let token = '';

async function getToken() {
  const result = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
    },
    body: 'grant_type=client_credentials'
  });

  const data = await result.json();
  token = data.access_token;
}

async function searchMusic() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = ""; // Clear previous results

  // Check if token is empty, get new token if needed
  if (!token) await getToken();

  const result = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track`, {
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + token }
  });

  const data = await result.json();
  const tracks = data.tracks.items;

  if (tracks.length > 0) {
    tracks.forEach(track => {
      const songItem = document.createElement("div");
      songItem.className = "result-item";
      songItem.innerHTML = `<a href="${track.external_urls.spotify}" target="_blank">${track.name} - ${track.artists[0].name}</a>`;
      resultsDiv.appendChild(songItem);
    });
  } else {
    resultsDiv.innerHTML = "<p>No results found</p>";
  }
}