Feature: Get Student By Id

  Scenario: Get Student By Id
    Given There is an existing student
    When I try to fetch an student by their id
    Then The student should be retrived