import AwsService from "../services/aws";
import logger from "../logger";

const systemTypes = ["email"];

const notify = async ({
  email,
  data,
  template,
  notifyBy,
  subject,
}: any) => {
  try {
    if (Array.isArray(notifyBy) && notifyBy.includes(systemTypes[0])) {
      logger.info("sending Email notification...");
      await new AwsService().sendMail({ email, data, template, subject });
      logger.info("Email notification sent ");
    }
  } catch (error) {
    logger.error(`notify.util --> notify --> ${error}`);
    throw error;
  }
};

export default notify;
