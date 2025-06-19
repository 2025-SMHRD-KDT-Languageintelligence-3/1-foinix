// This file is machine-generated - edit with care!

'use server';

/**
 * @fileOverview This file defines a Genkit flow to provide vehicle-specific charging instructions.
 *
 * recommendChargingInstructions - A function that returns charging instructions for a specific car model.
 * RecommendChargingInstructionsInput - The input type for the recommendChargingInstructions function.
 * RecommendChargingInstructionsOutput - The return type for the recommendChargingInstructions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendChargingInstructionsInputSchema = z.object({
  vehicleModel: z.string().describe('The model of the vehicle requiring charging instructions.'),
});
export type RecommendChargingInstructionsInput = z.infer<
  typeof RecommendChargingInstructionsInputSchema
>;

const RecommendChargingInstructionsOutputSchema = z.object({
  chargerType: z.string().describe('Recommended charger type (AC/DC).'),
  portLocation: z.string().describe('Location of the charging port on the vehicle.'),
  operationalInstructions:
    z.string().describe('Step-by-step instructions for charging the vehicle.'),
});
export type RecommendChargingInstructionsOutput = z.infer<
  typeof RecommendChargingInstructionsOutputSchema
>;

export async function recommendChargingInstructions(
  input: RecommendChargingInstructionsInput
): Promise<RecommendChargingInstructionsOutput> {
  return recommendChargingInstructionsFlow(input);
}

const recommendChargingInstructionsPrompt = ai.definePrompt({
  name: 'recommendChargingInstructionsPrompt',
  input: {schema: RecommendChargingInstructionsInputSchema},
  output: {schema: RecommendChargingInstructionsOutputSchema},
  prompt: `You are an expert in electric vehicle charging.

You will provide clear and concise charging instructions for the specified vehicle model.

Include the recommended charger type (AC or DC), the location of the charging port on the vehicle, and step-by-step operational instructions.

Vehicle Model: {{{vehicleModel}}}
`,
});

const recommendChargingInstructionsFlow = ai.defineFlow(
  {
    name: 'recommendChargingInstructionsFlow',
    inputSchema: RecommendChargingInstructionsInputSchema,
    outputSchema: RecommendChargingInstructionsOutputSchema,
  },
  async input => {
    const {output} = await recommendChargingInstructionsPrompt(input);
    return output!;
  }
);
