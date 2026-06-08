# Invite Button on Organization Members Tab

Add an Invite button to the Organization Members Settings Tab to allow administrators to invite team members easily directly from the "Invitations" sub-tab and empty states.

## User Review Required
No breaking changes or significant risk. This is a purely additive UI improvement.

## Proposed Changes

### Dashboard Organization Settings Component

We will modify two UI components:

#### [MODIFY] [members-tab.tsx](file:///Users/mbp/Desktop/Code/tracerpro-new/components/dashboard/settings/organization/members-tab.tsx)
- Add an `InviteMemberDialog` to the empty state of the Invitations tab when `invitations.length === 0`.
- The dialog will trigger a secondary button labeled "Invite a member" which calls the `loadData` function on successful submission.

#### [MODIFY] [invitations-list.tsx](file:///Users/mbp/Desktop/Code/tracerpro-new/components/dashboard/settings/organization/invitations-list.tsx)
- Import `InviteMemberDialog` and `UserPlus` from `lucide-react`.
- Convert the Search Header area into a flex row container.
- Place the search input on the left and the "Invite Member" button on the right.
- The button is wrapped in `InviteMemberDialog` which triggers the `onChanged` callback on successful invitation.

## Verification Plan

### Manual Verification
- Go to Organization Settings > Members & Invitations tab.
- Select the "Invitations" sub-tab.
- Verify that if there are no invitations, the "Invite a member" button is displayed in the empty state.
- Verify that clicking it opens the dialog and sending a valid invitation adds the invitation to the list.
- Verify that if there are invitations, an "Invite Member" button is displayed next to the search input.
- Verify that clicking this button opens the dialog, and sending a valid invitation updates the table.
