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
            <button onClick={this.login.bind(this, 'bnppf')} style={{backgroundImage: "url('./assets/bnppf_logo.png')"}}></button>
            <button onClick={this.login.bind(this, 'hb')}  style={{backgroundImage: "url('./assets/hellobank_logo.png')"}}></button>
            <button onClick={this.login.bind(this, 'fintro')}  style={{backgroundImage: "url('./assets/fintro_logo.png')"}}></button>
          </div>
          <p className='text'>This will redirect you to the authorization server of your organization</p>
        </div>
      )
    }
  }
}

