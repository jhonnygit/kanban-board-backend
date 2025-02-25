import {Request, Response} from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface LoginRequestBody {
    email: string;
    password: string;
}

export const register = async (req: Request,res:Response) =>{
    const {name,email,password} = req.body;
    const hashedPassword = await bcrypt.hash(password,10);
    const user = await prisma.user.create({data:{name, email, password:hashedPassword}});

    res.json({message:"usuario registrado",user});
};

export const login = async (req: Request<{}, {}, LoginRequestBody>, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
  
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }
    
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
        res.status(200).json({ token, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};