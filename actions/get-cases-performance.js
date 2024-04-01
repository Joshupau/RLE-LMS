import { PrismaClient } from '@prisma/client';
import { format } from 'date-fns';

export const getCasePerformance = async () => {
  try {
    const prisma = new PrismaClient();

    const cases = await prisma.submissionOfPatientCases.findMany({
        include: {
            user: {
                select: {
                    group: true,
                }
            }
        }
    });
    const yearLevels = {};
    cases.forEach((caseItem) => {
      const { level, caseType, user } = caseItem;
      if (!yearLevels[level]) {
        yearLevels[level] = {};
      }
      if (!yearLevels[level][caseType]) {
        yearLevels[level][caseType] = [];
      }
      yearLevels[level][caseType].push(user.group);
    });
  
    // Calculate percentage of cases submitted by group A or B for each year level and case type
    const calculatePercentage = (groups) => {
      const groupACount = groups.filter((group) => group === 'A').length;
      const groupBCount = groups.filter((group) => group === 'B').length;
      const totalCount = groups.length;
      const percentageA = (groupACount / totalCount) * 100;
      const percentageB = (groupBCount / totalCount) * 100;
      return { percentageA, percentageB };
    };
  
    const yearLevelTables = {};
    // Calculate percentages for each year level and case type
    Object.keys(yearLevels).forEach((level) => {
      yearLevelTables[level] = {};
      Object.keys(yearLevels[level]).forEach((caseType) => {
        const percentages = calculatePercentage(yearLevels[level][caseType]);
        yearLevelTables[level][caseType] = percentages;
      });
    });

    const analyzeOverallGroupPerformance = (cases) => {
        const groupedData = cases.reduce((acc, curr) => {
            const { level, user, status, caseType } = curr;
            const { group } = user;
            if (!acc[group]) acc[group] = {};
            if (!acc[group][level]) acc[group][level] = { total: 0, studentCount: 0, completedCount: 0, caseTypes: {} };
            acc[group][level].total++;
            if (!acc[group][level].students) acc[group][level].students = new Set();
            acc[group][level].students.add(curr.userId);
            if (status) acc[group][level].completedCount++;
            if (!acc[group][level].caseTypes[caseType]) acc[group][level].caseTypes[caseType] = 0;
            acc[group][level].caseTypes[caseType]++;
            return acc;
        }, {});
    
        const yearLevels = ['1', '2', '3', '4'];
        const groups = ['A', 'B'];
    
        const barChartData = yearLevels.map(level => {
            const dataObj = { level };
            groups.forEach(group => {
                dataObj[`Group ${group}`] = (groupedData[group] && groupedData[group][level]) ? groupedData[group][level].total : 0;
            });
            return dataObj;
        });
        
    
        return { barChartData };
    };

    
    
    const { barChartData  } = analyzeOverallGroupPerformance(cases);
    
    return {barChartData, yearLevelTables}

  } catch (error) {
    console.error("Error fetching attendance and absences by month:", error);
    throw error; 
  }
};
