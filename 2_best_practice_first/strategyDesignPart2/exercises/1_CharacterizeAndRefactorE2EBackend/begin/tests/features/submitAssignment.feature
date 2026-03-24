Feature: Submit an Assignment
  As a student
  I want to submit an assignment
  So that I can get a grade

  Scenario: Submits assignment
    Given That I have a student assigned to a class
    And That student has assigned an assignment
    When the student submits their assignment
    Then An assignment submission is created

    Scenario: Student cannot submit assignment if is not assigned
      Given That I have a student assigned to a class
      And That student has not assigned an assignment
      When the student submits their assignment
      Then An assignment submission is not created
