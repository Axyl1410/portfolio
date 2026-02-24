import Link from "next/link";
import { ROUTES, SOCIALS } from "@/lib/nav-shared";
import { Button } from "../ui/button";

export default function Footer() {
  return (
    <footer className="pt-(--section-padding) pb-(--row-gap)">
      <div className="u-container px-0!">
        <div className="u-footer-header relative flex w-full">
          <div className="relative flex w-full flex-col pb-[calc(var(--row-gap)*2.5)]">
            <h2 className="font-medium text-[calc(var(--title-size)*0.5)] leading-[1.1]">
              Footer
            </h2>
          </div>

          <div className="u-footer-backtop-header relative flex flex-col pt-[1em]">
            <Button className="whitespace-nowrap uppercase">Back to top</Button>
          </div>

          <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-px bg-(--color-border)" />
        </div>

        <div className="u-footer-main flex w-full gap-[var(--row-gap)var(--gap)]">
          <div className="flex flex-1 flex-col items-start justify-between gap-[calc(var(--row-gap)*2)] pt-[1em]">
            <p className="max-w-[27em] text-(--color-gray) text-[1.25em] leading-[1.36]">
              Let's create something cool! I'm always open to new projects and
              connections. You can also use the [Contact] page, it's pretty
              awesome.
            </p>
            <div className="flex">
              <Button className="whitespace-nowrap uppercase">
                truonggiang.axyl@gmail.com
              </Button>
            </div>
          </div>

          <div className="flex flex-1 flex-col items-end pt-[1em]">
            <div className="u-footer-grid grid w-full grid-cols-2 justify-items-end gap-[var(--row-gap)calc(((100vw-(var(--col-gap)*2))-(var(--nav-col-width)*4))/3)]">
              <div className="flex w-full flex-col justify-start">
                <div className="text-(--color-gray) text-[0.725em]">
                  Sitemap
                </div>
                <div className="flex flex-wrap font-medium uppercase">
                  {ROUTES.map((route, index) => (
                    <span key={route.label}>
                      <Link href={route.url}>{route.label}</Link>
                      {index < ROUTES.length - 1 && <span>{",\u00A0"}</span>}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex w-full flex-col justify-start">
                <div className="text-(--color-gray) text-[0.725em]">
                  Let's connect
                </div>
                <div className="flex flex-wrap font-medium uppercase">
                  {SOCIALS.map((social, index) => (
                    <span key={social.label}>
                      <Link href={social.url}>{social.label}</Link>
                      {index < SOCIALS.length - 1 && <span>{",\u00A0"}</span>}
                    </span>
                  ))}
                </div>
              </div>

              <div className="col-span-2 h-px w-full bg-(--color-border)" />

              <div className="flex w-full flex-col justify-start">
                <div className="text-(--color-gray) text-[0.725em]">
                  Credits
                </div>
                <div className="font-medium uppercase">
                  <p>Truong Giang [DEV]</p>
                </div>
              </div>

              <div className="flex w-full flex-col justify-start">
                <div className="text-(--color-gray) text-[0.725em]">
                  Copyright
                </div>
                <div className="font-medium uppercase">
                  <p>Truong Giang™, 2026</p>
                  <p>© ALL RIGHTS RESERVED</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="u-footer-bottom-mobile mt-(--row-gap) hidden flex-col">
          <div className="h-px w-full bg-(--color-border)" />

          <div className="py-[0.75em] text-(--color-gray) text-[0.725em]">
            Credits
          </div>

          <div className="font-medium uppercase">
            <p>Truong Giang [DEV]</p>
          </div>

          <div className="my-(--row-gap) h-px w-full bg-(--color-border)" />

          <div className="py-[0.75em] text-(--color-gray) text-[0.725em]">
            Copyright
          </div>

          <div className="font-medium uppercase">
            <p>Truong Giang™, 2026</p>
            <p>© ALL RIGHTS RESERVED</p>
          </div>

          <div className="my-(--row-gap) h-px w-full bg-(--color-border)" />

          <div className="u-footer-backtop-mobile flex w-full justify-start">
            <Button className="whitespace-nowrap uppercase">Back to top</Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
