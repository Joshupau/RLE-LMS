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
            babyName,
            sex,
            apgarScore,
            motherName,
            motherAge,
            staff,
            birthplace,
            date,
          } = body

          if(!scheduleId|| !caseType|| !caseNumber|| !level|| 
            !babyName||
            !sex||
            !apgarScore||
            !motherName||
            !motherAge||
            !staff||
            !birthplace|| !sex||!date){
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

          const MedicalInfo = await prisma.drCordCase.create({
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
      
          return NextResponse.json(responseData);

    } catch (error) {
        console.error("[DRCordCare_Case]", error)
        return NextResponse.json({ status: 500 }, "Internal server error");

    }
}