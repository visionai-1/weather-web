import React from 'react';
import { Space, Tag } from 'antd';
import { ReloadOutlined, EnvironmentOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import type { WeatherData } from '@/types';
import { 
  formatTemperature, 
  formatDate, 
  capitalize 
} from '@/utils/formatters';
import { StyledCard, StyledButton } from '@/components/common';

interface WeatherCardProps {
  weather: WeatherData;
  location: string;
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

// Get weather icon based on weather code (Tomorrow.io codes)
const getWeatherIcon = (weatherCode?: number): string => {
  if (!weatherCode) return '☀️';
  
  // Tomorrow.io weather codes mapping to emojis
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
};

export const WeatherCard: React.FC<WeatherCardProps> = ({
  weather,
  location,
  onRefresh,
}) => {
  const weatherIcon = getWeatherIcon(weather.weatherCode);
  const timestamp = weather.timestamp ? formatDate(weather.timestamp) : formatDate(new Date());

  return (
    <WeatherStyledCard
      title={
        <WeatherHeader>
          <div className="location">
            <EnvironmentOutlined />
            {location}
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
            {weather.description || 'Current conditions'}
          </div>
          {weather.uvIndex !== undefined && (
            <div className="weather-info">
              UV Index: {weather.uvIndex}
            </div>
          )}
        </TemperatureInfo>
        
        <WeatherDescription>
          <div className="condition">
            Live Weather
          </div>
          <div className="description">
            {capitalize(weather.description || 'Real-time data')}
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