You are Claude Opus working inside Figma Make.

Your task is to extend the existing OOXii app prototype into a fuller clickable app flow.

Use the attached existing code as the design and implementation reference. The existing prototype includes the left-eye distance vision screen with:
- dark purple background
- teal accent
- rabbit current-step guidance
- race/progress bar
- centered active step cards
- inline validation
- help/video support
- React/Vite structure
- Tailwind-style classes
- lucide-react icons
- motion/react animations

Do not replace the existing left-eye distance vision screen. Treat it as the approved screen that sits in the clinical flow AFTER the right-eye distance vision screen and BEFORE the both-eyes distance vision screen.

Build the rest of the app around it.

The final prototype should feel like one consistent OOXii application, not a set of disconnected screens.

PROJECT CONTEXT

OOXii is a guided vision testing app used by lay testers in low-resource settings. The app helps non-specialists perform vision tests by guiding them through a strict decision-tree workflow, calculating results in the background, and recording anonymous client test data.

The app must be simple enough for testers with limited technical experience. Do not assume users understand icons, symbols, or hidden interactions.

Important design rules:
1. Use dark purple for sunlight readability.
2. Keep the design simple and obvious.
3. Do not collect personal client data.
4. Keep client records anonymous.
5. Preserve strict step-by-step flow.
6. Users should not freely skip between test modules.
7. Right eye corresponds to blue.
8. Left eye corresponds to white.
9. The rabbit should guide the user but never slow them down.
10. Help must be obvious. Prefer the word “Help” over a question mark alone.

EXISTING CODE TO PRESERVE

The attached code already contains an approved left-eye distance vision screen.

Preserve its core visual language:
- background: #150F26 or existing dark purple
- card: #22193B
- active card: #2A2049
- teal accent: #00D1C1
- error: #FF5C5C
- muted text: #9B93BA
- max mobile width around 430px
- sticky progress/race area
- rabbit visual assistant
- centered active step
- inline validation
- bottom action bar

Do not remove or rewrite the existing left-eye screen unless required to connect it into the broader app flow.

The new screens should use the same component style:
- rounded inputs
- large buttons
- full-width mobile controls
- simple dropdowns
- radio options
- white/light text
- teal progress
- muted disabled fields
- minimal visual clutter

Ignore all video player controls, browser chrome, cursors, scrollbars, and playback overlays visible in the screenshots. Only recreate the app UI.

OVERALL APP FLOW TO GENERATE

Create a prototype flow with these major sections:

1. Account creation
2. Tester information
3. Additional tester information
4. First-login rabbit guide
5. Home dashboard
6. Region confirmation modal
7. New anonymous client setup
8. Distance vision workflow
9. Near vision workflow
10. Wheel test workflow
11. Tester profile / rabbit gamification
12. Tutorial/live assistance pattern

The prototype does not need full backend logic. It should use local state and realistic mock data.

Do not implement payments, inventory, geolocation GPS, returning-client recognition, real authentication, or multi-device sync.

APP SHELL

Create a reusable OOXii app shell.

Desktop/tablet shell:
- OOXii logo top-left
- Online pill top-right
- nav links: Home, Tutorial, Settings, Logout
- dark purple background
- teal progress bar where relevant

Mobile shell:
- OOXii logo at top
- progress bar below logo
- main content centered
- max content width around 430px
- bottom buttons when needed

All screens should remain readable outdoors in sunlight.

SECTION 1 — ACCOUNT CREATION FLOW

Create the following screens based on the supplied screenshots.

SCREEN: Create account — 20%

Purpose:
Tester creates an account.

Visual:
- OOXii logo centered near top.
- Progress bar shows 20%.
- Heading: “Create an account”.
- Dark purple background.
- Centered narrow form.

Fields:
- Your email
- Password
- Confirm password

