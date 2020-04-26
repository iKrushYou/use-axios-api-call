# use-axios-api-call

> Declarative API Call Hooks

[![NPM](https://img.shields.io/npm/v/use-axios-api-call.svg)](https://www.npmjs.com/package/use-axios-api-call) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
yarn add use-axios-api-call
```

## Usage

```jsx
import {useApiCall, axiosRequest} from 'use-axios-api-call'

function Example() {

  const {data: pokemonList, fetching: pokemonListLoading} = useApiCall(() => axiosRequest(
    {method: "GET", url: "https://pokeapi.co/api/v2/pokemon?limit=1000"}
  ), []);

  const [pokemonName, setPokemonName] = useState(null);

  const {data: pokemon, fetching: pokemonLoading} = useApiCall(() => axiosRequest(
      {method: "GET", url: `https://pokeapi.co/api/v2/pokemon/${pokemonName}`}
  ), [pokemonName]);

  //...
}
```

See `/examples` folder for more detailed implmementation

## Description

`use-axios-api-call` introduces a more declarative way of making GET API calls through axios.
What that means is you can easily fetch results from API based on your current state and display the results in minimal lines of code.
The library also adds a bunch of additional features as well such as automatic cancellation of requests, debouncing, and memoization (coming soon).

## API

### useApiCall
```jsx
import useApiCall from 'use-axios-api-call'
```
- `useApiCall(fetchFn, dependencies[, options]) => ({data, fetching, fetched, cancel, fetch})`
  - Parameters
    - `fetchFn`: `function` | Function that handles the actual API call. `useApiCall` expects function to return `{request, cancel}`. Wrapper function `axiosRequest` is provided for ease of use.
    - `dependencies`: `array` | Dependency array that determines when to re-fetch the data (similar to `useEffect` dependency array).
    - `options`: `object` | optional
      - `initialValue`: `any` | initial value to be returned by `data` before anything is fetched
      - `transform`: `function` | optional transformer for data to be returned `value => newValue`
      - `debounce`: `number` | time in ms to delay each call for debouncing (useful if your dependency array is related to user typing input).
      - `onCatch`: `function` | catch function passed to `.catch`
      - `onCancel` : `function` | function called when request is cancelled (normally would be thrown as an error)
      - `onFinally` : `function` | function called when request is completed (regardless of outcome).
  - Response
    - `data` : `any` | data returned from API call (and transform function).
    - `fetching` : `bool` | is API call in progress (initial value: `false`)
    - `fetched` : `bool` | has the data been successfully fetched (initial value: `false`)
    - `cancel` : `object` | cancel token
    - `fetch` : `function` | function to manually trigger a fetch

### axiosRequest
A simple wrapper around the `axios` function in order to inject a cancel token
```javascript
export default function axiosRequest({ ...config }) {
  let cancel = null

  const request = axios({
    ...config,
    cancelToken: new CancelToken((c) => (cancel = c))
  })

  return { request, cancel }
}
```

### urlBuilder
Helper function to easily create urls consisting of a `baseUrl`, `path`, and `params`
```javascript
import { urlBuilder } from 'use-axios-api-call';

urlBuilder({
  baseUrl: "https://pokeapi.co/api/v2",
  path: `/pokemon`,
  params: { limit: 1000 }
})
// https://pokeapi.co/api/v2/pokemon?limit=1000

const pokemonName = "pikachu";
urlBuilder({
  baseUrl: "https://pokeapi.co/api/v2",
  path: `/pokemon/${pokemonName}`,
})
// https://pokeapi.co/api/v2/pokemon/pikachu
```

## Step Further
Personally, I like to wrap up all of my api calls into a single hook called `useApiClient.js`

In here, I'll wrap all of the calls in an axios client that has interceptors for authorization headers, refresh tokens, etc.

Here's a simple example:

```javascript
// useApiClient.js
import {axiosRequest, urlBuilderWithBase} from 'use-axios-api-call'

const BASE_URL = "https://pokeapi.co/api/v2";

const methods = {
  GET: "GET",
  PUT: "PUT",
  POST: "POST",
  DELETE: "DELETE"
};

export default function useApiClient() {

  const urlBuilder = urlBuilderWithBase(BASE_URL);

  return {
    pokemon: {
      getAll: () => {
        const method = methods.GET;
        const url = urlBuilder({
          path: `/pokemon`,
          params: {
            limit: 1000
          }
        })

        return axiosRequest({
          method, url
        })
      },
      get: ({name}) => {
        const method = methods.GET;
        const url = urlBuilder({
          path: `/pokemon/${name}`
        })

        return axiosRequest({
          method, url
        })
      },
    }
  }
}
```

The usage of this plus `useApiCall` would look like this:

```javascript
const { data: allPokemon, fetching: fetchingAllPokemon, fetched: fetchedAllPokemon } = useApiCall(() => apiClient.pokemon.getAll(), [])

const { data: pokemon, fetching: fetchingPokemon, fetched: fetchedPokemon } = useApiCall(() =>
      pokemonName ? apiClient.pokemon.get({ name: pokemonName }) : null,
    [pokemonName]
  )
```

## License

MIT © [ikrushyou](https://github.com/ikrushyou)
