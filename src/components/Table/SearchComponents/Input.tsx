
import React from "react";
import Input from "./Input.jsx"
const InputRef = React.forwardRef((props: any, ref: any) => {
  const {
    ...otherProps
  } = props;
  return <Input ref={ref}{...otherProps} />
}) as any;
export default InputRef;
