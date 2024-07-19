import { config } from "../../controllers/config/config.js";

import twilio from 'twilio';

export const twilioClient = twilio(config.TWILIO_SID, config.TWILIO_TOKEN);