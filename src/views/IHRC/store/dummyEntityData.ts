import Location from '../components/Entity/Location/Location';
export interface EntityData {
    Company_Group_Name?:string,
    Company_Name?:string,
    State?:string,
    Location?:string,
    Branch?:string,
    PF_Setup?: string,
    District?:string
    BranchAddress: string,
    BranchOpeningDate: string;
}
export interface LocationData{
    Location?:string,
}
export const LocationData : LocationData[]=[
    {Location:'Mumbai'},
    {Location:'Delhi'},
]
export const entityDataSet: EntityData[] = [
    {
        Company_Group_Name: "IND MONEY",
        Company_Name: "India shelter Pvt Ltd",
        State: "Haryana",
        Location: "Gurgaon",
        Branch: "Gurgaon",
        BranchAddress: 'Shop No. 67B & 68, Second Floor, P. no. 277 (East), Tagore Nagar, Next to DCM, Ajmer Road, Jaipur- 302021',
        BranchOpeningDate: "6-May-2010",
        PF_Setup: "Yes",
        District: "Ambala"
    },
    {
        Company_Group_Name: "Tata Group",
        Company_Name: "Tata Consultancy Services",
        State: "Maharashtra",
        Location: "Mumbai",
        Branch: "Andheri East",
        BranchAddress: 'Shop No. F-1,2 1st Floor , Prem Bhawan, Gandhi Nagar, Behind LIC HFL, Opp.Vodafone Store,Bhilwara - 311001',
        BranchOpeningDate: "1-Feb-2012",
        PF_Setup: "Yes",
        District: "Amravati"
    },
    {
        Company_Group_Name: "Reliance Industries",
        Company_Name: "Reliance Jio Infocomm",
        State: "Maharashtra",
        Location: "Navi Mumbai",
        Branch: "Ghansoli",
        BranchAddress: 'Plot No. A-94,95,  1st Floor , Aakhiliya Vikash Yojana, Shiv Gauri Plaza Jodhpur - 342001',
        BranchOpeningDate: "8-May-2008",
        PF_Setup: "Yes",
        District: "Aurangabad"
    },
    {
        Company_Group_Name: "Infosys",
        Company_Name: "Infosys Technologies",
        State: "Karnataka",
        Location: "Bengaluru",
        BranchAddress: 'Marwad House, 2nd Floor, Jaipur Road, Suchana Kendra Chouraha,Ajmer - 305001',
        BranchOpeningDate: "10-Jun-2015",
        Branch: "Electronic City",
        PF_Setup: "Yes",
        District: "Bengaluru Urban"
    },
    {
        Company_Group_Name: "Wipro",
        Company_Name: "Wipro Limited",
        State: "Karnataka",
        Location: "Mysore",
        BranchAddress: 'Shop No. 3 & 4, Ground Floor, Yadav Complex, Near Rastra Unnati School No. 04, Rani Bazar, Bikaner - 334001',
        BranchOpeningDate: "6-May-2019",
        Branch: "Sarjapur",
        PF_Setup: "Yes",
        District: "Bengaluru Urban"
    },
    {
        Company_Group_Name: "HCL Technologies",
        Company_Name: "HCL Technologies Ltd",
        State: "Uttar Pradesh",
        Location: "Noida",
        BranchAddress: 'PLOT NO: 226-227, FIRST FLOOR, PU-4, SCHEME NO 54, BRAJ LAKSHMI, LANDMARK- BEHIND HOTEL SURE STAY , RASOMA SQUARE, INDORE-450021, MADHYA PRADESH.',
        Branch: "Sector 126",
        BranchOpeningDate: "6-Aug-2010",
        PF_Setup: "Yes",
        District: "Amethi"
    },
    {
        Company_Group_Name: "Tech Mahindra",
        Company_Name: "Tech Mahindra Ltd",
        State: "Maharashtra",
        Location: "Pune",
        BranchAddress: 'Shri Ram Complex, 123-A, Ground Floor, Kalani Bagh, A.B. Road, Dewas - 455001',
        Branch: "Hinjewadi",
        BranchOpeningDate: "16-Jan-2005",
        PF_Setup: "Yes",
        District: "Akola"
    },
    {
        Company_Group_Name: "Larsen & Toubro",
        Company_Name: "L&T Infotech",
        State: "Maharashtra",
        Location: "Nagpur",
        BranchAddress: 'Above Canara Bank, 3rd Floor,Opp.Dak Banglow, Near Bus Stand,Ajmer road,Madanganj, Kishangarh, Dist Ajmer -305801',
        Branch: "Powai",
        BranchOpeningDate: "26-Nov-2020",
        PF_Setup: "Yes",
        District: "Ahmednagar"
    },
    {
        Company_Group_Name: "Mindtree",
        Company_Name: "Mindtree Ltd",
        State: "Karnataka",
        BranchAddress: 'Plot No. 69, 3rd Floor, MP Nagar, Zone-1, Bhopal - 462011',
        Location: "Mangalore",
        Branch: "Whitefield",
        BranchOpeningDate: "6-May-2011",
        PF_Setup: "Yes",
        District: "Bengaluru Rural"
    },
    {
        Company_Group_Name: "Cognizant",
        Company_Name: "Cognizant Technology Solutions",
        State: "Tamil Nadu",
        Location: "Chennai",
        Branch: "Thoraipakkam",
        BranchAddress: '1st Floor, 10-D, Panjawani Complex, Opposite Multipurpose School, Gumanpura, Kota-324007, Rajasthan',
        BranchOpeningDate: "25-Sep-2002",
        PF_Setup: "Yes",
        District: "Chennai"
    },
    {
        Company_Group_Name: "Capgemini",
        Company_Name: "Capgemini India",
        State: "Maharashtra",
        Location: "Nashik",
        Branch: "Airoli",
        BranchOpeningDate: "28-May-2016",
        BranchAddress: 'Khasara No.- 1539, Chak No. 2, Brham Vihar, Gautam Vihar, Main Sojat Road, Pali - 306401',
        PF_Setup: "Yes",
        District: "Thane"
    }
];

