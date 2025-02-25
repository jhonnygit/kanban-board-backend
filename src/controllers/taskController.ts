import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getTasks = async (req: Request, res: Response) =>{
    const tasks= await prisma.task.findMany();
    res.json(tasks);
}

export const createTask = async (req: Request, res: Response) => {
    const { title, status, userId } = req.body;
    const task = await prisma.task.create({ data: { title, status, userId } });
    res.json(task);
  };