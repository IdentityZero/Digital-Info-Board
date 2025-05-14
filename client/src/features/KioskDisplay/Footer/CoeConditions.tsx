import { SensorDataType } from "../../../types/FixedContentTypes";

type SensorType = "temperature" | "co2" | "humidity";

const getStatusColor = (type: SensorType, value: number): string => {
  switch (type) {
    case "temperature":
      if (value >= 30) return "text-red-500";
      if (value >= 25) return "text-yellow-500";
      return "text-green-500";
    case "co2":
      if (value >= 1000) return "text-red-500";
      if (value >= 800) return "text-yellow-500";
      return "text-green-500";
    case "humidity":
      if (value > 70 || value < 30) return "text-red-500";
      if (value > 60 || value < 40) return "text-yellow-500";
      return "text-green-500";
    default:
      return "text-white";
  }
};

const CoeConditions = ({
  temperature,
  humidity,
  co2: _co2,
}: SensorDataType) => {
  return (
    <div className="relative flex flex-col items-center rounded-2xl shadow-lg h-full w-full px-1">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/40 to-purple-500/30 rounded-2xl blur-2xl"></div>
      <div className="relative z-10 text-3xl font-semibold">COE Conditions</div>

      {/* {isLoading && <LoadingMessage message="Loading..." />} */}
      <div className="relative z-10 p-4 rounded-2xl shadow-lg space-y-4 h-full flex flex-col items-center justify-evenly">
        <Card
          label="Temperature"
          icon="🌡️"
          value={temperature}
          type="temperature"
        />
        {/* <Card label="CO2 Levels" icon="🫁" value={co2} type="co2" /> */}
        <Card label="Humidity" icon="💧" value={humidity} type="humidity" />
      </div>
    </div>
  );
};

type CardProps = {
  label: string;
  icon: string;
  value: number;
  type: SensorType;
};

function Card({ label, value, icon, type }: CardProps) {
  const unitMap: Record<SensorType, string> = {
    temperature: " °C",
    co2: " ppm",
    humidity: "% RH",
  };

  return (
    <div className="rounded-xl flex flex-col items-center justify-between text-white">
      <div className="font-semibold text-3xl flex">
        {icon} {label}
      </div>
      <div className={`text-5xl font-bold ${getStatusColor(type, value)}`}>
        {value}
        {unitMap[type]}
      </div>
    </div>
  );
}

export default CoeConditions;
