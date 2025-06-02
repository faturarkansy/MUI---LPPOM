import CardAgentPelakuUsaha from "../../../components/card/CardAgentPelakuUsaha";

const AgentPelakuUsaha = () => {

  return (
    <div>
      {/* Header */}
      <div className="w-full h-20 bg-gradient-to-r from-[#1975a6] to-[#87d1f8] flex items-end justify-start px-6 py-3 mb-3 rounded-3xl text-white">
        <h1 className="font-normal text-3xl">Pelaku Usaha</h1>
      </div>

      {/* Breadcrumb */}
      <div className="w-full h-9 bg-gradient-to-r from-[#1975a6] to-[#87d1f8] flex items-center justify-start px-6 py-3 rounded-3xl text-white">
        <ol className="flex items-center font-medium whitespace-nowrap">
          <li className="inline-flex items-center text-sm">Pelaku Usaha</li>
        </ol>
      </div>
      <CardAgentPelakuUsaha />
    </div>
  );
};

export default AgentPelakuUsaha;
