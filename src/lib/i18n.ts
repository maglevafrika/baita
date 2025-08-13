import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      nav: {
        print: "Print",
        settings: "Settings",
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
        loading: "Loading..."
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
        enrollStudent: "Enroll Student",
        import: "Import",
        exportPDF: "Export PDF",
        exportCSV: "Export CSV",
        selectSemester: "Select a semester",
        selectTeacher: "Select a teacher",
        selectTeacherToView: "Please select a teacher to view their schedule.",
        teacherOnLeave: "You are on leave for this period. No classes to display.",
        selectDayToView: "Please select a day to view the schedule.",
        noScheduleAvailable: "No schedule available for the selected teacher/day.",
        noStudentsEnrolled: "No students enrolled",
        all: "All",
        days: {
          saturday: "Saturday",
          sunday: "Sunday", 
          monday: "Monday",
          tuesday: "Tuesday",
          wednesday: "Wednesday",
          thursday: "Thursday",
          sat: "Sat",
          sun: "Sun",
          mon: "Mon",
          tue: "Tue",
          wed: "Wed",
          thu: "Thu"
        },
        attendanceUpdated: "Attendance updated",
        markedAs: "Marked as {{status}}",
        failedToUpdateAttendance: "Failed to update attendance",
        removalRequested: "Removal Requested",
        removalRequestSent: "Request to remove {{name}} has been sent for approval.",
        studentRemoved: "Student Removed",
        studentRemovedFromSession: "{{name}} has been removed from the session.",
        failedToProcessRemoval: "Failed to process removal. {{message}}",
        importSchedule: "Import Schedule",
        importScheduleDesc: "Functionality to bulk-import students from a CSV file coming soon.",
        importFormPlaceholder: "Import form will be here."
      }
    }
  },
  ar: {
    translation: {
      nav: {
        print: "طباعة",
        settings: "الإعدادات",
        languages: "اللغات",
        selectLanguage: "اختر اللغة",
        switchTheme: "التبديل إلى وضع {{mode}}",
        profile: "الملف الشخصي",
        changePassword: "تغيير كلمة المرور",
        switchRole: "تبديل الدور",
        activeAs: "نشط كـ: {{role}}",
        logout: "تسجيل الخروج",
        languageChanged: "تم تغيير اللغة",
        languageSwitched: "تم التبديل إلى {{language}}",
        accessDenied: "تم رفض الوصول",
        noPermission: "ليس لديك صلاحية للوصول إلى الإعدادات."
      },
      common: {
        light: "فاتح",
        dark: "داكن",
        english: "English",
        arabic: "العربية",
        error: "خطأ",
        success: "نجح",
        loading: "جارٍ التحميل..."
      },
      dashboard: {
        title: "لوحة الإدارة",
        welcome: "مرحباً بعودتك!",
        students: "الطلاب",
        applicants: "المتقدمين",
        payments: "المدفوعات",
        reports: "التقارير",
        leaves: "الإجازات",
        requests: "الطلبات",
        exclusions: "الاستثناءات",
        semesters: "الفصول الدراسية",
        users: "المستخدمين",
        enrollStudent: "تسجيل طالب",
        import: "استيراد",
        exportPDF: "تصدير PDF",
        exportCSV: "تصدير CSV",
        selectSemester: "اختر فصل دراسي",
        selectTeacher: "اختر مدرساً",
        selectTeacherToView: "يرجى اختيار مدرس لعرض جدوله الزمني.",
        teacherOnLeave: "أنت في إجازة خلال هذه الفترة. لا توجد فصول للعرض.",
        selectDayToView: "يرجى اختيار يوم لعرض الجدول الزمني.",
        noScheduleAvailable: "لا يوجد جدول زمني متاح للمدرس/اليوم المحدد.",
        noStudentsEnrolled: "لا يوجد طلاب مسجلون",
        all: "الكل",
        days: {
          saturday: "السبت",
          sunday: "الأحد",
          monday: "الاثنين", 
          tuesday: "الثلاثاء",
          wednesday: "الأربعاء",
          thursday: "الخميس",
          sat: "سبت",
          sun: "أحد",
          mon: "اثن",
          tue: "ثلا",
          wed: "أرب",
          thu: "خمي"
        },
        attendanceUpdated: "تم تحديث الحضور",
        markedAs: "تم وضع علامة كـ {{status}}",
        failedToUpdateAttendance: "فشل في تحديث الحضور",
        removalRequested: "تم طلب الإزالة",
        removalRequestSent: "تم إرسال طلب إزالة {{name}} للموافقة عليه.",
        studentRemoved: "تم إزالة الطالب",
        studentRemovedFromSession: "تم إزالة {{name}} من الجلسة.",
        failedToProcessRemoval: "فشل في معالجة الإزالة. {{message}}",
        importSchedule: "استيراد الجدول الزمني",
        importScheduleDesc: "وظيفة الاستيراد الجماعي للطلاب من ملف CSV قريباً.",
        importFormPlaceholder: "سيكون نموذج الاستيراد هنا."
      }
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
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false,
    }
  });

export default i18n;