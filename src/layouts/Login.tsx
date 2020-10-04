import React from 'react';
import Head from 'next/head';
import { Layout } from 'antd';
const { Header, Footer, Sider, Content } = Layout;


const Login = ({title, children}: {title?: string, children: any}) => {
  return (<Layout>
    <Head>
      <title>{title || ""}</title>
    </Head>
    <div id="login">
      <Content className="content">
        {children}
      </Content>
    </div>
  </Layout>
  );
}


export default Login;