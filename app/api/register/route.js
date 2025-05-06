import fs from 'fs';
import path from 'path';

const usersFile = path.resolve('data/users.json');

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { name, email, phone, password } = req.body;

        const users = JSON.parse(fs.readFileSync(usersFile, 'utf8') || '[]');

        const exists = users.some(u => u.email === email || u.phone === phone);
        if (exists) {
            return res.status(400).json({ message: 'Имэйл эсвэл утас бүртгэлтэй байна' });
        }

        const newUser = { id: Date.now(), name, email, phone, password };
        users.push(newUser);
        fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

        return res.status(201).json({ message: 'User registered', user: newUser });
    }

    res.status(405).json({ message: 'Method not allowed' });
}