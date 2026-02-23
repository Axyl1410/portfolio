"use client";

import { sileo } from "sileo";
import { Button } from "@/components/ui/button";
import { SplitTextOnScroll } from "@/components/ui/split-text-on-scroll";

const About = () => {
  const showToast = () => {
    sileo.error({
      title: "Something went wrong",
      description: "Please try again later.",
    });
  };

  return (
    <main className="overflow-hidden p-10">
      <SplitTextOnScroll
        className="headline font-bold text-6xl uppercase"
        delay={2}
      >
        Real apps. Real impact.
      </SplitTextOnScroll>
      <Button onClick={showToast}>Show toast</Button>
    </main>
  );
};

export default About;
