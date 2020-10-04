
import React, { Fragment } from 'react';
import { Menu } from 'antd';
const { SubMenu } = Menu
import sidebar from './slidebar.config'
import useBaseHook from '@src/hooks/BaseHook'
import usePermissionHook from '@src/hooks/PermissionHook'
import useSWR from 'swr'
import settingService from '@src/services/settingService'
import { makeUrl, getSidebarSelecteds } from '@src/helpers/routes'

const MenuComponent = (props: any) => {
    const { theme, onCollapseChange, isMobile, tReady, ...otherProps } = props
    const { router, t, redirect } = useBaseHook({ lang: ['menu'] })
    const { checkPermission } = usePermissionHook()
    
    let { data: routeData, error } = useSWR(['/api/v1/settings','routeData'], () => settingService().withAuth().getRouteData())
    const getRouteName = () => {
        const routePath = router.pathname
        //const routeData: any = {}
        for (let routeName in routeData) {
            let routeElement = routeData[routeName]
            if (!routeElement.action) continue;
            if (routeElement.action.substr(5) === routePath) return routeName
        }
    }
    const currentRouteName = getRouteName()
    const { data: breadcums, error: error1 } =  useSWR(['getSidebarSelecteds', JSON.stringify(routeData),  currentRouteName], () => getSidebarSelecteds(currentRouteName, routeData))
    
    
    const generateMenus = (data: any) => {
        return data.map((item: any) => {
            if (item.children) {
                if (item.type === "group") {
                    let children = generateMenus(item.children)
                    if (!children.length) return;
                    return (
                        <Menu.ItemGroup
                            key={item.routeName}
                            title={
                                <Fragment>
                                    {item.icon ? item.icon : ''}
                                    <span>{t(item.routeName)}</span>
                                </Fragment>
                            }
                        >
                            {children}
                        </Menu.ItemGroup>
                    );
                }
                else {
                    let children = generateMenus(item.children)
                    if (!children.length) return;
                    return (
                        <SubMenu
                            key={item.routeName}
                            title={
                                <Fragment>
                                    {item.icon ? item.icon : ''}
                                    <span>{t(item.routeName)}</span>
                                </Fragment>
                            }
                        >
                            {children}
                        </SubMenu>
                    );
                }
            }


            if (!checkPermission(item.permissions)) return
            return (
                <Menu.Item key={item.routeName} onClick={() => redirect(item.routeName)}
                >
                    {item.icon ? item.icon : ''}
                    <span>{t(item.routeName)}</span>
                </Menu.Item>
            );
        }).filter((menu: any) => menu);
    }

    if (!breadcums && !routeData) return <></>
    
    let routerNames = (breadcums || []).map((breadcum: any) => breadcum.routeName)
    const selectedKeys = routerNames.pop()

    return <Menu
        mode="inline"
        theme={theme}
        defaultOpenKeys={routerNames}
        selectedKeys={selectedKeys}
        onClick={
            isMobile
                ? () => {
                    onCollapseChange(true)
                }
                : undefined
        }
        {...otherProps}
    >
        {generateMenus(sidebar)}
    </Menu>
}

export default MenuComponent