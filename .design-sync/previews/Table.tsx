import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@librechat/client';

const rows = [
  ['handbook-2026.pdf', 'PDF', '2.4 MB', '14 Oct'],
  ['pricing.xlsx', 'Spreadsheet', '310 KB', '12 Oct'],
  ['onboarding.md', 'Markdown', '18 KB', '9 Oct'],
];

export const Files = () => (
  <div className="w-[36rem]">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Uploaded</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r[0]}>
            {r.map((c) => (
              <TableCell key={c}>{c}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);
