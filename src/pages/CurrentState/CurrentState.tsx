import React from 'react';
import { Typography, Row, Col, Tag, Statistic, List, Badge } from 'antd';
import { 
  BellOutlined, 
  CheckCircleOutlined, 
  ExclamationCircleOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { Container, StyledCard, StyledTitle, LoadingSpinner, StyledButton } from '@/components/common';
import { useAlertsManagement } from '@/hooks/useReduxAlerts';
import { formatDate, formatRelativeTime, getParameterLabel } from '@/utils/formatters';

const { Paragraph, Text } = Typography;

const CurrentState: React.FC = () => {
  const {
    alerts,
    snapshot,
    isLoading,
    hasError,
    alertsError,
    snapshotError,
    handleRefresh,
    totalAlerts,
    triggeredAlerts,
    triggeredAlertsCount,
  } = useAlertsManagement();

  if (isLoading && !snapshot) {
    return (
      <Container>
        <LoadingSpinner text="Loading alert status..." />
      </Container>
    );
  }

  if (hasError) {
    return (
      <Container>
        <StyledCard $variant="elevated">
          <StyledTitle level={2}>Current Alert State</StyledTitle>
          <Paragraph type="danger">
            Error loading alert state: {alertsError || snapshotError}
          </Paragraph>
          <StyledButton onClick={handleRefresh} type="primary">
            Try Again
          </StyledButton>
        </StyledCard>
      </Container>
    );
  }

  return (
    <Container>
      {/* Header with refresh */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <StyledTitle level={2} style={{ marginBottom: 0 }}>
          Current Alert State
        </StyledTitle>
        <StyledButton 
          icon={<ReloadOutlined />} 
          onClick={handleRefresh}
          loading={isLoading}
        >
          Refresh
        </StyledButton>
      </div>

      {/* Overview Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8}>
          <StyledCard>
            <Statistic
              title="Total Alerts"
              value={totalAlerts}
              prefix={<BellOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </StyledCard>
        </Col>
        <Col xs={24} sm={8}>
          <StyledCard>
            <Statistic
              title="Triggered Alerts"
              value={triggeredAlertsCount}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: triggeredAlertsCount > 0 ? '#ff4d4f' : '#52c41a' }}
            />
          </StyledCard>
        </Col>
        <Col xs={24} sm={8}>
          <StyledCard>
            <Statistic
              title="Status"
              value={triggeredAlertsCount === 0 ? 'All Clear' : 'Alerts Active'}
              prefix={triggeredAlertsCount === 0 ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
              valueStyle={{ 
                color: triggeredAlertsCount === 0 ? '#52c41a' : '#ff4d4f',
                fontSize: '16px'
              }}
            />
          </StyledCard>
        </Col>
      </Row>

      {/* Alert Status */}
      <Row gutter={[24, 24]}>
        {/* Triggered Alerts */}
        <Col xs={24} lg={12}>
          <StyledCard 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
                <span>Triggered Alerts ({triggeredAlertsCount})</span>
              </div>
            }
          >
            {triggeredAlertsCount === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <CheckCircleOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: '16px' }} />
                <Paragraph>No alerts are currently triggered. All conditions are normal.</Paragraph>
              </div>
            ) : (
              <List
                dataSource={triggeredAlerts}
                renderItem={(alert) => (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>{alert.location}</span>
                          <Tag color="red">Triggered</Tag>
                        </div>
                      }
                      description={
                        <div>
                          <Text type="secondary">
                            {getParameterLabel(alert.parameter)}: {alert.threshold}
                          </Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            Last triggered: {alert.lastTriggered ? formatRelativeTime(alert.lastTriggered) : 'Unknown'}
                          </Text>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </StyledCard>
        </Col>

        {/* All Alerts Summary */}
        <Col xs={24} lg={12}>
          <StyledCard 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BellOutlined />
                <span>All Alerts Summary</span>
              </div>
            }
          >
            {totalAlerts === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <BellOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
                <Paragraph>No alerts configured. Go to the Alerts page to create your first alert.</Paragraph>
              </div>
            ) : (
              <List
                dataSource={alerts.slice(0, 5)} // Show only first 5
                renderItem={(alert) => (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>{alert.location}</span>
                          <Badge 
                            status={alert.isTriggered ? 'error' : 'success'} 
                            text={alert.isTriggered ? 'Triggered' : 'Normal'}
                          />
                        </div>
                      }
                      description={
                        <Text type="secondary">
                          {getParameterLabel(alert.parameter)}: {alert.threshold}
                        </Text>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
            {totalAlerts > 5 && (
              <div style={{ textAlign: 'center', paddingTop: '12px', borderTop: '1px solid #f0f0f0' }}>
                <Text type="secondary">And {totalAlerts - 5} more alerts...</Text>
              </div>
            )}
          </StyledCard>
        </Col>
      </Row>

      {/* Last Updated */}
      {snapshot && (
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Last checked: {formatDate(snapshot.lastChecked)} ({formatRelativeTime(snapshot.lastChecked)})
          </Text>
        </div>
      )}
    </Container>
  );
};

export default CurrentState;