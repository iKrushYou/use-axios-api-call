import {axiosRequest, urlBuilderWithBase} from 'use-api-call'

const BASE_URL = "https://pokeapi.co/api/v2";

const methods = {
  GET: "GET",
  PUT: "PUT",
  POST: "POST",
  DELETE: "DELETE",
  PATCH: "PATCH"
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
