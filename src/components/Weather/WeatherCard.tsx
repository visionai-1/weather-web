import React, { memo } from 'react';
import { Space, Tag } from 'antd';
import { ReloadOutlined, EnvironmentOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import type { WeatherData, Location } from '@/types';
import { 
  formatTemperature, 
  formatDate, 
  formatWindSpeed,
  capitalize 
} from '@/utils/formatters';
import { StyledCard, StyledButton } from '@/components/common';

interface WeatherCardProps {
  weather: WeatherData;
  location: Location | null;
  onRefresh?: () => void;
}

const WeatherStyledCard = styled(StyledCard)`
  .ant-card-head {
    border-bottom: 2px solid ${({ theme }) => theme.colors.border};
  }
`;

const WeatherHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  
  .location {
    display: flex;
    align-items: center;
    gap: 8px;
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: 18px;
    font-weight: 600;
  }
`;

const MainWeatherInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 24px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
`;



const TemperatureInfo = styled.div`
  .main-temp {
    font-size: 48px;
    font-weight: 300;
    color: ${({ theme }) => theme.colors.primary};
    line-height: 1;
    margin-bottom: 8px;
  }
  
  .weather-info {
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: 14px;
    margin-bottom: 4px;
  }
`;

const WeatherDescription = styled.div`
  .condition {
    font-size: 20px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text.primary};
    margin-bottom: 8px;
  }
  
  .description {
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: 16px;
  }
`;

const UpdateInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
  
  .last-update {
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: 12px;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
`;

// Get weather icon based on condition string or weather code
const getWeatherIcon = (condition?: string, weatherCode?: number): string => {
  // If we have a weather code, use it
  if (weatherCode) {
    const codeMap: Record<number, string> = {
      1000: '☀️', // Clear
      1100: '🌤️', // Mostly Clear
      1101: '⛅', // Partly Cloudy
      1102: '☁️', // Mostly Cloudy
      1001: '☁️', // Cloudy
      2000: '🌫️', // Fog
      2100: '🌫️', // Light Fog
      4000: '🌦️', // Drizzle
      4001: '🌧️', // Rain
      4200: '🌦️', // Light Rain
      4201: '🌧️', // Heavy Rain
      5000: '❄️', // Snow
      5001: '🌨️', // Flurries
      5100: '🌨️', // Light Snow
      5101: '❄️', // Heavy Snow
      6000: '🌨️', // Freezing Drizzle
      6001: '🌨️', // Freezing Rain
      6200: '🌨️', // Light Freezing Rain
      6201: '🌨️', // Heavy Freezing Rain
      7000: '🧊', // Ice Pellets
      7101: '🧊', // Heavy Ice Pellets
      7102: '🧊', // Light Ice Pellets
      8000: '⛈️', // Thunderstorm
    };
    return codeMap[weatherCode] || '🌤️';
  }
  
  // Fallback to condition string matching
  if (condition) {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('clear')) return '☀️';
    if (conditionLower.includes('cloud')) return '☁️';
    if (conditionLower.includes('rain')) return '🌧️';
    if (conditionLower.includes('snow')) return '❄️';
    if (conditionLower.includes('fog')) return '🌫️';
    if (conditionLower.includes('storm')) return '⛈️';
  }
  
  return '☀️'; // Default to sunny
};

const WeatherCardComponent: React.FC<WeatherCardProps> = ({
  weather,
  location,
  onRefresh,
}) => {
  const weatherIcon = getWeatherIcon(weather.condition, weather.weatherCode);
  const timestamp = weather.timestamp ? formatDate(weather.timestamp) : formatDate(new Date());
  const locationName = location?.name || weather.location?.name || 'Unknown Location';

  return (
    <WeatherStyledCard
      title={
        <WeatherHeader>
          <div className="location">
            <EnvironmentOutlined />
            {locationName}
          </div>
        </WeatherHeader>
      }
      extra={
        onRefresh && (
          <StyledButton 
            icon={<ReloadOutlined />} 
            onClick={onRefresh}
            type="text"
            size="small"
          >
            Refresh
          </StyledButton>
        )
      }
    >
      <MainWeatherInfo>
        <div style={{ fontSize: '60px', marginRight: '16px' }}>
          {weatherIcon}
        </div>
        
        <TemperatureInfo>
          <div className="main-temp">
            {formatTemperature(weather.temperature)}
          </div>
          <div className="weather-info">
            {weather.condition || weather.description || 'Current conditions'}
          </div>
          <div className="weather-info">
            Wind: {formatWindSpeed(weather.windSpeed)}
          </div>
        </TemperatureInfo>
        
        <WeatherDescription>
          <div className="condition">
            {weather.condition || 'Live Weather'}
          </div>
          <div className="description">
            {capitalize(weather.description || weather.condition || 'Real-time data')}
          </div>
        </WeatherDescription>
      </MainWeatherInfo>

      <Space wrap>
        <Tag color="blue">Current Conditions</Tag>
        <Tag color="green">Live Data</Tag>
        {weather.precipitation && weather.precipitation.probability > 0 && (
          <Tag color="orange">
            Rain: {Math.round(weather.precipitation.probability)}%
          </Tag>
        )}
      </Space>

      <UpdateInfo>
        <div className="last-update">
          Last updated: {timestamp}
        </div>
        {onRefresh && (
          <StyledButton 
            size="small" 
            type="link" 
            icon={<ReloadOutlined />}
            onClick={onRefresh}
          >
            Refresh
          </StyledButton>
        )}
      </UpdateInfo>
    </WeatherStyledCard>
  );
};

// Memoize to prevent unnecessary re-renders
export const WeatherCard = memo(WeatherCardComponent);