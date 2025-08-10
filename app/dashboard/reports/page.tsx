

"use client";

import { useMemo } from 'react';
import { Bar, BarChart, Pie, PieChart, Cell, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useDatabase } from '@/context/database-context';
import { useApplicants } from '@/context/applicants-context';
import type { Installment } from '@/lib/types';
import { format, parseISO, startOfDay, differenceInYears } from 'date-fns';
import { LineChart as LineChartIcon, Users, DollarSign, UserCheck, Loader2, UserRound, Cake, BarChartHorizontal, TrendingUp } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const chartConfig = {
  students: { label: "Students", color: "hsl(var(--primary))" },
  paid: { label: "Paid", color: "hsl(var(--chart-1))" },
  unpaid: { label: "Unpaid", color: "hsl(var(--chart-2))" },
  overdue: { label: "Overdue", color: "hsl(var(--destructive))" },
  applicants: { label: "Applicants", color: "hsl(var(--secondary))" },
  male: { label: "Male", color: "hsl(var(--chart-1))" },
  female: { label: "Female", color: "hsl(var(--chart-2))" },
  age: { label: "Students", color: "hsl(var(--primary))" },
  saturday: { label: 'Saturday', color: '#8884d8' },
  sunday: { label: 'Sunday', color: '#82ca9d' },
  monday: { label: 'Monday', color: '#ffc658' },
  tuesday: { label: 'Tuesday', color: '#ff8042' },
  wednesday: { label: 'Wednesday', color: '#0088FE' },
  thursday: { label: 'Thursday', color: '#00C49F' },
  friday: { label: 'Friday', color: '#FFBB28' },
  expected: { label: 'Expected', color: 'hsl(var(--chart-1))' },
  collected: { label: 'Collected', color: 'hsl(var(--chart-3))' },
};

