"use client";
import { useEvents } from "@/contexts/EventContext";
import { EventType } from "@/types/event";
import { useAuth } from "@/contexts/AuthContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// import { EventType } from "@/contexts/EventContext";
import { categories, eventTypes, sortOptions } from "@/constants/constants";

export default function EditEventForm({ eventId }: { eventId: string }) {
    const { events, updateEvent } = useEvents();
    const { user } = useAuth();
    const router = useRouter();

    const [eventData, setEventData] = useState<EventType | null>(null);

    useEffect(() => {
        const found = events.find(e => e.id === eventId && e.organizer === user?.email);
        if (found) setEventData(found);
        else router.push("/dashboard");
    }, [events, eventId, user]);

    if (!eventData) return null;

    const validationSchema = Yup.object({
        title: Yup.string().required(),
        description: Yup.string().required(),
        eventType: Yup.string().oneOf(["Online", "In-Person"]).required(),
        location: Yup.string().when("eventType", {
            is: "In-Person",
            then: (schema) => schema.required("Location is required"),
            otherwise: (schema) => schema,
        }),
        eventLink: Yup.string().when("eventType", {
            is: "Online",
            then: (schema) => schema.url("Invalid URL").required("Event link is required"),
            otherwise: (schema) => schema,
        }),
        startDateTime: Yup.string()
            .required("Start date & time is required")
            .test(
                "is-before-end",
                "Start date & time must be before end date & time",
                function (value) {
                    const { endDateTime } = this.parent;
                    return !value || !endDateTime || new Date(value) < new Date(endDateTime);
                }
            ),
        endDateTime: Yup.string()
            .required("End date & time is required")
            .test(
                "is-after-start",
                "End date & time must be after start date & time",
                function (value) {
                    const { startDateTime } = this.parent;
                    return !value || !startDateTime || new Date(value) > new Date(startDateTime);
                }
            ),
        category: Yup.string().required(),
    });

    const handleSubmit = (values: typeof eventData) => {
        const success = updateEvent({ ...values, id: eventId, organizer: user?.email || "" });

        if (success) {
            alert("Event updated successfully!");
            router.push("/dashboard");
        } else {
            alert("Event time overlaps with another event.");
        }
    };

    return (
        <div className="min-h-[94vh] flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-2 py-8">
            <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-6 sm:p-10">
                <h1 className="text-3xl font-bold mb-6 text-blue-700 drop-shadow-sm text-center">Edit Event</h1>
                <Formik
                    initialValues={eventData}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {({ values }) => (
                        <Form className="flex flex-col gap-6">
                            <div>
                                <Field name="title" className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-100 transition" />
                                <ErrorMessage name="title" component="div" className="text-red-500 text-xs mt-1" />
                            </div>
                            <div>
                                <Field as="textarea" name="description" className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-100 transition" />
                                <ErrorMessage name="description" component="div" className="text-red-500 text-xs mt-1" />
                            </div>
                            <div>
                                <Field as="select" name="eventType" className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-100 transition">
                                    <option value="Online">Online</option>
                                    <option value="In-Person">In-Person</option>
                                </Field>
                            </div>
                            {values.eventType === "In-Person" && (
                                <div>
                                    <Field name="location" className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-100 transition" />
                                    <ErrorMessage name="location" component="div" className="text-red-500 text-xs mt-1" />
                                </div>
                            )}
                            {values.eventType === "Online" && (
                                <div>
                                    <Field name="eventLink" className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-100 transition" />
                                    <ErrorMessage name="eventLink" component="div" className="text-red-500 text-xs mt-1" />
                                </div>
                            )}
                            <div>
                                <Field name="startDateTime" type="datetime-local" className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-100 transition" />
                                <ErrorMessage name="startDateTime" component="div" className="text-red-500 text-xs mt-1" />
                            </div>
                            <div>
                                <Field name="endDateTime" type="datetime-local" className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-100 transition" />
                                <ErrorMessage name="endDateTime" component="div" className="text-red-500 text-xs mt-1" />
                            </div>
                            <div>
                                <Field as="select" name="category" className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-100 transition">
                                    {categories.map((cat: string) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </Field>
                            </div>
                            <button type="submit" className="bg-blue-600 hover:bg-blue-700 focus:bg-blue-800 text-white font-semibold py-2 rounded-lg transition-all duration-150 shadow w-full cursor-pointer">
                                Update Event
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}
