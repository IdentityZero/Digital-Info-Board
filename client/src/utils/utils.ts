import { ImageAnnouncementCreateType } from "../types/AnnouncementTypes";

export function getLaterDate(timestamp1: string, timestamp2: string): string {
  const date1 = new Date(timestamp1);
  const date2 = new Date(timestamp2);

  if (isNaN(date1.getTime()) || isNaN(date2.getTime())) {
    throw new Error("Invalid timestamp provided");
  }

  return date1 > date2 ? timestamp1 : timestamp2;
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
    console.log(`${obj} cannot be null.`);

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
  announcement_arr: Array<ImageAnnouncementCreateType>
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
  const [hours, minutes, seconds] = duration.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
}
