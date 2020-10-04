import UrlPattern from 'url-pattern';
import queryString from 'query-string';
import Router from 'next/router';
import settingService from '@src/services/settingService'
import auth from './auth'

export const getRouteData = async () => {
    if (typeof window != "undefined") {
        let { user } = auth()
        const key = `routeData-${user.id}`
        let routeData = localStorage.getItem(key)
        if (!routeData) {
            routeData = await settingService().withAuth().getRouteData()
            localStorage.setItem(key, JSON.stringify(routeData))
        }
        else {
            routeData = JSON.parse(routeData)
        }
        return routeData
    }
    return await settingService().withAuth().getRouteData()
}

export const makeUrl = (name, params, routeConfig) => {
    //const routeConfig = await getRouteData()
    console.log("routeConfig " + JSON.stringify(routeConfig));
    let routeInfo = routeConfig[name]
    if (!routeInfo) {
        //console.error(`Route ${name} not found`)
        throw Error(`Route ${name} not found`);
    }
    let pattern = new UrlPattern(routeInfo.url);
    let query = queryString.stringify(params)
    try {
        let asUrl = pattern.stringify(params) //link hiển thị trên trình duyệt
        let href = asUrl //link thật trong /pages
        if (routeInfo.action.substr(0, 6) === "pages/") {
            href = routeInfo.action.substr(5)
            if (href.indexOf('?') === -1) {
                href += `?${query}`
            } else {
                href += `&${query}`
            }
        }
        return {
            as: asUrl,
            href: href
        }

    } catch (e) {
        //console.error(e)
        throw e;
    }
}


export const addQuery = (query, shallow = true) => {
    if (!process.browser) return;
    let asPath = window.location.pathname
    let oldQuery = Router.router.query
    let queryObj = {
        ...oldQuery,
        ...query
    }
    if (JSON.stringify(queryObj) == JSON.stringify(oldQuery)) return;
    
    Router.push({
        pathname: Router.router.pathname,
        query: queryObj,
    }, {
        pathname: asPath,
        query: queryObj
    }, {
        shallow: shallow,
    })
}

export const getSidebarSelecteds = async (routeName, routes, routePaths = []) => {
    const routeConfig = await getRouteData()
    
    let sidebarSelectedName = routeConfig[routeName] ? routeConfig[routeName].sidebar : undefined
    //if (!routes) routes = sidebar
    for (let route of routes) {
        if (route.routeName === sidebarSelectedName) {
            routePaths.push(route)

            return routePaths
        } else if (route.children) {
            let result = getSidebarSelecteds(sidebarSelectedName, route.children, [...routePaths, route])
            if (result && result.length) return result
        }
    }
    return [];
}

export const getBreadcrumbs = async (routeName) => {
    const routeConfig = await getRouteData()
    let result = []
    const route = routeConfig[routeName] ? routeConfig[routeName] : undefined
    if (route) {
        result.unshift(route);

        if (route.parent) {
            result = [...this.getBreadcrumbs(route.parent), ...result]
        }
    }
    return result
}