# Weather Alerts Dashboard

A modern, responsive Weather Alerts Dashboard built with React, TypeScript, Ant Design, and styled-components.

## 🚀 Features

### ✅ Completed
- **Modern Tech Stack**: React 19, TypeScript, Vite, Ant Design, styled-components
- **Responsive Layout**: Mobile-first design with collapsible sidebar navigation
- **Home Page**: Current weather display with geolocation support
- **Weather Search**: Search weather by city name
- **Component Architecture**: Reusable, well-structured components
- **Type Safety**: Full TypeScript implementation with strict mode
- **Absolute Imports**: Clean import paths with @ prefix
- **Professional Styling**: Styled-components with theming support
- **API Integration**: Axios with interceptors and error handling
- **State Management**: React Query for efficient data fetching and caching

### 🚧 In Development
- **Alerts Management**: Create, update, and delete weather alerts
- **Current State Dashboard**: Real-time alert status monitoring
- **Backend Integration**: API integration for alert persistence
- **Testing**: Unit tests with Jest and React Testing Library

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **UI Library**: Ant Design (antd)
- **Styling**: styled-components
- **Routing**: React Router v6
- **State Management**: React Query (@tanstack/react-query)
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Code Quality**: ESLint, Prettier
- **Date Handling**: dayjs

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd weather-alerts-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your OpenWeather API key:
   ```
   VITE_OPENWEATHER_API_KEY=your_api_key_here
   VITE_USE_MOCK_DATA=false
   ```

4. **Start development server**
   ```bash
   npm start
   # or
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🌍 Environment Variables

Create a `.env` file in the root directory:

```env
# Weather API Configuration
VITE_OPENWEATHER_API_KEY=your_openweather_api_key_here
VITE_WEATHER_API_URL=https://api.openweathermap.org/data/2.5

# Alerts API Configuration (for future backend integration)
VITE_ALERTS_API_URL=http://localhost:3001/api

# Development flags
VITE_USE_MOCK_DATA=true
```

## 🗂️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Layout/          # Layout components
│   └── Weather/         # Weather-specific components
├── pages/               # Page components
│   ├── Home/           # Home page with current weather
│   ├── Alerts/         # Alerts management page
│   └── CurrentState/   # Alert status dashboard
├── hooks/               # Custom React hooks
├── services/            # API services and configurations
├── types/               # TypeScript interfaces and types
├── styles/              # Global styles and theme
├── utils/               # Utility functions
└── assets/              # Static assets
```

## 🔧 Available Scripts

- `npm start` - Start development server
- `npm run dev` - Alternative to start (same as npm start)
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically
- `npm run preview` - Preview production build
- `npm test` - Run tests (when implemented)

## 🎨 Design System

### Colors
- **Primary**: #1890ff (Ant Design blue)
- **Success**: #52c41a
- **Warning**: #faad14
- **Error**: #ff4d4f

### Breakpoints
- **xs**: 576px
- **sm**: 768px
- **md**: 992px
- **lg**: 1200px
- **xl**: 1600px

## 📱 Features Overview

### Home Page (`/home`)
- **Geolocation**: Automatically detects user's location
- **Current Weather**: Displays temperature, conditions, and details
- **City Search**: Search weather for any city
- **Weather Metrics**: Humidity, wind, pressure, visibility
- **Responsive Design**: Optimized for all screen sizes

### Alerts Page (`/alerts`) - Coming Soon
- **Alert Creation Form**: Create weather alerts with thresholds
- **Alert Management**: View, edit, and delete existing alerts
- **Parameter Selection**: Temperature, humidity, wind speed, pressure, visibility
- **Location Support**: Coordinates or city name input

### Current State Page (`/current-state`) - Coming Soon
- **Alert Status**: Real-time view of triggered alerts
- **Dashboard View**: Summary of all alert states
- **Status Indicators**: Visual indicators for alert conditions
- **Refresh Functionality**: Manual and automatic refresh

## 🌟 Key Features

### 🗺️ Geolocation Support
- Automatic location detection
- Fallback locations for demo purposes
- Privacy-friendly with user permission

### 🎯 Weather Integration
- OpenWeatherMap API integration
- Mock data support for development
- Comprehensive weather metrics
- Error handling and fallbacks

### 🎨 Professional UI
- Ant Design component library
- Custom styled-components
- Consistent design system
- Mobile-responsive layout

### 🔧 Developer Experience
- TypeScript strict mode
- Absolute imports with @ prefix
- Comprehensive error handling
- Development and production builds

## 🚀 Getting Started

1. Get a free API key from [OpenWeatherMap](https://openweathermap.org/api)
2. Clone this repository
3. Install dependencies with `npm install`
4. Add your API key to `.env` file
5. Run `npm start` to start the development server
6. Open [http://localhost:5173](http://localhost:5173)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🎯 Roadmap

- [ ] Complete Alerts management functionality
- [ ] Implement Current State dashboard
- [ ] Add unit and integration tests
- [ ] Backend API development
- [ ] Real-time alert notifications
- [ ] Dark/light theme toggle
- [ ] Weather forecast integration
- [ ] Alert history and analytics

---

Built with ❤️ using React, TypeScript, and Ant Design