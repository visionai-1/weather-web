import React, { useCallback, useMemo } from 'react';
import { Row, Col, Alert, Input, Spin } from 'antd';
import { 
  ReloadOutlined, 
  EnvironmentOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import { useLocationAndWeather } from '@/hooks/useReduxWeather';
import { WeatherCard } from '@/components/Weather/WeatherCard';
import { WeatherMetrics } from '@/components/Weather/WeatherMetrics';
import { WeatherForecast } from '@/components/Weather/WeatherForecast';
import { 
  Container, 
  StyledCard, 
  StyledButton, 
  LoadingSpinner,
  Flex 
} from '@/components/common';
import { debounce } from '@/utils/debounce';

// Remove the destructuring since we'll use Input.Search directly

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
    forecast,
    isLoading,
    hasError,
    locationError,
    weatherError,
    searchCity, // Used for value prop
    searchWeather,
    searchLoading, // Add search loading state
    isSearchActive, // Add search active state
    searchByCity,
    clearSearch,
    updateSearchCity,
    handleRefresh,
  } = useLocationAndWeather();

  // Debounced API call - only triggers with 3+ characters
  const debouncedApiSearch = useMemo(
    () => debounce((city: string) => {
      const trimmedCity = city.trim();
      if (trimmedCity.length >= 3) {
        searchByCity(trimmedCity);
      }
    }, 1500), // 1.5 seconds delay
    [searchByCity]
  );

  const handleCitySearch = useCallback((city: string) => {
    // Always update the input state immediately for typing feedback
    updateSearchCity(city);
    // Trigger debounced API call only for 3+ characters
    debouncedApiSearch(city);
  }, [updateSearchCity, debouncedApiSearch]);

  // Memoize weather card props to prevent unnecessary re-renders
  const weatherCardProps = useMemo(() => ({
    weather: displayWeather!,
    location: displayLocation,
    onRefresh: handleRefresh,
  }), [displayWeather, displayLocation, handleRefresh]);

  // Memoize weather metrics props
  const weatherMetricsProps = useMemo(() => ({
    weather: displayWeather!,
  }), [displayWeather]);

  // Memoize forecast props
  const forecastProps = useMemo(() => ({
    forecast: forecast!,
  }), [forecast]);

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
        <Spin spinning={searchLoading} tip="Searching for city...">
          <Input.Search
            placeholder="Search for a city (min. 3 letters, e.g., London, Tokyo)"
            value={searchCity}
            onSearch={handleCitySearch}
            onChange={(e) => handleCitySearch(e.target.value)}
            size="large"
            prefix={<SearchOutlined />}
            enterButton="Search"
            allowClear
            loading={searchLoading}
          />
        </Spin>
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
          <Spin spinning={searchLoading && isSearchActive} tip="Loading weather data...">
                      <Row gutter={[32, 32]}>
            <Col xs={24} lg={16}>
              <WeatherCard {...weatherCardProps} />
            </Col>
            <Col xs={24} lg={8}>
              <WeatherMetrics {...weatherMetricsProps} />
            </Col>
          </Row>
          </Spin>

          {/* Show forecast when available */}
          {forecast && !searchWeather && (
            <Spin spinning={searchLoading && isSearchActive} tip="Loading forecast...">
              <Row gutter={[32, 32]} style={{ marginTop: '32px' }}>
                <Col xs={24}>
                  <WeatherForecast {...forecastProps} />
                </Col>
              </Row>
            </Spin>
          )}

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