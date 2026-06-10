import { useState } from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

function StepOne() {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  return (
    <Card className="w-full max-w-md">
        <CardHeader>
            <CardTitle>Dados da Viagem</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
            
        </CardContent>
    </Card>
  );
}

export default StepOne;
