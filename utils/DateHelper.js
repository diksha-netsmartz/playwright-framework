/**
 * Utility class for computing and formatting date ranges and date strings across the framework.
 */
export default class DateHelper {

    /**
     * Formats a JavaScript Date object into MM/DD/YYYY string format.
     * @param {Date} date - Date object.
     * @returns {string} Formatted date string (e.g. "08/31/2026").
     */
    static formatDate(date) {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    }

    /**
     * Computes a 3-month date range spanning from the 1st day of the previous month
     * to the last day of the next month (covering Previous Month, Current Month, and Next Month).
     * 
     * Example: If current date is in August 2026:
     * - Start Date: 07/01/2026
     * - End Date: 09/30/2026
     * - Formatted Range: "07/01/2026 - 09/30/2026"
     * 
     * @param {Date} [baseDate=new Date()] - Reference date (defaults to current date).
     * @returns {{ startDate: string, endDate: string, formattedRange: string }} Date range object.
     */
    static getThreeMonthDateRange(baseDate = new Date()) {
        const year = baseDate.getFullYear();
        const month = baseDate.getMonth();

        // First day of previous month
        const firstDayPrevMonth = new Date(year, month - 1, 1);

        // Last day of next month (day 0 of month + 2)
        const lastDayNextMonth = new Date(year, month + 2, 0);

        const startDate = this.formatDate(firstDayPrevMonth);
        const endDate = this.formatDate(lastDayNextMonth);

        return {
            startDate,
            endDate,
            formattedRange: `${startDate} - ${endDate}`
        };
    }

    /**
     * Computes the current month's start and end dates formatted as MM/DD/YYYY.
     * @param {Date} [baseDate=new Date()] - Reference date.
     * @returns {{ startDate: string, endDate: string, formattedRange: string }}
     */
    static getCurrentMonthDateRange(baseDate = new Date()) {
        const year = baseDate.getFullYear();
        const month = baseDate.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const startDate = this.formatDate(firstDay);
        const endDate = this.formatDate(lastDay);

        return {
            startDate,
            endDate,
            formattedRange: `${startDate} - ${endDate}`
        };
    }

    /**
     * Computes the previous month's start and end dates formatted as MM/DD/YYYY.
     * @param {Date} [baseDate=new Date()] - Reference date.
     * @returns {{ startDate: string, endDate: string, formattedRange: string }}
     */
    static getPreviousMonthDateRange(baseDate = new Date()) {
        const year = baseDate.getFullYear();
        const month = baseDate.getMonth();

        const firstDay = new Date(year, month - 1, 1);
        const lastDay = new Date(year, month, 0);

        const startDate = this.formatDate(firstDay);
        const endDate = this.formatDate(lastDay);

        return {
            startDate,
            endDate,
            formattedRange: `${startDate} - ${endDate}`
        };
    }

    /**
     * Generates a random integer between min and max (inclusive).
     * @param {number} min - Minimum number.
     * @param {number} max - Maximum number.
     * @returns {number}
     */
    static getRandomNumber(min, max) {
        const lower = Math.min(min, max);
        const upper = Math.max(min, max);
        return Math.floor(Math.random() * (upper - lower + 1)) + lower;
    }

    /**
     * Returns the consecutive next day (date + 1 day) for a given date.
     * @param {Date} [date=new Date()] - Reference date.
     * @returns {Date}
     */
    static getNextDay(date = new Date()) {
        const next = new Date(date);
        next.setDate(next.getDate() + 1);
        return next;
    }

    /**
     * Generates a random date within the current month.
     * Capped at maxDay (default 25) so that the consecutive next day
     * is guaranteed to remain in the same month.
     * 
     * @param {number} [minDay=1] - Minimum day of month.
     * @param {number} [maxDay=25] - Maximum day of month.
     * @param {Date} [baseDate=new Date()] - Reference date (defaults to today).
     * @returns {Date}
     */
    static getRandomDateInCurrentMonth(minDay = 1, maxDay = 25, baseDate = new Date()) {
        const year = baseDate.getFullYear();
        const month = baseDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const effectiveMax = Math.min(maxDay, daysInMonth - 1);
        const effectiveMin = Math.min(minDay, effectiveMax);
        const randomDay = this.getRandomNumber(effectiveMin, effectiveMax);
        return new Date(year, month, randomDay);
    }

