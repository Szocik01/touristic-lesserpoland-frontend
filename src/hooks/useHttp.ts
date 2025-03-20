import { useCallback, useState } from "react";
import { SendRequestFunction } from "../types/utility";

export default function useHttp(url: string, initialLoadingState: boolean = false):[SendRequestFunction,boolean] {
  const [isLoading, setIsLoading] = useState(initialLoadingState);

  const  sendRequest =  useCallback(
    (
      handleResponse: (response: Response) => void = (response: Response) => {},
      handleError: (error: Error) => void = (error: Error) => {},
      requestOptions: (RequestInit) | undefined = {},
      urlParameters: string = ""
    ) => {
      setIsLoading(true);
      requestOptions = { method: "GET", ...requestOptions };
      return fetch(`${url}${urlParameters}`, requestOptions)
        .then((response) => {
          return handleResponse(response);
        })
        .catch((error) => {
          handleError(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [url]
  );

  return [sendRequest, isLoading];
}
