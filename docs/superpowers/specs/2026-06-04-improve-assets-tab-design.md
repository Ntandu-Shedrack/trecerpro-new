# Spec: Improve Assets Tab design to Match Reference Mockup

## Goal
Improve the visual aesthetics of the Assets Tab component (`components/dashboard/project/assets-tab.tsx`) to match the provided dashboard mockup screen.

## Proposed Changes

### Components
*   `components/dashboard/project/assets-tab.tsx`:
    *   Enhance search inputs and buttons layout.
    *   Style table columns, headers, rows, and icons to match the mockup's high-fidelity dark UI style.
    *   Dynamically parse `asset.values` to extract the `status` if present, and dynamically apply dot/text color configurations.

### Helper: Status Parser
*   Function `getAssetStatus(asset)` will scan for keys matching `/status|state/i` in `asset.values`.
*   A mapper will associate each status with appropriate semantic colors and text states.

## Verification
*   Manual inspection of the layout on `http://localhost:3000`.
