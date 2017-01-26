---
title: can_bto_08
timestamp: 2016-12-28T16:43:01.525032347+08:00
---
## Widowed and income below 12000

Can I apply for a BTO flat?
* can/bto

# If above 21 and Singapore Citizen from onboarding
< What is your marital status?
* prompt/marital_status

Widowed
* user/widowed

< As long as you have children, you can apply for a HDB flat under the Public Scheme. The type of flat you are eligible for will depend on your income bracket.
* can_ans_widowed/bto

What bracket do I fall under?
* income_ceiling/bto

< What is your rough household income? (including all residents)
* user/household_income

[6000](household_income).
* user/household_income_given

< Based on your household income, you are eligible for flats with 3 rooms or more.
* house_type_eligibility_below_12000/bto
