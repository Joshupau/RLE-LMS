
import { AuditAction } from "@prisma/client";

export const generateLogMessage = (log) => {
    const { Action, Title} = log;


    switch(Action){
        case AuditAction.CREATE:
            return `Created ${Title}` + " "
        case AuditAction.UPDATE:
            return `Updated ${Title}` + " "
        case AuditAction.DELETE:
            return `Deleted ${Title}` + " "
        default:
            return `Unknown Action ${Title}`           
    }
}