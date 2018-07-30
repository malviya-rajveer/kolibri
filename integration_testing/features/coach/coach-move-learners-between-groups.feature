Feature: Move user accounts in and out of groups
    Coach needs to be able to move user accounts between groups to support different learning needs and speeds

  Background:
    Given I am signed in to Kolibri as a coach user
    Given I am on the *Coach > Groups* page
    Given there are learners in the selected class
    Given there are groups created

  Scenario: Move learners from one group into another
    When I select a learner
    Then *Move Learners* button is enabled
    When I click on *Move learners* button
    Then I see the *Move learners* modal
    And I see groups that the learner is not currently assigned to
    When I select a group
    Then *Move* button is enabled
    When I click on *Move* button
    Then modal disappears
    Then I see the learner is moved to another group