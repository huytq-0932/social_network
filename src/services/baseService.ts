import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

import auth, { AuthInterface } from '@src/helpers/auth'
class BaseService{
    auth: AuthInterface
    withAuth = (context?: any) => {
        this.auth = auth(context)
        return this
    }

    makeQuery(data = {}) {
        let query = [];
        for (let key in data) {
            if (Array.isArray(data[key])) {
                for (let value of data[key]) {
                    if(typeof value == "object") value = JSON.stringify(value)
                    query.push({key: `${key}[]`, value: value})
                }
            }
            else if (typeof data[key] == "object") {
                query.push({key: key, value: JSON.stringify(data[key])})
            }
            else {
                query.push({key: key, value: data[key]})
            }
        }    
        return query.map(q => `${q.key}=${q.value}`).join("&")
    }

    request = async ({ url, method, data, options }: { url: string, method: "GET" | "POST" | "PUT" | "DELETE", data?: any, options?: any }) => {
        if (["GET", "DELETE"].includes(method)) {
            url += "?" + this.makeQuery(data)
        }
        else {
            options = {
                ...options,
                body: JSON.stringify(data)
            }
        }
        let requestOptions = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            ...options
        };

        if (this.auth && this.auth.token) {
            requestOptions.headers['Authorization'] = `Bearer ${this.auth.token}`;
        }
        const result = await fetch(publicRuntimeConfig.API_HOST + url, requestOptions)
        return await this.handleResponse(result)
    }
    handleResponse = async (response) => {
        const text = await response.text();
        let data: any = {}
        try {
            data = text && JSON.parse(text);
        }
        catch (e) {
            console.log(e)
        }

        if (!response.ok) {
            if ([401].indexOf(response.status) !== -1) {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                //authenticationService.logout();
                auth().logout();
                location.href="/admin/login"
            }
            const error = data || (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data.data || data
    }
}

export default BaseService