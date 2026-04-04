import { Country, Format } from "./types";
// Format utilities available for future format extensions:
// formatDateTimeWithCountry, formatISOWithOffset, formatRFC2822

/**
 * Supported countries/timezones
 */
export const countries: Country[] = [
  {
    id: "china",
    name: "China (Beijing/Shanghai)",
    ianaTimeZone: "Asia/Shanghai",
    timezoneName: "CST",
  },
  {
    id: "usa_ny",
    name: "USA (New York)",
    ianaTimeZone: "America/New_York",
    timezoneName: "EST/EDT",
  },
  {
    id: "usa_la",
    name: "USA (Los Angeles)",
    ianaTimeZone: "America/Los_Angeles",
    timezoneName: "PST/PDT",
  },
  {
    id: "poland",
    name: "Poland (Warsaw)",
    ianaTimeZone: "Europe/Warsaw",
    timezoneName: "CET/CEST",
  },
  {
    id: "indonesia",
    name: "Indonesia (Jakarta)",
    ianaTimeZone: "Asia/Jakarta",
    timezoneName: "WIB",
  },
  {
    id: "mexico",
    name: "Mexico (Mexico City)",
    ianaTimeZone: "America/Mexico_City",
    timezoneName: "CST/CDT",
  },
  {
    id: "philippines",
    name: "Philippines (Manila)",
    ianaTimeZone: "Asia/Manila",
    timezoneName: "PST",
  },
];

/**
 * Supported date formats
 *
 * To add new formats, create a new object with:
 * - id: unique identifier
 * - name: display name in dropdown
 * - format: function that returns { name, value }
 *
 * Example format functions available in ./utils/datetime.ts:
 * - formatDateTimeWithCountry(date, country, locale, options)
 * - formatISOWithOffset(date, country)
 * - formatRFC2822(date, country)
 */
export const formats: Format[] = [
  {
    id: "standard",
    name: "Standard (yyyy-MM-dd HH:mm:ss)",
    format: (date, country) => {
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
      const parts = formatter.formatToParts(date);
      const getPart = (type: string) =>
        parts.find((p) => p.type === type)?.value || "";
      const formatted = `${getPart("year")}-${getPart("month")}-${getPart("day")} ${getPart("hour")}:${getPart("minute")}:${getPart("second")}`;
      return {
        name: country.name,
        value: formatted,
      };
    },
  },
  // Add more formats here as needed. Examples:
  //
  // {
  //   id: "iso",
  //   name: "ISO 8601 (UTC)",
  //   format: (date, country) => ({
  //     name: country.name,
  //     value: date.toISOString(),
  //   }),
  // },
  //
  // {
  //   id: "us",
  //   name: "US Format",
  //   format: (date, country) =>
  //     formatDateTimeWithCountry(date, country, "en-US", {
  //       year: "numeric", month: "short", day: "numeric",
  //       hour: "numeric", minute: "2-digit", second: "2-digit",
  //       weekday: "short", hour12: true, timeZoneName: "short",
  //     }),
  // },
];
