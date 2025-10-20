// backend/src/utils/generarToken.js
import jwt from 'jsonwebtoken';

const generarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1d', // El token expira en 1 día
  });
};

export default generarToken;