import React, { memo } from 'react';
import { Card, List, Tag, Typography } from 'antd';
import styled from 'styled-components';
import type { ForecastData } from '@/types';
import { formatTemperature, formatDate } from '@/utils/formatters';

const { Text } = Typography;

interface WeatherForecastProps {
  forecast: ForecastData;
}

const ForecastCard = styled(Card)`
  .ant-card-head {
    border-bottom: 2px solid ${({ theme }) => theme.colors.border};
  }
`;

const ForecastItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
`;

const ForecastTime = styled(Text)`
  font-weight: 500;
  min-width: 100px;
`;

const ForecastTemp = styled(Text)`
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
`;

const ForecastDetails = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

// Get weather icon based on weather code
const getWeatherIcon = (weatherCode?: number): string => {
  if (!weatherCode) return '☀️';
  
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
    5000: '❄️', // Snow
    5001: '🌨️', // Flurries
    6000: '🌨️', // Freezing Drizzle
    7000: '❄️', // Ice Pellets
    8000: '⛈️', // Thunderstorm
  };
  
  return codeMap[weatherCode] || '☀️';
};

const WeatherForecastComponent: React.FC<WeatherForecastProps> = ({ forecast }) => {
  // Show next 12 hours or 7 days depending on timestep
  const maxItems = forecast.timestep === '1h' ? 12 : 7;
  const limitedIntervals = forecast.intervals.slice(0, maxItems);

  return (
    <ForecastCard
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>📊</span>
          <span>
            {forecast.timestep === '1h' ? 'Hourly Forecast' : 'Daily Forecast'}
          </span>
          <Tag color="blue">{forecast.location.name}</Tag>
        </div>
      }
    >
      <List
        dataSource={limitedIntervals}
        renderItem={(interval) => (
          <List.Item>
            <ForecastItem>
              <ForecastTime>
                {forecast.timestep === '1h' 
                  ? new Date(interval.time).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })
                  : formatDate(interval.time).split(' ')[0] // Date only
                }
              </ForecastTime>
              
              <ForecastDetails>
                <span style={{ fontSize: '20px' }}>
                  {getWeatherIcon(interval.weatherCode)}
                </span>
                
                <ForecastTemp>
                  {formatTemperature(interval.temperature)}
                </ForecastTemp>
                
                {interval.precipitationChance > 0 && (
                  <Tag color="blue">
                    🌧️ {interval.precipitationChance}%
                  </Tag>
                )}
                
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {interval.description}
                </Text>
              </ForecastDetails>
            </ForecastItem>
          </List.Item>
        )}
      />
      
      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          Showing next {limitedIntervals.length} {forecast.timestep === '1h' ? 'hours' : 'days'}
        </Text>
      </div>
    </ForecastCard>
  );
};

// Memoize to prevent unnecessary re-renders
export const WeatherForecast = memo(WeatherForecastComponent);