    /**
     * Generates a random future date between minDaysAhead and maxDaysAhead from baseDate.
     * @param {number} [minDaysAhead=1] - Minimum days ahead.
     * @param {number} [maxDaysAhead=30] - Maximum days ahead.
     * @param {Date} [baseDate=new Date()] - Reference date.
     * @returns {Date}
     */
    static getRandomFutureDate(minDaysAhead = 1, maxDaysAhead = 30, baseDate = new Date()) {
        const daysToAdd = this.getRandomNumber(minDaysAhead, maxDaysAhead);
        const futureDate = new Date(baseDate);
        futureDate.setDate(futureDate.getDate() + daysToAdd);
        return futureDate;
    }

    /**
     * Generates a random date and its consecutive next day for date/calendar pickers.
     * Guarantees both dates fall within the same month view (by default between day 1 and 25).
     * 
     * @param {Object} [options={}]
     * @param {number} [options.minDay=1] - Minimum starting day of month (default: 1).
     * @param {number} [options.maxDay=25] - Maximum starting day of month (default: 25).
     * @param {Date} [options.baseDate=new Date()] - Reference date (default: today).
     * @returns {{
     *   startDate: Date,
     *   endDate: Date,
     *   startDay: number,
     *   endDay: number,
     *   formattedStartDate: string,
     *   formattedEndDate: string,
     *   formattedRange: string
     * }}
     */
    static getRandomDateAndNextDay(options = {}) {
        const minDay = options.minDay !== undefined ? options.minDay : 1;
        const maxDay = options.maxDay !== undefined ? options.maxDay : 25;
        const baseDate = options.baseDate || new Date();

        const startDate = this.getRandomDateInCurrentMonth(minDay, maxDay, baseDate);
        const endDate = this.getNextDay(startDate);

        const formattedStartDate = this.formatDate(startDate);
        const formattedEndDate = this.formatDate(endDate);

        return {
            startDate,
            endDate,
            startDay: startDate.getDate(),
            endDay: endDate.getDate(),
            formattedStartDate,
            formattedEndDate,
            formattedRange: `${formattedStartDate} - ${formattedEndDate}`
        };
    }

    /**
     * Picks an unused start day and consecutive next day from a month,
     * ensuring neither the start day nor the next day collides with any occupied days.
     * 
     * @param {number[]|Set<number>} [occupiedDays=[]] - List or Set of day numbers already occupied in the month.
     * @param {Object} [options={}]
     * @param {number} [options.minDay=1] - Minimum day of month (default: 1).
     * @param {number} [options.maxDay=25] - Maximum day of month (default: 25).
     * @param {Date} [options.baseDate=new Date()] - Reference date for the month.
     * @returns {{
     *   startDate: Date,
     *   endDate: Date,
     *   startDay: number,
     *   endDay: number,
     *   formattedStartDate: string,
     *   formattedEndDate: string,
     *   formattedRange: string
     * } | null} Returns the date range object, or null if no consecutive pair is available.
     */
    static getAvailableDateAndNextDay(occupiedDays = [], options = {}) {
        const minDay = options.minDay !== undefined ? options.minDay : 1;
        const maxDay = options.maxDay !== undefined ? options.maxDay : 25;
        const baseDate = options.baseDate || new Date();

        const occupiedSet = occupiedDays instanceof Set ? occupiedDays : new Set(occupiedDays);

        const availableStartDays = [];
        for (let day = minDay; day <= maxDay; day++) {
            if (!occupiedSet.has(day) && !occupiedSet.has(day + 1)) {
                availableStartDays.push(day);
            }
        }

        if (availableStartDays.length === 0) {
            return null;
        }

        const randomIndex = Math.floor(Math.random() * availableStartDays.length);
        const chosenDay = availableStartDays[randomIndex];

        const year = baseDate.getFullYear();
        const month = baseDate.getMonth();
        const startDate = new Date(year, month, chosenDay);
        const endDate = this.getNextDay(startDate);

        const formattedStartDate = this.formatDate(startDate);
        const formattedEndDate = this.formatDate(endDate);

        return {
            startDate,
            endDate,
            startDay: chosenDay,
            endDay: chosenDay + 1,
            formattedStartDate,
            formattedEndDate,
            formattedRange: `${formattedStartDate} - ${formattedEndDate}`
        };
    }

