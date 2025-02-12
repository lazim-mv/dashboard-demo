-- CreateEnum
CREATE TYPE "ParentUserRole" AS ENUM ('SUPER_ADMIN', 'PARTNER_ADMIN');

-- CreateEnum
CREATE TYPE "PermissionType" AS ENUM ('NORMAL', 'SCREEN');

-- CreateEnum
CREATE TYPE "PermissionResource" AS ENUM ('DASHBOARD', 'STUDENTS', 'COURSE_SEARCH', 'NOTIFICATION', 'ADMINISTRATION', 'UNIVERSITIES', 'PARTNERS', 'LOCK');

-- CreateEnum
CREATE TYPE "PermissionAction" AS ENUM ('READ', 'WRITE', 'UPDATE', 'DELETE');

-- CreateEnum
CREATE TYPE "ScreenResource" AS ENUM ('DASHBOARD', 'STUDENTS', 'COURSES', 'COURSE_SEARCH', 'COURSE_LIST', 'NOTIFICATION', 'ADMINISTRATION', 'USERS', 'ROLES', 'UNIVERSITIES', 'PARTNERS');

-- CreateEnum
CREATE TYPE "PartnerStatus" AS ENUM ('CREATED', 'PENDING', 'RESUBMISSION', 'ACTIVE', 'BLOCKED');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW_LEAD', 'CONTACTED', 'CONVERTED', 'LOST', 'BLOCKED');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "StudentStatus" AS ENUM ('INITIATED', 'SUBMISSION_COMPLETED', 'INTERVIEW_COMPLETED', 'OFFER_LETTER_GRANTED', 'VFS_COMPLETED', 'VISA_GRANTED');

-- CreateEnum
CREATE TYPE "StudentTabStatus" AS ENUM ('PERSONAL_DETAILS', 'EDUCATION', 'TRAVEL_IMMIGRATION', 'REFEREE_DETAILS', 'WORK_DETAILS', 'DOCUMENTS', 'SHORT_LIST_APPLY', 'APPLICATIONS', 'MESSAGE');

-- CreateEnum
CREATE TYPE "LevelOfStudy" AS ENUM ('HIGHER_SECONDARY', 'UNDERGRADUATE', 'GRADUATE', 'DOCTORAL');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('ONGOING');

