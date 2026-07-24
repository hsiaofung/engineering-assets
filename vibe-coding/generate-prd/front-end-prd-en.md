```markdown
# Page Flow Document — Ingredient-to-Recipe Matcher (MVP)

## 1. Project Overview
This is a focused, stateless web utility that solves a common kitchen frustration: standing in front of an open fridge or pantry and having no idea what to cook with the ingredients already on hand. Users simply type the items they currently possess; the app instantly ranks a curated set of recipes by how completely those ingredients cover each recipe. The highest-ranked results require the fewest (or zero) additional purchases, making the tool immediately useful in the moment of decision.

Target users are everyday home cooks, busy parents, students, and anyone who wants to reduce food waste and decision fatigue. Primary goals are speed, clarity of match quality, and zero friction—no accounts, no sign-up walls, no saved lists. The experience is deliberately single-purpose so a user can go from “what do I have?” to “here’s what I can make” in under 30 seconds.

Key business / product objectives for the MVP:
- Demonstrate that ingredient-match ranking is more useful than traditional keyword search.
- Validate that a clean, mobile-first flow with minimal navigation keeps users engaged long enough to view at least one full recipe.
- Create a solid foundation that can later accept real recipe APIs or user accounts without rewriting core journeys.

Success for this version is measured by qualitative feedback (“I actually cooked something with what I had”) and quantitative signals such as percentage of sessions that reach a recipe detail page and average number of ingredients entered before searching.

## 2. User Types and Permissions
There is only one user type in the MVP: the anonymous guest.

- No authentication, no registration, no login screens.
- No permission levels or feature gating.
- Every visitor has full access to ingredient input, search, ranked results, and recipe detail.
- No user-generated content, no personal data storage beyond the current browser session’s ingredient list (which is cleared on refresh or explicit “Clear” action).
- Future-proofing note: the page structure and route hierarchy are kept simple so that an optional authenticated layer (saved recipes, dietary preferences) can be added later without breaking existing flows. For now, zero identity is required or expected.

This pure-guest model eliminates every possible barrier between the user standing in the kitchen and the moment of insight.

## 3. Navigation and Information Architecture
Primary navigation is a sticky bottom tab bar optimized for one-handed mobile use:

- Tab 1: “Ingredients” (default landing tab) — ingredient input and “Find Recipes” action.
- Tab 2: “Results” — ranked list of matching recipes.
- Optional lightweight third tab: “About” (can be omitted or reduced to a simple info icon if preferred).

Recipe detail is never a tab. It is a full-page view reached by tapping a result card. A prominent back control (and browser/hardware back support) returns the user to the Results tab, preserving the current ingredient list and ranking.

Route hierarchy (conceptual, for deep-linking and browser history):
- `/` or `/ingredients` → Ingredients tab
- `/results` → Results tab (only meaningful after a search)
- `/recipe/:id` → full recipe detail

Breadcrumbs are unnecessary because the hierarchy is only two levels deep. On larger screens the bottom tab bar can remain or gracefully convert to a minimal top bar; the core mental model stays identical.

Search functionality lives exclusively inside the Ingredients tab (the tag input itself). There is no global search bar. Mobile navigation differences are minimal: the sticky bottom bar is always present except on the full-screen recipe detail, where it is replaced by a simple top back header.

## 4. Core User Flows

### Flow 1: Primary Ingredient-to-Recipe Journey
Entry Point: User opens the app (lands on Ingredients tab).  
Prerequisites: None.  
Steps:
1. User sees empty ingredient input with friendly prompt → types first ingredient and hits Enter → pill appears.
2. User continues adding ingredients (each becomes a removable pill).  
3. Once ≥1 pill exists, primary “Find Recipes” button becomes enabled.  
4. User taps “Find Recipes” → app switches to Results tab and displays ranked cards.  
5. User scans cards, notes match percentages and missing ingredients → taps a card.  
6. Full recipe detail page opens.  
Success State: User is reading clear steps and can cook immediately or decide to adjust ingredients.  
Error Scenarios: No matches → friendly empty state with CTA back to Ingredients. Network/mock failure → simple retry message.  
Alternative Paths: User can remove pills and re-search at any time; back from detail returns to the exact ranked list.

### Flow 2: Refining the Ingredient List
Entry Point: Results tab or Ingredients tab after a previous search.  
Steps:
1. User returns to Ingredients tab (or uses clear/remove on existing pills).  
2. Adds or removes ingredients.  
3. Taps “Find Recipes” again → Results tab refreshes with new ranking.  
Success State: Updated ranked list reflecting the new set.  
Alternative Paths: “Clear all” action resets to the initial empty state.

### Flow 3: Quick Exploration from Empty State
Entry Point: First visit or after clearing ingredients.  
Steps:
1. User sees welcoming empty state on Ingredients tab.  
2. Optionally taps a suggested sample ingredient set (if implemented) or begins typing.  
3. Proceeds into Flow 1.  
Success State: User experiences the ranking value quickly.

### Flow 4: Recipe Detail Deep Dive
Entry Point: Any result card.  
Prerequisites: A search has been performed.  
Steps:
1. User taps card → full-page detail loads.  
2. User scrolls through hero image, stats, matched/missing ingredients, and numbered steps.  
3. User taps back → returns to Results with state preserved.  
Error Scenarios: Recipe data missing → “Recipe unavailable” + back button.

## 5. Detailed Page Specifications

### Page: Ingredients (Home / Input)
Route: `/` or `/ingredients`  
Purpose: Capture the user’s current pantry/fridge contents and trigger search.  
User Access: Everyone.  
Layout Structure:
- Header: App title / logo (minimal).  
- Main Content: Large tag-style input, list of current ingredient pills, primary “Find Recipes” button.  
- Footer: Sticky bottom tab bar.  

ASCII Wireframe:
```
┌─────────────────────────────┐
│  What can I cook?           │
├─────────────────────────────┤
│  [Type an ingredient...   ] │
│                             │
│  [chicken ×] [rice ×]       │
│  [garlic ×]                 │
│                             │
│      [ Find Recipes ]       │
│                             │
│  (friendly empty prompt     │
│   when no pills)            │
├─────────────────────────────┤
│  Ingredients │ Results      │
└─────────────────────────────┘
```

Primary Data Displayed:
- Current ingredient pills (text + remove control).  
- Button enabled/disabled state.  

User Actions:
- Type + Enter → add pill.  
- Tap × on pill → remove instantly.  
- Tap “Find Recipes” → navigate to Results with ranking.  
- Tap Results tab → switch (shows previous results if any).  

Interactions:
- Input focuses on load.  
- Pills are tappable only for removal.  
- Button provides clear disabled styling until valid.  

State Variations:
- Loading: not applicable (client-side).  
- Empty: welcoming message + ready input.  
- Error: none expected.  
- Success: pills accumulate, button activates.  

Mobile Considerations:
- Input and button sized for thumb reach.  
- Pills wrap naturally.  

Edge Cases:
- Duplicate ingredient entry → ignore or quietly replace.  
- Extremely long ingredient name → truncate with tooltip or allow wrap.

### Page: Results
Route: `/results`  
Purpose: Show recipes ranked by ingredient match percentage so the user can choose the best fit.  
User Access: Everyone (meaningful only after search).  
Layout Structure:
- Header: subtle “Based on your ingredients” or match summary.  
- Main Content: vertical stack of recipe cards.  
- Footer: sticky tab bar.  

ASCII Wireframe:
```
┌─────────────────────────────┐
│  12 recipes ranked for you  │
├─────────────────────────────┤
│ ┌─────┐ Title               │
│ │ img │ 5 of 7 ingredients  │
│ └─────┤ 25 min · Easy       │
│       │ Missing: soy sauce  │
├─────────────────────────────┤
│ ┌─────┐ Next recipe...      │
│ ...                         │
├─────────────────────────────┤
│  Ingredients │ Results      │
└─────────────────────────────┘
```

Primary Data Displayed:
- Recipe title, thumbnail image.  
- Match ratio (“You have X of Y”).  
- Cook time, difficulty.  
- Missing ingredient chips (highlighted).  

User Actions:
- Tap card → open full recipe detail.  
- Switch to Ingredients tab to refine.  

Interactions:
- Cards have clear press states.  
- Ranking is strictly by match percentage (ties broken by cook time or alphabetical).  

State Variations:
- Loading: skeleton cards or brief spinner.  
- Empty (no matches): friendly message + “Edit ingredients” CTA.  
- Error: “Something went wrong — try again”.  
- Success: ranked list, highest match first.  

Filtering/Sorting: none in MVP (ranking is the sort).  

Mobile Considerations:
- Cards full-width, comfortable vertical spacing.  
- Images lazy-loaded.  

Edge Cases:
- All recipes 0% match → still show list with clear “0 of X” and missing list, or fall to empty state if preferred.  
- Very large result set → simple pagination or “show more” (default to top 20–30).

### Page: Recipe Detail
Route: `/recipe/:id`  
Purpose: Deliver everything needed to cook the chosen recipe.  
User Access: Everyone.  
Layout Structure:
- Header: back button + recipe title (or title below hero).  
- Main Content: hero image, key stats row, ingredients section (matched vs missing), numbered steps, servings.  
- No tab bar (full immersion).  

ASCII Wireframe:
```
┌─────────────────────────────┐
│ ← Back                      │
│ ┌─────────────────────────┐ │
│ │      Hero Image         │ │
│ └─────────────────────────┘ │
│ Title                       │
│ 25 min · Easy · 4 servings  │
│                             │
│ Ingredients                 │
│ ✓ chicken  ✓ rice           │
│ ✗ soy sauce (missing)       │
│                             │
│ Steps                       │
│ 1. ...                      │
│ 2. ...                      │
└─────────────────────────────┘
```

Primary Data Displayed:
- Title, image, cook time, difficulty, servings.  
- Full ingredient list with visual distinction for owned vs missing.  
- Numbered, readable steps.  

User Actions:
- Back → return to Results (state preserved).  
- (Future) share or print — not in MVP.  

Interactions:
- Smooth page transition.  
- Scrollable long content.  

State Variations:
- Loading: skeleton or spinner.  
- Empty/Error: “Recipe not found” + back button.  
- Success: full content.  

Mobile Considerations:
- Large readable type for steps.  
- Images scale appropriately.  

Edge Cases:
- Recipe with zero missing ingredients → celebratory “You have everything!” treatment.  
- Very long step list → natural scroll, no artificial pagination.

### Optional Page: About
Route: `/about`  
Purpose: Brief explanation of the tool and data source note.  
Simple static content + back to Ingredients. Can be omitted for pure MVP.

## 6. Mock Data Strategy
Use a static JSON (or equivalent) dataset of 30–40 recipes.  

Each recipe record contains:
- id, title, image URL (realistic food photography placeholders or royalty-free images),  
- cookTimeMinutes, difficulty (Easy/Medium/Hard), servings,  
- ingredients: array of strings (normalized lowercase for matching),  
- steps: array of strings,  
- optional cuisine or tags (unused for filtering in MVP).  

Aim for realistic variety: common proteins, grains, vegetables, dairy, pantry staples. Ingredient lists range from 4–12 items so match percentages feel meaningful.  

Relationships: pure flat list; matching is performed client-side by comparing user pills (normalized) against each recipe’s ingredient array.  

Mock service: simple in-memory filter + sort by match percentage descending. No faker needed beyond the hand-crafted set; keep data editable so new recipes can be added without code changes.  

Image strategy: every recipe has a distinct, appetizing image URL so cards and detail pages never feel empty.

## 7. Interaction Patterns and Micro-interactions
- Recipe detail always uses full-page navigation (no modals or bottom sheets).  
- Ingredient removal is instant via × on each pill; no confirmation required.  
- “Find Recipes” is an explicit primary button (enabled only when ≥1 ingredient exists).  
- Tab switches preserve ingredient list and last ranking.  
- No drag-and-drop, no real-time collaboration, no toasts beyond possible subtle “Recipes updated” if desired.  
- Confirmation dialogs: none required in MVP.  
- Back navigation (browser, hardware, and explicit back button) always returns to the previous meaningful state.

## 8. Edge Cases and Error Handling
- Loading: lightweight skeletons or brief spinners on Results and Detail; Ingredients tab is instant.  
- Empty states: friendly, action-oriented copy with clear next-step CTAs (see Section 5).  
- Form validation: ingredient input simply ignores blanks and duplicates.  
- Error messages: short, human, and recoverable (“Couldn’t load recipes — try again”).  
- Network failure: since data is static/mock, treat as data-load error with retry.  
- Permission denied: impossible (no auth).  
- Zero-match results: show empty state rather than a list of 0% cards unless product later prefers otherwise.  
- Extremely long ingredient lists: allow them; ranking still works.  
- Recipe detail with missing image: graceful fallback placeholder.

## 9. Performance and UX Considerations
- Results list uses simple vertical rendering; consider virtualization only if the set grows beyond ~50 visible items.  
- Images lazy-load.  
- Ranking is computed client-side and is fast for 30–40 recipes.  
- Optimistic UI: pill add/remove is instant; search shows loading state only if computation is artificially delayed.  
- No infinite scroll required for MVP.

## 10. Implementation Checklist

### Ingredients Page
- [ ] Build page layout with tag input and pill list
- [ ] Implement add / remove ingredient interactions
- [ ] Enable / disable “Find Recipes” button correctly
- [ ] Handle empty state with friendly prompt
- [ ] Wire tab navigation
- [ ] Add mobile responsiveness and keyboard handling

### Results Page
- [ ] Build vertical card list layout
- [ ] Implement ranking by match percentage
- [ ] Display match ratio and missing-ingredient chips
- [ ] Handle loading, empty (no matches), and error states
- [ ] Wire card tap → recipe detail
- [ ] Preserve state when switching tabs
- [ ] Add mobile responsiveness

### Recipe Detail Page
- [ ] Build full-page layout with hero, stats, ingredients, steps
- [ ] Visually distinguish owned vs missing ingredients
- [ ] Implement back navigation that restores Results state
- [ ] Handle loading and error states
- [ ] Add mobile-friendly typography and scrolling
- [ ] Support browser / hardware back

### Shared / Cross-Page
- [ ] Sticky bottom tab bar
- [ ] Consistent empty-state messaging and CTAs
- [ ] Mock data layer (30–40 recipes) with matching logic
- [ ] Basic accessibility (focus order, labels, contrast)
- [ ] Responsive behavior across phone and tablet sizes
```




