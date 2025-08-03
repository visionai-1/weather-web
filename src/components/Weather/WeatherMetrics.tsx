import React, { memo } from 'react';
import { Row, Col, Progress } from 'antd';
import {
  EyeOutlined,
  DashboardOutlined,
  CloudOutlined,
  CompassOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import type { WeatherData } from '@/types';
import {
  formatHumidity,
  formatWindSpeed,
  formatPressure,
  formatVisibility,
} from '@/utils/formatters';
import { StyledCard, MetricDisplay } from '@/components/common';

interface WeatherMetricsProps {
  weather: WeatherData;
}

const MetricsCard = styled(StyledCard)`
  height: 100%;
  
  .ant-card-body {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

const HumidityContainer = styled.div`
  .humidity-progress {
    margin-top: ${({ theme }) => theme.spacing.sm};
  }
`;

const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

const getHumidityColor = (humidity: number): string => {
  if (humidity < 30) return '#ff4d4f'; // Red for low humidity
  if (humidity < 60) return '#52c41a'; // Green for comfortable humidity
  if (humidity < 80) return '#faad14'; // Orange for high humidity
  return '#ff4d4f'; // Red for very high humidity
};

const getPressureStatus = (pressure: number): string => {
  if (pressure < 1000) return 'Low';
  if (pressure < 1020) return 'Normal';
  return 'High';
};

const WeatherMetricsComponent: React.FC<WeatherMetricsProps> = ({ weather }) => {
  const windDirection = getWindDirection(weather.windDirection);
  const humidityColor = weather.humidity ? getHumidityColor(weather.humidity) : '#52c41a';
  const pressureStatus = weather.pressure ? getPressureStatus(weather.pressure) : 'N/A';

  return (
    <MetricsCard title="Weather Details">
      <Row gutter={[0, 16]}>
        <Col span={24}>
          <MetricDisplay
            icon={<CompassOutlined />}
            label="Wind"
            value={formatWindSpeed(weather.windSpeed)}
            subtitle={`${windDirection} (${weather.windDirection}°)`}
          />
        </Col>

        {weather.precipitation && (
          <Col span={24}>
            <MetricDisplay
              icon={<CloudOutlined />}
              label="Precipitation"
              value={`${Math.round(weather.precipitation.probability)}%`}
              subtitle={`Intensity: ${weather.precipitation.intensity.toFixed(1)} mm/h`}
            />
          </Col>
        )}

        {weather.humidity !== undefined && (
          <Col span={24}>
            <MetricDisplay
              icon={<CloudOutlined />}
              label="Humidity"
              value={formatHumidity(weather.humidity)}
              color={humidityColor}
            >
              <HumidityContainer>
                <Progress
                  percent={weather.humidity}
                  strokeColor={humidityColor}
                  size="small"
                  showInfo={false}
                  className="humidity-progress"
                />
              </HumidityContainer>
            </MetricDisplay>
          </Col>
        )}

        {weather.pressure && (
          <Col span={24}>
            <MetricDisplay
              icon={<DashboardOutlined />}
              label="Pressure"
              value={formatPressure(weather.pressure)}
              subtitle={pressureStatus}
            />
          </Col>
        )}

        {weather.visibility !== undefined && (
          <Col span={24}>
            <MetricDisplay
              icon={<EyeOutlined />}
              label="Visibility"
              value={formatVisibility(weather.visibility)}
            />
          </Col>
        )}

        {weather.cloudCover !== undefined && (
          <Col span={24}>
            <MetricDisplay
              icon={<CloudOutlined />}
              label="Cloud Cover"
              value={`${weather.cloudCover}%`}
            >
              <HumidityContainer>
                <Progress
                  percent={weather.cloudCover}
                  strokeColor="#87CEEB"
                  size="small"
                  showInfo={false}
                  className="humidity-progress"
                />
              </HumidityContainer>
            </MetricDisplay>
          </Col>
        )}
      </Row>
    </MetricsCard>
  );
};

// Memoize to prevent unnecessary re-renders
export const WeatherMetrics = memo(WeatherMetricsComponent);