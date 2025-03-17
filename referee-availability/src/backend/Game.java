// import java.time.LocalDate;
// import java.time.LocalTime;

// @PlanningEntity
// public class Game {
// private String id; // Unique identifier for the game
// private LocalDate date; // Date of the game
// private LocalTime time; // Time of the game
// private String location; // Location of the game
// private int numberOfGames; // Number of games (e.g., for double-headers)
// private int level; // Game level (1-6, with 1 being the highest)
// private String type; // Type of game (e.g., "4 x 8min Stopped Time")
// private boolean assigned; // Whether the game is assigned to referees
// private String crewChief; // Assigned crew chief
// private String umpire1; // Assigned umpire 1
// private String umpire2; // Assigned umpire 2
// private ConfirmationStatus confirmed; // Confirmation status of referees

// // Getters and setters for all fields
// public String getId() {
// return id;
// }

// public void setId(String id) {
// this.id = id;
// }

// public LocalDate getDate() {
// return date;
// }

// public void setDate(LocalDate date) {
// this.date = date;
// }

// public LocalTime getTime() {
// return time;
// }

// public void setTime(LocalTime time) {
// this.time = time;
// }

// public String getLocation() {
// return location;
// }

// public void setLocation(String location) {
// this.location = location;
// }

// public int getNumberOfGames() {
// return numberOfGames;
// }

// public void setNumberOfGames(int numberOfGames) {
// this.numberOfGames = numberOfGames;
// }

// public int getLevel() {
// return level;
// }

// public void setLevel(int level) {
// this.level = level;
// }

// public String getType() {
// return type;
// }

// public void setType(String type) {
// this.type = type;
// }

// public boolean isAssigned() {
// return assigned;
// }

// public void setAssigned(boolean assigned) {
// this.assigned = assigned;
// }

// public String getCrewChief() {
// return crewChief;
// }

// public void setCrewChief(String crewChief) {
// this.crewChief = crewChief;
// }

// public String getUmpire1() {
// return umpire1;
// }

// public void setUmpire1(String umpire1) {
// this.umpire1 = umpire1;
// }

// public String getUmpire2() {
// return umpire2;
// }

// public void setUmpire2(String umpire2) {
// this.umpire2 = umpire2;
// }

// public ConfirmationStatus getConfirmed() {
// return confirmed;
// }

// public void setConfirmed(ConfirmationStatus confirmed) {
// this.confirmed = confirmed;
// }

// // Inner class for confirmation status
// public static class ConfirmationStatus {
// private boolean crewChief;
// private boolean umpire1;
// private boolean umpire2;

// // Getters and setters
// public boolean isCrewChief() {
// return crewChief;
// }

// public void setCrewChief(boolean crewChief) {
// this.crewChief = crewChief;
// }

// public boolean isUmpire1() {
// return umpire1;
// }

// public void setUmpire1(boolean umpire1) {
// this.umpire1 = umpire1;
// }

// public boolean isUmpire2() {
// return umpire2;
// }

// public void setUmpire2(boolean umpire2) {
// this.umpire2 = umpire2;
// }
// }
// }