import React, { memo } from 'react';
import { Card, Table, Tag, Typography } from 'antd';
import styled from 'styled-components';
import type { ForecastData } from '@/types';
import { formatTemperature, formatDate } from '@/utils/formatters';

const { Text } = Typography;

interface WeatherForecastProps {
  forecast: ForecastData;
}



const StyledForecastCard = styled(Card)`
  .ant-card-head {
    border-bottom: 2px solid ${({ theme }) => theme.colors.border};
  }
`;

const ForecastTable = styled(Table)`
  .ant-table-thead > tr > th {
    background-color: ${({ theme }) => theme.colors.background.secondary};
    font-weight: 600;
  }
  
  .ant-table-tbody > tr > td {
    padding: 12px 8px;
  }
`;

const WeatherIcon = styled.span`
  font-size: 20px;
  margin-right: 8px;
`;

const TemperatureCell = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
`;

const TimeCell = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const DescriptionCell = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.secondary};
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

  // Prepare table data for horizontal display
  const tableData = limitedIntervals.map((interval, index) => ({
    key: index,
    time: forecast.timestep === '1h' 
      ? new Date(interval.time).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })
      : formatDate(interval.time).split(' ')[0],
    weather: (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <WeatherIcon>{getWeatherIcon(interval.weatherCode)}</WeatherIcon>
        <DescriptionCell>{interval.description}</DescriptionCell>
      </div>
    ),
    temperature: <TemperatureCell>{formatTemperature(interval.temperature)}</TemperatureCell>,
    precipitation: interval.precipitationChance > 0 ? (
      <Tag color="blue">🌧️ {interval.precipitationChance}%</Tag>
    ) : '-',
    humidity: interval.humidity ? `${interval.humidity}%` : '-',
    windSpeed: interval.windSpeed ? `${interval.windSpeed} m/s` : '-',
  }));

  const columns = [
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      width: 80,
      render: (time: string) => <TimeCell>{time}</TimeCell>,
    },
    {
      title: 'Weather',
      dataIndex: 'weather',
      key: 'weather',
      width: 200,
    },
    {
      title: 'Temperature',
      dataIndex: 'temperature',
      key: 'temperature',
      width: 100,
      align: 'center' as const,
    },
    {
      title: 'Precipitation',
      dataIndex: 'precipitation',
      key: 'precipitation',
      width: 120,
      align: 'center' as const,
    },
    {
      title: 'Humidity',
      dataIndex: 'humidity',
      key: 'humidity',
      width: 100,
      align: 'center' as const,
    },
    {
      title: 'Wind Speed',
      dataIndex: 'windSpeed',
      key: 'windSpeed',
      width: 120,
      align: 'center' as const,
    },
  ];

  return (
    <StyledForecastCard
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
      <ForecastTable
        columns={columns}
        dataSource={tableData}
        pagination={false}
        size="small"
        scroll={{ x: 800 }}
      />
      
      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          Showing next {limitedIntervals.length} {forecast.timestep === '1h' ? 'hours' : 'days'}
        </Text>
      </div>
    </StyledForecastCard>
  );
};

// Memoize to prevent unnecessary re-renders
export const WeatherForecast = memo(WeatherForecastComponent);