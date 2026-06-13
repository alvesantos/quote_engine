import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useQuoteStore from "@/store/useQuoteStore";
import {
  Calendar,
  MapPin,
  Users,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";

function StepThree() {
  const { payload, result: quoteResult, prevStep } = useQuoteStore();

  if (!quoteResult) {
    return (
      <Card className="w-full max-w-lg text-center p-6">
        <p className="text-muted-foreground">Nenhuma cotação encontrada.</p>
        <Button onClick={prevStep} className="mt-4 cursor-pointer">
          Voltar
        </Button>
      </Card>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getDestinationLabel = (dest: string) => {
    const labels: Record<string, string> = {
      NATIONAL: "Nacional",
      AMERICAN: "Américas",
      EUROPE: "Europa",
    };

    return labels[dest] || dest;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <Card className="w-full max-w-xl shadow-lg">
      <CardHeader className="border-b bg-muted/20">
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-green-600" />
          Resumo da Cotação
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-6 pt-6">
        <div className="grid grid-cols-2 gap-4 bg-muted/40 p-4 rounded-lg text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground font-medium">
                DESTINO
              </p>
              <p className="font-semibold">
                {getDestinationLabel(payload.destination)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground font-medium">
                DURAÇÃO
              </p>
              <p className="font-semibold">
                {quoteResult.priced_days} dias tarifados
              </p>
            </div>
          </div>

          <div className="col-span-2 border-t pt-2 mt-1 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-muted-foreground">Início:</span>{" "}
              <span className="font-medium">{formatDate(payload.start_date)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Término:</span>{" "}
              <span className="font-medium">{formatDate(payload.end_date)}</span>
            </div>
          </div>
        </div>

        {quoteResult.warnings && quoteResult.warnings.length > 0 && (
          <div className="flex flex-col gap-2 bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-lg text-sm">
            <div className="flex items-center gap-1.5 font-medium">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              Atenção:
            </div>
            
            <ul className="list-disc list-inside text-xs space-y-0.5">
              {quoteResult.warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold flex items-center gap-1.5 text-muted-foreground">
            <Users className="h-4 w-4" /> Viajantes (
            {quoteResult.travelers?.length ?? 0})
          </h3>

          <div className="space-y-3 max-h-65 overflow-y-auto pr-1">
            {quoteResult.travelers?.map((traveler, index) => (
              <div
                key={index}
                className="border p-3 rounded-md flex flex-col gap-1.5 bg-card text-sm"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-semibold text-foreground">
                      {traveler.name}
                    </span>
                    <span className="text-xs text-muted-foreground ml-2">
                      ({traveler.age} anos)
                    </span>
                  </div>
                  <span className="font-medium text-slate-700">
                    {formatCurrency(traveler.subtotal)}
                  </span>
                </div>

                {traveler.addons_allowed && traveler.addons_allowed.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {traveler.addons_allowed.map((addon) => (
                      <span
                        key={addon}
                        className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full font-medium"
                      >
                        {addon === "BAGGAGE"
                          ? "Bagagem"
                          : "Esportes de Aventura"}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-4 space-y-2">
          {quoteResult.discount_group_percentage > 0 && (
            <div className="flex justify-between text-sm text-green-600 font-medium">
              <span>
                Desconto em Grupo ({quoteResult.discount_group_percentage || 0}%)
              </span>
              <span>Ativado</span>
            </div>
          )}
          <div className="flex justify-between items-baseline pt-1">
            <span className="text-base font-bold text-foreground">
              Valor Total Final
            </span>
            <span className="text-2xl font-black text-primary">
              {formatCurrency(quoteResult.total_final || 0)}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t bg-muted/10 flex gap-3 pt-4">
        <Button variant="outline" onClick={prevStep} className="flex-1 cursor-pointer">
          Voltar e Editar
        </Button>
        <Button
          className="flex-1 bg-green-600 hover:bg-green-700 text-white cursor-pointer"
        >
          Ir para o Pagamento
        </Button>
      </CardFooter>
    </Card>
  );
}

export default StepThree;
