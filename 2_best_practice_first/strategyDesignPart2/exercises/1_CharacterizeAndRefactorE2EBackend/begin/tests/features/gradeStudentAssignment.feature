Feature: Grade Student Assignment
  As a teacher
  I want to grade an assignment
  So the student can measure his learning progress

  Scenario: Successfully Grading Assignment
    Given That I have a student assigned to a class
    And That they submitted an assignment for grading
    When I grade the assignment with a "A" grade
    Then The assignment gets associated with the grade