import Exception from "@core/Exception";
const CODE_MESSAGE = {
  "1000": "OK",
  "9992": "Post is not existed",
  "9993": "Code verify is incorrect",
  "9994": "No Data or end of list data",
  "9995": "User is not validated",
  "9996": "User existed",
  "9997": "Method is invalid",
  "9998": "Token is invalid",
  "9999": "Exception error",
  "1001": "Can not connect to DB",
  "1002": "Parameter is not enough",
  "1003": "Parameter type is invalid",
  "1004": "Parameter value is invalid",
  "1005": "Unknown error",
  "1006": "File size is too big",
  "1007": "Upload File Failed!",
  "1008": "Maximum number of images",
  "1009": "Not access",
  "1010": "Action has been done previously by this user"
};
class ApiException extends Exception {
  constructor(code: number | string = "", message = "", data?) {
    let _message = CODE_MESSAGE[code];
    let _code = code;
    if (!_message) {
      _code = "1005";
      _message = "Unknown error";
    }
    super(_code, _message, data, 400);
  }
}

export default ApiException;
