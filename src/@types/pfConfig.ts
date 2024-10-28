export type PFConfigData = {
  pf_frequency: 'monthly' | 'half_yearly' | 'yearly';
    pt_payment_due_date: {
      first_date: string;
      last_date: string | null;
    };
  }
  
  export type PFConfigResponseData = {
    id: string;
    pf_frequency: string;
    pt_payment_due_date: {
      first_date: string;
      last_date: string | null;
    };
}