(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/lib/data.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "getInitialApplicants": (()=>getInitialApplicants),
    "getInitialLeaves": (()=>getInitialLeaves),
    "getInitialPaymentSettings": (()=>getInitialPaymentSettings),
    "getInitialRequests": (()=>getInitialRequests),
    "getInitialSemesters": (()=>getInitialSemesters),
    "getInitialStudents": (()=>getInitialStudents),
    "getInitialUsers": (()=>getInitialUsers)
});
const getInitialUsers = ()=>{
    return [
        {
            id: '1',
            username: 'admin1',
            name: 'Admin One',
            roles: [
                'admin'
            ],
            password: 'Rs!2325'
        },
        {
            id: '2',
            username: 'رغد',
            name: 'Raghad',
            roles: [
                'admin'
            ],
            password: 'Rs!2325'
        },
        {
            id: '3',
            username: 'عبدالرحمن',
            name: 'Abdulrahman',
            roles: [
                'admin'
            ],
            password: 'Rs!2325'
        },
        {
            id: '4',
            username: 'manar',
            name: 'Manar',
            roles: [
                'admin',
                'high-level-dashboard'
            ],
            password: 'Rs!2325'
        },
        {
            id: '5',
            username: 'MC',
            name: 'MC',
            roles: [
                'upper-management'
            ],
            password: 'Rs!2325'
        },
        {
            id: '6',
            username: 'نهاد',
            name: 'Nahad',
            roles: [
                'teacher'
            ],
            password: 'Rs!2325'
        },
        {
            id: '7',
            username: 'حازم',
            name: 'Hazem',
            roles: [
                'teacher'
            ],
            password: 'Rs!2325'
        },
        {
            id: '8',
            username: 'هاني',
            name: 'Hani',
            roles: [
                'teacher'
            ],
            password: 'Rs!2325'
        },
        {
            id: '9',
            username: 'نبيل',
            name: 'Nabil',
            roles: [
                'teacher'
            ],
            password: 'Rs!2325'
        },
        {
            id: '10',
            username: 'باسم',
            name: 'Basem',
            roles: [
                'teacher'
            ],
            password: 'Rs!2325'
        },
        {
            id: '11',
            username: 'بسام',
            name: 'Bassam',
            roles: [
                'teacher'
            ],
            password: 'Rs!2325'
        },
        {
            id: '12',
            username: 'ناجي',
            name: 'Naji',
            roles: [
                'teacher'
            ],
            password: 'Rs!2325'
        },
        {
            id: '13',
            username: 'يعرب',
            name: 'Yarob',
            roles: [
                'teacher'
            ],
            password: 'Rs!2325'
        },
        {
            id: '14',
            username: 'إسلام',
            name: 'Islam',
            roles: [
                'teacher'
            ],
            password: 'Rs!2325'
        },
        {
            id: '15',
            username: 'nancy',
            name: 'Nancy',
            roles: [
                'teacher'
            ],
            password: 'Rs!2325'
        }
    ];
};
const getInitialApplicants = ()=>{
    return [
        {
            id: 'APP001',
            name: 'سليمان الأحمد',
            gender: 'male',
            dob: '1995-03-12',
            nationality: 'Saudi Arabian',
            contact: {
                phone: '0512345678',
                email: 'sulaiman.a@example.com'
            },
            instrumentInterest: 'Oud',
            previousExperience: 'Played guitar for 5 years, basic knowledge of music theory.',
            status: 'pending-review',
            applicationDate: '2024-05-10T10:00:00Z',
            lastUpdated: '2024-05-10T10:00:00Z'
        },
        {
            id: 'APP002',
            name: 'لمى الخالدي',
            gender: 'female',
            dob: '2001-11-25',
            nationality: 'Kuwaiti',
            contact: {
                phone: '0587654321',
                email: 'lama.k@example.com'
            },
            instrumentInterest: 'Qanun',
            previousExperience: 'No formal training, but a strong passion for traditional music.',
            status: 'interview-scheduled',
            applicationDate: '2024-05-12T14:30:00Z',
            lastUpdated: '2024-05-15T11:00:00Z',
            interviewDate: '2024-05-28',
            interviewTime: '14:00',
            interviewer: 'Hani'
        },
        {
            id: 'APP003',
            name: 'Tariq Al-Farsi',
            gender: 'male',
            dob: '1988-08-01',
            nationality: 'Omani',
            contact: {
                phone: '0555555555',
                email: 'tariq.f@example.com'
            },
            instrumentInterest: 'Ney',
            previousExperience: 'Advanced flutist, looking to learn a new instrument.',
            status: 'approved',
            applicationDate: '2024-04-20T09:00:00Z',
            lastUpdated: '2024-05-18T16:00:00Z',
            interviewDate: '2024-05-15',
            interviewTime: '11:00',
            interviewer: 'Nahad',
            evaluation: {
                notes: 'Excellent musical ear and a quick learner. Strong potential.',
                decision: 'approved',
                generalScore: 88,
                criteria: {
                    musicalNote: 90,
                    playingTechniques: 80,
                    musicalKnowledge: 85,
                    tuningLevel: 95,
                    generalTalent: 90,
                    psychologicalBalance: 90
                }
            }
        }
    ];
};
const getInitialLeaves = ()=>{
    return [
        {
            id: 'LEAVE001',
            type: 'student',
            personId: 'STU001',
            personName: 'أحمد الفلاني',
            startDate: '2024-10-01',
            endDate: '2024-10-07',
            reason: 'Family vacation',
            status: 'approved'
        },
        {
            id: 'LEAVE002',
            type: 'teacher',
            personId: '6',
            personName: 'نهاد',
            startDate: '2024-11-15',
            endDate: '2024-11-22',
            reason: 'Attending a music conference',
            status: 'pending'
        }
    ];
};
const getInitialPaymentSettings = ()=>({
        monthly: 500,
        quarterly: 1500,
        yearly: 5500
    });
