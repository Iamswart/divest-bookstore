import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { RegisterInterface, LoginInterface } from "../interfaces/auth";
import db from "../database/models/";
import { badRequestError } from "../error";

import sqs from "../utils/sqs-consumer";

import logger from "../logger";
import config from "../config";
import emailTemplates from "../emailTemplates/emailTemplates";

const { User } = db;

export default class AuthService {
  async register(input: RegisterInterface) {
    const { email, name, password } = input;

    const emailExist = await User.findOne({ where: { email } });
    if (emailExist) {
      throw badRequestError(
        "Email address already exist, please login to continue"
      );
    }

    const user = await User.create({
      email,
      name,
      password,
    });

    // Welcome Message
    const welcomeMsgData = {
      notifyBy: ["email"],
      email: user.email,
      subject: "Welcome",
      data: {
        name: `${user.name}`,
      },
      template: emailTemplates.welcome,
    };

    const welcomeSqsOrderData = {
      MessageAttributes: {
        type: {
          DataType: "String",
          StringValue: "email",
        },
      },
      MessageBody: JSON.stringify(welcomeMsgData),
      QueueUrl: process.env.SQS_QUEUE_URL as string,
    };

    const welcomeSqsMessagePromise = sqs
      .sendMessage(welcomeSqsOrderData)
      .promise();
    welcomeSqsMessagePromise
      .then((data) => {
        logger.info(`Welcome Email sent | SUCCESS: ${data.MessageId}`);
      })
      .catch((error) => {
        logger.error(`Error sending Welcome email: ${error}`);
      });

    const accessToken = jwt.sign(
      { id: user.id, isAdmin: user.isAdmin },
      config.auth.secretToken,
      {
        expiresIn: config.auth.tokenExpiration,
      }
    );

    const refreshToken = jwt.sign(
      { id: user.id, isAdmin: user.isAdmin },
      config.auth.secretRefreshToken,
      {
        expiresIn: config.auth.tokenRefreshExpiration,
      }
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      accessToken,
      refreshToken,
    };
  }

  async login(input: LoginInterface) {
    const { email, password } = input;

    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw badRequestError("Email Or Password Incorrect");
    }

    if (user.status === "inactive") {
      throw badRequestError(
        "Your account has been disabled please contact support for further details"
      );
    }

    const verifyCredentials = bcrypt.compareSync(password, user.password);

    if (!verifyCredentials) {
      throw badRequestError("Email Or Password Incorrect");
    }

    const accessToken = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, config.auth.secretToken, {
      expiresIn: config.auth.tokenExpiration,
    });

    const refreshToken = jwt.sign(
      { id: user.id, isAdmin: user.isAdmin },
      config.auth.secretRefreshToken,

      {
        expiresIn: config.auth.tokenRefreshExpiration,
      }
    );

    user.lastLoginAt = new Date();
    await user.save();

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phone,
        isBvnVerified: user.isBvnVerified,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        isPinSet: user.isPinSet,
        publicKey: user.publicKey,
      },

      accessToken,
      refreshToken,
    };
  }

}
