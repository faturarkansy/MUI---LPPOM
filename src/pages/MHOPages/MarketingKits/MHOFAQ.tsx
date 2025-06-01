import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";

const items = [
  {
    title: "SUBJECT 1",
    description: "Dokumen brosur terbaru untuk klien.",
    date: "April 23, 2025",
    time: "3:27 PM",
  },
  {
    title: "SUBJECT 2",
    description: "Materi presentasi produk unggulan.",
    date: "May 1, 2025",
    time: "10:00 AM",
  },
];

const MHOFAQ = () => {
  return (
    <div>
      <PageMeta
        title="React.js Form Elements Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Form Elements  Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="FAQ" />
      <div className="p-4 max-w-3xl mx-auto flex flex-col space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition duration-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {item.title}
                </h2>
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
              </div>
              <span className="text-sm text-gray-500 whitespace-nowrap">
                {item.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MHOFAQ;
