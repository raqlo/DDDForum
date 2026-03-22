# Begin

## How to get started?
- Install Git
- Install Node v16 or higher on your machine
- Git clone or fork this repo
- go to the begin project
- run `npm install` to install the required dependencies
- run `npm run start:dev` to set up database, seed it and start web server


## Aditional informations

- Under `src/tests/fixtures/` you'll find the `reset.ts` script. It contains a function you can use the reset database state after each test scenario.

As example, you can use it like on the snippet below:

```
afterEach(async () => {
    await resetDatabase();
  });
```

- In case you realize some routes don't properly handle business rules based on any acceptance test you have written, take the opportunity to improve the route instead adjusting the scenario to the code. In real life it's normal to find hidden bugs when you're writing tests to legacy code. Trust in your tests!

- Run `npm run tests:e2e` to run the tests

## Solution

Under the `end` directory, you'll find a solution to the exercise.

## User Stories

### Commands

#### /assignments
* As a teacher
* I want to create an assignment
* So that I can assign it to students

#### /clases
* As an administrator
* I want to create a classroom
* So that I can add students to it

#### /students
* As a student
* I want to register
* So that I can be assigned to a classroom

#### /class-enrollments
* As a student
* I want to enroll in a classroom
* So that I can learn a specific subject

#### /student-assignments
* As a teacher
* I want to assign a student to an assignment
* So that the student can achieve learning objectives

#### /student-assignments/submit
* As a student
* I want to submit an assignment
* So that I can get a grade

#### /student-assignments/grade
* As a teacher
* I want to grade an assignment
* So the student can measure his learning progress

### Queries

#### /students
* As a admin
* I want to list all students
* So that I can assign them to a classroom

#### /students/:id
* As a student
* I want to get my profile
* So that I can see my classes, assignments and grades

#### /assignments/:id
* As a teacher
* I want to get an assignment
* So I can see the details before grading it

#### /classes/:id/assignments
* As a teacher
* I want to get all assignments for a class
* So that I can grade them

#### /student/:id/assignments
* As a student
* I want to get my assignments
* So that I can see the details before submitting them

#### /student/:id/grades
* As a student
* I want to see all my grades
* So that I can see my progress of the school year