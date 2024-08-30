
document.addEventListener('DOMContentLoaded', () => {
    fetchTrends('http://localhost:3000/api/india-trends'); // Fetch initial data

    document.getElementById('worldwide-link').addEventListener('click', showWorldwide);
    document.getElementById('trending-link').addEventListener('click', showTrending); 

    const footerLogo = document.querySelector('.twittertrendwatch-footer-logo .logo');
    footerLogo.addEventListener('click', (event) => {
        event.preventDefault();
        console.log('Footer logo clicked!');
    });

    document.querySelector('.tab-link[data-tab="longest-trending"]').addEventListener('click', showLongestTrending);
    window.onload = checkScreenWidth;
    window.onresize = checkScreenWidth;

    document.querySelector('.see-all-btn').addEventListener('click', toggleSeeAll);

    // JavaScript for toggling dark/light mode
    document.getElementById('toggleSwitch').addEventListener('change', toggleDarkMode);

    // Update help link
    document.querySelector('.help-link').href = 'help.html';
});

let showAllRows = false; // State variable to track whether to show all rows

async function fetchTrends(endpoint) {
    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const trends = await response.json();

        if (endpoint.includes('/api/country-trends')) {
            populateCountryTrends(trends);
        } else if (endpoint.includes('/api/longest-trending')) {
            populateLongestTrending(trends);
        } else {
            populateTrends(trends);
        }
    } catch (error) {
        console.error('Error fetching trends:', error);
    }
}

function populateTrends(data) {
    const table = document.getElementById('most-tweeted-table');
    table.innerHTML = ''; // Clear existing content

    const maxRows = showAllRows ? data.length : 5; // Show all rows if showAllRows is true

    data.slice(0, maxRows).forEach((trend, index) => {
        const row = table.insertRow();
        row.insertCell(0).textContent = index + 1;
        row.insertCell(1).textContent = trend.name;
    });

    // Update the button text based on showAllRows state
    document.querySelector('.see-all-btn').textContent = showAllRows ? 'Show Less' : 'See All';
}

function populateCountryTrends(data) {
    const table = document.getElementById('most-tweeted-table');
    table.innerHTML = ''; // Clear existing content

    data.forEach((trend, index) => {
        const row = table.insertRow();
        row.insertCell(0).textContent = index + 1;
        row.insertCell(1).textContent = trend.name;
        row.insertCell(2).textContent = trend.volume;
    });
}

function populateLongestTrending(data) {
    const table = document.getElementById('most-tweeted-table');
    table.innerHTML = ''; // Clear existing content

    data.forEach((trend, index) => {
        const row = table.insertRow();
        row.insertCell(0).textContent = index + 1;
        row.insertCell(1).textContent = trend.name;
    });
}

function showWorldwide() {
    document.getElementById('content').innerHTML = `
        <div class="ribbon">Following are the list of today's top X trending topics worldwide. Twitter Trends last updated 27 minutes ago</div>
        <h1>Worldwide Trends</h1>
        <table id="most-tweeted-table"></table>`;
    fetchTrends('http://localhost:3000/api/worldwide-trends');
    toggleMenu(); // Ensure menu is closed after selecting option
}

function showTrending() {
    document.getElementById('content').innerHTML = `
        <div class="ribbon">Following are the list of today's top X trending topics. Twitter Trends last updated 27 minutes ago</div>
        <h1>India Twitter Trends</h1>
        <table id="most-tweeted-table"></table>`;
    fetchTrends('http://localhost:3000/api/india-trends');
    toggleMenu(); // Ensure menu is closed after selecting option
}

function fetchCountryTrends() {
    const country = document.getElementById('country-select').value;
    if (country) {
        document.getElementById('content').innerHTML = `
            <div class="ribbon">Following are the list of today's top X trending topics in ${country}. Twitter Trends last updated 27 minutes ago</div>
            <h1>${country} Twitter Trends</h1>
            <ul id="trends-list"></ul>`;
        fetchTrends(`http://localhost:3000/api/country-trends?country=${country}`);
        closeMenu();
    }
}

function showLongestTrending() {
    document.querySelector('.tab-title').textContent = 'Longest Trending Hashtags';
    fetchTrends('http://localhost:3000/api/longest-trending');
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`.tab-link[data-tab="${tabName}"]`).classList.add('active');

    if (tabName === 'most-tweeted') {
        showMostTweeted();
    } else if (tabName === 'longest-trending') {
        showLongestTrending();
    }
}

function showMostTweeted() {
    document.querySelector('.tab-title').textContent = 'Most Tweeted Hashtags (Last 24 Hours)';
    fetchTrends('http://localhost:3000/api/most-tweeted');
}

