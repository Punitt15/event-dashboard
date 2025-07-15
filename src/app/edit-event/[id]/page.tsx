import EditEventForm from "@/components/EditEventForm";

export default function EditEventPage({ params }: { params: { id: string } }) {
  return <EditEventForm eventId={params.id} />;
}
