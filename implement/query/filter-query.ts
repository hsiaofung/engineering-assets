export function filterQuery(
  filters: Partial<QueryParams>,
  query: QueryParams
): QueryParams {
  return {
    ...query, // immutably copy the existing query parameters
    ...filters,
    page: 1,
  };
}