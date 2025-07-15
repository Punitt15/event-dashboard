"use client";
import { useEvents } from "@/contexts/EventContext";
import { useAuth } from "@/contexts/AuthContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { categories, eventTypes, sortOptions } from "@/constants/constants";

const EventForm = () => {
  const { addEvent } = useEvents();
  const { user } = useAuth();
  const router = useRouter();

  const initialValues = {
    title: "",
    description: "",
    eventType: "Online",
    location: "",
    eventLink: "",
    startDateTime: "",
    endDateTime: "",
    category: categories[0],
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    eventType: Yup.string().oneOf(["Online", "In-Person"]),
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
    category: Yup.string().required("Category is required"),
  });

  const handleSubmit = (values: typeof initialValues) => {
    const success = addEvent({
      ...values,
      eventType: values.eventType as "Online" | "In-Person",
      organizer: user?.email || "",
    });

    if (success) {
      alert("Event created successfully!");
      router.push("/dashboard");
    } else {
      alert("Event time overlaps with another event.");
    }
  };

  return (
    <div className="min-h-[94vh] flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-2 py-8">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-6 sm:p-10">
        <h1 className="text-3xl font-bold mb-6 text-blue-700 drop-shadow-sm text-center">Create Event</h1>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ values }) => (
            <Form className="flex flex-col gap-6">
              <div>
                <Field name="title" placeholder="Event Title" className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-100 transition" />
                <ErrorMessage name="title" component="div" className="text-red-500 text-xs mt-1" />
              </div>
              <div>
                <Field as="textarea" name="description" placeholder="Event Description" className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-100 transition" />
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
                  <Field name="location" placeholder="Location" className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-100 transition" />
                  <ErrorMessage name="location" component="div" className="text-red-500 text-xs mt-1" />
                </div>
              )}
              {values.eventType === "Online" && (
                <div>
                  <Field name="eventLink" placeholder="Event Link" className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-100 transition" />
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
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 focus:bg-blue-800 text-white font-semibold py-2 rounded-lg transition-all duration-150 shadow w-full">
                Create Event
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EventForm;
