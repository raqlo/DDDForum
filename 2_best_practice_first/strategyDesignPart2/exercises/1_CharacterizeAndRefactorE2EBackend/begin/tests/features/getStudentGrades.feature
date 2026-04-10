Feature: Get Student Grades
  As a student
  I want to see all my grades
  So that I can see my progress of the school year

  Scenario: Get Student Grades
    Given That I have a student assigned to a class
    And And all of their assignments are graded
    When I look for a list of the grades
    Then I can see the list