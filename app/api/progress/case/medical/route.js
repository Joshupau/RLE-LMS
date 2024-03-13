import { PrismaClient } from "@prisma/client";
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
          } = body

          if(!scheduleId|| !caseType|| !caseNumber|| !level|| !patientName|| !age|| !maritalStatus|| !sex|| !attendingPhysician|| !medicalDiagnosis|| !dateAdmitted|| !dateDischarged || !date){
            return NextResponse.json({ error: "Missing Fields" }, { status: 400 }); 
          }

          const CommonInfo = await prisma.submissionOfPatientCases.create({
            data: {
                schedulingId: scheduleId,
                caseNumber: caseNumber,
                caseType: caseType,
                level: level,
                date: date,
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
      
          return NextResponse.json(responseData);

    } catch (error) {
        console.error("[MEDICAL_Case]", error)
        return NextResponse.json({ status: 500 }, "Internal server error");

    }
}