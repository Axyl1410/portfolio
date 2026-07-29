"use client";

import {
  InlineTestimonials,
  type Testimonial,
} from "@/components/sora-ui/disclosure/inline-testimonials";

const GITHUB_AVATAR = "https://sora.axyl.io.vn/media/avt.webp";

const X_AVATAR =
  "https://avatars.githubusercontent.com/u/142161991?s=400&u=dd40d6056600c4e7da605a618cfecea2f7c3da76&v=4";

const ELSEWHERE: Testimonial[] = [
  {
    id: "sora-ui",
    text: "Building a motion-first React registry — not a library. Copy, tweak, ship.",
    author: {
      name: "Sora UI",
      role: "ui.soralabs.io.vn",
      avatar: "/sora-ui-icon.png",
    },
  },
  {
    id: "x",
    text: "WIPs, thoughts, and the small details that make an interface feel alive.",
    author: {
      name: "X",
      role: "@axyl1410",
      avatar: X_AVATAR,
    },
  },
  {
    id: "github",
    text: "Full-stack by trade, front-end at heart — source and experiments live here.",
    author: {
      name: "GitHub",
      role: "github.com/axyl1410",
      avatar: GITHUB_AVATAR,
    },
  },
];

export default function About() {
  return (
    <div className="w-full max-w-3xl px-4 py-24 text-left">
      <InlineTestimonials
        className="text-lg! lg:text-3xl!"
        interaction="both"
        reveal={{ viewportMargin: "0px" }}
        testimonials={ELSEWHERE}
      />
    </div>
  );
}
