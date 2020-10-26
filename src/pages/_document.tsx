import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
    render() {
        return (
            <div>
    Cách chạy source: <br/>
    B1: mở thư mục code lên, gõ yarn để cài đặt (Nhớ cái nodejs làm môi trường trước)<br/>

    B2: <br/>
    - Chạy front thì gõ lệnh: yarn run dev-client
    - Chạy backend thì gõ lệnh yarn run dev-server <br/>
    B3: Dùng db tạo online sẵn config vào ENV <br/>
    B4: dev :)))<br/>
    Ví dụ về api: <br/>
    <img src="https://i.imgur.com/pxjjt4d.png" alt="Girl in a jacket"/>

     </div>
        );
    }
}

export default MyDocument;
