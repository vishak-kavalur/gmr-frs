import moment from "moment";

/**
 * Processes raw employee and transaction data to generate structured insights for the attendance dashboard.
 *
 * @param {Array<Object>} allEmployees - Array of all employee objects.
 * @param {Array<Object>} allTransactions - Array of all transaction objects.
 * @param {Object} filters - Object containing dashboard filters.
 * @param {moment.Moment} filters.startDate - The start date of the filter range.
 * @param {moment.Moment} filters.endDate - The end date of the filter range.
 * @param {string} filters.searchEmpId - Employee ID to filter by (can be empty).
 * @param {string} filters.searchDepartment - Department to filter by (can be null/empty).
 * @param {number} OFFICE_HOURS_START - The official start hour of the office (e.g., 9 for 9 AM).
 * @param {number} OFFICE_HOURS_END - The official end hour of the office (e.g., 17 for 5 PM).
 * @param {number} LATE_THRESHOLD_MINUTES - Grace period for late arrival in minutes.
 * @param {number} EARLY_LEAVE_THRESHOLD_MINUTES - Grace period for early departure in minutes.
 * @returns {Object} A structured object containing processed attendance data.
 */
export const processAttendanceData = (
  allEmployees,
  allTransactions,
  filters,
  OFFICE_HOURS_START,
  OFFICE_HOURS_END,
  LATE_THRESHOLD_MINUTES,
  EARLY_LEAVE_THRESHOLD_MINUTES
) => {
  // --- 1. Initial Filtering ---
  const employeeMap = new Map(allEmployees.map((e) => [e.empId, e]));

  const filteredTransactions = allTransactions.filter((t) => {
    const transDate = moment(t.createdAt);
    const employee = employeeMap.get(t.empId);
    if (!employee) return false;

    const isInDateRange = transDate.isBetween(
      filters.startDate,
      filters.endDate,
      "day",
      "[]"
    );
    const matchesEmpId =
      !filters.searchEmpId || t.empId === filters.searchEmpId;
    const matchesDept =
      !filters.searchDepartment ||
      employee.department === filters.searchDepartment;
    return isInDateRange && matchesEmpId && matchesDept;
  });

  const filteredEmployees = allEmployees.filter((e) => {
    const matchesEmpId =
      !filters.searchEmpId || e.empId === filters.searchEmpId;
    const matchesDept =
      !filters.searchDepartment || e.department === filters.searchDepartment;
    return matchesEmpId && matchesDept;
  });

  // --- 2. Daily Attendance Processing ---
  const dailyEmployeeData = new Map();
  const dateRange = [];
  for (
    let m = moment(filters.startDate);
    m.isSameOrBefore(filters.endDate, "day");
    m.add(1, "days")
  ) {
    const currentDate = m.clone();
    const dateStr = currentDate.format("YYYY-MM-DD");
    dateRange.push(currentDate); // Push moment object
    dailyEmployeeData.set(dateStr, new Map());

    for (const employee of filteredEmployees) {
      const empDailyTransactions = filteredTransactions
        .filter(
          (t) =>
            t.empId === employee.empId &&
            moment(t.createdAt).isSame(currentDate, "day")
        )
        .sort(
          (a, b) =>
            moment(a.createdAt).valueOf() - moment(b.createdAt).valueOf()
        );

      const firstIn = empDailyTransactions.find((t) => t.entryType === "IN");
      const lastOut = empDailyTransactions
        .filter((t) => t.entryType === "OUT")
        .pop();

      const inTime = firstIn ? moment(firstIn.createdAt) : null;
      const outTime = lastOut ? moment(lastOut.createdAt) : null;

      let status = "Absent";
      let totalHours = 0;

      const officeStart = currentDate
        .clone()
        .hour(OFFICE_HOURS_START)
        .minute(0);
      const lateThreshold = officeStart
        .clone()
        .add(LATE_THRESHOLD_MINUTES, "minutes");
      const officeEnd = currentDate.clone().hour(OFFICE_HOURS_END).minute(0);
      const earlyThreshold = officeEnd
        .clone()
        .subtract(EARLY_LEAVE_THRESHOLD_MINUTES, "minutes");

      if (inTime && outTime) {
        totalHours = moment.duration(outTime.diff(inTime)).asHours();
        const isLate = inTime.isAfter(lateThreshold);
        const isEarly = outTime.isBefore(earlyThreshold);

        if (isLate) status = "Late";
        else if (isEarly) status = "Early Leave";
        else status = "Present";
      } else if (inTime && !outTime) {
        status = "Missing OUT Scan";
      } else if (!inTime && outTime) {
        status = "Missing IN Scan";
      }

      dailyEmployeeData.get(dateStr).set(employee.empId, {
        status,
        inTime: inTime ? inTime.format("HH:mm") : "N/A",
        outTime: outTime ? outTime.format("HH:mm") : "N/A",
        rawInTime: inTime, // Keep moment object for calculations
        totalHours: totalHours, // Keep as number
        empName: employee.empName,
        department: employee.department,
      });
    }
  }

  // --- 3. Populate Return Structures ---

  // Daily Summary (for endDate)
  const todayStr = filters.endDate.format("YYYY-MM-DD");
  const todayData = dailyEmployeeData.get(todayStr) || new Map();
  let dailySummary = {
    totalEmployees: filteredEmployees.length,
    present: 0,
    absent: 0,
    late: 0,
    earlyLeave: 0,
    missingOut: 0,
    missingIn: 0,
    whoIsInNow: [],
    topEarlyBirds: [],
    topLateComers: [],
    dailyEmployeeStatus: [],
  };

  todayData.forEach((data, empId) => {
    dailySummary.dailyEmployeeStatus.push({
      ...data,
      totalHours: data.totalHours.toFixed(2),
    });
    if (data.status === "Present") dailySummary.present++;
    if (data.status === "Absent") dailySummary.absent++;
    if (data.status === "Late") dailySummary.late++;
    if (data.status === "Early Leave") dailySummary.earlyLeave++;
    if (data.status === "Missing OUT Scan") dailySummary.missingOut++;
    if (data.status === "Missing IN Scan") dailySummary.missingIn++;

    if (
      data.status === "Missing OUT Scan" &&
      moment().isBefore(filters.endDate.clone().hour(OFFICE_HOURS_END))
    ) {
      dailySummary.whoIsInNow.push({
        empName: data.empName,
        inTime: data.inTime,
      });
    }
  });

  dailySummary.topEarlyBirds = [...todayData.entries()]
    .filter(
      ([, data]) =>
        (data.status === "Present" || data.status === "Early Leave") &&
        data.inTime !== "N/A"
    )
    .sort(
      ([, a], [, b]) =>
        moment(a.inTime, "HH:mm").valueOf() -
        moment(b.inTime, "HH:mm").valueOf()
    )
    .slice(0, 5)
    .map(([empId, data]) => ({ empName: data.empName, inTime: data.inTime }));

  dailySummary.topLateComers = [...todayData.entries()]
    .filter(([, data]) => data.status === "Late" && data.inTime !== "N/A")
    .sort(
      ([, a], [, b]) =>
        moment(b.inTime, "HH:mm").valueOf() -
        moment(a.inTime, "HH:mm").valueOf()
    )
    .slice(0, 5)
    .map(([empId, data]) => ({ empName: data.empName, inTime: data.inTime }));

  // Monthly Summary & Department Insights
  let monthlySummary = {
    dailyAttendanceTrend: [],
    monthlyLateEarlyPatterns: { late: 0, early: 0 },
    averageTimeAtOffice: 0,
    daysWithLowestAttendance: [],
  };
  const departmentInsightsMap = new Map();
  let totalHoursSum = 0;
  let presentDaysCount = 0;

  dateRange.forEach((currentDate) => {
    const dateStr = currentDate.format("YYYY-MM-DD");
    const dayData = dailyEmployeeData.get(dateStr);
    let presentCount = 0;
    dayData.forEach((data, empId) => {
      const dept = data.department;
      if (!departmentInsightsMap.has(dept)) {
        departmentInsightsMap.set(dept, {
          name: dept,
          totalEmployees: allEmployees.filter((e) => e.department === dept)
            .length,
          present: 0,
          absent: 0,
          late: 0,
          early: 0,
          avgHours: 0,
          issues: 0,
          totalHours: 0,
          presentDays: 0,
        });
      }
      const deptData = departmentInsightsMap.get(dept);

      if (
        data.status === "Present" ||
        data.status === "Late" ||
        data.status === "Early Leave"
      ) {
        presentCount++;
        deptData.present++;
        deptData.totalHours += parseFloat(data.totalHours);
        deptData.presentDays++;
        totalHoursSum += parseFloat(data.totalHours);
        presentDaysCount++;
      } else {
        deptData.absent++;
      }
      if (data.status === "Late") {
        monthlySummary.monthlyLateEarlyPatterns.late++;
        deptData.late++;
        deptData.issues++;
      }
      if (data.status === "Early Leave") {
        monthlySummary.monthlyLateEarlyPatterns.early++;
        deptData.issues++;
      }
      if (data.status.includes("Missing")) {
        deptData.issues++;
      }
    });
    monthlySummary.dailyAttendanceTrend.push({
      date: dateStr,
      presentCount,
      totalEmployees: filteredEmployees.length,
      attendancePercentage:
        filteredEmployees.length > 0
          ? (presentCount / filteredEmployees.length) * 100
          : 0,
    });
  });

  monthlySummary.averageTimeAtOffice =
    presentDaysCount > 0
      ? (totalHoursSum / presentDaysCount).toFixed(2)
      : "0.00";
  monthlySummary.daysWithLowestAttendance = [
    ...monthlySummary.dailyAttendanceTrend,
  ]
    .sort((a, b) => a.attendancePercentage - b.attendancePercentage)
    .slice(0, 3);

  const departmentInsights = Array.from(departmentInsightsMap.values()).map(
    (dept) => {
      dept.avgHours =
        dept.presentDays > 0
          ? (dept.totalHours / dept.presentDays).toFixed(2)
          : 0;
      delete dept.totalHours;
      delete dept.presentDays;
      return dept;
    }
  );

  // Employee Detail
  let employeeDetail = null;
  if (filters.searchEmpId) {
    const empProfile = allEmployees.find(
      (e) => e.empId === filters.searchEmpId
    );
    if (empProfile) {
      const dailyTimeline = [];
      const anomalies = [];
      let totalDaysPresent = 0;
      let totalHours = 0;

      dateRange.forEach((currentDate) => {
        const dateStr = currentDate.format("YYYY-MM-DD");
        const dayData = dailyEmployeeData
          .get(dateStr)
          ?.get(filters.searchEmpId);
        if (dayData) {
          dailyTimeline.push({
            ...dayData,
            date: dateStr,
            totalTime: dayData.totalHours.toFixed(2),
          });
          if (
            dayData.status === "Present" ||
            dayData.status === "Late" ||
            dayData.status === "Early Leave"
          ) {
            totalDaysPresent++;
            totalHours += parseFloat(dayData.totalHours);
          }
          if (dayData.status !== "Present" && dayData.status !== "Absent") {
            anomalies.push(`${dateStr}: ${dayData.status}`);
          }
        }
      });

      employeeDetail = {
        employeeProfile: empProfile,
        totalDaysPresent,
        avgHoursPerDay:
          totalDaysPresent > 0
            ? (totalHours / totalDaysPresent).toFixed(2)
            : "0.00",
        dailyTimeline,
        anomalies,
      };
    }
  }

  // --- Trends & Analytics Calculation (IMPLEMENTED) ---
  const employeeStats = new Map();
  filteredEmployees.forEach((e) => {
    employeeStats.set(e.empId, {
      empName: e.empName,
      totalLateness: 0,
      lateDays: 0,
      presentDays: 0,
      totalHours: 0,
      arrivalTimes: [], // in minutes from midnight
      missingOutScans: 0,
    });
  });

  let weekdayData = { days: 0, totalHours: 0, attendanceCount: 0 };
  let weekendData = { days: 0, totalHours: 0, attendanceCount: 0 };

  dailyEmployeeData.forEach((dayMap, dateStr) => {
    const dayMoment = moment(dateStr, "YYYY-MM-DD");
    const isWeekend = dayMoment.isoWeekday() >= 6;
    const targetData = isWeekend ? weekendData : weekdayData;
    targetData.days++;

    dayMap.forEach((dayData, empId) => {
      const stat = employeeStats.get(empId);
      if (!stat) return;

      if (
        dayData.status === "Present" ||
        dayData.status === "Late" ||
        dayData.status === "Early Leave"
      ) {
        targetData.attendanceCount++;
        stat.presentDays++;
        stat.totalHours += dayData.totalHours;

        if (dayData.rawInTime) {
          const arrivalTime =
            dayData.rawInTime.hour() * 60 + dayData.rawInTime.minute();
          stat.arrivalTimes.push(arrivalTime);
        }
      }

      if (dayData.status === "Late" && dayData.rawInTime) {
        const officeStart = dayMoment
          .clone()
          .hour(OFFICE_HOURS_START)
          .minute(0);
        const lateness = moment
          .duration(dayData.rawInTime.diff(officeStart))
          .asMinutes();
        stat.totalLateness += lateness > 0 ? lateness : 0;
        stat.lateDays++;
      }
      if (dayData.status === "Missing OUT Scan") {
        stat.missingOutScans++;
      }
    });
  });

  const weekdayAvgAttendance =
    weekdayData.days > 0
      ? (weekdayData.attendanceCount /
          (weekdayData.days * filteredEmployees.length)) *
        100
      : 0;
  const weekendAvgAttendance =
    weekendData.days > 0
      ? (weekendData.attendanceCount /
          (weekendData.days * filteredEmployees.length)) *
        100
      : 0;
  const weekdayAvgHours =
    weekdayData.attendanceCount > 0
      ? weekdayData.totalHours / weekdayData.attendanceCount
      : 0;
  const weekendAvgHours =
    weekendData.attendanceCount > 0
      ? weekendData.totalHours / weekendData.attendanceCount
      : 0;

  const mostPunctualEmployees = [...employeeStats.values()]
    .filter((s) => s.presentDays > 0)
    .map((s) => ({
      empName: s.empName,
      // Score based on average lateness per late day. Lower is better.
      punctualityScore: s.lateDays > 0 ? s.totalLateness / s.lateDays : 0,
    }))
    .sort((a, b) => a.punctualityScore - b.punctualityScore)
    .slice(0, 10);

  const missingOutScansEmployees = [...employeeStats.entries()]
    .filter(([, s]) => s.missingOutScans > 0)
    .map(([empId, s]) => ({
      empId,
      empName: s.empName,
      missingCount: s.missingOutScans,
    }))
    .sort((a, b) => b.missingCount - a.missingCount);

  const correlationData = [...employeeStats.values()]
    .filter((s) => s.presentDays > 0 && s.arrivalTimes.length > 0)
    .map((s) => {
      const avgArrivalTimeRaw =
        s.arrivalTimes.reduce((a, b) => a + b, 0) / s.arrivalTimes.length;
      return {
        empName: s.empName,
        // Avg arrival time as a decimal hour (e.g., 9.5 for 9:30 AM)
        avgArrivalTime: avgArrivalTimeRaw / 60,
        avgDailyHours: s.totalHours / s.presentDays,
      };
    });

  const trendsAnalytics = {
    weekdayVsWeekend: {
      weekdayAvgAttendance,
      weekendAvgAttendance,
      weekdayAvgHours,
      weekendAvgHours,
    },
    mostPunctualEmployees,
    missingOutScansEmployees,
    correlationData,
  };

  return {
    dailySummary,
    monthlySummary,
    departmentInsights,
    employeeDetail,
    trendsAnalytics,
  };
};
