"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/auth-context";
import { Check, LogOut, User as UserIcon, Users, Printer, Settings, Languages, Sun, Moon, KeyRound } from "lucide-react";
import { ChangePasswordDialog } from "./change-password-dialog";

export function UserNav() {
  const { user, logout, switchRole, theme, setTheme } = useAuth();
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  if (!user) {
    return null;
  }

  const getInitials = (name: string) => {
    const nameParts = name.split(" ");
    if (nameParts.length > 1) {
        return nameParts[0][0] + nameParts[nameParts.length - 1][0];
    }
    return nameParts[0].slice(0, 2);
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    await setTheme(newTheme);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSettings = () => {
    // Add your settings navigation logic here
    console.log("Settings clicked");
  };

  const handleLanguages = () => {
    // Add your language switching logic here
    console.log("Languages clicked");
  };

  return (
    <>
    <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8" 
          onClick={handlePrint}
          title="Print"
        >
          <Printer className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8" 
          onClick={handleSettings}
          title="Settings"
        >
          <Settings className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8" 
          onClick={handleLanguages}
          title="Languages"
        >
          <Languages className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleTheme} 
          className="h-8 w-8 relative"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>

        <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
            <Avatar className="h-9 w-9 border">
                <AvatarFallback className="bg-primary text-primary-foreground">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                {user.username}
                </p>
            </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
            <DropdownMenuItem>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
            </DropdownMenuItem>
             <DropdownMenuItem onClick={() => setIsPasswordDialogOpen(true)}>
                <KeyRound className="mr-2 h-4 w-4" />
                <span>Change Password</span>
            </DropdownMenuItem>
            {user.roles.length > 1 && (
                <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                    <Users className="mr-2 h-4 w-4" />
                    <span>Switch Role</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                    <DropdownMenuLabel>Active as: {user.activeRole}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {user.roles.map((role) => (
                        <DropdownMenuItem key={role} onClick={() => switchRole(role)}>
                        <div className="w-4 mr-2">
                            {user.activeRole === role && <Check className="h-4 w-4" />}
                        </div>
                        <span className="capitalize">{role.replace(/-/g, ' ')}</span>
                        </DropdownMenuItem>
                    ))}
                    </DropdownMenuSubContent>
                </DropdownMenuPortal>
                </DropdownMenuSub>
            )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
            </DropdownMenuItem>
        </DropdownMenuContent>
        </DropdownMenu>
    </div>
    <ChangePasswordDialog isOpen={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen} />
    </>
  );
}