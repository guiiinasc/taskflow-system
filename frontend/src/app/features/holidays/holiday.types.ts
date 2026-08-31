export type HolidayType =
  | "national"
  | "state"
  | "municipal"
  | "facultative"
  | "other"
  | string;

export interface Holiday {
  date: string;
  name: string;
  type: HolidayType;
}
