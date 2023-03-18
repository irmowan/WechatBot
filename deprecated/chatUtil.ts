import { ChatMessage } from "../src/types";
const { Configuration, OpenAIApi } = require("openai")
const { openaiApiKey } = require('./env')

const configuration = new Configuration({
  apiKey: openaiApiKey
});

const openai = new OpenAIApi(configuration);

export async function getReply(message) {
	const completion = await openai.createChatCompletion({
	  model: "gpt-3.5-turbo",
	  messages: [
		{role: "user", content: message}
	  ],
	});

	const assistant_message = completion.data.choices[0].message.content
	return assistant_message
}

const messageList: ChatMessage[] = []
const maxLength = 20
const systemMessage: ChatMessage = {
	"role": "system",
	"content": "You are a chat bot in wechat, please reply me in the style of a normal friend chat."
}

export async function conversation(content: string) {
	if (content === "clear" || messageList.length > maxLength) {
		messageList.length = 0
		messageList.push(systemMessage)
	}
	const userMessage: ChatMessage = {role: "user", content: content}
	messageList.push(userMessage)
	const completion = await openai.createChatCompletion({
	  model: "gpt-3.5-turbo",
	  messages: messageList,
	});

	const assistantContent = completion.data.choices[0].message.content
	const assistantMessage: ChatMessage = {role: "assistant", content: assistantContent}
	messageList.push(assistantMessage)
	return assistantContent
}