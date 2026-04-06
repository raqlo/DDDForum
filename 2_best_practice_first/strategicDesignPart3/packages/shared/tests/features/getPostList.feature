Feature: Get Post List

  Scenario: Successfully obtain post list
    Given that I have a few post created
    When I try to get them
    Then I will get a sorted lists of posts

  Scenario: Missing query keys
    When I try to look for the post list without a sort attribute
    Then I get a validation error
