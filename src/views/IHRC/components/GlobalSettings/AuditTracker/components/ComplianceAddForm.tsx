
import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import { Button } from '@/components/ui';
import { IoArrowBack } from 'react-icons/io5';
import OutlinedSelect from '@/components/ui/Outlined';
import OutlinedInput from '@/components/ui/OutlinedInput';
import { DatePicker } from '@/components/ui/DatePicker';
import { useNavigate } from 'react-router-dom';
import { Notification, toast } from '@/components/ui';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import * as Yup from 'yup';
import FunctionAutoSuggest from './FunctionAutoSuggest';
import LegislationActAutoSuggest from './LegislationActAutoSuggest';
import ComplianceCategorizationAutoSuggest from './ComplianceCategorizationAutoSuggest';
import PenaltyTypeAutoSuggest from './PenaltyTypeAutoSuggest';
import ComplianceApplicabilityAutoSuggest from './ComplianceApplicabilityAutoSuggest';
import ComplianceTypeAutoSuggest from './ComplianceTypeAutoSuggest';

interface ComplianceFormData {
  country: string;
  function: string;
  applicable: string;
  state_id: number | null;
  legislation_act: string;
  compliance_categorization: string;
  penalty_type: string;
  compliance_header: string;
  compliance_description: string;
  penalty_description: string;
  compliance_applicability: string;
  compliance_reference: string;
  compliance_type: string;
  compliance_frequency: string;
  criticality: string;
  due_date_frequency: string;
  proof_mandatory: boolean;
  due_dates: {
    first_due_date?: string;
    second_due_date?: string;
    third_due_date?: string;
    last_due_date?: string;
  };
  is_active: boolean;
}

interface ReferenceData {
  id: number;
  name: string;
}

interface SelectOption {
  value: string;
  label: string;
}

const ComplianceAddForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showStateField, setShowStateField] = useState(false);
  const [showDateFields, setShowDateFields] = useState(false);
  const [dateFieldsState, setDateFieldsState] = useState({
    isSecondDateEnabled: false,
    isThirdDateEnabled: false,
    isLastDateEnabled: false,
  });

  // Reference data states
  const [functions, setFunctions] = useState<ReferenceData[]>([]);
  const [legislationActs, setLegislationActs] = useState<ReferenceData[]>([]);
  const [categories, setCategories] = useState<ReferenceData[]>([]);
  const [penaltyTypes, setPenaltyTypes] = useState<ReferenceData[]>([]);
  const [applicabilities, setApplicabilities] = useState<ReferenceData[]>([]);
  const [complianceTypes, setComplianceTypes] = useState<ReferenceData[]>([]);
  const [states, setStates] = useState<ReferenceData[]>([]);

  // Options for select fields
  const countryOptions: SelectOption[] = [
    { value: 'INDIA', label: 'India' },
  ];

  const applicableOptions: SelectOption[] = [
    { value: 'central', label: 'Central' },
    { value: 'state', label: 'State' },
  ];

  const frequencyOptions: SelectOption[] = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' },
    { value: 'half_yearly', label: 'Half Yearly' },
  ];

  const criticalityOptions: SelectOption[] = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  const dueDateFrequencyOptions: SelectOption[] = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'half_yearly', label: 'Half Yearly' },
    { value: 'na', label: 'NA' },
    { value: 'one', label: 'One' },
  ];

  const proofMandatoryOptions: SelectOption[] = [
    { value: 'true', label: 'Yes' },
    { value: 'false', label: 'No' },
  ];

  // Fetch reference data
  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        setLoading(true);
        const [
          functionsRes,
          legislationRes,
          categoriesRes,
          penaltyTypesRes,
          applicabilitiesRes,
          typesRes,
          statesRes
        ] = await Promise.all([
          httpClient.get(endpoints.compliances.functionList()),
          httpClient.get(endpoints.compliances.legislationActsList()),
          httpClient.get(endpoints.compliances.complianceCategorizationsList()),
          httpClient.get(endpoints.compliances.penaltyTypesList()),
          httpClient.get(endpoints.compliances.complianceApplicabilityList()),
          httpClient.get(endpoints.compliances.complianceTypeList()),
          httpClient.get(endpoints.common.getStatesAll())
        ]);

        setFunctions(functionsRes.data.data || []);
        setLegislationActs(legislationRes.data.data || []);
        setCategories(categoriesRes.data.data || []);
        setPenaltyTypes(penaltyTypesRes.data.data || []);
        setApplicabilities(applicabilitiesRes.data.data || []);
        setComplianceTypes(typesRes.data.data || []);
        setStates(statesRes.data || []);
      } catch (error) {
        console.error('Error fetching reference data:', error);
        toast.push(
          <Notification title="Error" type="error">
            Failed to load reference data
          </Notification>
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReferenceData();
  }, []);

  // Validation schema
  const validationSchema = Yup.object().shape({
    country: Yup.string().required('Country is required'),
    function: Yup.string().required('Function is required'),
    applicable: Yup.string().required('Applicable is required'),
    state_id: Yup.number().when('applicable', {
      is: 'state',
      then: (schema) => schema.required('State is required'),
      otherwise: (schema) => schema.nullable()
    }),
    legislation_act: Yup.string().required('Legislation Act is required'),
    compliance_categorization: Yup.string().required('Compliance Categorization is required'),
    penalty_type: Yup.string().required('Penalty Type is required'),
    compliance_header: Yup.string().required('Compliance Header is required'),
    compliance_description: Yup.string().required('Compliance Description is required'),
    penalty_description: Yup.string().required('Penalty Description is required'),
    compliance_applicability: Yup.string().required('Compliance Applicability is required'),
    compliance_reference: Yup.string().required('Compliance Reference is required'),
    compliance_type: Yup.string().required('Compliance Type is required'),
    compliance_frequency: Yup.string().required('Compliance Frequency is required'),
    criticality: Yup.string().required('Criticality is required'),
    due_date_frequency: Yup.string().required('Due Date Frequency is required'),
    proof_mandatory: Yup.boolean().required('Proof Mandatory is required'),
    due_dates: Yup.object().when('due_date_frequency', {
      is: (val: string) => !['na', 'one'].includes(val?.toLowerCase()),
      then: (schema) => schema.shape({
        first_due_date: Yup.string().required('First due date is required'),
        second_due_date: Yup.string().when('due_date_frequency', {
          is: 'quarterly',
          then: (schema) => schema.required('Second due date is required'),
          otherwise: (schema) => schema.nullable()
        }),
        third_due_date: Yup.string().when('due_date_frequency', {
          is: 'quarterly',
          then: (schema) => schema.required('Third due date is required'),
          otherwise: (schema) => schema.nullable()
        }),
        last_due_date: Yup.string().when('due_date_frequency', {
          is: (val: string) => ['half_yearly', 'quarterly'].includes(val?.toLowerCase()),
          then: (schema) => schema.required('Last due date is required'),
          otherwise: (schema) => schema.nullable()
        })
      }).test(
        'unique-dates',
        'Dates must be unique',
        function(value) {
          const { due_date_frequency } = this.parent;
          
          if (!due_date_frequency || !value) return true;

          if (due_date_frequency === 'half_yearly') {
            if (value.first_due_date && value.last_due_date && 
                value.first_due_date === value.last_due_date) {
              return this.createError({
                path: 'due_dates.last_due_date',
                message: 'Last due date must be different from first due date'
              });
            }
          }
          
          if (due_date_frequency === 'quarterly') {
            const dates = [
              value.first_due_date,
              value.second_due_date,
              value.third_due_date,
              value.last_due_date
            ].filter(date => date !== undefined);
            
            // Check for duplicate dates
            const uniqueDates = new Set(dates);
            if (uniqueDates.size !== dates.length) {
              if (dates[0] && dates[1] && dates[0] === dates[1]) {
                return this.createError({
                  path: 'due_dates.second_due_date',
                  message: 'Second due date must be different from first due date'
                });
              }
              if (dates[0] && dates[2] && dates[0] === dates[2]) {
                return this.createError({
                  path: 'due_dates.third_due_date',
                  message: 'Third due date must be different from first due date'
                });
              }
              if (dates[0] && dates[3] && dates[0] === dates[3]) {
                return this.createError({
                  path: 'due_dates.last_due_date',
                  message: 'Last due date must be different from first due date'
                });
              }
              if (dates[1] && dates[2] && dates[1] === dates[2]) {
                return this.createError({
                  path: 'due_dates.third_due_date',
                  message: 'Third due date must be different from second due date'
                });
              }
              if (dates[1] && dates[3] && dates[1] === dates[3]) {
                return this.createError({
                  path: 'due_dates.last_due_date',
                  message: 'Last due date must be different from second due date'
                });
              }
              if (dates[2] && dates[3] && dates[2] === dates[3]) {
                return this.createError({
                  path: 'due_dates.last_due_date',
                  message: 'Last due date must be different from third due date'
                });
              }
            }
          }
          
          return true;
        }
      ),
      otherwise: (schema) => schema.notRequired()
    })
  });

  const initialValues: ComplianceFormData = {
    country: 'INDIA',
    function: '',
    applicable: 'central',
    state_id: null,
    legislation_act: '',
    compliance_categorization: '',
    penalty_type: '',
    compliance_header: '',
    compliance_description: '',
    penalty_description: '',
    compliance_applicability: '',
    compliance_reference: '',
    compliance_type: '',
    compliance_frequency: '',
    criticality: '',
    due_date_frequency: '',
    proof_mandatory: false,
    due_dates: {},
    is_active: true
  };

  const handleFrequencyChange = (frequency: string) => {
    const newEnabledFields = {
      isSecondDateEnabled: false,
      isThirdDateEnabled: false,
      isLastDateEnabled: false,
    };

    switch (frequency.toLowerCase()) {
      case 'monthly':
      case 'yearly':
        newEnabledFields.isSecondDateEnabled = false;
        newEnabledFields.isThirdDateEnabled = false;
        newEnabledFields.isLastDateEnabled = false;
        break;
      case 'half_yearly':
        newEnabledFields.isSecondDateEnabled = false;
        newEnabledFields.isThirdDateEnabled = false;
        newEnabledFields.isLastDateEnabled = true;
        break;
      case 'quarterly':
        newEnabledFields.isSecondDateEnabled = true;
        newEnabledFields.isThirdDateEnabled = true;
        newEnabledFields.isLastDateEnabled = true;
        break;
      default:
        newEnabledFields.isSecondDateEnabled = false;
        newEnabledFields.isThirdDateEnabled = false;
        newEnabledFields.isLastDateEnabled = false;
    }

    setDateFieldsState(newEnabledFields);
  };

 const handleSubmit = async (values: ComplianceFormData, { setSubmitting, setFieldError, setFieldTouched }: any) => {
    try {
      // Validate due dates first
      let hasValidationErrors = false;
      
      if (!['na', 'one'].includes(values.due_date_frequency.toLowerCase())) {
        // Mark fields as touched to show errors
        setFieldTouched('due_dates.first_due_date', true);
        
        if (!values.due_dates.first_due_date) {
          setFieldError('due_dates.first_due_date', 'First due date is required');
          hasValidationErrors = true;
        }
        
        if (values.due_date_frequency.toLowerCase() === 'quarterly') {
          setFieldTouched('due_dates.second_due_date', true);
          setFieldTouched('due_dates.third_due_date', true);
          setFieldTouched('due_dates.last_due_date', true);
          
          if (!values.due_dates.second_due_date) {
            setFieldError('due_dates.second_due_date', 'Second due date is required');
            hasValidationErrors = true;
          }
          if (!values.due_dates.third_due_date) {
            setFieldError('due_dates.third_due_date', 'Third due date is required');
            hasValidationErrors = true;
          }
          if (!values.due_dates.last_due_date) {
            setFieldError('due_dates.last_due_date', 'Last due date is required');
            hasValidationErrors = true;
          }
        }
        
        if (values.due_date_frequency.toLowerCase() === 'half_yearly') {
          setFieldTouched('due_dates.last_due_date', true);
          
          if (!values.due_dates.last_due_date) {
            setFieldError('due_dates.last_due_date', 'Last due date is required');
            hasValidationErrors = true;
          }
        }
      }
      
      // If there are validation errors, stop submission
      if (hasValidationErrors) {
        setSubmitting(false);
        return;
      }

      // Proceed with submission if validation passes
      setLoading(true);
      
      const payload = {
        ...values,
        state_id: values.applicable === 'state' ? Number(values.state_id) : null,
        is_active: true
      };

      await httpClient.post(
        endpoints.compliances.createcompliance(),
        payload
      );
      
      toast.push(
        <Notification title="Success" type="success">
          Compliance created successfully
        </Notification>
      );
      
      navigate('/auditSetup');
    } catch (error: any) {
      console.error('Error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create compliance';
      toast.push(
        <Notification title="Error" type="error">
          {errorMessage}
        </Notification>
      );
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="p-2 bg-white rounded-lg">
      <div className="flex gap-1 items-center mb-10">
        <Button
          size="sm"
          variant="plain"
          icon={<IoArrowBack className="text-[#72828e] hover:text-[#5d6169]" />}
          onClick={() => navigate(-1)}
        />
        <h3 className="text-2xl font-semibold">Add Compliance Parameter</h3>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnChange={true}
        validateOnBlur={true}
      >
        {({ values, errors, touched, setFieldValue, handleSubmit, setFieldTouched, setFieldError, validateForm }) => {
          // Handle applicable change to show/hide state field
          useEffect(() => {
            setShowStateField(values.applicable === 'state');
            if (values.applicable !== 'state') {
              setFieldValue('state_id', null);
            }
          }, [values.applicable]);

          // Handle due date frequency change
          useEffect(() => {
            const frequency = values.due_date_frequency.toLowerCase();
            const shouldShowDates = !['na', 'one'].includes(frequency);
            setShowDateFields(shouldShowDates);

            if (shouldShowDates) {
              handleFrequencyChange(frequency);
            } else {
              setFieldValue('due_dates', {});
            }
          }, [values.due_date_frequency]);

          const handleFormSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            
            // Trigger Formik validation first
            const formErrors = await validateForm();
            
            // Manually validate due dates and set errors if needed
            const validateDueDates = () => {
              const dueDateErrors: Record<string, string> = {};
              
              if (!['na', 'one'].includes(values.due_date_frequency.toLowerCase())) {
                if (!values.due_dates.first_due_date) {
                  dueDateErrors['due_dates.first_due_date'] = 'First due date is required';
                }
                
                if (values.due_date_frequency.toLowerCase() === 'quarterly') {
                  if (!values.due_dates.second_due_date) {
                    dueDateErrors['due_dates.second_due_date'] = 'Second due date is required';
                  }
                  if (!values.due_dates.third_due_date) {
                    dueDateErrors['due_dates.third_due_date'] = 'Third due date is required';
                  }
                  if (!values.due_dates.last_due_date) {
                    dueDateErrors['due_dates.last_due_date'] = 'Last due date is required';
                  }
                }
                
                if (values.due_date_frequency.toLowerCase() === 'half_yearly' && !values.due_dates.last_due_date) {
                  dueDateErrors['due_dates.last_due_date'] = 'Last due date is required';
                }
              }
              
              // Set errors for each field
              Object.entries(dueDateErrors).forEach(([field, message]) => {
                setFieldError(field, message);
              });
              
              // Mark all relevant fields as touched to show errors
              if (!['na', 'one'].includes(values.due_date_frequency.toLowerCase())) {
                setFieldTouched('due_dates.first_due_date', true);
                
                if (values.due_date_frequency.toLowerCase() === 'quarterly') {
                  setFieldTouched('due_dates.second_due_date', true);
                  setFieldTouched('due_dates.third_due_date', true);
                  setFieldTouched('due_dates.last_due_date', true);
                } else if (values.due_date_frequency.toLowerCase() === 'half_yearly') {
                  setFieldTouched('due_dates.last_due_date', true);
                }
              }
              
              return Object.keys(dueDateErrors).length === 0;
            };
            
            const dueDatesValid = validateDueDates();
            
            // Check if form is valid (both Formik validation and custom due date validation)
            if (Object.keys(formErrors).length === 0 && dueDatesValid) {
              handleSubmit();
            }
          };


          return (
            <Form onSubmit={handleFormSubmit}>
              <div className="space-y-6">
                {/* 1st Row: Country and Function */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="mb-2">Country <span className="text-red-500">*</span></p>
                    <OutlinedSelect
                      label="Select Country"
                      options={countryOptions}
                      value={countryOptions.find(opt => opt.value === values.country) || countryOptions[0]}
                      onChange={(option) => setFieldValue('country', option?.value || 'INDIA')}
                    />
                    {touched.country && errors.country && (
                      <div className="text-red-500 text-sm">{errors.country}</div>
                    )}
                  </div>
                  <div>
                    <FunctionAutoSuggest
                      value={values.function}
                      onChange={(value) => setFieldValue('function', value)}
                      onFunctionSelect={(id) => {}}
                      disabled={loading}
                    />
                    {touched.function && errors.function && (
                      <div className="text-red-500 text-sm">{errors.function}</div>
                    )}
                  </div>
                </div>

                {/* 2nd Row: Applicable and Legislation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                    <LegislationActAutoSuggest
                      value={values.legislation_act}
                      onChange={(value) => setFieldValue('legislation_act', value)}
                      onActSelect={(id) => {}}
                      disabled={loading}
                    />
                    {touched.legislation_act && errors.legislation_act && (
                      <div className="text-red-500 text-sm">{errors.legislation_act}</div>
                    )}
                  </div>
                  
                  <div>
                    <p className="mb-2">Central/State <span className="text-red-500">*</span></p>
                    <OutlinedSelect
                      label="Select Applicable"
                      options={applicableOptions}
                      value={applicableOptions.find(opt => opt.value === values.applicable) || applicableOptions[0]}
                      onChange={(option) => setFieldValue('applicable', option?.value || 'central')}
                    />
                    {touched.applicable && errors.applicable && (
                      <div className="text-red-500 text-sm">{errors.applicable}</div>
                    )}
                  </div>
                 
                </div>

                {/* State field - conditionally shown */}
                {showStateField && (
                  <div>
                    <p className="mb-2">State</p>
                    <OutlinedSelect
                      label="Select State"
                      options={states.map(state => ({
                        value: String(state.id),
                        label: state.name
                      }))}
                      value={states.find(state => String(state.id) === String(values.state_id)) ? {
                        value: String(values.state_id),
                        label: states.find(state => String(state.id) === String(values.state_id))?.name || ''
                      } : null}
                      onChange={(option) => setFieldValue('state_id', option?.value ? Number(option.value) : null)}
                    />
                    {touched.state_id && errors.state_id && (
                      <div className="text-red-500 text-sm">{errors.state_id}</div>
                    )}
                  </div>
                )}

                {/* 3rd Row: Category and Penalty Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <ComplianceCategorizationAutoSuggest
                      value={values.compliance_categorization}
                      onChange={(value) => setFieldValue('compliance_categorization', value)}
                      onCategorizationSelect={(id) => {}}
                      disabled={loading}
                    />
                    {touched.compliance_categorization && errors.compliance_categorization && (
                      <div className="text-red-500 text-sm">{errors.compliance_categorization}</div>
                    )}
                  </div>

                  <div>
                  <p className="mb-2">Compliance Header <span className="text-red-500">*</span></p>
                  <OutlinedInput
                    label="Compliance Header"
                    value={values.compliance_header}
                    onChange={(value) => setFieldValue('compliance_header', value)}
                  />
                  {touched.compliance_header && errors.compliance_header && (
                    <div className="text-red-500 text-sm">{errors.compliance_header}</div>
                  )}
                </div>
                 
                </div>

                {/* 4th Row: Compliance Header */}

                <div>
                  <p className="mb-2">Compliance Description <span className="text-red-500">*</span></p>
                  <OutlinedInput
                    label="Compliance Description"
                    value={values.compliance_description}
                    onChange={(value) => setFieldValue('compliance_description', value)}
                    textarea={true}
                  />
                  {touched.compliance_description && errors.compliance_description && (
                    <div className="text-red-500 text-sm">{errors.compliance_description}</div>
                  )}
                </div>
                
                 <div>
                    <PenaltyTypeAutoSuggest
                      value={values.penalty_type}
                      onChange={(value) => setFieldValue('penalty_type', value)}
                      onPenaltySelect={(id) => {}}
                      disabled={loading}
                    />
                    {touched.penalty_type && errors.penalty_type && (
                      <div className="text-red-500 text-sm">{errors.penalty_type}</div>
                    )}
                  </div>

                {/* 5th Row: Compliance Description */}
                

                {/* 6th Row: Penalty Description */}
                <div>
                  <p className="mb-2">Penalty Description <span className="text-red-500">*</span></p>
                  <OutlinedInput
                    label="Penalty Description"
                    value={values.penalty_description}
                    onChange={(value) => setFieldValue('penalty_description', value)}
                    textarea={true}
                  />
                  {touched.penalty_description && errors.penalty_description && (
                    <div className="text-red-500 text-sm">{errors.penalty_description}</div>
                  )}
                </div>

                {/* 7th Row: Applicability and Reference */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <ComplianceApplicabilityAutoSuggest
                      value={values.compliance_applicability}
                      onChange={(value) => setFieldValue('compliance_applicability', value)}
                      onApplicabilitySelect={(id) => {}}
                      disabled={loading}
                    />
                    {touched.compliance_applicability && errors.compliance_applicability && (
                      <div className="text-red-500 text-sm">{errors.compliance_applicability}</div>
                    )}
                  </div>
                  <div>
                    <p className="mb-2">Compliance Reference <span className="text-red-500">*</span></p>
                    <OutlinedInput
                      label="Compliance Reference"
                      value={values.compliance_reference}
                      onChange={(value) => setFieldValue('compliance_reference', value)}
                    />
                    {touched.compliance_reference && errors.compliance_reference && (
                      <div className="text-red-500 text-sm">{errors.compliance_reference}</div>
                    )}
                  </div>
                </div>

                {/* 8th Row: Type and Frequency */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <ComplianceTypeAutoSuggest
                      value={values.compliance_type}
                      onChange={(value) => setFieldValue('compliance_type', value)}
                      onTypeSelect={(id) => {}}
                      disabled={loading}
                    />
                    {touched.compliance_type && errors.compliance_type && (
                      <div className="text-red-500 text-sm">{errors.compliance_type}</div>
                    )}
                  </div>
                  <div>
                    <p className="mb-2">Compliance Frequency <span className="text-red-500">*</span></p>
                    <OutlinedSelect
                      label="Select Frequency"
                      options={frequencyOptions}
                      value={frequencyOptions.find(opt => opt.value === values.compliance_frequency) || null}
                      onChange={(option) => setFieldValue('compliance_frequency', option?.value || '')}
                    />
                    {touched.compliance_frequency && errors.compliance_frequency && (
                      <div className="text-red-500 text-sm">{errors.compliance_frequency}</div>
                    )}
                  </div>
                </div>

                {/* 9th Row: Criticality and Due Date Frequency */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="mb-2">Criticality <span className="text-red-500">*</span></p>
                    <OutlinedSelect
                      label="Select Criticality"
                      options={criticalityOptions}
                      value={criticalityOptions.find(opt => opt.value === values.criticality) || null}
                      onChange={(option) => setFieldValue('criticality', option?.value || '')}
                    />
                    {touched.criticality && errors.criticality && (
                      <div className="text-red-500 text-sm">{errors.criticality}</div>
                    )}
                  </div>
                  <div>
                    <p className="mb-2">Due Date Frequency <span className="text-red-500">*</span></p>
                    <OutlinedSelect
                      label="Select Due Date Frequency"
                      options={dueDateFrequencyOptions}
                      value={dueDateFrequencyOptions.find(opt => opt.value === values.due_date_frequency) || null}
                      onChange={(option) => {
                        const value = option?.value || '';
                        setFieldValue('due_date_frequency', value);
                        setFieldValue('due_dates', {});
                      }}
                    />
                    {touched.due_date_frequency && errors.due_date_frequency && (
                      <div className="text-red-500 text-sm">{errors.due_date_frequency}</div>
                    )}
                  </div>
                </div>

                {/* Proof Mandatory field */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="mb-2">Proof Mandatory <span className="text-red-500">*</span></p>
                    <OutlinedSelect
                      label="Select Proof Mandatory"
                      options={proofMandatoryOptions}
                      value={proofMandatoryOptions.find(opt => opt.value === String(values.proof_mandatory)) || proofMandatoryOptions[1]}
                      onChange={(option) => setFieldValue('proof_mandatory', option?.value === 'true')}
                    />
                    {touched.proof_mandatory && errors.proof_mandatory && (
                      <div className="text-red-500 text-sm">{errors.proof_mandatory}</div>
                    )}
                  </div>
                </div>

                {/* Date fields - conditionally shown */}
                {showDateFields && (
                  <div className='grid grid-cols-2 gap-4'>
                    {/* First Due Date - always required */}
                    <div>
                      <p className="mb-2">First Due Date  <span className="text-red-500">*</span></p>
                      <DatePicker
                        placeholder="Select first due date"
                        value={values.due_dates.first_due_date ? new Date(values.due_dates.first_due_date) : null}
                        onChange={(date) => {
                          if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      setFieldValue('due_dates.first_due_date', dateString);
      setFieldTouched('due_dates.first_due_date', true);
    } else {
      setFieldValue('due_dates.first_due_date', '');
    }
  }}
                        inputFormat="DD-MM-YYYY"
                      />
                      {/* {touched.due_dates?.first_due_date && errors.due_dates?.first_due_date && (
                        <div className="text-red-500 text-sm">{errors.due_dates.first_due_date}</div>
                      )} */}
                      {errors.due_dates?.first_due_date && (
                        <div className="text-red-500 text-sm">{errors.due_dates.first_due_date}</div>
                      )}
                    </div>

                    {/* Second Due Date - only for quarterly */}
                    {values.due_date_frequency.toLowerCase() === 'quarterly' && (
                      <div>
                        <p className="mb-2">Second Due Date <span className="text-red-500">*</span></p>
                        <DatePicker
                          placeholder="Select second due date"
                          value={values.due_dates.second_due_date ? new Date(values.due_dates.second_due_date) : null}
                          onChange={(date) => {
                           if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      setFieldValue('due_dates.second_due_date', dateString);
      setFieldTouched('due_dates.second_due_date', true);
    } else {
      setFieldValue('due_dates.second_due_date', '');
    }
  }}
                          inputFormat="DD-MM-YYYY"
                        />
                        {/* {touched.due_dates?.second_due_date && errors.due_dates?.second_due_date && (
                          <div className="text-red-500 text-sm">{errors.due_dates.second_due_date}</div>
                        )} */}
                        {errors.due_dates?.second_due_date && (
                        <div className="text-red-500 text-sm">{errors.due_dates.second_due_date}</div>
                      )}
                      </div>
                    )}

                    {/* Third Due Date - only for quarterly */}
                    {values.due_date_frequency.toLowerCase() === 'quarterly' && (
                      <div>
                        <p className="mb-2">Third Due Date <span className="text-red-500">*</span></p>
                        <DatePicker
                          placeholder="Select third due date"
                          value={values.due_dates.third_due_date ? new Date(values.due_dates.third_due_date) : null}
                          onChange={(date) => {
                            if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      setFieldValue('due_dates.third_due_date', dateString);
      setFieldTouched('due_dates.third_due_date', true);
    } else {
      setFieldValue('due_dates.third_due_date', '');
    }
  }}
                          inputFormat="DD-MM-YYYY"
                        />
                        {/* {touched.due_dates?.third_due_date && errors.due_dates?.third_due_date && (
                          <div className="text-red-500 text-sm">{errors.due_dates.third_due_date}</div>
                        )} */}
                         {errors.due_dates?.third_due_date && (
                        <div className="text-red-500 text-sm">{errors.due_dates.third_due_date}</div>
                      )}
                      </div>
                    )}

                    {/* Last Due Date - for half_yearly and quarterly */}
                    {['half_yearly', 'quarterly'].includes(values.due_date_frequency.toLowerCase()) && (
                      <div>
                        <p className="mb-2">Last Due Date <span className="text-red-500">*</span></p>
                        <DatePicker
                          placeholder="Select last due date"
                          value={values.due_dates.last_due_date ? new Date(values.due_dates.last_due_date) : null}
                          onChange={(date) => {
                           if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      setFieldValue('due_dates.last_due_date', dateString);
      setFieldTouched('due_dates.last_due_date', true);
    } else {
      setFieldValue('due_dates.last_due_date', '');
    }
  }}
                          inputFormat="DD-MM-YYYY"
                        />
                        {/* {touched.due_dates?.last_due_date && errors.due_dates?.last_due_date && (
                          <div className="text-red-500 text-sm">{errors.due_dates.last_due_date}</div>
                        )} */}
                          {errors.due_dates?.last_due_date && (
                        <div className="text-red-500 text-sm">{errors.due_dates.last_due_date}</div>
                      )}
                      </div>
                    )}
                  </div>
                )}

                {/* Submit and Cancel buttons */}
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="plain"
                    size="sm"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    variant="solid"
                    size="sm"
                    loading={loading}
                    icon={loading ? <AiOutlineLoading3Quarters className="animate-spin" /> : null}
                  >
                    Confirm
                  </Button>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default ComplianceAddForm;