import React from 'react';
import ReactDOM from "react-dom/client";
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import App from './containers/app';
import './styles/main.scss'

const root = ReactDOM.createRoot(document.getElementById('app'))
root.render(
    <BrowserRouter>
    <App/>
</BrowserRouter>
)