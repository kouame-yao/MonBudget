import React from "react";
import Wrapper from "../../layout/Wrapper";
import Analayse_taux from "../../components/analayses/analyse_vue/Analayse_taux";
import DailyFlowChart from "../../components/analayses/diagramme/DailyFlowChart";
import CategoryPieChart from "../../components/analayses/diagramme/CategoryPieChart";
import YearlyTrendsChart from "../../components/analayses/diagramme/YearlyTrendsChart";

export default function analyses() {
  return (
    <Wrapper>
      <main className="flex flex-col gap-10 mb-20">
        <section className="flex justify-between items-center mb-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl md:text-3xl font-bold">
              Analyses financières
            </h1>
            <p className="text-sm md:text-base text-gray-700">
              Analysez vos habitudes de dépenses et suivez vos progrès
              financiers
            </p>
          </div>
        </section>

        <section>
          <Analayse_taux />
        </section>
        <section className="grid md:flex gap-8 w-full">
          <DailyFlowChart />
          <CategoryPieChart />
        </section>
        <section>
          <YearlyTrendsChart />
        </section>
      </main>
    </Wrapper>
  );
}
