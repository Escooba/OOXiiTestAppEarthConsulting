You are Gemini 3.1 Pro working inside Figma Make.

Create a high-fidelity interactive prototype for a new OOXii app feature called:

“Rabbit Race Current-Step Guide”

This feature redesigns the current OOXii progress bar into a race-track style progress system. A small rabbit mascot shows the tester where they are in the testing process, points to the current required step, and prevents the user from racing ahead before the current line/field is completed.

The design should be based on the provided hand sketch:
- Top progress area becomes a race track.
- A rabbit mascot sits on the track to show current progress.
- A finish line appears at the end of the track.
- The page visually centres on the current step in the process.
- If the user presses Next without filling required information on the current line, an error message appears.
- The rabbit should help show the user what to do next.

Do not create a generic progress bar. It should feel like a race.

PROJECT CONTEXT

OOXii is a guided vision testing app used by lay testers in low-resource settings. The app helps non-specialists complete vision testing by walking them through a strict step-by-step decision tree.

The purpose of this feature is to reduce tester confusion by making the current step visually obvious.

The key problem to solve:
A lay tester may not know exactly where they are in the workflow or what field they must complete before pressing Next.

The proposed solution:
Use a rabbit mascot and race-track progress system to show:
1. where the tester is,
2. what step is currently active,
3. what step comes next,
4. why they cannot continue if the current information is incomplete.

CORE FEATURE RULE

IF the tester is on a test page,
THEN the app shows a race-track progress bar at the top of the page.

IF the tester is on the current required step,
THEN the rabbit sits above that point in the race and a clear callout points to the active field/card.

IF the tester presses Next without completing all required inputs in the current step,
THEN the rabbit does not move, the page centres on the incomplete step, and an error message appears beside the missing field.

IF the tester completes the current step correctly and presses Next,
THEN the rabbit moves forward along the race track and the page centres on the next required step.

DESIGN GOAL

Create a Figma prototype that proves this one interaction:

Tester lands on the Distance Vision page
→ rabbit race track shows current progress
→ current input step is centred on screen
→ tester presses Next while a required field is incomplete
→ error appears beside the incomplete field
→ rabbit callout explains what to fix
→ tester completes the field
→ presses Next again
→ rabbit moves forward on the race track
→ next step becomes centred and highlighted

Use the current OOXii dark purple interface style, not a generic gamified app style.

OOXII UI STYLE TO MATCH

Use the existing OOXii visual language:
- Full-screen dark purple/navy background.
- Light/white text.
- Teal accent where needed.
- Rounded cards and input fields.
- Large touch targets.
- Minimal layout.
- Clean, field-ready interface.
- High contrast for outdoor sunlight.
- Avoid white full-page backgrounds.
- Avoid childish or overly playful visuals.

The rabbit should make the workflow clearer, not make the app feel like a children’s game.

Suggested visual tone:
- Friendly
- Calm
- Lightweight
- Helpful
- Medical-adjacent but approachable
- Simple enough for low-end devices

CORE SCREEN TO DESIGN

Create the main screen:

“Distance vision — Left eye”

This should resemble the existing OOXii distance vision input page:
- Dark purple background.
- Top OOXii header/nav if space allows.
- Race-track progress bar at the top.
- Main content centred in a narrow column.
- Illustration card showing a person covering one eye.
- Instruction text.
- Input fields.
- Next and Back buttons.

The focus is not the clinical calculation. The focus is the current-step guidance.

SCREEN CONTENT

Top header:
- OOXii logo top-left.
- Optional status pill: “Online”
- Optional nav: Home, Tutorial, Settings, Logout

Race-track progress bar:
- A horizontal race track across the top of the page.
- Start marker on the left.
- Finish line flag on the right.
- Rabbit mascot placed on the current step.
- Small milestone dots along the track.
- Current milestone highlighted.
- Completed milestones visually filled.
- Future milestones greyed out.
- Label near rabbit: “You are here”
- Optional small progress text: “Step 2 of 5”

Race milestones:
1. Cover eye
2. Select line
3. Letters correct
4. Review result
5. Finish

For the first screen state, the rabbit should be at milestone 2: “Select line”.

Main page title:
“Distance vision”
“Left eye”

Instruction card:
- Illustration of a person covering their right eye.
- Text:
  “No glasses, ask the person to cover their right eye with the palm of their hand.”

Current active step card:
Create a visually highlighted card around the current required input.

Card heading:
“Current step”

Card body:
“Select the smallest OOXii line number with all letters correct.”

Field label:
“Smallest OOXii line number with all letters correct”

Dropdown:
Placeholder:
“Select OOXii line number”

Options shown visually:
Line 0, Line 1, Line 2, Line 3, Line 4, Line 5, Line 6, Line 7, Line 8, Line 9, Line 10, Line 11

Secondary field:
“Select number of letters correct on next smaller line”

Radio options:
0, 1, 2, 3, 4

