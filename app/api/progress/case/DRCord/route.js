import { getCurrentSchoolYear } from "@/actions/get-current-school-year";
import { AuditAction, UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createAuditLog } from "@/lib/create-audit-log";

export async function POST(req, res){
    try {
        const body = await req.json();
        const  {
            scheduleId,
            caseType,
            caseNumber,
            level,
            babyName,
            sex,
            apgarScore,
            motherName,
            motherAge,
            staff,
            birthplace,
            date,
            userId,
          } = body

          if(!userId||!scheduleId|| !caseType|| !caseNumber|| !level|| 
            !babyName||
            !sex||
            !apgarScore||
            !motherName||
            !motherAge||
            !staff||
            !birthplace|| !sex||!date){
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

          const MedicalInfo = await db.drCordCase.create({
            data:{
                babyName: babyName,
                sex: sex,
                apgarScore: apgarScore,
                motherName: motherName,
                motherAge: motherAge,
                staff: staff,
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

          await createAuditLog({
            entityId: CommonInfo.id,
            Action: AuditAction.CREATE,
            Title: "New DR Cord Case.",
          });

      
          return NextResponse.json(responseData, notification);
    } catch (error) {
        console.error("[DRCordCare_Case]", error)
        return NextResponse.json({ status: 500 }, "Internal server error");

    }
}