import personalPhotos from "./personal-photo-assets.json" with { type: "json" };

export type MediaArtifact = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  variant?: "standard" | "wide";
  objectPosition?: string;
  cropAspectRatio?: number;
  rotation?: 90 | 270;
};

export type MediaSection = {
  label: string;
  description: string;
  items: MediaArtifact[];
};

function personalPhoto(id: keyof typeof personalPhotos, alt: string): MediaArtifact {
  return { ...personalPhotos[id], alt };
}

export const notesArtifactSections: MediaSection[] = [
  {
    "label": "models",
    "description": "Sketches, frameworks, systems, and maps of how things fit together.",
    "items": [
      {
        "src": "/media/optimized/notes-whiteboard-systems.webp",
        "alt": "Whiteboard notes on systems, habits, and personal experiments.",
        "width": 1094,
        "height": 718,
        "caption": "Whiteboard notes on systems, habits, and personal experiments.",
        "variant": "wide"
      },
      {
        "src": "/media/optimized/notes-belonging-diagram.webp",
        "alt": "A sketch about fitting in, belonging, and the shape of self.",
        "width": 768,
        "height": 1024,
        "caption": "A sketch about fitting in, belonging, and the shape of self.",
        "variant": "standard"
      },
      {
        "src": "/media/optimized/notes-network-diagram.webp",
        "rotation": 270,
        "alt": "A network sketch comparing resilience, routing, and single points of failure.",
        "width": 768,
        "height": 1024,
        "caption": "A network sketch comparing resilience, routing, and single points of failure.",
        "variant": "standard"
      },
      {
        "src": "/media/optimized/notes-life-systems-board.webp",
        "alt": "A personal operating board across home, friends, product, development, and projects.",
        "width": 1024,
        "height": 768,
        "caption": "A personal operating board across home, friends, product, development, and projects.",
        "variant": "wide"
      },
      {
        "src": "/media/optimized/notes-models-four-elements.webp",
        "alt": "Notebook sketch on elements, strengths, and self-modeling.",
        "width": 1220,
        "height": 1600,
        "caption": "Notebook sketch on elements, strengths, and self-modeling.",
        "variant": "standard"
      },
      {
        "src": "/media/optimized/notes-models-startup-org-chart.webp",
        "rotation": 270,
        "alt": "Notebook operating model for a startup team and advisors.",
        "width": 1200,
        "height": 1600,
        "caption": "Notebook operating model for a startup team and advisors.",
        "variant": "standard"
      },
      {
        "src": "/media/optimized/notes-models-paladin-model.webp",
        "rotation": 270,
        "alt": "Notebook sketch for partners, sourcing, and advisory networks.",
        "width": 1200,
        "height": 1600,
        "caption": "Notebook sketch for partners, sourcing, and advisory networks.",
        "variant": "standard"
      },
      {
        "src": "/media/optimized/notes-models-scorecard-board.webp",
        "alt": "Scorecard and operating system notes.",
        "width": 1600,
        "height": 1200,
        "caption": "Scorecard and operating system notes.",
        "variant": "standard"
      },
      {
        "src": "/media/optimized/notes-models-website-flow-board.webp",
        "alt": "Website flow and conversion model drawn on a whiteboard.",
        "width": 1600,
        "height": 1200,
        "caption": "Website flow and conversion model drawn on a whiteboard.",
        "variant": "standard"
      },
      {
        "src": "/media/optimized/notes-models-rp-oversight-flow.webp",
        "alt": "Operating model for vision, development, and fulfillment.",
        "width": 1600,
        "height": 1200,
        "caption": "Operating model for vision, development, and fulfillment.",
        "variant": "wide"
      },
      {
        "src": "/media/optimized/archive-operating-model-board.webp",
        "alt": "Operating model notes from project generation through retained earnings.",
        "width": 1024,
        "height": 768,
        "caption": "Operating model notes from project generation through retained earnings.",
        "variant": "wide"
      }
    ]
  },
  {
    "label": "planning",
    "description": "Early operating notes, project plans, and messy strategy drafts.",
    "items": [
      {
        "src": "/media/optimized/archive-development-board.webp",
        "alt": "Development and partnership planning from an early operating chapter.",
        "width": 1024,
        "height": 768,
        "caption": "Development and partnership planning from an early operating chapter.",
        "variant": "wide"
      },
      {
        "src": "/media/optimized/notes-planning-sg-berkeley-team-plan.webp",
        "alt": "Early planning notes for Startup Grind Berkeley.",
        "width": 1200,
        "height": 1600,
        "caption": "Early planning notes for Startup Grind Berkeley.",
        "variant": "standard"
      },
      {
        "src": "/media/optimized/notes-planning-paladin-partners-map.webp",
        "alt": "Planning map for Paladin Partners, events, and projects.",
        "width": 900,
        "height": 1600,
        "caption": "Planning map for Paladin Partners, events, and projects.",
        "variant": "standard"
      },
      {
        "src": "/media/optimized/notes-planning-operations-timeline.webp",
        "alt": "Operations timeline across early projects and events.",
        "width": 900,
        "height": 1600,
        "caption": "Operations timeline across early projects and events.",
        "variant": "standard"
      },
      {
        "src": "/media/optimized/notes-planning-uloop-plan.webp",
        "alt": "Uloop launch and operating plan.",
        "width": 1200,
        "height": 1600,
        "caption": "Uloop launch and operating plan.",
        "variant": "standard"
      },
      {
        "src": "/media/optimized/notes-planning-uloop-strategy.webp",
        "rotation": 270,
        "alt": "Notebook strategy map for Uloop launch mechanics.",
        "width": 1200,
        "height": 1600,
        "caption": "Notebook strategy map for Uloop launch mechanics.",
        "variant": "standard"
      },
      {
        "src": "/media/optimized/archive-workspace-startup-grind-mirror-board.webp",
        "alt": "Startup Grind Berkeley planning board from a work desk.",
        "width": 1200,
        "height": 1600,
        "caption": "Startup Grind Berkeley planning board from a work desk.",
        "variant": "standard"
      }
    ]
  },
  {
    "label": "quotes",
    "description": "Collected phrases, reminders, and language that stuck.",
    "items": [
      {
        "src": "/media/optimized/notes-quotes-sticky-notes-wall.webp",
        "alt": "A wall of collected phrases, reminders, and quotes.",
        "width": 1200,
        "height": 1600,
        "caption": "A wall of collected phrases, reminders, and quotes.",
        "variant": "wide"
      }
    ]
  },
  {
    "label": "workspaces",
    "description": "The rooms, walls, and desks where I worked through ideas.",
    "items": [
      {
        "src": "/media/optimized/archive-studio-wall.webp",
        "alt": "Workspace wall with maps, boards, notes, and early company artifacts.",
        "width": 1024,
        "height": 768,
        "caption": "Workspace wall with maps, boards, notes, and early company artifacts.",
        "variant": "wide"
      },
      {
        "src": "/media/optimized/archive-workspace-early-room-wall.webp",
        "alt": "Early room wall with desks, maps, boards, and plans.",
        "width": 1600,
        "height": 1200,
        "caption": "Early room wall with desks, maps, boards, and plans.",
        "variant": "wide"
      }
    ]
  }
];

