import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import useQuoteStore from "@/store/useQuoteStore";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const today = new Date();
today.setHours(0, 0, 0, 0);

const stepOneSchema = z.object({
  destination: z.string().min(1, "O destino é obrigatório"),
  start_date: z.string().min(1, "A data de início é obrigatória"),
  end_date: z.string().min(1, "A data de fim é obrigatória"),
})
.refine((data) => {
  if (!data.start_date) return true;
  return new Date(data.start_date) >= today;
}, {
  message: "A data de início não pode ser no passado",
  path: ["start_date"],
})
.refine((data) => {
  if (!data.start_date || !data.end_date) return true;
  return new Date(data.end_date) >= new Date(data.start_date);
}, {
  message: "A data de fim deve ser igual ou posterior à data de início",
  path: ["end_date"],
});

type StepOneValues = z.infer<typeof stepOneSchema>;

function StepOne() {
  const { payload, setPayload, nextStep } = useQuoteStore();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<StepOneValues>({
    resolver: zodResolver(stepOneSchema),
    defaultValues: {
      destination: payload.destination || "",
      start_date: payload.start_date || "",
      end_date: payload.end_date || "",
    },
  });

  const onSubmit = (data: StepOneValues) => {
    setPayload({
      ...payload,
      ...data,
    });
    nextStep();
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Dados da Viagem</CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label className={errors.destination ? "text-red-500" : ""}>
              Destino
            </Label>
            <Controller
              name="destination"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger
                    className={`w-full ${errors.destination ? "border-red-500" : ""}`}
                  >
                    <SelectValue placeholder="Selecione o destino" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NATIONAL">Nacional</SelectItem>
                    <SelectItem value="AMERICAN">Américas</SelectItem>
                    <SelectItem value="EUROPE">Europa</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.destination && (
              <p className="text-xs text-red-500">
                {errors.destination.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label className={errors.start_date ? "text-red-500" : ""}>
              Data de Início
            </Label>
            
            <Input
              type="date"
              {...register("start_date")}
              className={
                errors.start_date
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }
            />

            {errors.start_date && (
              <p className="text-xs text-red-500">
                {errors.start_date.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label className={errors.end_date ? "text-red-500" : ""}>
              Data de Fim
            </Label>
            
            <Input
              type="date"
              {...register("end_date")}
              className={
                errors.end_date
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }
            />

            {errors.end_date && (
              <p className="text-xs text-red-500">{errors.end_date.message}</p>
            )}
          </div>

          <Button type="submit" className="mt-2 cursor-pointer">
            Próximo
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}

export default StepOne;
