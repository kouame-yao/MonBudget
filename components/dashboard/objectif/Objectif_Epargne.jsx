import { Trophy } from "lucide-react";

export default function Objectif_Epargne() {
  return (
    <div>
      <div className="bg-blue-500 text-white p-8 shadow-md rounded-3xl flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <span className="text-4xl font-semibold">Objectif d'épargne</span>
          <Trophy size={50} />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-2xl font-light">
            <span>1,580 Fr / 2,000 Fr</span>
            <span>79%</span>
          </div>
          <div className="w-full h-4 bg-white/50 rounded-full ">
            <div className="w-20 h-4 bg-white rounded-full "></div>
          </div>
        </div>

        <div>
          <span className="text-2xl font-light">
            Plus que 420 Fr pour atteindre votre objectif !
          </span>
        </div>
      </div>
    </div>
  );
}
