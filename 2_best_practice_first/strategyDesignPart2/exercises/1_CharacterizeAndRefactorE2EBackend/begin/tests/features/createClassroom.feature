Feature: Create Class Room

  As an administrator
  I want to create a class
  So that I can add students to it

  Scenario: Successfully create a class room
    Given I want to create a class room named "Math"
    When I send a request to create a class room
    Then the class room should be created successfully

  Scenario: Fail to create a class room because of missing name
    Given I want to create a class room with no name
    When I send a request to create a class room
    Then the class room should not be created

    Scenario: Fail to create a class room because already exists
      Given I have a class room named "Math"
      When I try to create a new class room named "Math"
      Then it should not let me create a duplicate