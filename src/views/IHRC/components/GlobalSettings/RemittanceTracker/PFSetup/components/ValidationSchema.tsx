import * as yup from 'yup';

export type PaymentMode = 'online' | 'offline';
export type PFFrequency = 'onthly'; // Add more frequencies as needed
export interface SelectOption {
  value: string;
  label: string;
}

export interface PaymentDueDates {
  first_date: string | null;
  second_date: string | null;
  third_date: string | null;
  last_date: string | null;
}

export const createPFValidationSchema = (frequency: PFFrequency) => 
  yup.object().shape({
    payment_mode: yup.string()
    .required('Payment Mode is required')
    .oneOf(['online', 'offline'], 'Invalid Payment Mode. Please select either "Online" or "Offline".'),

    pf_frequency: yup.string()
    .required('PF Frequency is required')
    .oneOf([frequency], `Invalid PF Frequency. Please select "${frequency}"."`),

    pf_payment_due_date: yup.object().shape({
      first_date: yup.date()
      .required('PF First Due Date is required')
      .min(new Date(), 'PF First Due Date must be today or in the future'),
    }),
  });

  