Readonly result field:
“Left eye distance vision no glasses — Snellen (metres)”

Placeholder:
“Auto-calculated from line selection”

Buttons:
- Primary button: “Next”
- Secondary button: “Back”

RABBIT MASCOT DESIGN

Create a simple rabbit mascot named “Elliot”.

Rabbit requirements:
- Small enough to sit on the race track.
- Visible enough to act as a progress marker.
- White or light-coloured body to contrast against the purple background.
- Friendly expression.
- Optional small running pose.
- Should not look childish, cartoonish, or distracting.
- Should work at small size.

Rabbit callout bubble:
The rabbit can show a short speech bubble when needed.

Default callout:
“You’re here. Complete this step to keep going.”

Error callout:
“Almost there — finish this field before moving on.”

Success callout:
“Nice. On to the next step.”

RACE TRACK DESIGN

The race track should replace the ordinary progress bar.

Visual details:
- Use a thin horizontal track with rounded ends.
- Completed section can use teal.
- Current section can glow subtly.
- Future section can be muted purple/grey.
- Place small circular checkpoint dots on the track.
- The rabbit sits above or directly on the current checkpoint.
- Add a small finish flag at the far right.
- The finish flag should be visible but not oversized.

The race track should still feel useful in a clinical workflow. Keep the styling restrained.

PAGE CENTERING REQUIREMENT

The page must clearly centre on the current active step.

Design this in Figma by creating frames/states where:
- The active step card is positioned in the visual centre of the viewport.
- Other content can sit above or below, but the active input should be the main focus.
- The rabbit callout visually points toward the active input.
- Completed or non-active sections are slightly muted.
- The active step uses a stronger border, subtle glow, or highlight.

When the user presses Next with missing information:
- The prototype should navigate to an error-state frame.
- In that frame, the incomplete field is centred in the viewport.
- The error appears directly next to or under the field.
- The rabbit callout points to that field.

ERROR STATE

Create a dedicated error state for when the tester presses Next too early.

Trigger:
User presses “Next” without selecting the OOXii line number.

Error behaviour:
- Do not advance the race track.
- Do not move the rabbit.
- Keep the rabbit at “Select line”.
- Highlight the incomplete dropdown with a red or orange border.
- Show an inline error message.
- Centre the active card in the viewport.
- Add a rabbit speech bubble explaining what is missing.

Error message:
“Select the OOXii line number before continuing.”

Rabbit error bubble:
“Finish this line first, then we can move forward.”

Tone:
- Helpful, not punitive.
- No harsh wording.
- No large blocking warning screen unless needed.

VISUAL ERROR STYLE

Use:
- Warm red/orange border.
- Small warning icon.
- High-contrast text.
- Keep the dark purple background.
- Avoid full-screen red.
- Error must be visible in sunlight.

Example:
Dropdown border turns orange/red.
Text below field:
“Required: choose the smallest line the client read correctly.”

PROTOTYPE STATES TO CREATE

Create these Figma frames:

FRAME 1 — Default current-step screen
Name:
“01 Distance Vision — Current Step”

State:
- Rabbit at checkpoint 2: Select line.
- Active step card centred.
- Dropdown empty.
- No error.
- Next button visible.

FRAME 2 — Error after pressing Next
Name:
“02 Distance Vision — Missing Line Error”

State:
- Same page.
- Rabbit has not moved.
- Active card centred.
- Dropdown highlighted as incomplete.
- Error message visible:
  “Select the OOXii line number before continuing.”
- Rabbit speech bubble:
  “Finish this line first, then we can move forward.”

FRAME 3 — Completed current step
Name:
“03 Distance Vision — Line Selected”

State:
- Dropdown selected:
  “Line 7”
- Letter count selected:
  “1”
- Snellen field shows:
  “6/12+1”
- Error removed.
- Rabbit bubble:
  “Nice. Press Next to continue.”

FRAME 4 — Rabbit advances to next step
Name:
“04 Distance Vision — Next Step Centred”

State:
- Rabbit moves to checkpoint 3: Letters correct, or to the next required workflow step depending on the page structure.
- Current card changes to the next active step.
- Page centres on that next active step.
- Previous step appears completed with a check mark.
- Progress track updates.

FRAME 5 — Finish preview
Name:
“05 Race Progress — Finish Preview”

State:
- Show a later-stage view with rabbit near the finish line.
- This frame is only to demonstrate the race metaphor.
- Do not build a full app workflow around it.

PROTOTYPE INTERACTIONS

Set up clickable prototype interactions:

From Frame 1:
- Clicking Next goes to Frame 2 using Smart Animate.
- Clicking the dropdown or “Line 7” selection goes to Frame 3.

From Frame 2:
- Clicking the dropdown or “Line 7” selection goes to Frame 3.
- Clicking Back returns to Frame 1.

From Frame 3:
- Clicking Next goes to Frame 4 using Smart Animate.
- Rabbit movement should animate smoothly along the track.

From Frame 4:
- Clicking Continue or Next can go to Frame 5.

