import localFont from "next/font/local";

export const helveticaNeue = localFont({
  src: [
    {
      path: "../../public/fonts/HelveticaNeue/HelveticaNeueRoman.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/HelveticaNeue/HelveticaNeueItalic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/HelveticaNeue/HelveticaNeueMedium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/HelveticaNeue/HelveticaNeueMediumItalic.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../public/fonts/HelveticaNeue/HelveticaNeueBold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/HelveticaNeue/HelveticaNeueBoldItalic.otf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-helvetica-neue",
  display: "swap",
});

export const optiRomanaRoman = localFont({
  src: [
    {
      path: "../../public/fonts/OPTIRomanaRoman/OPTIRomanaRoman-Normal.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/OPTIRomanaRoman/OPTIRomanaRoman-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-opti-romana",
  display: "swap",
});
