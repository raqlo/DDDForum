Feature: Get Assignment By Id
  As a teacher
  I want to get an assignment
  So I can see the details before grading

  Scenario: Obtain assignment when looking by id
    Given That I have an assignment from a class
    When I try to look for it
    Then I will obtain it