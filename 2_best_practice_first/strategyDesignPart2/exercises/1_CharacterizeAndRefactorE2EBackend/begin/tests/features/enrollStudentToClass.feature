Feature: Enroll Student To Classroom
  As an administrator
  I want to enroll a student in a classroom
  So that the student can complete assignments

  Scenario: Enroll student to a class
    Given That I have an existing student
    And I have an existing class
    When I try to assign the student to the class
    Then The student is added to the classroom roster

  Scenario: Fail to enroll if student is already in the class
    Given That I have a student assigned to a class
    When I try to assign the student to the class
    Then It won't let me duplicate the student assignment

  Scenario: Fail to enroll if missing class or student
    Given That I have a class
    And the student doesn't exist yet
    When I try to assign it to the class
    Then The assignment doesnt get created
