'use server';
/**
 * @fileOverview AI agent to recognize license plates from images.
 *
 * - recognizeLicensePlate - A function that handles the license plate recognition process.
 * - RecognizeLicensePlateInput - The input type for the recognizeLicensePlate function.
 * - RecognizeLicensePlateOutput - The return type for the recognizeLicensePlate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecognizeLicensePlateInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the vehicle's license plate, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type RecognizeLicensePlateInput = z.infer<typeof RecognizeLicensePlateInputSchema>;

const RecognizeLicensePlateOutputSchema = z.object({
  licensePlate: z.string().describe('The recognized license plate number.'),
  confidence: z.number().describe('The confidence level of the recognition (0-1).'),
});
export type RecognizeLicensePlateOutput = z.infer<typeof RecognizeLicensePlateOutputSchema>;

export async function recognizeLicensePlate(input: RecognizeLicensePlateInput): Promise<RecognizeLicensePlateOutput> {
  return recognizeLicensePlateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recognizeLicensePlatePrompt',
  input: {schema: RecognizeLicensePlateInputSchema},
  output: {schema: RecognizeLicensePlateOutputSchema},
  prompt: `You are an AI expert in recognizing license plates from images. Extract the license plate number from the image, and provide a confidence level (0-1) for the recognition.

Image: {{media url=photoDataUri}}`,
});

const recognizeLicensePlateFlow = ai.defineFlow(
  {
    name: 'recognizeLicensePlateFlow',
    inputSchema: RecognizeLicensePlateInputSchema,
    outputSchema: RecognizeLicensePlateOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
