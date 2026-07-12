1. Update Garden.tsx state: add `currentView` ('mine' or 'community').
2. Add a header with left/right arrows to toggle between "My Plot" (YOUR_CARROTS) and "Global Plot" (GLOBAL_CARROTS).
3. The plot component: A CSS-styled farm field with dirt rows.
4. Logic for growing carrots: 
   - define MAX_PLOT_CAPACITY = 24 (e.g., 4 rows of 6).
   - tier = Math.floor(total / MAX_PLOT_CAPACITY)
   - countInCurrentPlot = total % MAX_PLOT_CAPACITY (if 0 and total > 0, show max but bigger).
   - Render carrots. A tier 0 carrot is small, tier 1 is medium, tier 2 is large, etc.
5. Provide a cartoony SVG for the carrot matching "fat rabbit image" vibe (orange, rounded, simple lines).
6. Ensure the section is animated (carrots popping up, swaying leaves, transitions between views).
