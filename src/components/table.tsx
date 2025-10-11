import React from "react";

export interface TableColumn<T> {
  key: string;
  header: string;
  render: (item: T, index: number) => React.ReactNode;
  renderSubRow?: (item: any, index: number) => React.ReactNode;
  className?: string;
  subRowClassName?: string;
  colSpan?: number;
  subRowColSpan?: number;
}

export interface TableRow<T> {
  data: T;
  subRows?: TableRow<any>[];
  className?: string;
}

interface TableProps<T> {
  title?: string;
  columns: TableColumn<T>[];
  rows: TableRow<T>[];
  pagination?: {
    currentPage: number;
    hasMore: boolean;
    onPrevious: () => void;
    onNext: () => void;
  };
  filter?: {
    placeholder: string;
    onFilter: (value: string) => void;
    filterRef?: React.RefObject<HTMLInputElement>;
  };
  footer?: React.ReactNode;
}

export default function Table<T>({
  title,
  columns,
  rows,
  pagination,
  filter,
  footer,
}: TableProps<T>) {
  const localFilterRef = React.useRef<HTMLInputElement>(null);
  const filterRef = filter?.filterRef || localFilterRef;

  const handleFilter = () => {
    if (filter && filterRef.current) {
      filter.onFilter(filterRef.current.value);
    }
  };

  return (
    <div className="text-start py-8 px-4 sm:px-6 lg:px-8">
      {title && <h3 className="text-neutral-100 text-xl">{title}</h3>}
      <div className="bg-neutral-100 overflow-clip my-4">
        <div className="flex flex-col">
          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="uppercase text-neutral-100 bg-slate-400 border-b-2 border-gray-500">
                    <tr>
                      {columns.map((column) => (
                        <th
                          key={column.key}
                          scope="col"
                          className="px-6 py-3 text-center text-xs font-medium"
                        >
                          {column.header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  {rows.map((row, rowIndex) => (
                    <tbody key={rowIndex} className="divide-y divide-gray-200">
                      {/* Main row */}
                      <tr
                        className={
                          row.className || "border-neutral-500 border-t-2"
                        }
                      >
                        {columns.map((column) => {
                          // Skip rendering if colSpan is 0
                          if (column.colSpan === 0) return null;
                          return (
                            <td
                              key={column.key}
                              className={
                                column.className ||
                                "text-start px-2 whitespace-nowrap text-sm text-gray-800"
                              }
                              colSpan={column.colSpan}
                            >
                              {column.render(row.data, rowIndex)}
                            </td>
                          );
                        })}
                      </tr>
                      {/* Sub-rows */}
                      {row.subRows?.map((subRow, subIndex) => (
                        <tr
                          key={`${rowIndex}-${subIndex}`}
                          className={subRow.className || "bg-neutral-100"}
                        >
                          {columns.map((column) => {
                            const effectiveColSpan =
                              column.subRowColSpan !== undefined
                                ? column.subRowColSpan
                                : column.colSpan;

                            // Skip rendering if colSpan is 0
                            if (effectiveColSpan === 0) return null;

                            return (
                              <td
                                key={column.key}
                                className={
                                  column.subRowClassName ||
                                  column.className ||
                                  "text-start px-2 whitespace-nowrap text-sm text-gray-800"
                                }
                                colSpan={effectiveColSpan}
                              >
                                {column.renderSubRow
                                  ? column.renderSubRow(subRow.data, subIndex)
                                  : column.render(subRow.data, subIndex)}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  ))}
                  {(filter || pagination || footer) && (
                    <tfoot>
                      <tr>
                        {filter && (
                          <td className="px-1 py-1">
                            <input
                              type="text"
                              ref={filterRef}
                              name="filter"
                              placeholder={filter.placeholder}
                              className="px-2 py-1 text-sm border border-gray-300 rounded-lg"
                            />
                            <button
                              type="submit"
                              className="ml-2 px-2 py-1 text-sm font-semibold rounded-lg border border-orange-400 text-orange-400 hover:border-orange-800 hover:text-orange-800"
                              onClick={handleFilter}
                            >
                              Submit
                            </button>
                          </td>
                        )}
                        {pagination && (
                          <td
                            colSpan={
                              filter ? columns.length - 1 : columns.length
                            }
                            className="text-end text-sm font-medium"
                          >
                            <button
                              className="w-12 p-1 text-sm font-semibold rounded-lg border border-transparent bg-white text-grey border-grey m-1 hover:bg-orange-200 disabled:bg-neutral-300"
                              onClick={pagination.onPrevious}
                              disabled={pagination.currentPage <= 0}
                            >
                              «
                            </button>
                            <button
                              className="w-12 p-1 text-sm font-semibold rounded-lg border border-transparent bg-white text-grey border-grey m-1 hover:bg-orange-200 disabled:bg-neutral-300"
                              onClick={pagination.onNext}
                              disabled={!pagination.hasMore}
                            >
                              »
                            </button>
                          </td>
                        )}
                        {!filter && !pagination && footer && (
                          <td colSpan={columns.length}>{footer}</td>
                        )}
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
