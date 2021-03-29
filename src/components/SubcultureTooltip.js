import React from 'react';
import { Tooltip } from 'antd';

const SubcultureTooltip = props => {
  const { children } = props;

  return (
    <Tooltip {...props} trigger={typeof window.orientation !== 'undefined' ? 'focus' : props.trigger}>
      {children}
    </Tooltip>
  );
};

export default SubcultureTooltip;
