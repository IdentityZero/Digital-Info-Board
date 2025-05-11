import { useState } from "react";
import { SensorDataType } from "../../types/FixedContentTypes";

const useSensorData = () => {
  const [sensorData, setSensorData] = useState<SensorDataType>({
    co2: 0,
    temperature: 0,
    humidity: 0,
  });

  return { sensorData, setSensorData };
};
export default useSensorData;
