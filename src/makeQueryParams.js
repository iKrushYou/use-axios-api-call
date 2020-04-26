const removeEmpty = (obj) => {
  if (!obj) return obj
  Object.keys(obj).forEach((key) => {
    if (obj[key] && typeof obj[key] === 'object') removeEmpty(obj[key])
    else if (obj[key] === undefined) delete obj[key]
  })
  return obj
}

const makeQueryParams = (params) => {
  const queryParams = new URLSearchParams(removeEmpty(params))
  return `?${queryParams}`
}

export default makeQueryParams
