const admin = require("firebase-admin");
const { faker } = require("@faker-js/faker");
const serviceAccount = require("./serviceAccountKey.json");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Function to create fake referees
const createFakeReferees = async () => {
  const refereesCollection = db.collection("referees");

  for (let i = 0; i < 100; i++) {
    const referee = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      availability: faker.helpers.arrayElements(
        ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        faker.number.int(0,6)
      ),
    };

    await refereesCollection.add(referee);
  }

  console.log("Added 100 referees!");
};

// Function to create fake games

const createFakeGames = async () => {
    const gamesCollection = db.collection("games");
    const gameTypes = ["4 x 8min Stopped", "4 x 10min Running", "4 x 10min Stopped"];
  
    for (let i = 0; i < 100; i++) {
      const game = {
        date: faker.date.between({ from: "2025-01-01", to: "2025-01-07" }).toISOString().split("T")[0],
        time: `${faker.number.int(7, 22)}:00`, // Random hour between 7 AM and 10 PM
        location: faker.location.streetAddress(),
        numberOfGames: faker.number.int(1, 3),
        level : faker.number.int(1, 6),
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

// Run both functions
(async () => {
  try {
    // await createFakeReferees();
    await createFakeGames();
  } catch (error) {
    console.error("Error populating data:", error);
  }
})();
