import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Header from '../Header';

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
