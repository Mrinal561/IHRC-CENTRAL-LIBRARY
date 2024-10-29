
    export type ComplianceData = {
        legislation: string,
        category: string;
        penalty_type: string;
        first_date: Date;
        last_date:Date;
        scheduled_frequency: string;
        proof_mandatory: Boolean;
        header: string;
        description: string;
        penalty_description: string;
        applicablility: string;
        bare_act_text:string;
        type:string;
        caluse: string;
        frequency:string;
        statutory_auth:string;
        approval_required:boolean;
        criticality:string;
        // default_due_Date: Date;
    }

export type ComplianceResponseData = {
    legislation: string,
        category: string;
        penalty_type: string;
        first_date: Date;
        last_date:Date;
        scheduled_frequency: string;
        proof_mandatory: Boolean;
        header: string;
        description: string;
        penalty_description: string;
        applicablility: string;
        bare_act_text:string;
        type:string;
        caluse: string;
        frequency:string;
        statutory_auth:string;
        approval_required:boolean;
        criticality:string;
        default_due_Date: Date;

}