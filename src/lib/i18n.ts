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
        loading: "Loading...",
        na: "N/A"
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
        selectDayToView: "Please select a day to view the schedule",
        noScheduleAvailable: "No schedule available for the selected teacher/day",
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
          
        }
      },
      actions: {
        enrollStudent: "Enroll Student",
        import: "Import",
        exportPDF: "Export PDF",
        exportCSV: "Export CSV"
      },
      schedule: {
        selectDayToView: "Please select a day to view the schedule",
        noScheduleAvailable: "No schedule available for the selected teacher/day",
        noStudentsEnrolled: "No students enrolled",
        onLeaveMessage: "You are on leave for this period. No classes to display",
        selectTeacherMessage: "Please select a teacher to view their schedule"
      },
      attendance: {
        updated: "Attendance updated",
        markedAs: "Marked as {{status}}",
        updateFailed: "Failed to update attendance",
        present: "Present",
        absent: "Absent",
        late: "Late",
        excused: "Excused"
      },
      removal: {
        teacherReason: "Teacher requested removal from schedule view",
        requested: "Removal Requested",
        requestSent: "Request to remove {{studentName}} has been sent for approval",
        studentRemoved: "Student Removed",
        removedFromSession: "{{studentName}} has been removed from the session",
        processFailed: "Failed to process removal. {{message}}"
      },
      importSchedule: {
        title: "Import Schedule",
        description: "Functionality to bulk-import students from a CSV file coming soon",
        placeholder: "Import form will be here"
      },
      csv: {
        day: "Day",
        time: "Time",
        specialization: "Specialization",
        type: "Type",
        studentName: "Student Name",
        attendance: "Attendance"
      },
      errors: {
        daySessionsNotFound: "Could not find day sessions for this teacher",
        sessionNotFound: "Could not find the session",
        studentProfileNotFound: "Student profile not found to update enrollment"
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
        loading: "جارٍ التحميل...",
        na: "غير متاح"
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
        selectTeacher: "اختر مدرس",
        selectTeacherToView: "يرجى اختيار مدرس لعرض جدوله",
        teacherOnLeave: "أنت في إجازة خلال هذه الفترة. لا توجد فصول للعرض",
        selectDayToView: "يرجى اختيار يوم لعرض الجدول",
        noScheduleAvailable: "لا يوجد جدول متاح للمدرس/اليوم المحدد",
        noStudentsEnrolled: "لا يوجد طلاب مسجلين",
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
          mon: "اثنين",
          tue: "ثلاثاء",
          wed: "أربعاء",
          thu: "خميس"
          
        }
      },
      actions: {
        enrollStudent: "تسجيل طالب",
        import: "استيراد",
        exportPDF: "تصدير PDF",
        exportCSV: "تصدير CSV"
      },
      schedule: {
        selectDayToView: "يرجى اختيار يوم لعرض الجدول",
        noScheduleAvailable: "لا يوجد جدول متاح للمدرس/اليوم المحدد",
        noStudentsEnrolled: "لا يوجد طلاب مسجلين",
        onLeaveMessage: "أنت في إجازة خلال هذه الفترة. لا توجد فصول لعرضها",
        selectTeacherMessage: "يرجى اختيار مدرس لعرض جدوله"
      },
      attendance: {
        updated: "تم تحديث الحضور",
        markedAs: "تم التسجيل كـ {{status}}",
        updateFailed: "فشل في تحديث الحضور",
        present: "حاضر",
        absent: "غائب",
        late: "متأخر",
        excused: "معذور"
      },
      removal: {
        teacherReason: "طلب المدرس إزالة من عرض الجدول",
        requested: "تم طلب الإزالة",
        requestSent: "تم إرسال طلب إزالة {{studentName}} للموافقة",
        studentRemoved: "تم إزالة الطالب",
        removedFromSession: "تم إزالة {{studentName}} من الجلسة",
        processFailed: "فشل في معالجة الإزالة. {{message}}"
      },
      importSchedule: {
        title: "استيراد الجدول",
        description: "وظيفة الاستيراد المجمع للطلاب من ملف CSV قريباً",
        placeholder: "نموذج الاستيراد سيكون هنا"
      },
      csv: {
        day: "اليوم",
        time: "الوقت",
        specialization: "التخصص",
        type: "النوع",
        studentName: "اسم الطالب",
        attendance: "الحضور"
      },
      errors: {
        daySessionsNotFound: "لا يمكن العثور على جلسات اليوم لهذا المدرس",
        sessionNotFound: "لا يمكن العثور على الجلسة",
        studentProfileNotFound: "لم يتم العثور على ملف الطالب الشخصي لتحديث التسجيل"
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
      caches: ['localStorage']
    },
    interpolation: {
      escapeValue: false
    },
    react: {
      bindI18n: 'languageChanged',
      bindI18nStore: '',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
      useSuspense: true
    }
  });

// Add RTL direction support
i18n.on('languageChanged', (lng) => {
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
});

export default i18n;