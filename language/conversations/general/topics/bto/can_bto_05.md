---
title: can_bto_05
timestamp: 2016-12-28T16:43:01.525032347+08:00
---
## Engaged and income below 12000

Am I eligible for BTO?
* can/bto

# If above 21 and Singapore Citizen from onboarding
< What is your marital status?
* prompt/marital_status

Engaged
* user/engaged

< Congrats on the engagement! You can apply for a BTO flat through the Fiance/Fiancee Scheme. You will have to submit your Marriage Certificate upon taking possession of the flat. The type of flat you are eligible for also depends on your income bracket.
* can_ans_engaged/bto

Income bracket?
* income_ceiling/bto

< What is your rough household income? (including all residents)
* user/household_income

[11000](household_income).
* user/household_income_given

< Based on your household income, you are eligible for flats with 3 rooms or more.
* house_type_eligibility_below_12000/bto
