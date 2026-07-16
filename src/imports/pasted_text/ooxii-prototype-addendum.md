EXPANSION ADDENDUM — GLOBAL NAVIGATION, SETTINGS, SEARCH, REVIEW, FINALISATION, AND SUNGLASSES SELECTION

You are Claude Opus working inside Figma Make.

Continue expanding the existing OOXii prototype. Keep all prior instructions active unless this addendum explicitly changes them.

This addendum adds:

1. Always-accessible Home menu
2. Always-accessible Settings modal
3. Theme switching:
   - OOXii sunlight purple theme
   - Traditional light mode
   - Traditional dark mode
4. Language selection
5. Sunglasses selection
6. Glasses dispensed review
7. Final checklist
8. Additional details / comments
9. Test results saved confirmation
10. Find a client
11. Client profile
12. Vision testing review
13. Client glasses prescription review

Do not remove any previously requested app screens. Add these screens and states into the existing prototype flow.

GLOBAL RULE — HOME AND SETTINGS MUST ALWAYS BE ACCESSIBLE

The Home menu and Settings menu must be available from every page in the app.

This includes:
- signup/login screens where appropriate
- dashboard
- client setup
- all clinical testing screens
- dispensing screens
- review screens
- client profile screens
- final confirmation screens

Home must not be buried inside the flow.

Settings must not be a separate full page. Settings must open as a popup/modal over the current page so the user does not lose their place.

GLOBAL APP SHELL UPDATE

Create or update a reusable AppShell component.

Desktop/tablet header:
- OOXii logo top-left
- Home button
- Tutorial button
- Settings button
- Logout button
- Online pill if applicable

Mobile/tablet compact header:
- OOXii logo
- clearly labelled Home button
- clearly labelled Settings button
- optional menu button only if space requires it
- do not rely on icons alone

Important:
Critical actions must use text labels. Do not use only icons for Home or Settings.

The app should preserve the current screen state when Home or Settings is opened.

HOME MENU BEHAVIOUR

The Home button should open the main Home dashboard/menu.

The Home menu is the screen containing:
- New Client
- Search Client Info

When the user presses Home from inside an active test:
- Save current progress locally.
- Open the Home dashboard.
- Show a small “Test in progress” card if appropriate.

Example in-progress card:
“Test in progress”
“Client ID: 82016”
“Current step: Distance vision”
Button: “Resume test”

This keeps the home menu accessible without breaking the strict decision-tree rule. The user can return home, but they should not jump randomly between clinical modules.

Home dashboard cards:

Card 1:
Title:
“New Client”

Body:
“Conduct a test for a new client and set up their profile.”

Button:
“Start new test”

Card 2:
Title:
“Search Client Info”

Body:
“Find a client using their OOXii ID and review saved test information.”

Button:
“Search client”

Important:
Do not search by client name, phone, email, or date of birth.
Search should focus on anonymous OOXii/client IDs and allowed non-personal details.

SETTINGS MODAL — ALWAYS ACCESSIBLE

The Settings button must open a modal on top of the current page.

It should not navigate away from the current screen.

Settings modal requirements:

Title:
“Settings”

Section 1:
“Language”

Dropdown:
“Select language”

Language options:
- English
- Tok Pisin
- Bislama
- French
- Spanish
- Portuguese
- Bahasa Indonesia
- Mongolian

Default:
English

For the prototype, it is acceptable to mock the language selection without translating every screen. However, the UI must clearly show that language can be changed from Settings.

Section 2:
“Display mode”

Options:
1. OOXii sunlight purple
2. Traditional light mode
3. Traditional dark mode

Use radio cards or large selectable cards.

Option 1:
Title:
“OOXii sunlight purple”

Description:
“Best for outdoor testing and bright sunlight.”

Preview:
Dark purple background, teal accent, white text.

This is the default current theme.

Option 2:
Title:
“Traditional light mode”

Description:
“Light background with dark text.”

Preview:
White or very light background, dark navy text, teal accent.

Option 3:
Title:
“Traditional dark mode”

Description:
“Dark neutral background with light text.”

