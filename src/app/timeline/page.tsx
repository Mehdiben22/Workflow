//when its not a child we need to add useclient
"use client"

import { useAppSelector } from "@/app/redux";
import Header from "@/components/Header";
import { useGetProjectsQuery} from "@/state/api";
import { DisplayOption, Gantt, ViewMode } from "gantt-task-react";
//The CSS rules from that file are added to your application's global stylesheet
import "gantt-task-react/dist/index.css";
import React, { useMemo, useState } from "react";



type TaskTypeItems = "task" | "milestone" | "project";

const Timeline = () => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const {data : projects , isLoading , isError} = useGetProjectsQuery();

  //create states for the gant tasks mode
  const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
    //viewmode Month is the default view
    viewMode: ViewMode.Month,
    locale: "en-us",
  });

  const ganttTasks = useMemo(() => {
    //return all this projects infos
    return (
      projects?.map((project) => ({
        start: new Date(project.startDate as String), // Converts startDate to a JavaScript Date object
        end: new Date(project.endDate as String), // Converts dueDate to a JavaScript Date object
        name: project.name, // Maps the task's title to the Gantt task name.
        id: `Project-${project.id}`, // Assigns a unique ID for the Gantt task.
        type: "project" as "TaskTypeItems",
        progress: 50, // Calculates progress as a percentage.
        isDisabled: false, // Indicates that the task is not disabled (editable)
        //or return an empty object
      })) || []
    );
    //useMemo re-runs the transformation logic only when tasks changes
  }, [projects]);

  //This handler updates the viewMode property of the displayOptions
  // state to reflect the selected value from the dropdown menu.
  const handleViewModeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setDisplayOptions((prev) => ({
      ...prev,
      viewMode: event.target.value as ViewMode,
    }));
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError || !projects) return <div>An error occured while fetching projects</div>;

  return (
    <div className="max-w-full p-8 ">
      <header className="mb-4 flex items-center justify-between">
        <Header name="Projects Timeline"/>
        <div className="relative inline-block w-64">
          {/* hover is when you select something you see the border color */}
          <select
            className="focus:shadow-outline block w-full appearance-none rounded border border-gray-400 bg-white px-4 py-2 pr-8 leading-tight shadow hover:border-gray-500 focus:outline-none dark:border-dark-secondary dark:bg-dark-secondary dark:text-white"
            value={displayOptions.viewMode}
            onChange={handleViewModeChange}
          >
            <option value={ViewMode.Day}>Day</option>
            <option value={ViewMode.Week}>Week</option>
            <option value={ViewMode.Month}>Month</option>
          </select>
        </div>
      </header>

      <div className="overflow-hidden rounded-md bg-white shadow dark:bg-dark-secondary dark:text-white">
        <div className="timeline">
          <Gantt
            tasks={ganttTasks}
            {...displayOptions}
            columnWidth={displayOptions.viewMode === ViewMode.Month ? 150 : 100}
            listCellWidth="100px"
            projectBackgroundColor={isDarkMode ? "#101214" : "#1f2937"}
            projectProgressColor={isDarkMode ? "#1f2937" : "#aeb8c2"}
            projectProgressSelectedColor={isDarkMode? "#000" : "#9ba1a6"}
          />
        </div>
        
      </div>
    </div>
  );
};

export default Timeline;
