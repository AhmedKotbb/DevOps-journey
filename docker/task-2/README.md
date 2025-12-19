# Weather App

A simple and beautiful weather application built with React.js that displays current weather information for any city.

## Features

- 🌤️ Real-time weather data
- 🔍 Search by city name
- 📱 Responsive design
- 🎨 Modern UI with gradient background
- 📊 Detailed weather information (temperature, humidity, wind speed)

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenWeatherMap API key (free at [openweathermap.org](https://openweathermap.org/api))

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Get your API key:**
   - Sign up at [OpenWeatherMap](https://openweathermap.org/api)
   - Get your free API key from the dashboard

3. **Configure API key:**
   
   Create a `.env` file in the root directory:
   ```
   VITE_WEATHER_API_KEY=your_api_key_here
   ```
   
   Or you can directly edit `src/App.jsx` and replace `YOUR_API_KEY_HERE` with your API key.

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   - The app will be available at `http://localhost:5173` (or the port shown in terminal)

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Docker Build and Run

This project includes a multi-stage Dockerfile for optimized production builds.

### Build the Docker image:

```bash
docker build -t weather-app .
```

Or with API key as build argument:

```bash
docker build --build-arg VITE_WEATHER_API_KEY=your_api_key_here -t weather-app .
```

### Run the container:

```bash
docker run -d -p 8080:80 weather-app
```

The app will be available at `http://localhost:8080`

### Docker Build Stages:

1. **Builder stage**: Uses Node.js Alpine to install dependencies and build the React app
   - Copies package files and installs dependencies
   - Builds the React app with Vite
   - Accepts `VITE_WEATHER_API_KEY` as build argument

2. **Production stage**: Uses Nginx Alpine to serve the static files
   - Copies built files from builder stage
   - Uses custom nginx configuration for optimal performance
   - Final image is much smaller (only contains nginx and static files)

**Note**: For the weather API to work, you can either:
- Pass the API key as a build argument: `--build-arg VITE_WEATHER_API_KEY=your_key`
- Or set it in a `.env` file before building (the .env file will be copied during build)

## Docker Compose

The project includes a `docker-compose.yaml` file for easier management.

### Prerequisites:

Create a `.env` file in the project root with your API key:

```env
VITE_WEATHER_API_KEY=your_api_key_here
```

### Build and run with Docker Compose:

```bash
# Build and start the container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

The app will be available at `http://localhost:8080`

### Docker Compose Benefits:

- ✅ Simplified build and run commands
- ✅ Automatic network configuration
- ✅ Easy environment variable management via `.env` file
- ✅ Container restart policy included
- ✅ Easy to scale or add more services in the future

## Usage

1. Enter a city name in the search box
2. Click "Search" or press Enter
3. View the current weather information including:
   - Temperature
   - Weather description
   - Feels like temperature
   - Humidity
   - Wind speed

## Technologies Used

- React 18
- Vite (build tool)
- OpenWeatherMap API
- CSS3 (modern styling with gradients and animations)

## License

MIT

