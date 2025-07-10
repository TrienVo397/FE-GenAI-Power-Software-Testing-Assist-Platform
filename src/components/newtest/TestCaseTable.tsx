import React from "react";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "../ui/Table";

type TestCase = {
  "Test ID": string;
  "Test Case Description": string;
  "Test Steps": string;
  "Expected Result": string;
  "Requirement ID": string;
  "Priority": string;
};

type TestCaseTableProps = {
  testCases: TestCase[];
};

const TestCaseTable: React.FC<TestCaseTableProps> = ({ testCases }) => (
  <div className="overflow-x-auto mt-6">
    <Table className="border border-gray-300 bg-white">
      <TableHeader>
        <TableRow className="bg-gray-100">
          <TableHead>Test ID</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Test Steps</TableHead>
          <TableHead>Expected Result</TableHead>
          <TableHead>Requirement ID</TableHead>
          <TableHead>Priority</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {testCases.map((test, index) => (
          <TableRow key={index}>
            <TableCell>{test["Test ID"]}</TableCell>
            <TableCell>{test["Test Case Description"]}</TableCell>
            <TableCell className="whitespace-pre-line">{test["Test Steps"]}</TableCell>
            <TableCell>{test["Expected Result"]}</TableCell>
            <TableCell>{test["Requirement ID"]}</TableCell>
            <TableCell>{test["Priority"]}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export default TestCaseTable;
