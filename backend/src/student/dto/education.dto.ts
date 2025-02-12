export enum LevelOfStudyEnum {
  HIGHER_SECONDARY = 'HIGHER_SECONDARY',
  UNDERGRADUATE = 'UNDERGRADUATE',
  GRADUATE = 'GRADUATE',
  DOCTORAL = 'DOCTORAL',
}

export class AcademicHistory {
  country: string;
  institution: string;
  course: string;
  level_of_study: LevelOfStudyEnum;
  start_date: Date;
  end_date: Date;
  result_percent: number;
}

export class AddCompletedEducationDto {
  data: AcademicHistory[];
}

export class AddAcademicInterestDto {
  country: string;
  level_of_study: LevelOfStudyEnum;
  programme: string;
  intake: string;
  location: string;
}

export class Language {
  name: string;
  level_of_proficiencey: string;
  years_of_experience: number;
}

export class AddLanguagesDto {
  languages: Language[];
}
