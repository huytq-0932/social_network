import Table from "./Table";
import React, { RefObject } from "react";
import { withRouter, useRouter } from "next/router";
import useBaseHook from "@src/hooks/BaseHook";
import { MobileTable } from "./MobileTable";
const GridTableWithRouter = React.forwardRef((props: any, ref: any) => {
  const { getStore } = useBaseHook();
  const router = useRouter();
  let isMobile = getStore("isMobile");
  const {
    mobileTableProps = {},
    responsiveMobile = true,
    ...otherProps
  } = props;
  if (responsiveMobile == false) {
    return <Table ref={ref} router={router} {...otherProps} />;
  }

  return (
    <React.Fragment>
      {!isMobile ? (
        <Table
          ref={ref}
          router={router}
          {...otherProps}
        />
      ) : (
        <MobileTable
          {...mobileTableProps}
          {...otherProps}
        />
      )}
    </React.Fragment>
  );
}) as any;

GridTableWithRouter.getOptions = Table.getOptions;
GridTableWithRouter.getDataFromQuery = Table.getDataFromQuery;
GridTableWithRouter.makeQuery = Table.makeQuery;

const GridTableHelper = {
  getOptions: Table.getOptions,
  getDataFromQuery: Table.getDataFromQuery,
  makeQuery: Table.makeQuery,
};
export default GridTableWithRouter;
export { GridTableHelper };
