import { useEffect, useState } from "react";
import axiosClient from "../../../axios-client";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";

interface Modul {
  id: number;
  name: string;
  info: string;
  url: string;
  type: string;
}

const MHOLearningModule = () => {
  const [modules, setModules] = useState<Modul[]>([]);
  const [selectedModule, setSelectedModule] = useState<Modul | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClient.get("/ext/medias");
        const rawData = response.data.data;

        const formattedData = rawData.map((item: any) => ({
          id: item.id,
          name: item.name,
          info: item.info,
          url: item.url,
          type: item.type,
        }));

        setModules(formattedData);
      } catch (error) {
        console.error("Error fetching module content:", error);
      }
    };

    fetchData();
  }, []);

  // Fungsi untuk close modal
  const closeModal = () => {
    setSelectedModule(null);
  };

  // Fungsi untuk generate embed URL Youtube
  const getYoutubeEmbedUrl = (url: string) => {
    const videoIdMatch = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/
    );
    return videoIdMatch
      ? `https://www.youtube.com/embed/${videoIdMatch[1]}`
      : url;
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="E-Learning" />
      {/* Card Grid */}
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-4">
        {modules.map((item) => (
          <div
            key={item.id}
            className="border-2 border-[#7EC34B] rounded-xl flex flex-col items-center space-y-2 shadow-sm"
          >
            {/* Top Row: Icon + Type + Learn Button */}
            <div className="grid grid-cols-2 w-full px-6 pt-4">
              <div className="flex flex-col items-center">
                <img
                  src={
                    item.type === "pdf"
                      ? "/src/assets/PDF.svg"
                      : "/src/assets/Youtube.svg"
                  }
                  alt={item.type}
                  className="w-14 h-14"
                />
                <span className="text-[#7EC34B] text-sm font-semibold capitalize mt-1">
                  {item.type}
                </span>
              </div>
              <div className="flex items-center justify-center">
                <button
                  onClick={() => setSelectedModule(item)}
                  className="bg-[#7EC34B] text-white text-lg font-medium rounded-md px-4 py-1 shadow hover:bg-[#bee1a5] hover:text-[#7EC34B] hover:font-bold"
                >
                  Learn
                </button>
              </div>
            </div>

            {/* Middle: Modul Name */}
            <h3 className="text-xl font-semibold text-[#7EC34B] text-left w-full border-y-2 border-[#7EC34B] py-1 px-6">
              {item.name}
            </h3>

            {/* Bottom: Description */}
            <p className="text-xs text-[#7EC34B] text-left px-6 pb-4">
              {item.info}
            </p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedModule && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-[999999]">
          <div className="bg-white rounded-xl p-4 max-w-2xl w-full relative ">
            {/* Tombol Close */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-4 text-black text-xl font-bold"
            >
              &times;
            </button>

            <h2 className="text-lg font-semibold mb-2 text-center text-[#1975a6]">
              {selectedModule.name}
            </h2>

            {/* Konten Embedded */}
            {selectedModule.type === "pdf" ? (
              <iframe
                src={selectedModule.url}
                title="PDF Document"
                className="w-full h-96"
              ></iframe>
            ) : (
              <iframe
                src={getYoutubeEmbedUrl(selectedModule.url)}
                title="Youtube Video"
                className="w-full h-96"
                allowFullScreen
              ></iframe>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MHOLearningModule;
