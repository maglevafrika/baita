"use client";

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Trash2, Loader2, CircleSlash, Users, User, ArrowRight } from "lucide-react";
import { useDatabase } from '@/context/database-context';
import { useAuth } from '@/context/auth-context';
import { Semester, Incompatibility, StudentProfile, UserInDb } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

// Add Exclusion Dialog Component
const exclusionSchema = z.object({
  type: z.enum(['teacher-student', 'student-student'], { required_error: "Please select a rule type." }),
  person1Id: z.string().min(1, "Please select the first person."),
  person2Id: z.string().min(1, "Please select the second person."),
  reason: z.string().min(10, "Reason must be at least 10 characters."),
}).refine(data => data.person1Id !== data.person2Id, {
    message: "You cannot select the same person twice.",
    path: ["person2Id"],
});

type ExclusionFormValues = z.infer<typeof exclusionSchema>;

function AddExclusionDialog({ semester, onExclusionAdded }: { semester: Semester, onExclusionAdded: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { addIncompatibility, students } = useDatabase();
  const { users } = useAuth();
  const teachers = users.filter(u => u.roles.includes('teacher'));

  const form = useForm<ExclusionFormValues>({
    resolver: zodResolver(exclusionSchema),
  });
  
  const ruleType = form.watch('type');
  const person1Id = form.watch('person1Id');

  const getPersonName = (id: string) => {
    const student = students.find(s => s.id === id);
    if(student) return student.name;
    const teacher = teachers.find(t => t.id === id);
    if(teacher) return teacher.name;
    return 'Unknown';
  }

  const onSubmit = async (data: ExclusionFormValues) => {
    if (!semester.id) {
      toast({
        title: "Error",
        description: "Semester ID is missing.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const newIncompatibility: Omit<Incompatibility, 'id' | 'createdAt'> = {
        type: data.type,
        person1Id: data.person1Id,
        person1Name: getPersonName(data.person1Id),
        person2Id: data.person2Id,
        person2Name: getPersonName(data.person2Id),
        reason: data.reason,
        semesterId: semester.id,
      };

      await addIncompatibility(newIncompatibility);
      
      toast({ title: "Exclusion Rule Added", description: "The new rule has been saved." });
      onExclusionAdded();
      setIsOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error adding incompatibility:', error);
      toast({
        title: "Error",
        description: "Failed to add exclusion rule. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const person1Options = ruleType === 'teacher-student' ? teachers : students.filter(s => s.status !== 'deleted');
  const person2Options = students.filter(s => s.status !== 'deleted');

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2" /> Add Exclusion Rule
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Exclusion Rule</DialogTitle>
          <DialogDescription>
            Prevent two individuals from being scheduled in the same class.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <FormField control={form.control} name="type" render={({ field }) => (
                <FormItem><FormLabel>Rule Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select a rule type..." /></SelectTrigger></FormControl>
                    <SelectContent>
                        <SelectItem value="teacher-student">Teacher vs. Student</SelectItem>
                        <SelectItem value="student-student">Student vs. Student</SelectItem>
                    </SelectContent>
                </Select><FormMessage /></FormItem>
            )} />
            
            {ruleType && (
                <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="person1Id" render={({ field }) => (
                        <FormItem><FormLabel>{ruleType === 'teacher-student' ? 'Teacher' : 'Student 1'}</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger></FormControl>
                            <SelectContent><ScrollArea className="h-48">{person1Options.map(p => <SelectItem key={p.id} value={p.id!}>{p.name}</SelectItem>)}</ScrollArea></SelectContent>
                        </Select><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="person2Id" render={({ field }) => (
                        <FormItem><FormLabel>Student</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger></FormControl>
                            <SelectContent><ScrollArea className="h-48">{person2Options.filter(s => s.id !== person1Id).map(p => <SelectItem key={p.id} value={p.id!}>{p.name}</SelectItem>)}</ScrollArea></SelectContent>
                        </Select><FormMessage /></FormItem>
                    )} />
                </div>
            )}
            
            <FormField control={form.control} name="reason" render={({ field }) => (
                <FormItem><FormLabel>Reason</FormLabel><FormControl>
                    <Textarea placeholder="Provide a reason for this exclusion rule..." {...field} />
                </FormControl><FormMessage /></FormItem>
            )} />

            <DialogFooter>
              <Button type="submit" disabled={isLoading || !ruleType}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Rule
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// Main Page Component
export default function ExclusionsPage() {
  const { semesters, incompatibilities, loading: dbLoading, deleteIncompatibility } = useDatabase();
  const { toast } = useToast();
  const [selectedSemesterId, setSelectedSemesterId] = useState<string | null>(null);
  
  const selectedSemester = useMemo(() => {
    return semesters.find(s => s.id === selectedSemesterId);
  }, [semesters, selectedSemesterId]);

  // Get incompatibilities for the selected semester
  const selectedSemesterIncompatibilities = useMemo(() => {
    if (!selectedSemesterId) return [];
    return incompatibilities.filter(inc => inc.semesterId === selectedSemesterId);
  }, [incompatibilities, selectedSemesterId]);

  useEffect(() => {
    if (!selectedSemesterId && semesters.length > 0) {
      setSelectedSemesterId(semesters[0].id || null);
    }
  }, [semesters, selectedSemesterId]);

  const handleDeleteExclusion = async (exclusionId: string) => {
    try {
      await deleteIncompatibility(exclusionId);
      toast({ title: "Exclusion Removed", description: "The rule has been successfully deleted." });
    } catch (error) {
      console.error('Error deleting incompatibility:', error);
      toast({
        title: "Error",
        description: "Failed to delete exclusion rule. Please try again.",
        variant: "destructive",
      });
    }
  };

  const onExclusionAdded = () => {
    // The real-time listener will automatically update the incompatibilities
  };
  
  const getIcon = (type: Incompatibility['type']) => {
    return type === 'teacher-student' ? <User className="h-4 w-4 text-muted-foreground" /> : <Users className="h-4 w-4 text-muted-foreground" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
          <CircleSlash className="w-8 h-8" />
          Exclusion Rules
        </h1>
        {selectedSemester && <AddExclusionDialog semester={selectedSemester} onExclusionAdded={onExclusionAdded}/>}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Exclusions</CardTitle>
          <CardDescription>Select a semester to view or modify its scheduling exclusion rules.</CardDescription>
        </CardHeader>
        <CardContent>
          {dbLoading ? (
            <div className="flex justify-center items-center h-24">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Select value={selectedSemesterId ?? ""} onValueChange={setSelectedSemesterId}>
              <SelectTrigger className="w-full md:w-1/3">
                <SelectValue placeholder="Select a semester" />
              </SelectTrigger>
              <SelectContent>
                {semesters.map(s => <SelectItem key={s.id} value={s.id!}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>
      
      {selectedSemester && (
        <Card>
          <CardHeader>
            <CardTitle>Exclusion List for {selectedSemester.name}</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedSemesterIncompatibilities && selectedSemesterIncompatibilities.length > 0 ? (
                <ul className="space-y-3">
                    {selectedSemesterIncompatibilities.map(ex => (
                        <li key={ex.id} className="flex justify-between items-center p-3 border rounded-md bg-muted/50">
                           <div className="flex-grow">
                             <div className="flex items-center gap-4 mb-2">
                                {getIcon(ex.type)}
                                <span className="font-semibold">{ex.person1Name}</span>
                                <ArrowRight className="h-4 w-4 text-destructive" />
                                <span className="font-semibold">{ex.person2Name}</span>
                             </div>
                             <p className="text-sm text-muted-foreground pl-8">{ex.reason}</p>
                           </div>
                           <Button variant="destructive" size="icon" onClick={() => handleDeleteExclusion(ex.id!)}>
                               <Trash2 className="h-4 w-4" />
                           </Button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-muted-foreground py-8">No exclusion rules have been set for this semester.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}