-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "level" VARCHAR(50) NOT NULL,
    "intake" TEXT[],
    "subject" VARCHAR(100) NOT NULL,
    "duration" VARCHAR(50) NOT NULL,
    "awards" TEXT[],
    "document_url" TEXT,
    "tution_fee" TEXT NOT NULL,
    "requirements" TEXT[],
    "university_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "parent_role" "ParentUserRole" NOT NULL,
    "partner_id" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "partner_id" INTEGER NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "user_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("user_id","role_id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" SERIAL NOT NULL,
    "type" "PermissionType" NOT NULL DEFAULT 'NORMAL',
    "resource" "PermissionResource" NOT NULL,
    "actions" "PermissionAction"[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Screen" (
    "id" SERIAL NOT NULL,
    "resource" "ScreenResource" NOT NULL,
    "display_name" TEXT NOT NULL,
    "route" TEXT NOT NULL,
    "actions" "PermissionAction"[],
    "parent_screen_id" INTEGER,

    CONSTRAINT "Screen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Partner" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mobile_no" TEXT NOT NULL,
    "status" "PartnerStatus" NOT NULL DEFAULT 'CREATED',
    "whatsapp_no" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "post_code" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "can_upload_docs" BOOLEAN NOT NULL DEFAULT true,
    "resubmit_note" TEXT,
    "pan_card_url" TEXT,
    "cancelled_cheque_url" TEXT,
    "gst_spice_letter_url" TEXT,

    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" SERIAL NOT NULL,
    "url_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone_no" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "lead_status" "LeadStatus" NOT NULL DEFAULT 'NEW_LEAD',
    "source_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadSource" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "LeadSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerStatusHistory" (
    "id" SERIAL NOT NULL,
    "status" "LeadStatus" NOT NULL,
    "partner_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PartnerStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_no" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL,
    "nationality" TEXT NOT NULL,
    "birth_country" TEXT NOT NULL,
    "native_language" TEXT,
    "passport_issue_location" TEXT NOT NULL,
    "passport_number" TEXT NOT NULL,
    "issue_date" TIMESTAMP(3) NOT NULL,
    "expiry_date" TIMESTAMP(3) NOT NULL,
    "skype_id" TEXT,
    "alternate_phone_no" TEXT,
    "is_permanent_current_same" BOOLEAN,
    "permanent_address_id" INTEGER,
    "current_address_id" INTEGER,
    "emergency_contact_name" TEXT,
    "emergency_contact_no" TEXT,
    "emergency_contact_email" TEXT,
    "emergency_contact_relation" TEXT,
    "emergency_contact_address" TEXT,
    "status" "StudentStatus" NOT NULL DEFAULT 'INITIATED',
    "tab_status" "StudentTabStatus",
    "partner_id" INTEGER NOT NULL,
    "comment" TEXT,
    "referee_details_comments" TEXT,
    "work_details_comments" TEXT,
    "shortlist_comment" TEXT,
    "application_comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "country" TEXT NOT NULL,
    "address1" TEXT NOT NULL,
    "address2" TEXT NOT NULL,
    "post_code" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentEducation" (
    "id" SERIAL NOT NULL,
    "academic_interest_id" INTEGER,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentEducation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcademicHistory" (
    "id" SERIAL NOT NULL,
    "country" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "course" TEXT NOT NULL,
    "level_of_study" "LevelOfStudy" NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "result_percent" DOUBLE PRECISION NOT NULL,
    "student_education_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AcademicHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcademicInterest" (
    "id" SERIAL NOT NULL,
    "country" TEXT NOT NULL,
    "level_of_study" "LevelOfStudy" NOT NULL,
    "programme" TEXT NOT NULL,
    "intake" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AcademicInterest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Language" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "level_of_proficiencey" TEXT NOT NULL,
    "years_of_experience" INTEGER NOT NULL,
    "student_education_id" INTEGER NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TravelImmigration" (
    "id" SERIAL NOT NULL,
    "stay_permission_in_specific_countries" BOOLEAN,
    "need_visa_for_specific_countries" TEXT[],
    "visa_rejections_for_any_countries" BOOLEAN,
    "has_health_issues" BOOLEAN,
    "health_issue_details" TEXT,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TravelImmigration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefereeDetails" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mobile_no" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "student_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RefereeDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkDetails" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "organisation" TEXT NOT NULL,
    "organisation_address" TEXT NOT NULL,
    "phone_no" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "from_date" TIMESTAMP(3) NOT NULL,
    "to_date" TIMESTAMP(3) NOT NULL,
    "student_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentDocuments" (
    "id" SERIAL NOT NULL,
    "photo" TEXT,
    "passport" TEXT,
    "pg" TEXT,
    "pg_marksheet" TEXT,
    "ug" TEXT,
    "ug_marksheet" TEXT,
    "higher_sec" TEXT,
    "tenth" TEXT,
    "lor" TEXT,
    "moi" TEXT,
    "cv" TEXT,
    "exp_cert" TEXT,
    "sop" TEXT,
    "other_diploma_cert" TEXT,
    "others" TEXT,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentDocuments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VFSDocuments" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "student_id" INTEGER NOT NULL,

    CONSTRAINT "VFSDocuments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseShortlist" (
    "id" SERIAL NOT NULL,
    "course_id" INTEGER NOT NULL,
    "intake" TEXT NOT NULL,
    "student_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseShortlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" SERIAL NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'ONGOING',
    "name" VARCHAR(255) NOT NULL,
    "level" VARCHAR(50) NOT NULL,
    "intake" TEXT NOT NULL,
    "subject" VARCHAR(100) NOT NULL,
    "duration" VARCHAR(50) NOT NULL,
    "awards" TEXT[],
    "tution_fee" DOUBLE PRECISION NOT NULL,
    "requirements" TEXT[],
    "course_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "universities" (
    "id" SERIAL NOT NULL,
    "university_name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "document_url" TEXT,
    "logo_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "universities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RoleToScreen" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE INDEX "Course_university_id_idx" ON "Course"("university_id");

-- CreateIndex
CREATE INDEX "Course_name_university_id_idx" ON "Course"("name", "university_id");

-- CreateIndex
CREATE UNIQUE INDEX "Course_name_university_id_key" ON "Course"("name", "university_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_partner_id_key" ON "Role"("name", "partner_id");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_user_id_key" ON "RefreshToken"("token", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Partner_email_key" ON "Partner"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Partner_mobile_no_key" ON "Partner"("mobile_no");

-- CreateIndex
CREATE UNIQUE INDEX "Partner_company_name_key" ON "Partner"("company_name");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_url_id_key" ON "Lead"("url_id");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_phone_no_key" ON "Lead"("phone_no");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_email_key" ON "Lead"("email");

-- CreateIndex
CREATE UNIQUE INDEX "LeadSource_name_key" ON "LeadSource"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CourseShortlist_student_id_course_id_key" ON "CourseShortlist"("student_id", "course_id");

-- CreateIndex
CREATE UNIQUE INDEX "_RoleToScreen_AB_unique" ON "_RoleToScreen"("A", "B");

-- CreateIndex
CREATE INDEX "_RoleToScreen_B_index" ON "_RoleToScreen"("B");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_university_id_fkey" FOREIGN KEY ("university_id") REFERENCES "universities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "Partner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "Partner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Screen" ADD CONSTRAINT "Screen_parent_screen_id_fkey" FOREIGN KEY ("parent_screen_id") REFERENCES "Screen"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partner" ADD CONSTRAINT "Partner_id_fkey" FOREIGN KEY ("id") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "LeadSource"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerStatusHistory" ADD CONSTRAINT "PartnerStatusHistory_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "Partner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_permanent_address_id_fkey" FOREIGN KEY ("permanent_address_id") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_current_address_id_fkey" FOREIGN KEY ("current_address_id") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "Partner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentEducation" ADD CONSTRAINT "StudentEducation_id_fkey" FOREIGN KEY ("id") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentEducation" ADD CONSTRAINT "StudentEducation_academic_interest_id_fkey" FOREIGN KEY ("academic_interest_id") REFERENCES "AcademicInterest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicHistory" ADD CONSTRAINT "AcademicHistory_student_education_id_fkey" FOREIGN KEY ("student_education_id") REFERENCES "StudentEducation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Language" ADD CONSTRAINT "Language_student_education_id_fkey" FOREIGN KEY ("student_education_id") REFERENCES "StudentEducation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TravelImmigration" ADD CONSTRAINT "TravelImmigration_id_fkey" FOREIGN KEY ("id") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefereeDetails" ADD CONSTRAINT "RefereeDetails_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkDetails" ADD CONSTRAINT "WorkDetails_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentDocuments" ADD CONSTRAINT "StudentDocuments_id_fkey" FOREIGN KEY ("id") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VFSDocuments" ADD CONSTRAINT "VFSDocuments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseShortlist" ADD CONSTRAINT "CourseShortlist_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseShortlist" ADD CONSTRAINT "CourseShortlist_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleToScreen" ADD CONSTRAINT "_RoleToScreen_A_fkey" FOREIGN KEY ("A") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleToScreen" ADD CONSTRAINT "_RoleToScreen_B_fkey" FOREIGN KEY ("B") REFERENCES "Screen"("id") ON DELETE CASCADE ON UPDATE CASCADE;
