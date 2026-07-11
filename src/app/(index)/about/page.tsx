"use client";

import {
  InlineTestimonials,
  type Testimonial,
} from "@/components/sora-ui/disclosure/inline-testimonials";

const GITHUB_AVATAR =
  "https://scontent.fsgn5-3.fna.fbcdn.net/v/t39.30808-6/744294211_1771420487193918_4642625739553204739_n.jpg?stp=dst-jpg_tt6&cstp=mx640x645&ctp=s640x645&_nc_cat=107&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGtrOgCy9cwbuapT9bJHKymB0a7cdQWIhEHRrtx1BYiEdJhsJYUh5qicapcWP2tTXUTw6NjMSuIVbKCEumQCB4x&_nc_ohc=ws5-3yfuIqUQ7kNvwHa6ZJ-&_nc_oc=AdqodJkss9fNr-VXTbefT72_yQyRSGzmmcd1CyxvzvFbJV1lZ8Vm3qQlGxYNSBvyMf4&_nc_zt=23&_nc_ht=scontent.fsgn5-3.fna&_nc_gid=BfBdfDrYR9-IaaRMP4NgBg&_nc_ss=7b2a8&oh=00_AQDljeXW4vVp3zp2LcQWpJDV3thHi81n1udNoCiz6ikWdA&oe=6A57D37D";

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