    /**
     * Returns today's date formatted as MM/DD/YYYY.
     * @param {Date} [baseDate=new Date()] - Reference date (defaults to today).
     * @returns {string} Formatted date string (e.g. "09/01/2026").
     */
    static getTodayFormatted(baseDate = new Date()) {
        return this.formatDate(baseDate);
    }

    /**
     * Returns a relative date (day of the month) based on an offset from baseDate.
     * - offset = 0  => Today's day (e.g. 3)
     * - offset = -1 => Yesterday's day (e.g. 2)
     * - offset = +1 => Tomorrow's day (e.g. 4)
     * - offset = -N => N days in the past
     * - offset = +N => N days in the future
     *
     * Automatically handles month and year boundary transitions.
     *
     * @param {number|Object} [offset=0] - Day offset (0 for today, -1 for yesterday, 1 for tomorrow, etc.),
     *                                     or an options object: { offset, asString, padZero, baseDate }.
     * @param {boolean|Object|Date} [asStringOrOptions=false] - If true, returns string (e.g. "2").
     *                                                          Can also be an options object: { asString, padZero, baseDate },
     *                                                          or a custom Date object.
     * @param {Date} [baseDate=new Date()] - Reference date (defaults to current date).
     * @returns {number|string} The resulting day of the month.
     */
    static getRelativeDate(offset = 0, asStringOrOptions = false, baseDate = new Date()) {
        let daysOffset = 0;
        let asString = false;
        let padZero = false;
        let date = baseDate;

        if (typeof offset === 'object' && offset !== null && !(offset instanceof Date)) {
            daysOffset = Number(offset.offset ?? 0);
            asString = offset.asString ?? false;
            padZero = offset.padZero ?? false;
            if (offset.baseDate instanceof Date) {
                date = offset.baseDate;
            }
        } else {
            daysOffset = Number(offset || 0);
            if (typeof asStringOrOptions === 'boolean') {
                asString = asStringOrOptions;
            } else if (asStringOrOptions instanceof Date) {
                date = asStringOrOptions;
            } else if (typeof asStringOrOptions === 'object' && asStringOrOptions !== null) {
                asString = asStringOrOptions.asString ?? false;
                padZero = asStringOrOptions.padZero ?? false;
                if (asStringOrOptions.baseDate instanceof Date) {
                    date = asStringOrOptions.baseDate;
                }
            }
        }

        const targetDate = new Date(date);
        targetDate.setDate(targetDate.getDate() + daysOffset);

        const day = targetDate.getDate();
        if (asString || padZero) {
            return padZero ? String(day).padStart(2, '0') : String(day);
        }
        return day;
    }

    /**
     * Alias for getRelativeDate(). Returns day of the month by offset.
     * 
     * @param {number|Object} [offset=0] - 0 for today, -1 for yesterday, 1 for tomorrow.
     * @param {boolean|Object|Date} [asStringOrOptions=false]
     * @param {Date} [baseDate=new Date()]
     * @returns {number|string}
     */
    static getDateByOffset(offset = 0, asStringOrOptions = false, baseDate = new Date()) {
        return this.getRelativeDate(offset, asStringOrOptions, baseDate);
    }

