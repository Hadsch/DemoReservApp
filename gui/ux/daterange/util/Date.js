Ext.define('Ext.ux.daterange.util.Date', {

    singleton: true,

    diffDays: function(start, end) {
        var day = 1000 * 60 * 60 * 24,
            clear = Ext.Date.clearTime,
            diff = clear(end, true).getTime() - clear(start, true).getTime();

        return Math.ceil(diff / day);
    },

    /**
     * This method determines which human date range startDate and endDate is. (e.g. a week, a month,...)
     *
     * e.g.: 1. January - 31. March -> return object: { isDays: false,  isWeeks: false, isMonths: true, isYears: false, count:3 };
     *  isDays: If startDate and endDate are not a week or a month or a year, then isDay will return true. Count is the difference between startDate and endDate
     *  isWeeks: startDate is on weekDayStart and endDate is on weekDayEnd. 0-based (0...Sunday, 6...Saturday)
     *  isMonths: startDate (is first day of month) endDate (is last day of month)
     *  isYears: startDate (1.1.) endDate 31. December
     *  count: The number of days/weeks/months/years
     *
     *  IMPORTANT: It is always one value true (e.g. isYears=true, isMonth=false, ...)

     * @param {Date} startDate
     * @param {Date} endDate
     * @param {Number} weekDayStart Day index at which the week should begin, 0-based. 0 default (Sunday)
     * @param {Number} weekDayEnd Day index at which the week should end, 0-based. 6 default (Saturday)
     * @returns {{isDays: boolean, isWeeks: boolean, isMonths: boolean, isYears: boolean, count: number}}  
     *      Only one parameter is true. count how often the date range is between startDate and endDate
     */
    isDateRange: function(startDate, endDate, weekDayStart, weekDayEnd) {
        var dateRange = {  isDays: false,  isWeeks: false, isMonths: false, isYears: false, count:0 };
        var me = this,
            eDate = Ext.Date,
            diff,
            dayCount;

        //clone dates
        startDate =eDate.clone(startDate);
        endDate =eDate.clone(endDate);


        if (eDate.clearTime(startDate) === eDate.clearTime(endDate) ) {
            //Same day
            dateRange.isDay = true;
            return dateRange;
        }

        //is startDate and endDate on the first and last day of a month?
        if (endDate.getDate() === eDate.getDaysInMonth(endDate) && startDate.getDate() === 1) {

            //Look if it is a year or years
            if (startDate.getMonth() === 1 && endDate.getMonth() === 11) {
                dateRange.count = endDate.getFullYear() - startDate.getFullYear() + 1;
                dateRange.isYears = true;
                return dateRange;
            }

            dateRange.count = (((endDate.getFullYear() - startDate.getFullYear()) * 12 ) + endDate.getMonth() ) - startDate.getMonth();
            dateRange.count++; //e.g. 1. Oct - 31. Oct is one month --> expected result, count=1
            dateRange.isMonths = true;
            return dateRange;
        }

        //week or weeks?
        if( !Ext.isNumber((weekDayStart))) weekDayStart = 0;
        if( !Ext.isNumber((weekDayEnd))) weekDayEnd = 6;

        if (startDate.getDay() === weekDayStart && endDate.getDay() === weekDayEnd) {

            /*
            What is a week? From Sunday to Saturday or maybe a work week from monday to saturday?

            Examples:

            st ... weekDayStart
            end... weekDayEnd
            count... expected result
            0 ... Sunday, 6 ... Saturday

            st | end | count
            0  | 6   | 7
            1  | 0   | 7
            1  | 5   | 5
            5  | 0   | 3
             */

            dayCount = ((weekDayEnd - weekDayStart) + 7) % 7 + 1;
            diff = me.diffDays(startDate, endDate) + 1;
            //calculate the number of weeks. e.g. 21 days are 3 weeks
            dateRange.count = Math.floor( diff / dayCount);
            dateRange.isWeeks = true;
            return dateRange;

        }

        dateRange.count = me.diffDays(startDate, endDate) + 1;
        dateRange.isDays = true;

        return dateRange;
    }
});

