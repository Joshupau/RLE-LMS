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
            sex,
            medicalDiagnosis,
            operation,
            surgeon,
            typeOfAnesthesia,
            anesthesiologist,
            scrub,
            date,
            userId,
          } = body

          if(!userId || !scheduleId|| !caseType|| !caseNumber|| !date ||!level||!patientName|| !age|| !medicalDiagnosis|| !sex|| !operation||!surgeon|| !typeOfAnesthesia || !anesthesiologist || !scrub){
            return NextResponse.json({ error: "Missing Fields" }, { status: 400 }); 
          }

          const CommonInfo = await prisma.submissionOfPatientCases.create({
            data: {
                schedulingId: scheduleId,
                caseNumber: caseNumber,
                caseType: caseType,
                level: level,
                date: date,
                userId: userId,
            }
          });

          const MedicalInfo = await prisma.oRMajorMinorCase.create({
            data:{
                patientName: patientName,
                age: age,
                sex: sex,
                medicalDiagnosis: medicalDiagnosis,
                operation: operation,
                surgeon: surgeon,
                typeOfAnesthesia: typeOfAnesthesia,
                anesthesiologist: anesthesiologist,
                scrub: scrub,
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
        console.error("[ORMajorMinor_Case]", error)
        return NextResponse.json({ status: 500 }, "Internal server error");

    }
}