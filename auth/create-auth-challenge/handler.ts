import type { CreateAuthChallengeTriggerHandler } from "aws-lambda";

export const handler: CreateAuthChallengeTriggerHandler = async (event) => {
  if (event.request.challengeName === "CUSTOM_CHALLENGE") {
    
    const digitGenerator = require('crypto-secure-random-digit');    
    
    let challengeCode = digitGenerator.randomDigits(6).join("");
    console.log(`Create: go here: ${challengeCode}`)
    await sendChallengeCode(event.request.userAttributes.email, challengeCode);

    event.response.challengeMetadata = "TOKEN_CHECK";

    event.response.publicChallengeParameters = {
      trigger: "true",
      code: challengeCode,
    };
    event.response.privateChallengeParameters = { trigger: "true" };
    event.response.privateChallengeParameters.answer = challengeCode;
  }
  return event;
};

async function sendChallengeCode(emailAddress: string, secretCode: string) {
  let aws = require("aws-sdk");
  let ses = new aws.SES({ region: "ap-southeast-1" });
  var params = {
    Destination: {
      ToAddresses: [emailAddress],
    },
    Message: {
      Body: {
        Text: { Data: `Your Secrete code to sign in to Dote ${secretCode}` },
      },
      Subject: { Data: `Verification your Sign In to Dote` },
    },
    Source: "minhdang2001.11@gmail.com",
  };
  return ses.sendEmail(params).promise()
}
