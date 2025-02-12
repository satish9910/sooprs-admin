import { useState, useEffect } from "react";
import {  Button, Card, CardBody, CardFooter, CardHeader, Chip, IconButton, Input, Tooltip, Typography } from "@material-tailwind/react";
import { PencilIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import Cookies from "js-cookie";

function Leads() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const tokenFromCookies = Cookies.get("token");
    setToken(tokenFromCookies);
  }, []);

  useEffect(() => {
    if (token) {
      fetchLeads(currentPage);
    }
  }, [token, currentPage]);

  const fetchLeads = async (page) => {
    if (!token) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/leads?page=${page}&perPage=5`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMembers(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

const TABLE_ROWS = members.map((lead) => {
    const {
        project_title,
        min_budget,
        max_budget_amount,
        description,
        email,
        mobile,
        service,
        professional: { name, flag },
    } = lead;

    return (
      <tr key={lead.id}>
        <td className="p-4">
          <Typography variant="small" color="blue-gray" className="font-normal">
            <div className="w-10 h-10 ">
           <img src={flag} />
           </div>
          </Typography>
        </td>
        <td className="p-4">
          <Typography variant="small" color="blue-gray" className="font-normal">
            {project_title}
          </Typography>
        </td>
        <td className="p-4">
          <Typography variant="small" color="blue-gray" className="font-normal">
            {name}
          </Typography>
        </td>
        <td className="p-4">
          <Typography variant="small" color="blue-gray" className="font-normal">
            {email}
          </Typography>
          <Typography variant="small" color="blue-gray" className="font-normal">
            {mobile}
          </Typography>
        </td>
        <td className="p-4">
          <Typography variant="small" color="blue-gray" className="font-normal">
            {min_budget} - {max_budget_amount}
          </Typography>
        </td>
        <td className="p-4">
          <Typography variant="small" color="blue-gray" className="font-normal">
            {service.service_name.slice(0, 50)}...
          </Typography>
        </td>
        
        {/* <td className="p-4">
          <Chip
            variant="ghost"
            size="sm"
            value={project_status === 1 ? "Active" : "Inactive"}
            color={project_status === 1 ? "green" : "blue-gray"}
          />
        </td> */}
        {/* <td className="p-4">
          <Typography variant="small" color="blue-gray" className="font-normal">
            {bid_count} bids
          </Typography>
        </td> */}
        <td className="p-4">
          <Tooltip content="Edit Lead">
            <IconButton variant="text">
              <PencilIcon className="h-4 w-4" />
            </IconButton>
          </Tooltip>
        </td>
      </tr>
    );
  });

  return (
    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              Leads List
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              View the current active leads
            </Typography>
          </div>
          <Button variant="gradient">Add New Lead</Button>
        </div>
      </CardHeader>

      <CardBody>
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-left">
            <thead>
              <tr>
                <th className="px-4 py-2">Country Flag</th>
                <th className="px-4 py-2">Project Title</th>
                <th className="px-4 py-2">Client Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Budget</th>
                <th className="px-4 py-2">Service Name</th>
                {/* <th className="px-4 py-2">Status</th> */}
                {/* <th className="px-4 py-2">Bids</th> */}
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>{TABLE_ROWS}</tbody>
          </table>
        </div>
      </CardBody>

      <CardFooter className="flex justify-between">
        <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </Button>
        <Typography variant="small" color="blue-gray" className="font-normal">
          Page {currentPage} of {totalPages}
        </Typography>
        <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </Button>
      </CardFooter>
    </Card>
  );
}

export default Leads;