const scheduleData = `
اسم الطالب,رقم الجوال,اليوم,اسم المدرس,الوقت
سهل الرويلي,503817620,السبت,استاذ حازم,2:00-3:00
عبدالعزيز الجويعد,541777034,السبت,استاذ حازم,3:00-4:00
عصام احمد الحجار,508495126,الاحد,استاذ حازم,2:00-3:00
هذلول جميل,563332682,الاحد,استاذ حازم,3:00-4:00
فارس خالد كمال,599612353,الاحد,استاذ حازم,6:00-7:00
ريناد السنوسي,533689233,الاحد,استاذ حازم,7:00-8:00
تهاني احمد,536399101,الاحد,استاذ حازم,8:00-9:00
نايف الشوشان,555686459,الاثنين,استاذ حازم,2:00-3:00
محمد علي سالم,504715076,الاثنين,استاذ حازم,3:00-4:00
محمد صالح,,الاثنين,استاذ حازم,6:00-7:00
ريم علي,547833513,الاثنين,استاذ حازم,7:00-8:00
سعود عبدالعزيز,591000980,الاثنين,استاذ حازم,8:00-9:00
ريان صالح,596115587,الثلاثاء,استاذ حازم,2:00-3:00
تغريد الشهراني,591503888,الثلاثاء,استاذ حازم,3:00-4:00
منصور العتيبي,500006248,الثلاثاء,استاذ حازم,6:00-7:00
احمد هاشم,558067468,الثلاثاء,استاذ حازم,7:00-8:00
عبدالاله الصقير,560000697,الثلاثاء,استاذ حازم,8:00-9:00
عادل منسي,537518888,الاربعاء,استاذ حازم,2:00-3:00
غلا الدوسري,594471555,الاربعاء,استاذ حازم,3:00-4:00
وسام القرني,557055675,الاربعاء,استاذ حازم,6:00-7:00
نواف الشدوخي,560711170,الاربعاء,استاذ حازم,7:00-8:00
سلطان عبدالمجيد,555464604,الاربعاء,استاذ حازم,8:00-9:00
عمار محمد الهندي,562317277,السبت,استاذة نانسي,4:00-5:00
نواف السلومي,570771616,السبت,استاذة نانسي,5:00-6:00
عادل المالكي,534130530,السبت,استاذة نانسي,5:00-6:00
عبدالله مساعد الزهراني,553452142,السبت,استاذة نانسي,5:00-6:00
صهيب هاشم عبد العزيز,509548809,السبت,استاذة نانسي,5:00-6:00
خولة السيد,559693333,السبت,استاذة نانسي,6:00-7:00
اسماء يحيى العواجي,597078663,الاحد,استاذة نانسي,2:00-3:00
محمد عبد المحسن القصير,500004080,الاثنين,استاذة نانسي,4:00-5:00
مشاري عبدالله,509844294,الاثنين,استاذة نانسي,5:00-6:00
فهد علي,599135225,الاثنين,استاذة نانسي,6:00-7:00
امل سعود علي الشمري,533377329,الثلاثاء,استاذة نانسي,1:00-2:00
محمد منير سندي,561992266,الثلاثاء,استاذة نانسي,6:00-7:00
نهار العوجان,553465131,الثلاثاء,استاذة نانسي,6:00-7:00
محمد بن عثمان,544411105,الثلاثاء,استاذة نانسي,7:00-8:00
ابراهيم سعود الناجم,553333124,الثلاثاء,استاذة نانسي,7:00-8:00
احمد حسن عجيم,500457486,الثلاثاء,استاذة نانسي,7:00-8:00
نورة الخراشي,558260260,الاربعاء,استاذة نانسي,1:00-2:00
غادة محمد عجاج,500003899,الاربعاء,استاذة نانسي,2:00-3:00
منتهى الفارسي,556179004,الاربعاء,استاذة نانسي,5:00-6:00
دانة الدريس,540281281,الاربعاء,استاذة نانسي,6:00-7:00
غالب صالح,540041411,السبت,استاذ نهاد,2:00-3:00
فهد العتيبي,544422994,الاحد,استاذ نهاد,6:00-7:00
خولة,566566036,الاثنين,استاذ نهاد,1:00-2:00
احمد الهلالي,538617470,الاثنين,استاذ نهاد,4:00-5:00
ملاك القحطاني,535633114,الاثنين,استاذ نهاد,5:00-6:00
احمد عبد الواحد,562326161,الاثنين,استاذ نهاد,6:00-7:00
عبدالله الجبر,552299414,الثلاثاء,استاذ نهاد,12:00-1:00
مجدي مروان,552700720,الثلاثاء,استاذ نهاد,1:00-2:00
سعود بن نايف,542118020,الثلاثاء,استاذ نهاد,4:00-5:00
محمد بدران,558808875,الثلاثاء,استاذ نهاد,5:00-6:00
منال بدر,534094342,الثلاثاء,استاذ نهاد,6:00-7:00
مساعد خليفة,555146650,الاربعاء,استاذ نهاد,1:00-2:00
خالد الحازمي,505429913,الاربعاء,استاذ نهاد,4:00-5:00
محمد نويجم,557533222,الاربعاء,استاذ نهاد,5:00-6:00
فواز الوتيد,534433390,الاربعاء,استاذ نهاد,6:00-7:00
عبدالله فهد المحيميد,500552070,الاحد,استاذ باسم,2:00-3:00
سليمان السعدون,555373649,الاحد,استاذ باسم,3:00-4:00
احمد العياضي,538422226,الاحد,استاذ باسم,4:00-5:00
عدنان محمد الغامدي,503020644,الاحد,استاذ باسم,6:00-7:00
مجدي نعيم الزور,596106151,الاثنين,استاذ باسم,5:00-6:00
عبدالله النجار,540003550,الاثنين,استاذ باسم,6:00-7:00
فيصل الدريس,530665107,الاثنين,استاذ باسم,7:00-8:00
فراس باكير,569922614,الثلاثاء,استاذ باسم,5:00-6:00
عبدالله المالكي,555208816,الثلاثاء,استاذ باسم,6:00-7:00
سعد خالد الغريبي,500959191,الثلاثاء,استاذ باسم,7:00-8:00
حسين الشيخ,533281921,الاربعاء,استاذ باسم,3:00-4:00
عبدالرحمن بالبيد,555939434,الاربعاء,استاذ باسم,5:00-6:00
سكينة البوحليقة,550873793,الاربعاء,استاذ باسم,6:00-7:00
عبدالوهاب عبدالله الدوسري,550119308,الاربعاء,استاذ باسم,7:00-8:00
خالد الدوسري,552090559,السبت,استاذ نبيل,1:00-2:00
ورد,559517892,الاحد,استاذ نبيل,4:00-5:00
الجوهرة الخليفة,543116856,الاحد,استاذ نبيل,5:00-6:00
محمد باحجاج,567583915,الاحد,استاذ نبيل,6:00-7:00
فواز احمد,507067489,الاحد,استاذ نبيل,7:00-8:00
عبدالله العسكر,505554226,الاثنين,استاذ نبيل,4:00-5:00
نجمي سيف الدين,540082332,الاثنين,استاذ نبيل,6:00-7:00
محمد احمد عبدالله,543125344,الاثنين,استاذ نبيل,7:00-8:00
ابراهيم حلوبي,557273410,الثلاثاء,استاذ نبيل,2:00-3:00
فيصل سليمان,582844428,الثلاثاء,استاذ نبيل,4:00-5:00
نسرين رجاء,509550476,الثلاثاء,استاذ نبيل,6:00-7:00
صالح العمير,566105586,الثلاثاء,استاذ نبيل,7:00-8:00
مشاري مبارك,548845079,الاربعاء,استاذ نبيل,5:00-6:00
عبدالمجيد باحليوة,540010906,الاربعاء,استاذ نبيل,6:00-7:00
بدر ضيف الله العتيبي,502105010,الاربعاء,استاذ نبيل,7:00-8:00
عادل عبدالله,534700499,السبت,استاذ اسلام,2:00-3:00
عماد الرشيد,553077749,الاحد,استاذ اسلام,4:00-5:00
عبدالله ابراهيم,533090500,الاحد,استاذ اسلام,6:00-7:00
فريد ابراهيم الصلخدي,558432994,الاحد,استاذ اسلام,7:00-8:00
عبدالله الدوسري,540387019,الاثنين,استاذ اسلام,4:00-5:00
سلطان عماد,556055036,الاثنين,استاذ اسلام,5:00-6:00
امل سعيد,543076010,الاثنين,استاذ اسلام,6:00-7:00
ولاء حسن المختار,501980000,الاثنين,استاذ اسلام,7:00-8:00
سلمى عيسى آل حسن,535856514,الاثنين,استاذ اسلام,8:00-9:00
خالد سعيد الشامي,555450813,الثلاثاء,استاذ اسلام,3:00-4:00
محمد الابراهيم,545554646,الثلاثاء,استاذ اسلام,4:00-5:00
ساره,510479188,الثلاثاء,استاذ اسلام,5:00-6:00
احمد الشهري,569911140,الثلاثاء,استاذ اسلام,6:00-7:00
فهد محمد السهلي,554448523,الثلاثاء,استاذ اسلام,7:00-8:00
امين,543160389,الاربعاء,استاذ اسلام,4:00-5:00
مصطفى السادة,546375536,الاربعاء,استاذ اسلام,6:00-7:00
اريج اسعد حبوان قيسى,551084771,الاربعاء,استاذ اسلام,7:00-8:00
نورة الشهراني,544597598,الاربعاء,استاذ اسلام,8:00-9:00
فيصل علي الشهري,500434336,الاحد,استاذ ناجي,1:30-2:30
منى,,الاحد,استاذ ناجي,3:00-4:00
محمد العنزي,500003899,الاحد,استاذ ناجي,4:00-5:00
ثامر عبدالرحمن,548088866,الاحد,استاذ ناجي,5:00-6:00
صلاح ممدوح ابو قاسم,503055996,الاحد,استاذ ناجي,6:00-7:00
منصور المطيري,503251730,الاحد,استاذ ناجي,6:00-7:00
نواف الناجي,535010013,الاحد,استاذ ناجي,7:00-8:00
سلطان محارب,567446272,الاحد,استاذ ناجي,7:00-8:00
منذر قباني,503290532,الاثنين,استاذ ناجي,1:00-2:00
مهند البلخي,554849707,الاثنين,استاذ ناجي,6:00-7:00
فهد الخلفان,552111114,الاثنين,استاذ ناجي,7:00-8:00
نواف,,الثلاثاء,استاذ ناجي,5:00-6:00
جعفر الراشد,503494806,الثلاثاء,استاذ ناجي,6:00-7:00
عبد الرزاق,504420170,الثلاثاء,استاذ ناجي,7:00-8:00
احلام الشمري,547480434,الاربعاء,استاذ ناجي,3:00-4:00
احمد الدندن,504919609,الاربعاء,استاذ ناجي,5:00-6:00
اماني الشاعر,543557874,الاربعاء,استاذ ناجي,6:00-7:00
عبدالله سالم العلي,508099250,الاربعاء,استاذ ناجي,7:00-8:00
محاسن حاتم,560790652,السبت,استاذ بسام "قانون",2:00-3:00
محمد الفكي,553391133,السبت,استاذ بسام "قانون",3:00-4:00
ذكرى,560236039,الاحد,استاذ بسام "قانون",4:00-5:00
بثينه,558558843,الاحد,استاذ بسام "قانون",5:00-6:00
امجاد الدوسري,556073410,الاحد,استاذ بسام "قانون",6:00-7:00
نوره,971-507880034,الاحد,استاذ بسام "قانون",7:00-8:00
وحيد عبد المعين حسن,537255944,الاثنين,استاذ بسام "قانون",4:00-5:00
مها,,الاثنين,استاذ بسام "قانون",5:00-6:00
اسراء عبدالحكيم,543243606,الاثنين,استاذ بسام "قانون",6:00-7:00
شمعه اسعد,504797069,الاثنين,استاذ بسام "قانون",7:00-8:00
خالد المحمود,567869346,الثلاثاء,استاذ بسام "قانون",4:00-5:00
محمد الغامدي,553542148,الثلاثاء,استاذ بسام "قانون",5:00-6:00
عبدالله العمري,535067483,الثلاثاء,استاذ بسام "قانون",6:00-7:00
بدر ناصر السيف,504419340,الثلاثاء,استاذ بسام "قانون",7:00-8:00
سعد محمد,,الاربعاء,استاذ بسام "قانون",4:00-5:00
ترانيم,580998045,الاربعاء,استاذ بسام "قانون",5:00-6:00
مبارك الدوسري,560668787,الاربعاء,استاذ بسام "قانون",6:00-7:00
الفهديه الفهدي,542965689,الاربعاء,استاذ بسام "قانون",7:00-8:00
محمد طارق,557466233,الاحد,استاذ هاني "ناي",3:00-4:00
وفاء,560598002,الاحد,استاذ هاني "ناي",5:00-6:00
منار الجهيمي,554876290,الاحد,استاذ هاني "ناي",7:00-8:00
هتون اجواد,504520388,الاثنين,استاذ هاني "ناي",2:00-3:00
مرسيل,509601952,الاثنين,استاذ هاني "ناي",4:00-5:00
وفاء,560598002,الاثنين,استاذ هاني "ناي",5:00-6:00
محمد طارق,557466233,الثلاثاء,استاذ هاني "ناي",3:00-4:00
وفاء,560598002,الثلاثاء,استاذ هاني "ناي",4:00-5:00
منار الجهيمي,554876290,الثلاثاء,استاذ هاني "ناي",7:00-8:00
هتون اجواد,504520388,الاربعاء,استاذ هاني "ناي",2:00-3:00
مرسيل,509601952,الاربعاء,استاذ هاني "ناي",4:00-5:00
وفاء,560598002,الاربعاء,استاذ هاني "ناي",5:00-6:00
`;
function parseSchedule() {
    const studentMap = new Map();
    const masterSchedule = {};
    const allUsers = getInitialUsers();
    const lines = scheduleData.trim().split('\n').slice(1);
    lines.forEach((line, index)=>{
        const [studentName, phone, day, teacherRaw, time] = line.split(',');
        if (!studentName || !day || !teacherRaw || !time) return;
        const teacherNameClean = teacherRaw.replace(/"/g, '').replace(/^استاذة?\s*/, '').split(' ')[0];
        const teacher = allUsers.find((u)=>u.name === teacherNameClean || u.username === teacherNameClean);
        if (!teacher) {
            console.warn(`Teacher not found for: ${teacherRaw}`);
            return;
        }
        const teacherKey = teacher.name;
        if (!masterSchedule[teacherKey]) {
            masterSchedule[teacherKey] = {};
        }
        if (!masterSchedule[teacherKey][day]) {
            masterSchedule[teacherKey][day] = [];
        }
        let student = studentMap.get(studentName);
        if (!student) {
            const studentId = `STU${(studentMap.size + 1).toString().padStart(3, '0')}`;
            student = {
                id: studentId,
                name: studentName,
                level: "Beginner",
                enrollmentDate: new Date().toISOString().split('T')[0],
                enrolledIn: [],
                paymentPlan: 'none'
            };
            studentMap.set(studentName, student);
        }
        const timeParts = time.match(/(\d{1,2}:\d{2})-(\d{1,2}:\d{2})/);
        if (!timeParts) return;
        const formatTo12Hour = (timeStr)=>{
            let [hour, minute] = timeStr.split(':').map(Number);
            // All times are PM
            if (hour < 12) {
                hour += 12;
            }
            const ampm = 'PM';
            let displayHour = hour > 12 ? hour - 12 : hour;
            if (displayHour === 0) displayHour = 12; // Should not happen with PM logic
            return `${displayHour}:${minute.toString().padStart(2, '0')} ${ampm}`;
        };
        const startTime24Str = timeParts[1];
        const endTime24Str = timeParts[2];
        const startTime12 = formatTo12Hour(startTime24Str);
        const endTime12 = formatTo12Hour(endTime24Str);
        const [startH, startM] = startTime24Str.split(':').map(Number);
        const [endH, endM] = endTime24Str.split(':').map(Number);
        let startHour24 = startH < 12 ? startH + 12 : startH;
        let endHour24 = endH < 12 ? endH + 12 : endH;
        const duration = endHour24 * 60 + endM - (startHour24 * 60 + startM);
        const durationHours = duration / 60;
        const sessionId = `${day}-${teacherKey}-${startTime12.replace(/[\s:]/g, '')}`;
        let session = masterSchedule[teacherKey][day].find((s)=>s.id === sessionId);
        const studentToAdd = {
            id: student.id,
            name: student.name,
            attendance: null,
            pendingRemoval: false
        };
        if (session) {
            if (!session.students.find((s)=>s.id === student.id)) {
                session.students.push(studentToAdd);
            }
        } else {
            session = {
                id: sessionId,
                time: startTime12,
                endTime: endTime12,
                duration: durationHours,
                students: [
                    studentToAdd
                ],
                specialization: "Oud",
                type: 'practical'
            };
            masterSchedule[teacherKey][day].push(session);
        }
        if (!student.enrolledIn.some((e)=>e.sessionId === sessionId)) {
            student.enrolledIn.push({
                semesterId: "fall-2024",
                teacher: teacherKey,
                sessionId: sessionId
            });
        }
    });
    return {
        students: Array.from(studentMap.values()),
        masterSchedule
    };
}
const parsedData = parseSchedule();
const getInitialStudents = ()=>{
    return parsedData.students;
};
const getInitialRequests = ()=>{
    return [
        {
            id: 'REQ001',
            type: 'remove-student',
            status: 'pending',
            date: '2024-05-20',
            teacherId: '7',
            teacherName: 'Hazem',
            details: {
                studentId: 'STU001',
                studentName: 'سهل الرويلي',
                sessionId: 'Saturday-Hazem-2:00PM',
                sessionTime: '2:00 PM',
                day: 'Saturday',
                reason: 'Test request.',
                semesterId: 'fall-2024'
            }
        }
    ];
};
const getInitialSemesters = ()=>{
    const teacherList = [
        ...new Set(Object.keys(parsedData.masterSchedule))
    ];
    return [
        {
            id: "fall-2024",
            name: "Fall 2024",
            startDate: "2024-09-01",
            endDate: "2024-12-20",
            teachers: teacherList,
            masterSchedule: parsedData.masterSchedule,
            weeklyAttendance: {},
            incompatibilities: []
        }
    ];
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/hooks/use-toast.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "reducer": (()=>reducer),
    "toast": (()=>toast),
    "useToast": (()=>useToast)
});
// Inspired by react-hot-toast library
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;
const actionTypes = {
    ADD_TOAST: "ADD_TOAST",
    UPDATE_TOAST: "UPDATE_TOAST",
    DISMISS_TOAST: "DISMISS_TOAST",
    REMOVE_TOAST: "REMOVE_TOAST"
};
let count = 0;
function genId() {
    count = (count + 1) % Number.MAX_SAFE_INTEGER;
    return count.toString();
}
const toastTimeouts = new Map();
const addToRemoveQueue = (toastId)=>{
    if (toastTimeouts.has(toastId)) {
        return;
    }
    const timeout = setTimeout(()=>{
        toastTimeouts.delete(toastId);
        dispatch({
            type: "REMOVE_TOAST",
            toastId: toastId
        });
    }, TOAST_REMOVE_DELAY);
    toastTimeouts.set(toastId, timeout);
};
const reducer = (state, action)=>{
    switch(action.type){
        case "ADD_TOAST":
            return {
                ...state,
                toasts: [
                    action.toast,
                    ...state.toasts
                ].slice(0, TOAST_LIMIT)
            };
        case "UPDATE_TOAST":
            return {
                ...state,
                toasts: state.toasts.map((t)=>t.id === action.toast.id ? {
                        ...t,
                        ...action.toast
                    } : t)
            };
        case "DISMISS_TOAST":
            {
                const { toastId } = action;
                // ! Side effects ! - This could be extracted into a dismissToast() action,
                // but I'll keep it here for simplicity
                if (toastId) {
                    addToRemoveQueue(toastId);
                } else {
                    state.toasts.forEach((toast)=>{
                        addToRemoveQueue(toast.id);
                    });
                }
                return {
                    ...state,
                    toasts: state.toasts.map((t)=>t.id === toastId || toastId === undefined ? {
                            ...t,
                            open: false
                        } : t)
                };
            }
        case "REMOVE_TOAST":
            if (action.toastId === undefined) {
                return {
                    ...state,
                    toasts: []
                };
            }
            return {
                ...state,
                toasts: state.toasts.filter((t)=>t.id !== action.toastId)
            };
    }
};
const listeners = [];
let memoryState = {
    toasts: []
};
function dispatch(action) {
    memoryState = reducer(memoryState, action);
    listeners.forEach((listener)=>{
        listener(memoryState);
    });
}
function toast({ ...props }) {
    const id = genId();
    const update = (props)=>dispatch({
            type: "UPDATE_TOAST",
            toast: {
                ...props,
                id
            }
        });
    const dismiss = ()=>dispatch({
            type: "DISMISS_TOAST",
            toastId: id
        });
    dispatch({
        type: "ADD_TOAST",
        toast: {
            ...props,
            id,
            open: true,
            onOpenChange: (open)=>{
                if (!open) dismiss();
            }
        }
    });
    return {
        id: id,
        dismiss,
        update
    };
}
function useToast() {
    _s();
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(memoryState);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useToast.useEffect": ()=>{
            listeners.push(setState);
            return ({
                "useToast.useEffect": ()=>{
                    const index = listeners.indexOf(setState);
                    if (index > -1) {
                        listeners.splice(index, 1);
                    }
                }
            })["useToast.useEffect"];
        }
    }["useToast.useEffect"], [
        state
    ]);
    return {
        ...state,
        toast,
        dismiss: (toastId)=>dispatch({
                type: "DISMISS_TOAST",
                toastId
            })
    };
}
_s(useToast, "SPWE98mLGnlsnNfIwu/IAKTSZtk=");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/context/auth-context.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "AppThemeProvider": (()=>AppThemeProvider),
    "AuthProvider": (()=>AuthProvider),
    "useAuth": (()=>useAuth)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/data.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/use-toast.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AppThemeProvider({ children }) {
    _s();
    const { theme } = useAuth();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AppThemeProvider.useEffect": ()=>{
            if (theme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    }["AppThemeProvider.useEffect"], [
        theme
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
_s(AppThemeProvider, "OiIx8eaWacl4svL9JCxSUQcu79A=", false, function() {
    return [
        useAuth
    ];
});
_c = AppThemeProvider;
function AuthProvider({ children }) {
    _s1();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [users, setUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [customLogoUrl, setCustomLogoUrlState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [theme, setThemeState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('light');
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { toast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            try {
                const storedUsers = localStorage.getItem('users');
                if (storedUsers) {
                    setUsers(JSON.parse(storedUsers));
                } else {
                    const initialUsers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getInitialUsers"])();
                    setUsers(initialUsers);
                    localStorage.setItem('users', JSON.stringify(initialUsers));
                }
                const storedUser = sessionStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
                const storedLogo = localStorage.getItem('customLogoUrl');
                if (storedLogo) {
                    setCustomLogoUrlState(storedLogo);
                }
                const storedTheme = localStorage.getItem('app-theme');
                if (storedTheme) {
                    setThemeState(storedTheme);
                }
            } catch (error) {
                console.error("Failed to parse from storage", error);
                sessionStorage.removeItem('user');
                localStorage.removeItem('customLogoUrl');
                localStorage.removeItem('app-theme');
                localStorage.removeItem('users');
            } finally{
                setLoading(false);
            }
        }
    }["AuthProvider.useEffect"], []);
    const login = async (username)=>{
        const userInDb = users.find((u)=>u.username.toLowerCase() === username.toLowerCase());
        if (userInDb) {
            const sessionUser = {
                id: userInDb.id,
                username: userInDb.username,
                name: userInDb.name,
                roles: userInDb.roles,
                activeRole: userInDb.roles[0]
            };
            sessionStorage.setItem('user', JSON.stringify(sessionUser));
            setUser(sessionUser);
            router.push('/dashboard');
            return true;
        }
        return false;
    };
    const logout = ()=>{
        sessionStorage.removeItem('user');
        setUser(null);
        router.push('/');
    };
    const switchRole = (role)=>{
        if (user && user.roles.includes(role)) {
            const updatedUser = {
                ...user,
                activeRole: role
            };
            sessionStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            toast({
                title: `Switched to ${role.replace('-', ' ')}`,
                description: "Your view has been updated."
            });
        }
    };
    const addUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[addUser]": async (userData)=>{
            try {
                if (users.some({
                    "AuthProvider.useCallback[addUser]": (u)=>u.username.toLowerCase() === userData.username.toLowerCase()
                }["AuthProvider.useCallback[addUser]"])) {
                    toast({
                        title: "Username Exists",
                        description: "This username is already taken.",
                        variant: 'destructive'
                    });
                    return false;
                }
                const newUser = {
                    ...userData,
                    id: `USR-${Date.now()}`
                };
                const updatedUsers = [
                    ...users,
                    newUser
                ];
                setUsers(updatedUsers);
                localStorage.setItem('users', JSON.stringify(updatedUsers));
                toast({
                    title: "User Added",
                    description: `${userData.name} has been created.`
                });
                return true;
            } catch (error) {
                toast({
                    title: "Error",
                    description: `Failed to add user. ${error.message}`,
                    variant: 'destructive'
                });
                return false;
            }
        }
    }["AuthProvider.useCallback[addUser]"], [
        users,
        toast
    ]);
    const updateUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[updateUser]": async (userId, userData)=>{
            try {
                // Check for username collision if username is being changed
                if (userData.username && users.some({
                    "AuthProvider.useCallback[updateUser]": (u)=>u.id !== userId && u.username.toLowerCase() === userData.username.toLowerCase()
                }["AuthProvider.useCallback[updateUser]"])) {
                    toast({
                        title: "Username Exists",
                        description: "This username is already taken.",
                        variant: 'destructive'
                    });
                    return false;
                }
                const updatedUsers = users.map({
                    "AuthProvider.useCallback[updateUser].updatedUsers": (u)=>u.id === userId ? {
                            ...u,
                            ...userData
                        } : u
                }["AuthProvider.useCallback[updateUser].updatedUsers"]);
                setUsers(updatedUsers);
                localStorage.setItem('users', JSON.stringify(updatedUsers));
                // If the currently logged-in user is the one being updated, update their session data too
                if (user && user.id === userId) {
                    const newSessionUser = updatedUsers.find({
                        "AuthProvider.useCallback[updateUser].newSessionUser": (u)=>u.id === userId
                    }["AuthProvider.useCallback[updateUser].newSessionUser"]);
                    if (newSessionUser) {
                        const sessionUser = {
                            id: newSessionUser.id,
                            username: newSessionUser.username,
                            name: newSessionUser.name,
                            roles: newSessionUser.roles,
                            activeRole: newSessionUser.roles.includes(user.activeRole) ? user.activeRole : newSessionUser.roles[0]
                        };
                        sessionStorage.setItem('user', JSON.stringify(sessionUser));
                        setUser(sessionUser);
                    }
                }
                if (!userData.password) {
                    toast({
                        title: "User Updated",
                        description: "User details have been saved."
                    });
                }
                return true;
            } catch (error) {
                toast({
                    title: "Error",
                    description: `Failed to update user. ${error.message}`,
                    variant: "destructive"
                });
                return false;
            }
        }
    }["AuthProvider.useCallback[updateUser]"], [
        users,
        toast,
        user
    ]);
    const setCustomLogo = (url)=>{
        setCustomLogoUrlState(url);
        if (url) {
            localStorage.setItem('customLogoUrl', url);
        } else {
            localStorage.removeItem('customLogoUrl');
        }
    };
    const setTheme = (newTheme)=>{
        setThemeState(newTheme);
        localStorage.setItem('app-theme', newTheme);
    };
    const value = {
        user,
        users,
        loading,
        login,
        logout,
        switchRole,
        customLogoUrl,
        setCustomLogo,
        theme,
        setTheme,
        addUser,
        updateUser
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/auth-context.tsx",
        lineNumber: 198,
        columnNumber: 10
    }, this);
}
_s1(AuthProvider, "xZ5/vkEkpVp00EaGASBk9NVyW98=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"]
    ];
});
_c1 = AuthProvider;
function useAuth() {
    _s2();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
_s2(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c, _c1;
__turbopack_context__.k.register(_c, "AppThemeProvider");
__turbopack_context__.k.register(_c1, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/lib/utils.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "cn": (()=>cn)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/ui/toast.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "Toast": (()=>Toast),
    "ToastAction": (()=>ToastAction),
    "ToastClose": (()=>ToastClose),
    "ToastDescription": (()=>ToastDescription),
    "ToastProvider": (()=>ToastProvider),
    "ToastTitle": (()=>ToastTitle),
    "ToastViewport": (()=>ToastViewport)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-toast/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
;
;
const ToastProvider = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Provider"];
const ToastViewport = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Viewport"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/toast.tsx",
        lineNumber: 16,
        columnNumber: 3
    }, this));
