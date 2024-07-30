import * as AWS from "aws-sdk";
import handlebars from "handlebars";
import config from "../config";

import { EmailInterface } from "../interfaces/auth";

import logger from "../logger";

// Set the region
AWS.config.update({
  region: config.aws.region,
  accessKeyId: config.aws.accessKey,
  secretAccessKey: config.aws.secretKey,
});

const SES_SENDER_NAME = process.env.SES_SENDER_NAME || "USE DIVEST";
const SES_SOURCE_EMAIL = process.env.SES_SOURCE_EMAIL as string;
const SES_REPLY_TO_EMAIL = process.env.SES_REPLY_TO_EMAIL as string;

export default class AwsService {
  private sns: AWS.SNS;
  private ses: AWS.SES;
  private sqs: AWS.SQS;

  constructor() {
    this.sns = new AWS.SNS();
    this.ses = new AWS.SES();
    this.sqs = new AWS.SQS();
  }

  public getSqs(): AWS.SQS {
    return this.sqs;
  }

  async sendMail(input: EmailInterface) {
    const { email, data, template, subject } = input;

    const Template = handlebars.compile(template);

    try {
      const params = {
        Destination: {
          ToAddresses: [email],
        },
        Message: {
          Body: {
            Html: {
              Charset: "UTF-8",
              Data: Template(data),
            },
          },
          Subject: {
            Charset: "UTF-8",
            Data: subject,
          },
        },
        Source: `"${SES_SENDER_NAME}" <${SES_SOURCE_EMAIL}>`,

        ReplyToAddresses: [SES_REPLY_TO_EMAIL],
      };

      const sendPromise = this.ses.sendEmail(params).promise();

      return await sendPromise;
    } catch (err) {
      logger.error(err.message);
      throw err;
    }
  }

  async sendMessageToSQS(queueUrl: string, message: string) {
    const params: AWS.SQS.Types.SendMessageRequest = {
      QueueUrl: queueUrl,
      MessageBody: message,
    };

    try {
      await this.sqs.sendMessage(params).promise();
      logger.info(`Successfully sent message to ${queueUrl}`);
    } catch (error) {
      logger.error(`Error sending message to SQS:`, error);
    }
  }
}