Use Smart Animate where possible for:
- Rabbit movement.
- Progress track fill.
- Error appearing.
- Active card centring.
- Step highlight changes.

CURRENT STEP HIGHLIGHTING

Use a clear but subtle highlight around the active step.

Possible styling:
- 2px teal or white border.
- Soft glow.
- Slight elevation.
- Small label: “Current step”
- Rabbit pointer arrow pointing to the card.

Completed step styling:
- Check mark.
- Muted but readable.
- No error.

Future step styling:
- Greyed out.
- Not interactable.
- Small lock icon optional.

COPY TO USE

Progress track labels:
- Cover eye
- Select line
- Letters correct
- Review
- Finish

Header:
“Distance vision”
“Left eye”

Instruction:
“No glasses, ask the person to cover their right eye with the palm of their hand.”

Current step card:
“Current step”
“Select the smallest OOXii line number with all letters correct.”

Dropdown label:
“Smallest OOXii line number with all letters correct”

Radio label:
“Select number of letters correct on next smaller line”

Result label:
“Left eye distance vision no glasses — Snellen (metres)”

Error text:
“Select the OOXii line number before continuing.”

Helper text:
“This keeps the test in the correct order.”

Rabbit default bubble:
“You’re here. Complete this step to keep going.”

Rabbit error bubble:
“Finish this line first, then we can move forward.”

Rabbit success bubble:
“Nice. On to the next step.”

Button labels:
“Next”
“Back”
“Continue”

RESPONSIVE DESIGN

Create the main prototype in a mobile/tablet frame first.

Preferred frame:
- 390 × 844 or similar mobile size.
- Also create one wider tablet/desktop variant if Figma Make can generate it cleanly.

Mobile requirements:
- Race track remains visible at top.
- Rabbit remains readable.
- Active step card is centred.
- Inputs are full width within a narrow column.
- Buttons are large enough for touch.
- No small text below 12px.
- Avoid dense layouts.

Tablet/desktop requirements:
- Main content remains centred.
- Do not stretch the form too wide.
- Max content width around 430–480px.
- Race track can span wider, but milestone labels should not crowd.

ACCESSIBILITY REQUIREMENTS

Use:
- Strong colour contrast.
- Large touch targets.
- Clear visual hierarchy.
- Error text plus visual border, not colour alone.
- Plain language.
- Minimal cognitive load.
- No fast or distracting animation.
- Rabbit should clarify the process, not distract from it.

Keep in mind:
The app may be used outdoors, on low-end devices, by testers who are new to the kit.

WHAT TO AVOID

Do not build:
- Leaderboard
- Certification badge
- Posting activities
- Payment flow
- Geolocation
- Inventory
- Returning-client recognition
- Full tutorial quiz
- Full clinical decision tree
- Login/authentication
- Personal client profile
- Real backend logic

Do not make:
- A generic progress bar.
- A childish game screen.
- A bright white interface.
- A cluttered dashboard.
- A mascot that overwhelms the clinical task.
- A skip-ahead navigation menu.

This PoC is only for:
Rabbit race progress
+ current-step centring
+ missing-field validation
+ step advancement feedback.

FIGMA LAYERS / COMPONENTS TO CREATE

Create reusable components:

1. RaceProgressBar
Variants:
- currentStep = 1, 2, 3, 4, 5
- error = true/false
- completedSteps = 0–5

2. RabbitMascot
Variants:
- default
- pointing
- error
- success
- running

3. RabbitSpeechBubble
Variants:
- default
- error
- success

4. StepCard
Variants:
- active
- completed
- locked
- error

5. OOXiiDropdown
Variants:
- empty
- selected
- error

6. OOXiiButton
Variants:
- primary
- secondary
- disabled

7. InlineErrorMessage

DESIGN ACCEPTANCE CRITERIA

The prototype is successful when:

1. The top progress bar clearly looks like a race track.
2. The rabbit clearly shows the user’s current position.
3. The finish line is visible at the end of the track.
4. The current step is centred in the viewport.
5. The current input card is visually highlighted.
6. Pressing Next with missing information shows an inline error.
7. The error clearly explains what the tester must complete.
8. The rabbit does not advance when information is missing.
9. Selecting the required information clears the error.
10. Pressing Next after completion moves the rabbit forward.
11. The next step becomes centred and highlighted.
12. The design matches OOXii’s dark purple/light text style.
13. The rabbit improves clarity without making the app feel unserious.
14. Future steps are shown but visually locked or muted.
15. The prototype works as a clickable Figma flow.

FINAL OUTPUT EXPECTED FROM FIGMA MAKE

Generate:
- A high-fidelity mobile prototype.
- At least five named frames.
- Reusable components for the race bar, rabbit, step card, input field, and error.
- Clickable prototype links between frames.
- Smart Animate transitions for rabbit movement and error state.
- A clean visual hierarchy matching the existing OOXii app.

Now create the Figma prototype.