import { Trophy } from "lucide-react";

export default function Objectif_Epargne() {
  return (
    <div className="w-full max-w-sm md:max-w-md mx-auto p-2 sm:p-3 md:p-4">
      <div className="bg-blue-500 text-white p-3 sm:p-4 md:p-5 shadow-md rounded-xl flex flex-col gap-3 sm:gap-4 md:gap-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-1 sm:gap-2 md:gap-3">
          <span className="text-lg sm:text-xl md:text-2xl font-semibold">
            Objectif d'épargne
          </span>
          <Trophy size={28} className="sm:w-8 sm:h-8 md:w-10 md:h-10" />
        </div>

        <div className="flex flex-col gap-1 sm:gap-2">
          <div className="flex items-center justify-between text-sm sm:text-base md:text-lg font-light">
            <span>1,580 Fr / 2,000 Fr</span>
            <span>79%</span>
          </div>
          <div className="w-full h-2 sm:h-3 md:h-3 bg-white/50 rounded-full">
            <div className="w-3/4 h-2 sm:h-3 md:h-3 bg-white rounded-full transition-all duration-500"></div>
          </div>
        </div>

        <div>
          <span className="text-sm sm:text-base md:text-lg font-light block">
            Plus que 420 Fr pour atteindre votre objectif !
          </span>
        </div>
      </div>
    </div>
  );
}
