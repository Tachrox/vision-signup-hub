
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { clearUserId } from "@/services/storage";
import { toast } from "@/hooks/use-toast";

interface LogoutConfirmationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LogoutConfirmation({ open, onOpenChange }: LogoutConfirmationProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user session
    clearUserId();
    
    // Show success toast
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
    
    // Close the dialog
    onOpenChange(false);
    
    // Redirect to signin page
    navigate("/signin");
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to logout? You will need to sign in again to access your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600"
          >
            Logout
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
