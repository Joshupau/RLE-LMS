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
            date,
            sex,
            nameOfFamilyMembers,
            relationToHead,
            birthday,
            maritalStatus,
            educationalAttainment,
            occupation,
            userId,
          } = body

          if(!userId || !scheduleId|| !caseType|| !caseNumber|| !date ||!level||!nameOfFamilyMembers|| !relationToHead|| !birthday|| !sex|| !maritalStatus||!educationalAttainment|| !occupation){
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

          const MedicalInfo = await prisma.cHNCase.create({
            data:{
                sex: sex,
                nameOfFamilyMembers: nameOfFamilyMembers,
                relationToHead: relationToHead,
                birthday: birthday,
                maritalStatus: maritalStatus,
                educationalAttainment: educationalAttainment,
                occupation: occupation,
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