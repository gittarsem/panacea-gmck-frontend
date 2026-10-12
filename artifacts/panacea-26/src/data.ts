export type EventItem = {
  id: string;
  name: string;
  category:
    | "Cultural"
    | "Sports"
    | "Academic"
    | "Pro Shows";
  description: string;
  type: string;
  date: string;
  time: string;
  venue: string;
  fee: string;
  eligibility: string;
  team: string;
  organizer: string;
  rules: string;
};

const make = (
  id: string,
  name: string,
  category: EventItem["category"],
  description: string,
  type = "Competition",
  details: Partial<
    Pick<
      EventItem,
      "date" | "time" | "venue" | "fee" | "eligibility" | "team"
    >
  > = {}
): EventItem => ({
  id,
  name,
  category,
  description,
  type,
  date: details.date ?? "Date TBA",
  time: details.time ?? "Time TBA",
  venue: details.venue ?? "Venue TBA — GMC Kathua",
  fee: details.fee ?? "Fee TBA",
  eligibility:
    details.eligibility ?? "Eligibility details TBA",
  team: details.team ?? "Team size TBA",
  organizer:
    category === "Cultural"
      ? "Aryeen Sharma"
      : category === "Sports"
        ? "Faizan Malik"
        : category === "Academic"
          ? "Antrinksh"
          : "Antiksh Verma",
  rules:
    "Rules and instructions will be published by the organizers.",
});

export const events: EventItem[] = [

  /* =========================================================
     CULTURAL
     ========================================================= */

  make(
    "dance",
    "Dance Competition",
    "Cultural",
    "Feel the rhythm and own the stage! Express yourself through movement, energy, and creativity in a celebration of dance.",
    "Competition",
    {
      date: "28 OCT 2026",
      time: "5:00 PM",
      venue: "Main Stage",
    }
  ),

  make(
    "skit-drama",
    "Skit & Drama",
    "Cultural",
    "Lights, action, and emotions! Bring stories to life through powerful performances, compelling characters, and creative storytelling.",
    "Performance",
    {
      date: "31 OCT 2026",
      time: "1:00 PM",
      venue: "Lecture Hall",
    }
  ),

  make(
    "fashion-show",
    "Fashion Show",
    "Cultural",
    "Where style meets confidence! Walk the ramp, make a statement, and showcase your creativity through fashion, flair, and attitude.",
    "Competition",
    {
      date: "31 OCT 2026",
      time: "6:00 PM",
      venue: "Main Stage",
    }
  ),

  make(
    "cooking",
    "Cooking Competition",
    "Cultural",
    "Whisk, cook, and create! Showcase your culinary skills, creativity, and flavors as you turn ingredients into memorable dishes.",
    "Competition",
    {
      date: "31 OCT 2026",
      time: "1:00 PM",
      venue: "College Campus",
    }
  ),

  make(
    "singing",
    "Singing Competition",
    "Cultural",
    "Let your voice take center stage! Showcase your musical talent, captivate the audience, and turn every note into a memorable performance.",
    "Competition",
    {
      date: "29 OCT 2026",
      time: "6:00 PM",
      venue: "Main Stage",
    }
  ),

  make(
    "treasure-hunt",
    "Treasure Hunt",
    "Cultural",
    "Think fast, solve clues, and follow the trail! Team up to crack puzzles, uncover hidden secrets, and race towards the ultimate treasure.",
    "Team Challenge",
    {
      date: "30 OCT 2026",
      time: "1:00 PM",
      venue: "College Campus",
    }
  ),

  make(
    "art-battle",
    "Art Battle",
    "Cultural",
    "Unleash your creativity, showcase your artistic skills, and turn your imagination into art in an exciting battle of colours, ideas, and talent.",
    "Live Art",
    {
      date: "28 OCT 2026",
      time: "12:00 PM",
      venue: "Lecture Hall",
    }
  ),

  make(
    "the-unknown-files",
    "The Unknown Files",
    "Cultural",
    "Enter a world of mysteries, hidden clues, and mind-bending puzzles. Test your observation, logic, and teamwork as you unravel the unknown.",
    "Mystery Challenge",
    {
      date: "31 OCT 2026",
      time: "12:30 PM",
      venue: "Lecture Hall",
    }
  ),

  /* =========================================================
     SPORTS
     ========================================================= */

  make(
    "cricket",
    "Cricket",
    "Sports",
    "Step onto the field for an inter-college cricket tournament where strategy, teamwork, and competitive spirit take center stage.",
    "Tournament",
    {
      date: "28—31 OCT 2026",
      time: "Time TBA",
      venue: "Cricket Ground",
    }
  ),

  make(
    "football",
    "Football",
    "Sports",
    "Compete for glory in an inter-college football tournament built around teamwork, skill, speed, and determination.",
    "Tournament",
    {
      date: "28—31 OCT 2026",
      time: "Time TBA",
      venue: "Football Ground",
    }
  ),

  make(
    "badminton",
    "Badminton",
    "Sports",
    "Fast rallies, sharp reflexes, and controlled play come together in an inter-college badminton tournament.",
    "Tournament",
    {
      date: "28—31 OCT 2026",
      time: "Time TBA",
      venue: "Badminton Court",
    }
  ),

  make(
    "basketball",
    "Basketball",
    "Sports",
    "Bring your squad, own the court, and compete in an energetic inter-college basketball tournament.",
    "Tournament",
    {
      date: "28—31 OCT 2026",
      time: "Time TBA",
      venue: "Basketball Court",
    }
  ),

  make(
    "table-tennis",
    "Table Tennis",
    "Sports",
    "Precision, reflexes, and quick thinking collide across the table in an inter-college table tennis tournament.",
    "Tournament",
    {
      date: "28—31 OCT 2026",
      time: "Time TBA",
      venue: "Sports Area",
    }
  ),

  make(
    "chess",
    "Chess",
    "Sports",
    "A measured battle of plans and patience. Think ahead, outplay your opponent, and make every move count.",
    "Tournament",
    {
      date: "28—31 OCT 2026",
      time: "Time TBA",
      venue: "Sports Area",
    }
  ),

  /* =========================================================
     ACADEMIC
     ========================================================= */

  make(
    "surgical-workshop",
    "Surgical Skills Workshop",
    "Academic",
    "A practical learning experience focused on fundamental surgical skills and hands-on clinical learning.",
    "Workshop",
    {
      date: "28 OCT 2026",
      time: "Time TBA",
      venue: "Lecture Hall 1 & 2",
    }
  ),

  make(
    "mun",
    "Model United Nations",
    "Academic",
    "Step into the world of diplomacy, debate global issues, represent your assigned country, and negotiate towards meaningful resolutions.",
    "Conference",
    {
      date: "30 OCT 2026",
      time: "Time TBA",
      venue: "Lecture Hall 1 & 2",
    }
  ),

  make(
    "basic-life-support",
    "Basic Life Support Workshop",
    "Academic",
    "Learn essential life-saving skills through practical demonstrations and guided training in basic life support.",
    "Workshop",
    {
      date: "31 OCT 2026",
      time: "Time TBA",
      venue: "Lecture Hall 1 & 2",
    }
  ),

  /* =========================================================
     PRO SHOWS
     ========================================================= */

  make(
    "edm-night",
    "EDM Night",
    "Pro Shows",
    "Turn up the volume and experience a high-energy night of electronic music featuring Swattrex.",
    "Pro Show",
    {
      date: "29 OCT 2026",
      time: "Time TBA",
      venue: "Main Stage — GMC Kathua College Campus",
    }
  ),

  make(
    "standup",
    "Stand-up Comedy",
    "Pro Shows",
    "A night of sharp observations, stories, punchlines, and non-stop laughter featuring Rajat Sood.",
    "Pro Show",
    {
      date: "28 OCT 2026",
      time: "Time TBA",
      venue: "Main Stage — GMC Kathua College Campus",
    }
  ),

  make(
    "headliner",
    "Headliner Concert",
    "Pro Shows",
    "PANACEA's headline live music experience featuring Rauhan Malik. Get ready for an unforgettable night of music and energy.",
    "Pro Show",
    {
      date: "30 OCT 2026",
      time: "Time TBA",
      venue: "Main Stage — GMC Kathua College Campus",
    }
  ),

  make(
    "qawali",
    "Qawali Night",
    "Pro Shows",
    "An evening of soulful qawali, powerful vocals, and collective celebration featuring Dheeraj Muse.",
    "Pro Show",
    {
      date: "31 OCT 2026",
      time: "Time TBA",
      venue: "Main Stage — GMC Kathua College Campus",
    }
  ),
];

