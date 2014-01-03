Feature: User profile update
  Every user of the system should be able to update their
  profile with personal information

  Scenario: User profile update
    Given I have signed up
    When I enter my credentials
    And I update my profile
    Then I should see the updated information