import React, { useEffect, useMemo } from "react";
import { usePagination, useTable } from "react-table";
import { MinerInfo } from "../hooks/useMiningData";

interface Props {
  blocks: MinerInfo[];
  initialPageSize?: number;
}
export const Miners: React.FC<Props> = ({ blocks, initialPageSize }) => {
  const data = useMemo(() => blocks, [blocks]);
  const columns: any = useMemo(
    () => [
      {
        Header: "Address.",
        accessor: "stx_address", // accessor is the "key" in the data
      },
      {
        Header: "Total Fees",
        accessor: "total_burnfee",
      },
      {
        Header: "Total Participation",
        accessor: "total_participation",
      },
      {
        Header: "Total Reward",
        accessor: "total_block_reward",
      },
      {
        Header: "Total STX Reward",
        accessor: "total_stx_reward",
      },
    ],
    []
  );
  const tableInstance: any = useTable(
    {
      columns,
      data,
    },
    usePagination
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = tableInstance;
  console.log(tableInstance);

  useEffect(() => {
    setPageSize(initialPageSize || 5);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPageSize]);
  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup: any) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column: any) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row: any) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell: any) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pagination">
        <div>
          Showing
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[5, 10, 15, 20].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
          <p>items per page</p>
        </div>
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <div>
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {"First"}
          </button>{" "}
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {"Previous"}
          </button>{" "}
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            {"Next"}
          </button>{" "}
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            {"End"}
          </button>
        </div>
      </div>
    </>
  );
};