import * as React from 'react'

import { authService } from '../../services/auth/auth-service'
import Spinner from '../../components/spinner/spinner'

import '../../static/bnppf_logo.png';
import '../../static/fintro_logo.png';
import '../../static/hellobank_logo.png';

export default class LoginView extends React.Component {

  constructor () {
    super()
    this.state = {
      isLoading: true
    }
  }

  componentWillUnmount () {
    if (this.loginSub) this.loginSub.unsubscribe()
  }

  componentWillMount () {
    this.loginSub = authService.login().subscribe(
      resp => {
        this.loginURL = resp
        this.setState({ isLoading: false })
      },
      err => console.error(err)
    )
  }

  login (brand) {
    authService.selectBrand(brand)
    window.location = `${this.loginURL}&brand=${brand}`
  }

  render () {
    const { isLoading } = this.state
    if (isLoading) {
      return <Spinner text='loading data' />
    } else {
      return (
        <div>
          <div id='login-view-container'>
            <a><img src="./assets/bnppf_logo.png" alt="bnppf" onClick={this.login.bind(this, 'bnppf')} /></a>
            <img src="./assets/hellobank_logo.png" alt="hello" onClick={this.login.bind(this, 'hb')} />
            <img src="./assets/fintro_logo.png" alt="fintro" onClick={this.login.bind(this, 'fintro')} />
          </div>
          <p className='text'>This will redirect you to the authorization server of your organization</p>
        </div>
      )
    }
  }
}

