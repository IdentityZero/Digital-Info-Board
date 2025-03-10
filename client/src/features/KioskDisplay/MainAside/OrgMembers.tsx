import { useEffect, useRef } from "react";
import { logoLg } from "../../../assets";

const OrgMembers = () => {
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const clone = slider.innerHTML;
    slider.innerHTML += clone; // Duplicate the cards for seamless looping

    let animationFrame: number;
    const speed = 1; // Adjust speed as needed

    const animate = () => {
      if (slider.scrollTop >= slider.scrollHeight / 2) {
        slider.scrollTop = 0;
      } else {
        slider.scrollTop += speed;
      }
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, []);
  return (
    <div className="w-full h-full relative overflow-hidden border rounded-lg shadow-lg">
      <img
        src={logoLg}
        alt="logo"
        className="absolute opacity-5 h-full w-full object-contain object-center"
      />
      <div className="z-[1] h-full w-full flex flex-col mt-2">
        <p className="text-center font-bold text-xl text-black">
          CPE Department
        </p>
        <div
          ref={sliderRef}
          className="h-full w-full flex flex-col gap-8 overflow-hidden"
          style={{ top: 0, scrollBehavior: "smooth" }}
        >
          <OrgCard name="Test 1" />
          <OrgCard name="Test 2" />
          <OrgCard name="Test 3" />
          <OrgCard name="Test 4" />
          <OrgCard name="Test 5" />
          <OrgCard name="Test 6" />
        </div>
      </div>
    </div>
  );
};
export default OrgMembers;

function OrgCard({ name }: { name: string }) {
  return (
    <div className="flex items-center space-x-2 px-4">
      <img
        className="w-16 h-16 rounded-full object-cover"
        src="https://picsum.photos/150/150?random=1"
        alt="TODO:NAME"
      />
      <div className="flex flex-col items-center bg-[#2f6dc1] w-full rounded-full text-white py-1">
        <span className="text-sm font-semibold">
          {name || "Engr. Juan Dela Cruz"}
        </span>
        <span className="text-xs">Position</span>
      </div>
    </div>
  );
}
