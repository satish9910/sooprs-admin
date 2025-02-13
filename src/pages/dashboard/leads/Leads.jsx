import { useState, useEffect } from "react";
import { Button, Card, CardBody, CardFooter, CardHeader, IconButton, Typography } from "@material-tailwind/react";
import axios from "axios";
import Cookies from "js-cookie";
import CustomTable from "../../../components/CustomTable";
import { useNavigate } from "react-router-dom"; // Import useNavigate


function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const token = Cookies.get("token");

  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    if (token) fetchLeads(currentPage);
  }, [token, currentPage]);

  const fetchLeads = async (page) => {
    if (!token) return;
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/leads?page=${page}&perPage=5`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLeads(data.data);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteLead = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/leads/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeads(leads.filter((lead) => lead.id !== id));
    } catch (error) {
      console.error("Error deleting lead:", error);
    }
  };


  const handleEdit = (id) => {
    navigate(`/detail/${id}`); // Redirect to detail page with ID
  };




  const columns = [
    { key: "flag", label: "Origin", render: (row) => <div className="w-8 h-8"> <img src={row.professional?.flag} alt="Flag" /> </div>, width: "w-12" },
    { key: "project_title", label: "Project Title", render: (row) => row.project_title.slice(0, 20) + "...", width: "w-70" },
    { key: "professional.name", label: "Client Name", render: (row) => row.professional?.name || "N/A", width: "w-52" },
    { key: "email", label: "Email & Mobile", render: (row) => (<>{row.email} <br /> {row.mobile}</>), width: "w-48" },
    { key: "budget", label: "Budget", render: (row) => `$${row.min_budget} - $${row.max_budget_amount}`, width: "w-70" },
    { key: "service.service_name", label: "Service Name", render: (row) => row.service?.service_name?.slice(0, 50) + "...", width: "w-56" },
    { key: "bid_count", label: "Bids", width: "w-20" },
    { key: "mobile_count", label: "Mobile Count", width: "w-24" },
  ];

return (
    <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <Typography variant="h5" color="blue-gray">Leads List</Typography>
                    <Typography color="gray" className="mt-1 font-normal">
                        View the current active leads
                    </Typography>
                </div>
                <Button variant="gradient">Add New Lead</Button>
            </div>
        </CardHeader>

        <CardBody>
            <CustomTable columns={columns} data={leads} onDelete={deleteLead} onEdit={handleEdit} />
        </CardBody>

        <CardFooter className="flex justify-between">
  <Button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
    Previous
  </Button>

  <div className="flex items-center gap-2">
    {currentPage > 3 && (
      <>
        <IconButton variant="text" size="sm" onClick={() => setCurrentPage(1)}>
          1
        </IconButton>
        {currentPage > 4 && <p>...</p>}
      </>
    )}

    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
      const page = Math.max(1, currentPage - 2) + i;
      if (page > totalPages) return null;
      return (
        <IconButton key={page} variant="text" size="sm" onClick={() => setCurrentPage(page)} disabled={currentPage === page}>
          {page}
        </IconButton>
      );
    })}

    {currentPage < totalPages - 2 && (
      <>
        {currentPage < totalPages - 3 && <p>...</p>}
        <IconButton variant="text" size="sm" onClick={() => setCurrentPage(totalPages)}>
          {totalPages}
        </IconButton>
      </>
    )}
  </div>

  <Button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
    Next
  </Button>
</CardFooter>

    </Card>
);
}

export default Leads;