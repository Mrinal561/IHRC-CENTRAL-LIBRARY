export type PFConfigData = {
  payment_mode: 'online' | 'offline'
  pfiw_payment_mode: 'online' | 'offline'
  pf_frequency: 'monthly';
  pfiw_frequency: 'monthly';
  pf_payment_due_date: {
    first_date: string;
      second_date: string;
      third_date: string;
      last_date: string;
    };
    pfiw_payment_due_date: {
      first_date: string;
      second_date: string;
      third_date: string;
      last_date: string;
    };
  }
  
  export type PFConfigResponseData = {
    id: string;
    pfConfig: PFConfigData[]
}

      // pf_frequency: 'monthly' | 'half_yearly' | 'yearly' | 'quarterly';