import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CreateUserForm from "./CreateUserForm";

const NewUserDialog = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline" style={{ marginBottom: '10px' }}>Add New User</Button>
      </DialogTrigger>
      <DialogContent className="w-1/4 h-100 p-8 rounded-md bg-white shadow-lg">
        <CreateUserForm />
      </DialogContent>
    </Dialog>
  );
};

export default NewUserDialog;
