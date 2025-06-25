export interface ReferenceData {
  id: number;
  name: string;
}

export interface ComplianceData {
  id: number;
  uuid: string;
  country: string;
  function: string;
  applicable: 'central' | 'state';  // Changed to union type
  state_id: number | null;
  state_name?: string;
  legislation_act: string;
  compliance_categorization: string;
  compliance_header: string;
  compliance_description: string;
  penalty_type: string;
  penalty_description: string;
  compliance_applicability: string;
  compliance_reference: string;
  compliance_type: string;
  compliance_frequency: string;
  criticality: string;
  due_date_frequency: string;
  due_dates: {
    first_due_date?: string;
    second_due_date?: string;
    third_due_date?: string;
    last_due_date?: string;
  };
  is_active: boolean;
}

export interface ComplianceFormData {
  id?: number;
  country: string;
  function: string;
  applicable: 'central' | 'state';  // Changed to union type
  state_id: number | null;
  state_name?: string;
  legislation_act: string;
  compliance_categorization: string;
  compliance_header: string;
  compliance_description: string;
  penalty_type: string;
  penalty_description: string;
  compliance_applicability: string;
  compliance_reference: string;
  compliance_type: string;
  compliance_frequency: string;
  criticality: string;
  due_date_frequency: string;
  due_dates: {
    first_due_date?: string;
    second_due_date?: string;
    third_due_date?: string;
    last_due_date?: string;
  };
  is_active: boolean;
}

export interface CountryOption {
  value: string;
  label: string;
}

export interface SelectOption {
  value: string;
  label: string;
}