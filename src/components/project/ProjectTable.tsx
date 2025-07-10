import { useState, FocusEvent } from "react";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "../ui/Table";
import { Trash2, Edit2, EllipsisIcon } from "lucide-react";
import _ from "lodash";
import { Project } from "./ProjectListSection";

type ProjectTableProps = {
  projects: Project[];
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
  onSelect?: (project: Project) => void;
};

const ProjectTable = ({ projects, onEdit, onDelete, onSelect }: ProjectTableProps) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const toggleMenu = (id: string) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No projects found. Click the "Add Project" button to create one.
      </div>
    );
  }

  return (
    <Table className="overflow-x-hidden">
      <TableHeader>
        <TableRow>
          <TableHead>Project Name</TableHead>
          <TableHead>Version</TableHead>
          <TableHead className="w-12">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => (
          <TableRow
            key={project.id}
            className="cursor-pointer text-blue-600 hover:bg-blue-100 transition duration-200 ease-in-out"
          >
            <TableCell
              className="cursor-pointer text-black font-medium"
              onClick={() => {
                onSelect?.(project);
              }}
            >
              {project.name}
            </TableCell>

            <TableCell
              className="cursor-pointer"
              onClick={() => {
                onSelect?.(project);
              }}
            >
              <span className="bg-blue-100 text-xs font-semibold rounded-full px-2 py-1 text-blue-800">
                {_.get(project, "current_version_label", "v0")}
              </span>
            </TableCell>

            <TableCell className="relative w-12 rounded-r-lg">
              <div
                className="relative"
                tabIndex={0}
                onBlur={(e: FocusEvent<HTMLDivElement>) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setOpenMenuId(null);
                  }
                }}
              >
                <button
                  onClick={() => toggleMenu(project.id)}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer"
                >
                  <EllipsisIcon size={16} />
                </button>

                {openMenuId === project.id && (
                  <div className="absolute right-full top-1 mr-2 w-32 bg-white shadow-lg rounded-md z-10">
                    {onEdit && (
                      <button
                        onClick={() => {
                          onEdit(project);
                          setOpenMenuId(null);
                        }}
                        className="flex items-center w-full px-3 py-2 hover:bg-gray-100"
                      >
                        <Edit2 className="mr-2 h-4 w-4 text-gray-600" />
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => {
                          onDelete(project);
                          setOpenMenuId(null);
                        }}
                        className="flex items-center w-full px-3 py-2 hover:bg-gray-100 text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ProjectTable;
