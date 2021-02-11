import { Alert } from 'antd';
import React from 'react';

import './FormErrors.scss';

type ErrorProps = {
  title: string;
  errors?: string[];
};

const FormErrors = (props: ErrorProps) => {
  let description: string = null;
  props.errors?.forEach((error) => {
    if (description === null) description = '- ' + error;
    else description += '\n- ' + error;
  });

  return <Alert message={props.title} description={description} type="error" showIcon closable className="alert" />;
};

export default FormErrors;
