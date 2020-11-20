import React, { useCallback, useRef, useState } from 'react'
import FormGroup from './FormGroup'

const IdentityGroup = () => {
  return <FormGroup id='identity' type='text' label='Email / Login' />
}

const PasswordGroup = () => {
  const [show, setShow] = useState(false)

  const toggleShow = useCallback(
    (e) => {
      e.preventDefault()
      setShow((c) => !c)
    },
    [show]
  )

  return (
    <FormGroup id='password' type={show ? 'text' : 'password'} label='Password'>
      <button onClick={toggleShow}>switch</button>
    </FormGroup>
  )
}

const SubmitGroup = () => {
  return <FormGroup id='submit_connection' type='submit' label='' />
}

const LoginForm = () => {
  const formRef = useRef()

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    const identityValue = formRef.current.identity.value
    const passwordValue = formRef.current.password.value
    console.log('identityValue : ', identityValue)
    console.log('passwordValue : ', passwordValue)
  }, [])

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <IdentityGroup />
      <PasswordGroup />
      <SubmitGroup />
    </form>
  )
}

export default LoginForm
