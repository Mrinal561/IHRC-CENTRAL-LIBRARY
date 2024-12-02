export type LWFConfigData = {
    payment_mode: 'online' | 'offline'
    frequency: 'monthly' | 'half_yearly' | 'yearly' | 'quarterly';
    payment_due_date: {
        first_date: string;
        second_date: string;
        third_date: string;
        last_date: string;
      };
      active: boolean;
    }
    
    export type LWFConfigResponseData = {
      id: string;
      lwfConfig: LWFConfigData[]
  }
