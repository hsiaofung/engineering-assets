export function pageQuery(
  event: PageChangeEvent,
  query: QueryParams
): QueryParams {
  return {
    ...query, // immutably copy the existing query parameters
    page: event.currentPage,
    perPage: event.pageSize,
  };
}