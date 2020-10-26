"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const await_to_js_1 = __importDefault(require("await-to-js"));
const debug = require("debug")("mqcontroller");
const lodash_1 = __importDefault(require("lodash"));
const ApiException_1 = __importDefault(require("@app/Exceptions/ApiException"));
class BaseController {
    constructor() {
        this.isProductionEnv = process.env.NODE_ENV === "production";
        /*  if (!this.Model) {
                throw new Error("need implement Model")
            } */
    }
    sleep(min, max) {
        min = min * 1000;
        max = max * 1000;
        let random = Math.floor(Math.random() * (max - min + 1)) + min;
        return new Promise((resolve) => setTimeout(resolve, random));
    }
    // minM: số phút min truyền vào
    randomMsBetweenMinutes(minM, maxM) {
        minM = minM * 60000;
        maxM = maxM * 60000;
        let random = Math.floor(Math.random() * (maxM - minM + 1)) + minM;
        return random;
    }
    index() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = this.request.all();
            let result = yield this.Model.query().getForGridTable(data);
            return result;
        });
    }
    detail({ allowFields = "*" }) {
        return __awaiter(this, void 0, void 0, function* () {
            let params = this.request.all();
            let id = params.id;
            if (!id)
                throw new ApiException_1.default(9996, "ID is required!");
            let result = yield this.Model.query().findById(id, allowFields);
            if (!result) {
                throw new ApiException_1.default(7002, "Data not found");
            }
            return result;
        });
    }
    store({ allowFields = {} } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            let inputs = this.request.all();
            let data = this.validate(inputs, allowFields, { removeNotAllow: true });
            return yield this.Model.query().insert(data);
        });
    }
    update({ allowFields = {} } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            let inputs = this.request.all();
            let data = this.validate(inputs, allowFields, { removeNotAllow: true });
            let id = data.id;
            delete data.id;
            return yield this.Model.query().patchAndFetchById(id, data);
        });
    }
    destroy() {
        return __awaiter(this, void 0, void 0, function* () {
            let params = this.request.all();
            let id = params.id;
            if (!id)
                throw new ApiException_1.default(9996, "ID is required!");
            let [err, rs] = yield await_to_js_1.default(this.Model.query().deleteById(id));
            if (err)
                throw new ApiException_1.default(9995, err.message);
            return { message: `Delete successfully: ${rs} record` };
        });
    }
    delete({ request, response }) {
        return __awaiter(this, void 0, void 0, function* () {
            let { ids = [] } = this.request.all();
            if (!ids || !Array.isArray(ids))
                throw new ApiException_1.default(9996, "ID is required. Expected: Array!");
            yield this.Model.query().where("id", "in", ids).delete();
            return true;
        });
    }
    getData(object, path, defaultValue) {
        return lodash_1.default.get(object, path, defaultValue);
    }
    /**
     * Kiểm tra tính hợp lệ của dữ liệu client gửi vào API.
     * @param {object} data dữ liệu từ client gửi lên
     * @param {object} allowFields object các field và kiểu dữ liệu mà api chấp nhận
     * @param {object}
     *          {boolean} removeNotAllow xóa các trường không có trong allowFields, default: false
     */
    validate(data, allowFields, options) {
        options = options || { removeNotAllow: false };
        let result = this.validateFields(data, allowFields, options.removeNotAllow);
        if (result.error) {
            throw new ApiException_1.default(9996, result.message);
        }
        return result === null || result === void 0 ? void 0 : result.data;
    }
    validateError(errorType, data) {
        let message = "unknown";
        switch (errorType) {
            case "Invalid Type":
                message = `Datatype of ${data.path} is incorrect. Expected: ${data.typeOfField} but got: ${data.realType}`;
                break;
            case "required":
                message = `${data.path} is required. But not found.`;
        }
        return {
            error: true,
            message: message,
        };
    }
    validateFields(data, allowFields = {}, removeNotAllow = true, path = "", newData = null) {
        debug("path: ", path);
        debug("data: ", data);
        debug("allowFields: ", allowFields);
        let result = {
            error: false,
            message: "OK",
            data: undefined,
        };
        let root = false;
        if (newData == null) {
            root = true;
            newData = removeNotAllow ? {} : data;
        }
        if (typeof allowFields == "string") {
            debug("type is string...");
            let typeOfField = allowFields;
            let isRequired = typeOfField.indexOf("!") !== -1; //kiểm tra dấu ! ở cuối là bắt buộc
            typeOfField = typeOfField.replace(/\!/, ""); //tách lấy kiểu dữ liệu mong muốn
            let isExists = data != null && data !== "";
            if (path[path.length - 1] == ".")
                path = path.substring(0, path.length - 1);
            if (isRequired && !isExists) {
                //nếu field là bắt buộc như lại không tồn tại trong data.
                let error = this.validateError("required", {
                    path,
                });
                debug(error.message);
                return error;
            }
            else if (isExists) {
                let realType = typeof data;
                let typeAllowed = realType == typeOfField;
                //nếu không đúng kiểu dữ liệu mong muốn, thì cố gắng convert về đúng kiểu.
                if (!typeAllowed) {
                    if (typeOfField == "any") {
                        typeAllowed = true;
                    }
                    else if (typeOfField == "number") {
                        typeAllowed = !isNaN(data);
                        if (typeAllowed)
                            lodash_1.default.set(newData, path, Number(data));
                    }
                    else if (typeOfField == "boolean") {
                        if (typeof data == "string")
                            data = data.toLowerCase();
                        typeAllowed = [
                            "true",
                            "false",
                            "1",
                            "0",
                            1,
                            0,
                            true,
                            false,
                        ].includes(data);
                        if (typeAllowed)
                            lodash_1.default.set(newData, path, ["true", "1", 1, true].includes(data));
                    }
                    else if (typeOfField == "date" || typeOfField == "moment") {
                        typeAllowed = new Date(data).toString() != "Invalid Date";
                        if (typeAllowed)
                            lodash_1.default.set(newData, path, new Date(data));
                    }
                    else if (typeOfField == "string") {
                        lodash_1.default.set(newData, path, String(data));
                    }
                }
                else {
                    lodash_1.default.set(newData, path, data);
                }
                debug({ typeOfField, realType, typeAllowed });
                if (!typeAllowed) {
                    return this.validateError("Invalid Type", {
                        path,
                        typeOfField,
                        realType,
                    });
                }
            }
            else {
                lodash_1.default.unset(newData, path);
            }
        }
        else {
            //duyệt các key của object.
            for (let fieldName in allowFields) {
                let typeOfField = allowFields[fieldName];
                let fieldValue = data ? data[fieldName] : undefined;
                debug("Loop for check:", fieldName);
                debug("data: ", fieldValue);
                debug("allowFields", allowFields[fieldName]);
                //kiểm tra nếu là array thì đệ quy tiếp vào các element để check
                if (Array.isArray(typeOfField)) {
                    if (Array.isArray(fieldValue)) {
                        debug("case 1: check array:");
                        if (fieldValue.length === 0) {
                            if (typeof typeOfField[0] === "object") {
                                fieldValue.push({});
                            }
                            else if (typeOfField[0].indexOf("!") !== -1) {
                                debug("element is required but array empty");
                                return this.validateError("required", {
                                    path: `${path}${fieldName}`,
                                });
                            }
                        }
                        for (let i in fieldValue) {
                            result = this.validateFields(fieldValue[i], typeOfField[0], removeNotAllow, `${path}${fieldName}.${i}.`, newData);
                            if (result.error)
                                return result;
                        }
                    }
                    else {
                        debug("case 2: check array but data is not array");
                        if (fieldValue == undefined) {
                            //return this.validateError("required",{path: `${path}${fieldName}`})
                            result = this.validateFields(fieldValue, typeOfField[0], removeNotAllow, `${path}${fieldName}[0].`);
                        }
                        else {
                            return this.validateError("Invalid Type", {
                                path: `${path}${fieldName}`,
                                typeOfField: "array",
                                realType: typeof fieldValue,
                            });
                        }
                        //result = this.validateFields(fieldValue, typeOfField[0], `${path}${fieldName}[0].`)
                    }
                }
                else if (typeof typeOfField == "object") {
                    //nếu là là object thì đệ quy vào trong để check tiếp
                    debug("case 3: check object:");
                    result = this.validateFields(fieldValue, typeOfField, removeNotAllow, `${path}${fieldName}.`, newData);
                }
                else {
                    //nếu là string thì đệ quy để nhảy vào check các phần tử lá
                    debug("case 4: check type is string:");
                    result = this.validateFields(fieldValue, typeOfField, removeNotAllow, `${path}${fieldName}`, newData);
                }
                if (result.error) {
                    return result;
                }
                else {
                    result = Object.assign(Object.assign({}, result), { data: Object.assign({}, result.data) });
                }
            }
        }
        if (root) {
            return Object.assign(Object.assign({}, result), { data: newData });
        }
        return result;
    }
}
exports.default = BaseController;
