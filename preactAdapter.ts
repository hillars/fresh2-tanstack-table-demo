import { useState } from "preact/hooks";

import {
  createTable,
  RowData,
  TableOptions,
  TableOptionsResolved,
} from "@tanstack/table-core";

export function flexRender<TProps extends object>(comp: any, props: TProps) {
  return typeof comp === "function" ? comp(props) : comp;
}

export function usePreactTable<TData extends RowData>(
  options: TableOptions<TData>,
) {
  const resolvedOptions: TableOptionsResolved<TData> = {
    state: {}, // Dummy state
    onStateChange: () => {}, // No-op
    renderFallbackValue: null,
    ...options,
  };

  // Create a new table and store it in state
  const [tableRef] = useState(() => ({
    current: createTable<TData>(resolvedOptions),
  }));

  // By default, manage table state here using the table's initial state
  const [state, setState] = useState(() => tableRef.current.initialState);

  // Compose the default state above with any user state
  tableRef.current.setOptions((prev) => ({
    ...prev,
    ...options,
    state: {
      ...state,
      ...options.state,
    },
    // Similarly, we'll maintain both our internal state and any user-provided state
    onStateChange: (updater) => {
      setState(updater);
      options.onStateChange?.(updater);
    },
  }));

  return tableRef.current;
}