Preview:
Charcoal/black background, white text, teal accent.

Buttons:
- “Apply”
- “Cancel”

Close button:
- “X” in top-right
- keyboard accessible

Behaviour:
- Opening Settings must preserve current form entries.
- Cancel closes the modal without changing settings.
- Apply updates the selected language/display mode and returns to the current screen.
- The prototype should include at least one example state showing the Settings modal over a clinical screen.
- The prototype should include at least one theme-preview or applied-theme state for each display mode.

Do not make Settings a full-page route. It is always a popup over the current page.

THEME SYSTEM REQUIREMENTS

Create design tokens or component variants for three display modes.

Theme 1 — OOXii sunlight purple:
- background: dark OOXii purple
- text: white/off-white
- input background: white/light lavender
- button: pale lavender
- accent: teal
- this remains the primary theme

Theme 2 — Traditional light:
- background: white or very light grey
- card background: white
- text: dark navy/purple
- input background: white
- border: light grey
- accent: teal
- buttons remain large and rounded

Theme 3 — Traditional dark:
- background: charcoal or near-black
- card background: dark grey
- text: white/off-white
- input background: dark grey or light fields where needed
- accent: teal
- buttons remain large and rounded

Important:
Even in light/dark modes, maintain OOXii component structure and simple workflow. Do not redesign the app completely.

UPDATED FLOW AFTER SUNGLASSES DISPENSED

Extend the clinical/dispending flow as follows:

Sunglasses dispensed question
→ Sunglasses selection, if Yes
→ Glasses Dispensed Review
→ Final checklist
→ Additional details
→ Test results saved
→ Return to Home dashboard

If sunglasses are not dispensed:
Sunglasses dispensed question
→ Glasses Dispensed Review
→ Final checklist
→ Additional details
→ Test results saved
→ Return to Home dashboard

SCREEN L — SUNGLASSES SELECTION

Create the “Sunglasses selection” screen shown in the screenshot.

Title:
“Sunglasses selection”

Instruction:
“Select a sunglass type”

Radio options:
- OOXii black/red
- OOXii black
- OOXii metal frame mirrored
- Other brand

Layout:
- dark purple background
- centred content
- two-column radio layout on wider screens
- one-column layout on narrow mobile screens
- large touch targets
- white text
- radio controls matching existing OOXii style

Buttons:
- Next
- Back

Validation:
- User must select one sunglass type before continuing.
- If Next is clicked without a selection, show:
  “Select a sunglass type before continuing.”

Default selected prototype state:
- OOXii metal frame mirrored

Stored data:
sunglassesType:
- “OOXii black/red”
- “OOXii black”
- “OOXii metal frame mirrored”
- “Other brand”

SCREEN M — GLASSES DISPENSED REVIEW

Create the “Glasses Dispensed Review” screen shown in the screenshot.

Title:
“Glasses Dispensed Review”

Subtitle:
“Review by dispensed type, then enter the total amount paid.”

Review cards:
1. Distance Glasses Dispensed
2. Reading Glasses Dispensed
3. Sunglasses Dispensed

Each review card:
- rounded rectangle
- dark purple card background
- light border
- large label
- blue/teal check icon on right when complete
- clickable to view/edit that dispensed section if needed

Total price section:

Label:
“Total price paid”

Input:
- currency prefix box: “A$”
- placeholder:
  “e.g. 25.00”

Important:
This is not an in-app payment system.
It is only a manual record of an amount paid outside the app.

Do not add:
- payment gateway
- card payment
- checkout
- app-store payment
- QR payment
- transaction processing

Buttons:
- Next
- Back

Validation:
- Price can be optional or required depending on the prototype state.
- If required and missing, show:
  “Enter the total amount paid, or enter 0 if there was no payment.”

Suggested default prototype value:
A$ 1000

Stored data:
dispensedReview = {
  distanceGlassesComplete: true,
  readingGlassesComplete: true,
  sunglassesComplete: true,
  totalPricePaid: "1000",
  currency: "AUD"
}

SCREEN N — FINAL CHECKLIST

Create the “Final checklist” screen shown in the screenshot.

Title:
“Final checklist”

