import { GetAIQueryResponseProps } from "../core.ai/CoreAI/CoreAI";
const { GoogleGenerativeAI } = require("@google/generative-ai");

export const getResponse = async ({
	query = "ping",
	aiModel = "gemini-1.5-flash",
}: GetAIQueryResponseProps) => {
	const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
	const model = genAI.getGenerativeModel({ model: aiModel });

	const prompt = query;

	const result = await model.generateContent(prompt);
	return result.response?.text();
};
