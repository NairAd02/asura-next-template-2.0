"use client";

import { useState, useCallback } from "react";
import { ItemCategoryFiltersDto } from "../types/item-category.types";

interface UseItemCategoryReportProps {
  filters?: ItemCategoryFiltersDto;
}

export function useItemCategoryReport({ filters: _filters = {} }: UseItemCategoryReportProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateReport = useCallback(
    async (reportFilters: ItemCategoryFiltersDto = {}) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/item-categories/report", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reportFilters),
        });

        if (!response.ok) {
          throw new Error("Failed to generate report");
        }

        // Get filename from Content-Disposition header
        const contentDisposition = response.headers.get("Content-Disposition");
        let filename = "item-categories-report.xlsx";
        if (contentDisposition) {
          const match = contentDisposition.match(/filename="(.+)"/);
          if (match && match[1]) {
            filename = match[1];
          }
        }

        // Create blob and download
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to generate report";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    generateReport,
    isLoading,
    error,
    reset,
  };
}