export const workArtifactSections: MediaSection[] = [
  {
    "label": "work",
    "description": "A few stops along the way.",
    "items": [
      {
        "src": "/media/optimized/archive-infrastructure-rooftop-panorama.webp",
        "alt": "Rooftop infrastructure survey above the city.",
        "width": 1600,
        "height": 373,
        "caption": "Rooftop infrastructure survey above the city.",
        "variant": "wide"
      },
      {
        "src": "/media/optimized/archive-infrastructure-underground-bore.webp",
        "alt": "Field work from an infrastructure deployment.",
        "width": 1200,
        "height": 1600,
        "caption": "Field work from an infrastructure deployment.",
        "variant": "standard"
      },
      {
        "src": "/media/optimized/archive-infrastructure-basement-network-build.webp",
        "alt": "Basement network build with boards, racks, and equipment.",
        "width": 1600,
        "height": 974,
        "caption": "Basement network build with boards, racks, and equipment.",
        "variant": "wide"
      },
      {
        "src": "/media/optimized/archive-early-ventures-google-fca-stage.webp",
        "alt": "Stage moment from a startup program.",
        "width": 1600,
        "height": 1185,
        "caption": "Stage moment from a startup program.",
        "variant": "wide"
      },
      {
        "src": "/media/optimized/archive-early-ventures-workshop-team.webp",
        "alt": "Workshop team session with laptops and notes.",
        "width": 1600,
        "height": 1205,
        "caption": "Workshop team session with laptops and notes.",
        "variant": "standard"
      },
      {
        "src": "/media/optimized/archive-professional-vendor-showcase-fixed.webp",
        "alt": "Vendor showcase from a healthcare event.",
        "width": 768,
        "height": 1024,
        "caption": "Vendor showcase from a healthcare event.",
        "variant": "standard",
        "objectPosition": "center 18%"
      },
      {
        "src": "/media/optimized/archive-professional-rainforest-office.webp",
        "alt": "Rainforest Partnership office session.",
        "width": 1600,
        "height": 1257,
        "caption": "Rainforest Partnership office session.",
        "variant": "standard"
      },
      {
        "src": "/media/optimized/archive-startup-grind-startup-grind-sac-tv.webp",
        "alt": "Startup Grind Berkeley launch event moment.",
        "width": 1179,
        "height": 664,
        "caption": "Startup Grind Berkeley launch event moment.",
        "variant": "wide"
      },
      {
        "src": "/media/optimized/archive-infrastructure-equipment-storage-fixed.webp",
        "alt": "Hardware inventory staged for deployment.",
        "width": 480,
        "height": 360,
        "caption": "Hardware inventory staged for deployment.",
        "variant": "standard"
      },
      {
        "src": "/media/optimized/archive-infrastructure-mobile-rack-fixed.webp",
        "alt": "Mobile network rack for field testing.",
        "width": 768,
        "height": 1024,
        "caption": "Mobile network rack for field testing.",
        "variant": "standard"
      },
      {
        "src": "/media/optimized/archive-startup-grind-proclamation.webp",
        "alt": "City of Berkeley proclamation recognizing Startup Grind Berkeley.",
        "width": 779,
        "height": 1008,
        "caption": "City of Berkeley proclamation recognizing Startup Grind Berkeley.",
        "variant": "standard",
        "objectPosition": "center top"
      }
    ]
  }
];

