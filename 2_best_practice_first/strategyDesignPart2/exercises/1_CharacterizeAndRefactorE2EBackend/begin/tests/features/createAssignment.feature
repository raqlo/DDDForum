Feature: Create Assignment
  As a teacher
  I want to create an assignment for my class
  So that I can assign it to students

  Scenario: Successfully create a new assignment
    Given I have a class room named "Math"
    When I create a new "Ecuations" assignment for the class
    Then The assignment should be created for the class

    Scenario: Fail to create new assignment because of missing fields
      Given I have a class room named "Spanish"
      When I create an assignment with no name
      Then I wont be able to create an assignment

      Scenario: Successfully create assignment with same class and name
        Given I have a class room named "Chemistry"
        And An "Equations"assignment exists for the class
        When I create an assignment with the same name
        Then A new assignment would be created