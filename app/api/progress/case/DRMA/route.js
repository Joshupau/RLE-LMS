import { getCurrentSchoolYear } from "@/actions/get-current-school-year";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req, res){
    try {
        const body = await req.json();
        const  {
            scheduleId,
            caseType,
            caseNumber,
            level,
            patientName,
            age,
            medicalDiagnosis,
            dateOfDelivery,
            timeOfDelivery,
            typeOfDelivery,
            birthplace,
            date,
            userId,
          } = body

          if(!userId || !scheduleId|| !caseType|| !caseNumber|| !level||!patientName|| !age|| !medicalDiagnosis|| !dateOfDelivery|| !timeOfDelivery||!typeOfDelivery|| !birthplace || !date){
            return NextResponse.json({ error: "Missing Fields" }, { status: 400 }); 
          }

          const schoolyear = await getCurrentSchoolYear();

          const CommonInfo = await db.submissionOfPatientCases.create({
            data: {
                schedulingId: scheduleId,
                caseNumber: caseNumber,
                caseType: caseType,
                level: level,
                date: date,
                userId: userId,
                schoolyearId: schoolyear.id,
            }
          });

          const dateParts = dateOfDelivery.split('T')[0];
          const combinedString = `${dateParts}T${timeOfDelivery}:00.000Z`; 
          
          const datetime = new Date(combinedString);
          const MedicalInfo = await db.drMACase.create({
            data:{
                patientName: patientName,
                age: age,
                medicalDiagnosis: medicalDiagnosis,
                dateOfDelivery: dateOfDelivery,
                timeOfDelivery: datetime,
                typeOfDelivery: typeOfDelivery,
                birthplace: birthplace,
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
      
          const ClinicalInstructorId = await db.scheduling.findUnique({
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
          
          const userName = await db.user.findUnique({
            where: { id: userId },
            select: { firstName: true, lastName: true }
          });
          
          const notification = await db.notification.create({
            data: {
              title: "Case Submission Notification",
              message: `${caseType} case submitted by ${userName.firstName} ${userName.lastName}`,
              recipientId: recipientId, 
              type: "general", 
              link: `/progress/ci`,
              expiresAt: new Date(Date.now() + (14 * 24 * 60 * 60 * 1000)), 
            },
          });

      
          return NextResponse.json(responseData, notification);
    } catch (error) {
        console.error("[DRCordCare_Case]", error)
        return NextResponse.json({ status: 500 }, "Internal server error");

    }
}