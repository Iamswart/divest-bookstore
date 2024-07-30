import AwsService from "../services/aws";
import { Consumer } from "sqs-consumer";
import logger from "../logger";
import notify from "../processor/notify";
import config from "../config/";

const awsService = new AwsService();
const sqs = awsService.getSqs();


const queueUrl = config.aws.sqsUrl;

const queue = new Consumer({
  queueUrl: queueUrl,

  handleMessage: async (message: any) => {
    message = JSON.parse(message.Body);
    await notify(message);
  },
  sqs,
  batchSize: 10,
  visibilityTimeout: 60,
});

queue.on("error", (err) => {
  logger.error(err.message);
});

queue.on("processing_error", (err) => {
  logger.error(err.message);
});

queue.start();

logger.info("Sqs service is running");

export default sqs;