    /**
     * Alias for getRelativeDate(). Returns relative day of the month by offset.
     * 
     * @param {number|Object} [offset=0] - 0 for today, -1 for yesterday, 1 for tomorrow.
     * @param {boolean|Object|Date} [asStringOrOptions=false]
     * @param {Date} [baseDate=new Date()]
     * @returns {number|string}
     */
    static getRelativeDay(offset = 0, asStringOrOptions = false, baseDate = new Date()) {
        return this.getRelativeDate(offset, asStringOrOptions, baseDate);
    }

    /**
     * Returns today's date (day of the month, e.g. 3).
     * For example, if today is September 3, 2026, it returns 3 (or "3" when asString is true).
     * 
     * @param {boolean|Object|Date} [asStringOrOptions=false] - If true, returns string (e.g. "3").
     *                                                          Can also be an options object: { asString, padZero, baseDate },
     *                                                          or a custom Date object.
     * @param {Date} [baseDate=new Date()] - Reference date (defaults to current date).
     * @returns {number|string} Day of the month (e.g. 3, or "3" when asString is true).
     */
    static getTodayDate(asStringOrOptions = false, baseDate = new Date()) {
        return this.getRelativeDate(0, asStringOrOptions, baseDate);
    }

    /**
     * Returns today's date (day of the month) as a string (e.g. "3").
     * Convenience shorthand for getTodayDate(true).
     * 
     * @param {Date} [baseDate=new Date()] - Reference date (defaults to current date).
     * @returns {string} Day of the month as a string (e.g. "3").
     */
    static getTodayDateAsString(baseDate = new Date()) {
        return String(this.getTodayDate(true, baseDate));
    }

    /**
     * Alias for getTodayDate(). Returns today's day of the month (e.g. 3).
     * 
     * @param {boolean|Object|Date} [asStringOrOptions=false]
     * @param {Date} [baseDate=new Date()]
     * @returns {number|string}
     */
    static getTodayDay(asStringOrOptions = false, baseDate = new Date()) {
        return this.getTodayDate(asStringOrOptions, baseDate);
    }

    /**
     * Alias for getTodayDate(). Returns current day of the month (e.g. 3).
     * 
     * @param {boolean|Object|Date} [asStringOrOptions=false]
     * @param {Date} [baseDate=new Date()]
     * @returns {number|string}
     */
    static getCurrentDay(asStringOrOptions = false, baseDate = new Date()) {
        return this.getTodayDate(asStringOrOptions, baseDate);
    }

    /**
     * Returns yesterday's date (day of the month, e.g. 2).
     * Convenience method for getRelativeDate(-1).
     * 
     * @param {boolean|Object|Date} [asStringOrOptions=false] - If true, returns string (e.g. "2").
     * @param {Date} [baseDate=new Date()] - Reference date (defaults to current date).
     * @returns {number|string} Yesterday's day of the month (e.g. 2, or "2" when asString is true).
     */
    static getYesterdayDate(asStringOrOptions = false, baseDate = new Date()) {
        return this.getRelativeDate(-1, asStringOrOptions, baseDate);
    }

    /**
     * Returns yesterday's date (day of the month) as a string (e.g. "2").
     * 
     * @param {Date} [baseDate=new Date()] - Reference date (defaults to current date).
     * @returns {string}
     */
    static getYesterdayDateAsString(baseDate = new Date()) {
        return String(this.getRelativeDate(-1, true, baseDate));
    }

    /**
     * Returns tomorrow's date (day of the month, e.g. 4).
     * Convenience method for getRelativeDate(1).
     * 
     * @param {boolean|Object|Date} [asStringOrOptions=false] - If true, returns string (e.g. "4").
     * @param {Date} [baseDate=new Date()] - Reference date (defaults to current date).
     * @returns {number|string} Tomorrow's day of the month (e.g. 4, or "4" when asString is true).
     */
    static getTomorrowDate(asStringOrOptions = false, baseDate = new Date()) {
        return this.getRelativeDate(1, asStringOrOptions, baseDate);
    }

