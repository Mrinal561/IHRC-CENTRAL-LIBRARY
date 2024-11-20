
    export type ComplianceData = {
        id: string;
        uuid: string;
        legislation: string,
        category: string,
        header: string,
        description: string,
        penalty_description: string,
        applicablility: string,
        bare_act_text: string,
        caluse: string,
        type: string,
        frequency: string,
        scope: string,
        state_id: number,        
        statutory_auth: string,
        approval_required: boolean,
        criticality: string,
        penalty_type: string,
        default_due_date: {
            first_date: string,
            second_date: string,
            third_date: string,
            last_date: string,
        },
        proof_mandatory: boolean,
        created_type: string,
        created_at: string,
    }

export type ComplianceResponseData = {
    compliance: ComplianceData[];
    Loading: boolean;
    error: string | null;
}