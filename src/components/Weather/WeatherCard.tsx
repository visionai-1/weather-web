import React from 'react';
import { Space, Tag } from 'antd';
import { ReloadOutlined, EnvironmentOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import type { WeatherData } from '@/types';
import { 
  formatTemperature, 
  formatDate, 
  getWeatherIconUrl, 
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

const WeatherIcon = styled.img`
  width: 100px;
  height: 100px;
  object-fit: contain;
`;

const TemperatureInfo = styled.div`
  .main-temp {
    font-size: 48px;
    font-weight: 300;
    color: ${({ theme }) => theme.colors.primary};
    line-height: 1;
    margin-bottom: 8px;
  }
  
  .feels-like {
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: 14px;
    margin-bottom: 4px;
  }
  
  .temp-range {
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: 14px;
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

export const WeatherCard: React.FC<WeatherCardProps> = ({
  weather,
  location,
  onRefresh,
}) => {
  const mainWeather = weather.weather[0];
  const iconUrl = getWeatherIconUrl(mainWeather.icon);

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
        <WeatherIcon 
          src={iconUrl} 
          alt={mainWeather.description}
          onError={(e) => {
            // Fallback to a default icon if the image fails to load
            (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjBGMEYwIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5XZWF0aGVyPC90ZXh0Pgo8L3N2Zz4K';
          }}
        />
        
        <TemperatureInfo>
          <div className="main-temp">
            {formatTemperature(weather.main.temp)}
          </div>
          <div className="feels-like">
            Feels like {formatTemperature(weather.main.feels_like)}
          </div>
          <div className="temp-range">
            {formatTemperature(weather.main.temp_min)} / {formatTemperature(weather.main.temp_max)}
          </div>
        </TemperatureInfo>
        
        <WeatherDescription>
          <div className="condition">
            {mainWeather.main}
          </div>
          <div className="description">
            {capitalize(mainWeather.description)}
          </div>
        </WeatherDescription>
      </MainWeatherInfo>

      <Space wrap>
        <Tag color="blue">Current Conditions</Tag>
        <Tag color="green">Live Data</Tag>
      </Space>

      <UpdateInfo>
        <div className="last-update">
          Last updated: {formatDate(new Date())}
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