import { Action, ActionPanel, Form, getPreferenceValues } from "@raycast/api";
import { useForm, FormValidation, showFailureToast } from "@raycast/utils";
import { useState } from "react";
import { countries } from "./constants";
import { getUnixTimeFromLocalDate, validateNumber } from "./utils/datetime";
import { copyToClipboardWithToast } from "./utils/clipboard";
import { GenerateTimestampFormValues } from "./types";

interface Preferences {
  defaultTimezone: string;
}

export default function Command() {
  const preferences = getPreferenceValues<Preferences>();
  const [resultText, setResultText] = useState<string>(
    "Enter date, time, and timezone, then press Convert.",
  );
  const now = new Date();

  const { handleSubmit, itemProps } = useForm<GenerateTimestampFormValues>({
    initialValues: {
      country: preferences.defaultTimezone || countries[0].id,
      year: now.getFullYear().toString(),
      month: (now.getMonth() + 1).toString(),
      day: now.getDate().toString(),
      hour: now.getHours().toString(),
      minute: now.getMinutes().toString(),
      second: now.getSeconds().toString(),
    },
    validation: {
      country: FormValidation.Required,
      year: validateNumber,
      month: validateNumber,
      day: validateNumber,
      hour: validateNumber,
      minute: validateNumber,
      second: validateNumber,
    },
    onSubmit(values) {
      const country = countries.find((c) => c.id === values.country);

      if (!country) {
        showFailureToast(new Error("Invalid timezone selected"));
        return;
      }

      // Validate ranges
      const month = Number(values.month);
      const day = Number(values.day);
      const hour = Number(values.hour);
      const minute = Number(values.minute);
      const second = Number(values.second);

      if (month < 1 || month > 12) {
        showFailureToast(new Error("Month must be between 1 and 12"));
        return;
      }
      if (day < 1 || day > 31) {
        showFailureToast(new Error("Day must be between 1 and 31"));
        return;
      }
      if (hour < 0 || hour > 23) {
        showFailureToast(new Error("Hour must be between 0 and 23"));
        return;
      }
      if (minute < 0 || minute > 59) {
        showFailureToast(new Error("Minute must be between 0 and 59"));
        return;
      }
      if (second < 0 || second > 59) {
        showFailureToast(new Error("Second must be between 0 and 59"));
        return;
      }

      try {
        const unix = getUnixTimeFromLocalDate(
          Number(values.year),
          month,
          day,
          hour,
          minute,
          second,
          country,
        );

        copyToClipboardWithToast(
          unix.toString(),
          "UNIX timestamp copied to clipboard!",
        );
        setResultText(`${country.name} ${unix}`);
      } catch (error) {
        showFailureToast(
          error instanceof Error
            ? error
            : new Error("Failed to generate timestamp"),
        );
      }
    },
  });

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Convert & Copy" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.Description title="Result" text={resultText} />
      <Form.Separator />
      <Form.Dropdown title="Timezone" {...itemProps.country}>
        {countries.map((country) => (
          <Form.Dropdown.Item
            key={country.id}
            value={country.id}
            title={country.name}
          />
        ))}
      </Form.Dropdown>
      <Form.Separator />
      <Form.TextField title="Year" placeholder="2024" {...itemProps.year} />
      <Form.TextField
        title="Month (1-12)"
        placeholder="1"
        {...itemProps.month}
      />
      <Form.TextField title="Day (1-31)" placeholder="1" {...itemProps.day} />
      <Form.Separator />
      <Form.TextField
        title="Hour (0-23)"
        placeholder="12"
        {...itemProps.hour}
      />
      <Form.TextField
        title="Minute (0-59)"
        placeholder="00"
        {...itemProps.minute}
      />
      <Form.TextField
        title="Second (0-59)"
        placeholder="00"
        {...itemProps.second}
      />
    </Form>
  );
}
