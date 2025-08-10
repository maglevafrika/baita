
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Calendar, Edit, Loader2 } from "lucide-react";
import { Semester } from "@/lib/types";
import { useDatabase } from '@/context/database-context';
import { SemesterDialog } from '@/components/semester-dialog';
import { format } from 'date-fns';

export default function SemestersPage() {
  const { semesters, loading } = useDatabase();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState<Semester | null>(null);

  const handleAddNew = () => {
    setSelectedSemester(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (semester: Semester) => {
    setSelectedSemester(semester);
    setIsDialogOpen(true);
  };
  
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedSemester(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
          <Calendar className="w-8 h-8" />
          Semester Management
        </h1>
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Semester
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {semesters.length > 0 ? (
            semesters.map((semester) => (
              <Card key={semester.id}>
                <CardHeader>
                  <CardTitle>{semester.name}</CardTitle>
                  <CardDescription>
                    {format(new Date(semester.startDate), 'MMM dd, yyyy')} - {format(new Date(semester.endDate), 'MMM dd, yyyy')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{semester.teachers?.length || 0} Teachers</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(semester)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Semester
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground col-span-full text-center">No semesters found. Add one to get started.</p>
          )}
        </div>
      )}
      
      <SemesterDialog
        isOpen={isDialogOpen}
        onOpenChange={handleDialogClose}
        semester={selectedSemester}
      />
    </div>
  );
}
