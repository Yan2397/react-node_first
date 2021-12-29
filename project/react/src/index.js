import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {createStore,applyMiddleware} from "redux";
import Root from "./store/rootReducer";
import { Provider } from 'react-redux';
// import thunk from 'redux-thunk';
import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './store/saga';





const saga=createSagaMiddleware();
// const mystore=createStore(Root,applyMiddleware(saga));
const mystore=createStore(Root,applyMiddleware(logger,saga));
// const mystore=createStore(Root,applyMiddleware(thunk));
saga.run(rootSaga);


ReactDOM.render(
  <Provider store={mystore}>
     <App />
  </Provider>,
  document.getElementById('root')
);

