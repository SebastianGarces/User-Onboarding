import React, { useEffect, useState } from 'react'
import axios from 'axios'
import * as yup from 'yup'
import { withFormik, Field, Form } from 'formik'
import styled from 'styled-components'

const OnboardingForm = ({ errors, status, touched, ...props }) => {
  // console.log('errors: ', errors, 'status: ', status, 'touched: ', touched)

  const [users, setUsers] = useState([])

  // console.log('user: ', user)
  // console.log(props)

  useEffect(() => {
    status && setUsers([...users, status])
  }, [status])

  console.log('status: ', status)
  console.log('user: ', users)

  return (
    <>
      <StyledForm>
        <Form>
          <div className="input-container">
            <label htmlFor="name">Name</label>
            <Field
              type="text"
              name="name"
              id="name"
              placeholder="type your name"
            />
            {touched.name && errors.name && (
              <p className="error">{errors.name}</p>
            )}
          </div>
          <div className="input-container">
            <label htmlFor="email">Email</label>
            <Field
              type="email"
              name="email"
              id="email"
              placeholder="type your email"
            />
            {touched.email && errors.email && (
              <p className="error">{errors.email}</p>
            )}
          </div>
          <div className="input-container">
            <label htmlFor="password">Password</label>
            <Field
              type="password"
              name="password"
              placeholder="type your password"
              id="password"
            />
          </div>
          {touched.password && errors.password && (
            <p className="error">{errors.password}</p>
          )}
          <div className="input-container">
            <label>
              <Field type="checkbox" name="tos" />
              Term of Services
            </label>
            {touched.tos && errors.tos && <p className="error">{errors.tos}</p>}
          </div>
          <button type="submit">Submit</button>
        </Form>
      </StyledForm>
      <StyledNewUsers>
        <h2>New Users: </h2>
        <StyledCardContainer>
          {users.map(user => {
            return (
              <StyledUserCard key={user.id}>
                <h3>{user.name}</h3>
                <p>{user.email}</p>
                <p>{user.tos ? 'Accepted TOS' : ''}</p>
              </StyledUserCard>
            )
          })}
        </StyledCardContainer>
      </StyledNewUsers>
    </>
  )
}

const StyledForm = styled.div`
  margin: 0 auto;
  width: 300px;

  form {
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;

    .input-container {
      margin: 0.5rem 0;
      display: flex;
      flex-direction: column;

      input {
        padding: 0.5rem;
      }
    }

    .error {
      margin: 0.2rem 0;
      color: red;
      border: 1px solid red;
      padding: 0.1rem;
      font-size: 0.8rem;
      padding: 0.2rem 0.5rem;
    }

    button {
      width: 100px;
      margin: 1rem 0;
    }
  }
`

const StyledUserCard = styled.div`
  padding: 0.5rem;
  border: 1px solid #333;
  margin: 1rem;
`

const StyledNewUsers = styled.div`
  h2 {
    text-align: center;
  }
`

const StyledCardContainer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  flex-wrap: wrap;
`

const withFormikObj = {
  mapPropsToValues: ({ name, email, password, tos }) => ({
    name: name || '',
    email: email || '',
    password: password || '',
    tos: tos || false,
  }),
  validationSchema: yup.object().shape({
    name: yup
      .string()
      .min(3, 'Name is too short!')
      .max(15, 'Name is too long!')
      .required('Name is required'),
    email: yup
      .string()
      .email('Email not valid')
      .required('Email is required'),
    password: yup
      .string()
      .min(10, 'Password must be 10 characters or longer')
      .required('Password is required')
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        'Must contain 8 characters, one uppercase, one lowercase, one number and one special case character',
      ),
    tos: yup
      .bool()
      .required()
      .oneOf([true], 'Terms of Services are required'),
  }),
  handleSubmit: (values, { resetForm, setSubmitting, setStatus }) => {
    console.log('submitting!', values)
    axios
      .post('https://reqres.in/api/users/', values)
      .then(response => {
        console.log('response', response)
        setStatus(response.data)
        resetForm()
      })
      .catch(err => console.log(err.response))
  },
}

export default withFormik(withFormikObj)(OnboardingForm)
