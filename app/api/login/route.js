import fs from 'fs';
import path from 'path';

const usersFile = path.resolve('data/users.json');

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { emailPhone, password } = req.body;

        const users = JSON.parse(fs.readFileSync(usersFile, 'utf8') || '[]');

        const user = users.find(u =>
            (u.email === emailPhone || u.phone === emailPhone) && u.password === password
        );

        if (!user) {
            return res.status(401).json({ message: 'Имэйл/утас эсвэл нууц үг буруу байна' });
        }

        res.status(200).json({ message: 'Login successful', user });
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}