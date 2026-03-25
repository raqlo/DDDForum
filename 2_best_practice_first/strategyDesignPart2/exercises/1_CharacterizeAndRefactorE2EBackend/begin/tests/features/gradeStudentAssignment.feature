Feature: Grade Student Assignment
  As a teacher
  I want to grade an assignment
  So the student can measure his learning progress

  Scenario Outline: Successfully Grading Assignment
    Given That I have a student assigned to a class
    And That they submitted an assignment for grading
    When I grade the assignment with a "<grade>" grade
    Then The assignment gets associated with the grade

    Examples:
      | grade |
      | A     |
      | A+    |
      | B     |
      | C     |
      | D     |
      | F     |

    Scenario: Fail to grade if student assignment does not exist
      Given That I have a student assigned to a class
      And The assignment does not exist
      When I grade the assignment
      Then The assignment does not get created

      Scenario: Fail to grade if student assignment didn't submit the assignment
        Given That I have a student assigned to a class
        And the assignment has not been submitted
        When I grade the assignment
        Then The assignment does not get created

