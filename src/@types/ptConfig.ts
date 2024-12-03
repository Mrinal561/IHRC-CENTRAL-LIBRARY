export type PTConfigData = {
    ptec_payment_mode: 'online' | 'offline'
    ptrc_payment_mode: 'online' | 'offline'
    ptrc_frequency: 'monthly' | 'half_yearly' | 'yearly' | 'quarterly';
    ptec_frequency: 'monthly' | 'half_yearly' | 'yearly' | 'quarterly';
    ptec_payment_due_date: {
        first_date: string;
        second_date: string;
        third_date: string;
        last_date: string;
      };
    ptrc_payment_due_date: {
        first_date: string;
        second_date: string;
        third_date: string;
        last_date: string;
      };
      active: boolean;
      state_id?: string
    }
    
    export type PTConfigResponseData = {
      id: string;
      ptConfig: PTConfigData[]
  }

