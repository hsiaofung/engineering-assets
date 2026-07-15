import { QueryParams } from '../models/query.model';
import { SortChangeEvent } from '../models/table.model';

export function sortQuery(
  event: SortChangeEvent,
  query: QueryParams
): QueryParams {
  return {
    ...query, //immutably copy the existing query parameters
    page: 1,
    sort: event.column ?? 'eventTime',
    direction: event.direction ?? 'desc',
  };
}
