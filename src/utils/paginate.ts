export interface PaginationResult {
  page: number;
  limit: number;
  skip: number;
  totalPages: number;
  totalItems: number;
}

export const paginate = (
  page: number = 1,
  limit: number = 10,
  totalItems: number = 0
): PaginationResult => {
  const safePage = Math.max(1, page);
  const safeLimit = Math.min(100, Math.max(1, limit));
  const skip = (safePage - 1) * safeLimit;
  const totalPages = Math.ceil(totalItems / safeLimit);

  return {
    page: safePage,
    limit: safeLimit,
    skip,
    totalPages,
    totalItems,
  };
};
