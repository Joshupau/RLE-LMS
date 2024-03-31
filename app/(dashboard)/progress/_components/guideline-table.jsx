import {
    Table,
    TableHead,
    TableHeader,
    TableRow,
    TableBody,
    TableCell
  } from "@/components/ui/table";
  
  const GuidelinesTable = () => {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead> {/* Empty header for spacing */}
            <TableHead>Year 2</TableHead>
            <TableHead>Year 3</TableHead>
            <TableHead>Year 4</TableHead>
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableHead>Medical</TableHead>
            <TableCell></TableCell>
            <TableCell>10 Cases</TableCell>
            <TableCell>5 Cases</TableCell>
            <TableCell>15 Cases</TableCell>
          </TableRow>
          <TableRow>
            <TableHead>Pediatrics</TableHead>
            <TableCell>15 Cases</TableCell>
            <TableCell></TableCell>
            <TableCell>5 Cases</TableCell>
            <TableCell>20 Cases</TableCell>
          </TableRow>
          <TableRow>
            <TableHead>Communicable Diseases</TableHead>
            <TableCell>10</TableCell>
            <TableCell>10 Cases</TableCell>
            <TableCell>5 Cases</TableCell>
            <TableCell>25 Cases</TableCell>
          </TableRow>
          <TableRow>
            <TableHead>Obstetrics</TableHead>
            <TableCell>15 Cases</TableCell>
            <TableCell></TableCell>
            <TableCell>5 Cases</TableCell>
            <TableCell>20 Cases</TableCell>
          </TableRow>
          <TableRow>
            <TableHead>Surgical</TableHead>
            <TableCell></TableCell>
            <TableCell>15 Cases</TableCell>
            <TableCell>5 Cases</TableCell>
            <TableCell>20 Cases</TableCell>
          </TableRow>
          <TableRow>
            <TableHead>Medical Surgical Intensive</TableHead>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell>10 Cases</TableCell>
            <TableCell>10 Cases</TableCell>
          </TableRow>
          <TableRow>
            <TableHead>Orthopedics</TableHead>
            <TableCell></TableCell>
            <TableCell>5 Cases</TableCell>
            <TableCell>5 Cases</TableCell>
            <TableCell>10 Cases</TableCell>
          </TableRow>
          <TableRow>
            <TableHead>Gynecology</TableHead>
            <TableCell>10 Cases</TableCell>
            <TableCell></TableCell>
            <TableCell>3 Cases</TableCell>
            <TableCell>13 Cases</TableCell>
          </TableRow>
          <TableRow>
            <TableHead>EENT</TableHead>
            <TableCell></TableCell>
            <TableCell>5 Cases</TableCell>
            <TableCell>5 Cases</TableCell>
            <TableCell>10 Cases</TableCell>
          </TableRow>
          <TableRow>
            <TableHead>Nursery</TableHead>
            <TableCell>3 Cases</TableCell>
            <TableCell></TableCell>
            <TableCell>3 Cases</TableCell>
            <TableCell>6 Cases</TableCell>
          </TableRow>
          <TableRow>
            <TableHead>Psychiatric</TableHead>
            <TableCell></TableCell>
            <TableCell>5 Cases</TableCell>
            <TableCell>5 Cases</TableCell>
            <TableCell>10 Cases</TableCell>
          </TableRow>
          <TableRow>
            <TableHead>OR Major</TableHead>
            <TableCell></TableCell>
            <TableCell>5 Cases</TableCell>
            <TableCell>5 Cases</TableCell>
            <TableCell>10 Cases</TableCell>
          </TableRow>
          <TableRow>
            <TableHead>OR Minor</TableHead>
            <TableCell></TableCell>
            <TableCell>5 Cases</TableCell>
            <TableCell>5 Cases</TableCell>
            <TableCell>10 Cases</TableCell>
          </TableRow>
          <TableRow>
            <TableHead>DR Manage</TableHead>
            <TableCell>5 Cases</TableCell>
            <TableCell></TableCell>
            <TableCell>2 Cases</TableCell>
            <TableCell>7 Cases</TableCell>
          </TableRow>
          <TableRow>
            <TableHead>DR Assist</TableHead>
            <TableCell>5 Cases</TableCell>
            <TableCell></TableCell>
            <TableCell>2 Cases</TableCell>
            <TableCell>7 Cases</TableCell>
          </TableRow>
          <TableRow>
            <TableHead>DR Cord Care</TableHead>
            <TableCell>5 Cases</TableCell>
            <TableCell></TableCell>
            <TableCell>2 Cases</TableCell>
            <TableCell>7 Cases</TableCell>
          </TableRow>
          <TableRow>
            <TableHead>CHN</TableHead>
            <TableCell>15 Cases</TableCell>
            <TableCell>10 Cases</TableCell>
            <TableCell>10 Cases</TableCell>
            <TableCell>35 Cases</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  };
  
  export default GuidelinesTable;
  