"use client";

import { useGSAP as useGSAPBase } from "@gsap/react";
import gsapBase from "gsap";
import { ScrollTrigger as ScrollTriggerBase } from "gsap/ScrollTrigger";
import { SplitText as SplitTextBase } from "gsap/SplitText";

gsapBase.registerPlugin(useGSAPBase, ScrollTriggerBase, SplitTextBase);

export const gsap = gsapBase;
export const useGSAP = useGSAPBase;
export const ScrollTrigger = ScrollTriggerBase;
export const SplitText = SplitTextBase;
