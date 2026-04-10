Feature: Get All Assignments Per Student
  As a student
  I want to get my assignments
  So that I can see the details before submitting them

  Scenario: Get assignments
    Given That I have a student assigned to classes
    And the student has many assignments
    When I try to fetch their assignments
    Then I would get their assignment list
