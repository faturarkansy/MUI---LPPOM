import { Link } from "react-router-dom";
import CardAgentPelakuUsaha from "../../../components/card/CardAgentPelakuUsaha";

const AgentPelakuUsaha = () => {
  const dataPelakuUsaha = [
    {
      id: 1,
      name: "PT A",
      product_type_id: "1",
      date: "21 Apr 2025",
      type: "new",
      status: "COST ADJUSTMENT",
    },
    {
      id: 2,
      name: "PT Kuliner Sehat April",
      product_type_id: "2",
      date: "21 Apr 2025",
      type: "development",
      status: "COST ADJUSTMENT",
    },
    {
      id: 3,
      name: "PT C",
      product_type_id: "3",
      date: "28 Apr 2025",
      type: "facilities development",
      status: "QUOTATION BY SYSTEM",
    },
  ];

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
