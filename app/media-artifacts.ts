export type MediaArtifact = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
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
        "caption": "Bytespace team visit at Vercel.",
        "variant": "standard",
        "cropAspectRatio": 1,
        "objectPosition": "center 40%"
      },
      {
        "src": "/media/optimized/archive-startup-grind-berkeley-bbq-group.webp",
        "alt": "Startup Grind Berkeley event group photo.",
        "width": 1200,
        "height": 1600,
        "caption": "Startup Grind Berkeley event group photo.",
        "variant": "standard",
        "cropAspectRatio": 1,
        "objectPosition": "center 90%"
      },
      {
        "src": "/media/optimized/archive-startup-grind-startup-grind-bw.webp",
        "alt": "Behind the scenes at a Startup Grind Berkeley event.",
        "width": 1600,
        "height": 1066,
        "caption": "Behind the scenes at a Startup Grind Berkeley event.",
        "variant": "wide"
      },
      {
        "src": "/media/optimized/archive-early-ventures-founder-meeting.webp",
        "alt": "Meeting founders and operators during an international program.",
        "width": 1600,
        "height": 900,
        "caption": "Meeting founders and operators during an international program.",
        "variant": "wide"
      },
      {
        "src": "/media/optimized/archive-early-ventures-eia-team.webp",
        "alt": "Team photo from European Innovation Academy.",
        "width": 1600,
        "height": 1200,
        "caption": "Team photo from European Innovation Academy.",
        "variant": "wide"
      },
      {
        "src": "/media/optimized/archive-early-ventures-program-break.webp",
        "alt": "Break between sessions at an innovation program.",
        "width": 1600,
        "height": 1186,
        "caption": "Break between sessions at an innovation program.",
        "variant": "standard"
      },
      {
        "src": "/media/optimized/archive-personal-startup-bedroom.webp",
        "alt": "Founding days of Paladin Partners in a tiny room in Portugal.",
        "width": 1600,
        "height": 1205,
        "caption": "Founding days of Paladin Partners, living in a tiny room in Portugal while starting the company.",
        "variant": "wide"
      },
      {
        "src": "/media/optimized/archive-early-ventures-innovation-workshop.webp",
        "alt": "Workshop session around local innovation and startup ideas.",
        "width": 1600,
        "height": 1200,
        "caption": "Workshop session around local innovation and startup ideas.",
        "variant": "standard"
      },
      {
        "src": "/media/optimized/archive-early-ventures-korea-team-meal.webp",
        "alt": "Team meal during an international work trip.",
        "width": 1600,
        "height": 899,
        "caption": "Team meal during an international work trip.",
        "variant": "wide"
      },
      {
        "src": "/media/optimized/archive-early-ventures-team-dinner-small.webp",
        "alt": "Small team dinner during an international program.",
        "width": 1600,
        "height": 1200,
        "caption": "Small team dinner during an international program.",
        "variant": "standard",
        "cropAspectRatio": 1.6,
        "objectPosition": "center bottom"
      },
      {
        "src": "/media/optimized/archive-early-ventures-team-dinner.webp",
        "alt": "Dinner with an international team.",
        "width": 1600,
        "height": 1600,
        "caption": "Dinner with an international team.",
        "variant": "wide"
      },
      {
        "src": "/media/optimized/archive-building-bytespace-offsite-fixed.webp",
        "alt": "Bytespace working session and product discussion.",
        "width": 1024,
        "height": 768,
        "caption": "Bytespace working session and product discussion.",
        "variant": "wide"
      },
      {
        "src": "/media/optimized/archive-professional-certa-team.webp",
        "alt": "Certa team booth at a field event.",
        "width": 1600,
        "height": 1200,
        "caption": "Certa team booth at a field event.",
        "variant": "standard"
      },
      {
        "src": "/media/optimized/archive-professional-doosan-robotics.webp",
        "alt": "Professional visit with robotics partners.",
        "width": 1600,
        "height": 1454,
        "caption": "Professional visit with robotics partners.",
        "variant": "standard"
      },
      {
        "src": "/media/optimized/archive-professional-rainforest-dinner.webp",
        "alt": "Rainforest Partnership team dinner.",
        "width": 1600,
        "height": 1600,
        "caption": "Rainforest Partnership team dinner.",
        "variant": "wide"
      },
      {
        "src": "/media/optimized/archive-professional-rainforest-night.webp",
        "alt": "Rainforest Partnership team moment.",
        "width": 1600,
        "height": 1207,
        "caption": "Rainforest Partnership team moment.",
        "variant": "wide"
      }
    ]
  }
];
