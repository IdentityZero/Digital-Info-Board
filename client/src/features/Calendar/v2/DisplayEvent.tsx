import { EventApi } from "@fullcalendar/core/index.js";
import Modal from "../../../components/ui/Modal";
import { Input, TextArea } from "../../../components/ui";
import { formatDateTimeLocalPST } from "../../../utils/formatters";

type DisplayEventProps = {
  isOpen: boolean;
  onCloseClick: (isOpen: false) => void; // Always receives 'false'
  initialData: EventApi | null;
};

const DisplayEvent = ({
  isOpen,
  onCloseClick,
  initialData,
}: DisplayEventProps) => {
  return (
    <Modal
      isOpen={isOpen}
      title={initialData?.title}
      onClose={() => onCloseClick(false)}
      size="xl"
    >
      <Input
        type="datetime-local"
        defaultValue={formatDateTimeLocalPST(initialData?.start as Date)}
        name="start"
        labelText="Start date"
        required
        disabled
      />
      <Input
        type="datetime-local"
        defaultValue={formatDateTimeLocalPST(initialData?.end as Date)}
        name="end"
        labelText="End date"
        required
        disabled
      />
      <TextArea
        labelText="Event Description"
        placeholder="Event description..."
        name="description"
        defaultValue={initialData?.extendedProps.description}
        disabled
      />
      <Input
        name="location"
        labelText="Location"
        defaultValue={initialData?.extendedProps.location}
        disabled
      />
    </Modal>
  );
};
export default DisplayEvent;
