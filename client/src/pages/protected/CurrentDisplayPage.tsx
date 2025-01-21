import { customCircle } from "../../assets";

const CurrentDisplayPage = () => {
  return (
    <div className="p-2">
      <h1 className="ml-8 font-extrabold uppercase text-xl tracking-wider">
        Now Playing!
      </h1>
      <div className="flex flex-row h-full">
        <div className=" basis-1/2 h-full p-4 px-10">
          <div className="w-full h-full border-[6px] border-darkTeal rounded-md overflow-hidden">
            <h1 className="w-full text-center py-3 font-extrabold tracking-wider text-xl border-b-[6px] border-darkTeal">
              HEADLINE
            </h1>
            <div className="w-full h-[550px] flex items-center justify-center">
              <h1 className="w-full text-center font-extrabold tracking-wider text-xl">
                MAIN DISPLAY
              </h1>
            </div>
          </div>
        </div>
        <div className="basis-1/2 h-full ">
          <div className="px-5">
            <CustomTitleHolder text="Up next" />
            <div className="w-full h-[250px] bg-darkTeal border border-black rounded-lg overflow-hidden px-4 py-6 flex flex-col justify-between">
              <div className="flex flex-row gap-2 justify-center">
                <div className="w-[120px] h-[120px] bg-yellowishBeige"></div>
                <div className="w-[120px] h-[120px] bg-yellowishBeige"></div>
                <div className="w-[120px] h-[120px] bg-yellowishBeige"></div>
                <div className="w-[120px] h-[120px] bg-yellowishBeige"></div>
              </div>
              <div className="flex flex-row justify-between px-6">
                <button
                  className={`px-4 py-0.5 rounded-full bg-cyanBlue hover:bg-cyanBlue-dark active:bg-cyanBlue-darker text-white border border-black font-semibold text-xs uppercase`}
                  type="button"
                >
                  Drag and Drop
                </button>
                <button
                  className={`px-8 rounded-full bg-cyanBlue hover:bg-cyanBlue-dark active:bg-cyanBlue-darker text-white border border-black font-semibold text-xs uppercase`}
                  type="submit"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
          <div className="px-5">
            <CustomTitleHolder text="Edit Context" />
            <div className="w-full h-[250px] bg-darkTeal border border-black rounded-lg overflow-hidden px-4 py-6 flex flex-col justify-between">
              <div className="flex flex-row gap-2 justify-between h-[150px] bg-yellowishBeige p-4">
                <button
                  className={`px-8 py-2 h-fit rounded-full bg-cyanBlue hover:bg-cyanBlue-dark active:bg-cyanBlue-darker text-white border border-black font-semibold text-xs uppercase`}
                  type="submit"
                >
                  Change template
                </button>
                <button
                  className={`px-8 py-2 h-fit rounded-full bg-cyanBlue hover:bg-cyanBlue-dark active:bg-cyanBlue-darker text-white border border-black font-semibold text-xs uppercase`}
                  type="submit"
                >
                  Change Time Duration
                </button>
              </div>
              <div className="flex flex-row justify-end px-6">
                <button
                  className={`px-8 rounded-full bg-cyanBlue hover:bg-cyanBlue-dark active:bg-cyanBlue-darker text-white border border-black font-semibold text-xs uppercase`}
                  type="submit"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function CustomTitleHolder({ text }: { text: string }) {
  return (
    <div className="flex flex-row items-center py-2">
      <img src={customCircle} className="w-14 h-14" />
      <div className="bg-[linear-gradient(to_right,_transparent_2px,_#38b6ff_20px,_#38b6ff)] py-1.5 px-8 -ml-8 rounded-br-full">
        <p className="text-white uppercase font-bold text-xs">{text}</p>
      </div>
    </div>
  );
}

export default CurrentDisplayPage;
