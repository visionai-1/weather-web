import React, { useState, useCallback } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Switch,
  Row,
  Col,
  Typography,
  message,
} from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import { useLocationAndWeather } from '@/hooks/useReduxWeather';
import { useAlertsManagement } from '@/hooks/useAlertsManagement';
import { ALERT_PARAMETERS } from '@/utils/constants';
import type { CreateAlertRequest, AlertParameter } from '@/types';

const { TextArea } = Input;
const { Text } = Typography;
const { Option } = Select;

interface CreateAlertModalProps {
  open: boolean;
  onClose: () => void;
}

export const CreateAlertModal: React.FC<CreateAlertModalProps> = ({
  open,
  onClose,
}) => {
  const [form] = Form.useForm();
  const [useCurrentLocation, setUseCurrentLocation] = useState(true);
  const [selectedParameter, setSelectedParameter] = useState<AlertParameter>('temperature');
  const [selectedType, setSelectedType] = useState<'realtime' | 'forecast'>('realtime');
  
  const { location } = useLocationAndWeather();
  const { createAlert, creating, fetchAlerts } = useAlertsManagement();

  const handleSubmit = useCallback(async (values: any) => {
    try {
      // Validate location is available
      if (useCurrentLocation && !location) {
        message.error('Current location not available. Please use custom location.');
        return;
      }

      const payload: CreateAlertRequest = {
        type: values.type,
        parameter: values.parameter,
        operator: values.operator,
        threshold: values.threshold,
        location: useCurrentLocation
          ? {
              lat: location?.lat,
              lon: location?.lon,
            }
          : values.location,
        ...(values.type === 'forecast' && { timestep: values.timestep }),
        name: values.name,
        description: values.description,
      };

      await createAlert(payload);
      // Refresh the alerts list to show the new alert
      await fetchAlerts();
      message.success('Alert created successfully!');
      form.resetFields();
      onClose();
    } catch (error) {
      console.error('Failed to create alert:', error);
      message.error('Failed to create alert. Please try again.');
    }
  }, [createAlert, fetchAlerts, location, useCurrentLocation, form, onClose]);

  const handleCancel = useCallback(() => {
    form.resetFields();
    setUseCurrentLocation(true);
    setSelectedParameter('temperature');
    setSelectedType('realtime');
    onClose();
  }, [form, onClose]);

  const parameterConfig = ALERT_PARAMETERS[selectedParameter];

  return (
    <Modal
      title="Create Weather Alert"
      open={open}
      onOk={form.submit}
      onCancel={handleCancel}
      confirmLoading={creating}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          type: 'realtime',
          parameter: 'temperature',
          operator: '>',
          threshold: 25,
          name: '',
          description: '',
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="type"
              label="Alert Type"
              rules={[{ required: true, message: 'Please select alert type' }]}
            >
              <Select onChange={setSelectedType}>
                <Option value="realtime">Realtime</Option>
                <Option value="forecast">Forecast</Option>
              </Select>
            </Form.Item>
          </Col>
          {selectedType === 'forecast' && (
            <Col span={12}>
              <Form.Item
                name="timestep"
                label="Time Step"
                rules={[{ required: true, message: 'Please select time step' }]}
                tooltip="Required for forecast alerts"
              >
                <Select placeholder="Select time step">
                  <Option value="1h">Hourly</Option>
                  <Option value="1d">Daily</Option>
                </Select>
              </Form.Item>
            </Col>
          )}
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="parameter"
              label="Weather Parameter"
              rules={[{ required: true, message: 'Please select parameter' }]}
            >
              <Select onChange={setSelectedParameter}>
                {Object.entries(ALERT_PARAMETERS).map(([key, config]) => (
                  <Option key={key} value={key}>
                    {config.label} ({config.unit})
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="operator"
              label="Operator"
              rules={[{ required: true, message: 'Please select operator' }]}
            >
              <Select>
                <Option value=">">&gt;</Option>
                <Option value=">=">&gt;=</Option>
                <Option value="<">&lt;</Option>
                <Option value="<=">&lt;=</Option>
                <Option value="==">=</Option>
                <Option value="!=">!=</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="threshold"
              label={`Threshold (${parameterConfig.unit})`}
              rules={[
                { required: true, message: 'Please enter threshold' },
                {
                  type: 'number',
                  min: parameterConfig.min,
                  max: parameterConfig.max,
                  message: `Value must be between ${parameterConfig.min} and ${parameterConfig.max}`,
                },
              ]}
            >
              <InputNumber
                min={parameterConfig.min}
                max={parameterConfig.max}
                step={parameterConfig.step}
                style={{ width: '100%' }}
                placeholder={`${parameterConfig.min}-${parameterConfig.max}`}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item 
          label="Location"
          required
        >
          <div style={{ marginBottom: 16 }}>
            <Switch
              checked={useCurrentLocation}
              onChange={setUseCurrentLocation}
              checkedChildren="Current Location"
              unCheckedChildren="Custom Location"
            />
            {useCurrentLocation && location && (
              <div style={{ marginTop: 8, color: '#666' }}>
                <EnvironmentOutlined style={{ marginRight: 4 }} />
                <Text type="secondary">
                  {location.name} ({location.lat.toFixed(4)}, {location.lon.toFixed(4)})
                </Text>
              </div>
            )}
            {useCurrentLocation && !location && (
              <div style={{ marginTop: 8, color: '#ff4d4f' }}>
                <Text type="danger">Current location not available. Please use custom location.</Text>
              </div>
            )}
          </div>

          {!useCurrentLocation && (
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name={['location', 'lat']}
                  label="Latitude"
                  rules={[
                    { required: true, message: 'Required' },
                    { type: 'number', min: -90, max: 90, message: 'Invalid latitude' },
                  ]}
                >
                  <InputNumber
                    min={-90}
                    max={90}
                    step={0.0001}
                    placeholder="-90 to 90"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name={['location', 'lon']}
                  label="Longitude"
                  rules={[
                    { required: true, message: 'Required' },
                    { type: 'number', min: -180, max: 180, message: 'Invalid longitude' },
                  ]}
                >
                  <InputNumber
                    min={-180}
                    max={180}
                    step={0.0001}
                    placeholder="-180 to 180"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name={['location', 'city']}
                  label="City (Optional)"
                >
                  <Input placeholder="City name" />
                </Form.Item>
              </Col>
            </Row>
          )}
        </Form.Item>

        <Form.Item
          name="name"
          label="Alert Name"
          rules={[{ required: true, message: 'Please enter alert name' }]}
        >
          <Input placeholder="Give your alert a descriptive name" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter description' }]}
        >
          <TextArea
            rows={3}
            placeholder="Add any additional details about this alert"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};