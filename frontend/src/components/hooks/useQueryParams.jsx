import { useCallback } from "react";
import { useSearchParams } from "react-router";

export const useQueryParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const getParam = (key) => searchParams.get(key);
  const setParam = useCallback(
    (entries) => {
      const newParams = new URLSearchParams(searchParams);

      if (typeof entries === "object") {
        Object.entries(entries).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            newParams.set(key, value.toString());
          } else {
            newParams.delete(key);
          }
        });
      }

      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );
  const deleteParam = (key) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(key);
    setSearchParams(newParams);
  };

  return {
    getParam,
    setParam,
    deleteParam,
    setSearchParams,
    allParams: searchParams,
  };
};
