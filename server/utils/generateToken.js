import jwt from 'jsonwebtoken';

export const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'humac_medical_default_secret_jwt_key_2026',
    { expiresIn: '7d' }
  );
};
