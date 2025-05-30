import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
// import TableUser from "../../components/tables/BasicTables/UserTable";
// import ComponentCardUser from "../../components/common/ComponentCardUser";
// import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
export default function BasicTables() {
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="User" />
      {/* <ToastContainer />
      <div className="space-y-6">
        <ComponentCardUser title="User Management" onAdd={() => console.log('Add button clicked')}>
          <TableUser />
        </ComponentCardUser>
      </div> */}
    </>
  );
}
