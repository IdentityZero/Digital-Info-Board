import { useState } from "react";
import SignUp from "../../features/registration/SignUp";

const SignUpPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);

  return (
    <div className="relative w-full h-full">
      <SignUp
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        isSuccessful={isSuccessful}
        setIsSuccessful={setIsSuccessful}
      />
      <div className={`z-0 ${(isLoading || isSuccessful) && "blur-[2px]"}`}>
        There is a content here <br />
        There is a content here <br />
        There is a content here <br />
        There is a content here <br />
        There is a content here <br />
      </div>
    </div>
  );
};
export default SignUpPage;
