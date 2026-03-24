Feature: Create Assignment
  As a teacher
  I want to create an assignment for my class
  So that I can assign it to students

  Scenario: Successfully create a new assignment
    Given I have a class room named "Math"
    When I create a new "Ecuations" assignment for the class
    Then The assignment should be created for the class