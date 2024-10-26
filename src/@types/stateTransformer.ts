// stateTransformer.ts

interface DatePayload {
    first_date: string;
    last_date?: string;
  }
  
  interface StatePayload {
    name: string;
    ptec_frequency: string;
    ptrc_frequency: string;
    lwf_frequency: string;
    payment_mode: string;
    ptec_payment_due_date: DatePayload;
    ptrc_payment_due_date: DatePayload;
    lwf_payment_due_date: DatePayload;
  }
  
  interface FrequencyOption {
    value: string;
    label: string;
  }
  
  interface RawStateData {
    name: string;
    ptec_frequency: FrequencyOption;
    ptrc_frequency: FrequencyOption;
    lwf_frequency: FrequencyOption;
    paymentFrequency: FrequencyOption;
    ptEcFirstDueDate: string | null;
    ptEcLastDueDate: string | null;
    ptRcFirstDueDate: string | null;
    ptRcLastDueDate: string | null;
    lwfFirstDueDate: string | null;
    lwfLastDueDate: string | null;
  }
  
  export const transformStatePayload = (data: RawStateData): StatePayload => {
    // Format date to YYYY-MM-DD
    const formatDate = (date: string | null) => {
      if (!date) return undefined;
      return new Date(date).toISOString().split('T')[0];
    };
  
    // Create due date object with optional last_date
    const createDueDatePayload = (firstDate: string | null, lastDate: string | null): DatePayload => {
      const payload: DatePayload = {
        first_date: formatDate(firstDate) || '',
      };
      
      const formattedLastDate = formatDate(lastDate);
      if (formattedLastDate) {
        payload.last_date = formattedLastDate;
      }
      
      return payload;
    };
  
    // Transform payment mode
    const transformPaymentMode = (mode: string): string => {
      switch (mode) {
        case 'online':
          return 'online';
        case 'offline':
          return 'offline';
        default:
          return 'online_offline';
      }
    };
  
    // Transform frequency value
    const transformFrequency = (freq: FrequencyOption): string => {
      const value = freq.value.replace('-', '_');
      return value === 'half_yearly' ? 'half_yearly' : value;
    };
  
    return {
      name: data.name,
      ptec_frequency: transformFrequency(data.ptec_frequency),
      ptrc_frequency: transformFrequency(data.ptrc_frequency),
      lwf_frequency: transformFrequency(data.lwf_frequency),
      payment_mode: transformPaymentMode(data.paymentFrequency.value),
      ptec_payment_due_date: createDueDatePayload(data.ptEcFirstDueDate, data.ptEcLastDueDate),
      ptrc_payment_due_date: createDueDatePayload(data.ptRcFirstDueDate, data.ptRcLastDueDate),
      lwf_payment_due_date: createDueDatePayload(data.lwfFirstDueDate, data.lwfLastDueDate),
    };
  };