"use client"
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AddDoctorForm from "./newDoctor";

const NewDoctorDialog = () => {
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
      <Button variant="outline" style={{ marginBottom: '10px' }}>Add New Doctor  </Button>

      </DialogTrigger>
      <DialogContent >
        <AddDoctorForm />
      </DialogContent>
    </Dialog>
  );
};

export default NewDoctorDialog;
