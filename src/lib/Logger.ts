import { AxiosError, AxiosResponse } from "axios";

class Logger {
  private debug: (message: string) => void;

  constructor(debug: (message: string) => void) {
    this.debug = debug;
  }

  logAxiosResponse(res: AxiosResponse) {
    this.debug(
      `${res.config.method} ${res.config.url} responded ${JSON.stringify(
        res.data
      )}`
    );
  }

   logAxiosError(error: AxiosError) {
    this.debug(
      `Error -> ${error.config.method} ${error.config.url} responded ${error.message}`
    );
  }

  logAxiosCall(method: string, url: string, params?: object){
    this.debug(
      `${method} ${url} with ${JSON.stringify(params)}`
    );
  }
}

export default Logger;