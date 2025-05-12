import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Нэрээ оруулна уу'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Имэйл хаяг оруулна уу'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Хүчинтэй имэйл оруулна уу']
  },
  phone: {
    type: String,
    required: [true, 'Утасны дугаар оруулна уу'],
    unique: true,
    match: [/^\d{8}$/, '8 оронтой тоо оруулна уу']
  },
  password: {
    type: String,
    required: [true, 'Нууц үг оруулна уу'],
    minlength: [6, 'Хамгийн багадаа 6 тэмдэгт'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'dealer', 'admin'],
    default: 'user'
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Password comparison method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model('User', userSchema);