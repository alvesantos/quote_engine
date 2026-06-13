import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import useQuoteStore from "@/store/useQuoteStore";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const stepTwoSchema = z.object({
  travelers: z.array(
    z.object({
      name: z.string().min(1, "O nome é obrigatório"),
      birth_date: z.string().min(1, "A data de nascimento é obrigatória"),
      addons: z.array(z.string()),
    }),
  ),
});

type StepTwoValues = z.infer<typeof stepTwoSchema>;

function StepTwo() {
  const { payload, setPayload, prevStep, submitQuote, loading } =
    useQuoteStore();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<StepTwoValues>({
    resolver: zodResolver(stepTwoSchema),
    
    defaultValues: {
      travelers:
        payload.travelers.length > 0
          ? payload.travelers
          : [{ name: "", birth_date: "", addons: [] }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "travelers",
  });

  const watchedTravelers = useWatch({ control, name: "travelers" }) || [];

  const onSubmit = async (data: StepTwoValues) => {
    setPayload({ ...payload, travelers: data.travelers });
    await submitQuote();
  };

  function toggleAddon(index: number, addon: string) {
    const currentAddons = watchedTravelers[index]?.addons || [];
    
    const updatedAddons = currentAddons.includes(addon)
      ? currentAddons.filter((a) => a !== addon)
      : [...currentAddons, addon];

    setValue(`travelers.${index}.addons`, updatedAddons);
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Viajantes</CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="flex flex-col gap-6">
          {fields.map((field, index) => {
            const nameError = errors.travelers?.[index]?.name;
            const birthDateError = errors.travelers?.[index]?.birth_date;

            return (
              <div
                key={field.id}
                className="flex flex-col gap-3 border p-4 rounded-lg"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">Viajante {index + 1}</span>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500 text-sm cursor-pointer"
                    >
                      Remover
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label className={nameError ? "text-red-500" : ""}>
                    Nome
                  </Label>
                  <Input
                    {...register(`travelers.${index}.name`)}
                    placeholder="Nome completo"
                    className={
                      nameError
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }
                  />
                  {nameError && (
                    <p className="text-xs text-red-500 mt-0.5">
                      {nameError.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label className={birthDateError ? "text-red-500" : ""}>
                    Data de Nascimento
                  </Label>
                  <Input
                    type="date"
                    {...register(`travelers.${index}.birth_date`)}
                    className={
                      birthDateError
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }
                  />
                  {birthDateError && (
                    <p className="text-xs text-red-500 mt-0.5">
                      {birthDateError.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Adicionais</Label>
                  <div className="flex gap-4">
                    {["BAGGAGE", "ADVENTURE_SPORTS"].map((addon) => (
                      <label
                        key={addon}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={
                            watchedTravelers[index]?.addons?.includes(addon) ||
                            false
                          }
                          onChange={() => toggleAddon(index, addon)}
                        />
                        <span className="text-sm">
                          {addon === "BAGGAGE"
                            ? "Bagagem"
                            : "Esportes de Aventura"}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          <button
            type="button"
            onClick={() => append({ name: "", birth_date: "", addons: [] })}
            className="text-blue-500 text-sm text-left hover:underline cursor-pointer"
          >
            + Adicionar viajante
          </button>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              className="flex-1 cursor-pointer"
            >
              Voltar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 cursor-pointer">
              {loading ? "Calculando..." : "Confirmar"}
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}

export default StepTwo;
