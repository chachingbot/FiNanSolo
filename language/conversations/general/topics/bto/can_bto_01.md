---
title: can_bto_01
timestamp: 2016-12-28T16:43:01.525032347+08:00
---
## Married and below 12000

Can I get it?
* can/bto

# If above 21 and Singapore Citizen from onboarding
< What is your marital status?
* prompt/marital_status

Married
* user/married

< Since you are married, you can apply for a HDB flat under the Public Scheme with your spouse and children, as long as you fall within the appropriate income bracket for the house you intend to purchase.
* can_ans_married/bto

What is my income bracket?
* income_ceiling/bto

< What is your rough household income? (including all residents)
* user/household_income

My household income is roughly [10000](household_income).
* user/household_income_given

< Based on your household income, you are eligible for flats with 3 rooms or more.
* house_type_eligibility_below_12000/bto
