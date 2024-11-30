// import { PFSetupFormData } from './types';

interface TransformedPFSetupPayload {
  name: string;
  pf_frequency: string;
  pf_payment_due_date?: {
    first_date?: string | null;
    last_date?: string | null;
  };
}

export const transformPFSetupPayload = (data: PFSetupFormData): TransformedPFSetupPayload => {
  // Transform the form data to match the backend API structure
  const transformedPayload: TransformedPFSetupPayload = {
    name: data.name,
    pf_frequency: data.pfFrequency,
  };

  // Handle payment due dates
  if (data.firstDueDate) {
    transformedPayload.pf_payment_due_date = {
      first_date: new Date(data.firstDueDate).toISOString().split('T')[0]
    };

    // Add last due date only for half-yearly frequency
    if (data.pfFrequency === 'half_yearly' && data.lastDueDate) {
      transformedPayload.pf_payment_due_date.last_date = new Date(data.lastDueDate).toISOString().split('T')[0];
    }
  }

  return transformedPayload;
};

// Corresponding types file
export interface PFSetupFormData {
  name: string;
  pfFrequency: string;
  firstDueDate: Date | null;
  lastDueDate: Date | null;
}

export interface PFSetupApiResponse {
  id: string;
  name: string;
  pf_frequency: string;
  pf_payment_due_date?: {
    first_date: string;
    last_date?: string;
  };
}