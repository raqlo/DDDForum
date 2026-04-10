Feature: Assign Student to Assignment
  As a teacher
  I want to assign a student to an assignment
  So that the student can achieve learning objectives

  Scenario: Successfully assign student to assignment
    Given That I have a student assigned to a class
    And an assignment exists for the class
    When I want to assign the student to the assignment
    Then The assignment gets associated to the student

  Scenario: Fail creation when when student is not enrolled in class
    Given I have an assignment that exists for a class
    And I have a student not enrolled in the class
    When I try to assign the student to the assignment
    Then It will prevent from adding the assignment to the student

  Scenario: Fail creation when student already has an assignment
    Given That the student is already assigned to the assignment
    When I try to assign the student to the assignment
    Then It will notify me that I cannot duplicate an assignment