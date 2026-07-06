const linkClass =
  "group/link relative flex items-center justify-center uppercase transition-transform ease-in-out hover:text-foreground active:scale-95";

export default function Home() {
  return (
    <div
      className="flex flex-col items-center justify-center text-center transition-colors duration-150 ease-out has-[a:hover]:text-foreground/10"
      data-copy-wrapper="true"
    >
      <div className="w-fit font-display text-3xl uppercase lg:text-6xl">
        Yo &apos;m Axyl
      </div>

      <div className="w-fit font-display text-3xl uppercase lg:text-6xl">
        and i build stuff
      </div>

      <div className="w-fit font-display text-3xl uppercase lg:text-6xl">
        Archive — 26
      </div>

      <p className="mt-5 font-helvetica-neue text-sm opacity-55 lg:text-base">
        Creative Developer &
      </p>

      <p className="mb-5 font-helvetica-neue text-sm opacity-55 lg:-mt-1 lg:text-base">
        Full Stack Developer
      </p>

      <a
        aria-label="[truonggiang.axyl@gmail.com]"
        className={linkClass}
        href="mailto:truonggiang.axyl@gmail.com"
        rel="noopener"
        target="_blank"
      >
        <span className="font-display text-3xl uppercase lg:text-6xl">
          [say hello]
        </span>
      </a>

      <a
        aria-label="[ui.soralabs.io.vn]"
        className={linkClass}
        href="https://ui.soralabs.io.vn"
        rel="noopener"
        target="_blank"
      >
        <span className="font-display text-3xl uppercase lg:text-6xl">
          [ui.soralabs.io.vn]
        </span>
      </a>
    </div>
  );
}
