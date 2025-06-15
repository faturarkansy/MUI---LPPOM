import { useEffect, useState } from "react";
import axiosClient from "../../../axios-client";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import { useNavigate } from "react-router-dom";
import YoutubeIcon from "../../../../src/icons/youtube-icon.svg";
import PDFIcon from "../../../../src/icons/pdf-icon.svg";

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
  const [showPostTestButton, setShowPostTestButton] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClient.get("/exam-media");
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

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const storedUser = localStorage.getItem("USER");
        if (!storedUser) return;

        const user = JSON.parse(storedUser);
        const userId = user.id;

        const response = await axiosClient.get(`/users/${userId}`);
        const { tnc_accept_at, test_passed_at } = response.data;

        if (!tnc_accept_at || !test_passed_at) {
          setShowPostTestButton(true);
        }
      } catch (error) {
        console.error("Error fetching user status:", error);
      }
    };

    checkUserStatus();
  }, []);

  // Fungsi untuk icon modul
  const getIconByType = (type: string) => {
    switch (type) {
      case "pdf":
        return PDFIcon;
      case "youtube":
      default:
        return YoutubeIcon;
    }
  };


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
      <div className="mt-6">
        {modules.length === 0 ? (
          <p className="text-center text-gray-500 text-sm sm:text-base my-20">
            Modul Pembelajaran Belum Tersedia
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col"
              >
                {/* Top: Icon + Type + Button */}
                <div className="flex justify-between items-center px-5 py-4">
                  <div className="flex flex-col items-center">
                    <img
                      src={getIconByType(item.type)}
                      alt={item.type}
                      className="w-12 h-12 sm:w-14 sm:h-14"
                    />
                    <span className="text-xs sm:text-sm font-semibold text-gray-700 capitalize mt-1">
                      {item.type}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedModule(item)}
                    className="bg-[#1975a6] text-white text-xs sm:text-sm font-medium rounded-lg px-4 py-1.5 hover:bg-[#145a86] transition"
                  >
                    Pelajari
                  </button>
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-semibold text-black border-y border-gray-200 px-5 py-2 truncate">
                  {item.name}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-gray-700 px-5 py-4 line-clamp-4">
                  {item.info}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {showPostTestButton && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => navigate("/post-test")}
            className="bg-black border border-black text-white text-sm sm:text-base font-semibold px-4 py-2 rounded-md hover:bg-white hover:text-black transition"
          >
            Lanjut ke Post-Test
          </button>
        </div>
      )}

      {/* Modal */}
      {selectedModule && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[999999] px-4">
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg w-full max-w-3xl relative">
            {/* Tombol Close */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-4 text-black text-2xl font-bold hover:text-red-500"
            >
              &times;
            </button>

            <div className="p-6 pt-10">
              <h2 className="text-xl font-semibold text-center text-[#1975a6] mb-4">
                {selectedModule.name}
              </h2>

              {selectedModule.type === "pdf" ? (
                <iframe
                  src={selectedModule.url}
                  title="PDF Modul"
                  className="w-full h-[450px]"
                />
              ) : (
                <iframe
                  src={getYoutubeEmbedUrl(selectedModule.url)}
                  title="Video Modul"
                  className="w-full h-[450px]"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MHOLearningModule;
