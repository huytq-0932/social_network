import React, { useState, useEffect } from "react";
import { Layout, Drawer, BackTop, Row, Col, Typography } from "antd";
import dynamic from 'next/dynamic'

const Sidebar = dynamic(() => import('./admin/Sidebar'), { ssr: false })
const Header = dynamic(() => import('./admin/Header'), { ssr: false })
import {getRouteData} from '@src/helpers/routes'

const THEME = "light";
import useBaseHooks from "@src/hooks/BaseHook";
import Head from 'next/head';
import useSWR from 'swr'

import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

const { Title, Text } = Typography;

const { Content, Footer } = Layout;

const Admin = (props: any) => {
  const { router, t, setStore } = useBaseHooks();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const onCollapseChange = (value: boolean) => {
    setCollapsed(value);
  };
  const updateSize = () => {
    const mobile = window.innerWidth < 992;
    setIsMobile(mobile);
    setStore("isMobile", mobile);
    setCollapsed(false);
  };

  useEffect(() => {});

  useEffect(() => {
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const getRouteName = async () => {
    const routePath = router.pathname;
    const routeData: any = await getRouteData();
    for (let routeName in routeData) {
      let routeElement = routeData[routeName];
      if (!routeElement.action) continue;
      if (routeElement.action.substr(5) === routePath) return routeName;
    }
  };
  const { data: routeName, error } = useSWR("getRouteName", () =>  getRouteName());
  return (
  <React.Fragment>
    <Head>
      <title>{publicRuntimeConfig.SITE_NAME || ""}</title>
      <meta property="og:title" content={publicRuntimeConfig.TITLE || ""} />
      <meta property="og:description" content={publicRuntimeConfig.DESCRIPTION || ""}/>
      <meta property="og:image" content={publicRuntimeConfig.LOGO} />
      <link rel="apple-touch-icon" href={publicRuntimeConfig.LOGO_IOS}></link>
    </Head>
    <div id="admin">
      <Layout hasSider={true}>
        {isMobile ? (
          <Drawer
            maskClosable
            closable={false}
            destroyOnClose={true}
            onClose={() => onCollapseChange(false)}
            visible={collapsed}
            placement="left"
            bodyStyle={{
              padding: 0,
              height: "100vh",
            }}
          >
            <Sidebar
              className="slider"
              collapsed={false}
              onCollapseChange={onCollapseChange}
              theme={THEME}
              isMobile={isMobile}
            />
          </Drawer>
        ) : (
          <Sidebar
            className="slider"
            collapsed={collapsed}
            onCollapseChange={onCollapseChange}
            theme={THEME}
            isMobile={isMobile}
          />
        )}

        <Layout>
          <div id="primaryLayout"></div>

          <Content className={`main-layout ${collapsed ? "collapsed" : ""}`}>
            <Header collapsed={collapsed} onCollapseChange={onCollapseChange} />
            <div className="breadcumbs">
              <Row>
                <Col xs={24} lg={12} xl={15}>
                  <Title level={4}>
                    {props.title ||
                      t(
                        `pages:${(routeName || "").replace(
                          "frontend.admin.",
                          ""
                        )}.title`
                      )}
                  </Title>
                  <Text>
                    {props.description ||
                      t(
                        `pages:${(routeName || "").replace(
                          "frontend.admin.",
                          ""
                        )}.description`
                      )}
                  </Text>
                </Col>
                <Col xs={24} lg={12} xl={9}>
                  <div className="breadcumb-right">
                    {/* <BreadCrumb /> */}
                  </div>
                </Col>
              </Row>
            </div>
            {props.children}
          </Content>
          <Footer className="footer">© 2020 NgocHip.Net</Footer>
          <BackTop
            className={"backTop"}
            target={() =>
              document.querySelector("#primaryLayout") as HTMLElement
            }
          />
        </Layout>
      </Layout>
    </div>
  </React.Fragment>

)};
export default Admin;
