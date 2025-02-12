export class AddTravelHistoryDto {
  applied_for_stay_permission: boolean;
  need_visa_for_specific_countries: string[];
}

export class AddVisaHealthInfoDto {
  visa_rejections: boolean;
  health_issue: boolean;
  health_issue_details: string;
}
