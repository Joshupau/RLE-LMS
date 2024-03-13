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
            medicalDiagnosis,
            dateOfDelivery,
            timeOfDelivery,
            typeOfDelivery,
            birthplace,
            date,
          } = body

          if(!scheduleId|| !caseType|| !caseNumber|| !level||!patientName|| !age|| !medicalDiagnosis|| !dateOfDelivery|| !timeOfDelivery||!typeOfDelivery|| !birthplace || !date){
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

          const dateParts = dateOfDelivery.split('T')[0];
          const combinedString = `${dateParts}T${timeOfDelivery}:00.000Z`; 
          
          const datetime = new Date(combinedString);
          const MedicalInfo = await prisma.drMACase.create({
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
      
          return NextResponse.json(responseData);

    } catch (error) {
        console.error("[DRCordCare_Case]", error)
        return NextResponse.json({ status: 500 }, "Internal server error");

    }
}