_c1 = ToastViewport;
ToastViewport.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Viewport"].displayName;
const toastVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full", {
    variants: {
        variant: {
            default: "border bg-background text-foreground",
            destructive: "destructive group border-destructive bg-destructive text-destructive-foreground"
        }
    },
    defaultVariants: {
        variant: "default"
    }
});
const Toast = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c2 = ({ className, variant, ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(toastVariants({
            variant
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/toast.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, this);
});
_c3 = Toast;
Toast.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"].displayName;
const ToastAction = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c4 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Action"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/toast.tsx",
        lineNumber: 62,
        columnNumber: 3
    }, this));
_c5 = ToastAction;
ToastAction.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Action"].displayName;
const ToastClose = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c6 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Close"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600", className),
        "toast-close": "",
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/src/components/ui/toast.tsx",
            lineNumber: 86,
            columnNumber: 5
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/toast.tsx",
        lineNumber: 77,
        columnNumber: 3
    }, this));
_c7 = ToastClose;
ToastClose.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Close"].displayName;
const ToastTitle = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c8 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Title"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm font-semibold", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/toast.tsx",
        lineNumber: 95,
        columnNumber: 3
    }, this));
_c9 = ToastTitle;
ToastTitle.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Title"].displayName;
const ToastDescription = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c10 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Description"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm opacity-90", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/toast.tsx",
        lineNumber: 107,
        columnNumber: 3
    }, this));
