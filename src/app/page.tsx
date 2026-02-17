import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="flex flex-1 flex-col">
        <div className="u-hero">
          <div className="u-hero-title u-text-indent-hero">
            My name is Truong Giang. I'm a{" "}
            <span className="u-text-primary">Versatile Software Engineer</span>{" "}
            based in Vietnam.
          </div>
          <div className="flex">
            <div className="u-pill">truonggiang.axyl@gmail.com</div>
          </div>
        </div>

        <div className="u-bottom mt-auto">
          <div className="u-bottom-content">
            <div className="font-medium text-[1.25em] leading-[1.36]">
              Latest Project
            </div>
            <div className="u-project-card">
              <div className="relative aspect-4/3 w-[12em]">
                <Image
                  alt="Project 1"
                  draggable={false}
                  fill
                  src="/test.webp"
                />
              </div>
              <div className="u-bottom-content">
                <div className="flex flex-col gap-[0.75em]">
                  <div className="u-meta">Branding, Web Design, 2025</div>
                  <div className="line-clamp-2 min-h-[calc((0.8725em*1.36)*2)] text-[1.25em] leading-[1.36]">
                    AXIOM
                  </div>
                </div>
                <div className="flex">
                  <div className="u-pill">view case</div>
                </div>
              </div>
            </div>
          </div>
          <div className="u-meta">Use menu to explore</div>
        </div>
      </div>
      <div className="u-loader-image">
        <Image
          alt="Loading image"
          className="object-cover"
          draggable={false}
          fill
          src="/idk.jpg"
        />
      </div>
    </>
  );
}
