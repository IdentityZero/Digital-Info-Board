import { Delta } from "quill/core";

export function selectOptionFormatString(input: string): string {
  return input
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function formatTimestamp(timestamp: string): string {
  /**
   * Converts an ISO 8601 timestamp into a human-readable date and time string.
   *
   * @param {string} timestamp - An ISO 8601 formatted date-time string (e.g., "2024-10-24T19:28:00+08:00").
   * @returns {string} A human-readable date and time string formatted in the style of "October 24, 2024, 07:28:00 PM".
   *
   * @example
   * // Example usage
   * const timestamp = "2024-10-24T19:28:00+08:00";
   * const readableDate = formatTimestamp(timestamp);
   * console.log(readableDate); // "October 24, 2024, 07:28:00 PM"
   *
   * @notes
   * - Ensure the input `timestamp` is in a valid ISO 8601 format.
   * - The output will use the "en-US" locale by default. Modify the locale in `toLocaleString` for different formatting.
   */
  const date = new Date(timestamp);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };

  // Convert to readable format
  return date.toLocaleString("en-US", options);
}

export function formatString(segment: string): string {
  /**
   * Replaces - to spaces
   * and
   * Capitalizes the first letter of each word
   */
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatStringUnderscores(segment: string): string {
  /**
   * Replaces _ to spaces
   * and
   * Capitalizes the first letter of each word
   */
  return segment
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function extractUrlname(url: string): string {
  /**
   * Example usage:
      console.log(extractUrlname("/dashboard/permissions")); // Output: "permissions"
      console.log(extractUrlname("/dashboard/upload-content/random")); // Output: "upload-content"
      console.log(extractUrlname("/dashboard/about/abc")); // Output: "about"
      console.log(extractUrlname("/dashboard/")); // Output: "dashboard"
      console.log(extractUrlname("/other-path/permissions")); // Output: "dashboard"
   */
  const match = url.match(/\/dashboard\/([^/]+)/);
  return match ? formatString(match[1]) : "Dashboard";
}

export function truncateString(inputString: string): string {
  // Check if the string is longer than 11 characters
  if (inputString.length > 15) {
    // Truncate the string to 8 characters and add '...'
    return inputString.substring(0, 12) + "...";
  } else {
    // Return the original string if it's 11 characters or fewer

    return inputString;
  }
}

export function truncateStringVariableLen(
  value: string,
  max_length = 150,
  return_length = 150
) {
  if (value.length > max_length) {
    return value.substring(0, return_length - 3) + "...";
  }
  return value;
}

export function extractReactQuillText(value: string): string {
  if (typeof value !== "string") {
    return "Invalid format. Please update.";
  }

  const str_val: Delta = JSON.parse(value);
  const ops = str_val.ops;
  if (!Array.isArray(ops)) {
    return "Invalid format. Please update.";
  }
  let extracted_str = "";
  for (let i = 0; i < ops.length; i++) {
    extracted_str += ops[i].insert;
  }
  return extracted_str;
}

export function convertToDatetimeLocal(datetimeStr: string): string {
  // Example usage:
  // const inputDatetime = '2024-12-07T21:21:00+08:00';
  // console.log(convertToDatetimeLocal(inputDatetime));  // Output: 2024-12-07T21:21
  const date = new Date(datetimeStr);

  // Format the date as YYYY-MM-DDTHH:MM
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function formatInputDate(inputDate: string): string {
  // Ensure the input date string is in YYYY-MM-DD format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(inputDate)) {
    throw new Error("Invalid date format. Expected format: YYYY-MM-DD");
  }

  // Parse the date string into a Date object
  const [year, month, day] = inputDate.split("-").map(Number);
  const date = new Date(year, month - 1, day); // Month is zero-based in JavaScript

  // Format the date to a more readable format
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return date.toLocaleDateString("en-US", options);
}
