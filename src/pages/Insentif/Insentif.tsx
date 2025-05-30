import React from 'react';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';

const items = [
  {
    title: 'JHONATHAN 1',
    company: 'PT Nusantara teknologi',
    scale: 'Medium Enterprise',
    officer: 'REG-20251220-A4',
    fee: 'Rp. 5.000.000'
  },
  {
    title: 'JHONATHAN 1',
    company: 'PT Nusantara teknologi',
    scale: 'Medium Enterprise',
    officer: 'REG-20251220-A4',
    fee: 'Rp. 8.000.000'
  },
];

const Insentif = () => {
  return (
    <div>
      <PageMeta
        title="React.js Form Elements Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Form Elements  Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="FAQ" />
      <div className="max-w-3xl mx-auto flex flex-col space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition duration-200"
          >
            <div className="flex items-center">
              <div className="w-14 h-14 flex items-center justify-center mr-4">
                <span className="inline-block w-4 h-4 bg-green-500 rounded-full"></span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{item.title}</h2>
                <p className="text-sm text-gray-600 mt-1">{item.company}</p>
                <p className="text-sm text-gray-600 mt-1">{item.scale}</p>
                <p className="text-sm text-gray-600 mt-1">{item.officer}</p>
              </div>

            </div>
            <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
              <span></span>
              <div className="space-x-2">
                <p className="text-sm text-gray-600 mt-1">Total Fee</p>
                <h2 className="text-lg font-semibold text-gray-800">{item.fee}</h2>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Insentif;


