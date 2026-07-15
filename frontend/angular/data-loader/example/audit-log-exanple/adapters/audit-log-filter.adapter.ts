import { TableParams } from '../models/audit-log.model'

/**
 * Removes all keys with `null` or `undefined` values from an object.
 * Useful for cleaning query parameters before sending to an API.
 * @param {TableParams} tableParams - The source object to filter.
 * @returns {TableParams} A new object with null/undefined values omitted.
 */
export function skipNull(tableParams: TableParams): TableParams {
  return Object.fromEntries(Object.entries(tableParams).filter(([, value]) => value != null)) as TableParams
}

/**
 * Transforms table parameters by converting an `eventTime` date range
 * (typically from a date picker) into `startTime` and `endTime` ISO strings.
 * @param {TableParams} tableParams - The original table/query parameters object.
 * @returns {TableParams} A new object with `eventTime` replaced by `startTime` and `endTime` (if valid).
 */
export function mapEventTimeToDateRange(tableParams: TableParams): TableParams {
  const { eventTime, ...rest } = tableParams
  const result = { ...rest }

  if (eventTime?.length === 2) {
    const [start, end] = eventTime
    const startDate = new Date(start)
    const endDate = new Date(end)

    result.startTime = startDate.toISOString()
    result.endTime = endDate.toISOString()
  }

  return result
}
