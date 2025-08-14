import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      nav: {
        dashboard: "Dashboard",
        requests: "Requests",
        students: "Students",
        applicants: "Applicants",
        users: "Users",
        semesters: "Semesters",
        leaves: "Leaves",
        exclusions: "Exclusions",
        payments: "Payments",
        reports: "Reports",
        settings: "Settings",
        print: "Print",
        languages: "Languages",
        selectLanguage: "Select Language",
        switchTheme: "Switch to {{mode}} mode",
        profile: "Profile",
        changePassword: "Change Password",
        switchRole: "Switch Role",
        activeAs: "Active as: {{role}}",
        logout: "Log out",
        languageChanged: "Language Changed",
        languageSwitched: "Language switched to {{language}}",
        accessDenied: "Access Denied",
        noPermission: "You don't have permission to access settings."
      },
      common: {
        light: "light",
        dark: "dark",
        english: "English",
        arabic: "العربية",
        error: "Error",
        success: "Success",
        loading: "Loading...",
        na: "N/A"
      },
      days: {
        all: "All",
        saturday: "Saturday",
        sunday: "Sunday",
        monday: "Monday",
        tuesday: "Tuesday",
        wednesday: "Wednesday",
        thursday: "Thursday",
        satShort: "Sat",
        sunShort: "Sun",
        monShort: "Mon",
        tueShort: "Tue",
        wedShort: "Wed",
        thuShort: "Thu"
      },
      dashboard: {
        title: "Admin Dashboard",
        welcome: "Welcome back!",
        students: "Students",
        applicants: "Applicants",
        payments: "Payments",
        reports: "Reports",
        leaves: "Leaves",
        requests: "Requests",
        exclusions: "Exclusions",
        semesters: "Semesters",
        users: "Users",
        selectSemester: "Select a semester",
        selectTeacher: "Select a teacher",
        selectTeacherToView: "Please select a teacher to view their schedule.",
        teacherOnLeave: "You are on leave for this period. No classes to display.",
        selectDayToView: "Please select a day to view the schedule",
        noScheduleAvailable: "No schedule available for the selected teacher/day",
        noStudentsEnrolled: "No students enrolled"
      },
      actions: {
        enrollStudent: "Enroll Student",
        import: "Import",
        exportPDF: "Export PDF",
        exportCSV: "Export CSV"
      },
      applicants: { /* ... unchanged ... */ },
      schedule: { /* ... unchanged ... */ },
      attendance: { /* ... unchanged ... */ },
      removal: { /* ... unchanged ... */ },
      importSchedule: { /* ... unchanged ... */ },
      csv: { /* ... unchanged ... */ },
      errors: { /* ... unchanged ... */ },
      requests: { /* ... unchanged ... */ },
      leavesPage: { /* ... unchanged ... */ },

      reports: {
        title: "Reports & Analytics",
        enrollmentTrends: "Student Enrollment Trends",
        enrollmentDescription: "New student enrollments per month.",
        enrollmentTrendsDesc: "New student enrollments per month.",
        financialOverview: "Financial Overview",
        financialDescription: "Breakdown of all installment payments.",
        financialOverviewDesc: "Breakdown of all installment payments.",
        applicantFunnel: "Applicant Funnel",
        applicantDescription: "Current status of all applications.",
        applicantFunnelDesc: "Current status of all applications.",
        genderDistribution: "Gender Distribution",
        genderDescription: "Breakdown of student gender.",
        genderDistributionDesc: "Breakdown of student gender.",
        ageGroups: "Age Groups",
        ageGroupsDescription: "Distribution of students by age group.",
        ageGroupsDesc: "Distribution of students by age group.",
        expectedRevenue: "Expected Revenue",
        expectedRevenueDescription: "Comparison of expected revenue from subscriptions versus collected payments.",
        expectedRevenueDesc: "Comparison of expected revenue from subscriptions versus collected payments.",
        teacherWorkload: "Teacher Workload",
        teacherWorkloadDescription: "Weekly scheduled hours per teacher, broken down by day.",
        teacherWorkloadDesc: "Weekly scheduled hours per teacher, broken down by day.",
        paid: "Paid",
        unpaid: "Unpaid",
        overdue: "Overdue",
        male: "Male",
        female: "Female",
        under18: "Under 18",
        "18_24": "18–24",
        "25_34": "25–34",
        "35_44": "35–44",
        "45plus": "45+",
        revenue: "Revenue"
      },

      exclusionsPage: { /* ... unchanged ... */ }
    }
  },

  ar: {
    translation: {
      nav: { /* ... unchanged ... */ },
      common: { /* ... unchanged ... */ },
      days: { /* ... unchanged ... */ },
      dashboard: { /* ... unchanged ... */ },
      actions: { /* ... unchanged ... */ },
      applicants: { /* ... unchanged ... */ },
      schedule: { /* ... unchanged ... */ },
      attendance: { /* ... unchanged ... */ },
      removal: { /* ... unchanged ... */ },
      importSchedule: { /* ... unchanged ... */ },
      csv: { /* ... unchanged ... */ },
      errors: { /* ... unchanged ... */ },
      requests: { /* ... unchanged ... */ },
      leavesPage: { /* ... unchanged ... */ },

      reports: {
        title: "التقارير والتحليلات",
        enrollmentTrends: "اتجاهات تسجيل الطلاب",
        enrollmentDescription: "عدد الطلاب الجدد المسجلين شهرياً.",
        enrollmentTrendsDesc: "عدد الطلاب الجدد المسجلين شهرياً.",
        financialOverview: "نظرة مالية عامة",
        financialDescription: "تفصيل جميع المدفوعات بالتقسيط.",
        financialOverviewDesc: "تفصيل جميع المدفوعات بالتقسيط.",
        applicantFunnel: "مراحل المتقدمين",
        applicantDescription: "الحالة الحالية لجميع الطلبات.",
        applicantFunnelDesc: "الحالة الحالية لجميع الطلبات.",
        genderDistribution: "توزيع الجنس",
        genderDescription: "تفصيل الطلاب حسب الجنس.",
        genderDistributionDesc: "تفصيل الطلاب حسب الجنس.",
        ageGroups: "الفئات العمرية",
        ageGroupsDescription: "توزيع الطلاب حسب الفئة العمرية.",
        ageGroupsDesc: "توزيع الطلاب حسب الفئة العمرية.",
        expectedRevenue: "الإيرادات المتوقعة",
        expectedRevenueDescription: "مقارنة الإيرادات المتوقعة من الاشتراكات مقابل المدفوعات المحصلة.",
        expectedRevenueDesc: "مقارنة الإيرادات المتوقعة من الاشتراكات مقابل المدفوعات المحصلة.",
        teacherWorkload: "عبء عمل المدرسين",
        teacherWorkloadDescription: "ساعات العمل الأسبوعية لكل مدرس، مفصلة حسب اليوم.",
        teacherWorkloadDesc: "ساعات العمل الأسبوعية لكل مدرس، مفصلة حسب اليوم.",
        paid: "مدفوع",
        unpaid: "غير مدفوع",
        overdue: "متأخر",
        male: "ذكر",
        female: "أنثى",
        under18: "أقل من 18",
        "18_24": "18–24",
        "25_34": "25–34",
        "35_44": "35–44",
        "45plus": "45+",
        revenue: "الإيرادات"
      },

      exclusionsPage: { /* ... unchanged ... */ }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    },
    interpolation: { escapeValue: false },
    react: {
      bindI18n: 'languageChanged',
      bindI18nStore: '',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
      useSuspense: true
    }
  });

i18n.on('languageChanged', (lng) => {
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
});

export default i18n;
