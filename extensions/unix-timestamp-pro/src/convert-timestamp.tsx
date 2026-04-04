import { Action, ActionPanel, Form, getPreferenceValues } from "@raycast/api";
import { useForm, FormValidation, showFailureToast } from "@raycast/utils";
import { useState } from "react";
import { countries, formats } from "./constants";
import { getDateFromUnixTime, validateNumber } from "./utils/datetime";
import { copyToClipboardWithToast } from "./utils/clipboard";
import { ConvertTimestampFormValues } from "./types";

interface Preferences {
  defaultTimezone: string;
  defaultFormat: string;
}

export default function Command() {
  const preferences = getPreferenceValues<Preferences>();
  const [resultText, setResultText] = useState<string>(
    "Please enter a UNIX timestamp and press the convert button",
  );

  const { handleSubmit, itemProps } = useForm<ConvertTimestampFormValues>({
    initialValues: {
      unixTime: "",
      country: preferences.defaultTimezone || countries[0].id,
      format: formats[0].id,
    },
    validation: {
      unixTime: validateNumber,
      country: FormValidation.Required,
      format: FormValidation.Required,
    },
    onSubmit(values) {
      const country = countries.find((c) => c.id === values.country);
      const format = formats.find((f) => f.id === values.format);

      if (!country || !format) {
        showFailureToast(new Error("Invalid country or format selected"));
        return;
      }

      try {
        const date = getDateFromUnixTime(values.unixTime);
        const result = format.format(date, country);

        copyToClipboardWithToast(result.value, "Datetime copied to clipboard!");
        setResultText(`${result.name}: ${result.value}`);
      } catch (error) {
        showFailureToast(
          error instanceof Error
            ? error
            : new Error("Failed to convert timestamp"),
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
      <Form.Description title="Converted Time" text={resultText} />
      <Form.Separator />
      <Form.TextField
        title="UNIX Timestamp"
        placeholder="1713945600"
        {...itemProps.unixTime}
      />
      <Form.Dropdown title="Select Country/Timezone" {...itemProps.country}>
        {countries.map((country) => (
          <Form.Dropdown.Item
            key={country.id}
            value={country.id}
            title={country.name}
          />
        ))}
      </Form.Dropdown>
      <Form.Dropdown title="Display Format" {...itemProps.format}>
        {formats.map((format) => (
          <Form.Dropdown.Item
            key={format.id}
            value={format.id}
            title={format.name}
          />
        ))}
      </Form.Dropdown>
    </Form>
  );
}
