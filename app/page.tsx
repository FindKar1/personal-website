export default function Home() {
  return (
    <main
      className="min-h-screen bg-white px-6 py-8 text-ink sm:px-10 sm:py-12"
      style={{
        backgroundImage: [
          "radial-gradient(circle at 18% 12%, rgba(23, 21, 17, 0.018), transparent 22rem)",
          "radial-gradient(circle at 84% 72%, rgba(94, 124, 134, 0.025), transparent 26rem)",
          "repeating-linear-gradient(0deg, rgba(23, 21, 17, 0.016) 0 1px, transparent 1px 5px)",
          "repeating-linear-gradient(90deg, rgba(23, 21, 17, 0.01) 0 1px, transparent 1px 7px)",
          "radial-gradient(circle, rgba(23, 21, 17, 0.08) 0 0.45px, transparent 0.65px)",
        ].join(", "),
        backgroundSize: "auto, auto, 100% 9px, 11px 100%, 17px 17px",
      }}
    >
      <div className="mx-auto max-w-5xl">
        <header className="mb-10">
          <h1 className="font-mono text-base font-semibold uppercase tracking-normal text-ink">
            Kar Dhillon
          </h1>
          <p className="mt-4 max-w-4xl text-sm leading-6 text-graphite">
            Founder, product strategist, and operator focused on turning
            ambitious technical ideas into clear products, teams, and companies.
            I work across AI, automation, and emerging technologies, helping
            shape vision, stress-test strategy, and align the people and
            resources needed to bring complex systems into the real world.
          </p>
        </header>

        <section>
          <h2 className="font-mono text-base font-semibold uppercase tracking-normal text-ink">
            My work &amp; projects
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="min-h-44 border border-ink/15 bg-white/35 p-5 text-ink">
              <div className="flex h-full flex-col">
                <p className="text-base font-semibold">Bytespace Labs</p>
                <p className="mt-3 max-w-md text-sm leading-6 text-graphite">
                  Healthcare AI infrastructure for turning clinical work into
                  usable data, automation, and intelligence systems.
                </p>
                <div className="mt-auto flex items-center justify-between gap-4 pt-8 text-sm">
                  <a
                    href="https://www.bytespace.ai"
                    className="font-medium text-ink underline decoration-ink/25 underline-offset-4 transition-colors hover:decoration-ink"
                  >
                    bytespace labs -&gt;
                  </a>
                  <span className="text-graphite/70">Founder &amp; CEO</span>
                </div>
              </div>
            </div>

            <div className="min-h-44 border border-ink/15 bg-white/35 p-5 text-ink">
              <div className="flex h-full flex-col">
                <p className="text-base font-semibold">Bot0 Agent Harness</p>
                <p className="mt-3 max-w-md text-sm leading-6 text-graphite">
                  Agent tooling for building, testing, and operating AI systems
                  across real software workflows.
                </p>
                <div className="mt-auto flex items-center justify-between gap-4 pt-8 text-sm">
                  <a
                    href="https://www.bot0.dev"
                    className="font-medium text-ink underline decoration-ink/25 underline-offset-4 transition-colors hover:decoration-ink"
                  >
                    bot0.dev -&gt;
                  </a>
                  <span className="text-graphite/70">Founder &amp; CEO</span>
                </div>
              </div>
            </div>

            <div className="min-h-44 border border-ink/15 bg-white/35 p-5 text-ink">
              <div className="flex h-full flex-col">
                <p className="text-base font-semibold">Cmd0 Chrome Extension</p>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-graphite">
                  Web automation product for building and managing AI agents
                  across websites, workflows, and business operations.
                </p>
                <div className="mt-auto flex items-center justify-between gap-4 pt-8 text-sm">
                  <a
                    href="https://www.cmd0.dev"
                    className="font-medium text-ink underline decoration-ink/25 underline-offset-4 transition-colors hover:decoration-ink"
                  >
                    cmd0.dev -&gt;
                  </a>
                  <span className="text-graphite/70">Founder &amp; CEO</span>
                </div>
              </div>
            </div>

            <div
              aria-hidden="true"
              className="hidden min-h-44 border border-dashed border-ink/15 md:block"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(135deg, rgba(23, 21, 17, 0.035) 0 1px, transparent 1px 10px)",
              }}
            />
          </div>

          <div className="mt-10">
            <h3 className="text-base font-semibold text-ink">Experience</h3>
            <div className="mt-4 divide-y divide-ink/10 border-y border-ink/10">
              {[
                {
                  company: "Bytespace Labs",
                  role: "Founder & CEO",
                  focus: "Software & AI",
                  period: "May 2024 - Present",
                },
                {
                  company: "Certa",
                  role: "VP, Business Development",
                  focus: "Software",
                  period: "Dec 2021 - Mar 2023",
                },
                {
                  company: "6x7 Networks",
                  role: "Head of Growth",
                  focus: "Hardware & Infra",
                  period: "Sep 2018 - Nov 2021",
                },
                {
                  company: "Paladin Partners",
                  role: "Founder & Executive Director",
                  focus: "Consulting",
                  period: "Jul 2017 - Oct 2019",
                },
                {
                  company: "Startup Grind Berkeley",
                  role: "Founder & Chapter Director",
                  focus: "Events / Community",
                  period: "Jul 2018 - Jan 2022",
                },
                {
                  company: "UC Berkeley Sutardja Center (SCET)",
                  role: "Student Instructor",
                  focus: "Education",
                  period: "Nov 2016 - Dec 2017",
                },
              ].map((experience) => (
                <div
                  key={`${experience.company}-${experience.role}`}
                  className="grid gap-1 py-3 text-sm sm:grid-cols-[1.05fr_1fr_0.75fr_0.8fr] sm:gap-4"
                >
                  <p className="font-medium text-ink">{experience.company}</p>
                  <p className="text-graphite">{experience.role}</p>
                  <p className="text-graphite/70">{experience.focus}</p>
                  <p className="text-graphite/70 sm:text-right">
                    {experience.period}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-14">
          <h2 className="font-mono text-base font-semibold uppercase tracking-normal text-ink">
            Latest Writing &amp; Research
          </h2>
          <div className="mt-4 border-y border-ink/10">
            <a
              href="https://www.bytespace.ai/blog/simulations-are-theories-of-what-matters"
              className="grid gap-1 py-3 text-sm sm:grid-cols-[1.4fr_0.7fr_0.6fr] sm:gap-4"
            >
              <p className="font-medium text-ink underline decoration-ink/20 underline-offset-4 transition-colors hover:decoration-ink">
                Simulations Are Theories of What Matters
              </p>
              <p className="text-graphite/70">Bytespace Labs</p>
              <p className="text-graphite/70 sm:text-right">
                June 23, 2026
              </p>
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
