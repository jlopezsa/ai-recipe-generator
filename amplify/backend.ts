import { defineBackend } from '@aws-amplify/backend';
import { data } from './data/resource';
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Aws } from "aws-cdk-lib";
import { auth } from './auth/resource';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
});

const bedrockDataSource = backend.data.resources.graphqlApi.addHttpDataSource(
  "bedrockDS",
  "https://bedrock-runtime.us-east-2.amazonaws.com",
  {
    authorizationConfig: {
      signingRegion: "us-east-2",
      signingServiceName: "bedrock",
    },
  }
);

bedrockDataSource.grantPrincipal.addToPrincipalPolicy(
  new PolicyStatement({
    actions: ["bedrock:InvokeModel", "bedrock:InvokeModelWithResponseStream",],
    resources: [
      // Tu caso actual (modelId con prefijo "us." => inference-profile)
      `arn:aws:bedrock:us-east-2:${Aws.ACCOUNT_ID}:inference-profile/*`,

      // Compatibilidad si luego invocas un foundation model directo
      "arn:aws:bedrock:us-east-2::foundation-model/*",
    ],
  })
);