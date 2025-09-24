const OpenAI = require('openai');

class OpenAiService {
  constructor() {
    this.promptTemplate = `
      Provide your answer in JSON. Here is the transcription of a meeting between patient and doctor. Analyze the transcription and provide soap notes and illness in the form of JSON. For any information not found, provide an empty string.
      Transcription starts:
      **transcription**
      Transcription ends:
      Do not include any explanations, only provide a  RFC8259 compliant JSON response  following this format without deviation.
      {
          "subjective": "",
          "objective": "",
          "assessment": "",
          "plan": "",
          "illness": "",
          "systolic": "",
          "diastolic": "",
          "pulse": "",
          "respiration": "",
          "temperature": "",
          "weight": "",
          "spo2": "",
          "bmi": "",
      }`;
      this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async getCompletion(prompt) {
    try {
      // Send the request for chat completion
      console.log("Sending Request for SOAP Notes Generation");
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a medical provider. Please Provide SOAP notes.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const rawContent = response.choices[0].message.content;
      console.log(rawContent);
      const jsonContent = rawContent.replace(/```json|```/g, '').trim();
      return jsonContent;
    } catch (error) {
      console.error('Error during OpenAI request:', error.message);
      throw new Error(error.message);
    }
  }

  buildPrompt(transcription) {
    let prompt = this.promptTemplate.replace('**transcription**', transcription);
    return prompt;
  }
}

module.exports = OpenAiService;
