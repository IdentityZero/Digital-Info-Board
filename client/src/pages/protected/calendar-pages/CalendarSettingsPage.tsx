import React, { useRef, useState } from "react";
import { Id } from "react-toastify";

import LoadingMessage from "../../../components/LoadingMessage";
import { Button, Input } from "../../../components/ui";
import Accordion, { AccordionItem } from "../../../components/ui/Accordion";
import ErrorMessage from "../../../components/ErrorMessage";
import Checkbox from "../../../components/ui/Checkbox";

import useSiteSettings from "../../../hooks/useSiteSettings";
import useLoadingToast from "../../../hooks/useLoadingToast";
import { useAuth } from "../../../context/AuthProvider";

import { updateSystemSettingsApi } from "../../../api/settingsRequest";

const CalendarSettingsPage = () => {
  const { userApi } = useAuth();
  const toastId = useRef<Id | null>(null);
  const { loading, update } = useLoadingToast(toastId);
  const { settings, isLoading, hasError } = useSiteSettings();

  const [isSaving, setIsSaving] = useState(false);

  if (!settings) {
    return isLoading ? (
      <LoadingMessage message="Fetching settings" />
    ) : (
      <div className="text-center font-semibold text-lg">
        Unexpected error loading settings
      </div>
    );
  }

  if (isLoading) {
    return <LoadingMessage message="Fetching settings" />;
  }

  if (hasError) {
    return (
      <ErrorMessage message="Something went wrong while fetching Calendar Events. Attempting to fetch again." />
    );
  }

  const handleWebSettingsSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    e.currentTarget
      .querySelectorAll<HTMLInputElement>('input[type="checkbox"]')
      .forEach((checkbox) => {
        formData.set(checkbox.name, checkbox.checked ? "true" : "false");
      });

    handleSubmit(formData);
  };

  const handleKioskSettingsSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    e.currentTarget
      .querySelectorAll<HTMLInputElement>('input[type="checkbox"]')
      .forEach((checkbox) => {
        formData.set(checkbox.name, checkbox.checked ? "true" : "false");
      });

    handleSubmit(formData);
  };

  const handleSubmit = async (data: FormData) => {
    try {
      loading("Saving updates. Please wait...");
      setIsSaving(true);
      await updateSystemSettingsApi(userApi, data);
      update({
        render: "Update successful.",
        type: "success",
      });
    } catch (error) {
      update({
        render: "Update unsuccessful. Please try again.",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Accordion>
      <AccordionItem title="Web Calendar Display Settings">
        <form
          className="bg-white w-full h-full p-4 flex flex-col gap-4"
          onSubmit={handleWebSettingsSubmit}
        >
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2 capitalize cursor-pointer"
              htmlFor="web_calendar_grid_type"
            >
              Initial Load Grid type
            </label>
            <select
              id="web_calendar_grid_type"
              name="web_calendar_grid_type"
              defaultValue={settings.web_calendar_grid_type}
              disabled={isSaving}
              className="w-full px-3 py-2 rounded-md shadow-sm focus:outline-none disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed border border-gray-300 focus:ring focus:ring-blue-200 focus:border-blue-500"
            >
              <option value="dayGridMonth">Monthly</option>
              <option value="timeGridWeek">Weekly</option>
              <option value="timeGridDay">Daily</option>
            </select>
          </div>
          <Input
            defaultValue={settings.web_max_events}
            name="web_max_events"
            labelText="Max event per day"
            type="number"
            max={5}
            placeholder="Max of 5"
            helpText={[
              "Max number of events to show in monthly grid before it shows `see more`",
            ]}
            disabled={isSaving}
          />
          <Checkbox
            labelText="Show events"
            name="web_show_events"
            defaultChecked={settings.web_show_events}
            disabled={isSaving}
          />
          <Checkbox
            labelText="Show weekends"
            name="web_show_weekends"
            defaultChecked={settings.web_show_weekends}
            disabled={isSaving}
          />
          <Checkbox
            labelText="Show grid controls (monthly, weekly, daily)"
            name="web_show_grid_controls"
            defaultChecked={settings.web_show_grid_controls}
            disabled={isSaving}
          />
          <Checkbox
            labelText="Show navigation controls"
            name="web_show_nav_controls"
            defaultChecked={settings.web_show_nav_controls}
            disabled={isSaving}
          />
          <div>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Submit"}
            </Button>
          </div>
        </form>
      </AccordionItem>

      <AccordionItem title="Kiosk Mode Calendar Display Settings">
        <form
          className="bg-white w-full h-full p-4 flex flex-col gap-4"
          onSubmit={handleKioskSettingsSubmit}
        >
          <div>
            <label
              htmlFor="kiosk_calendar_grid_type"
              className="block text-gray-700 text-sm font-bold mb-2 capitalize cursor-pointer"
            >
              Initial Load Grid type
            </label>
            <select
              id="kiosk_calendar_grid_type"
              name="kiosk_calendar_grid_type"
              defaultValue={settings.kiosk_calendar_grid_type}
              disabled={isSaving}
              className="w-full px-3 py-2 rounded-md shadow-sm focus:outline-none disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed border border-gray-300 focus:ring focus:ring-blue-200 focus:border-blue-500"
            >
              <option value="dayGridMonth">Monthly</option>
              <option value="timeGridWeek">Weekly</option>
              <option value="timeGridDay">Daily</option>
            </select>
          </div>
          <Input
            defaultValue={settings.kiosk_max_events}
            name="kiosk_max_events"
            labelText="Max event per day"
            type="number"
            max={5}
            placeholder="Max of 5"
            helpText={[
              "Max number of events to show in monthly grid before it shows `see more`",
              "Recommended to be set to 0 due to small container size.",
            ]}
            disabled={isSaving}
          />
          <Checkbox
            labelText="Show events"
            name="kiosk_show_events"
            defaultChecked={settings.kiosk_show_events}
            helpText={[
              "Recommended to be set to unchecked due to small container size.",
            ]}
            disabled={isSaving}
          />
          <Checkbox
            labelText="Show weekends"
            name="kiosk_show_weekends"
            defaultChecked={settings.kiosk_show_weekends}
            disabled={isSaving}
          />
          <Checkbox
            labelText="Show grid controls (monthly, weekly, daily)"
            name="kiosk_show_grid_controls"
            defaultChecked={settings.kiosk_show_grid_controls}
            disabled={isSaving}
          />
          <Checkbox
            labelText="Show navigation controls"
            name="kiosk_show_nav_controls"
            defaultChecked={settings.kiosk_show_nav_controls}
            disabled={isSaving}
          />
          <div>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Submit"}
            </Button>
          </div>
        </form>
      </AccordionItem>
    </Accordion>
  );
};
export default CalendarSettingsPage;
