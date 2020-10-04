
import React, {useRef} from "react";
import Xlsx from './Xlsx'
import {CloudUploadOutlined} from "@ant-design/icons"
import { Button  } from 'antd';
const ImportExcel = ({
  getData
}) =>{
  const fileInput = useRef(null);
  const handleChange = async (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      let data = await Xlsx.readFileFromInput(files[0]);
      if (typeof getData === 'function') {
        if(Array.isArray(data)){
          data = data.map(row => {
           return row.map(cell => cell? String(cell) : cell);
          })
          data = data.filter(row => row.length !== 0);
        }
        getData(data);
      }
    }
  }
  return (
    <>
        <Button
          style={{ marginBottom: 10 }}
          onClick={() => fileInput.current.click()}>
          <CloudUploadOutlined/> Tải file excel
      </Button>
        <input
          ref={fileInput}
          onClick={(e) => e.target.value = null}
          type="file"
          hidden
          accept={SheetJSFT}
          onChange={handleChange}
        />
      </>
  )
}
export default ImportExcel;

const SheetJSFT = [
  "xlsx",
  "xlsb",
  "xlsm",
  "xls",
  "xml",
  "csv",
  "txt",
  "ods",
  "fods",
  "uos",
  "sylk",
  "dif",
  "dbf",
  "prn",
  "qpw",
  "123",
  "wb*",
  "wq*",
  "html",
  "htm"
]
  .map(function (x) {
    return "." + x;
  })
  .join(",");
