import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Header from '../Header';

// Layout Components Export
export { default as DashboardLayout } from './DashboardLayout';
export { default as Sidebar } from './Sidebar';
export { default as TopAppBar } from './TopAppBar';
export { default as PageContainer } from './PageContainer';
export { default as Breadcrumbs } from './Breadcrumbs';
export { default as Card } from './Card';

// Legacy Layout component for backward compatibility

const Layout = ({ onMenuSelect, children }) => {
  return (
    <Fragment>
      <Header onMenuSelect={onMenuSelect} />
      <main>{children}</main>
    </Fragment>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;
