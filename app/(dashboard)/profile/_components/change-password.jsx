'use client'

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export const ChangePassword = ({data}) => {
    const { toast } = useToast();
    const router = useRouter();

    const [passwordData, setPasswordData] = useState({
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
  
    const [confirmOldPassword, setConfirmOldPassword] = useState(false);
    const [passwordValid, setPasswordValid] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(false);
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setPasswordData(prevData => ({
        ...prevData,
        [name]: value
      }));
    };
  
    const validatePassword = (password) => {
      const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
      return passwordRegex.test(password);
    };
  
    const handleNewPasswordChange = (e) => {
      const newPassword = e.target.value;
      setPasswordData(prevData => ({
        ...prevData,
        newPassword,
      }));
      setPasswordValid(validatePassword(newPassword));
    };
  
    const handleConfirmPasswordChange = (e) => {
      const confirmNewPassword = e.target.value;
      setPasswordData(prevData => ({
        ...prevData,
        confirmNewPassword,
      }));
      setPasswordsMatch(confirmNewPassword === passwordData.newPassword);
    };


  const handleConfirmPassword = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/auth/compare-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          oldPassword: passwordData.oldPassword,
          hashedPassword: data.hashedPassword,
        })
      });

      if (!response.ok) {
        throw new Error("Failed to compare passwords");
      }

      const { isOldPasswordCorrect } = await response.json();

      if (isOldPasswordCorrect) {
        setConfirmOldPassword(true);
      } else {
        toast({
            title: "Uh oh...",
            description: "Incorrect password",
            status: "failed",
        });
      }
    } catch (error) {
      console.error("Error comparing passwords:", error);
      toast({
        title: "Uh oh...",
        description: "Incorrect password",
        status: "failed",
    });
    }
  };

  const handleUpdatePassword = async (event) => {
    event.preventDefault();
  
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
        toast({
            title: "Uh oh...",
            description: "Passwords do not match",
            status: "failed",
        });
    return;
    }
  
    try {
      const response = await fetch("/api/auth/update-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newPassword: passwordData.newPassword,
          userId: data.id,
        })
      });
  
      if (!response.ok) {
        toast({
            title: "Uh oh...",
            description: "Please try again later...",
            status: "failed",
        });
        throw new Error("Failed to update password");
      }
  
      toast({
        title: "Success",
        description: "Successfully updated the password",
        status: "Success",
     });
     router.refresh();    
} catch (error) {
      console.error("Error updating password:", error);
      toast({
        title: "Uh oh...",
        description: "Please try again later...",
        status: "failed",
    });
    }
  };
  

  return (
    <form onSubmit={confirmOldPassword ? handleUpdatePassword : handleConfirmPassword}>      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {!confirmOldPassword && (
          <div className="flex flex-col space-y-2 justify-end">
            <label htmlFor="oldPassword">Enter old password:</label>
            <Input 
              type="password" 
              id="oldPassword" 
              name="oldPassword"
              placeholder="Old Password" 
              onChange={handleInputChange} 
              value={passwordData.oldPassword} 
              className="border border-black text-sm text-black rounded-xl bg-slate-200 p-2" 
              required
            />
          </div>
        )}
         {confirmOldPassword && (
          <>
            <div>
            <label htmlFor="newPassword">Enter new password:</label>
            <Input 
            type="password" 
            id="newPassword" 
            name="newPassword"
            placeholder="New Password" 
            onChange={handleNewPasswordChange} 
            value={passwordData.newPassword} 
            className="border border-black text-sm text-black rounded-xl bg-slate-200 p-2" 
            required
            />
            <div>
              <span>Password must contain at least one number, one uppercase letter, one lowercase letter, and be at least 8 characters long.</span>
              {passwordValid ? <span className="text-green-500"> Valid </span> : <span className="text-red-500"> Invalid </span>}
            </div>
            </div>
            <div>
            <label htmlFor="confirmNewPassword">Confirm new password:</label>
            <Input 
            type="password" 
            id="confirmNewPassword" 
            name="confirmNewPassword"
            placeholder="Confirm New Password" 
            onChange={handleConfirmPasswordChange} 
            value={passwordData.confirmNewPassword} 
            className="border border-black text-sm text-black rounded-xl bg-slate-200 p-2" 
            required
            />
            {passwordsMatch ? <span className="text-green-500"> Passwords match </span> : <span className="text-red-500"> Passwords do not match </span>}
            </div>
            </>
        )}

      </div>
      <div className="flex m-4 justify-end">
        <Button type="submit">{confirmOldPassword ? "Update Password" : "Confirm Old Password"}</Button>
      </div>
    </form>
  );
};
