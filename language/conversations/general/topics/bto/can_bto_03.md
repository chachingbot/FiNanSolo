---
title: can_bto_03
timestamp: 2016-12-28T16:43:01.525032347+08:00
---
## Single and income below 12000

Am I eligible for BTO?
* can/bto

# If above 21 and Singapore Citizen from onboarding
< What is your marital status?
* prompt/marital_status

Single
* user/single

< Since you are single, there are two avenues for application. You can apply for a HDB flat under the Public scheme with your parents and siblings, or the Orphans scheme with your siblings, if your parents are deceased. The type of house you can apply for is subject to your income bracket.
* can_ans_single/bto

Income bracket?
* income_ceiling/bto

< What is your rough household income? (including all residents)
* user/household_income

[9000](household_income).
* user/household_income_given

< Based on your household income, you are eligible for flats with 3 rooms or more.
* house_type_eligibility_below_12000/bto