export const archiveArtifactSections: MediaSection[] = [
  {
    "label": "people",
    "description": "Very little of this happened alone.",
    "items": [
      {
        "src": "/media/optimized/archive-building-vercel-team-fixed.webp",
        "alt": "Bytespace team visit at Vercel.",
        "width": 768,
        "height": 1024,
        "variant": "standard",
        "cropAspectRatio": 1,
        "objectPosition": "center 40%"
      },
      {
        "src": "/media/optimized/archive-startup-grind-berkeley-bbq-group.webp",
        "alt": "Startup Grind Berkeley event group photo.",
        "width": 1200,
        "height": 1600,
        "variant": "standard",
        "cropAspectRatio": 1,
        "objectPosition": "center 90%"
      },
      personalPhoto("barbecue", "A group gathered around a barbecue outdoors."),
      personalPhoto("holiday", "A group gathered in a living room."),
      {
        "src": "/media/optimized/archive-startup-grind-startup-grind-bw.webp",
        "alt": "Behind the scenes at a Startup Grind Berkeley event.",
        "width": 1600,
        "height": 1066,
        "variant": "wide"
      },
      {
        "src": "/media/optimized/archive-early-ventures-founder-meeting.webp",
        "alt": "Four people seated together on a sofa.",
        "width": 1600,
        "height": 900,
        "variant": "wide"
      },
      personalPhoto("formal-friends", "Two people posing in formal clothes."),
      personalPhoto("dance-group", "A group photograph in colorful dance costumes."),
      personalPhoto("lecture", "Listening to a lecture among students with laptops."),
      personalPhoto("workshop", "A workshop group waving around a table of laptops and handwritten notes."),
      personalPhoto("office-friends", "Five people standing together in an office."),
      personalPhoto("mentors", "A restaurant selfie with two of my mentors."),
      {
        "src": "/media/optimized/archive-early-ventures-eia-team.webp",
        "alt": "Team photo from European Innovation Academy.",
        "width": 1600,
        "height": 1200,
        "variant": "wide"
      },
      {
        "src": "/media/optimized/archive-early-ventures-program-break.webp",
        "alt": "Five people seated together outdoors at European Innovation Academy.",
        "width": 1600,
        "height": 1186,
        "variant": "standard"
      },
      personalPhoto("eia-staff", "A group selfie with the European Innovation Academy staff."),
      personalPhoto("olive-oil-team", "Our five-person startup team standing together in a hallway."),
      personalPhoto("booming-group", "The Booming Group team gathered beside a fruit arrangement and lion mural."),
      personalPhoto("startuphouse", "A group gathering at Startuphouse in front of a world map."),
      personalPhoto("fraternity", "A Theta Chi group photograph outside the fraternity house."),
      personalPhoto("birthday", "A group gathered around a cake."),
      {
        "src": "/media/optimized/archive-personal-startup-bedroom.webp",
        "alt": "A selfie in a small bedroom.",
        "width": 1600,
        "height": 1205,
        "variant": "wide"
      },
      {
        "src": "/media/optimized/archive-early-ventures-innovation-workshop.webp",
        "alt": "Four people gathered beside a whiteboard.",
        "width": 1600,
        "height": 1200,
        "variant": "standard"
      },
      personalPhoto("korea-group", "Part of our group in Korea, gathered outside by a brick building."),
      personalPhoto("bridge-friends", "A group beside a brightly lit bridge at night."),
      personalPhoto("outdoors", "Two people in muddy clothes among trees."),
      {
        "src": "/media/optimized/archive-early-ventures-team-dinner.webp",
        "alt": "A group seated around a dining table.",
        "width": 1600,
        "height": 1600,
        "variant": "wide"
      },
      {
        "src": "/media/optimized/archive-building-bytespace-offsite-fixed.webp",
        "alt": "Bytespace working session and product discussion.",
        "width": 1024,
        "height": 768,
        "variant": "wide"
      },
      {
        "src": "/media/optimized/archive-professional-certa-team.webp",
        "alt": "Certa team booth at a field event.",
        "width": 1600,
        "height": 1200,
        "variant": "standard"
      },
      {
        "src": "/media/optimized/archive-professional-doosan-robotics.webp",
        "alt": "Professional visit with robotics partners.",
        "width": 1600,
        "height": 1454,
        "variant": "standard"
      },
      {
        "src": "/media/optimized/archive-professional-rainforest-dinner.webp",
        "alt": "Rainforest Partnership team dinner.",
        "width": 1600,
        "height": 1600,
        "variant": "wide"
      },
      {
        "src": "/media/optimized/archive-professional-rainforest-night.webp",
        "alt": "Rainforest Partnership team moment.",
        "width": 1600,
        "height": 1207,
        "variant": "wide"
      }
    ]
  }
];
