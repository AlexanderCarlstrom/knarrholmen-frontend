import { Link as RouterLink, useHistory } from 'react-router-dom';
import { Form as FormikForm, Field, Formik } from 'formik';
import { Form, Button, Typography, message } from 'antd';
import React, { useState } from 'react';
import { AxiosError, AxiosResponse } from 'axios';
import 'antd/dist/antd.css';
import * as Yup from 'yup';

import { FormInput } from '../Shared/FormInput/FormInput';
import FormErrors from '../Shared/FormErrors/FormErrors';
import { ApiResponse } from '../../types/ApiReponse';
import { useAuth } from '../../context/AuthContext';
import './Auth.scss';

const { Text, Link } = Typography;

type FormValues = {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
};

const nameRegex = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;

const SignUpSchema = Yup.object().shape({
  firstName: Yup.string()
    .max(25, 'Please enter a shorter first name')
    .matches(nameRegex, 'Please enter a valid first name')
    .required('Please enter a first name'),
  lastName: Yup.string()
    .max(25, 'Please enter a shorter last name')
    .matches(nameRegex, 'Please enter a valid last name')
    .notRequired(),
  email: Yup.string().email('Please enter a valid email address').required('Please enter your email address'),
  password: Yup.string()
    .min(6, 'Your password must be at least 6 characters long')
    .max(255, 'Your password cannot be longer than 255 characters')
    .matches(/\d/, 'Your password must contain at least one number')
    .matches(/[A-ZÅÄÖ]/, 'Your password must contain at least one uppercase letter')
    .matches(/[a-zåäö]/, 'Your password must contain at least one lowercase letter')
    .matches(/[!@#$%^&*]/, 'Your password must contain at least one special character')
    .required('Please enter your password'),
  repeatPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

const InitialValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  repeatPassword: '',
};

const SignUp = () => {
  const [showErrors, setShowErrors] = useState(false);
  const [errorTitle, setErrorTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const history = useHistory();
  const { signUp } = useAuth();

  const submit = (credentials: FormValues) => {
    setErrorValues('', false);
    setLoading(true);

    signUp(credentials)
      .then((response: AxiosResponse<ApiResponse>) => {
        if (response.data.success) {
          message.success('Successfully registered user');
          setTimeout(() => history.push('/auth/login'), 700);
        } else {
          setErrorValues(response.data.message, true, response.data.errors);
        }
        setLoading(false);
      })
      .catch((error: AxiosError) => {
        setLoading(false);
        const res: ApiResponse = error.response.data;
        setErrorValues(res.message, true, res.errors);
      });
  };

  const setErrorValues = (title: string, show: boolean, errors: string[] = []) => {
    if (!title) title = 'Could not register user, please try again later';
    setErrorTitle(title);
    setErrors(errors);
    setShowErrors(show);
  };

  return (
    <>
      <h3 className="title">Sign Up</h3>
      <Text className="link-text">
        {'Already have an account?'}{' '}
        <RouterLink to="/auth/sign-up" component={Link}>
          Log in here
        </RouterLink>
      </Text>
      <Formik initialValues={InitialValues} onSubmit={(values) => submit(values)} validationSchema={SignUpSchema}>
        {(props) => (
          <FormikForm className="form">
            {showErrors && <FormErrors title={errorTitle} errors={errors} />}
            <div className="name-fields">
              <Field
                name="firstName"
                placeholder="First name"
                label="First name"
                size="large"
                className="name-field"
                component={FormInput}
                required={true}
              />
              <Field
                name="lastName"
                placeholder="Last name"
                label="Last name"
                size="large"
                className="name-field"
                component={FormInput}
              />
            </div>
            <Field
              name="email"
              placeholder="Email address"
              label="Email address"
              size="large"
              component={FormInput}
              required={true}
            />
            <Field
              name="password"
              placeholder="Password"
              label="Password"
              inputType="password"
              size="large"
              component={FormInput}
              required={true}
            />
            <Field
              name="repeatPassword"
              placeholder="Repeat password"
              label="Repeat password"
              inputType="password"
              size="large"
              component={FormInput}
              required={true}
            />
            <Form.Item>
              <Button
                type="primary"
                size="large"
                shape="round"
                htmlType="submit"
                className="submit-btn"
                disabled={!props.isValid && !props.dirty}
                loading={loading}
              >
                SIGN UP
              </Button>
            </Form.Item>
          </FormikForm>
        )}
      </Formik>
    </>
  );
};

export default SignUp;
