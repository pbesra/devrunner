import { apiKey } from "./secrets";
const { GoogleGenerativeAI } = require("@google/generative-ai");

interface Response{
  query?: string
}

const getResponse = async ({query="ping"}: Response) => {
  
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = query;

  const result = await model.generateContent(prompt);
  console.log(result);
  return result.response.text();
};
export default getResponse;