_c11 = ToastDescription;
ToastDescription.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Description"].displayName;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11;
__turbopack_context__.k.register(_c, "ToastViewport$React.forwardRef");
__turbopack_context__.k.register(_c1, "ToastViewport");
__turbopack_context__.k.register(_c2, "Toast$React.forwardRef");
__turbopack_context__.k.register(_c3, "Toast");
__turbopack_context__.k.register(_c4, "ToastAction$React.forwardRef");
__turbopack_context__.k.register(_c5, "ToastAction");
__turbopack_context__.k.register(_c6, "ToastClose$React.forwardRef");
__turbopack_context__.k.register(_c7, "ToastClose");
__turbopack_context__.k.register(_c8, "ToastTitle$React.forwardRef");
__turbopack_context__.k.register(_c9, "ToastTitle");
__turbopack_context__.k.register(_c10, "ToastDescription$React.forwardRef");
__turbopack_context__.k.register(_c11, "ToastDescription");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/ui/toaster.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "Toaster": (()=>Toaster)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/use-toast.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/toast.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function Toaster() {
    _s();
    const { toasts } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ToastProvider"], {
        children: [
            toasts.map(function({ id, title, description, action, ...props }) {
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Toast"], {
                    ...props,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid gap-1",
                            children: [
                                title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ToastTitle"], {
                                    children: title
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/toaster.tsx",
                                    lineNumber: 22,
                                    columnNumber: 25
                                }, this),
                                description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ToastDescription"], {
                                    children: description
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/toaster.tsx",
                                    lineNumber: 24,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ui/toaster.tsx",
                            lineNumber: 21,
                            columnNumber: 13
                        }, this),
                        action,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ToastClose"], {}, void 0, false, {
                            fileName: "[project]/src/components/ui/toaster.tsx",
                            lineNumber: 28,
                            columnNumber: 13
                        }, this)
                    ]
                }, id, true, {
                    fileName: "[project]/src/components/ui/toaster.tsx",
                    lineNumber: 20,
                    columnNumber: 11
                }, this);
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ToastViewport"], {}, void 0, false, {
                fileName: "[project]/src/components/ui/toaster.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/toaster.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, this);
}
_s(Toaster, "1YTCnXrq2qRowe0H/LBWLjtXoYc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"]
    ];
});
_c = Toaster;
var _c;
__turbopack_context__.k.register(_c, "Toaster");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_4e66a04e._.js.map