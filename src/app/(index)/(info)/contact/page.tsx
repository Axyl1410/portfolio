// "use client";

import { ConstructionPage } from "@/components/construction-page";

// import type { ComponentProps } from "react";
// import { sileo } from "sileo";
// import { sendContact } from "./actions";

// // type FormSubmitHandler = ComponentProps<"form">["onSubmit"];

export default function ContactForm() {
  // const handleSubmit: FormSubmitHandler = (e) => {
  //   e.preventDefault();

  //   const formData = new FormData(e.currentTarget);

  //   const promise = sendContact(formData);

  //   sileo.promise(promise, {
  //     loading: {
  //       title: "Sending...",
  //     },
  //     success: () => ({
  //       title: "Success",
  //       description: "Thank you for contacting us.",
  //     }),
  //     error: (err) => ({
  //       title: "Failed",
  //       description: err instanceof Error ? err.message : "An error occurred",
  //     }),
  //   });
  // };

  return (
    // <form onSubmit={handleSubmit}>
    //   <label htmlFor="name">Name</label>
    //   <input id="name" name="name" />

    //   <label htmlFor="email">Email</label>
    //   <input id="email" name="email" />

    //   <label htmlFor="message">Message</label>
    //   <textarea id="message" name="message" />

    //   <button type="submit">Send</button>
    // </form>
    <ConstructionPage />
  );
}
