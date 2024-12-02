export type PTECConfigData = {
    payment_mode: 'online' | 'offline'
    frequency: 'monthly' | 'half_yearly' | 'yearly' | 'quarterly';
    payment_due_date: {
        first_date: string;
        second_date: string;
        third_date: string;
        last_date: string;
      };
      active: boolean;
      state_id?: string
    }
    
    export type PTECConfigResponseData = {
      id: string;
      ptecConfig: PTECConfigData[]
  }


  export type PTRCConfigData = {
    payment_mode: 'online' | 'offline'
    frequency: 'monthly' | 'half_yearly' | 'yearly' | 'quarterly';
    payment_due_date: {
        first_date: string;
        second_date: string;
        third_date: string;
        last_date: string;
      };
      active: boolean;
      state_id?: string
    }
    
    export type PTRCConfigResponseData = {
      id: string;
      ptrcConfig: PTRCConfigData[]
  }
