import React from 'react'
import App from 'next/app'
import I18n from '@libs/I18n'
import wrapper from '@src/components/Redux'
import '@src/less/custom-ant-theme.less';
import '@src/less/vars.less';
import '@src/less/login.less'
import '@src/less/admin.less'

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props
    return (
      <Component {...pageProps} />
    )
  }
}

export default wrapper.withRedux(I18n.appWithTranslation(MyApp))