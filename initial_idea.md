# MVP Specification: Local-First Mobility & Posture App

## 1. Product Vision & Business Model

* **Concept:** A zero-friction, daily mobility and postural restoration web application.
* **Business Model:** One-time purchase (e.g., $19–$29). No subscriptions, no cloud accounts, no data harvesting.
* **Target Audience:** Desk workers and beginners suffering from stiffness (neck, shoulders, lower back, hips).
* **Positioning:** "An interactive daily companion that lives on your device, not our servers."

## 2. Technical Architecture (100% Client-Side)

To achieve the "zero backend overhead" and avoid AGPL-3.0 server licensing triggers, the architecture shifts from openGym's Node/JSON backend to a pure static frontend.

* **Frontend Framework:** React 19 + Vite.
* **State Management:** Zustand (with Persist middleware).
* **Local Database:** IndexedDB (via Dexie.js) for robust local storage of workout history, custom routines, and heatmaps.
* **Hosting:** Fully static hosting (Cloudflare Pages, Vercel, or GitHub Pages).
* **PWA Setup:** `vite-plugin-pwa` configured for aggressive offline caching (Service Workers). Once loaded, the app works entirely without an internet connection.

## 3. Onboarding & Installation Flow (Solving PWA Friction)

Since there is no App Store download, the first-time user experience (FTUE) must flawlessly guide the installation.

1. **Welcome & License Verification:** User inputs their license key (e.g., from Gumroad/Lemon Squeezy API check).
2. **The "Install to Device" Modal:**
   * *iOS Detection:* Show a highly visual overlay pointing to the Safari "Share" icon **$\rightarrow$** "Add to Home Screen".
   * *Android Detection:* Trigger the native web app install prompt.
3. **The Promise:** A brief screen stating: "Your data stays here. No cloud, no tracking. Everything is saved strictly on this device."

## 4. The Quiz & Routine Builder Engine

A rule-based state machine that generates a structured 4-week protocol based on 3 simple inputs.

* **Q1: Primary Pain Point?** (Neck & Shoulders / Lower Back / Stiff Hips / Full Body Maintenance)
* **Q2: Time Commitment?** (5 Mins "Quick Reset" / 10 Mins "Standard" / 15+ Mins "Deep Release")
* **Q3: Current Mobility Level?** (Stiff as a board / Can touch knees / Can touch toes)
* **Logic Output:** The engine selects from the 50 core exercises to build an A/B daily alternating routine (e.g., Routine A on Monday, Routine B on Tuesday) optimized for the time limit.

## 5. UI / UX & Core Screens (Adapted from openGym)

1. **Dashboard (Today):** Clear call-to-action to "Start Today's Flow". Shows the current week's streak.
2. **Guided Player:**
   * Auto-playing visual loop of the AI character performing the movement.
   * Time-based sets (e.g., 60 seconds) rather than reps.
   * Large, screen-awake active timers and rest timers.
3. **Progress & Heatmap:** A GitHub-style contribution calendar showing days active.
4. **Library:** Categorized visual list of all 50 movements to build custom flows.

## 6. Research & Evidence Base

The exercise selection and programming logic will be strictly grounded in established physiological frameworks to ensure safety and credibility:

* **Stuart McGill’s "Big 3":** Core endurance and lower back stabilization (Modified Curl-up, Side Bridge, Bird Dog).
* **Functional Range Conditioning (FRC):** Joint specific CARs (Controlled Articular Rotations) for hips and shoulders.
* **Janda's Upper/Lower Crossed Syndromes:** Targeting shortened chest/hip flexors and lengthened back/glute muscles typical in desk workers.

## 7. The 50 Core Exercise Mapping

*Agent Instruction: Seed the local database with this initial JSON structure.*

* **Neck & Thoracic (10):** Neck CARs, Thoracic Rotations, Cat-Cow, Thread the Needle, Wall Angels.
* **Shoulders & Wrists (10):** Scapular Pushups, Wrist Extension Stretches, Shoulder Dislocates (with towel), Doorway Pectoral Stretch.
* **Spine & Core (10):** McGill Big 3, Sphinx Pose, Child’s Pose.
* **Hips & Glutes (10):** 90/90 Hip Switches, Couch Stretch, Glute Bridges, Pigeon Pose, Deep Squat Hold.
* **Ankles & Hamstrings (10):** Downward Dog, Calf Raises, Hamstring Flossing, Ankle CARs.

## 8. AI Character & Asset Generation Pipeline

To create a proprietary visual moat without copyright issues, the media pipeline will utilize local AI generation tailored for consistency.

* **Visual Style:** Minimalist 2.5D or low-poly 3D aesthetics. This keeps the anatomy legible for fitness tracking while maintaining a clean, modern editorial look.
* **Workflow (ComfyUI):**
  1. **Subject Consistency:** Utilize a fixed character design (e.g., "Tú" or a branded persona) via IPAdapter or a trained LoRA to ensure the character looks identical across all 50 movements.
  2. **Animation:** Generate 2–4 second perfect looping video assets (MP4 or WebP) for each movement.
  3. **Voice (Optional but high ROI):** Pre-render audio cues ("Inhale," "Switch sides," "Next up: Cat-Cow") using local text-to-speech pipelines (like Qwen3-TTS). Combining audio cues with the visual timer massively elevates the perceived value over a spreadsheet.

### What You Are Missing (The Critical Gaps)

If you hand this to an agent today, you will run into three immediate business roadblocks that aren't technical, but strategic:

**1. The Piracy / License Gating Problem**

If the app is a static web page that works offline, what stops someone from sharing the URL with 500 people?

* *The Fix:* You need a lightweight authentication gate. Use a platform like Gumroad or Lemon Squeezy for the purchase. When a user buys, they get a unique license key. The PWA pings the Gumroad API *once* upon initial setup to validate the key, then writes a secure JWT to LocalStorage and unlocks the app offline forever.

**2. Cross-Device Sync (The Local-First Dilemma)**

If the app is entirely offline, a user who does a routine on their iPhone won't see that progress on their Mac.

* *The Fix:* Offer a manual "Export/Import JSON data" button in the settings. For a one-time purchase, users accept this friction. Do not build cloud sync, or you instantly create a recurring server bill for a one-time product.

**3. Telemetry vs. Privacy**

If there is zero backend, you have no analytics. You won't know where users drop off, what exercises they skip, or if they stop using it after day 3.

* *The Fix:* You must explicitly decide if you want to embed a privacy-respecting, cookieless analytics tracker (like Plausible or PostHog) to track basic events (`routine_completed`, `quiz_finished`) just to inform your future content strategy. If you do, you must update the "Zero Tracking" promise to "Zero *Personal* Tracking."
