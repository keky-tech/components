"use client"

import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons"
import { Pagination, PaginationNextButton, PaginationPreviousButton, PaginationSelectors } from "@/registry/ui/pagination";

export default function PaginationDemo () {
  const [currentPage, setCurrentPage] = React.useState(1)
  return (
    <Pagination
      totalCount={47}
      pageSize={10}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      className="flex justify-between"
    >
      <PaginationPreviousButton size="sm">
        <ChevronLeftIcon />
        Previous
      </PaginationPreviousButton>
      <PaginationSelectors siblingCount={1} className="gap-2" />
      <PaginationNextButton size="sm">
        Next
        <ChevronRightIcon />
      </PaginationNextButton>
    </Pagination>
  )
}