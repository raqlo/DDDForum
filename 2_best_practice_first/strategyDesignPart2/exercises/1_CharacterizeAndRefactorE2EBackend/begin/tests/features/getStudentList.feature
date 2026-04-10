Feature: Get Student List
  Scenario: Get Student List
    Given I have a list of students
    When I request a list of students
    Then I get shown a list of the students with ther classes and grades