Subtitle:
“Review your checklist”

Checklist items:
1. Results card completed
2. Glasses care instructions given
3. Asked to return if any problems with glasses
4. Advised to have regular eye health checks

Each item:
- large rounded light card
- circular checkbox on left
- text label
- large tap target
- selected state with teal or blue check

Buttons:
- Next
- Back

Validation:
- All checklist items must be checked before continuing.
- If Next is clicked too early, show:
  “Complete each checklist item before continuing.”

Rabbit guidance:
- Rabbit may point to the first unchecked item.
- Rabbit must not cover the checklist.

SCREEN O — ADDITIONAL DETAILS

Create the “Additional details” screen shown in the screenshot.

Title:
“Additional details”

Field:
“Comments”

Textarea:
Placeholder:
“Enter additional comments”

Checkbox:
“Add clinical and/or referral information”

Buttons:
- Submit
- Back

Behaviour:
- Comments are optional.
- Checkbox is optional.
- If checkbox is selected, show an additional expandable section.

Expandable section if selected:
Title:
“Clinical and/or referral information”

Fields:
- Referral needed? Yes / No
- Reason for referral
- Urgency:
  - Routine
  - Soon
  - Urgent

Keep this simple. Do not create a full medical referral system.

Validation:
- If “Referral needed = Yes”, reason for referral is required.
- Otherwise, Submit can proceed.

SCREEN P — TEST RESULTS SAVED

Create the confirmation screen shown in the screenshot.

Visual:
- dark purple background
- centred illustration of smiling person with glasses
- large title
- supportive message

Title:
“Test results saved”

Message:
“You are the key to improving vision and improving lives! You are being returned to the dashboard.”

Behaviour:
- Show this screen after Additional details Submit.
- After a short delay or button click, return to Home dashboard.
- Include a visible button for prototype usability:
  “Return to dashboard”

Optional:
Rabbit success message:
“Great work. This test has been saved on this device.”

Stored state:
- Mark test session as completed.
- Update local client session.
- Update tester stats.
- Add carrots/badge progress if gamification is present.

SECTION — FIND A CLIENT

Create the “Find a client” screen shown in the screenshots.

This screen is accessed from:
Home dashboard → Search Client Info

Breadcrumb:
“Home › Clients”

Title:
“Find a client”

Search bar:
- full-width white rounded search field
- search icon on left
- placeholder:
  “Quick search for a client”

Search should support:
- OOXii/client ID
- tester name
- year of birth
- gender
- cataract surgery status
- region

Do not support:
- client name
- phone
- email
- full date of birth
- address

Client count:
Example:
“10 clients”

Refresh button:
- rounded square button
- refresh icon
- label or aria-label:
  “Refresh client list”

Client result cards:
Each card shows:
- Tester: John Smith
- Client ID: 82016
- Female, 1966
- Cataract surgery: No
- Albion Park, NSW, AU

Use “Client ID” or “OOXii ID” rather than “Patient ID” where possible.

Card style:
- dark purple card
- light border
- rounded corners
- enough spacing
- card is clickable

Create two states:

State 1 — all clients:
- Search field empty
- “10 clients”
- show at least 3 client cards

State 2 — filtered search:
- Search field contains “82016”
- “1 client”
- show only John Smith / Client ID 82016 card

Clicking a client card:
- navigates to Client profile.

SECTION — CLIENT PROFILE

Create the “Client profile” screen shown in the screenshot.

Breadcrumb:
“Home › Clients › Profile”

Title:
“Client profile”

Main profile card:
Heading:
“Tester : John Smith”

Section:
“Personal information”

Fields:
- Client ID: 82016
- Gender: Female
- Year of birth: 1966
- Cataract surgery: No
- Albion Park, NSW, AU

Button:
“Edit”

Use edit icon plus text. Do not use icon alone.

Section:
“Test sessions”

Session card:
- #182
- Created: 31 May 2026 01:56 pm
- Completed: 31 May 2026 02:00 pm

Buttons on session:
- Vision testing
- Glasses prescription

Bottom link/button:
“Back to clients”

