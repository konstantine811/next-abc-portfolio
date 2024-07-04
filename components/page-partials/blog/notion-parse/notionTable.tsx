"use client";

import { BlockObjectChild } from "@/@types/schema.notion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { useEffect, useState } from "react";

const parseTableData = (data: TableBlockObjectResponse & BlockObjectChild) => {
  const headers = (data.children[0] as any).table_row.cells.map(
    (cellArr: BlockObjectChild[]) => {
      return cellArr.map((i: any) => i.text.content).join(" ");
    }
  ) as string[];
  const rows = (data.children.slice(1) as any)?.map((row: BlockObjectChild[]) =>
    (row as any).table_row.cells.map((cellArr: BlockObjectChild[]) => {
      return cellArr.map((i: any) => i.text.content).join(" ");
    })
  ) as string[][];

  return { headers, rows };
};

interface Props {
  item: TableBlockObjectResponse & BlockObjectChild;
}

const NotionTable = ({ item }: Props) => {
  const [tableData, setTableData] = useState<{
    headers: string[];
    rows: string[][];
  }>({ headers: [], rows: [] });

  useEffect(() => {
    const parsedData = parseTableData(item);
    setTableData(parsedData);
  }, [item]);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {tableData.headers.map((header, index) => (
            <TableHead key={index}>{header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {tableData.rows.map((row, index) => (
          <TableRow key={index}>
            {row.map((cell, index) => (
              <TableCell key={index}>{cell}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default NotionTable;
