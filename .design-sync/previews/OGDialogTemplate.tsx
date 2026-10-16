import { Button, Input, Label, OGDialog, OGDialogTemplate } from '@librechat/client';

export const Open = () => (
  <OGDialog open>
    <OGDialogTemplate
      title="Rename conversation"
      className="w-11/12 max-w-md"
      showCloseButton
      main={
        <div className="flex flex-col gap-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" defaultValue="Quarterly report draft" />
        </div>
      }
      buttons={<Button variant="submit">Save</Button>}
    />
  </OGDialog>
);