Behaviour:
- Vision testing opens Vision testing review screen.
- Glasses prescription opens Client glasses prescription screen.
- Back to clients returns to Find a client.

Privacy:
Do not show client name, phone, email, address, or full date of birth.

SECTION — VISION TESTING REVIEW

Create the “Vision testing” review screen shown in the screenshots.

Breadcrumb:
“Home › Clients › Vision testing”

Title:
“Vision testing”

Description:
“Completed vision testing runs for this client. Review the dispensed products for each saved session.”

Session container:
- #182
- Created: 31 May 2026 01:56 pm
- Completed: 31 May 2026 02:00 pm

Inside the session, show review cards.

Card 1:
Title:
“Distance Glasses Dispensed”

Status pill:
“Dispensed”

Values:
Right lens: -1.5
Left lens: -2.5
Frame type: Plastic
Frame colour:
- Front: Red
- Right arm: Black
- Left arm: Black
Frame size: Medium

Card 2:
Title:
“Reading Glasses Dispensed”

Status pill:
“Dispensed”

Values:
Right lens: -1.0
Left lens: +1.0
Frame type: Plastic
Frame colour:
- Front: Black
- Right arm: Yellow
- Left arm: Yellow
Frame size: Medium

Card 3:
Title:
“Sunglasses Dispensed”

Status pill:
“Dispensed”

Values:
Frame type:
OOXii metal frame mirrored

Total:
A$ 1000

Buttons:
- Start new test
- Back to profile

Behaviour:
- Start new test starts a new test for the same anonymous client ID.
- Back to profile returns to Client profile.

Important:
This is a review screen only. It does not allow free editing unless an Edit action is explicitly added.

SECTION — CLIENT GLASSES PRESCRIPTION

Create the “Client glasses prescription” screen shown in the screenshots.

Breadcrumb:
“Home › Clients › Glasses prescription”

Title:
“Client glasses prescription”

Description:
“Distance and near vision prescriptions derived from completed test sessions.”

Session:
#182
Created: 31 May 2026 01:56 pm
Completed: 31 May 2026 02:00 pm

Card 1:
“Distance vision prescription”

Status pill:
“Wheel Test”

Create a segmented control:
- Ophthalmologist
- Paediatrician

Make two prototype states:
1. Ophthalmologist selected
2. Paediatrician selected

The selected tab should be white/light and clear.

Values:
RIGHT EYE
Sphere: -2.5
Cylinder: 0.00

LEFT EYE
Sphere: -2.5
Cylinder: 0.00

FRAMES
Type: Plastic
Front: Red
Right arm: Black
Left arm: Black
Size: Medium

Card 2:
“Near vision (reading addition)”

Status pill:
“Paddle Test”

Values:
Right eye: -1.0
Left eye: +1.0

Helper text:
“Reading lens power — no cylinder conversion required.”

Card 3:
“Sunglasses Dispensed”

Status pill:
“Dispensed”

Values:
Frame type:
OOXii metal frame mirrored

Helper text:
“Sunglasses do not carry prescription values.”

Button:
“Back to profile”

Behaviour:
- Back to profile returns to Client profile.

SECTION — UPDATED SUNGLASSES FLOW

Update the sunglasses part of the clinical flow.

Existing screen:
“Sunglasses dispensed ?”

If user selects No:
- proceed to Glasses Dispensed Review

If user selects Yes:
- proceed to Sunglasses selection
- after sunglass type is selected, proceed to Glasses Dispensed Review

Required validation:
- Sunglasses dispensed question requires Yes/No.
- Sunglasses selection requires sunglass type if Yes.

SECTION — SETTINGS MODAL PROTOTYPE FRAMES

Add these named Figma frames:

Settings frames:
- Settings Modal — OOXii Purple Selected
- Settings Modal — Language Dropdown Open
- Settings Modal — Traditional Light Selected
- Settings Modal — Traditional Dark Selected
- Current Page with Settings Overlay
- Current Page After Light Mode Applied
- Current Page After Traditional Dark Mode Applied

Home frames:
- Home Dashboard
- Home Dashboard — Test In Progress
- Home Menu Open Over Test Page, if using overlay version

