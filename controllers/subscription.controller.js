import Subscription from '../models/subscription.model.js';
import { WorkflowClient } from '@upstash/workflow';

export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });
    await workflowClient.trigger({
      url: { SERVER_URL },
      
    })
    res.status(201).json({ success: true, data: subscription });
   }
  catch (error) { 
    next(error);
  }
}

export const getUserSubscriptions = async (req, res, next) => { 
  try {
    if (req.user.id !== req.params.id) { 
      const error = new Error('Unauthorized');
      error.status = 401;
      throw error;
    }

    const subscriptions = await Subscription.find({ user: req.params.id });
    res.status(200).json({ succes: true, data: subscriptions })
   }
  catch (error) {
    next(error);
   }
}
