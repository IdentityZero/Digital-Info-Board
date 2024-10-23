import { useRef, useState } from "react";
import { AxiosError } from "axios";

import { Button, Form } from "../../components/ui";
import { createNewUserApi } from "../../api";

import Step1 from "./Step1";
import Step2 from "./Step2";
import {
  step1HasErrors,
  step2FormNames,
  newUserErrorInitialState,
  newUserObject,
  NewUserErrorsType,
} from "./helpers";

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
          {isSuccessful && (
            <div>
              <h1>You have created an account.</h1>
              <h1>
                The administrator has to review your account. For the mean time
                explore about us.
              </h1>
            </div>
          )}
        </div>
      )}
      <section
        className={`w-full px-4  ${
          (isLoading || isSuccessful) && "blur-[2px]"
        }`}
      >
        <Form
          ref={formRef}
          onSubmitFunc={handleSignUpFormSubmit}
          hasFiles={true}
          error={formError}
        >
          <Step1
            hidden={step !== 1}
            picture={profilePic}
            errors={errors}
            formState={newUser}
            setFormState={handleFormStateChange}
            loading={isLoading}
          />
          <Step2
            hidden={step === 1}
            errors={errors}
            picture={profilePic}
            formState={newUser}
            setFormState={handleFormStateChange}
            loading={isLoading}
          />
          <div className="mt-2">
            <Button onClickFunc={handleNextStep}>
              {step === 1 ? "Next" : "Back"}
            </Button>
            {step === 2 && (
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit"}
              </Button>
            )}
          </div>
        </Form>
      </section>
    </>
  );
};
export default SignUp;
