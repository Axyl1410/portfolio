"use client";

import {
  InlineTestimonials,
  type Testimonial,
} from "@/components/sora-ui/disclosure/inline-testimonials";

const GITHUB_AVATAR =
  "https://scontent.fsgn5-3.fna.fbcdn.net/v/t39.30808-6/753164282_1781360012866632_3481077683529585060_n.jpg?stp=dst-jpg_tt6&cstp=mx1536x1546&ctp=s1536x1546&_nc_cat=106&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHWv3mzcq9193vSH725x6Em4TnUJlMkPHPhOdQmUyQ8c6mI8cm6AiKO4ckPzEGmPYbyYyW71oc0ArBWD6HxWwtG&_nc_ohc=g3Z7EfgYwkcQ7kNvwGNi4zI&_nc_oc=Ado3UyTK9c9W4gkoU8MVtzOTb3dpQO1oNHMED2oJvBIMjvuOaeavgOhCrITL05q98Js&_nc_zt=23&_nc_ht=scontent.fsgn5-3.fna&_nc_gid=hbSPZaQG-ZD3fDrhnDE_fg&_nc_ss=7b2a8&oh=00_AQCEmSnmZcLFeWAHUvEQC5jmczq41PLGG-PfzAPR7pzObA&oe=6A68C453";

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
