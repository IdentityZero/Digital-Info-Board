import NewsTicker from "../../components/NewsTicker";

type TextNewsTickerProps = {
  headlines: string[];
};

const TextNewsTicker = ({ headlines }: TextNewsTickerProps) => {
  return (
    <div className="flex flex-col justify-center text-black">
      <div className="bg-white w-fit p-1 relative overflow-hidden">
        <p className="pl-8 px-4 uppercase font-semibold text-sm tracking-wide">
          News Update
        </p>
        <div className="absolute left-0 bottom-0 h-[2px] bg-blue-500 animate-dynamic-slide"></div>
      </div>
      <NewsTicker
        headlines={
          headlines || [
            "Department of Computer Engineering",
            "Mariano Marcos State University",
          ]
        }
        className="bg-[#0073C5] p-1 font-bold text-3xl text-[#F8E94E]"
      />
    </div>
  );
};
export default TextNewsTicker;
