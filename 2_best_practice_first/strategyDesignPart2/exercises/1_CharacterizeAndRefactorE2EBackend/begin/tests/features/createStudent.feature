Feature: Create Student

  As an administrator
  I want to register a new student
  So that the student can complete assignments and track his progress

  Scenario: Successfully create a student
    Given I want to create a student named "John Doe" and with email "jdoe@email.com"
    When I send a request to create a student
    Then the student should be created successfully

  Scenario: Fail to create a student because of missing email
    Given I want to create a student named "John Doe" and no email
    When I send a request to create a student
    Then the student should not be created

  Scenario: Fail to create a student because the email already exists
    Given `There is an existing student with email "jdoe@email.com"`
    When `I send a request to create a student with email "jdoe@email.com"`
    Then the student should not be created"