    /**
     * Returns tomorrow's date (day of the month) as a string (e.g. "4").
     * 
     * @param {Date} [baseDate=new Date()] - Reference date (defaults to current date).
     * @returns {string}
     */
    static getTomorrowDateAsString(baseDate = new Date()) {
        return String(this.getRelativeDate(1, true, baseDate));
    }

    /**
     * Computes the date range from the 1st day of the previous month to the last day of the current month,
     * formatted as MM/DD/YYYY. Also returns the raw Date objects and the last day number for calendar pickers.
     * 
     * Example: If current date is in August 2026:
     * - Start Date: 07/01/2026
     * - End Date: 08/31/2026
     * 
     * @param {Date} [baseDate=new Date()] - Reference date.
     * @returns {{
     *   startDate: string,
     *   endDate: string,
     *   formattedRange: string,
     *   prevMonthDate: Date,
     *   currentMonthDate: Date,
     *   lastDayCurrentMonth: number
     * }}
     */
    static getPrevMonthToCurrentMonthRange(baseDate = new Date()) {
        const year = baseDate.getFullYear();
        const month = baseDate.getMonth();

        const prevMonthFirstDate = new Date(year, month - 1, 1);
        const currMonthLastDate = new Date(year, month + 1, 0);

        const startDate = this.formatDate(prevMonthFirstDate);
        const endDate = this.formatDate(currMonthLastDate);

        return {
            startDate,
            endDate,
            formattedRange: `${startDate} - ${endDate}`,
            prevMonthDate: prevMonthFirstDate,
            currentMonthDate: new Date(year, month, 1),
            lastDayCurrentMonth: currMonthLastDate.getDate()
        };
    }

    /**
     * Returns a Date object that is a given number of days before the base date.
     * @param {number} [daysBack=7] - Number of days to go back.
     * @param {Date} [baseDate=new Date()] - Reference date (defaults to today).
     * @returns {Date}
     */
    static getDateDaysAgo(daysBack = 7, baseDate = new Date()) {
        const target = new Date(baseDate);
        target.setDate(target.getDate() - daysBack);
        return target;
    }

    /**
     * Picks an unused single day from a month, excluding occupied days.
     * 
     * @param {number[]|Set<number>} [occupiedDays=[]] - List or Set of day numbers already occupied.
     * @param {Object} [options={}]
     * @param {number} [options.minDay=1] - Minimum day of month (default: 1).
     * @param {number} [options.maxDay=28] - Maximum day of month (default: 28).
     * @param {Date} [options.baseDate=new Date()] - Reference date.
     * @returns {{ date: Date, day: number, formattedDate: string } | null}
     */
    static getAvailableSingleDate(occupiedDays = [], options = {}) {
        const minDay = options.minDay !== undefined ? options.minDay : 1;
        const maxDay = options.maxDay !== undefined ? options.maxDay : 28;
        const baseDate = options.baseDate || new Date();

        const occupiedSet = occupiedDays instanceof Set ? occupiedDays : new Set(occupiedDays);

        const availableDays = [];
        for (let day = minDay; day <= maxDay; day++) {
            if (!occupiedSet.has(day)) {
                availableDays.push(day);
            }
        }

        if (availableDays.length === 0) {
            return null;
        }

        const randomIndex = Math.floor(Math.random() * availableDays.length);
        const chosenDay = availableDays[randomIndex];

        const year = baseDate.getFullYear();
        const month = baseDate.getMonth();
        const date = new Date(year, month, chosenDay);

        return {
            date,
            day: chosenDay,
            formattedDate: this.formatDate(date)
        };
    }

