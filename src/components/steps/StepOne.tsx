import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import useQuoteStore from "@/store/useQuoteStore";

function StepOne() {
  const { payload, setPayload, nextStep } = useQuoteStore();

  const [destination, setDestination] = useState(payload.destination);
  const [startDate, setStartDate] = useState(payload.start_date);
  const [endDate, setEndDate] = useState(payload.end_date);

  function handleNext() {
    setPayload({
      ...payload,
      destination,
      start_date: startDate,
      end_date: endDate,
    });

    nextStep();
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Dados da Viagem</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label>Destino</Label>

          <Select value={destination} onValueChange={setDestination}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o destino" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="NATIONAL">Nacional</SelectItem>
              <SelectItem value="AMERICAN">Américas</SelectItem>
              <SelectItem value="EUROPE">Europa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Data de Início</Label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Data de Fim</Label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <Button
          onClick={handleNext}
          disabled={!destination || !startDate || !endDate}
        >
          Próximo
        </Button>
      </CardContent>
    </Card>
  );
}

export default StepOne;
