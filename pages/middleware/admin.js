import { getSession } from 'next-auth/react';

const adminMiddleware = async (req, res) => {
  const session = await getSession({ req });
  
  if (!session?.user?.role === 'admin') {
    res.status(403).json({ error: 'Хандах эрхгүй' });
    throw new Error('Unauthorized');
  }
};

export default adminMiddleware;