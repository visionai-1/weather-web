import React from 'react';
import { Typography, Table, Tag, Button } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Container, StyledCard, StyledTitle, LoadingSpinner } from '@/components/common';
import { useAlertsManagement } from '@/hooks/useReduxAlerts';
import { formatDate, getParameterLabel } from '@/utils/formatters';

const { Paragraph } = Typography;

const Alerts: React.FC = () => {
  const {
    alerts,
    alertsLoading,
    alertsError,
    deleteAlert,
    isDeleting,
  } = useAlertsManagement();

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: any) => (
        <div>
          <span style={{ fontWeight: 500 }}>{name || `${record.parameter} Alert`}</span>
          {record.description && (
            <div style={{ fontSize: '12px', color: '#666' }}>{record.description}</div>
          )}
        </div>
      ),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      render: (location: any) => (
        <span style={{ fontWeight: 500 }}>
          {location.city || `${location.lat?.toFixed(2)}, ${location.lon?.toFixed(2)}`}
        </span>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'realtime' ? 'blue' : 'orange'}>
          {type}
        </Tag>
      ),
    },
    {
      title: 'Condition',
      key: 'condition',
      render: (_: any, record: any) => (
        <span>
          {getParameterLabel(record.parameter)} {record.operator} {record.threshold}
          {record.timestep && ` (${record.timestep})`}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'lastState',
      key: 'status',
      render: (lastState: string) => (
        <Tag color={lastState === 'triggered' ? 'red' : 'green'}>
          {lastState === 'triggered' ? 'Triggered' : 'Normal'}
        </Tag>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Button
          type="text"
          danger
          size="small"
          icon={<DeleteOutlined />}
          loading={isDeleting(record.id || record._id)}
          onClick={() => deleteAlert(record.id || record._id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  if (alertsLoading) {
    return (
      <Container>
        <LoadingSpinner text="Loading alerts..." />
      </Container>
    );
  }

  if (alertsError) {
    return (
      <Container>
        <StyledCard $variant="elevated">
          <StyledTitle level={2}>Weather Alerts</StyledTitle>
          <Paragraph type="danger">
            Error loading alerts: {alertsError}
          </Paragraph>
        </StyledCard>
      </Container>
    );
  }

  return (
    <Container>
      <StyledCard $variant="elevated">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <StyledTitle level={2} style={{ marginBottom: 0 }}>
            Weather Alerts ({alerts.length})
          </StyledTitle>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => {
              // TODO: Open create alert modal/form
              console.log('Create alert clicked');
            }}
          >
            Create Alert
          </Button>
        </div>
        
        {alerts.length === 0 ? (
          <Paragraph>
            No alerts created yet. Create your first alert to get notified about weather conditions.
          </Paragraph>
        ) : (
          <Table
            columns={columns}
            dataSource={alerts}
            rowKey={(record) => record.id || record._id || ''}
            pagination={{ pageSize: 10 }}
            size="middle"
          />
        )}
      </StyledCard>
    </Container>
  );
};

export default Alerts;