    /**
     * Resolves a flexible user month input into a normalized target month descriptor.
     * Supports:
     * - 'previous' / 'prev' / undefined (defaults to previous month)
     * - 'current' (current month)
     * - Date object
     * - Month names with/without year (e.g. 'Aug 2026', 'August', '08/2026')
     * 
     * @param {string|Date} [monthInput='previous'] - Flexible month representation.
     * @returns {{ label: string, date: Date, monthIndex: number, year: number }}
     */
    static resolveTargetMonth(monthInput = 'previous') {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const fullMonthNames = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

        const now = new Date();
        let targetYear = now.getFullYear();
        let targetMonthIndex;

        if (!monthInput || monthInput === 'previous' || monthInput === 'prev') {
            const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            targetMonthIndex = prev.getMonth();
            targetYear = prev.getFullYear();
        } else if (monthInput === 'current') {
            targetMonthIndex = now.getMonth();
            targetYear = now.getFullYear();
        } else if (monthInput instanceof Date) {
            targetMonthIndex = monthInput.getMonth();
            targetYear = monthInput.getFullYear();
        } else if (typeof monthInput === 'string') {
            const trimmed = monthInput.trim();
            const yearMatch = trimmed.match(/\b(20\d{2})\b/);
            if (yearMatch) {
                targetYear = parseInt(yearMatch[1], 10);
            }
            const cleanMonth = trimmed.replace(/\b20\d{2}\b/, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            const fullIdx = fullMonthNames.findIndex(m => m.startsWith(cleanMonth));
            if (fullIdx !== -1) {
                targetMonthIndex = fullIdx;
            } else if (!isNaN(Number(cleanMonth)) && Number(cleanMonth) >= 1 && Number(cleanMonth) <= 12) {
                targetMonthIndex = Number(cleanMonth) - 1;
            } else {
                const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                targetMonthIndex = prev.getMonth();
                targetYear = prev.getFullYear();
            }
        }

        const label = `${monthNames[targetMonthIndex]} ${targetYear}`;
        const date = new Date(targetYear, targetMonthIndex, 1);

        return { label, date, monthIndex: targetMonthIndex, year: targetYear };
    }

    /**
     * Returns a Date that is `daysBack` days before `baseDate`, stepping back one additional day
     * if the result falls on a Sunday (day 0), to guarantee a weekday result.
     *
     * @param {number} [daysBack=7] - Number of days to go back.
     * @param {Date} [baseDate=new Date()] - Reference date (defaults to today).
     * @returns {Date} A non-Sunday date `daysBack` (or `daysBack + 1`) days in the past.
     */
    static getWeekdayDaysAgo(daysBack = 7, baseDate = new Date()) {
        let target = this.getDateDaysAgo(daysBack, baseDate);
        if (target.getDay() === 0) {
            target = this.getDateDaysAgo(daysBack + 1, baseDate);
        }
        return target;
    }

    /**
     * Formats a Date object as a scheduler calendar data-value string: "YYYY/M/D"
     * where the month is zero-indexed (0–11) and neither month nor day is zero-padded.
     * Matches the format used by the Kendo scheduler widget's `data-value` attribute.
     *
     * Example: September 3, 2026 → "2026/8/3"
     *
     * @param {Date} date - The date to format.
     * @returns {string} Scheduler data-value string (e.g. "2026/8/3").
     */
    static toSchedulerDataValue(date) {
        return `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`;
    }

    /**
     * Formats a Date as a long month name + year string (e.g. "September 2026").
     * Suitable for matching datepicker navigation header text.
     *
     * @param {Date} date - The date to format.
     * @param {string} [locale='en-US'] - BCP 47 locale string.
     * @returns {string} Formatted string (e.g. "September 2026").
     */
    static getMonthLongNameYear(date, locale = 'en-US') {
        return date.toLocaleString(locale, { month: 'long', year: 'numeric' });
    }

    /**
     * Parses a "Mmm YYYY" string (e.g. "Sep 2026", "Aug 2026") into a Date object representing the 1st of that month.
     * @param {string} monthYearStr - String formatted as "Mmm YYYY".
     * @returns {Date}
     */
    static parseMonthYear(monthYearStr) {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const parts = monthYearStr.trim().split(/\s+/);
        const mIdx = monthNames.indexOf(parts[0]);
        const y = parseInt(parts[1], 10);
        return new Date(y, mIdx !== -1 ? mIdx : 0, 1);
    }

    /**
     * Returns only the formatted range string for the current month (e.g. "09/01/2026 - 09/30/2026").
     * Convenience shorthand for `getCurrentMonthDateRange().formattedRange`.
     * @param {Date} [baseDate=new Date()] - Reference date.
     * @returns {string}
     */
    static getCurrentMonthFormattedRange(baseDate = new Date()) {
        return this.getCurrentMonthDateRange(baseDate).formattedRange;
    }

    /**
     * Returns only the formatted range string spanning Previous Month → Next Month
     * (e.g. "07/01/2026 - 09/30/2026").
     * Convenience shorthand for `getThreeMonthDateRange().formattedRange`.
     * @param {Date} [baseDate=new Date()] - Reference date.
     * @returns {string}
     */
    static getThreeMonthFormattedRange(baseDate = new Date()) {
        return this.getThreeMonthDateRange(baseDate).formattedRange;
    }

    /**
     * Picks an available start day and consecutive next day from a month using standard
     * scheduling constraints: minDay=1, maxDay=25.
     * Shorthand for `getAvailableDateAndNextDay(occupiedDays, { minDay: 1, maxDay: 25, baseDate })`.
     *
     * @param {number[]|Set<number>} [occupiedDays=[]] - Days already occupied in the month.
     * @param {Date} [baseDate=new Date()] - Reference date for the target month.
     * @returns {{
     *   startDate: Date, endDate: Date,
     *   startDay: number, endDay: number,
     *   formattedStartDate: string, formattedEndDate: string, formattedRange: string
     * } | null}
     */
    static getStandardAvailableDateRange(occupiedDays = [], baseDate = new Date()) {
        return this.getAvailableDateAndNextDay(occupiedDays, { minDay: 1, maxDay: 25, baseDate });
    }

    /**
     * Generates a random start day and consecutive next day within the current month
     * using standard scheduling constraints: minDay=1, maxDay=25.
     * Shorthand for `getRandomDateAndNextDay({ minDay: 1, maxDay: 25, baseDate })`.
     *
     * @param {Date} [baseDate=new Date()] - Reference date for the target month.
     * @returns {{
     *   startDate: Date, endDate: Date,
     *   startDay: number, endDay: number,
     *   formattedStartDate: string, formattedEndDate: string, formattedRange: string
     * }}
     */
    static getStandardRandomDateRange(baseDate = new Date()) {
        return this.getRandomDateAndNextDay({ minDay: 1, maxDay: 25, baseDate });
    }

    /**
     * Returns all date information needed to navigate a datepicker calendar spanning
     * from the 1st of the previous month to the last day of the current month.
     *
     * Combines `getPrevMonthToCurrentMonthRange()` and `getMonthLongNameYear()` into a
     * single call, eliminating repeated boilerplate in pages that drive calendar pickers.
     *
     * @param {Date} [baseDate=new Date()] - Reference date.
     * @returns {{
     *   prevMonthDate: Date,
     *   currentMonthDate: Date,
     *   lastDayCurrentMonth: number,
     *   startDate: string,
     *   endDate: string,
     *   formattedRange: string,
     *   prevMonthNameYear: string,
     *   currMonthNameYear: string,
     *   prevDay: string,
     *   currLastDay: string
     * }}
     */
    static getPrevToCurrentMonthCalendarInfo(baseDate = new Date()) {
        const range = this.getPrevMonthToCurrentMonthRange(baseDate);
        return {
            ...range,
            prevMonthNameYear: this.getMonthLongNameYear(range.prevMonthDate),
            currMonthNameYear: this.getMonthLongNameYear(range.currentMonthDate),
            prevDay: '1',
            currLastDay: String(range.lastDayCurrentMonth)
        };
    }
}




