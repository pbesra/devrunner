import { GetAIQueryResponseProps } from "../core.ai/CoreAI/CoreAI";
const { GoogleGenerativeAI } = require("@google/generative-ai");

export const getResponse = async ({
	query = "ping",
	aiModel = "gemini-1.5-flash",
}: GetAIQueryResponseProps) => {
	console.log(
		"process.env.GEMINI_API_KEY",
		process.env.REACT_APP_GEMINI_API_KEY
	);
	console.log("process.env", process.env);
	const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
	const model = genAI.getGenerativeModel({ model: aiModel });

	const prompt = query;

	const result = await model.generateContent(prompt);
	return result.response?.text();
};
