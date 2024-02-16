import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <Button variant="outline" size="icon" onClick={() => navigate('..')}>
      <ChevronLeft />
    </Button>
  );
};

export default BackButton;
