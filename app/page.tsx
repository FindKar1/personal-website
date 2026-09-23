import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
import { PortfolioCollection } from "@/components/PortfolioCollection";
import { ProductDesign } from "@/components/ProductDesign";
import { ArchiveTalks, ProductDemos } from "@/components/PortfolioVideos";
import { LegacyProfileLinks } from "@/components/LegacyProfileLinks";
import { NotebookCollage } from "@/components/NotebookCollage";
import { Biography } from "@/components/Biography";
import { PhotoGallery } from "@/components/PhotoGallery";
import { ArchiveTravel } from "@/components/ArchiveTravel";
import { getProfileLocation, profileLabels, profileTabs, type QueryValue } from "./profile-navigation";
import systemsAssets from "./systems-assets.json";
import {
  archiveArtifactSections,
  notesArtifactSections,
  workArtifactSections,
  type MediaSection,
} from "./media-artifacts";

const wordmarkFont = localFont({
  src: "../public/showcases/bytespace/assets/fonts/GeneralSans-Variable.woff2",
  weight: "700",
  display: "swap",
});

const aboutSections = [
  {
    label: "origin",
    paragraphs: [
      "I don't think I've changed much.",
      "I was a weird kid, born in a rural town in northern India.",
      "When I was three, my family moved to California. There were five of us crammed into a tiny one-bedroom apartment just south of Oak Park in Sacramento. The neighbors were kind... but you learned pretty quickly which streets not to wander down.",
      "Fortunately, my parents worked hard and we made it to the suburbs of Natomas. It was still Sac, and not super posh, but I could ride my bike around the neighborhood without worry.",
    ],
  },
  {
    label: "home",
    paragraphs: [
      "From the outside, my childhood probably looked pretty normal. Taekwondo, skateboarding, soccer games, and the occasional family vacation.",
      "If you looked closer, you'd see things were shaky at home. On my walks home from elementary school, I'd always worry whether the police would be at our door. I remember nights spent in hospitals and McDonald's parking lots, and how often we relied on the generosity of strangers.",
      "My rock was always my mom. She never let me miss a day of school or soccer practice. I remember one night when she drove herself to the hospital covered in blood. We spent the night there together, and the next morning she still drove me to school.",
      "To survive, you learned to pay attention. To notice shifts in energy. To calm people down. To understand what someone needed before they said it out loud. That habit stayed with me. I still want to understand what's going on underneath what people say and do.",
      "My story isn't unique. Most of us aren't born holding pocket aces. If we were, we wouldn't have become the same people. So I'm learning to be as grateful for the lows as I am for the highs.",
    ],
  },
  {
    label: "curiosity",
    paragraphs: [
      "Through all of that, my mother was an angel. I wish I could say I made it easy on her.",
      "At four, I snuck out of my daycare to explore the neighborhood. The police found me a half mile away sitting on the curb at an intersection.",
      "At five, I was sneaking out of the house and knocking on neighbors' doors asking if I could tour their homes. Surprisingly, many said yes, and we became friends.",
      "At seven, an archaeology documentary convinced me I'd find fossils in our backyard. My parents found me digging two-foot holes all over it.",
      'At eight, after becoming obsessed with the cartoon Dexter\'s Laboratory, I turned my bedroom closet into a "lab" and started mixing every substance I could find in the house. For the record, bleach and vinegar do not mix well.',
      "I have been told these are not normal things.",
      "I was curious about everything and usually off doing something questionable. Eventually, I started recruiting the other kids. Their parents were less thrilled.",
      "When I wasn't doing that, I was reading fiction, encyclopedias, the dictionary, or whatever else I could get my hands on. Collecting information long before I knew what to do with it.",
      "It only took me twenty years and a stack of autism and ADHD self-assessments to go, \"Well, that explains a few things.\"",
    ],
  },
  {
    label: "school",
    paragraphs: [
      "School came pretty easily to me. Learning how to follow through took longer.",
      "In middle school, I was placed in an accelerated math and science program. I almost immediately landed on academic probation because I refused to do the assignments.",
      'My teacher was baffled. One day she pulled me aside and said, "You scored so high on the entrance exam that the faculty wanted to put you in high school math in sixth grade."',
      "Eventually, I got my shit together and won our local science fair, which took me to the district competition. I'd built two functioning hovercrafts out of plywood, tarp, and leaf blowers. They floated three or four inches off the ground, and yes, you could sit on them.",
      "The only problem was that they had to be plugged in, so you only got about twenty feet of glory before someone had to push you back. Still cool.",
    ],
  },
  {
    label: "systems",
    paragraphs: [
      "Around that same age, my experiments moved from the backyard to the computer.",
      "I became obsessed with RuneScape, a massive online medieval game where thousands of players shared the same world. It had a complex in-game economy and 24 unique skills. The social dynamics felt surprisingly real.",
      "What hooked me was the scale. Playing normally meant thousands of hours of grinding, which of course meant I wanted to find a way around it.",
      "It was also a place where I could talk to people without the usual baggage of age, status, or what I looked like in real life. I could study how they behaved when all they had were words, incentives, and a little avatar on a screen.",
      "I started testing the limits of both the game and the people inside it.",
      "One early discovery was that strangers were more generous if I played as a female character. I was twelve, so naturally I turned that observation into a morally questionable little automation experiment. I wrote scripts that asked other players for free stuff while I was away from the keyboard.",
      "That's also where my love affair with automation began.",
      "Later, I discovered auto-clickers and started writing basic color-detection scripts to gather wood, fish, and ores. I could sell those resources for in-game currency without spending hours collecting them myself.",
      "Eventually, I bought almost everything I wanted in the game and ran out of things to do with the money. So I looked outside the game and found online exchanges where people traded in-game currency for real-world cash. The exchange rate was trash, but at twelve a few thousand dollars was a fortune.",
      "I was not thinking about engineering or startups back then. I just liked systems. Games, people, incentives, rules, loopholes, and leverage.",
    ],
  },
  {
    label: "usefulness",
    paragraphs: [
      "That curiosity followed me into college, where I started as a physics major on a pre-med track. But I quickly realized I wasn't ready to commit the next decade of my life to a path I was already questioning.",
      "I wanted to learn everything.",
      "At UC Berkeley, I took courses in psychology, chemistry, biology, physics, philosophy, economics, and political science. I was learning from Nobel laureates and people who had spent their lives studying things I'd barely heard of. How could I pass up the chance to learn from them?",
      "I also found my way to the Sutardja Center for Entrepreneurship and Technology at Cal. Starting a company sounded like a pretty good excuse to keep learning about all of it. Except now I'd have to figure out how to make something useful out of what I knew.",
      "The summer after freshman year, I went to Nice, France, for the European Innovation Academy. A hundred teams had a month to turn an idea into a startup. We pitched in front of 400 people and placed 11th.",
      "I was hooked.",
      "Two years later, I was back at the same accelerator, this time as a mentor in Turin, Italy. That's where I founded Paladin Partners. We spent a month living out of a 5x8 ft room getting the company off the ground. The work eventually took us to Lisbon, Estonia, South Korea, and California.",
      "Since then, I've closed tens of millions in business and worked across software, infrastructure, events, and even nonprofits. The settings kept changing, but my questions stayed the same. How does this work? Why do people do it this way? Could we make it better?",
      "I've learned the hard way that being clever is not the same as being useful. The older I get, the more interested I am in building things that actually help people. Tools that make work easier, ideas easier to express, and complicated systems easier to navigate.",
      "In a lot of ways, I'm still that curious kid. Still collecting information. Still testing assumptions. Still drawn to strange corners of the world.",
      "The difference is that now I care a lot more about what the work does for other people.",
    ],
  },
  {
    label: "now",
    paragraphs: [
      "In my twenties, I took big swings and tried a lot of different things. In my thirties, I'm more deliberate about where I go deep and what I commit to building.",
      "I'm most interested in work at the intersection of technology and society. AI, robotics, space, infrastructure, and the systems that shape how people live.",
      "Those fields don't just raise technical questions. They raise moral and psychological ones too. That's part of what draws me to them. I want a hand in how those technologies are built, who gets access to them, and what they actually do for people.",
      "That's where I've always felt most alive. Somewhere between the machine and the people using it, between the system and the social contract behind it.",
      "If you've made it this far, maybe you're my kind of human. We should talk.",
    ],
  },
];

