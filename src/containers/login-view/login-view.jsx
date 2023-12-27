import React, { useEffect, useState  } from 'react'

import { authService } from '../../services/auth/auth-service'
import Spinner from '../../components/spinner/spinner'

import logoBnppf from '../../static/bnppf_logo.png'
import logoFintro from '../../static/fintro_logo.png'
import logoHello from '../../static/hellobank_logo.png'

const LoginView = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [loginURL, setLoginURL] = useState()

  useEffect(() => {
    authService.login().subscribe(
      resp => {
        setLoginURL(resp)
        setIsLoading(false)
      },
      err => console.error(err)
    )
  }, [])

  const login = (brand) => {
    authService.selectBrand(brand)
    window.location = `${loginURL}&brand=${brand}`
  }

  const render = () => {
    if (isLoading) {
      return <Spinner text='loading data' />
    } else {
      return (
        <div>
          <div id='login-view-container'>
            <button onClick={() => login('bnppf')} style={{ backgroundImage: `url(${logoBnppf})` }}></button>
            <button onClick={() => login('hb')} style={{ backgroundImage: `url(${logoHello})` }}></button>
            <button onClick={() => login('fintro')} style={{ backgroundImage: `url(${logoFintro})` }}></button>
          </div>
          <p className='text'>This will redirect you to the authorization server of your organization</p>
        </div>
      )
    }
  }

  return render()
}

export default LoginView