Client search frames:
- Find Client — All Results
- Find Client — Search 82016
- Client Profile
- Vision Testing Review
- Client Glasses Prescription — Ophthalmologist
- Client Glasses Prescription — Paediatrician

End-of-flow frames:
- Sunglasses Selection
- Glasses Dispensed Review
- Final Checklist — Empty
- Final Checklist — Complete
- Additional Details
- Additional Details — Referral Expanded
- Test Results Saved

SECTION — UPDATED COMPONENTS

Create or update these reusable components:

1. GlobalHeader
Variants:
- desktop/tablet
- mobile
- signed out
- signed in
- in-test

Always includes:
- Home
- Settings

2. HomeDashboardCard
Variants:
- New Client
- Search Client Info
- Resume Test

3. SettingsModal
Includes:
- language selector
- display mode selector
- Apply
- Cancel

4. ThemeOptionCard
Variants:
- OOXii sunlight purple
- traditional light
- traditional dark
- selected / unselected

5. ClientSearchBar

6. ClientResultCard

7. ClientProfileCard

8. SessionCard

9. ReviewSummaryCard

10. PrescriptionCard

11. SegmentedControl
Variants:
- Ophthalmologist selected
- Paediatrician selected

12. ChecklistItem
Variants:
- unchecked
- checked
- error

13. CurrencyInput
Prefix:
A$

14. SunglassTypeRadioGroup

15. ConfirmationSuccessScreen

SECTION — UPDATED DATA MODEL

Add or adapt these local mock data structures.

type AppSettings = {
  language: "English" | "Tok Pisin" | "Bislama" | "French" | "Spanish" | "Portuguese" | "Bahasa Indonesia" | "Mongolian";
  displayMode: "ooxii_purple" | "traditional_light" | "traditional_dark";
};

type HomeState = {
  activeTestSessionId?: string;
  hasInProgressTest: boolean;
};

type SunglassesRecord = {
  sunglassesDispensed: boolean;
  sunglassesType?: "OOXii black/red" | "OOXii black" | "OOXii metal frame mirrored" | "Other brand";
};

type DispensedReview = {
  distanceGlassesComplete: boolean;
  readingGlassesComplete: boolean;
  sunglassesComplete: boolean;
  currency: "AUD";
  totalPricePaid: string;
};

type FinalChecklist = {
  resultsCardCompleted: boolean;
  glassesCareInstructionsGiven: boolean;
  returnIfProblemsExplained: boolean;
  regularEyeHealthChecksAdvised: boolean;
};

type AdditionalDetails = {
  comments?: string;
  includeClinicalOrReferralInfo: boolean;
  referralNeeded?: boolean;
  referralReason?: string;
  referralUrgency?: "Routine" | "Soon" | "Urgent";
};

type ClientSearchRecord = {
  clientId: string;
  testerName: string;
  gender: string;
  yearOfBirth: number;
  cataractSurgery: string;
  region: string;
  latestSessionId: string;
};

type ClientProfile = {
  clientId: string;
  gender: string;
  yearOfBirth: number;
  cataractSurgery: string;
  region: string;
  testSessions: TestSessionSummary[];
};

type TestSessionSummary = {
  sessionNumber: string;
  createdAt: string;
  completedAt: string;
  distanceGlasses?: DistanceGlassesDispensedSummary;
  readingGlasses?: ReadingGlassesDispensedSummary;
  sunglasses?: SunglassesRecord;
  totalPaid?: string;
};

type DistanceGlassesDispensedSummary = {
  rightLens: string;
  leftLens: string;
  frameType: "Plastic" | "Metal";
  frontColour: string;
  rightArmColour: string;
  leftArmColour: string;
  frameSize: "Small" | "Medium" | "Large";
  status: "Dispensed" | "Not dispensed";
};

type ReadingGlassesDispensedSummary = {
  rightLens: string;
  leftLens: string;
  frameType: "Plastic" | "Metal";
  frontColour: string;
  rightArmColour: string;
  leftArmColour: string;
  frameSize: "Small" | "Medium" | "Large";
  status: "Dispensed" | "Not dispensed";
};