type HomeProps = {
  searchParams?: Promise<{
    tab?: QueryValue;
    view?: QueryValue;
  }>;
};

function ArchivePreview() {
  const photos = workArtifactSections[0].items.filter((artifact) =>
    [
      "/media/optimized/archive-infrastructure-rooftop-panorama.webp",
      "/media/optimized/archive-infrastructure-basement-network-build.webp",
      "/media/optimized/archive-startup-grind-startup-grind-sac-tv.webp",
    ].includes(artifact.src),
  );

  return (
    <section aria-label="From the archive" className="my-6">
      <Link
        href="/?tab=archive"
        aria-label="Explore the archive"
        className="grid grid-cols-2 gap-1 focus-visible:outline-2 focus-visible:outline-offset-4 sm:grid-cols-3"
      >
        {photos.map((photo, index) => (
          <Image
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            unoptimized
            loading="eager"
            sizes="(min-width: 640px) 340px, 50vw"
            className={`h-36 w-full object-cover sm:h-48 lg:h-52 ${index === 2 ? "hidden sm:block" : ""}`}
            style={{ objectPosition: index === 0 ? "66% center" : "center" }}
          />
        ))}
      </Link>
      <div className="mt-3 flex justify-end">
        <Link
          href="/?tab=archive"
          className="inline-flex min-h-8 items-center gap-2 text-sm text-graphite underline decoration-ink/20 underline-offset-4 hover:text-ink hover:decoration-ink"
        >
          Explore the archive <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </section>
  );
}

