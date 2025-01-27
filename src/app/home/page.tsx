"use client";

import {
  Priority,
  Project,
  Task,
  useGetProjectsQuery,
  useGetTasksQuery,
} from "@/state/api";
import React from "react";
import { useAppSelector } from "../redux";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Header from "@/components/Header";
import {
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Legend,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";

const HomePage = () => {
  const {
    data: tasks,
    isLoading: tasksLoading,
    isError: tasksError,
  } = useGetTasksQuery({ projectId: parseInt("1") });
  const { data: projects, isLoading: isProjectsLoading } =
    useGetProjectsQuery();

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  if (tasksLoading || isProjectsLoading) return <div>Loading...</div>;
  if (tasksError || !tasks || !projects) return <div>Error fetching data</div>;

  //parcourir la liste des taches et compter combien de taches existent
  //pour chaque priority
  const priorityCount = tasks.reduce(
    //acc pour stocker le nombre total des taches pour chaque priority
    (acc: Record<string, number>, task: Task) => {
      //extraire la priority de lobject task
      const { priority } = task;
      //On met a jour le acc avec la priorite
      // si la priorite existe on lui donne sa value avec +1 sinon
      //elle sera initialise avec 0
      acc[priority as Priority] = (acc[priority as Priority] || 0) + 1;
      return acc;
    },
    // valeur initial de acc = {} object vide
    {},
  );

  //convertir le priority count en tableau contenant name and count
  //pour affichage en dashboard
  const taskDistribution = Object.keys(priorityCount).map((key) => ({
    name: key,
    count: priorityCount[key],
  }));

  //compter le nombre de projects ayant le status completed ou active
  const statuCount = projects.reduce(
    (acc: Record<string, number>, project: Project) => {
      const status = project.endDate ? "Completed" : "Active";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {},
  );

  //display nombre de project par status en dashboard
  const projectStauts = Object.keys(statuCount).map((key) => ({
    name: key,
    count: statuCount[key],
  }));

  const taskColumns: GridColDef[] = [
    { field: "title", headerName: "Title", width: 200 },
    { field: "status", headerName: "Status", width: 150 },
    { field: "priority", headerName: "Priority", width: 150 },
    { field: "dueDate", headerName: "Due Date", width: 150 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB289", "FF8042"];
  const chartColors = isDarkMode
    ? {
        bar: "#8884d8",
        barGrid: "#303030",
        pieFill: "#4A90E2",
        text: "#FFFFFF",
      }
    : {
        bar: "#8884d8",
        barGrid: "#E0E0E0",
        pieFill: "#82ca9d",
        text: "#000000",
      };

  return (
    <div className="bg container h-full w-[100%] bg-gray-100 bg-transparent p-8">
      <Header name="Project Management Dashboard" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Dashboard for number of tasks on prioritys */}
        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">
            Task Priority Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={taskDistribution}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={chartColors.barGrid}
              />
              <XAxis dataKey="name" stroke={chartColors.text} />
              <YAxis stroke={chartColors.text} />
              <Tooltip
                contentStyle={{
                  width: "min-content",
                  height: "mn-content",
                }}
              />
              <Legend />
              <Bar dataKey="count" fill={chartColors.bar} />
            </BarChart>
          </ResponsiveContainer>
        </div>
    {/* dashboard pie for projectstatus count */}
    <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">
            Project Status
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie dataKey="count" data={projectStauts} fill="#82ca9d" label>
                {projectStauts.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary md:col-span-2">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">
            Your Tasks
          </h3>
          <div style={{height: 300, width:"100%"}}>
            <DataGrid 
            rows={tasks}
            columns={taskColumns}
            checkboxSelection
            loading={tasksLoading}
            getRowClassName={()=> "data-grid-row"}
            getCellClassName={()=> "data-grid-cell"}
            className={dataGridClassNames}
            sx={dataGridSxStyles(isDarkMode)}
            />
          </div>
          </div>
      </div>
    </div>
  );
};

export default HomePage;
