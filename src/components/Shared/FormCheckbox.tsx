import { FieldProps } from 'formik';
import { Checkbox, Form } from 'antd';
import React from 'react';

type CheckboxProps = {
  label: string;
};

const FormCheckbox = (props: FieldProps & CheckboxProps) => {
  const { label, field, meta } = props;
  const { value, ...fields } = field;

  return (
    <Form.Item valuePropName="checked">
      <Checkbox checked={value} {...fields} {...meta}>
        {label}
      </Checkbox>
    </Form.Item>
  );
};

export default FormCheckbox;
