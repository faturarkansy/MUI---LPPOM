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
      <div className="mt-3">
        {modules.length === 0 ? (
          <p className="text-center text-gray-500 text-sm sm:text-base my-20">
            Modul Pembelajaran Belum Tersedia
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {modules.map((item) => (
              <div
                key={item.id}
                className="border-1 bg-white border-gray-400 rounded-xl flex flex-col items-center shadow-sm"
              >
                {/* Top Row: Icon + Type + Learn Button */}
                <div className="grid grid-cols-2 w-full px-3 sm:px-6 py-4">
                  <div className="flex flex-col items-center">
                    <img
                      src={getIconByType(item.type)}
                      alt={item.type}
                      className="w-10 h-10 sm:w-14 sm:h-14"
                    />
                    <span className="text-black text-xs sm:text-sm font-semibold capitalize mt-1">
                      {item.type}
                    </span>
                  </div>
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => setSelectedModule(item)}
                      className="bg-black text-white text-sm sm:text-lg font-medium rounded-md px-3 sm:px-4 py-1 shadow hover:bg-[#bee1a5] hover:text-black hover:font-bold"
                    >
                      Learn
                    </button>

                  </div>
                </div>

                {/* Middle: Modul Name */}
                <h3 className="text-base sm:text-xl font-semibold text-black text-left w-full border-y border-black py-1 px-4 sm:px-6">
                  {item.name}
                </h3>

                {/* Bottom: Description */}
                <p className="text-[10px] sm:text-xs text-black text-left px-4 sm:px-6 py-4">
                  {item.info}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>


      {showPostTestButton && (
        <div className="flex justify-center mt-3">
          <button
            onClick={() => navigate("/post-test")}
            className="bg-black border-2 border-black text-white text-xs sm:text-sm font-bold sm:py-2 py-1.5 sm:px-3 px-2 rounded-md shadow hover:bg-gray-400 hover:text-black"
          >
            Go to Post-Test
          </button>
        </div>
      )}

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
