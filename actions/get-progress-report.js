const { PrismaClient, UserRole } = require("@prisma/client");


const prisma = new PrismaClient();

const caseTypes = [
    "Medical",
    "Pediatrics",
    "Communicable Diseases",
    "Obstetrics",
    "Surgical",
    "Medical Surgical Intensive",
    "Orthopedics",
    "Gynecology",
    "EENT",
    "Nursery",
    "Psychiatric",
    "OR Major",
    "OR Minor",
    "DR Manage",
    "DR Assist",
    "DR Cord Care",
    "CHN",
  ];

  const goals = {
    "2": {
        "Pediatrics": 15,
        "Communicable Diseases": 10,
        "Obstetrics": 15,
        "Gynecology": 10,
        "Nursery": 3,
        "DR Manage": 5,
        "DR Assist": 5,
        "DR Cord Care": 5,
        "CHN": 15,
        "Total": 83,
    },
    "3": {
        "Medical": 10,
        "Communicable Diseases": 10,
        "Surgical": 15,
        "Orthopedics": 5,
        "EENT": 5,
        "Psychiatric": 5,
        "OR Major": 5,
        "OR Minor": 5,
        "CHN": 10,
        "Total": 69,
    },
    "4": {
        "Medical": 5,
        "Pediatrics": 5,
        "Communicable Diseases": 5,
        "Obstetrics": 5,
        "Surgical": 5,
        "Medical Surgical Intensive": 10,
        "Orthopedics": 5,
        "Gynecology": 3,
        "EENT": 5,
        "Nursery": 3,
        "Psychiatric": 5,
        "OR Major": 5,
        "OR Minor": 5,
        "DR Manage": 2,
        "DR Assist": 2,
        "DR Cord Care": 2,
        "CHN": 10,
        "Total": 81,
    },
    Total: {
        "Medical": 15,
        "Pediatrics": 20,
        "Communicable Diseases": 25,
        "Obstetrics": 20,
        "Surgical": 20,
        "Medical Surgical Intensive": 10,
        "Orthopedics": 10,
        "Gynecology": 13,
        "EENT": 10,
        "Nursery": 6,
        "Psychiatric": 10,
        "OR Major": 10,
        "OR Minor": 10,
        "DR Manage": 7,
        "DR Assist": 7,
        "DR Cord Care": 7,
        "CHN": 35,
        "Total": 233, 
    }
  }

export const getProgressReport = async () => {
    try {

        const students = await prisma.user.findMany({
            where: {
                role: UserRole.Student,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                yearLevel: true,
                group: true,
                submissionOfPatientCases: true,
            }
        });

        const generateProgressReport = (student) => {
            const progressReport = {};
            Object.keys(goals).forEach((yearLevel) => {
                progressReport[yearLevel] = {};
                Object.keys(goals[yearLevel]).forEach((caseType) => {
                    const submissions = student.submissionOfPatientCases.filter(
                        (submission) =>
                            submission.yearLevel === parseInt(yearLevel, 10) &&
                            submission.caseType === caseType
                    );
                    if (submissions.length === 0) {
                        progressReport[yearLevel][caseType] = "Pending";
                    } else if (submissions.length >= goals[yearLevel][caseType]) {
                        progressReport[yearLevel][caseType] = "Complete";
                    } else {
                        progressReport[yearLevel][caseType] = "Ongoing";
                    }
                });
            });
            return progressReport;
        };

        // Map over each student and generate their progress report
        const studentsWithProgressReport = students.map((student) => ({
            id: student.id,
            firstName: student.firstName,
            lastName: student.lastName,
            yearLevel: student.yearLevel,
            group: student.group,
            progressReport: generateProgressReport(student),
        }));

        console.log(studentsWithProgressReport);

        
    } catch (error) {
        console.error('Failed to get progress report', error);
        throw error
    }
}