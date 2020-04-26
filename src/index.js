import React from 'react'
import styles from './styles.module.css'
import axiosRequest from './axiosRequest'
import makeQueryParams from './makeQueryParams'
import useApiCall from './useApiCall'

const ExampleComponent = ({ text }) => {
  return <div className={styles.test}>Example Component: {text}</div>
}

const urlBuilder = ({ baseUrl, path, params }) => {
  return `${baseUrl}${path}${params ? makeQueryParams(params) : ''}`
}

const urlBuilderWithBase = (baseUrl) => ({ path, params }) => {
  return urlBuilder({ baseUrl, path, params })
}

export {
  ExampleComponent,
  axiosRequest,
  makeQueryParams,
  urlBuilder,
  useApiCall,
  urlBuilderWithBase
}
