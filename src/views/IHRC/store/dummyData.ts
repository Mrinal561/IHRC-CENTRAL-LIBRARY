export interface ComplianceData {
    Compliance_Instance_ID: number;
    Compliance_ID: number;
    IHRC_Company_Name: string;
    Location: string;
    Legislation: string;
    Compliance_Categorization: string;
    Compliance_Header: string;
    Compliance_Description: string;
    Penalty_Description: string;
    Compliance_Applicability: string;
    Bare_Act_Text: string;
    Compliance_Clause: string;
    Compliance_Type: string;
    Compliance_Frequency: string;
    Compliance_Statutory_Authority: string;
    Approval_Required: boolean;
    Criticality: string;
    Penalty_Type: string;
    Default_Due_Date: string;
    First_Due_Date: string;
    Due_Date: Date | string;
    Scheduled_Frequency: string;
    Proof_Of_Compliance_Mandatory: boolean;
    Owner_Name: string;
    Owner_User_Name: string;
    Approver_Name: string;
    Approver_User_Name: string;
    Reminder: string;
    Effective_Date_Of_Change: string;
    Reason_To_Edit: string;
    Edited_On: string;
    Edited_By: string;
    Compliance_Status: string;
    Compliance_Status_2: string;
    Status: string;
    Remark: string;
  }
  
  export const dummyData: ComplianceData[] = [
    {
        Compliance_Instance_ID: 1001,
        Compliance_ID: 3236,
        IHRC_Company_Name: "CEAT",
        Location: "HMVL - Office - Muzaffarpur - sadtpur - HR/ Muzaffarpur/ Bihar/ Office",
        Legislation: "Bihar Shops and Establishments Act 1953 and Bihar Shops Establishments Rules 1955/ Bihar/ IR",
        Compliance_Categorization: "Licensing",
        Compliance_Header: "Renewal of Registration",
        Compliance_Description: "Annual renewal of shop and establishment license",
        Penalty_Description: "Fines up to ₹5000 and potential closure",
        Compliance_Applicability: "All shops and commercial establishments",
        Bare_Act_Text: "Make an application when registration certificate is lost or destroyed to the Inspecting Officer within seven days of such loss or destruction for a duplicate copy along with a payment of a fee of two rupees either by crossed Indian Postal Order or by d",
        Compliance_Clause: "Section 15",
        Compliance_Type: "Renewal",
        Compliance_Frequency: "Annual",
        Compliance_Statutory_Authority: "Maharashtra Labor Department",
        Approval_Required: true,
        Criticality: "Low",
        Penalty_Type: "Monetary and Operational",
        Default_Due_Date: "December 31",
        First_Due_Date: "2023-12-31",
        Due_Date: new Date("2024-12-31"),
        Scheduled_Frequency: "Yearly",
        Proof_Of_Compliance_Mandatory: true,
        Owner_Name: "Rahul Sharma",
        Owner_User_Name: "rahul.sharma@ceat.com",
        Approver_Name: "Priya Patel",
        Approver_User_Name: "priya.patel@ceat.com",
        Reminder: "30 days before due date",
        Effective_Date_Of_Change: "2023-01-01",
        Reason_To_Edit: "Updated due to change in company policy",
        Edited_On: "2023-06-15",
        Edited_By: "Admin User",
        Compliance_Status: 'NA',
        Compliance_Status_2: '',
        Status: 'Pending',
        Remark: 'Missing Information in uploaded Document'
      },
      {
        Compliance_Instance_ID: 1002,
        Compliance_ID: 4501,
        IHRC_Company_Name: "TechInnovate",
        Location: "HMVL - Office - Arrah - Ramana Pakri Road - HR/ Arrah/ Bihar/ Office",
        Legislation: "Delhi Factories Act 1948 and Delhi Factories Rules 1950/ Delhi/ IR",
        Compliance_Categorization: "Labor Law",
        Compliance_Header: "Employee Work Hours Record",
        Compliance_Description: "Maintenance of employee work hours record",
        Penalty_Description: "Fines up to ₹10000 for non-compliance",
        Compliance_Applicability: "All IT companies with more than 10 employees",
        Bare_Act_Text: "Employer shall maintain a record of employee work hours",
        Compliance_Clause: "Section 28",
        Compliance_Type: "Record Keeping",
        Compliance_Frequency: "Daily",
        Compliance_Statutory_Authority: "Karnataka Labor Department",
        Approval_Required: false,
        Criticality: "Medium",
        Penalty_Type: "Monetary",
        Default_Due_Date: "Ongoing",
        First_Due_Date: "2023-01-01",
        Due_Date: "",
        Scheduled_Frequency: "Daily",
        Proof_Of_Compliance_Mandatory: true,
        Owner_Name: "Arun Kumar",
        Owner_User_Name: "arun.kumar@techinnovate.com",
        Approver_Name: "Sneha Reddy",
        Approver_User_Name: "sneha.reddy@techinnovate.com",
        Reminder: "Weekly",
        Effective_Date_Of_Change: "2023-03-15",
        Reason_To_Edit: "Updated due to amendment in labor laws",
        Edited_On: "2023-03-20",
        Edited_By: "HR Manager",
        Compliance_Status: 'NA',
        Compliance_Status_2: '',
        Status: 'Pending',
        Remark: 'Missing Information in uploaded Document'
      },
      {
        Compliance_Instance_ID: 1003,
        Compliance_ID: 5602,
        IHRC_Company_Name: "GreenEnergy",
        Location: "HMVL - Office - Aurangabad - Priyavrat Path - HR/ Aurangabad/ Bihar/ Office",
        Legislation: "Karnataka Shops and Commercial Establishments Act 1961 and Karnataka Shops Rules 1963/ Karnataka/ IR",
        Compliance_Categorization: "Environmental",
        Compliance_Header: "Emission Control Report",
        Compliance_Description: "Submission of monthly emission control report",
        Penalty_Description: "Fines up to ₹100000 and potential closure",
        Compliance_Applicability: "All manufacturing units",
        Bare_Act_Text: "Every industry shall submit monthly emission reports",
        Compliance_Clause: "Section 21",
        Compliance_Type: "Reporting",
        Compliance_Frequency: "Monthly",
        Compliance_Statutory_Authority: "Tamil Nadu Pollution Control Board",
        Approval_Required: true,
        Criticality: "High",
        Penalty_Type: "Monetary and Operational",
        Default_Due_Date: "5th of every month",
        First_Due_Date: "2023-02-05",
        Due_Date: new Date("2024-09-05"),
        Scheduled_Frequency: "Monthly",
        Proof_Of_Compliance_Mandatory: true,
        Owner_Name: "Karthik Subramanian",
        Owner_User_Name: "karthik.s@greenenergy.com",
        Approver_Name: "Lakshmi Narayan",
        Approver_User_Name: "lakshmi.n@greenenergy.com",
        Reminder: "5 days before due date",
        Effective_Date_Of_Change: "2023-01-01",
        Reason_To_Edit: "Updated due to new environmental regulations",
        Edited_On: "2023-01-10",
        Edited_By: "Environmental Officer",
        Compliance_Status: 'NA',
        Compliance_Status_2: '',
        Status: 'Pending',
        Remark: 'Missing Information in uploaded Document'
      },
      {
        Compliance_Instance_ID: 1004,
        Compliance_ID: 6789,
        IHRC_Company_Name: "MegaRetail",
        Location: "HMVL - Office - Begusarai - Kachhari Road - HR/ Begusarai/ Bihar/ Office",
        Legislation: "Maharashtra Shops and Establishments Act 1948 and Maharashtra Shops Rules 1954/ Maharashtra/ IR",
        Compliance_Categorization: "Labor Law",
        Compliance_Header: "Weekly Off Day",
        Compliance_Description: "Ensuring weekly off day for employees",
        Penalty_Description: "Fines up to ₹20000",
        Compliance_Applicability: "All retail establishments",
        Bare_Act_Text: "Every employee shall be given at least one day off in a week",
        Compliance_Clause: "Section 14",
        Compliance_Type: "Operational",
        Compliance_Frequency: "Weekly",
        Compliance_Statutory_Authority: "Delhi Labor Department",
        Approval_Required: false,
        Criticality: "Medium",
        Penalty_Type: "Monetary",
        Default_Due_Date: "Ongoing",
        First_Due_Date: "2023-01-01",
        Due_Date: "",
        Scheduled_Frequency: "Weekly",
        Proof_Of_Compliance_Mandatory: true,
        Owner_Name: "Amit Gupta",
        Owner_User_Name: "amit.gupta@megaretail.com",
        Approver_Name: "Neha Singh",
        Approver_User_Name: "neha.singh@megaretail.com",
        Reminder: "Start of each week",
        Effective_Date_Of_Change: "2023-04-01",
        Reason_To_Edit: "Updated due to change in store timings",
        Edited_On: "2023-04-05",
        Edited_By: "Store Manager",
        Compliance_Status: 'NA',
        Compliance_Status_2: '',
        Status: 'Pending',
        Remark: 'Missing Information in uploaded Document'
      },
      
  ];