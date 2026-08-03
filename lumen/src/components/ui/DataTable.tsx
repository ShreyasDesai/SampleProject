"use client";

import type { ReactNode } from "react";

export function DataTable({
  headers,
  children,
  maxHeight = 420,
}: {
  headers: string[];
  children: ReactNode;
  maxHeight?: number;
}) {
  return (
    <div className="table-wrap" style={{ maxHeight }}>
      <table className="data-table">
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