function switchTimeframe(timeframe) {
    document.querySelectorAll('.tab-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`.tab-link[onclick="switchTimeframe('${timeframe}')"]`).classList.add('active');

    let endpoint;
    switch (timeframe) {
        case '24h':
            endpoint = 'http://localhost:3000/api/most-tweeted';
            document.querySelector('.tab-title').textContent = 'Most Tweeted Hashtags (Last 24 Hours)';
            break;
        case '7d':
            endpoint = 'http://localhost:3000/api/most-tweeted-7d';
            document.querySelector('.tab-title').textContent = 'Most Tweeted Hashtags (Last 7 Days)';
            break;
        case '30d':
            endpoint = 'http://localhost:3000/api/most-tweeted-30d';
            document.querySelector('.tab-title').textContent = 'Most Tweeted Hashtags (Last 30 Days)';
            break;
        case 'year':
            endpoint = 'http://localhost:3000/api/most-tweeted-year';
            document.querySelector('.tab-title').textContent = 'Most Tweeted Hashtags (Last Year)';
            break;
        default:
            console.error('Unknown timeframe:', timeframe);
            return;
    }

    fetchTrends(endpoint);
}

function toggleMenu() {
    document.querySelector('.navbar .menu').classList.toggle('active');
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const moonIcon = document.getElementById('moon-icon');
    const sunIcon = document.getElementById('sun-icon');
    moonIcon.style.display = document.body.classList.contains('dark-mode') ? 'none' : 'inline';
    sunIcon.style.display = document.body.classList.contains('dark-mode') ? 'inline' : 'none';
}

function closeMenu() {
    document.querySelector('.navbar .menu').classList.remove('active');
}

function checkScreenWidth() {
    const screenWidth = window.innerWidth;
    document.querySelectorAll('.remote-tab-container .tab-group:nth-child(2) .tab-link:nth-child(3), .remote-tab-container .tab-group:nth-child(2) .tab-link:nth-child(4)')
        .forEach(tab => {
            tab.style.display = screenWidth <= 768 ? 'none' : 'inline-block';
        });
}

function toggleSeeAll() {
    showAllRows = !showAllRows;
    fetchTrends('http://localhost:3000/api/most-tweeted'); // Re-populate the table with updated state
}

// JavaScript to handle scrolling and hide/show ribbon
window.addEventListener('scroll', () => {
    const ribbon = document.querySelector('.ribbon');
    ribbon.style.opacity = window.scrollY > 0 ? '0' : '1';
});
async function fetchTrends(location) {
    try {
        // Make a GET request to your backend API
        const response = await fetch(`/api/trends/${location}`);

        // Check if the response is successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the JSON response
        const data = await response.json();

        // Process and display the data on your frontend
        displayTrends(data);
    } catch (error) {
        // Handle any errors that occur during the fetch
        console.error('Error fetching trends:', error);
    }
}

// Example call to fetch trends for a specific location (e.g., WOEID 1)
fetchTrends('1');
function displayTrends(data) {
    // Assuming you have an element with ID 'trendsContainer' to display trends
    const trendsContainer = document.getElementById('trendsContainer');

    // Clear any existing content
    trendsContainer.innerHTML = '';

    // Iterate over the data and create HTML elements to display trends
    data[0].trends.forEach(trend => {
        const trendElement = document.createElement('div');
        trendElement.className = 'trend-item';
        trendElement.textContent = trend.name;
        trendsContainer.appendChild(trendElement);
    });
}


async function fetchTrends() {
    const locationId = document.getElementById('locationSelect').value;
    const trendsContainer = document.getElementById('trends');
    trendsContainer.innerHTML = 'Loading...';
  
    try {
      const response = await fetch(`http://localhost:3000/api/trends/${locationId}`);
      const data = await response.json();
  
      // Clear existing trends
      trendsContainer.innerHTML = '';
  
      // Check if data is received
      if (data[0] && data[0].trends) {
        data[0].trends.forEach(trend => {
          const trendElement = document.createElement('div');
          trendElement.classList.add('trend');
          trendElement.innerHTML = `
            <p><a href="${trend.url}" target="_blank">${trend.name}</a></p>
            <p>Tweet Volume: ${trend.tweet_volume || 'N/A'}</p>
          `;
          trendsContainer.appendChild(trendElement);
        });
      } else {
        trendsContainer.innerHTML = 'No trends available for this location.';
      }
    } catch (error) {
      console.error('Error fetching trends:', error);
      trendsContainer.innerHTML = 'Error fetching trends.';
    }
  }
  