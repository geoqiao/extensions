import { Country } from "../types";
import { pad2 } from "./pad";

/**
 * Format date with specified locale and options, displaying in target timezone
 * @param date - Date object
 * @param country - Country with timezone info
 * @param locale - Locale string (e.g., "zh-CN", "en-US")
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted result object
 */
export const formatDateTimeWithCountry = (
  date: Date,
  country: Country,
  locale: string,
  options: Intl.DateTimeFormatOptions,
): { name: string; value: string } => {
  const formatter = new Intl.DateTimeFormat(locale, {
    ...options,
    timeZone: country.ianaTimeZone,
  });

  return {
    name: `${country.name} Time (${country.timezoneName})`,
    value: formatter.format(date),
  };
};

/**
 * Format date as ISO 8601 with timezone offset
 * @param date - Date object
 * @param country - Country with timezone info
 * @returns Formatted result with offset
 */
export const formatISOWithOffset = (
  date: Date,
  country: Country,
): { name: string; value: string } => {
  // Get timezone offset for the country
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: country.ianaTimeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZoneName: "longOffset",
  });

  const parts = formatter.formatToParts(date);
  const getPart = (type: string) =>
    parts.find((p) => p.type === type)?.value || "";

  // Extract offset from timeZoneName part (e.g., "GMT-05:00" -> "-05:00")
  const offsetPart = parts.find((p) => p.type === "timeZoneName")?.value || "";
  const offset = offsetPart.replace("GMT", "");

  const year = getPart("year");
  const month = getPart("month");
  const day = getPart("day");
  const hour = getPart("hour");
  const minute = getPart("minute");
  const second = getPart("second");

  const value = `${year}-${month}-${day}T${hour}:${minute}:${second}${offset}`;

  return {
    name: `${country.name} Time (${country.timezoneName})`,
    value,
  };
};

/**
 * Format date as RFC 2822 format
 * @param date - Date object
 * @param country - Country with timezone info
 * @returns Formatted RFC 2822 string
 */
export const formatRFC2822 = (
  date: Date,
  country: Country,
): { name: string; value: string } => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: country.ianaTimeZone,
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZoneName: "short",
  });

  const parts = formatter.formatToParts(date);
  const getPart = (type: string) =>
    parts.find((p) => p.type === type)?.value || "";

  const weekday = getPart("weekday");
  const day = getPart("day");
  const month = getPart("month");
  const year = getPart("year");
  const hour = getPart("hour");
  const minute = getPart("minute");
  const second = getPart("second");

  // Get numeric offset
  const offsetFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: country.ianaTimeZone,
    timeZoneName: "longOffset",
  });
  const offsetParts = offsetFormatter.formatToParts(date);
  const offsetStr =
    offsetParts.find((p) => p.type === "timeZoneName")?.value || "";
  const offset = offsetStr.replace("GMT", "").replace(":", "");

  const value = `${weekday}, ${day} ${month} ${year} ${hour}:${minute}:${second} ${offset}`;

  return {
    name: `${country.name} Time (${country.timezoneName})`,
    value,
  };
};

/**
 * Convert Unix timestamp (seconds) to Date object
 * Automatically detects milliseconds and converts to seconds
 * @param unixTime - Unix timestamp (seconds or milliseconds)
 * @returns Date object
 */
export const getDateFromUnixTime = (unixTime: number | string): Date => {
  const num = typeof unixTime === "string" ? Number(unixTime) : unixTime;
  const strLen = num.toString().length;

  // 13+ digits = milliseconds, convert to seconds
  if (strLen >= 13) {
    return new Date(num);
  }
  return new Date(num * 1000);
};

/**
 * Convert local date in specified timezone to Unix timestamp (seconds)
 * @param year - Year
 * @param month - Month (1-12)
 * @param day - Day (1-31)
 * @param hour - Hour (0-23)
 * @param minute - Minute (0-59)
 * @param second - Second (0-59)
 * @param country - Country with timezone info
 * @returns Unix timestamp in seconds
 */
export const getUnixTimeFromLocalDate = (
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  country: Country,
): number => {
  // Create a date string in the target timezone
  const dateStr = `${year}-${pad2(month)}-${pad2(day)}T${pad2(hour)}:${pad2(minute)}:${pad2(second)}`;

  // Create date object - we need to handle timezone conversion
  // First, create a date assuming the input is in local time
  const localDate = new Date(dateStr);

  // Get the UTC time for this date in the target timezone
  // We'll use Intl.DateTimeFormat to get the components in the target timezone
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: country.ianaTimeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(localDate);
  const getPart = (type: string) =>
    parseInt(parts.find((p) => p.type === type)?.value || "0", 10);

  const tzYear = getPart("year");
  const tzMonth = getPart("month");
  const tzDay = getPart("day");
  const tzHour = getPart("hour");
  const tzMinute = getPart("minute");
  const tzSecond = getPart("second");

  // Create UTC date from these components
  const utcDate = Date.UTC(
    tzYear,
    tzMonth - 1,
    tzDay,
    tzHour,
    tzMinute,
    tzSecond,
  );

  return Math.floor(utcDate / 1000);
};

/**
 * Validate that input is a number
 * @param value - Input value
 * @returns Error message or undefined
 */
export const validateNumber = (
  value: string | undefined,
): string | undefined => {
  if (!value || value.trim() === "") {
    return "Required";
  }
  if (isNaN(Number(value))) {
    return "Must be a number";
  }
  return undefined;
};

/**
 * Get current Unix timestamp
 * @param unit - "seconds" or "milliseconds"
 * @returns Current timestamp
 */
export const getCurrentTimestamp = (
  unit: "seconds" | "milliseconds" = "seconds",
): number => {
  const now = Date.now();
  return unit === "seconds" ? Math.floor(now / 1000) : now;
};
