import { useState, useEffect, useCallback } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import Cookies from "js-cookie";
import CustomTable from "../../../components/CustomTable";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function Users() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState(""); // Added search filter
  const [isLoading, setIsLoading] = useState(false);
    // State for single filter dropdown
    const [filter, setFilter] = useState("");
  
  const token = Cookies.get("token");

  const navigate = useNavigate(); // Initialize navigate

  const fetchUsers = useCallback(
    async (page) => {
      if (!token) return;
      setIsLoading(true);

      const form = new URLSearchParams();

      // Added search filter
      form.append("search", search);


         // If-else condition based on filter value
         if (filter === "client") {
          form.append("is_buyer", "1");
          // Add any additional form data for "client"
        } else if (filter === "professional") {
          form.append("is_buyer", "0");
          // Add any additional form data for "bugery1"
        }
        else if (filter === "subscriber") {
          form.append("is_subscriber", "1");
          // Add any additional form data for "bugery1"
        }
        else if (filter === "agency") {
          form.append("is_company", "1");
          // Add any additional form data for "bugery1"
        }
           form.append("page", page);
           form.append("limit", 10); 
       
  
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/get-all-users`,
          form.toString(),
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
        
          }
        );
        setUsers(data.data);
        setTotalPages(data.pagination.totalPages);
      } catch (error) {
        console.error("Error fetching users:", error);
        setIsLoading(false);
      }
      setIsLoading(false);
    },
    [token, search, filter]
  );

  useEffect(() => {
    if (token) fetchUsers(currentPage);
  }, [token, currentPage, fetchUsers]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value); // Update filter state
  };


  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/detail/${id}`); // Redirect to detail page with ID
  };

  const columns = [
    {
      key: "flag",
      label: "Origin",
      render: (row) => (
        <div className="w-8 h-8">
          <img src={row.image || "default-avatar.png"} alt="Avatar" />
        </div>
      ),
      width: "w-12",
    },
    {
      key: "name",
      label: "Name",
      render: (row) => (
        <div title={row.name}>
          {row.name || "N/A"}
        </div>
      ),
      width: "w-70",
    },
    {
      key: "email",
      label: "Email",
      render: (row) => (
        <div title={row.email}>
          {row.email || "N/A"}
        </div>
      ),
      width: "w-52",
    },
    {
      key: "mobile",
      label: "Mobile",
      render: (row) => (
        <div title={row.mobile}>
          {row.mobile || "N/A"}
        </div>
      ),
      width: "w-48",
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <div>{row.is_verified ? "Verified" : "Unverified"}</div>
      ),
      width: "w-32",
    },
    {
      key: "wallet",
      label: "Wallet Balance",
      render: (row) => (
        <div>${row.wallet}</div>
      ),
      width: "w-32",
    },
  ];

  return (
    <Card>
       <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h5" color="blue-gray">
              Users List
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              View the current active users
            </Typography>
          </div>
          <div className="flex gap-2">
          <select
              onChange={handleFilterChange}
              value={filter}
              className="p-2 border rounded"
            >
              <option value="">Select Filter</option>
              <option value="client">Client</option>
              <option value="professional">professional</option>
              <option value="subscriber">Subscriber</option>
              <option value="agency">Agency</option>
            </select>
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search by name"
              className="p-2 border rounded"
            />
            <Button variant="gradient" >
              Search
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardBody>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <CustomTable
            columns={columns}
            data={users}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        )}
      </CardBody>

      <CardFooter className="flex justify-between">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>

        <div className="flex items-center gap-2">
          {currentPage > 3 && (
            <>
              <IconButton
                variant="text"
                size="sm"
                onClick={() => setCurrentPage(1)}
              >
                1
              </IconButton>
              {currentPage > 4 && <p>...</p>}
            </>
          )}

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = Math.max(1, currentPage - 2) + i;
            if (page > totalPages) return null;
            return (
              <IconButton
                key={page}
                variant="text"
                size="sm"
                onClick={() => setCurrentPage(page)}
                disabled={currentPage === page}
              >
                {page}
              </IconButton>
            );
          })}

          {currentPage < totalPages - 2 && (
            <>
              {currentPage < totalPages - 3 && <p>...</p>}
              <IconButton
                variant="text"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
              >
                {totalPages}
              </IconButton>
            </>
          )}
        </div>

        <Button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </CardFooter>
    </Card>
  );
}

export default Users;
