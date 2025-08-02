import React from 'react';
import { Row, Col, Alert, Input } from 'antd';
import { 
  ReloadOutlined, 
  EnvironmentOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import { useLocationAndWeather } from '@/hooks/useReduxWeather';
import { WeatherCard } from '@/components/Weather/WeatherCard';
import { WeatherMetrics } from '@/components/Weather/WeatherMetrics';
import { 
  Container, 
  StyledCard, 
  StyledButton, 
  LoadingSpinner,
  Flex 
} from '@/components/common';

const { Search } = Input;

const HeaderCard = styled(StyledCard)`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  
  .ant-card-body {
    padding: ${({ theme }) => theme.spacing.xxl};
  }
`;

const LocationInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  .anticon {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const SearchContainer = styled.div`
  max-width: 400px;
  margin: 0 auto ${({ theme }) => theme.spacing.lg};
`;

const Home: React.FC = () => {
  const {
    location,
    displayWeather,
    displayLocation,
    isLoading,
    hasError,
    locationError,
    weatherError,
    searchCity,
    searchWeather,
    searchByCity,
    clearSearch,
    handleRefresh,
  } = useLocationAndWeather();

  const handleCitySearch = (city: string) => {
    if (city.trim()) {
      searchByCity(city.trim());
    }
  };

  const error = hasError ? (locationError || weatherError) : null;

  return (
    <Container>
      <HeaderCard>
        <h1 style={{ fontSize: '28px', marginBottom: '16px', color: '#1890ff' }}>
          Weather Dashboard
        </h1>
        <p style={{ fontSize: '16px', margin: 0 }}>
          Current weather conditions and forecasts
        </p>
      </HeaderCard>

      <SearchContainer>
        <Search
          placeholder="Search for a city (e.g., London, Tokyo)"
          value={searchCity}
          onSearch={handleCitySearch}
          size="large"
          prefix={<SearchOutlined />}
          enterButton="Search"
        />
        {searchWeather && (
          <div style={{ textAlign: 'center', marginTop: '8px' }}>
            <StyledButton type="link" onClick={clearSearch}>
              Clear search and return to current location
            </StyledButton>
          </div>
        )}
      </SearchContainer>

      {error && (
        <Alert
          message="Error"
          description={typeof error === 'string' ? error : 'Failed to load weather data'}
          type="error"
          showIcon
          style={{ marginBottom: '24px' }}
          action={
            <StyledButton size="small" danger onClick={handleRefresh}>
              Try Again
            </StyledButton>
          }
        />
      )}

      {isLoading ? (
        <StyledCard>
          <LoadingSpinner 
            text={isLoading ? 'Loading...' : 'Loading weather data...'}
          />
        </StyledCard>
      ) : displayWeather ? (
        <>
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <WeatherCard 
                weather={displayWeather} 
                location={displayLocation}
                onRefresh={handleRefresh}
              />
            </Col>
            <Col xs={24} lg={8}>
              <WeatherMetrics weather={displayWeather} />
            </Col>
          </Row>

          {location && !searchWeather && (
            <StyledCard style={{ marginTop: '24px' }}>
              <LocationInfo>
                <EnvironmentOutlined />
                <span>
                  Showing weather for your current location
                  {location.name && ` (${location.name})`}
                </span>
              </LocationInfo>
              <Flex justify="center">
                <StyledButton 
                  icon={<ReloadOutlined />} 
                  onClick={handleRefresh}
                  type="primary"
                >
                  Refresh Location & Weather
                </StyledButton>
              </Flex>
            </StyledCard>
          )}
        </>
      ) : (
        <StyledCard>
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <p>No weather data available</p>
            <StyledButton type="primary" onClick={handleRefresh}>
              Try Again
            </StyledButton>
          </div>
        </StyledCard>
      )}
    </Container>
  );
};

export default Home;