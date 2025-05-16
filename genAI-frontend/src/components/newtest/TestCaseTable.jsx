const TestCaseTable = ({ testCases }) => (
  <div className="overflow-x-auto mt-6">
    <table className="min-w-full bg-white border border-gray-300 text-sm">
      <thead>
        <tr className="bg-gray-100">
          <th className="border px-4 py-2 text-left">Test ID</th>
          <th className="border px-4 py-2 text-left">Description</th>
          <th className="border px-4 py-2 text-left">Test Steps</th>
          <th className="border px-4 py-2 text-left">Expected Result</th>
          <th className="border px-4 py-2 text-left">Requirement ID</th>
          <th className="border px-4 py-2 text-left">Priority</th>
        </tr>
      </thead>
      <tbody>
        {testCases.map((test, index) => (
          <tr key={index} className="hover:bg-gray-50">
            <td className="border px-4 py-2">{test["Test ID"]}</td>
            <td className="border px-4 py-2">
              {test["Test Case Description"]}
            </td>
            <td className="border px-4 py-2 whitespace-pre-line">
              {test["Test Steps"]}
            </td>
            <td className="border px-4 py-2">{test["Expected Result"]}</td>
            <td className="border px-4 py-2">{test["Requirement ID"]}</td>
            <td className="border px-4 py-2">{test["Priority"]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default TestCaseTable;
