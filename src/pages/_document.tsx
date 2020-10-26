import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
    render() {
        return (
            <div>
    Cách chạy source: <br/>
    B1: mở thư mục code lên, gõ yarn để cài đặt (Nhớ cái nodejs làm môi trường trước)

    B2: <br/>
    - Chạy front thì gõ lệnh: yarn run dev-client
    - Chạy backend thì gõ lệnh yarn run dev-server <br/>
    B3: Nếu chưa có db thì tạo theo knex (chưa hiểu knex nhắn qua face t cho dễ) <br/>
    B4: dev :)))
     </div>
        );
    }
}

export default MyDocument;
