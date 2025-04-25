import nodemailer from 'nodemailer'; 

import { EMAIL_PASSWORD } from '../config.js';

export const accountEmail = 'tikitaka3883@gmail.com'

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: accountEmail, 
    pass: EMAIL_PASSWORD
  }
})
export default transporter;