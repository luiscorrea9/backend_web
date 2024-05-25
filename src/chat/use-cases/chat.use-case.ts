import {
  HarmBlockThreshold,
  HarmCategory,
  VertexAI} from '@google-cloud/vertexai';

  interface Options {
    prompt: string;
}

// Initialize Vertex with your Cloud project and location
const vertex_ai = new VertexAI({project: 'formal-purpose-424418-u2', location: 'us-central1'});
const model = 'gemini-1.5-flash-001';


export const generateContent = async (options: Options) => {
  const {prompt} = options;
  const req = {
    contents: [
      {role: 'user', parts: [{text: prompt}]}
    ],
  };

  const generativeModel = vertex_ai.preview.getGenerativeModel({
    model: model,
    generationConfig: {
      'maxOutputTokens': 150,
      'temperature': 1,
      'topP': 0.95,
    },
    safetySettings: [
   
      {
          'category': HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          'threshold': HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
      },
      {
        'category': HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        'threshold': HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
      },
     
    ],
    systemInstruction: {
      role: 'system',
      parts: [
        {text: `Eres un asistente llamado Taskin.
        Te serán proveídos textos en español de problemas que tengan los usuarios de la empresa.
        tu tarea es corregirlos y retornar información de soluciones.
        `}
      ],
    },
  });

  const result = await generativeModel.generateContent(req);
  const response = result.response.candidates[0].content.parts[0].text;

  return response;
  
}


