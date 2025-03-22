import React, { useEffect, useRef, useState } from "react";
import { Id } from "react-toastify";

import { Input } from "../../../../components/ui";

import { useAuth } from "../../../../context/AuthProvider";
import useLoadingToast from "../../../../hooks/useLoadingToast";

import { SettingsType } from "../../../../types/SettingTypes";
import { updateSystemSettingsApi } from "../../../../api/settingsRequest";

import { slideShowDurationErrInitState } from "./helpers";
import axios from "axios";

type SlideshowDurationProps = {
  settings: SettingsType;
  setSettings: React.Dispatch<React.SetStateAction<SettingsType>>;
  isSaving: boolean;
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
};

const SlideshowDuration = ({
  settings,
  setSettings,
  isSaving,
  setIsSaving,
}: SlideshowDurationProps) => {
  const { userApi } = useAuth();
  const toastId = useRef<Id | null>(null);
  const { loading, update } = useLoadingToast(toastId);

  const [settingsCopy, setSettingsCopy] = useState(settings);

  const [submitErrors, setSubmitErrors] = useState(
    slideShowDurationErrInitState
  );

  useEffect(() => {
    setSettingsCopy(settings);
    setSubmitErrors(slideShowDurationErrInitState);
  }, [
    settings.media_displays_slide_duration,
    settings.organization_slide_duration,
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;

    setSettingsCopy((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (componentKey: keyof SettingsType) => {
    loading("Saving updates. Please wait...");

    try {
      setIsSaving(true);
      setSubmitErrors(slideShowDurationErrInitState);
      const res_data = await updateSystemSettingsApi(userApi, {
        [componentKey]: settingsCopy[componentKey],
      });
      update({
        render: "Update succesful.",
        type: "success",
      });
      setSettings((prevSetting) => ({
        ...prevSetting,
        [componentKey]: res_data[componentKey],
      }));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setSubmitErrors((prev) => ({ ...prev, ...error.response?.data }));
      }

      update({
        render: "Update unsuccessful. Please try again.",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = (componentKey: keyof SettingsType) => {
    setSettingsCopy((prev) => ({
      ...prev,
      [componentKey]: settings[componentKey],
    }));
    setSubmitErrors(slideShowDurationErrInitState);
  };

  return (
    <div className="w-full bg-white border border-black p-2">
      <p className="bg-cyanBlue p-2 rounded-full font-semibold text-lg">
        Slide show Durations
      </p>
      <div className="mt-2 px-2">
        <div className="max-w-lg flex flex-col gap-1">
          <div className="w-full flex items-center gap-2">
            <div className="flex-1">
              <Input
                labelText="Organization"
                placeholder="Organization slide show duration"
                value={settingsCopy.organization_slide_duration}
                name={"organization_slide_duration" as keyof SettingsType}
                onChange={handleInputChange}
                disabled={isSaving}
                error={submitErrors.organization_slide_duration}
              />
            </div>
            {settings.organization_slide_duration !==
              settingsCopy.organization_slide_duration && (
              <div className="mt-8 flex gap-2">
                <button
                  className="bg-cyanBlue py-2 px-4 rounded-full font-semibold text-white 
              transition-colors disabled:bg-gray-400 disabled:text-gray-200 
              disabled:cursor-not-allowed hover:bg-cyan-600"
                  onClick={() => handleSubmit("organization_slide_duration")}
                  disabled={isSaving}
                >
                  Save
                </button>
                <button
                  className="bg-cyanBlue py-2 px-4 rounded-full font-semibold text-white 
                  transition-colors disabled:bg-gray-400 disabled:text-gray-200 
                  disabled:cursor-not-allowed hover:bg-cyan-600"
                  onClick={() => handleReset("organization_slide_duration")}
                  disabled={isSaving}
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-lg flex flex-col gap-1">
          <div className="w-full flex items-center gap-2">
            <div className="flex-1">
              <Input
                labelText="Media displays"
                placeholder="Media displays slide show duration"
                value={settingsCopy.media_displays_slide_duration}
                name={"media_displays_slide_duration" as keyof SettingsType}
                onChange={handleInputChange}
                disabled={isSaving}
                error={submitErrors.media_displays_slide_duration}
              />
            </div>
            {settings.media_displays_slide_duration !==
              settingsCopy.media_displays_slide_duration && (
              <div className="mt-8 flex gap-2">
                <button
                  className="bg-cyanBlue py-2 px-4 rounded-full font-semibold text-white 
              transition-colors disabled:bg-gray-400 disabled:text-gray-200 
              disabled:cursor-not-allowed hover:bg-cyan-600"
                  onClick={() => handleSubmit("media_displays_slide_duration")}
                  disabled={isSaving}
                >
                  Save
                </button>
                <button
                  className="bg-cyanBlue py-2 px-4 rounded-full font-semibold text-white 
                  transition-colors disabled:bg-gray-400 disabled:text-gray-200 
                  disabled:cursor-not-allowed hover:bg-cyan-600"
                  onClick={() => handleReset("media_displays_slide_duration")}
                  disabled={isSaving}
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default SlideshowDuration;

{
  // For upcoming events
  /* <div className="max-w-lg flex flex-col gap-1">
          <div className="w-full flex items-center gap-2">
            <div className="flex-1">
              <Input
                labelText="Upcoming events"
                placeholder="Upcoming events slide show duration"
                value={settingsCopy.upcoming_events_slide_duration}
              />
            </div>
            <div className="mt-8">
              <button
                className="bg-cyanBlue py-2 px-4 rounded-full font-semibold text-white 
              transition-colors disabled:bg-gray-400 disabled:text-gray-200 
              disabled:cursor-not-allowed hover:bg-cyan-600"
              >
                Save
              </button>
            </div>
          </div>
        </div> */
}
