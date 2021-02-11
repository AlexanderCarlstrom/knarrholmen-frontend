import { Link as RouterLink, RouteComponentProps, useHistory } from 'react-router-dom';
import { Form as FormikForm, Field, Formik } from 'formik';
import { Form, Button, Typography, message } from 'antd';
import React, { useState } from 'react';
import { AxiosError, AxiosResponse } from 'axios';
import 'antd/dist/antd.css';
import * as Yup from 'yup';

import FormErrors from '../Shared/FormErrors/FormErrors';
import { FormInput } from '../Shared/FormInput/FormInput';
import { ApiResponse, UserResponse } from '../../types/ApiReponse';
import { useAuth } from '../../context/AuthContext';
import FormCheckbox from '../Shared/FormCheckbox';
import './Auth.scss';

const { Text, Link } = Typography;

type FormValues = {
  email: string;
  password: string;
  remember: boolean;
};

type LocationProps = { from: string };

const LogInSchema = Yup.object().shape({
  email: Yup.string().email('Please enter a valid email address').required('Please enter your email address'),
  password: Yup.string()
    .max(255, 'Your password cannot be longer than 255 characters')
    .required('Please enter your password'),
  remember: Yup.bool(),
});

const InitialValues = {
  email: '',
  password: '',
  remember: true,
};

const LogIn = ({ location }: RouteComponentProps<unknown, unknown, LocationProps>) => {
  const [loading, setLoading] = useState(false);
  const [errorTitle, setErrorTitle] = useState('');
  const [errors, setErrors] = useState([]);
  const [showErrors, setShowErrors] = useState(false);
  const history = useHistory();
  const { logIn, setUser } = useAuth();

  const submit = (credentials: FormValues) => {
    setErrorValues('', false);
    setLoading(true);

    logIn(credentials)
      .then((response: AxiosResponse<UserResponse>) => {
        const { data } = response;
        if (data.success) {
          setUser(data.user);
          message.success('Successfully logged in');
          setTimeout(() => history.push(location.state?.from ? location.state.from : '/'), 700);
        } else {
          setErrorValues(data.message, true, data.errors);
        }
        setLoading(false);
      })
      .catch((error: AxiosError) => {
        setLoading(false);
        const res: ApiResponse = error.response.data;
        setErrorValues(res.message, true, res.errors);
        return error;
      });
  };

  const setErrorValues = (title: string, show: boolean, errors: string[] = []) => {
    if (!title) title = 'Could not log in user, please try again later';
    setErrorTitle(title);
    setErrors(errors);
    setShowErrors(show);
  };

  return (
    <>
      <h3 className="title">Log In</h3>
      <Text className="link-text">
        {"Don't have an account?"}{' '}
        <RouterLink to="/auth/sign-up" component={Link}>
          Sign up here
        </RouterLink>
      </Text>
      <Formik initialValues={InitialValues} onSubmit={(values) => submit(values)} validationSchema={LogInSchema}>
        {(props) => (
          <FormikForm className="form">
            {showErrors && <FormErrors title={errorTitle} errors={errors} />}
            <Field name="email" placeholder="Email address" label="Email address" size="large" component={FormInput} />
            <Field
              name="password"
              placeholder="Password"
              label="Password"
              inputType="password"
              size="large"
              action={<Link>Forgot Password?</Link>}
              component={FormInput}
            />
            <Field name="remember" label="Keep me logged in" component={FormCheckbox} />
            <Form.Item>
              <Button
                type="primary"
                size="large"
                shape="round"
                htmlType="submit"
                className="submit-btn"
                disabled={!props.isValid}
                loading={loading}
              >
                LOG IN
              </Button>
            </Form.Item>
          </FormikForm>
        )}
      </Formik>
    </>
  );
};

export default LogIn;