type GlassesPrescription = {
  sessionNumber: string;
  distancePrescription: {
    source: "Wheel Test";
    prescriptionView: "Ophthalmologist" | "Paediatrician";
    rightSphere: string;
    rightCylinder: string;
    leftSphere: string;
    leftCylinder: string;
    frameType: string;
    frontColour: string;
    rightArmColour: string;
    leftArmColour: string;
    frameSize: string;
  };
  nearReadingAddition: {
    source: "Paddle Test";
    rightEye: string;
    leftEye: string;
  };
  sunglasses?: {
    status: "Dispensed";
    frameType: string;
  };
};

SECTION — UPDATED VALIDATION RULES

Apply these additional rules:

IF Settings is opened,
THEN the current page state must remain unchanged behind the modal.

IF the user changes display mode and clicks Apply,
THEN update the app theme without clearing form values.

IF the user clicks Home during a test,
THEN save current progress and show the Home dashboard with a Resume Test option.

IF sunglasses dispensed = Yes,
THEN sunglass type is required.

IF sunglasses dispensed = No,
THEN skip Sunglasses selection.

IF total price paid is required and empty,
THEN show an inline error under the currency field.

IF any final checklist item is unchecked,
THEN do not proceed to Additional details.

IF clinical/referral information is enabled and referral is Yes,
THEN referral reason is required.

IF client search is empty,
THEN show all available anonymous client records.

IF client search is “82016”,
THEN show only the client with ID 82016.

SECTION — UPDATED ACCEPTANCE CRITERIA

The expanded prototype is complete when:

1. Home is accessible from every page.
2. Settings is accessible from every page.
3. Settings opens as a modal overlay, not a full page.
4. Settings allows language selection.
5. Settings allows switching between:
   - OOXii sunlight purple
   - Traditional light mode
   - Traditional dark mode
6. Opening Settings does not clear current page data.
7. Pressing Home during a test saves progress and shows a Resume Test option.
8. Home dashboard contains New Client and Search Client Info.
9. Sunglasses selection screen matches the supplied screenshot.
10. Sunglasses selection includes:
    - OOXii black/red
    - OOXii black
    - OOXii metal frame mirrored
    - Other brand
11. Glasses Dispensed Review matches the supplied screenshot.
12. Glasses Dispensed Review includes completion cards and total price paid.
13. Total price paid is treated as manual external payment recording only, not payment processing.
14. Final checklist matches the supplied screenshot.
15. Additional details screen matches the supplied screenshot.
16. Test results saved screen matches the supplied screenshot.
17. Find a client screen matches the supplied screenshots.
18. Search by 82016 filters the client list to one result.
19. Client profile screen matches the supplied screenshot.
20. Vision testing review screen matches the supplied screenshots.
21. Client glasses prescription screen matches the supplied screenshots.
22. Client glasses prescription has Ophthalmologist and Paediatrician segmented states.
23. All client screens avoid personal client names, phone numbers, emails, addresses, and full dates of birth.
24. All new screens use the same OOXii rounded dark purple style.
25. Validation prevents forward movement where required data is missing.
26. Next and Back buttons work throughout the flow.
27. The final saved confirmation returns to Home dashboard.
28. No out-of-scope backend, GPS, payment gateway, inventory engine, or personal-data recognition system is added.

FINAL CHECK BEFORE COMPLETION

Before finishing, verify:

- Home is visible or accessible on every screen.
- Settings is visible or accessible on every screen.
- Settings opens above the current page.
- Language and display mode controls are clear.
- Theme changes are shown in the prototype.
- Sunglasses selection is included after Sunglasses dispensed = Yes.
- Review, checklist, details, and saved confirmation complete the test flow.
- Client search, client profile, vision testing review, and glasses prescription review are connected.
- The app still follows the strict clinical decision-tree flow.
- All new screens match the OOXii visual style.
- No personal client data is introduced.
- Payment is represented only as a manually recorded total amount paid.

Now expand the OOXii prototype with these global navigation, settings, review, client search, prescription review, and end-of-test features.