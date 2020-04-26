import axios from 'axios'

const CancelToken = axios.CancelToken

export default function axiosRequest({ ...config }) {
  let cancel = null

  const request = axios({
    ...config,
    cancelToken: new CancelToken((c) => (cancel = c))
  })

  return { request, cancel }
}