Password field:
- masked characters
- eye/visibility icon
- password rules text:
  “It should include:”
  “At least 8 characters”
  “At least 1 uppercase letter (A–Z)”
  “At least 1 special character (e.g. !@#$)”

Button:
- “Next”

Footer:
- “Already registered? Login to your account”

Validation:
- If Next is clicked with missing or invalid fields, show inline errors.
- Keep error language plain.
- Do not use harsh warning copy.

SCREEN: Tester information — 50%

Purpose:
Collect tester identity details.

Fields:
- First name
- Last name
- Gender dropdown

Section heading:
“Tester information”

Subsection:
“Clinic details”

Fields:
- Country dropdown
- State/Province dropdown
- City dropdown

Behaviour:
- State/Province is disabled until country is selected.
- City is disabled until state/province is selected.
- Next is disabled until required fields are completed.

SCREEN: Additional information — 75%

Purpose:
Collect tester role and experience.

Heading:
“Additional information”

Fields:
- Health care role dropdown
- Level of experience dropdown
- Organisation text field

Health care role dropdown options:
- Community Health Worker
- Eye Nurse
- Refractionist
- Optometrist
- Ophthalmologist
- Other Doctor
- Other Allied Health Worker

Experience options:
- New tester
- Some experience
- Experienced tester
- Trainer / supervisor

Buttons:
- “Create account”
- “Back”

Footer:
- “Already registered? Login to your account”

Important:
Use the “Level of experience” answer to decide whether to show the first-login rabbit guide. New testers should be guided into the login guide. Experienced testers can skip it.

SECTION 2 — FIRST-LOGIN RABBIT GUIDE

Create a first-login onboarding overlay.

Purpose:
Introduce the rabbit as a visual assistant and teach the user to follow the rabbit through the app.

This should only appear:
- after signup for first-time users
- when the user selects “New tester”
- or if the user has not logged in for a long time
- or when major new features are introduced

The prototype only needs to show it after account creation.

Design:
- Dark purple overlay.
- Rabbit mascot named “Elliot”.
- Friendly but not childish.
- Clear callout bubbles.
- Highlight one area of the interface at a time.
- Include “Skip guide” and “Next” buttons.

Guide steps:
1. Highlight Home.
   Bubble:
   “Home is where you start a new client test.”

2. Highlight Tutorial.
   Bubble:
   “Tutorial has short guides if you need a refresher.”

3. Highlight Settings.
   Bubble:
   “Settings lets you update app preferences.”

4. Highlight progress/race bar.
   Bubble:
   “I’ll show where you are in each test.”

5. Highlight Next button.
   Bubble:
   “When the current step is complete, press Next.”

6. Highlight Help button.
   Bubble:
   “Tap Help when you need to see how the physical kit connects to this step.”

Final message:
“Follow Elliot through each test. He will point to the next step.”

Buttons:
- “Start using OOXii”
- “Skip guide”

Important:
Do not make this long. It should feel like a fast introduction, not a training module.

SECTION 3 — HOME DASHBOARD

Create the home dashboard based on the screenshot.

Screen:
“Welcome John Smith”

Cards:
1. New Client
   Body:
   “Conduct a test for a new client and set up their profile”
   Button:
   “Start new test”

2. Search Client Info
   Body:
   “Browse clients, manage their prescriptions and continue tests”
   Button:
   “Search client”

Important:
Because OOXii does not store personal client data, the search card should be framed around anonymous OOXii IDs only. Do not introduce name, date of birth, phone, or email search.

Top nav:
- OOXii logo
- Home
- Tutorial
- Settings
- Logout
- Online pill

SECTION 4 — REGION CONFIRMATION MODAL

On first home load, show a centered modal:

Title:
“Confirm your region”

Radio options:
- Tester Region
- Other Region

Current region box:
“Current tester region”
“Sydney, New South Wales, Australia”

Button:
“Save”

Behaviour:
- Modal blocks background until Save.
- Background home page is dimmed.
- If “Other Region” is selected, show placeholder dropdowns:
  Country
  State/Province
  City/Town
  Optional village / site name

Do not use live GPS. This is a manual region confirmation flow.

SECTION 5 — NEW CLIENT SETUP

Create the New Client / Client Information screen based on the screenshot.

Progress:
50%

Title:
“Client information”

Fields:
- Year of birth
- Gender dropdown

Question:
“Have you had cataract surgery before?”

Radio options:
- No
- Yes, right eye
- Yes, left eye
- Yes, both eyes

OOXii ID number:
- auto-generated short anonymous ID
- example: “82016”

Buttons:
- “Start test”
- “Cancel”

Important:
Do not collect client name, date of birth, email, phone number, or address.

SECTION 6 — TEST FLOW STRUCTURE

Create a strict test flow.

Core flow sequence:

Client information
→ Glasses question
→ Distance vision — Right eye
→ Existing Distance vision — Left eye screen from attached code
→ Distance vision — Own glasses / both eyes open
→ Near vision — No glasses
→ Near vision — Reading glasses question
→ Near vision — Own glasses
→ Wheel test decision / alert if needed
→ Wheel test — Pupillary distance
→ Wheel test — Right eye lens selection
→ Right distance vision at the wheel
→ Wheel test — Left eye lens selection
→ Final summary placeholder

The user should move forward using Next.
The user should move backward using Back.
Do not provide a menu to skip to arbitrary modules.

Each screen should:
- show the rabbit/race progress bar at the top
- keep the active question/input centered
- validate required inputs before advancing
- show a helpful inline error when incomplete
- use the word “Help” next to instructions where tutorial support is available

SECTION 7 — RABBIT PROGRESS / VISUAL AID

Add the rabbit visual aid across the testing workflow.

Purpose:
Help the tester understand where they are on the screen and what they must complete next.

Design requirements:
- Rabbit appears in the progress/race area and near the active step.
- Rabbit should not cover fields.
- Rabbit should not animate excessively.
- Rabbit should not delay the workflow.
- Rabbit should simply point to the current step or sit beside the active card.
- Keep it friendly, calm, and clinical-adjacent.

Progress bar:
- Use a top progress bar across test screens.
- It may look like a simple race track, but keep it restrained.
- Healthcare users may resist gamification if it slows them down.
- Therefore, use a subtle race metaphor:
  - thin track
  - teal filled segment
  - small rabbit marker
  - small finish flag
  - milestone dots
- Avoid large game graphics.

Rabbit behaviour:
- If the tester completes a step, rabbit moves forward.
- If the tester tries to press Next too early, rabbit stays still.
- If a field is missing, rabbit points to the missing field.
- If the tester goes Back, rabbit moves back to the previous step.
- If the tester is idle on a step for too long, the Help button may gently pulse.

Rabbit copy:
Default:
“You’re here. Complete this step to keep going.”

Error:
“Finish this field first, then we can move forward.”

Success:
“Nice. Press Next to continue.”

Back prompt:
“This is the previous step. Check it, then continue.”

SECTION 8 — VALIDATION AND ERROR DESIGN

Every required screen must prevent the user from moving forward without completing required information.

When Next is pressed too early:
- do not advance
- do not move the rabbit
- center the incomplete field/card
- highlight the missing field
- show inline error text
- use warm red/orange, not a full red page
- keep the copy supportive

Example errors:
- “Select Yes or No before continuing.”
- “Select the OOXii line number before continuing.”
- “Select the number of letters correct.”
- “Choose the best lens before continuing.”
- “Enter pupillary distance before continuing.”

Do not rely on colour alone.
Use an icon plus text.

SECTION 9 — TUTORIAL / LIVE ASSISTANCE PATTERN

Add a reusable Help pattern beside every important instruction or field.

Important:
Do not use only a question mark icon. Some testers may not understand it.

Use a button labelled:
“Help”

Preferred design:
- small green or teal Help pill
- optional help icon
- visible text: “Help”
- large enough to tap
- subtle pulse if the user is stuck
- stronger pulse only after repeated error or long inactivity

Help content:
- Opens a small modal, drawer, or inline panel.
- Shows short video or image placeholder.
- Links physical testing kit action to the app input.
- Keep it specific to the field.

Example:
For OOXii line number:
Title:
“How to find the OOXii line number”

Content:
- image/video placeholder of vision chart
- red highlight on line-number area
- text:
  “Use the number beside the smallest line the client reads correctly.”

For pupillary distance:
Title:
“How to read pupillary distance”

Content:
- image/video placeholder of wheel/scale
- highlight the PD scale
- text:
  “Read the number from the scale next to the knob.”

Help modal buttons:
- “Got it”
- “Watch again” if using video

Do not create a full tutorial course here. This is live assistance inside the workflow.

SECTION 10 — GLASSES QUESTION SCREEN

Create screen based on screenshot.

Progress:
8%

Question:
“Does the client currently have a pair of distance glasses?”

Radio options:
- Yes
- No

Buttons:
- Next
- Back

Behaviour:
- Next requires Yes or No.
- If incomplete, show error and rabbit prompt.
- If No, continue to Distance vision — Right eye.
- If Yes, later include own-glasses distance vision screen.

SECTION 11 — DISTANCE VISION — RIGHT EYE

Create the right-eye distance vision screen before the existing left-eye screen.

Title:
“Distance vision”
“Right eye”

Instruction:
“No glasses, ask the person to cover their left eye with the palm of their hand.”

Image:
- same illustration style as existing eye-covering image
- person covers left eye
- teal image panel
- purple frame

Fields:
1. Smallest OOXii line number with all letters correct
   - dropdown:
     Select OOXii line number
     Line 0–Line 11
   - Help button beside the label

2. Select number of letters correct on next smaller line
   - radio options: 0, 1, 2, 3, 4
   - Help button beside the label

3. Right eye distance vision no glasses — Snellen (metres)
   - readonly disabled field
   - placeholder:
     “Auto-calculated from line selection”

Buttons:
- Next
- Back

Validation:
- line number required
- letter count required
- Snellen field auto-calculates when values selected

After this screen:
- route to the existing left-eye distance vision screen from the attached code

SECTION 12 — EXISTING LEFT EYE DISTANCE VISION SCREEN

Keep the attached left-eye distance vision screen.

Only modify it if needed to connect it into the larger flow.

It should remain:
- left eye
- no glasses
- dark purple
- rabbit current-step guidance
- progress/race bar
- inline errors
- Help/video support
- Next and Back navigation

After the left-eye screen:
- route to Distance vision — Own glasses / both eyes open

SECTION 13 — DISTANCE VISION — OWN GLASSES / BOTH EYES OPEN

Create screen based on screenshot.

Title:
“Distance vision, own glasses, both eyes open”

Image:
- person wearing glasses
- both eyes open
- teal panel with purple frame

Instruction:
“With own glasses, ask the person to use both eyes open.”

Fields:
1. Smallest OOXii line number with all letters correct
   - dropdown: Line 0–Line 11
   - Help button

2. Select number of letters correct on next smaller line
   - radio options: 0, 1, 2, 3, 4

3. Both eyes distance vision with glasses — Snellen (metres)
   - readonly field
   - auto-calculated

Buttons:
- Next
- Back

Validation:
- require line number
- require letter count

SECTION 14 — NEAR VISION — NO GLASSES

Create screen based on screenshot.

Progress:
13%

Title:
“Near vision — No glasses”

Image:
- person holding near vision card
- show “40cm” marker in image
- teal panel with purple frame

Instruction:
“Ask the person to use both eyes.”

Fields:
1. Smallest OOXii line number with all letters correct
   - dropdown:
     “Select a line number”

2. Both eyes near vision no glasses — Snellen (metres)
   - readonly field:
     “Auto-calculated from line selection”

Buttons:
- Next
- Back

Validation:
- require line number

Help:
- Help button explains how to hold the near vision card at 40cm.

SECTION 15 — NEAR VISION — READING GLASSES QUESTION

Create screen based on screenshot.

Progress:
15%

Title:
“Near vision — Reading glasses”

Question:
“Does the client currently have a pair of reading glasses?”

Radio options:
- Yes
- No

Buttons:
- Next
- Back

Validation:
- require Yes or No

SECTION 16 — NEAR VISION — OWN GLASSES

Create screen based on screenshots.

Progress:
18%

Title:
“Near vision — Own glasses”

Image:
- person wearing glasses, holding near card
- 40cm marker

Instruction:
“With own glasses, ask the person to use both eyes.”

Fields:
1. Smallest OOXii line number with all letters correct
   - dropdown
   - example selected state: Line 9

2. Both eyes near vision with glasses — Snellen (metres)
   - readonly/disabled field
   - example selected state: 6/7.5

Buttons:
- Next
- Back

Decision alert:
If near vision is bad, show a top alert based on screenshot:

Pink/red alert card:
Main text:
“NEAR VISION IS BAD”
Subtext:
“NOW DO WHEEL TEST”

Use an error/warning icon, but keep the tone procedural, not alarming.

Then continue to Wheel test.

SECTION 17 — WHEEL TEST INTRO / PUPILLARY DISTANCE

Create screen based on screenshot.

Progress:
25%

Title:
“Wheel test”

Image:
- person facing vision chart at 3m
- teal illustration card
- show “3m” distance marker

Instruction:
“To improve distance vision”

Field:
“Pupillary distance (PD)”

Input:
- numeric text field
- example value: 62

Helper text:
“Valid range: 52–78. Put 0.0 lenses in front of both eyes and turn the knob to adjust the distance between the two eyes, read the number from the scale next to the knob.”

Buttons:
- Next
- Back

Validation:
- PD is required
- must be between 52 and 78
- if invalid, show inline error:
  “Enter a PD between 52 and 78.”

Help:
- Help button beside PD field.
- Help content shows where to read the PD number on the wheel.

SECTION 18 — WHEEL TEST — RIGHT EYE LENS SELECTION

Create screen based on screenshots.

Progress:
29%

Title:
“Wheel test — Right eye”

Subtitle:
“Make sure the black lens is covering the left eye.”

Image:
- person covering/occluding left eye, or wheel setup image
- maintain consistent illustration style

Question:
“Best right lens is:”

Radio options:
- Plus
- Minus
- Neither plus nor minus lenses improve vision

Dropdown:
“Best minus lens right eye”
or dynamically:
“Best plus lens right eye”

Dropdown placeholder:
“Choose the best right eye lens”

2-colour test question:
“Now do 2-colour test. Which letters look sharper, darker, easier to read?”

Radio options:
- Letters on red side
- Letters on green side
- Letters look the same

Question:
“Can the person read line 9 or smaller?”

Radio options:
- Yes
- No

Buttons:
- Next
- Back

Validation:
- require plus/minus/neither selection
- if plus/minus selected, require best lens dropdown
- require 2-colour response
- require line 9 response

SECTION 19 — RIGHT DISTANCE VISION AT THE WHEEL

Create screen based on screenshots.

Progress:
33%

Title:
“Right distance vision at the wheel”

Image:
- person facing chart at 3m
- teal panel
- 3m marker

Instruction:
“When you have found the lenses that give the best vision, measure the vision while the person is looking through these lenses at the wheel.”

Question:
“Did vision improve with lenses at the wheel?”

Radio options:
- Yes
- No

If Yes:
show fields:
1. Smallest OOXii line number with all letters correct
   - dropdown

2. Select number of letters correct on next smaller line
   - radio options 0–4

3. RESULT — Right distance vision at the wheel — Snellen (metres)
   - readonly field
   - auto-calculated from line selection

Buttons:
- Next
- Back

Validation:
- require Yes/No
- if Yes, require line number and letter count

SECTION 20 — WHEEL TEST — LEFT EYE LENS SELECTION

Create screen based on screenshots.

Progress:
37%

Title:
“Wheel test — Left eye”

Subtitle:
“Make sure the black lens is covering the right eye.”

Image:
- person covering/occluding right eye
- teal image panel
- purple frame

Question:
“Best left lens is:”

Radio options:
- Plus
- Minus
- Neither plus nor minus lenses improve vision

Dropdown:
“Best minus lens left eye”
or:
“Best plus lens left eye”

Example selected value:
-2.5

2-colour test:
“Now do 2-colour test. Which letters look sharper, darker, easier to read?”

Radio options:
- Letters on red side
- Letters on green side
- Letters look the same

Question:
“Can the person read line 9 or smaller?”

Radio options:
- Yes
- No

Readonly result field:
“Best distance lens — left eye”

Example:
-2.5

Buttons:
- Next
- Back

Validation:
- same as right eye

SECTION 21 — FINAL SUMMARY PLACEHOLDER

Create a simple placeholder screen to show the end of the generated flow.

Title:
“Test section complete”

Summary cards:
- Client OOXii ID
- Distance vision recorded
- Near vision recorded
- Wheel test recorded
- Right eye lens
- Left eye lens

Button:
“Return home”

Optional:
Show rabbit success bubble:
“Great work. This client’s test data is saved on this device.”

Do not build dispensing, payments, inventory, or server sync.

SECTION 22 — TESTER PROFILE / RABBIT GAMIFICATION

Create a new Tester Profile screen for motivation features.

Purpose:
Reward testers for completing more client tests and logging data.

Do not make this competitive-first. Make it about contribution, recognition, and community impact.

Profile content:
- Tester name: John Smith
- Role: Community Health Worker
- Organisation
- Region
- Experience level
- Tests completed
- Clients helped
- Eye festivals attended
- Last sync status

Rabbit gamification:
- “Carrots earned”
- “Carrots harvested this month”
- “Progress to next badge”

Badge section:
Show clearly acquired badges.

Example badges:
1. First Client
   Requirement:
   Complete 1 client test

2. 50 Clients Helped
   Requirement:
   Complete 50 client tests

3. 100 Clients Helped
   Requirement:
   Complete 100 client tests

4. 200 Clients Helped
   Requirement:
   Complete 200 client tests

5. Consistent Tester
   Requirement:
   Complete tests across 5 separate days

6. Community Helper
   Requirement:
   Help 25 clients in one outreach period

Badge behaviour:
- acquired badges are bright/filled
- locked badges are muted
- tapping/clicking a badge opens details:
  - requirement
  - current progress
  - reward date if achieved

Progress to next badge:
Example:
“32 / 50 clients helped”
Progress bar:
“18 clients until your 50 Clients badge”

Rabbit copy:
“Keep going — 18 more clients until your next badge.”

Important:
Badges should be clearly visible on the profile.

SECTION 23 — COMMUNITY CARROT GARDEN

Create a test feature screen called:

“Community Garden”

Purpose:
Show collective impact across the app.

Design:
- Dark purple background
- soft garden card
- carrot icons grouped in a simple patch
- avoid childish farming-game style
- keep it simple and readable

Metric:
“Total eyepieces given out”

Example:
“12,480 eyepieces given out by OOXii testers”

Subtext:
“Connect to the internet to upload your saved carrots and refresh the garden.”

Offline state:
- Show local carrots waiting to sync:
  “24 carrots saved on this device”
  “Will upload when connected”

Online state:
- “Garden updated today”
- “Your carrots have been added”

Important:
Draft the whole-app basis version, not the group-code eye festival version.

Do not build real internet sync. Use a static mock.

SECTION 24 — TUTORIAL TAB

Create a Tutorial tab screen.

Purpose:
Allow testers to access live assistance and short guides.

Sections:
1. Getting started
2. Distance vision
3. Near vision
4. Wheel test
5. Reading glasses
6. Using the physical kit
7. Troubleshooting

Each tutorial item should be a simple card:
- title
- short description
- duration
- play icon
- “Watch” button

Use clear copy:
- “How to select an OOXii line number”
- “How to count letters on the next line”
- “How to measure near vision at 40cm”
- “How to read pupillary distance on the wheel”
- “How to choose plus or minus lenses”
- “What to do if the client cannot read line 9”

Do not make the Tutorial tab required to finish the clinical flow. It is optional support.

SECTION 25 — HELP BUTTON STANDARD

Across every generated clinical screen, use this help button pattern:

Label:
“Help”

Visual:
- teal/green pill button
- optional small icon
- placed beside field labels or instruction headings
- large enough to tap
- obvious to a non-technical user

Do not use only:
“?”
unless paired with text.

States:
- default
- hover/focus
- gentle pulse after long inactivity
- stronger pulse after repeated validation error

Help modal:
- title specific to the field
- image/video placeholder
- one-sentence instruction
- “Got it” button

SECTION 26 — LOCAL DATA / MOCK LOGIC

Use local state or mock localStorage-style data.

Store mock records:
TesterProfile:
- testerId
- firstName
- lastName
- role
- experienceLevel
- organisation
- country
- stateProvince
- city
- firstLoginGuideCompleted
- testsCompleted
- carrotsEarned
- badgesEarned

ClientSession:
- ooxiiClientId
- yearOfBirth
- gender
- cataractSurgeryHistory
- region
- currentStep
- createdAt

VisionResults:
- rightDistanceNoGlasses
- leftDistanceNoGlasses
- bothEyesDistanceWithGlasses
- nearNoGlasses
- nearWithGlasses
- wheelRightEye
- wheelLeftEye

HelpUsage:
- helpId
- openedCount
- lastOpenedAt

Do not create a backend.

SECTION 27 — CLINICAL DISPLAY LOGIC

Use this OOXii line mapping for Snellen metres:

Line 0 → 6/60
Line 1 → 6/48
Line 2 → 6/38
Line 3 → 6/30
Line 4 → 6/24
Line 5 → 6/19
Line 6 → 6/15
Line 7 → 6/12
Line 8 → 6/10
Line 9 → 6/8
Line 10 → 6/6
Line 11 → 6/5

Base LogMAR:
Line 0 → 1.0
Line 1 → 0.9
Line 2 → 0.8
Line 3 → 0.7
Line 4 → 0.6
Line 5 → 0.5
Line 6 → 0.4
Line 7 → 0.3
Line 8 → 0.2
Line 9 → 0.1
Line 10 → 0.0
Line 11 → -0.1

Each correct letter on the next smaller line subtracts 0.02 from LogMAR.

Display rule:
- If letters correct = 0, display base Snellen.
  Example: Line 7 → 6/12
- If letters correct > 0, display base Snellen + “+N”.
  Example: Line 7 + 1 → 6/12+1

SECTION 28 — RESPONSIVE DESIGN

Prioritise mobile/tablet.

Mobile:
- 390px to 430px width
- centered content
- large touch controls
- one column
- sticky or fixed bottom buttons where helpful
- progress/rabbit visible but not intrusive

Tablet/desktop:
- content remains centered
- max form width around 430–520px
- do not stretch fields full desktop width
- header/nav may span full page

SECTION 29 — ACCESSIBILITY

Use:
- high contrast
- large touch targets
- readable font sizes
- text labels on important controls
- visible focus states
- plain language
- supportive error messages
- no fast distracting animation
- no reliance on colour alone

Important:
The users may be lay testers, working outdoors, on low-end devices, under time pressure.

SECTION 30 — WHAT NOT TO BUILD

Do not build:
- payments
- inventory management
- lens substitution engine
- real geolocation/GPS
- returning-client recognition by personal details
- multi-device sync
- real backend auth
- real leaderboard
- real internet community sync
- dispensing workflow
- medical-device certification documentation
- group-code eye festival garden

Do not collect:
- client name
- client full date of birth
- client phone
- client email
- client address

Do not create:
- a bright white app theme
- a generic dashboard
- a childish game interface
- complex hidden gestures
- icons without text labels for critical actions

SECTION 31 — ACCEPTANCE CRITERIA

The prototype is complete when:

1. Account creation flow matches the supplied screenshots.
2. Tester information and additional information screens match the supplied screenshots.
3. First-login rabbit guide introduces the rabbit and key tabs.
4. Home dashboard matches the supplied screenshot.
5. Region confirmation modal matches the supplied screenshot.
6. Client information screen matches the supplied screenshot.
7. Glasses question screen is generated.
8. Right-eye distance vision screen is generated before the existing left-eye screen.
9. Existing left-eye distance vision screen remains part of the flow.
10. Both-eyes distance vision screen is generated after the existing left-eye screen.
11. Near vision no-glasses screen is generated.
12. Reading-glasses question screen is generated.
13. Near vision own-glasses screen and “NEAR VISION IS BAD — NOW DO WHEEL TEST” alert are generated.
14. Wheel test PD screen is generated.
15. Wheel test right-eye lens selection screen is generated.
16. Right distance vision at the wheel screen is generated.
17. Wheel test left-eye lens selection screen is generated.
18. Final summary placeholder is generated.
19. Tester profile screen includes carrots, progress to next badge, and visible badges.
20. Community garden screen shows total eyepieces given out and offline upload encouragement.
21. Tutorial tab contains short live-assistance guides.
22. Every clinical screen uses the dark purple OOXii style.
23. Rabbit guidance appears without blocking or slowing the tester.
24. Help buttons use visible “Help” text, not just a question mark.
25. Required fields validate before moving forward.
26. Missing fields are centered and highlighted with supportive error copy.
27. No personal client data is collected.
28. The interface remains simple, obvious, and field-ready.

FINAL IMPLEMENTATION INSTRUCTIONS

Before generating:
1. Inspect the existing code.
2. Identify the existing App.tsx structure.
3. Reuse the existing theme colours and components.
4. Preserve the existing left-eye distance vision screen.
5. Add surrounding screens and state transitions.
6. Keep logic local and simple.
7. Use mock data where needed.
8. Ensure the prototype runs without backend setup.

After generating:
1. Check that the app builds.
2. Check that the flow can be clicked from signup through the clinical test screens.
3. Check that the existing left-eye distance screen still appears in the correct order.
4. Check that validation prevents moving forward when required fields are missing.
5. Check that the rabbit does not obscure inputs.
6. Check that Help buttons are visible and understandable.
7. Check that the app remains visually consistent with the supplied screenshots.

Now extend the existing OOXii prototype with the rest of the app.