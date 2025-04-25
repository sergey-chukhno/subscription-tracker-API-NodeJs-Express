import dayjs from 'dayjs';
import Subscription from '../models/subscription.model.js';
import { createRequire } from 'module';
import { sendReminderEmail } from '../utils/send-email.js';

const require = createRequire(import.meta.url);
const { serve } = require('@upstash/workflow/express');

const REMINDERS = [7, 5, 3, 1]; // days before renewal date

export const sendReminders = serve(async (context) => {
  const { subscriptionId } = context.requestPayload; 
  const subscription = await fetchSubscription(context, subscriptionId); 

  if (!subscription || subscription.status !== 'active') {
    return; 
  }
  const renewalDate = dayjs(subscription.renewalDate);
  if (renewalDate.isBefore(dayjs())) {
    console.log(`Renewal date has passed for subscription ${subscriptionId}. Stopping workflow.`);
    return;
  }
  for (const daysBefore of REMINDERS) {
    const reminderDate = renewalDate.substract(daysBefore, 'day');

    if (reminderDate.isAfter(dayjs())) { 
      await sleepUnitReminder(context, `Reminder ${daysBefore} days before renewal`, reminderDate); 
    }

    if (dayjs().isSame(reminderDate, 'day'))
      await triggerReminder(context, `Reminder ${daysBefore} days before renewal`, subscription);
    }
   }
)

const fetchSubscription = async (context, subscriptionId) => { 
  return await context.run('get subscription', async () => {
    return subscriptionFindByID(subscriptionId).populate('user', "name email");
  });
}

const sleepUntilReminder = async (context, label, date) => {
  console.log(`Sleeping until ${label} reminder at ${date}`);
  await context.sleepuntil(label, date.toDate()); 
} 

const triggerReminder = async (context, label, subscription) => {
  return await context.run(label, async () => {
    console.log('Triggering ${label} reminder`');
    // Here you would send the actual reminder, e.g., via email or notification or SMS;
    await sendReminderEmail({
      to: subscription.user.email, 
      type: label, 
      subscription
    })
  })
}