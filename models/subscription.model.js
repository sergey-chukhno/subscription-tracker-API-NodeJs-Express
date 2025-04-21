import mongoose from 'mongoose'; 

const subscriptionSchema = new mongoose.Schema({
  name: {
    type: String, 
    required: [true, 'Subscription Name is required'],
    trim: true,
    minLength: 2,
    maxLength: 50
  }, 
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be greater than zero'],
  }, 
  currency: {
    type: String, 
    enum: ['USD', 'EUR', 'GBP', 'INR', 'CNY'],
    default: 'USD'
  }, 
  frequency: {
    type: String, 
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    default: 'monthly'
  },
  category: {
    type: String, 
    enum: ['sports', 'entertainment', 'education', 'health', 'technology'],
    required: [true, 'Category is required']
  }, 
  paymentMethod: {
    type: String, 
    enum: ['credit_card', 'paypal', 'bank_transfer'],
    required: [true, 'Payment method is required']
  }, 
  status: {
    type: String, 
    enum: ['active', 'cancelled', 'expired'], 
    default: 'active'
  }, 
  startDate: {
    type: Date, 
    required: [true, 'Start date is required'],
    validate: {
      validator: function(value) {
        return value <= new Date();
      },
      message: 'Start date cannot be in the future'
    }, 
    renewalDate: {
      type: Date, 
      validate: {
        validator: function(value) {
          return value > this.startDate;
        },
        message: 'Renewal date must be after the start date'
      }
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'], 
      index: true
    },
  },
}, { timestamps: true });

// Auto-calculate renewal date if missing
subscriptionSchema.pre('save', function (next) {
  if (!this.renewalDate) {
    const renewalPeriods = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      yearly: 365
    }; 
    this .renewalDate = new Date(this.startDate); 
    this .renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
  }

  //Auto-update status if renewal date has passed 
  if (this.renewalDate < new Date()) {
    this.status = 'expired';
  }
  next();
})

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;