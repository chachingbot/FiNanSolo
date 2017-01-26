---
title: can_bto_09
timestamp: 2016-12-28T16:43:01.525032347+08:00
---
## Divorced and income above/equal to 12000

Can I apply for a BTO flat?
* can/bto

# If above 21 and Singapore Citizen from onboarding
< What is your marital status?
* prompt/marital_status

Divorced
* user/divorced

< As long as you have children, you can apply for a HDB flat under the Public Scheme. The type of flat you are eligible for will depend on your income bracket.
* can_ans_divorced/bto

What bracket do I fall under?
* income_ceiling/bto

< What is your rough household income? (including all residents)
* user/household_income

[18000](household_income).
* user/household_income_given

< Based on your household income, you are only eligible for flats with 4 rooms or more.
* house_type_eligibility_above_12000/bto