// Main Page Component
export default function ReportsPage() {
    const { students, semesters, loading: dbLoading } = useDatabase();
    const { applicants, loading: appLoading } = useApplicants();

    // 1. Enrollment Data
    const enrollmentData = useMemo(() => {
        const countsByMonth: { [key: string]: number } = {};
        students.forEach(student => {
            if (student.enrollmentDate) {
                try {
                    const month = format(parseISO(student.enrollmentDate), 'MMM yyyy');
                    countsByMonth[month] = (countsByMonth[month] || 0) + 1;
                } catch(e) {
                    console.error("Invalid date format for student:", student.id, student.enrollmentDate);
                }
            }
        });
        
        const sortedMonths = Object.keys(countsByMonth).sort((a,b) => {
            const [monA, yearA] = a.split(' ');
            const [monB, yearB] = b.split(' ');
            const dateA = new Date(`${monA} 1 ${yearA}`);
            const dateB = new Date(`${monB} 1 ${yearB}`);
            return dateA.getTime() - dateB.getTime();
        });

        return sortedMonths.map(month => ({
            name: month,
            students: countsByMonth[month]
        }));
    }, [students]);
    
    // 2. Financial Data
    const financialData = useMemo(() => {
        const stats = { paid: 0, unpaid: 0, overdue: 0, total: 0 };
        const today = startOfDay(new Date());

        students.forEach(student => {
            if(student.installments) {
                student.installments.forEach((inst: Installment) => {
                    stats.total += inst.amount;
                    if(inst.status === 'paid') {
                        stats.paid += inst.amount;
                    } else {
                        const dueDate = startOfDay(parseISO(inst.dueDate));
                        if(dueDate < today) {
                            stats.overdue += inst.amount;
                        } else {
                            stats.unpaid += inst.amount;
                        }
                    }
                })
            }
        });
        
        return [
            { name: 'Paid', value: stats.paid, fill: 'var(--color-paid)' },
            { name: 'Unpaid', value: stats.unpaid, fill: 'var(--color-unpaid)' },
            { name: 'Overdue', value: stats.overdue, fill: 'var(--color-overdue)' },
        ];
    }, [students]);

    // 3. Applicant Data
    const applicantData = useMemo(() => {
        const counts = applicants.reduce((acc, applicant) => {
            acc[applicant.status] = (acc[applicant.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(counts).map(([name, value]) => ({ name: name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), count: value }));
    }, [applicants]);

    // 4. Gender Data
    const genderData = useMemo(() => {
        const counts = students.reduce((acc, student) => {
            const gender = student.gender || 'unknown';
            acc[gender] = (acc[gender] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return [
            { name: 'Male', value: counts.male || 0, fill: 'var(--color-male)' },
            { name: 'Female', value: counts.female || 0, fill: 'var(--color-female)' },
        ];
    }, [students]);

    // 5. Age Group Data
    const ageGroupData = useMemo(() => {
        const ageGroups: { [key: string]: number } = {
            'Under 18': 0,
            '18-24': 0,
            '25-34': 0,
            '35-44': 0,
            '45+': 0,
        };

        const today = new Date();
        students.forEach(student => {
            if (student.dob) {
                const age = differenceInYears(today, parseISO(student.dob));
                if (age < 18) ageGroups['Under 18']++;
                else if (age <= 24) ageGroups['18-24']++;
                else if (age <= 34) ageGroups['25-34']++;
                else if (age <= 44) ageGroups['35-44']++;
                else ageGroups['45+']++;
            }
        });

        return Object.entries(ageGroups).map(([name, count]) => ({ name, students: count }));
    }, [students]);

    // 6. Teacher Workload Data
    const teacherWorkloadData = useMemo(() => {
        if (!semesters.length) return [];
        const activeSemester = semesters[0];
        const { masterSchedule } = activeSemester;

        return Object.entries(masterSchedule).map(([teacherName, schedule]) => {
            const workload: { [day: string]: number } = {
                saturday: 0, sunday: 0, monday: 0, tuesday: 0, wednesday: 0, thursday: 0
            };
            Object.entries(schedule).forEach(([day, sessions]) => {
                const totalHours = sessions.reduce((acc, session) => acc + session.duration, 0);
                const dayKey = day.toLowerCase();
                if(dayKey in workload) {
                    workload[dayKey] = totalHours;
                }
            });
            return { name: teacherName, ...workload };
        });
    }, [semesters]);

    // 7. Expected Revenue
    const expectedRevenueData = useMemo(() => {
        const stats = {
            expected: 0,
            collected: 0,
        };

        students.forEach(student => {
            if(student.installments) {
                student.installments.forEach((inst: Installment) => {
                    stats.expected += inst.amount;
                    if(inst.status === 'paid') {
                        stats.collected += inst.amount;
                    }
                });
            }
        });
        
        return [
            { name: 'Revenue', expected: stats.expected, collected: stats.collected }
        ];
    }, [students]);


    const loading = dbLoading || appLoading;

    if (loading) {
        return <div className="flex h-[80vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <LineChartIcon className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-bold font-headline">Reports & Analytics</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                 <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Users /> Student Enrollment Trends</CardTitle>
                        <CardDescription>New student enrollments per month.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-64 w-full">
                            <BarChart data={enrollmentData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
                                <YAxis />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar dataKey="students" fill="var(--color-students)" radius={4} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><DollarSign /> Financial Overview</CardTitle>
                         <CardDescription>Breakdown of all installment payments.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <ChartContainer config={chartConfig} className="h-64 w-full">
                            <PieChart>
                                <ChartTooltip content={<ChartTooltipContent nameKey="value" />} />
                                <Pie data={financialData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                                    {financialData.map((entry) => (
                                        <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <ChartLegend content={<ChartLegendContent />} />
                            </PieChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                 <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><UserCheck /> Applicant Funnel</CardTitle>
                        <CardDescription>Current status of all applications.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <ChartContainer config={chartConfig} className="h-64 w-full">
                            <BarChart data={applicantData} layout="vertical" margin={{ top: 20, right: 20, left: 40, bottom: 0 }}>
                                <CartesianGrid horizontal={false} />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={8} width={120} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar dataKey="count" fill="var(--color-applicants)" radius={4} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><UserRound /> Gender Distribution</CardTitle>
                         <CardDescription>Breakdown of student gender.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <ChartContainer config={chartConfig} className="h-64 w-full">
                            <PieChart>
                                <ChartTooltip content={<ChartTooltipContent nameKey="value" />} />
                                <Pie data={genderData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                                    {genderData.map((entry) => (
                                        <Cell key={`cell-gender-${entry.name}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <ChartLegend content={<ChartLegendContent />} />
                            </PieChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                 <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Cake /> Age Groups</CardTitle>
                        <CardDescription>Distribution of students by age group.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-64 w-full">
                            <BarChart data={ageGroupData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
                                <YAxis />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar dataKey="students" fill="var(--color-age)" radius={4} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                 <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><TrendingUp /> Expected Revenue</CardTitle>
                        <CardDescription>Comparison of expected revenue from subscriptions versus collected payments.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-64 w-full">
                           <BarChart data={expectedRevenueData} margin={{ top: 20, right: 20, bottom: 10, left: 20 }}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                                <YAxis tickFormatter={(value) => `SAR ${value/1000}k`} />
                                <ChartTooltip content={<ChartTooltipContent formatter={(value, name) => `SAR ${value.toLocaleString()}`} />} />
                                <ChartLegend content={<ChartLegendContent />} />
                                <Bar dataKey="expected" fill="var(--color-expected)" radius={4} />
                                <Bar dataKey="collected" fill="var(--color-collected)" radius={4} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BarChartHorizontal /> Teacher Workload</CardTitle>
                        <CardDescription>Weekly scheduled hours per teacher, broken down by day.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[400px] w-full">
                            <BarChart data={teacherWorkloadData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid horizontal={false} />
                                <XAxis type="number" />
                                <YAxis type="category" dataKey="name" width={80} tickLine={false} axisLine={false} />
                                <Tooltip content={<ChartTooltipContent />} />
                                <Legend />
                                <Bar dataKey="saturday" stackId="a" fill="var(--color-saturday)" name="Saturday" />
                                <Bar dataKey="sunday" stackId="a" fill="var(--color-sunday)" name="Sunday" />
                                <Bar dataKey="monday" stackId="a" fill="var(--color-monday)" name="Monday" />
                                <Bar dataKey="tuesday" stackId="a" fill="var(--color-tuesday)" name="Tuesday" />
                                <Bar dataKey="wednesday" stackId="a" fill="var(--color-wednesday)" name="Wednesday" />
                                <Bar dataKey="thursday" stackId="a" fill="var(--color-thursday)" name="Thursday" />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
