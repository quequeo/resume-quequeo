export interface User {
  id: string;
  email: string;
}

export interface PersonalInformation {
  id?: number;
  content: string;
}

export interface WorkExperience {
  id?: number;
  content: string;
}

export interface Resume {
  id?: number;
  title: string;
  style: string;
  personal_information?: PersonalInformation;
  work_experience?: WorkExperience;
}
