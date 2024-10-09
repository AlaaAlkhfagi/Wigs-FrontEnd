import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CreateUserForm from "./newTask";
import CreateTaskForm from "./newTask";

const NewTaskDialog = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <Dialog>
         <DialogTrigger style={{ margin: '20px' }}>
      <Button variant="outline" style={{ marginBottom: '20px' }}>Add New Task</Button>

      </DialogTrigger>
      <DialogContent className="w-1/4 h-100 p-8 rounded-md bg-white shadow-lg">
        <CreateTaskForm />
      </DialogContent>
    </Dialog>
  );
};

export default NewTaskDialog;
