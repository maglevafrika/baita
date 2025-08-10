
"use client";

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { StudentProfile } from '@/lib/types';
import { useDatabase } from '@/context/database-context';
import { Loader2 } from 'lucide-react';

interface DeleteStudentDialogProps {
  student: StudentProfile;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DeleteStudentDialog({ student, isOpen, onOpenChange, onSuccess }: DeleteStudentDialogProps) {
  const { deleteStudent } = useDatabase();
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    const success = await deleteStudent(student.id, reason || "No reason provided.");
    setIsLoading(false);
    if (success) {
      onOpenChange(false);
      setReason('');
      if (onSuccess) {
        onSuccess();
      }
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this student?</AlertDialogTitle>
          <AlertDialogDescription>
            This will mark the student '{student.name}' as deleted and un-enroll them from all classes. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-2">
            <Label htmlFor="reason">Reason for deletion (optional)</Label>
            <Textarea 
                id="reason"
                placeholder="e.g., Student has moved to another city."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
            />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Deletion
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
