/**
 * Optional script to seed a Firebase project (Firestore).
 * Requires a service account JSON file — do not commit it.
 *
 * Usage:
 *   export GOOGLE_APPLICATION_CREDENTIALS="/absolute/path/to/serviceAccountKey.json"
 *   npm run populate-firestore
 *
 * Or place serviceAccountKey.json in this directory locally (gitignored).
 */
const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");
const { faker } = require("@faker-js/faker");

const keyPath =
  process.env.GOOGLE_APPLICATION_CREDENTIALS ||
  path.join(__dirname, "serviceAccountKey.json");

if (!fs.existsSync(keyPath)) {
  console.error(
    "Missing credentials. Set GOOGLE_APPLICATION_CREDENTIALS or add serviceAccountKey.json (local only)."
  );
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(keyPath, "utf8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const createFakeReferees = async () => {
  const refereesCollection = db.collection("referees");

  for (let i = 0; i < 100; i++) {
    const referee = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      availability: faker.helpers.arrayElements(
        ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        faker.number.int({ min: 0, max: 6 })
      ),
    };

    await refereesCollection.add(referee);
  }

  console.log("Added 100 referees!");
};

const createFakeGames = async () => {
  const gamesCollection = db.collection("games");
  const gameTypes = ["4 x 8min Stopped", "4 x 10min Running", "4 x 10min Stopped"];

  for (let i = 0; i < 100; i++) {
    const game = {
      date: faker.date.between({ from: "2026-01-01", to: "2026-01-07" }).toISOString().split("T")[0],
      time: `${faker.number.int({ min: 7, max: 22 })}:00`,
      location: faker.location.streetAddress(),
      numberOfGames: faker.number.int({ min: 1, max: 3 }),
      level: faker.number.int({ min: 1, max: 6 }),
      type: faker.helpers.arrayElement(gameTypes),
      assigned: false,
      crewChief: "",
      umpire1: "",
      confirmed: {
        crewChief: false,
        umpire1: false,
      },
    };

    await gamesCollection.add(game);
  }

  console.log("Added 100 games!");
};

(async () => {
  try {
    // await createFakeReferees();
    await createFakeGames();
  } catch (error) {
    console.error("Error populating data:", error);
    process.exit(1);
  }
})();
