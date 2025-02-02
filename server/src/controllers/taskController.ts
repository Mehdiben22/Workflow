import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
//typescript controller function implementation
export const getTasks = async (req: Request, res: Response): Promise<void> => {
  const { projectId } = req.query;
  try {
    const tasks = await prisma.task.findMany({
      //we use where as conditions on prisma
      where: {
        projectId: Number(projectId),
      },
      include: {
        author: true,
        assignee: true,
        comments: true,
        attachments: true,
      },
    });
    res.json(tasks);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving tasks : ${error.message}` });
  }
};

export const createTask = async (
  req: Request,
  res: Response,
  //returning an async function
): Promise<void> => {
  const {
    title,
    description,
    status,
    priority,
    tags,
    startDate,
    dueDate,
    points,
    projectId,
    authorUserId,
    assignedUserId,
  } = req.body;
  try {
    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        tags,
        startDate,
        dueDate,
        points,
        projectId,
        authorUserId,
        assignedUserId,
      },
    });
    res.status(201).json(newTask);
  } catch (error: any) {
    res.status(500).json({ message: `Error creating task : ${error.message}` });
  }
};

export const updateTaskStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { taskId } = req.params;
  const { status } = req.body;
  try {
    const tasks = await prisma.task.update({
      //we use where as conditions on prisma
      //id task for updating his status
      where: {
        id: Number(taskId),
      },
      data: {
        status: status,
      },
    });
    res.json(updateTaskStatus);
  } catch (error: any) {
    res.status(500).json({ message: `Error updating task : ${error.message}` });
  }
};

export const getUserTasks = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { userId } = req.params;
  try {
    const tasks = await prisma.task.findMany({
      //we use where as conditions on prisma
      where: {
        //lune de ces conditions doit etre satisfaite dans le tableau
        OR: [
          { authorUserId: Number(userId) },
          { assignedUserId: Number(userId) },
        ],
      },
      include: {
        author: true,
        assignee: true,
      },
    });
    res.json(tasks);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving user's tasks : ${error.message}` });
  }
};
