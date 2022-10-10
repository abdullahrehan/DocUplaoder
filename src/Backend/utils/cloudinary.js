const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: 'datashareapp',
  api_key: '814418826623564',
  api_secret: 'Ig8K-J-kZeJ8xCneSYMDWvPUvtI',
});

module.exports = cloudinary;
