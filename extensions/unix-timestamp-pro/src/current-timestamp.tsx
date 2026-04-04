import { showToast, Toast, getPreferenceValues } from "@raycast/api";
import { Clipboard } from "@raycast/api";
import { getCurrentTimestamp } from "./utils/datetime";

interface Preferences {
  timestampUnit: "seconds" | "milliseconds";
}

export default async function Command() {
  const preferences = getPreferenceValues<Preferences>();
  const unit = preferences.timestampUnit || "seconds";

  try {
    const timestamp = getCurrentTimestamp(unit);
    const timestampStr = timestamp.toString();

    await Clipboard.copy(timestampStr);

    await showToast({
      style: Toast.Style.Success,
      title: `Copied ${unit === "seconds" ? "seconds" : "milliseconds"} timestamp`,
      message: timestampStr,
    });
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Failed to get current timestamp",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
