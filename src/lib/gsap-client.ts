"use client";

import { useGSAP as useGSAPBase } from "@gsap/react";
import gsapBase from "gsap";

// Register React plugin once in a single place
gsapBase.registerPlugin(useGSAPBase);

export const gsap = gsapBase;
export const useGSAP = useGSAPBase;
