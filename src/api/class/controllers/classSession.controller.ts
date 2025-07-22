import { Request, Response } from 'express';
import ClassSchedule ,{ColumnRowByDay}  from '../model/classSchedule.model';
import ClassSession  from '../model/classSession.model';
import { parseISO, isBefore, addDays, format } from 'date-fns';
import { faIR } from 'date-fns/locale';
import moment from 'moment-jalaali';

const normalizeDay = (day: string) =>
        day.replace(/\s/g, '').replace('ی', 'ي').trim();

const dayMap: { [key: string]: number } = {
  'شنبه': 6,
  'یکشنبه': 0,
  'دوشنبه': 1,
  'سه‌شنبه': 2,
  'چهارشنبه': 3,
  'پنجشنبه': 4,
  'جمعه': 5
};

export const generateSessions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { scheduleId, startDate, endDate } = req.body;

    const schedule = await ClassSchedule.findById(scheduleId);
    if (!schedule) {
      res.status(404).json({ success: false, message: 'برنامه کلاس پیدا نشد' });
      return;
    }

    const { days, startTime, endTime } = schedule;
    const sessions = [];

    let current = moment(startDate, 'YYYY-MM-DD');
    const end = moment(endDate, 'YYYY-MM-DD');

    while (current.isSameOrBefore(end)) {
      const dayName = current.format('dddd'); // مثل: "Sunday"

      const persianDay = moment(current).locale('fa').format('dddd');
      
      if (days.some((d: ColumnRowByDay) => normalizeDay(d.day) === normalizeDay(persianDay))) {
        const session = await ClassSession.create({
          scheduleId: schedule._id,
          date: current.format('YYYY-MM-DD'),
          startTime,
          endTime,
          registeredUsers: [],
        });
        sessions.push(session);
      }
      current = current.add(1, 'day');
    }

    res.status(201).json({
      success: true,
      message: `${sessions.length} جلسه ایجاد شد`,
      data: sessions
    });
  } catch (error) {
    console.error('Error generating sessions:', error);
    res.status(500).json({ success: false, message: 'خطای سرور در ساخت جلسات' });
  }
};