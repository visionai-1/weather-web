import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  BellOutlined,
  DashboardOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import { StyledButton, StyledContent } from '@/components/common';

const { Header, Sider } = Layout;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const StyledHeader = styled(Header)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  background: #001529;
  color: white;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 ${({ theme }) => theme.spacing.md};
  }
`;

const Logo = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: white;
  margin-left: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 16px;
    margin-left: ${({ theme }) => theme.spacing.sm};
  }
`;

const CollapseButton = styled(StyledButton)`
  color: white;
  border: none;
  background: transparent;
  
  &:hover {
    color: #1890ff !important;
    background: rgba(255, 255, 255, 0.1) !important;
  }
`;

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();


  const menuItems = [
    {
      key: '/home',
      icon: <HomeOutlined />,
      label: 'Home',
    },
    {
      key: '/alerts',
      icon: <BellOutlined />,
      label: 'Alerts',
    },
    {
      key: '/current-state',
      icon: <DashboardOutlined />,
      label: 'Current State',
    },
  ];

  const handleMenuClick = (key: string) => {
    navigate(key);
  };

  return (
    <StyledLayout>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        theme="dark"
        width={250}
      >
        <Logo>
          {collapsed ? '⛈️' : '⛈️ Weather Alerts'}
        </Logo>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => handleMenuClick(key)}
          style={{ marginTop: 16 }}
        />
      </Sider>
      <Layout>
        <StyledHeader>
          <CollapseButton
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />
          <div style={{ color: 'white' }}>
            Weather Alerts Dashboard
          </div>
        </StyledHeader>
        <StyledContent style={{ background: '#fff' }}>
          <Outlet />
        </StyledContent>
      </Layout>
    </StyledLayout>
  );
};

export default AppLayout;