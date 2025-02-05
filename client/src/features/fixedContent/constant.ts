import axios from "axios";
import { listActiveFixedContents } from "../../api/fixedContentRquests";
import CalendarEvents from "./CalendarEvents";
import CpEDepartment from "./CpEDepartment";
import FunFacts from "./FunFacts";
import StudentOrganization from "./StudentOrganization";
import WeatherForecast from "./WeatherForecast";

export type FixedContentType = (typeof FIXED_CONTENTS)[number];
export type FixedContentApiType = {
  id: number;
  title: string;
  description: string;
  is_displayed: boolean;
};

export const FIXED_CONTENTS = [
  { id: 1, title: "CpE Department", component: CpEDepartment },
  { id: 2, title: "Student Organization", component: StudentOrganization },
  { id: 3, title: "Calendar", component: CalendarEvents },
  {
    id: 4,
    title: "Weather Forecast",
    component: WeatherForecast,
    ownContainer: true,
  },
  { id: 5, title: "Facts", component: FunFacts },
];

export const getActiveFixedContents = async (): Promise<FixedContentType[]> => {
  try {
    const res_data: FixedContentApiType[] = await listActiveFixedContents();
    const activeContentsIds = res_data
      .filter((data) => data.is_displayed)
      .map((data) => data.id);

    return FIXED_CONTENTS.filter((content) =>
      activeContentsIds.includes(content.id)
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};
