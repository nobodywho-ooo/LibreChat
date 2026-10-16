import {
  Button,
  OGDialog,
  OGDialogContent,
  OGDialogDescription,
  OGDialogFooter,
  OGDialogHeader,
  OGDialogTitle,
} from '@librechat/client';

export const Open = () => (
  <OGDialog open>
    <OGDialogContent className="w-11/12 max-w-md">
      <OGDialogHeader>
        <OGDialogTitle>Archive conversation?</OGDialogTitle>
        <OGDialogDescription>
          “Quarterly report draft” moves to Archived chats. You can restore it from Settings at any
          time.
        </OGDialogDescription>
      </OGDialogHeader>
      <OGDialogFooter>
        <Button variant="outline">Cancel</Button>
        <Button variant="submit">Archive</Button>
      </OGDialogFooter>
    </OGDialogContent>
  </OGDialog>
);
