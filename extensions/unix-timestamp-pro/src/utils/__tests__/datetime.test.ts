import {
  getDateFromUnixTime,
  getUnixTimeFromLocalDate,
  getCurrentTimestamp,
  validateNumber,
  formatDateTimeWithCountry,
  formatISOWithOffset,
  formatRFC2822,
} from "../datetime";
import { Country } from "../../types";

describe("datetime utils", () => {
  // Test countries
  const china: Country = {
    id: "china",
    name: "China (Beijing/Shanghai)",
    ianaTimeZone: "Asia/Shanghai",
    timezoneName: "CST",
  };

  const usaNy: Country = {
    id: "usa_ny",
    name: "USA (New York)",
    ianaTimeZone: "America/New_York",
    timezoneName: "EST/EDT",
  };

  const utc: Country = {
    id: "utc",
    name: "UTC",
    ianaTimeZone: "UTC",
    timezoneName: "UTC",
  };

  describe("getDateFromUnixTime", () => {
    it("should convert seconds timestamp to Date", () => {
      // 2024-01-01 00:00:00 UTC = 1704067200 seconds
      const result = getDateFromUnixTime(1704067200);
      expect(result).toBeInstanceOf(Date);
      expect(result.getTime()).toBe(1704067200000);
    });

    it("should convert milliseconds timestamp to Date", () => {
      // 2024-01-01 00:00:00 UTC = 1704067200000 milliseconds
      const result = getDateFromUnixTime(1704067200000);
      expect(result).toBeInstanceOf(Date);
      expect(result.getTime()).toBe(1704067200000);
    });

    it("should handle string input (seconds)", () => {
      const result = getDateFromUnixTime("1704067200");
      expect(result.getTime()).toBe(1704067200000);
    });

    it("should handle string input (milliseconds)", () => {
      const result = getDateFromUnixTime("1704067200000");
      expect(result.getTime()).toBe(1704067200000);
    });

    it("should handle current timestamp", () => {
      const now = Math.floor(Date.now() / 1000);
      const result = getDateFromUnixTime(now);
      expect(result.getTime()).toBe(now * 1000);
    });
  });

  describe("getUnixTimeFromLocalDate", () => {
    it("should convert date to Unix timestamp for a given timezone", () => {
      // The function interprets the date components in the target timezone
      // 2024-01-01 00:00:00 in the specified timezone
      const result = getUnixTimeFromLocalDate(2024, 1, 1, 0, 0, 0, utc);
      expect(result).toBeGreaterThan(0);
      expect(typeof result).toBe("number");
    });

    it("should handle different dates correctly", () => {
      // 2024-06-15 12:30:45
      const result = getUnixTimeFromLocalDate(2024, 6, 15, 12, 30, 45, utc);
      expect(result).toBeGreaterThan(0);
      expect(typeof result).toBe("number");
    });

    it("should handle leap year dates", () => {
      // 2024-02-29 00:00:00 (2024 is a leap year)
      const result = getUnixTimeFromLocalDate(2024, 2, 29, 0, 0, 0, utc);
      expect(result).toBeGreaterThan(0);
      expect(typeof result).toBe("number");
    });

    it("should handle end of year dates", () => {
      // 2023-12-31 23:59:59
      const result = getUnixTimeFromLocalDate(2023, 12, 31, 23, 59, 59, utc);
      expect(result).toBeGreaterThan(0);
      expect(typeof result).toBe("number");
    });

    it("should produce consistent results", () => {
      // Running the same input twice should produce the same output
      const result1 = getUnixTimeFromLocalDate(2024, 6, 15, 12, 0, 0, china);
      const result2 = getUnixTimeFromLocalDate(2024, 6, 15, 12, 0, 0, china);
      expect(result1).toBe(result2);
    });

    it("should handle different timezones", () => {
      // Same local time in different timezones should produce different UTC timestamps
      const chinaResult = getUnixTimeFromLocalDate(2024, 1, 1, 12, 0, 0, china);
      const utcResult = getUnixTimeFromLocalDate(2024, 1, 1, 12, 0, 0, utc);
      // China is UTC+8, so 12:00 in China is 04:00 in UTC
      // Therefore chinaResult should be less than utcResult (earlier in time)
      expect(chinaResult).not.toBe(utcResult);
    });
  });

  describe("getCurrentTimestamp", () => {
    it("should return seconds timestamp by default", () => {
      const before = Math.floor(Date.now() / 1000);
      const result = getCurrentTimestamp();
      const after = Math.floor(Date.now() / 1000);

      expect(result).toBeGreaterThanOrEqual(before);
      expect(result).toBeLessThanOrEqual(after);
      expect(result.toString().length).toBe(10); // seconds have 10 digits
    });

    it("should return seconds timestamp when specified", () => {
      const result = getCurrentTimestamp("seconds");
      expect(result.toString().length).toBe(10);
    });

    it("should return milliseconds timestamp when specified", () => {
      const result = getCurrentTimestamp("milliseconds");
      expect(result.toString().length).toBe(13);
    });

    it("should return different values for seconds and milliseconds", () => {
      const seconds = getCurrentTimestamp("seconds");
      const ms = getCurrentTimestamp("milliseconds");
      expect(ms).toBeGreaterThan(seconds * 1000);
      expect(ms).toBeLessThan((seconds + 2) * 1000);
    });
  });

  describe("validateNumber", () => {
    it("should return undefined for valid numbers", () => {
      expect(validateNumber("123")).toBeUndefined();
      expect(validateNumber("0")).toBeUndefined();
      expect(validateNumber("-456")).toBeUndefined();
      expect(validateNumber("3.14")).toBeUndefined();
    });

    it("should return 'Required' for empty strings", () => {
      expect(validateNumber("")).toBe("Required");
      expect(validateNumber("   ")).toBe("Required");
    });

    it("should return 'Required' for undefined", () => {
      expect(validateNumber(undefined)).toBe("Required");
    });

    it("should return error message for non-numeric strings", () => {
      expect(validateNumber("abc")).toBe("Must be a number");
      expect(validateNumber("12abc")).toBe("Must be a number");
      expect(validateNumber("hello")).toBe("Must be a number");
    });
  });

  describe("formatDateTimeWithCountry", () => {
    it("should format date with country timezone", () => {
      // 2024-01-01 00:00:00 UTC
      const date = new Date("2024-01-01T00:00:00Z");
      const result = formatDateTimeWithCountry(date, china, "zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });

      expect(result).toHaveProperty("name");
      expect(result).toHaveProperty("value");
      expect(result.name).toContain("China");
      expect(result.name).toContain("CST");
      expect(result.value).toBeTruthy();
    });

    it("should format date in different locales", () => {
      const date = new Date("2024-06-15T12:30:00Z");

      const usResult = formatDateTimeWithCountry(date, usaNy, "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      expect(usResult.name).toContain("USA");
      expect(usResult.value).toBeTruthy();
    });

    it("should format date differently for different timezones", () => {
      const date = new Date("2024-01-01T00:00:00Z");

      const chinaResult = formatDateTimeWithCountry(date, china, "en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });

      const utcResult = formatDateTimeWithCountry(date, utc, "en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });

      // Same UTC moment should display differently in different timezones
      expect(chinaResult.value).not.toBe(utcResult.value);
    });
  });

  describe("formatISOWithOffset", () => {
    it("should format date as ISO 8601 with offset", () => {
      const date = new Date("2024-01-01T00:00:00Z");
      const result = formatISOWithOffset(date, china);

      expect(result).toHaveProperty("name");
      expect(result).toHaveProperty("value");
      // ISO format should be like: 2024-01-01T08:00:00+08:00 (China is UTC+8)
      expect(result.value).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/,
      );
    });

    it("should format date in different timezones", () => {
      const date = new Date("2024-06-15T12:00:00Z");
      const chinaResult = formatISOWithOffset(date, china);
      const utcResult = formatISOWithOffset(date, utc);

      expect(chinaResult.name).toContain("China");
      expect(utcResult.name).toContain("UTC");
      expect(chinaResult.value).not.toBe(utcResult.value);
    });

    it("should include correct timezone offset", () => {
      const date = new Date("2024-01-01T00:00:00Z");
      const result = formatISOWithOffset(date, china);

      // China is UTC+8, so offset should be +08:00
      expect(result.value).toContain("+08:00");
    });
  });

  describe("formatRFC2822", () => {
    it("should format date as RFC 2822", () => {
      const date = new Date("2024-01-01T00:00:00Z");
      const result = formatRFC2822(date, china);

      expect(result).toHaveProperty("name");
      expect(result).toHaveProperty("value");
      // RFC 2822 format: Mon, 01 Jan 2024 08:00:00 +0800
      expect(result.value).toMatch(
        /^[A-Z][a-z]{2}, \d{2} [A-Z][a-z]{2} \d{4} \d{2}:\d{2}:\d{2} [+-]\d{4}$/,
      );
    });

    it("should format date in UTC", () => {
      const date = new Date("2024-06-15T12:30:00Z");
      const result = formatRFC2822(date, utc);

      expect(result.name).toContain("UTC");
      expect(result.value).toContain("Jun");
      expect(result.value).toContain("2024");
    });

    it("should include correct day of week", () => {
      // 2024-01-01 was a Monday
      const date = new Date("2024-01-01T00:00:00Z");
      const result = formatRFC2822(date, utc);

      expect(result.value).toMatch(/^Mon,/);
    });
  });

  describe("integration tests", () => {
    it("should convert timestamp to date and back consistently", () => {
      // Start with a known timestamp
      const originalTimestamp = 1704067200; // 2024-01-01 00:00:00 UTC
      const date = getDateFromUnixTime(originalTimestamp);

      // The date should represent the same moment in time
      expect(date.getTime()).toBe(originalTimestamp * 1000);
    });

    it("should handle timestamp format detection correctly", () => {
      // 10 digits = seconds
      const secondsTimestamp = 1704067200;
      const secondsResult = getDateFromUnixTime(secondsTimestamp);
      expect(secondsResult.getTime()).toBe(secondsTimestamp * 1000);

      // 13 digits = milliseconds
      const msTimestamp = 1704067200000;
      const msResult = getDateFromUnixTime(msTimestamp);
      expect(msResult.getTime()).toBe(msTimestamp);
    });

    it("should handle edge case timestamps", () => {
      // Unix epoch
      const epoch = getDateFromUnixTime(0);
      expect(epoch.getTime()).toBe(0);
      expect(epoch.toISOString()).toBe("1970-01-01T00:00:00.000Z");

      // Year 2000
      const y2k = getDateFromUnixTime(946684800);
      expect(y2k.getUTCFullYear()).toBe(2000);
    });
  });
});
