// Resolver JS de AppSync/Amplify Data.

export function request(ctx) {
    const { ingredients = [] } = ctx.args;
  
    // Construct the prompt with the provided ingredients
    const prompt = `Suggest a recipe idea using these ingredients: ${ingredients.join(", ")}.`;
  
    // Return the request configuration
    // inference-profile
    return {
      resourcePath: `/model/us.anthropic.claude-3-haiku-20240307-v1:0/invoke`,
      method: "POST",
      params: {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          anthropic_version: "bedrock-2023-05-31",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `\n\nHuman: ${prompt}\n\nAssistant:`,
                },
              ],
            },
          ],
        }),
      },
    };
  }
  
  export function response(ctx) {
    const statusCode = ctx.result.statusCode;
    const parsedBody = JSON.parse(ctx.result.body || "{}");

    console.log("JJLS statusCode", statusCode);
    console.log("JJLS parsedBody", parsedBody);

    if (statusCode >= 400) {
      return {
        body: null,
        error: parsedBody.Message || `Bedrock error (${statusCode})`,
      };
    }

    return {
      body: parsedBody.content?.[0]?.text ?? "No content returned",
      error: null,
    };
}