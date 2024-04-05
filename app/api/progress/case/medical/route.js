import { getCurrentSchoolYear } from "@/actions/get-current-school-year";
import { PrismaClient, UserRole } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req, res){
    try {
        const body = await req.json();
        console.log(body);
        const  {
            scheduleId,
            caseType,
            caseNumber,
            level,
            patientName,
            age,
            maritalStatus,
            sex,
            attendingPhysician,
            medicalDiagnosis,
            dateAdmitted,
            dateDischarged,
            date,
            userId,
          } = body

          if(!userId|| !scheduleId|| !caseType|| !caseNumber|| !level|| !patientName|| !age|| !maritalStatus|| !sex|| !attendingPhysician|| !medicalDiagnosis|| !dateAdmitted|| !dateDischarged || !date){
            return NextResponse.json({ error: "Missing Fields" }, { status: 400 }); 
          }

          const schoolyear = await getCurrentSchoolYear();

          const CommonInfo = await prisma.submissionOfPatientCases.create({
            data: {
                schedulingId: scheduleId,
                caseNumber: caseNumber,
                caseType: caseType,
                level: level,
                date: date,
                userId: userId,
                schoolyear: schoolyear.id,
            }
          });

          const MedicalInfo = await prisma.medicalCase.create({
            data:{
                patientName: patientName,
                age: age,
                maritalStatus: maritalStatus,
                sex: sex,
                attendingPhysician: attendingPhysician,
                medicalDiagnosis: medicalDiagnosis,
                dateAdmitted: dateAdmitted,
                dateDischarge: dateDischarged,
                submissionOfPatientCases: {
                    connect:{
                        id:CommonInfo.id,
                    } 
                },
            }
          });
          const responseData = {
            medicalInfo: MedicalInfo,
            commonInfo: CommonInfo,
          };
      
          const ClinicalInstructorId = await prisma.scheduling.findUnique({
            where: {
              id: scheduleId,
            },
            select: {
              user: {
                where: {
                  role: UserRole.ClinicalInstructor,           
                },
                select: {
                  id: true,
                }
              }
            }
          });
          
          if (!ClinicalInstructorId || !ClinicalInstructorId.user || ClinicalInstructorId.user.length === 0) {
            console.error('Error: Clinical instructor not found.');
            return; 
          }
          
          const recipientId = ClinicalInstructorId.user[0].id;
          
          const userName = await prisma.user.findUnique({
            where: { id: userId },
            select: { firstName: true, lastName: true }
          });
          
          const notification = await prisma.notification.create({
            data: {
              title: "Case Submission Notification",
              message: `${caseType} case submitted by ${userName.firstName} ${userName.lastName}`,
              recipientId: recipientId, 
              type: "general", 
              link: `/progress`,
              expiresAt: new Date(Date.now() + (14 * 24 * 60 * 60 * 1000)), 
            },
          });

      
          return NextResponse.json(responseData, notification);

    } catch (error) {
        console.error("[MEDICAL_Case]", error)
        return NextResponse.json({ status: 500 }, "Internal server error");

    }
}