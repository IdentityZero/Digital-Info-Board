import { useRef, useState } from "react";
import { AxiosError } from "axios";
import { Link } from "react-router-dom";

import { Form } from "../../components/ui";
import { createNewUserApi } from "../../api/signUpRequest";

import Step1 from "./Step1";
import Step2 from "./Step2";
import {
  step1HasErrors,
  step2FormNames,
  newUserErrorInitialState,
  newUserObject,
  NewUserErrorsType,
} from "./helpers";
import SuccessSignup from "./SuccessSignup";

//#TODO UNEXPECTED ERRORS

type SignUpProps = {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isSuccessful: boolean;
  setIsSuccessful: React.Dispatch<React.SetStateAction<boolean>>;
};

const SignUp = ({
  isLoading,
  setIsLoading,
  isSuccessful,
  setIsSuccessful,
}: SignUpProps) => {
  const [step, setStep] = useState<1 | 2>(1);
  const formRef = useRef<HTMLFormElement | null>(null);
  const [newUser, setNewUser] = useState(newUserObject);
  const [profilePic, setProfilePic] = useState<string | ArrayBuffer | null>(
    null
  );
  const [errors, setErrors] = useState<NewUserErrorsType>(
    newUserErrorInitialState
  );
  const [formError, setFormError] = useState("");

  const handleFormStateChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (
      e.target instanceof HTMLInputElement &&
      e.target.type === "file" &&
      e.target.files &&
      e.target.files.length > 0
    ) {
      const file = e.target.files[0];
      if (file) {
        setProfilePic(URL.createObjectURL(file));

        setNewUser((prev) => {
          return {
            ...prev,
            profile: {
              ...prev.profile,
              image: file,
            },
          };
        });
      }
      return;
    }

    if (e.target.name.includes(".")) {
      setNewUser((prev) => {
        return {
          ...prev,
          profile: {
            ...prev.profile,
            [e.target.name.split(".")[1]]: e.target.value,
          },
        };
      });

      return;
    }

    setNewUser((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleNextStep = () => {
    if (formRef.current) {
      for (const input of formRef.current.elements) {
        if (
          input instanceof HTMLInputElement ||
          input instanceof HTMLSelectElement
        ) {
          if (!input.checkValidity() && !step2FormNames.includes(input.name)) {
            input.reportValidity();
            return false;
          }
          // SELECTS DOES NOT SUPPORT CONTROLLED VALUES YET
          if (input.name === "profile.role") {
            setNewUser((prev) => {
              return {
                ...prev,
                profile: {
                  ...prev.profile,
                  role: input.value,
                },
              };
            });
          } else if (input.name === "profile.position") {
            setNewUser((prev) => {
              return {
                ...prev,
                profile: {
                  ...prev.profile,
                  position: input.value,
                },
              };
            });
          }
        }
      }
    }

    setStep(step === 1 ? 2 : 1);
  };

  const handleSignUpFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const newUserFormObject = Object.fromEntries(formData.entries());

    if (newUserFormObject.password !== newUserFormObject.repeat_password) {
      setErrors((prev) => ({
        ...prev,
        repeat_password: ["Passwords do not match"],
      }));
      return;
    }

    const createNewUser = async () => {
      try {
        setIsLoading(true);
        setErrors(newUserErrorInitialState);
        await createNewUserApi(newUserFormObject);
        setIsSuccessful(true);
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.request.response) {
            const msg = JSON.parse(error.response.request.response);
            setErrors((prev) => ({
              ...prev,
              ...msg,
            }));

            setStep(step1HasErrors({ ...msg }) ? 1 : 2);
          }
        } else {
          setFormError("Unexpected error occured. Please try again later.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    createNewUser();
  };

  return (
    <>
      {(isLoading || isSuccessful) && (
        <div
          className={`min-w-full min-h-full bg-[#f1f1f1] ${
            isLoading && "bg-opacity-30"
          } absolute top-0 left-0 z-50 flex items-center justify-center`}
        >
          {isLoading && <h1>Loading...</h1>}
          {isSuccessful && <SuccessSignup />}
        </div>
      )}
      <section
        className={`w-full px-4 py-4 ${
          (isLoading || isSuccessful) && "blur-[2px]"
        }`}
      >
        <div className="mb-4">
          <div className="flex flex-row items-center justify-evenly mt-4 mb-4">
            <div
              className={`w-16 h-16 flex items-center justify-center border-2 rounded-full text-4xl font-medium transform transition-all duration-500 ease-out 
              ${
                step === 1
                  ? "bg-cyan-500 border-cyan-600 text-white font-bold"
                  : "bg-white border-gray-300 text-gray-500"
              } 
              `}
            >
              1
            </div>
            <div
              className={`w-16 h-16 flex items-center justify-center border-2 rounded-full text-4xl font-medium transform transition-all duration-500 ease-out 
              ${
                step === 2
                  ? "bg-cyan-500 border-cyan-600 text-white font-bold"
                  : "bg-white border-gray-300 text-gray-500"
              } 
              `}
            >
              2
            </div>
          </div>
          <p className="mt-6 text-sm text-center text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-500 focus:outline-none focus:underline hover:underline"
            >
              Login
            </Link>
            .
          </p>
        </div>
        <Form
          ref={formRef}
          onSubmitFunc={handleSignUpFormSubmit}
          hasFiles={true}
          error={formError}
        >
          <div
            className={`flex items-center justify-center ${
              step !== 1 && "hidden"
            }`}
          >
            <Step1
              picture={profilePic}
              errors={errors}
              formState={newUser}
              setFormState={handleFormStateChange}
              loading={isLoading}
            />
          </div>

          <div
            className={`flex items-center justify-center ${
              step === 1 && "hidden"
            }`}
          >
            <Step2
              errors={errors}
              picture={profilePic}
              formState={newUser}
              setFormState={handleFormStateChange}
              loading={isLoading}
            />
          </div>
          <div className="mt-2 flex justify-center">
            <div className="w-full flex flex-col lg:flex-row gap-2">
              {step === 2 && (
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-2 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition ${
                    isLoading ? "bg-gray-400 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? "Submitting..." : "Submit"}
                </button>
              )}
              <button
                onClick={handleNextStep}
                type="button"
                className={`w-full py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition ${
                  isLoading ? "bg-gray-400 cursor-not-allowed" : ""
                }`}
              >
                {step === 1 ? "Next" : "Back"}
              </button>
            </div>
          </div>
        </Form>
      </section>
    </>
  );
};
export default SignUp;
