"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { CheckCircle, AlertTriangle, XCircle, Download } from "lucide-react";
import BulkUploadProgress from "./bulk-upload-progress";

type ValidationError = {
  id: number;
  row: number;
  column: string;
  message: string;
  value: string;
};

export default function ValidationStep({
  next,
  prev,
}: {
  next: () => void;
  prev: () => void;
}) {
  const errors: ValidationError[] = [
    {
      id: 1,
      row: 14,
      column: "Email",
      message: "Invalid email format",
      value: "johndoe@@gmail.com",
    },
    {
      id: 2,
      row: 22,
      column: "Birthdate",
      message: "Missing mandatory field",
      value: "[Empty]",
    },
    {
      id: 3,
      row: 45,
      column: "Join Date",
      message: "Incorrect date format (YYYY-MM-DD)",
      value: "12/05/2023",
    },
    {
      id: 4,
      row: 102,
      column: "Region ID",
      message: "Referenced ID does not exist",
      value: "REG-999",
    },
    {
      id: 5,
      row: 241,
      column: "Phone",
      message: "Length exceeds 15 characters",
      value: "+1-555-0123-4567-890",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Data Validation Results
        </h1>

        <p className="text-muted-foreground">
          Please review and correct errors before proceeding with the import.
        </p>
      </div>
      <BulkUploadProgress step={3} />

      {/* Summary Cards */}

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          title="Ready to Import"
          value="1,240 rows"
          description="98%"
          icon={<CheckCircle className="text-emerald-500" />}
        />

        <SummaryCard
          title="Warnings"
          value="12 rows"
          description="Minor fixes suggested"
          icon={<AlertTriangle className="text-amber-500" />}
        />

        <SummaryCard
          title="Errors"
          value="8 rows"
          description="Action required"
          icon={<XCircle className="text-rose-500" />}
        />
      </div>

      {/* Error Table */}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Rows with Errors</CardTitle>
            <CardDescription>
              These rows must be corrected before importing.
            </CardDescription>
          </div>

          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Errors
          </Button>
        </CardHeader>

        <CardContent className="p-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-800/50">
                <TableHead>Row #</TableHead>
                <TableHead>Column</TableHead>
                <TableHead>Error</TableHead>
                <TableHead>Current Value</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {errors.map((error) => (
                <TableRow key={error.id}>
                  <TableCell>{error.row}</TableCell>

                  <TableCell className="font-medium text-primary">
                    {error.column}
                  </TableCell>

                  <TableCell>
                    <Badge variant="destructive">{error.message}</Badge>
                  </TableCell>

                  <TableCell className="italic text-muted-foreground">
                    {error.value}
                  </TableCell>

                  <TableCell>
                    <Button variant="link" className="px-0 text-primary">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Separator />

      {/* Footer Actions */}

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={prev}>
          Previous Step
        </Button>

        <div className="flex gap-3">
          <Button variant="outline">Re-upload File</Button>

          <Button className="text-white" onClick={next}>
            Proceed to Import (8 errors left)
          </Button>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="border-slate-800 bg-card hover:bg-slate-800/50 hover:border-primary/40 transition-all group">
      <CardContent className="flex items-start justify-between p-6">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>

          <p className="text-2xl font-bold">{value}</p>

          <p className="text-sm font-medium text-muted-foreground">
            {description}
          </p>
        </div>

        {icon}
      </CardContent>
    </Card>
  );
}
