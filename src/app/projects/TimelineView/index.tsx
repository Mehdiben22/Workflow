import { useAppSelector } from "@/app/redux";
import { useGetTasksQuery } from "@/state/api";
import { DisplayOption, Gantt, ViewMode } from "gantt-task-react";
//The CSS rules from that file are added to your application's global stylesheet
import "gantt-task-react/dist/index.css";
import React, { useMemo, useState } from "react";

type Props = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

type TaskTypeItems = "task" | "milestone" | "project";

const Timeline = ({ id, setIsModalNewTaskOpen }: Props) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const {
    data: tasks,
    error,
    isLoading,
  } = useGetTasksQuery({ projectId: Number(id) });

  //create states for the gant tasks mode
  const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
    //viewmode Month is the default view
    viewMode: ViewMode.Month,
    locale: "en-us",
  });

  const ganttTasks = useMemo(() => {
    //return all this tasks infos
    return (
      tasks?.map((task) => ({
        start: new Date(task.startDate as String), // Converts startDate to a JavaScript Date object
        end: new Date(task.dueDate as String), // Converts dueDate to a JavaScript Date object
        name: task.title, // Maps the task's title to the Gantt task name.
        id: `Task-${task.id}`, // Assigns a unique ID for the Gantt task.
        type: "task" as "TaskTypeItems",
        progress: task.points ? (task.points / 10) * 100 : 0, // Calculates progress as a percentage.
        isDisabled: false, // Indicates that the task is not disabled (editable)
        //or return an empty object
      })) || []
    );
    //useMemo re-runs the transformation logic only when tasks changes
  }, [tasks]);

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
  if (error) return <div>An error occured while fetching tasks</div>;

  return (
    <div className="px-4 xl:px-6">
      <div className="flex flex-wrap items-center justify-between gap-2 py-5">
        <h1 className="me-2 text-lg font-bold dark:text-white">
          Project Tasks Timeline
        </h1>
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
      </div>

      <div className="overflow-hidden rounded-md bg-white shadow dark:bg-dark-secondary dark:text-white">
        <div className="timeline">
          <Gantt
            tasks={ganttTasks}
            {...displayOptions}
            columnWidth={displayOptions.viewMode === ViewMode.Month ? 150 : 100}
            listCellWidth="100px"
            barBackgroundColor={isDarkMode ? "#101214" : "#aeb8c2"}
            barBackgroundSelectedColor={isDarkMode ? "#000" : "#9ba1a6"}
          />
        </div>
        <div className="px-4 pb-5 pt-1">
          <button
            className="flex items-center rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
            onClick={() => setIsModalNewTaskOpen(true)}
          >
            Add New Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
