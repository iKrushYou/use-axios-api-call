import axiosRequest from './axiosRequest'
import makeQueryParams from './makeQueryParams'
import useApiCall from './useApiCall'

const urlBuilder = ({ baseUrl, path, params }) => {
  return `${baseUrl}${path}${params ? makeQueryParams(params) : ''}`
}

const urlBuilderWithBase = (baseUrl) => ({ path, params }) => {
  return urlBuilder({ baseUrl, path, params })
}

export default useApiCall

export { axiosRequest, makeQueryParams, urlBuilder, urlBuilderWithBase }
