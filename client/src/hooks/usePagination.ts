import { useState } from "react";
import useLocalStorage from "./useLocalStorage";

const usePagination = (key: string, defaultValue: number) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useLocalStorage(key, defaultValue);

  return { page, setPage, pageSize, setPageSize };
};
export default usePagination;
