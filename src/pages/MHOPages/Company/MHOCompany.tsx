import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import axiosClient from "../../../axios-client";
import { useEffect, useState } from "react";
import { DotsIcon } from "../../../icons";

export default function MHOCompany() {
  const [companiesData, setCompaniesData] = useState<any[]>([]);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await axiosClient.get("/ext/companies");
        setCompaniesData(response.data.data);
        console.log("Company data fetched successfully:", response.data.data);
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    };
    fetchCompanyData();
  }, []);

  return (
    <div>
      <PageBreadcrumb pageTitle="Pelaku Usaha" />
      <div className="mt-6 rounded-lg shadow-sm overflow-hidden">
        {/* <p>This is the MHO Company page.</p> */}

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Perusahaan
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                NIB
              </th>
              {/* <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Alamat
              </th> */}
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Kontak
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Skala Bisnis
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Lokasi
              </th>
              {/* <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              ></th> */}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {companiesData.length > 0 &&
              companiesData.map((company) => (
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {company.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{company.nib}</div>
                  </td>
                  {/* <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {company.attr.address}
                    </div>
                  </td> */}
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {company.attr.phone}
                    </div>
                    <div className="text-sm text-gray-500">
                      {company.attr.email}
                    </div>
                    <div className="text-sm text-gray-500">
                      {company.attr.fax}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {/* <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {company.business_scale.name}
                    </span> */}
                    <span className="px-2 inline-flex text-sm leading-5 text-gray-900">
                      {company.business_scale.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {company.location.name}
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      aria-label="company-menus"
                      className="p-2 bg-gray-400 rounded-lg"
                    >
                      <DotsIcon />
                    </button>
                  </td> */}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
