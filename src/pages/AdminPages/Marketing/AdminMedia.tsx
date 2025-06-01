import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";

const mediaItems = [
  {
    name: "Brosur A",
    category: "Media 1",
    date: "April 23, 2025",
    time: "3:27 PM",
  },
];

export default function AdminMedia() {
  return (
    <div>
      <PageMeta
        title="React.js Form Elements Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Form Elements  Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="FAQ" />

      <div className="min-h-screen w-full p-6 bg-white flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold">All Media</div>
          <div className="relative">
            <button className="flex items-center px-3 py-1 border rounded-md text-sm">
              {/* File Types <ChevronDown className="ml-1 w-4 h-4" /> */}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded shadow border mt-4">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 font-medium">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Time</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {mediaItems.map((item, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">{item.category}</td>
                  <td className="px-4 py-2">{item.date}</td>
                  <td className="px-4 py-2">{item.time}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button className="px-2 py-1 text-xs bg-blue-500 text-white rounded">
                      View
                    </button>
                    <button
                      className="px-2 py-1 text-xs bg-gray-300 rounded"
                      disabled
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
