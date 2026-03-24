Feature: Enroll Student To Classroom
  As an administrator
  I want to enroll a student in a classroom
  So that the student can complete assignments

  Scenario: Enroll student to a class
    Given That I have an existing student
    And I have an existing class
    When I try to assign the student to the class
    Then The student is added to the classroom roster
