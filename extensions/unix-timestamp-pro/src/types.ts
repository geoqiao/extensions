/**
 * Country/Timezone information
 */
export type Country = {
  id: string;
  name: string;
  ianaTimeZone: string;
  timezoneName: string;
};

/**
 * Date format definition
 */
export type Format = {
  id: string;
  name: string;
  /**
   * Function to format date for display
   * @param date - Date object (in target timezone)
   * @param country - Country information
   * @returns Formatted result with name and value
   */
  format: (date: Date, country: Country) => { name: string; value: string };
};

/**
 * Form values for convert-timestamp command
 */
export type ConvertTimestampFormValues = {
  unixTime: string;
  country: string;
  format: string;
};

/**
 * Form values for generate-timestamp command
 */
export type GenerateTimestampFormValues = {
  country: string;
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
  second: string;
};
