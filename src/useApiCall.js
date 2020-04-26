import { useEffect, useRef, useState } from 'react'
import uuidv4 from 'uuid4'
import axios from 'axios'
import PropTypes from 'prop-types'

const noop = () => {}
const noTransform = (data) => data

const useApiCall = (
  apiCall,
  dependencies = [],
  {
    transform = noTransform,
    onCatch = noop,
    onFinally = noop,
    onCancel = noop,
    debounce = 0,
    initialValue = null
  } = {}
) => {
  const [apiCallFn, setApiCallFn] = useState(apiCall)

  useEffect(() => {
    setApiCallFn(() => apiCall)
  }, [...dependencies])

  const uuid = useRef(uuidv4())
  const [data, setData] = useState(initialValue)
  const [fetching, setFetching] = useState(false)
  const [fetched, setFetched] = useState(false);
  const [cancel, setCancel] = useState(() => noop)
  const [delayed, setDelayedUuid] = useState({})

  const fetch = () => {
    // cancel old request if exists
    if (typeof cancel === 'function') {
      cancel()
    }

    // validate apiCall input is function
    if (typeof apiCallFn !== 'function') return

    const apiCallRes = apiCallFn()
    // if no response, exit
    if (!apiCallRes) return

    setFetching(true)
    const { request, cancel: cancelReq } = apiCallRes

    request
      .then((response) => {
        const data = transform(response.data)
        setData(data)
        setFetched(true)
        return data
      })
      .catch((e) => {
        if (axios.isCancel(e)) onCancel(e)
        else onCatch(e)
      })
      .finally(() => {
        setFetching(false)
        onFinally()
      })

    setCancel(() => cancelReq)

    return { request, cancel: cancelReq }
  }

  useEffect(() => {
    const newUuid = uuidv4()
    uuid.current = newUuid
    setDelayedUuid({ [newUuid]: true })
    setTimeout(() => {
      setDelayedUuid({ [newUuid]: false })
    }, debounce)
  }, [apiCallFn, debounce])

  useEffect(() => {
    if (delayed[uuid.current] === false) {
      return (fetch() || {}).cancel
    }
  }, [delayed])

  return { data, fetching, cancel, fetch, fetched }
}

useApiCall.propTypes = {
  apiCall: PropTypes.func.isRequired,
  dependencies: PropTypes.array.isRequired,
  options: PropTypes.shape({
    transform: PropTypes.func,
    onCatch: PropTypes.func,
    onError: PropTypes.func,
    onFinally: PropTypes.func,
    debounce: PropTypes.number,
    initialValue: PropTypes.any
  })
}

export default useApiCall
