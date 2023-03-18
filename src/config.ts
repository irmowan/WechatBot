require('dotenv').config();

const openaiApiKey = process.env.OPENAI_API_KEY;
const padlocalToken = process.env.PAD_LOCAL_TOKEN;

export const Config = {
	openaiApiKey: openaiApiKey,
	padlocalToken: padlocalToken,
	chatgptTriggerKeyword: ""
}