function SystemsPreview() {
  const previews = [
    { image: systemsAssets["human-agent-architecture"], alt: "Human and agent layers connected through direction, shared memory, and oversight." },
    { image: systemsAssets["shared-memory"], alt: "Shared memory architecture connecting knowledge sources, ingestion, and retrieval for people and agents." },
  ];

  return (
    <section aria-labelledby="systems-preview-heading" className="mt-10 border-t border-ink/10 pt-8">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 id="systems-preview-heading" className="font-mono text-base font-semibold uppercase text-ink">
          Systems
        </h2>
        <Link
          href="/?tab=systems"
          className="inline-flex min-h-9 items-center gap-2 text-sm text-graphite underline decoration-ink/20 underline-offset-4 hover:text-ink hover:decoration-ink"
        >
          Explore systems <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {previews.map(({ image, alt }) => (
          <Link
            key={image.src}
            href="/?tab=systems#ai-architecture"
            className="group min-w-0 focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            <Image
              {...image}
              alt={alt}
              unoptimized
              sizes="(min-width: 1104px) 504px, (min-width: 640px) calc((100vw - 96px) / 2), calc(100vw - 48px)"
              className="aspect-[2/1] w-full border border-ink/10 bg-white object-contain transition-colors group-hover:border-ink/30"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}

function PeoplePhotoCollage({ section }: { section: MediaSection }) {
  return (
    <section
      id="archive-people"
      aria-labelledby="people-heading"
      className="mt-5 grid scroll-mt-6 gap-4 border-t border-ink/10 py-5 sm:grid-cols-[8rem_minmax(0,1fr)]"
    >
      <div className="space-y-2">
        <h3 id="people-heading" className="font-mono text-xs leading-6 uppercase text-graphite/50">
          {section.label}
        </h3>
        <p className="text-sm leading-6 text-graphite/55">
          {section.description}
        </p>
      </div>
      <PhotoGallery photos={section.items} label="People photos" compactFirstRow />
    </section>
  );
}

const workCollageClasses = [
  "col-span-1 aspect-[4/3] sm:col-span-3",
  "col-span-1 aspect-[4/3] sm:col-span-3",
  "col-span-1 aspect-[4/3] sm:col-span-2",
  "col-span-1 aspect-[4/3] sm:col-span-2",
  "col-span-1 aspect-[4/3] sm:col-span-2",
  "col-span-1 aspect-[4/3] sm:col-span-3",
  "col-span-1 aspect-[4/3] sm:col-span-3",
];

function WorkPhotoCollage({ sections }: { sections: MediaSection[] }) {
  const [section] = sections;
  const [hero, ...items] = section.items;
  const collageItems = items.slice(0, -3);
  const [equipmentInventory, mobileRack, proclamation] = items.slice(-3);

  return (
    <div className="mt-5 grid gap-4 border-t border-ink/10 py-5 sm:grid-cols-[8rem_1fr]">
      <div className="space-y-2">
        <p className="font-mono text-xs leading-6 uppercase text-graphite/50">
          {section.label}
        </p>
        <p className="text-sm leading-6 text-graphite/55">
          {section.description}
        </p>
      </div>
      <div className="space-y-1">
        <Image
          src={hero.src}
          alt={hero.alt}
          width={hero.width}
          height={hero.height}
          unoptimized
          priority
          sizes="(min-width: 640px) 768px, 100vw"
          className="w-full border border-ink/10 object-cover"
        />
        <div className="grid grid-cols-2 gap-1 sm:grid-cols-6">
          {collageItems.map((artifact, index) => (
            <div
              key={artifact.src}
              className={`overflow-hidden border border-ink/10 bg-ink/[0.03] ${
                workCollageClasses[index] ?? "col-span-1 aspect-[4/3] sm:col-span-2"
              }`}
            >
              <Image
                src={artifact.src}
                alt={artifact.alt}
                width={artifact.width}
                height={artifact.height}
                unoptimized
                sizes="(min-width: 640px) 256px, 50vw"
                className="h-full w-full object-cover"
                style={
                  artifact.objectPosition
                    ? { objectPosition: artifact.objectPosition }
                    : undefined
                }
              />
            </div>
          ))}
          <div className="col-span-2 grid grid-cols-1 gap-1 sm:col-span-6 sm:grid-cols-3">
            {[equipmentInventory, mobileRack].map((artifact) => (
              <div
                key={artifact.src}
                className="aspect-[4/3] overflow-hidden border border-ink/10 bg-ink/[0.03] sm:aspect-auto sm:h-full"
              >
                <Image
                  src={artifact.src}
                  alt={artifact.alt}
                  width={artifact.width}
                  height={artifact.height}
                  unoptimized
                  sizes="(min-width: 640px) 256px, 100vw"
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
            <div className="aspect-[779/1008] overflow-hidden border border-ink/10 bg-white">
              <Image
                src={proclamation.src}
                alt={proclamation.alt}
                width={proclamation.width}
                height={proclamation.height}
                unoptimized
                sizes="(min-width: 640px) 256px, 100vw"
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const readingSections = [
  {
    category: "Systems",
    description:
      "Civilization, power, institutions, complexity, economics, technology.",
    books: [
      ["The Origins of Political Order", "Francis Fukuyama"],
      ["Understanding Complexity", "Scott E. Page"],
      ["Sapiens", "Yuval Noah Harari"],
      ["A World Without Work", "Daniel Susskind"],
      ["Life Force", "Tony Robbins"],
      ["The Art of War", "Sun Tzu"],
      ["The Prince", "Niccolo Machiavelli"],
      ["The Book of Five Rings", "Miyamoto Musashi"],
      ["1984", "George Orwell"],
      ["Astrophysics for People in a Hurry", "Neil deGrasse Tyson"],
      ["A Mind for Numbers", "Barbara Oakley"],
      ["Foundational Concepts in Neuroscience", "David Presti"],
    ],
  },
  {
    category: "Mind",
    description:
      "Philosophy, psychology, spirituality, trauma, attention, behavior.",
    books: [
      ["Meditations", "Marcus Aurelius"],
      ["Man's Search for Meaning", "Viktor E. Frankl"],
      ["On the Shortness of Life", "Seneca"],
      ["12 Rules for Life", "Jordan B. Peterson"],
      ["Be Water, My Friend", "Shannon Lee"],
      ["The Power of Now", "Eckhart Tolle"],
      ["A New Earth", "Eckhart Tolle"],
      ["The Journey into Yourself", "Eckhart Tolle"],
      ["The Untethered Soul", "Michael A. Singer"],
      ["The Four Agreements", "Don Miguel Ruiz"],
      ["The Fifth Agreement", "Don Miguel Ruiz"],
      ["The Mastery of Love", "Don Miguel Ruiz"],
      ["The Mastery of Self", "Don Miguel Ruiz"],
      ["The Seat of the Soul", "Gary Zukav"],
      ["The Body Keeps the Score", "Bessel van der Kolk"],
      ["Incognito", "David Eagleman"],
      ["The Power of Habit", "Charles Duhigg"],
      ["Daring Greatly", "Brene Brown"],
      ["Awaken the Giant Within", "Tony Robbins"],
      ["The Subtle Art of Not Giving a F*ck", "Mark Manson"],
      ["Unfu*k Yourself", "Gary John Bishop"],
      ["Think Like a Monk", "Jay Shetty"],
      ["What to Say When You Talk to Yourself", "Shad Helmstetter"],
      ["The Secret", "Rhonda Byrne"],
      ["Joy", "Alexander Lowen"],
      ["King, Warrior, Magician, Lover", "Robert Moore"],
    ],
  },
  {
    category: "Building",
    description:
      "Startups, leadership, sales, negotiation, operating, creative work.",
    books: [
      ["Zero to One", "Peter Thiel"],
      ["The Hard Thing About Hard Things", "Ben Horowitz"],
      ["Traction", "Gino Wickman"],
      ["Never Split the Difference", "Chris Voss"],
      ["Exactly What to Say", "Phil M. Jones"],
      ["Secrets of Closing the Sale", "Zig Ziglar"],
      ["Leaders Eat Last", "Simon Sinek"],
      ["The 21 Irrefutable Laws of Leadership", "John C. Maxwell"],
      ["The 15 Invaluable Laws of Growth", "John C. Maxwell"],
      ["Outliers", "Malcolm Gladwell"],
      ["Blink", "Malcolm Gladwell"],
      ["Talking to Strangers", "Malcolm Gladwell"],
      ["Supercommunicators", "Charles Duhigg"],
      ["The War of Art", "Steven Pressfield"],
      ["High Performance Habits", "Brendon Burchard"],
      ["Can't Hurt Me", "David Goggins"],
      ["Think and Grow Rich", "Napoleon Hill"],
      ["How to Own Your Own Mind", "Napoleon Hill"],
      ["How to Fail at Almost Everything and Still Win Big", "Scott Adams"],
      ["The Richest Man in Babylon", "George S. Clason"],
      ["Let the Elephants Run", "David Usher"],
      ["Fluent in 3 Months", "Benny Lewis"],
    ],
  },
  {
    category: "Story",
    description: "Fiction, memoir, myth, biography, narrative.",
    books: [
      ["Shantaram", "Gregory David Roberts"],
      ["The Sympathizer", "Viet Thanh Nguyen"],
      ["The Song of Achilles", "Madeline Miller"],
      ["Piranesi", "Susanna Clarke"],
      ["The Kite Runner", "Khaled Hosseini"],
      ["Gates of Fire", "Steven Pressfield"],
      ["The Razor's Edge", "W. Somerset Maugham"],
      ["The Forty Rules of Love", "Elif Shafak"],
      ["The Alchemist", "Paulo Coelho"],
      ["Manual of the Warrior of Light", "Paulo Coelho"],
      ["Manuscript Found in Accra", "Paulo Coelho"],
      ["The Hitchhiker's Guide to the Galaxy", "Douglas Adams"],
      ["The Girl with the Dragon Tattoo", "Stieg Larsson"],
      ["The Extraordinary Adventures of Arsene Lupin", "Maurice Leblanc"],
      ["The Fountainhead", "Ayn Rand"],
      ["The Inheritors", "William Golding"],
      ["The Catcher in the Rye", "J.D. Salinger"],
      ["The Outsiders", "S.E. Hinton"],
      ["My Side of the Mountain", "Jean Craighead George"],
      ["Percy Jackson and the Olympians", "Rick Riordan"],
      ["Harry Potter", "J.K. Rowling"],
      ["The Shiva Trilogy", "Amish Tripathi"],
      ["Surely You're Joking, Mr. Feynman!", "Richard Feynman"],
      ["What Do You Care What Other People Think?", "Richard Feynman"],
      ["Steve Jobs", "Walter Isaacson"],
      ["Red Notice", "Bill Browder"],
      ["Will", "Will Smith"],
      ["When I Stop Talking, You'll Know I'm Dead", "Jerry Weintraub"],
    ],
  },
];

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const { tab: activeTab, view: notebookView } = getProfileLocation(params?.tab, params?.view);
  const isAbout = activeTab === "about";
  const notesPreview = [
    notesArtifactSections[0].items[0],
    notesArtifactSections[2].items[0],
  ];

  return (
    <main
      className={`min-h-screen bg-white px-6 py-8 text-ink sm:px-10 sm:py-12 ${activeTab === "product" ? "overflow-x-clip" : ""}`}
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
      <LegacyProfileLinks tab={params?.tab} />
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <div className="flex flex-col gap-3 border-b border-ink/15 pb-3 md:flex-row md:items-center md:justify-between md:gap-8">
            <h1 className={`${wordmarkFont.className} shrink-0 text-[23px] font-bold leading-none uppercase tracking-normal text-ink`}>
              <Link href="/" className="inline-flex min-h-11 items-center focus-visible:outline-2 focus-visible:outline-offset-4">
                Kar Dhillon
              </Link>
            </h1>
            <nav
              aria-label="Main navigation"
              className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-sm sm:gap-x-6"
            >
              {profileTabs.map((tab) => (
                <Link
                  key={tab}
                  href={`/?tab=${tab}`}
                  aria-current={activeTab === tab ? "page" : undefined}
                  className={`inline-flex min-h-11 items-center whitespace-nowrap border-b-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 ${
                    activeTab === tab
                      ? "border-ink font-semibold text-ink"
                      : "border-transparent text-graphite hover:border-ink/30 hover:text-ink"
                  }`}
                >
                  {profileLabels[tab]}
                </Link>
              ))}
            </nav>
          </div>
          {isAbout && (
            <div id="about-intro" className="mt-8 text-base leading-7 text-graphite">
              <p className="max-w-4xl text-[22px] font-medium leading-8 text-ink">
                Most of the things I care about started with a question I
                couldn&apos;t leave alone.
              </p>
              <ArchivePreview />
              <div className="max-w-4xl space-y-4">
                <p>Hi, I&apos;m Kar. Welcome to my space!</p>
                <p>
                  I love figuring out how things work, whether that&apos;s a
                  person, a business, or a piece of technology. That curiosity
                  keeps bringing me back to the relationship between technology
                  and society. What can we build? Who gets to use it? How does it
                  change the way we live? I want to understand those questions and
                  have a hand in what comes next.
                </p>
                <p>
                  On this site you&apos;ll find my story, things I&apos;ve built,
                  and some of the frameworks that have helped me along the way.
                  There are also notes from whatever has caught my attention.
                  Some of it is finished work. Some is still taking shape.
                </p>
                <p>
                  I&apos;m looking to meet more people driven by a mission. You
                  might be building a business, studying a difficult problem, or
                  following an interest that&apos;s become an obsession. I&apos;m
                  especially interested in people who care about both what
                  they&apos;re making and what it means for others.
                </p>
              </div>
              <p className="mt-6 max-w-4xl">
                If something here sparks your interest,{" "}
                <a
                  href="#contact"
                  className="whitespace-nowrap font-medium text-ink underline decoration-ink/30 underline-offset-4 transition-colors hover:decoration-ink focus-visible:outline-2 focus-visible:outline-offset-4"
                >
                  reach out
                </a>
                . I&apos;m always happy to make new friends.
              </p>
            </div>
          )}
        </header>

        {isAbout && (
          <>
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
                      role: "Chief Business Officer",
                      focus: "Infrastructure",
                      period: "Oct 2019 - Nov 2021",
                      previousRole: {
                        role: "Director, Business Dev",
                        period: "Sep 2018 - Oct 2019",
                      },
                    },
                    {
                      company: "Startup Grind Berkeley",
                      role: "Founder & Chapter Director",
                      focus: "Community",
                      period: "Jul 2018 - Jan 2022",
                    },
                    {
                      company: "Rainforest Partnership",
                      role: "Director of Partnerships",
                      focus: "Nonprofit",
                      period: "May 2019 - Oct 2019",
                    },
                    {
                      company: "Paladin Partners",
                      role: "Founder & Executive Director",
                      focus: "Consulting",
                      period: "Jul 2017 - Oct 2019",
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
                      <p
                        className={`font-medium text-ink${
                          experience.previousRole
                            ? " sm:col-start-1 sm:row-span-2 sm:row-start-1 sm:self-center"
                            : ""
                        }`}
                      >
                        {experience.company}
                      </p>
                      <p className="text-graphite">{experience.role}</p>
                      <p
                        className={`text-graphite/70${
                          experience.previousRole
                            ? " sm:col-start-3 sm:row-span-2 sm:row-start-1 sm:self-center"
                            : ""
                        }`}
                      >
                        {experience.focus}
                      </p>
                      <p className="text-graphite/70 sm:text-right">
                        {experience.period}
                      </p>
                      {experience.previousRole && (
                        <>
                          <p className="pt-2 text-graphite sm:col-start-2">
                            {experience.previousRole.role}
                          </p>
                          <p className="text-graphite/70 sm:col-start-4 sm:pt-2 sm:text-right">
                            {experience.previousRole.period}
                          </p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="mt-14">
              <h2 className="font-mono text-base font-semibold uppercase tracking-normal text-ink">
                Selected Writing
              </h2>
              <div className="mt-4 border-t border-ink/10">
                <a
                  href="https://bytespace.ai/blog/the-earth-assumption"
                  className="grid gap-1 py-3 text-sm sm:grid-cols-[1.4fr_0.7fr_0.6fr] sm:gap-4"
                >
                  <p className="font-medium text-ink underline decoration-ink/20 underline-offset-4 transition-colors hover:decoration-ink">
                    The Earth Assumption
                  </p>
                  <p className="text-graphite/70">Bytespace Labs</p>
                  <p className="text-graphite/70 sm:text-right">
                    Sep 17, 2026
                  </p>
                </a>
                <a
                  href="https://www.bytespace.ai/blog/simulations-are-theories-of-what-matters"
                  className="grid gap-1 py-3 text-sm sm:grid-cols-[1.4fr_0.7fr_0.6fr] sm:gap-4"
                >
                  <p className="font-medium text-ink underline decoration-ink/20 underline-offset-4 transition-colors hover:decoration-ink">
                    Simulations Are Theories of What Matters
                  </p>
                  <p className="text-graphite/70">Bytespace Labs</p>
                  <p className="text-graphite/70 sm:text-right">
                    Jun 23, 2026
                  </p>
                </a>
              </div>
            </section>
            <SystemsPreview />
          </>
        )}

        <section
          className={isAbout ? "mt-10 scroll-mt-6" : "scroll-mt-6"}
          id="profile"
          aria-labelledby="profile-heading"
        >
          <h2
            id="profile-heading"
            className={isAbout ? "font-mono text-base font-semibold uppercase tracking-normal text-ink" : "sr-only"}
          >
            {isAbout ? "About Me" : profileLabels[activeTab]}
          </h2>

          <div
            key={activeTab}
            className={isAbout ? "profile-panel mt-4 border-t border-ink/10 pt-5" : "profile-panel"}
          >
            {activeTab === "about" && (
              <Biography sections={aboutSections} />
            )}

            {activeTab === "notebook" && (
              <div className="mb-8 w-full">
                <p className="max-w-4xl text-base leading-7 text-graphite">
                  I like getting ideas out of my head and onto paper, and
                  following one question into the next. This is a collection of
                  sketches, whiteboards, half-formed plans, and books I&apos;ve
                  kept along the way.
                </p>
                <nav aria-label="Notebook views" className="mt-5 flex gap-6 border-b border-ink/10 font-mono text-sm">
                  {(["notes", "reading"] as const).map((view) => (
                    <Link key={view} href={`/?tab=notebook&view=${view}`} scroll={false}
                      aria-current={notebookView === view ? "page" : undefined}
                      className={`inline-flex min-h-11 items-center border-b-2 capitalize transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 ${notebookView === view ? "border-ink font-semibold text-ink" : "border-transparent text-graphite/65 hover:border-ink/30 hover:text-ink"}`}>
                      {view}
                    </Link>
                  ))}
                </nav>
              </div>
            )}

            {activeTab === "notebook" && notebookView === "reading" && (
              <div className="w-full">
                <div className="space-y-10">
                  {readingSections.map((section) => (
                    <div
                      key={section.category}
                      className="grid gap-4 border-t border-ink/10 pt-6 first:border-t-0 first:pt-0 sm:grid-cols-[8rem_1fr]"
                    >
                      <div>
                        <p className="font-mono text-xs leading-6 uppercase text-graphite/50">
                          {section.category}
                        </p>
                      </div>
                      <div>
                        <p className="max-w-2xl text-sm leading-6 text-graphite/70">
                          {section.description}
                        </p>
                        <div className="mt-4 divide-y divide-ink/10 border-y border-ink/10">
                          {section.books.map(([title, author]) => (
                            <div
                              key={`${section.category}-${title}`}
                              className="grid gap-1 py-2.5 text-sm leading-6 sm:grid-cols-[1.35fr_1fr] sm:items-center"
                            >
                              <p className="font-medium text-ink">{title}</p>
                              <p className="text-graphite/60 sm:text-right">
                                {author}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "archive" && (
              <div className="w-full">
                <p className="max-w-4xl text-base leading-7 text-graphite">
                  I&apos;ve spent a lot of time moving between very different
                  worlds. Rooftops and data centers, startup workshops, healthcare
                  events, and rooms full of people building something. These are
                  a few photos, conversations, and moments I&apos;ve kept from along the
                  way.
                </p>
                <WorkPhotoCollage sections={workArtifactSections} />
                <ArchiveTalks />
                <PeoplePhotoCollage section={archiveArtifactSections[0]} />
                <ArchiveTravel />
              </div>
            )}

            {activeTab === "notebook" && notebookView === "notes" && (
              <div className="w-full">
                <NotebookCollage />
              </div>
            )}

            {activeTab === "systems" && <PortfolioCollection collection="systems" />}
            {activeTab === "product" && (
              <ProductDesign><ProductDemos /></ProductDesign>
            )}
          </div>
        </section>

        {isAbout && (
          <section
            aria-labelledby="notes-preview-heading"
            className="mt-14 border-t border-ink/10 pt-8"
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 id="notes-preview-heading" className="font-mono text-base font-semibold uppercase text-ink">
                Notes
              </h2>
              <Link
                href="/?tab=notebook&view=notes"
                className="inline-flex min-h-9 items-center gap-2 text-sm text-graphite underline decoration-ink/20 underline-offset-4 hover:text-ink hover:decoration-ink"
              >
                More notes <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
            <Link
              href="/?tab=notebook&view=notes"
              aria-label="Explore the notes"
              className="grid items-start gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 sm:grid-cols-[minmax(0,2.03fr)_minmax(0,1fr)]"
            >
              {notesPreview.map((photo, index) => (
                <Image
                  key={photo.src}
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  unoptimized
                  sizes={index === 0 ? "(min-width: 640px) 680px, 100vw" : "(min-width: 640px) 340px, 100vw"}
                  className="h-auto w-full border border-ink/10"
                />
              ))}
            </Link>
          </section>
        )}

        <footer className={`${activeTab === "product" ? "mt-0" : "mt-16"} scroll-mt-6 border-t border-ink/10 pt-5`} id="contact" tabIndex={-1}>
          <div className="grid gap-2 text-sm leading-6 sm:grid-cols-[8rem_1fr]">
            <p className="font-mono text-xs uppercase text-graphite/50">
              contact
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-1">
              <a
                href="mailto:hello@example.com"
                className="font-medium text-ink underline decoration-ink/20 underline-offset-4 transition-colors hover:decoration-ink"
              >
                Email
              </a>
              <a
                href="https://www.linkedin.com/in/kardhillon/"
                className="font-medium text-ink underline decoration-ink/20 underline-offset-4 transition-colors hover:decoration-ink"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/FindKar1"
                className="font-medium text-ink underline decoration-ink/20 underline-offset-4 transition-colors hover:decoration-ink"
              >
                GitHub
              </a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
