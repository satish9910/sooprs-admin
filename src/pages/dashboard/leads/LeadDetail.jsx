import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Toaster from "../../../components/Toaster";
import { showSuccessToast, showErrorToast } from "../../../components/Toaster";
import {
  Card,
  Input,
  Button,
  Typography,
  Textarea,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import Cookies from "js-cookie";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import NormalTable from "../../../components/NormalTable";

function LeadDetail() {
  const { id } = useParams(); // Get ID from URL
  const [lead, setLead] = useState({
    project_title: "",
    min_budget: "",
    max_budget_amount: "",
    service_name: "",
    description: "",
  });

  const [bids, setBids] = useState([]);
  const [user, setUser] = useState([]);
  const token = Cookies.get("token");

  const fetchLeadDetails = useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/lead/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      //   console.log("Lead details:", response.data.data.bids);
      setLead(response.data.data);
      const fetchedBids = response.data.data.bids.map((bid) => ({
        professional: {
          name: bid.professional.name || "Unknown",
          image: bid.professional.image || "/default-avatar.png",
        },
        amount: bid.amount || 0,
        description: bid.description || "No description provided",
        status: bid.status || 0, // Assuming 1 = Completed, 0 = Pending
      }));

      const fetchseeUser = response.data.data.users.map((user) => ({
        professional: {
          name: user.professional.name || "Unknown",
          image: user.professional.image || "/default-avatar.png",
        },
        email: user.professional.email || "No email provided",
        mobile: user.professional.mobile || "No mobile provided",
        Credit: user.cost || 0,
        "Date & Time":
          new Date(user.created_at).toLocaleString() || "No creation date",
      }));

      setBids(fetchedBids);
      setUser(fetchseeUser);
    } catch (error) {
      console.error("Error fetching lead details:", error);
    }
  }, [token, id]);

  useEffect(() => {
    fetchLeadDetails();
  }, [id, token, fetchLeadDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLead((prevLead) => ({ ...prevLead, [name]: value }));
  };

  console.log("Lead:", lead);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { id, project_title, min_budget, max_budget_amount, description } =
      lead;

    const params = new URLSearchParams();
    params.append("id", id);
    params.append("title", project_title);
    params.append("min", min_budget);
    params.append("max", max_budget_amount);
    params.append("description", description);

    try {
      await axios.put(`${import.meta.env.VITE_BASE_URL}/lead`, params, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded", // Correct content type for URLSearchParams
        },
      });
      showSuccessToast("Lead updated successfully!"); // Trigger success toast
    } catch (error) {
      console.error("Error updating lead:", error);
      showErrorToast("Failed to update lead");
    }
  };

  return (
    <>
      <Toaster />
      <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card
          color="transparent"
          shadow={false}
          className="p-6 border border-gray-300 shadow-sm  rounded-2xl "
        >
          <Typography variant="h4" color="blue-gray">
            Update Lead
          </Typography>
          <form onSubmit={handleUpdate} className="mt-4 w-full max-w-lg ">
            <div className="mb-4">
              <Typography variant="h6">Project Title</Typography>
              <Input
                size="lg"
                name="project_title"
                className=" !border-t-gray-700 focus:!border-t-gray-900"
                value={lead.project_title}
                onChange={handleChange}
                placeholder="Enter Project Title"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Typography variant="h6">Min Budget</Typography>
                <Input
                  type="number"
                  size="lg"
                  name="min_budget"
                  className=" !border-t-gray-500 focus:!border-t-gray-900"
                  value={lead.min_budget}
                  onChange={handleChange}
                  placeholder="Min Budget"
                />
              </div>
              <div>
                <Typography variant="h6">Max Budget</Typography>
                <Input
                  type="number"
                  size="lg"
                  name="max_budget_amount"
                  className=" !border-t-gray-700 focus:!border-t-gray-900"
                  value={lead.max_budget_amount}
                  onChange={handleChange}
                  placeholder="Max Budget"
                />
              </div>
            </div>

            <div className="mb-4">
              <Typography variant="h6">Description</Typography>
              <Textarea
                name="description"
                className=" !border-t-gray-700 focus:!border-t-gray-900"
                value={lead.description}
                onChange={handleChange}
                placeholder="Enter Description"
              />
            </div>
            <Button type="submit" className="mt-4" fullWidth>
              Update Lead
            </Button>
          </form>
        </Card>

        <Card className="border border-gray-300 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 p-6"
          >
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Get Contect List
            </Typography>
          </CardHeader>
          <CardBody className="pt-0">
            <NormalTable data={user} />
          </CardBody>
        </Card>

        <Card className="xl:col-span-2 border border-gray-300 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between p-6"
          >
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-1">
                All Bids
              </Typography>
            </div>
            <Menu placement="left-start">
              <MenuHandler>
                <IconButton size="sm" variant="text" color="blue-gray">
                  <EllipsisVerticalIcon
                    strokeWidth={3}
                    fill="currenColor"
                    className="h-6 w-6"
                  />
                </IconButton>
              </MenuHandler>
              <MenuList>
                <MenuItem>Action</MenuItem>
                <MenuItem>Another Action</MenuItem>
                <MenuItem>Something else here</MenuItem>
              </MenuList>
            </Menu>
          </CardHeader>
          <CardBody className=" px-0 pt-0 pb-2">
            <NormalTable data={bids} />
          </CardBody>
        </Card>
      </div>
    </>
  );
}

export default LeadDetail;
