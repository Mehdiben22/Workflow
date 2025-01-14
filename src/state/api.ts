import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export interface Project {
  id: number;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}
export enum Priority {
  Urgent = "Urgent",
  High = "High",
  Medium = "Medium",
  Low = "Low",
  Backlog = "Backlog",
}

export enum Status {
  ToDo = "To Do",
  WorkInProgress = "Work In Progress",
  UnderReview = "Under Review",
  Completed = "Completed",
}

export interface User {
  userId: number;
  username: string;
  email: string;
  profilePictureUrl?: string;
  cognitoId: string;
  teamId: number;
}

export interface Attachment {
  id: number;
  fileURL: string;
  fileName: string;
  taskId: number;
  uploadedById: number;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  tags?: string;
  startDate?: string;
  dueDate?: string;
  points?: number;
  projectId: number;
  authorUserId?: number;
  assignedUserId?: number;

  author?: User;
  assignee?: User;
  comments?: Comment[];
  attachments?: Attachment[];
}

export interface Team {
  teamId : number;
  teamName : string;
  productOwnerUserId? : number;
  projectManagerUserId? : number;
}

export interface SearchResults {
  tasks? : Task[];
  projects? : Project[];
  users? : User[];
}

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  reducerPath: "api",
  //after fetching data on the front we gonna have some data thats the tag of the data
  tagTypes: ["Projects", "Tasks","Users","Teams"],
  endpoints: (build) => ({
    //getting the projects call api
    getProjects: build.query<Project[], void>({
      //having / project on the url
      query: () => "projects",
      //after fetching data on the front we gonna have some data thats the tag of the data
      providesTags: ["Projects"],
    }),
    //create a project need a post method
    createProject: build.mutation<Project, Partial<Project>>({
      query: (project) => ({
        //this is different because wa are on a post api we need the body method and url
        url: "projects",
        method: "POST",
        body: project,
      }),
      //this means that when we create a new project it will be updated automaticlly
      // in the  providesTags : ["Projects"] for the getting projects api
      invalidatesTags: ["Projects"],
    }),
// buid.query is get method , parametre requis : projectId
    getTasks: build.query<Task[], { projectId: number }>({
//Cette fonction génère l'URL de l'API pour récupérer les tâches liées à un projet spécifique.
      query: ({ projectId }) => `tasks?projectId=${projectId}`,
      //retourn les donnes recu du task 
      //si result est null ou undefined aucune tache retourne
      providesTags : (result) =>
        result
          ? result.map(({ id }) => ({ type: "Tasks" as const, id }))
          : [{ type: "Tasks" as const }],
    }),
    //create a Tasks need a post method
    createTask: build.mutation<Task, Partial<Task>>({
        query: (tasks) => ({
          //this is different because wa are on a post api we need the body method and url
          url: "tasks",
          method: "POST",
          body: tasks,
        }),
        //this means that when we create a new Tasks it will be updated automaticlly
        // in the  providesTags : ["Tasks"] for the getting projects api
        invalidatesTags: ["Tasks"],
      }),
      //update a Task status need a patch method
    updateTaskStatus: build.mutation<Task, {taskId : number; status:string}>({
        query: ({taskId,status}) => ({
          //this is different because wa are on a post api we need the body method and url
          url: `tasks/${taskId}/status`,
          method: "PATCH",
          body: {status},
        }),
        //this means that when we update a  Task status it will be updated automaticlly
        //we want to update a specific task status 
        invalidatesTags: (result,error,{taskId}) => [
            {type : "Tasks" , id:taskId},
        ],
      }),
      getUsers : build.query<User[], void>({
        query: () => "users",
        providesTags : ["Users"]
      }),
      getTeams : build.query<Team[] , void>({
        query : () => "teams",
        providesTags : ["Teams"]
      }),
      search : build.query<SearchResults, string>({
        //this query is from the searchController
        query : (query) => `search?query=${query}`,
      }),
  }),
});

export const { useGetProjectsQuery, useCreateProjectMutation , useGetTasksQuery , useCreateTaskMutation, useUpdateTaskStatusMutation , useSearchQuery, useGetUsersQuery , useGetTeamsQuery } = api;
