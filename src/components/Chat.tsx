import React, {useEffect, useState} from "react";
import 'react-chat-elements/dist/main.css';

import dynamic from 'next/dynamic'
import { ChatItem } from 'react-chat-elements'

const ReactChatWidget = dynamic(() => import('react-chat-widget'),  { ssr: false })
import 'react-chat-widget/lib/styles.css';
const Chat = () => {
    return(  <div>
      <ChatItem
    avatar={'https://facebook.github.io/react/img/logo.svg'}
    alt={'Reactjs'}
    title={'Facebook'}
    subtitle={'What are you doing?'}
    date={new Date()}
    unread={0} />
    </div>)
}

export default Chat;
