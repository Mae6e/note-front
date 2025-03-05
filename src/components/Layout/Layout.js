import React from 'react';
import Wrapper from '../../hoc/Wrapper/Wrapper';

const Layout = (props) => {
  return (
    <Wrapper>
      <main>{props.children}</main>
    </Wrapper>
  );
};

export default Layout;
