
import { db } from "@/lib/db"
export const getClinicalAreas = async () => {
    try {
        const areas = await db.area.findMany({
            orderBy: { name: "asc" }
        });

        return areas
    } catch (error) {
        console.error("Error fetching clinical instructors:", error);
        throw error; 
    }
}