export interface UserData {
    FirstName?:string,
    LastName?:string,
    Email?:string,
    UserName?:string,
    MobileNum?:string,
    JobRole?: string,
    Dsc?:string,
    DscValidity?:string,
    Pan?:string,
    Aadhar?:string,
    DateOfJoin?:string,
    Company_Group_Name?:string,
}
export const userDataSet: UserData[] = [
    {
      FirstName: "Amit",
      LastName: "Sharma",
      Email: "amit@example.com",
      UserName: "amitsharma",
      MobileNum: "+919876543210",
      JobRole: "Manager",
      Dsc: "Active",
      DscValidity: "2025-12-31",
      Pan: "ABCDE1234F",
      Aadhar: "1234-5678-9123",
      DateOfJoin: "2021-01-15",
      Company_Group_Name: "IND MONEY",
    },
    {
      FirstName: "Krishna Kumar",
      LastName: "Singh",
      Email: "Krishna@example.com",
      UserName: "KrishnaKumar",
      MobileNum: "+919812345678",
      JobRole: "Director",
      Dsc: "Active",
      DscValidity: "2024-10-20",
      Pan: "FGHIJ5678K",
      Aadhar: "2345-6789-1234",
      DateOfJoin: "2019-07-10",
      Company_Group_Name: "Tata Group",
    },
    {
      FirstName: "Ajay",
      LastName: "Thakur",
      Email: "Ajay@example.com",
      UserName: "AjayThakur",
      MobileNum: "+918765432109",
      JobRole: "CFO",
      Dsc: "Expired",
      DscValidity: "2023-06-15",
      Pan: "KLMNO2345P",
      Aadhar: "3456-7890-2345",
      DateOfJoin: "2020-03-25",
      Company_Group_Name: "Reliance Industries",
    },
    {
      FirstName: "Sneha",
      LastName: "Reddy",
      Email: "sneha.reddy@example.com",
      UserName: "snehareddy",
      MobileNum: "+917654321098",
      JobRole: "HR Manager",
      Dsc: "Active",
      DscValidity: "2026-09-10",
      Pan: "PQRST3456R",
      Aadhar: "4567-8901-3456",
      DateOfJoin: "2018-11-05",
      Company_Group_Name: "Infosys",
    },
    {
      FirstName: "Vikram",
      LastName: "Mehta",
      Email: "vikram.mehta@example.com",
      UserName: "vikrammehta",
      MobileNum: "+919123456789",
      JobRole: "Business Analyst",
      Dsc: "Active",
      DscValidity: "2024-02-28",
      Pan: "UVWXY6789S",
      Aadhar: "5678-9012-4567",
      DateOfJoin: "2022-08-19",
      Company_Group_Name: "Larsen & Toubro",
    }
  ];
  