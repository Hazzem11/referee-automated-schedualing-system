@echo off
echo Compiling Java files...
mvn compile

echo Running the program...
java -cp "target/classes;C:\Users\%USERNAME%\.m2\repository\org\optaplanner\optaplanner-core\8.38.0.Final\optaplanner-core-8.38.0.Final.jar;C:\Users\%USERNAME%\.m2\repository\org\optaplanner\optaplanner-persistence-jpa\8.38.0.Final\optaplanner-persistence-jpa-8.38.0.Final.jar;C:\Users\%USERNAME%\.m2\repository\org\hibernate\validator\hibernate-validator\8.0.0.Final\hibernate-validator-8.0.0.Final.jar;C:\Users\%USERNAME%\.m2\repository\org\threeten\threetenbp\1.6.6\threetenbp-1.6.6.jar" com.example.referee.RefereeAssignmentTest

pause 