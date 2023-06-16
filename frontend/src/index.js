import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// provider-eventually helps to allow the flow of data of store in our entire app
import { Provider } from "react-redux";
// importing store from ./store path
import store from './store';
import { positions, transitions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic"
const options = {
    timeout: 5000, // duration in whuch error stays
    position: positions.BOTTOM_CENTER, // position of error
    transition: transitions.SCALE // in what way does error come 
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <AlertProvider template={AlertTemplate} {...options}>
            <App />
        </AlertProvider >
    </Provider>
);


