const aboutSections = [
  {
    label: "origin",
    paragraphs: [
      "I don't think I've changed much.",
      "I was a weird kid, born in a rural town in northern India.",
      "When I was 3 my family moved to California. It was 5 of us crammed into a tiny 1 bedroom apartment just south of Oak Park, Sacramento, CA. The neighbors were kind.. but you learned pretty quickly which streets not to wander down.",
      "Fortunately, my parents worked hard and we made it to the suburbs of Natomas. Nothing posh but at least I could ride my bike around the neighborhoods without worry.",
    ],
  },
  {
    label: "home",
    paragraphs: [
      "From the outside, my childhood probably looked pretty normal. Science fairs, skateboarding, soccer games, and the occasional family vacation.",
      "If you looked closer, you'd see things were shaky at home. I'd always worry whether the police would be at our door on my walks home from elementary school. I remember many nights spent in hospitals, McDonalds parking lots, or relying on the generosity of strangers.",
      "My rock was always my mom. She never let me miss a day of school or a soccer game. I remember one night when she drove herself to the hospital covered in blood. We spent the night there together, and the next morning she still drove me to school.",
      "To survive, you learned to pay attention. To notice shifts in energy. To calm people down. To understand what someone needed before they said it out loud. Later, that same instinct helped me in sales, leadership, and product building.",
      "My story is not unique. Most of us aren't born holding pocket aces. If we were, we wouldn't have become the same people. So I am learning to be grateful for the lows as much as the highs.",
    ],
  },
  {
    label: "curiosity",
    paragraphs: [
      "My mother was an angel, and I wish I could say I made it easy on her.",
      "At four, I snuck out of my daycare to explore the neighborhood. The police found me a half mile away sitting on the curb of an intersection.",
      "At five, I was sneaking out of the house and knocking on neighbors' doors asking if I could tour their homes. Surprisingly, a lot of them said yes, and we became friends. At seven, my parents found me digging two-foot holes all over the backyard because I was convinced I'd find fossils.",
      'At eight, after becoming obsessed with Dexter\'s Laboratory cartoon, I turned my bedroom closet into a "lab" and started mixing every substance I could find in the house. For the record, bleach and vinegar do not mix well.',
      "I have been told these are not normal things.",
      "There are more stories, but some are probably better left off the internet. Basically, I was curious about everything and usually off doing something questionable. Eventually, I started recruiting the other kids. Their parents were less thrilled.",
      "When I wasn't doing that, I was reading fiction, encyclopedias, or whatever else I could get my hands on. Collecting information long before I knew what to do with it.",
      "It only took me 20 years and a stack of self-assessments to realize I have a pinch of the 'tism and a dash of ADHD. Who would've figured.",
    ],
  },
  {
    label: "school",
    paragraphs: [
      "Fortunately that same wiring meant that I was pretty good at the school thing, and most other things I picked up, without trying all that hard.",
      'In middle school, I was placed in an accelerated math and science program. I almost immediately landed on academic probation because I refused to do the assignments. My teacher was baffled. She pulled me aside and said, "You scored higher on the math entrance exam than any student before you. The faculty wanted to put you in high school math in sixth grade."',
      "In eighth grade that same teacher caught me copying my friend's math homework and suspended me. Oops.",
      "Eventually, I got my shit together long enough to win our local science fair and make it to the district competition. I built two functioning hovercrafts out of plywood, tarp, and leaf blowers. They floated three or four inches off the ground, and yes, you could sit on them.",
      "The only problem was that they had to be plugged in, so you only got about twenty feet of glory before someone had to push you back. Still cool.",
    ],
  },
  {
    label: "systems",
    paragraphs: [
      "Around that same age, my experiments moved from the backyard to the computer.",
      "I became obsessed with RuneScape, a massive online medieval game where thousands of players shared the same world. It had a complex in-game economy, 24 unique skills, and the social dynamics felt surprisingly real.",
      "What hooked me was the scale. Playing normally meant thousands of hours of grinding, which of course meant I wanted to find a way around it. It was also a place where I could talk to people without the usual baggage of age, status, or appearance, and study how they behaved when all they had were words, incentives, and a little avatar on a screen.",
      "Naturally I started testing the limits of both the game and the people inside it.",
      "One early discovery was that your avatar changed how people treated you. If I played as a female character, strangers were more generous and more likely to engage. If I played as a male character, not so much. I was twelve, so naturally I turned that observation into a morally questionable little automation experiment. I wrote scripts that asked other players for free stuff while I was away from the keyboard.",
      "That made me a lot of in-game currency.",
      "That's also where my love affair with automation began.",
      "Later I discovered auto-clickers and wrote some very basic scripts for color detection. Stringing together basic automations to gather in-game resources, like wood, fish, and ores, which you could then sell on their Grand Exchange system for in-game currency.",
      "Eventually, I bought almost everything I wanted in the game and ran out of things to do with the money. So naturally, I looked outside the game and found online exchanges where people traded in-game currency for real-world cash. The exchange rate was trash, but at twelve a few thousand dollars was a fortune.",
      "I was not thinking about engineering or startups back then. I just liked systems. Games, people, incentives, rules, loopholes, and leverage.",
      "That thread has followed me ever since.",
    ],
  },
  {
    label: "usefulness",
    paragraphs: [
      "I have founded companies, worked on products, sold things, built things, broken things, and learned the hard way that being clever is not the same as being useful.",
      "The older I get, the more interested I am in building things that actually help people. Tools that make work easier, ideas easier to express, and complicated systems easier to navigate.",
      "I am still that curious kid in a lot of ways. Still collecting information. Still testing assumptions. Still drawn to strange corners of the world.",
      "The difference is that now I care a lot more about what the work does for other people.",
    ],
  },
  {
    label: "now",
    paragraphs: [
      "In my twenties, I took big swings and went broad. I founded companies, sold things, built things, and broke things. Learning from both the wins and the times I fell flat on my face.",
      "In my thirties, I'm trying to turn that breadth into depth while adding some stability to life. I'm most interested in work at the intersection of technology and society. AI, robotics, space, infrastructure, and the systems that shape how people live.",
      "Those fields come with as many moral and psychological questions as technical ones. That is part of what draws me to them. I want to earn my place in rooms where technology is not just built, but developed, distributed, and adopted with care.",
      "For a long time, the world rewarded specialization. People got very good at very specific things. I think the next era will reward people who can move between disciplines, connect ideas, and build things that no single field could have produced on its own.",
      "That has always been where I feel most alive. Somewhere between the machine and the people using it, between the system and the social contract behind it.",
      "If you've made it this far, maybe you're my kind of human and we should connect.",
    ],
  },
];

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
          <p className="mt-4 max-w-4xl text-base leading-7 text-graphite">
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
                <p className="mt-3 max-w-md text-base leading-7 text-graphite">
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
                <p className="mt-3 max-w-md text-base leading-7 text-graphite">
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
                <p className="mt-3 max-w-2xl text-base leading-7 text-graphite">
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

        <section className="mt-14">
          <h2 className="font-mono text-base font-semibold uppercase tracking-normal text-ink">
            About
          </h2>
          <div className="mt-5 max-w-4xl space-y-10 text-base leading-7 text-graphite">
            {aboutSections.map((section, sectionIndex) => (
              <div
                key={section.label}
                className="grid gap-4 border-t border-ink/10 pt-6 first:border-t-0 first:pt-0 sm:grid-cols-[8rem_1fr]"
              >
                <div className="font-mono text-xs leading-7 uppercase text-graphite/50">
                  {String(sectionIndex + 1).padStart(2, "0")} / {section.label}
                </div>
                <div className="space-y-4">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
