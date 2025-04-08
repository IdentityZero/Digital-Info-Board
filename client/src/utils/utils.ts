import {
  AnnouncementRetrieveType,
  ImageAnnouncementCreateType,
  VideoAnnouncementCreateType,
} from "../types/AnnouncementTypes";

export function getLaterDate(timestamp1: string, timestamp2: string): string {
  const date1 = new Date(timestamp1);
  const date2 = new Date(timestamp2);

  if (isNaN(date1.getTime()) || isNaN(date2.getTime())) {
    throw new Error("Invalid timestamp provided");
  }

  return date1 > date2 ? timestamp1 : timestamp2;
}
export function getAnnouncementType(
  announcement: AnnouncementRetrieveType
): "text" | "image" | "video" {
  if (announcement.text_announcement) {
    return "text";
  } else if (
    announcement.image_announcement &&
    announcement.image_announcement.length > 0
  ) {
    return "image";
  } else {
    return "video";
  }
}

export function isObjectEqual(obj1: any, obj2: any) {
  if (
    typeof obj1 === "object" &&
    obj1 !== null &&
    typeof obj2 === "object" &&
    obj2 !== null
  ) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (let key of keys1) {
      if (!keys2.includes(key) || !isObjectEqual(obj1[key], obj2[key])) {
        return false;
      }
    }

    return true;
  }

  return obj1 === obj2;
}

export function filterNullFromObject(obj: any): Record<string, any> {
  if (!obj) {
    return obj;
  }

  if (typeof obj !== "object") {
    console.error(`${obj} is not an Object`);
    return obj;
  }

  const filteredData: Record<string, any> = {};

  for (const key in obj) {
    if (obj[key] === null) continue;

    if (typeof obj[key] === "object") {
      const rec_obj = filterNullFromObject(obj[key]);

      if (Object.keys(rec_obj).length === 0) continue;

      filteredData[key] = rec_obj;
      continue;
    }

    filteredData[key] = obj[key];
  }
  return filteredData;
}

export function addTotalDuration(
  announcement_arr: Array<
    ImageAnnouncementCreateType | VideoAnnouncementCreateType
  >
) {
  /**
   * This will take a list of Image or Video announcements
   * Members of the list must have a duration in it
   *
   * It will return the sum of all the durations
   */

  let totalSeconds = 0;

  announcement_arr.forEach((announcement) => {
    if (!announcement.duration) return;

    const [hours, minutes, seconds] = announcement.duration
      .split(":")
      .map(Number);
    totalSeconds += hours * 3600 + minutes * 60 + seconds;
  });

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((unit) => String(unit).padStart(2, "0"))
    .join(":");
}

export function getRemovedId(obj_list1: any, obj_list2: any) {
  /**
   * Args: Obj_list1 and Obj_list2 will have the same structure, a list of objects.
   *        The Object must contain an ID
   *
   * Returns:
   *        A list of IDs that does not exist on both side
   *
   */
  const id_list1 = obj_list1.map((obj: { id: any }) => obj.id);
  const id_list2 = obj_list2.map((obj: { id: any }) => obj.id);

  const uniqueValues = [
    ...id_list1.filter((value: any) => !id_list2.includes(value)),
    ...id_list2.filter((value: any) => !id_list1.includes(value)),
  ];

  return uniqueValues;
}

export function filterListObjectKeys(obj_list: any, keysToKeep: any) {
  return obj_list.map((obj: { [s: string]: unknown } | ArrayLike<unknown>) =>
    Object.fromEntries(
      Object.entries(obj).filter(([key]) => keysToKeep.includes(key))
    )
  );
}

export function convertDurationToSeconds(duration: string): number {
  /**
   * Converts a duration field 'xx:xx:xx' into milliseconds
   */
  const [hours, minutes, seconds] = duration.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
}

export function convertSecondsToDuration(seconds: number): string {
  /**
   * Converts seconds into a duration string 'hh:mm:ss'
   * Ensures seconds are an integer by flooring the value.
   */
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60); // Floor the seconds to remove decimals

  return [hours, minutes, secs]
    .map((unit) => String(unit).padStart(2, "0"))
    .join(":");
}

export function moveFirstToLast<T>(arr: T[]): T[] {
  /**
   * Moves the first element of an array to the last
   */

  if (arr.length === 0) return arr;
  const firstElement = arr.shift();
  if (firstElement !== undefined) arr.push(firstElement);
  return arr;
}

export const calculateElapsedTime = (dateString: string): number => {
  /**
   * Calculates Elapsed time since the given dateString in milliseconds
   */
  const pastDate = new Date(dateString);
  const now = new Date();

  if (isNaN(pastDate.getTime())) {
    return 0;
  }

  const elapsedMilliseconds = now.getTime() - pastDate.getTime();

  return elapsedMilliseconds;
};

export const findIndexByWeight = (arr: number[], value: number): number => {
  /**
   * Finds the index in a weighted array where a given value falls.
   *
   * @param arr - An array of numbers representing weights.
   * @param value - A number used to determine the index based on cumulative weight.
   * @returns The index where the value falls within the cumulative sum, or -1 if not found.
   */
  let cumulativeSum = 0;
  for (let i = 0; i < arr.length; i++) {
    cumulativeSum += arr[i];
    if (value < cumulativeSum) {
      return i;
    }
  }
  return -1;
};

export const chunkArray = <T>(arr: T[], size: number): T[][] => {
  /**
   * Chunk Arrays into the given size
   */

  return arr.reduce<T[][]>(
    (chunks, _, i) =>
      i % size === 0 ? [...chunks, arr.slice(i, i + size)] : chunks,
    []
  );
};

export function getChangedObj<T>(oldObj: T[], newObj: T[]) {
  /**
   * Returns the changed objects from oldObj
   *
   * Args: odlObj and newObj are objects of the same length and the same structure
   *
   * Returns:
   *      A list of objects whose values have changed from the oldObj
   */

  if (oldObj.length !== newObj.length)
    throw new Error("Arrays must be of the same length");

  return newObj.filter((newItem, index) => {
    const oldItem = oldObj[index];
    return JSON.stringify(oldItem) !== JSON.stringify(newItem);
  });
}

export function getNextFiveHours<T>(data: T[]): T[] {
  const totalHours = 24;
  const currentHour = new Date().getHours();

  if (currentHour + 5 <= totalHours) {
    return data.slice(currentHour, currentHour + 5);
  }
  return data.slice(totalHours - 5, totalHours);
}

export function isNowWithinRange(
  startDateStr: string,
  endDateStr: string
): boolean {
  /**
   * Checks if the date today is within the range of 2 dates
   */
  const now = new Date();
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  return now >= startDate && now <= endDate;
}

export function sortItemsByPosition<T extends { id: string | number }>(
  items: T[],
  positions: { id: number; new_position: number }[]
): T[] {
  const positionMap = new Map<number, number>();

  positions.forEach((pos) => positionMap.set(pos.id, pos.new_position));

  return [...items].sort((a, b) => {
    const posA = positionMap.get(a.id as number) ?? Infinity;
    const posB = positionMap.get(b.id as number) ?? Infinity;

    return posA - posB;
  });
}

export const showApiError = (message: string, error: any) => {
  const VITE_SHOW_API_ERROR =
    (import.meta.env.VITE_SHOW_API_ERROR ?? "false") === "true";

  if (!VITE_SHOW_API_ERROR) return;

  console.log(message, error);
};
