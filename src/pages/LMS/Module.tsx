
import React, { useState } from 'react';
import PageMeta from '../../components/common/PageMeta';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';

const items = [
  {
    title: 'PENGENALAN MODULE ',

  },
  {
    title: 'PERKENALAN PROGRESSIVE WEB ',

  },
];



const VerticalCardList = () => {
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

  const toggleDropdown = (index) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };
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
            className="bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition duration-200 relative"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{item.title}</h2>
              </div>

              {/* Dropdown Toggle */}
              <div className="relative">
                <button
                  onClick={() => toggleDropdown(index)}
                  className="text-gray-500 hover:text-gray-700 text-lg"
                >
                  ▼
                </button>

                {/* Dropdown Menu */}
                {openDropdownIndex === index && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow z-10">
                    <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                      Edit
                    </button>
                    <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

  );
};

export default VerticalCardList;

