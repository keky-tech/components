import * as React from "react"

import { cn } from "@/lib/utils"
import { Button, ButtonProps } from "@/registry/ui/button"

interface PaginationProps {
  totalCount: number
  currentPage: number
  pageSize: number
  onPageChange?: (index: number) => void
}

interface PaginationSelectorsProps extends React.HTMLAttributes<HTMLDivElement> {
  siblingCount: number
  asChild?: boolean
  dotClassName?: string
  selectorClassName?: string
}

const DOTS = '...'

const PaginationContext = React.createContext<PaginationProps>({
  totalCount: 1,
  pageSize: 1,
  currentPage: 1
});

const usePagination = () => {
  const paginationContext = React.useContext(PaginationContext)

  if (!paginationContext) {
    throw new Error("usePagination should be used within <Pagination>")
  }

  return paginationContext
}


const Pagination = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & PaginationProps
>(({ className, totalCount, currentPage, pageSize, onPageChange, ...props }, ref) => {
    return (
      <PaginationContext.Provider value={{ totalCount, currentPage, pageSize, onPageChange }}>
        <div ref={ref} className={cn(className)} {...props} />
      </PaginationContext.Provider>
    )
})

Pagination.displayName = "Pagination"

const range = (start: number, end: number) => {
  let length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
}

const useSelectorRange = (totalCount: number, pageSize: number, siblingCount: number, currentPage: number) => {
  const selectorRange = React.useMemo(() => {
    const totalPageCount = Math.ceil(totalCount / pageSize);

    // Pages count is determined as siblingCount + firstPage + lastPage + currentPage + 2*DOTS
    const totalPageNumbers = siblingCount + 5;

    /*
      Case 1:
      If the number of pages is less than the page numbers we want to show in our
      paginationComponent, we return the range [1..totalPageCount]
    */
    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount);
    }
	
    /*
    	Calculate left and right sibling index and make sure they are within range 1 and totalPageCount
    */
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPageCount
    );

    /*
      We do not show dots just when there is just one page number to be inserted between the extremes of sibling and the page limits i.e 1 and totalPageCount. Hence we are using leftSiblingIndex > 2 and rightSiblingIndex < totalPageCount - 2
    */
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    /*
    	Case 2: No left dots to show, but rights dots to be shown
    */
    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = range(1, leftItemCount);

      return [...leftRange, DOTS, totalPageCount];
    }

    /*
    	Case 3: No right dots to show, but left dots to be shown
    */
    if (shouldShowLeftDots && !shouldShowRightDots) {
      
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = range(
        totalPageCount - rightItemCount + 1,
        totalPageCount
      );
      return [firstPageIndex, DOTS, ...rightRange];
    }
     
    /*
    	Case 4: Both left and right dots to be shown
    */
    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }
  }, [totalCount, pageSize, siblingCount, currentPage]);
  return selectorRange
}

const changePage = (page: number, onPageChange?: (page: number) => void) => {
  if (onPageChange) {
    onPageChange(page)
  }
}

const PaginationSelectors = React.forwardRef<HTMLDivElement, PaginationSelectorsProps>(
  ({ className, siblingCount, dotClassName, selectorClassName, ...props }, ref) => {
  const { totalCount, pageSize, currentPage, onPageChange } = usePagination()
  const range = useSelectorRange(totalCount, pageSize, siblingCount, currentPage)

  return (
    <div ref={ref} className={cn('flex', className)} {...props}>
      {range?.map((page, index) => {
        if (page === DOTS) {
          return <Button className={cn(dotClassName)} key={index} size="sm">&#8230;</Button>
        }
        return <Button
          disabled={currentPage === page}
          size="sm"
          className={cn(selectorClassName)}
          onClick={() => changePage(parseInt(`${page}`), onPageChange) }
          key={index}
        >
          {page}
        </Button>
      })}
    </div>
  )
})

PaginationSelectors.displayName = "PaginationSelectors"

const PaginationNextButton = (props: Omit<ButtonProps, 'onClick'>) => {
  const { totalCount, pageSize, currentPage, onPageChange } = usePagination()
  const lastPage = React.useMemo(
    () => Math.ceil(totalCount / pageSize),
    [pageSize, totalCount]
  )
  return (
    <Button
      onClick={() => changePage(currentPage + 1, onPageChange)}
      disabled={currentPage === lastPage}
      {...props}
    />
  )
}
PaginationNextButton.displayName = "PaginationNextButton"

const PaginationPreviousButton = (props: Omit<ButtonProps, 'onClick'>) => {
  const { currentPage, onPageChange } = usePagination()
  return (
    <Button
      onClick={() => changePage(currentPage - 1, onPageChange)}
      disabled={currentPage === 1}
      {...props}
    />
  )
}
PaginationPreviousButton.displayName = "PaginationPreviousButton"

const PaginationFirstButton = (props: Omit<ButtonProps, 'onClick'>) => {
  const { currentPage, onPageChange } = usePagination()
  return (
    <Button
      onClick={() => changePage(1, onPageChange)}
      disabled={currentPage === 1}
      {...props}
    />
  )
}
PaginationFirstButton.displayName = "PaginationFirstButton"

const PaginationLastButton = (props: Omit<ButtonProps, 'onClick'>) => {
  const { totalCount, pageSize, currentPage, onPageChange } = usePagination()
  const lastPage = React.useMemo(
    () => Math.ceil(totalCount / pageSize),
    [pageSize, totalCount]
  )
  return (
    <Button
      onClick={() => changePage(lastPage, onPageChange)}
      disabled={currentPage === lastPage}
      {...props}
    />
  )
}
PaginationLastButton.displayName = "PaginationLastButton"

export {
  Pagination,
  PaginationSelectors,
  PaginationNextButton,
  PaginationPreviousButton,
  PaginationFirstButton,
  PaginationLastButton
}
