import ClassSession from '../model/classSession.model';
import ClassSchedule from '../model/classSchedule.model';

//check capacity
export const checkCapacityForSessions = async (sessionIds: string[]): Promise<{ ok: boolean; fullSessions: string[] }> => {
    const  sessions = await ClassSession.find({_id: {$in: sessionIds}})
        .populate({ path: 'scheduleId', model: ClassSchedule });
    const fullSessions: string[] =[];
    for (const session of sessions){
        // Type assertion to access capacity property
        const sessionCapacity = (session.scheduleId as typeof ClassSchedule.prototype).capacity;
        const registeredCount = session.registeredUsers.length;
        
        if (registeredCount >= sessionCapacity) {
      fullSessions.push(String(session._id)); }
    }
     return {
    ok: fullSessions.length === 0,
    fullSessions,
  };
};