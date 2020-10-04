import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import I18n from "@libs/I18n";
import { useDispatch, useSelector } from "react-redux";
import { setStore as setStoreAction } from "@src/components/Redux/Store";
//import route from 'themes/route'
import _ from "lodash";
import { notification } from "antd";
import { makeUrl, getRouteData } from "@src/helpers/routes";

interface BaseBook {
  useSelector: Function;
  router: any;
  t: Function;
  setStore: Function;
  getStore: Function;
  redirect: Function;
  getData: Function;
  notify: Function;
  //getAuth: Function
  //getCookies: Function,
  //getPublicRuntimeConfig: Function,
  sprintf: Function;
}
const useBaseHooks = ({
  lang = ["common"],
}: { lang?: string[] } = {}): BaseBook => {
  const router = useRouter();
  const translatetion = I18n.useTranslation(lang);
  const dispatch = useDispatch();

  const setStore = async (path: string, value: any): Promise<any> => {
    return dispatch(setStoreAction(path, value));
  };

  const getStore = (path: string): any => {
    return useSelector((state: any) => _.get(state, path));
  };

  const redirect = async (
    url: string,
    query: any,
    shallow: boolean = false
  ) => {
    const routeData = await getRouteData();
    let nextRoute;
    try {
      nextRoute = makeUrl(url, query, routeData);
    } catch (e) {
      console.log(url);
      nextRoute = {
        href: url,
        as: url,
      };
    }

    router.push(nextRoute.href, nextRoute.as, {
      shallow,
    });
  };

  const getData = (
    obj: any,
    path: string,
    defaultValue: any = undefined
  ): any => {
    let value = _.get(obj, path, defaultValue);
    if (value == null) return defaultValue;
    return value;
  };

  const notify = (
    message: string,
    description: string = "",
    type: "success" | "error" | "warning" = "success"
  ): void => {
    notification[type]({
      message: message,
      description: description,
      duration: 4, //second
    });
  };

  const sprintf = (message: string, keys: any) => {
    const regexp = /{{([^{]+)}}/g;
    let result = message.replace(regexp, function (ignore, key) {
      return (key = keys[key]) == null ? "" : key;
    });
    return result;
  };

  /* const getAuth = (): any => {
        return useSelector((state: any) => state.auth)
    }
    const getCookies = (): any => {
        return useSelector((state: any) => state.cookies)
    }
    const getPublicRuntimeConfig = (): any => {
        return useSelector((state: any) => state.publicRuntimeConfig)
    } */

  return {
    useSelector,
    router,
    t: translatetion.t,
    setStore,
    getStore,
    redirect,
    getData,
    notify,
    //getAuth,
    //getCookies,
    //getPublicRuntimeConfig,
    sprintf,
  };
};

useBaseHooks.getData = (
  obj: any,
  path: string,
  defaultValue: any = undefined
): any => {
  let value = _.get(obj, path, defaultValue);
  if (value == null) return defaultValue;
  return value;
};

export default useBaseHooks;