/* =========================================================
   CATEGORIES
   ========================================================= */

export const categories = [
  {
    name: "Cultural",
    tone: "pink",
    desc: "Dance · Drama · Fashion · Art · Song",
    icon: "✳",
  },
  {
    name: "Sports",
    tone: "blue",
    desc: "Cricket · Football · Court · Chess",
    icon: "◉",
  },
  {
    name: "Academic",
    tone: "yellow",
    desc: "MUN · Surgical Skills · Basic Life Support",
    icon: "✦",
  },
  {
    name: "Pro Shows",
    tone: "dark-card",
    desc: "EDM · Comedy · Concert · Qawali",
    icon: "♫",
  },
];

/* =========================================================
   DAYS
   ========================================================= */

export const days = [
  {
    date: "28 OCT",
    label: "DAY 01",
  },
  {
    date: "29 OCT",
    label: "DAY 02",
  },
  {
    date: "30 OCT",
    label: "DAY 03",
  },
  {
    date: "31 OCT",
    label: "DAY 04",
  },
];

/* =========================================================
   FESTIVAL COORDINATORS
   ========================================================= */

export const organizers = [
  {
    role: "Cultural Secretary",
    name: "Aryeen Sharma",
    contact: "9682391837",
  },
  {
    role: "Sports Secretary",
    name: "Faizan Malik",
    contact: "9797454951",
  },
  {
    role: "Academic Secretary",
    name: "Antrinksh",
  },
];

/* =========================================================
   EVENT ORGANIZERS
   ========================================================= */

export const culturalOrganizers =
  "Nandini, Sukriti, Sharoon, Manjeet, Muskaan, Savri, Rashi, Redhanshi, Sandeep, Shakira, Sajid, Farhana, Inderpreet, Manshika, Shriya, Khwahish, Lakshita, Shreya, Harsharn, Iflah, Nikhil, Suneha, Mittali, Isha, Ritakshi, Hardikha, Mudassir, Shrishant, Inayat, Bupil, Ujwal, Shwnsham, Asim, Kunal, Harshdeep, Anushka, Akshad";

export const sportsOrganizers =
  "Waqar, Sarwar, Sameer, Sadaat, Shubankar, Sarthak, Manazir, Tajamul, Uzair, Ayash, Ifham, Jamid, Afaan, Hanan, Furkaan, Kuldeep Meena, Aryan, Abhi Pranav, Saar, Shoaib, Sanamphreet, Harshdeep";

export const academicOrganizers =
  "Antrinksh";